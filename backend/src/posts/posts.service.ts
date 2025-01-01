import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/posts/dto/postDto.dto';
import { Posts } from 'src/posts/entity/post.entity';
import { Brackets, Repository } from 'typeorm';
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

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePaths = images.map((image) => {
      const fileExtension = path.extname(image.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, image.buffer);

      return `/uploads/${fileName}`;
    });

    return imagePaths;
  }

  async createPost(user, createPostData: CreatePostDto, images) {
    const imagePaths = await this.uploadImages(images);

    const post = this.postsRepository.create({
      content: createPostData.content,
      images: imagePaths,
      user: user.id,
      tag: createPostData.tag,
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

  async getAllPosts(
    page: number = 1,
    limit: number = 5,
    tag?: string,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .orderBy('post.createdAt', 'DESC');

    if (tag) {
      queryBuilder.andWhere('post.tag = :tag', { tag });
    }

    if (search?.trim()) {
      const searchTerms = search.trim().split(/\s+/);

      searchTerms.forEach((term, index) => {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(post.content) LIKE LOWER(:search' + index + ')', {
              ['search' + index]: `%${term}%`,
            }).orWhere('LOWER(post.tag) LIKE LOWER(:tagSearch' + index + ')', {
              ['tagSearch' + index]: `%${term}%`,
            });
          }),
        );
      });
    }

    const [items, total] = await queryBuilder
      .take(limit)
      .skip(skip)
      .getManyAndCount();

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
    const post = await this.postsRepository.findOne({
      where: { id: idPost },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại!');
    }

    if (post.user.id !== user.id && user.role !== Role.Admin) {
      throw new ForbiddenException('Bạn không có quyền cập nhật bài viết này!');
    }

    let finalImagePaths: string[] = [];

    if (existingImages && existingImages.length > 0) {
      finalImagePaths = [...existingImages];
    }

    if (newImages && newImages.length > 0) {
      const newImagePaths = await this.uploadImages(newImages);
      finalImagePaths = [...finalImagePaths, ...newImagePaths];
    }

    post.content = updatePostData.content || post.content;
    post.tag = updatePostData.tag || post.tag;
    post.images = finalImagePaths;

    return this.postsRepository.save(post);
  }

  async deletePost(idPost: number, user: { id: number; role: string }) {
    const post = await this.postsRepository.findOne({
      where: { id: idPost },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại!');
    }

    if (post.user.id !== user.id && user.role !== Role.Admin) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này!');
    }

    try {
      if (post.images && post.images.length > 0) {
        for (const imagePath of post.images) {
          try {
            const fullPath = path.join(
              process.cwd(),
              'uploads',
              path.basename(imagePath),
            );

            if (fs.existsSync(fullPath)) {
              await fs.promises.unlink(fullPath);
            }
          } catch (error) {
            console.error(`Error deleting image ${imagePath}:`, error);
          }
        }
      }

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
