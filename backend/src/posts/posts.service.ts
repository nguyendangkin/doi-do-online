import {
  ForbiddenException,
  Injectable,
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

  async getPosts(user) {
    const foundUser = await this.usersService.findOneUserByEmail(user.email);

    if (!foundUser) {
      throw new Error('Không thấy user');
    }

    return this.postsRepository.find({
      where: { user: { id: foundUser.id } },
    });
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
}
