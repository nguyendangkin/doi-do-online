import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/posts/dto/postDto.dto';
import { Posts } from 'src/posts/entity/post.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';

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
}
