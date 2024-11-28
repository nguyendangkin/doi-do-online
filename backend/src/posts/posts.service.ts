import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/posts/dto/postDto.dto';
import { Posts } from 'src/posts/entity/post.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { UpdatePostDto } from 'src/posts/dto/updateDto.dto copy';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    private usersService: UsersService,
  ) {}

  async uploadImages(images: Array<Express.Multer.File>): Promise<string[]> {
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Tạo thư mục uploads nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePaths = images.map((image) => {
      const fileExtension = path.extname(image.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Ghi file vào hệ thống file
      fs.writeFileSync(filePath, image.buffer);

      // Trả về đường dẫn tương đối của file
      return `/uploads/${fileName}`;
    });

    return imagePaths;
  }

  async createPost(user, createPostData: CreatePostDto, images) {
    const imagePaths = await this.uploadImages(images); // Gọi hàm uploadImages

    const post = this.postsRepository.create({
      content: createPostData.content,
      images: imagePaths,
      user: user.id,
      tag: createPostData.tag, // Thêm tag vào post
    });

    return this.postsRepository.save(post);
  }

  async getPosts(user, page: number = 1, limit: number = 5) {
    const foundUser = await this.usersService.findOneUserByEmail(user.email);

    if (!foundUser) {
      throw new Error('Không thấy user');
    }

    const skip = (page - 1) * limit;

    const [items, total] = await this.postsRepository.findAndCount({
      where: { user: { id: foundUser.id } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getAllPosts(page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.postsRepository.findAndCount({
      relations: ['user'], // Include user information if needed
      order: {
        createdAt: 'DESC', // Sort by newest first
      },
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async updatePost(
    idPost: number,
    user: { id: number; role: string },
    updatePostData: UpdatePostDto,
    newImages: Array<Express.Multer.File>,
    existingImages: string[],
  ) {
    // Tìm bài viết theo id
    const post = await this.postsRepository.findOne({
      where: { id: idPost },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại!');
    }

    // Kiểm tra quyền
    if (post.user.id !== user.id && user.role !== Role.Admin) {
      throw new ForbiddenException('Bạn không có quyền cập nhật bài viết này!');
    }

    // Xử lý ảnh
    let finalImagePaths: string[] = [];

    // Thêm các ảnh hiện có vào danh sách cuối cùng
    if (existingImages && existingImages.length > 0) {
      finalImagePaths = [...existingImages];
    }

    // Upload và thêm các ảnh mới (nếu có)
    if (newImages && newImages.length > 0) {
      const newImagePaths = await this.uploadImages(newImages);
      finalImagePaths = [...finalImagePaths, ...newImagePaths];
    }

    // Cập nhật thông tin bài viết
    post.content = updatePostData.content || post.content;
    post.tag = updatePostData.tag || post.tag;
    post.images = finalImagePaths;

    // Lưu lại bài viết đã cập nhật
    return this.postsRepository.save(post);
  }

  async deletePost(idPost: number, user: { id: number; role: string }) {
    // Tìm bài viết theo id
    const post = await this.postsRepository.findOne({
      where: { id: idPost },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại!');
    }

    // Kiểm tra quyền - chỉ cho phép người tạo bài viết hoặc admin xóa
    if (post.user.id !== user.id && user.role !== Role.Admin) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này!');
    }

    try {
      // Xóa các file ảnh liên quan
      if (post.images && post.images.length > 0) {
        // Xóa từng file ảnh
        for (const imagePath of post.images) {
          try {
            // Lấy đường dẫn đầy đủ của file
            const fullPath = path.join(
              process.cwd(),
              'uploads',
              path.basename(imagePath),
            );

            // Kiểm tra file có tồn tại không
            if (fs.existsSync(fullPath)) {
              // Xóa file
              await fs.promises.unlink(fullPath);
            }
          } catch (error) {
            // Log lỗi nhưng không dừng quá trình xóa bài viết
            console.error(`Error deleting image ${imagePath}:`, error);
          }
        }
      }

      // Xóa bài viết từ database
      await this.postsRepository.remove(post);

      return {
        message: 'Xóa bài viết thành công',
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException('Có lỗi xảy ra khi xóa bài viết');
    }
  }
}
