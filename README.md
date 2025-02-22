## Giới Thiệu

Trang web **Đổi Hàng Tốt** là một nền tảng cho phép người dùng đăng bài và trao đổi hàng hóa với nhau thông qua việc nhắn tin. Ý tưởng chính của trang web là tạo ra một cộng đồng nơi mọi người có thể dễ dàng tìm thấy sản phẩm ưng ý và trao đổi mà không cần sử dụng tiền.

## Tính Năng Chính

-   **Đăng Bài**: Người dùng có thể đăng bài về sản phẩm họ muốn trao đổi, bao gồm thông tin chi tiết và hình ảnh.
-   **Tìm Kiếm Sản Phẩm**: Người dùng có thể tìm kiếm sản phẩm theo danh mục hoặc từ khóa.
-   **Nhắn Tin**: Khi tìm thấy sản phẩm ưng ý, người dùng có thể nhắn tin trực tiếp với người đăng bài để thỏa thuận trao đổi.
-   **Quản Lý Tài Khoản**: Người dùng có thể cập nhật thông tin cá nhân và quản lý các bài đăng của mình.

## Cách Sử Dụng

1. **Đăng Ký/Đăng Nhập**: Tạo tài khoản hoặc đăng nhập để bắt đầu sử dụng các tính năng của trang web.
2. **Đăng Bài**: Chọn danh mục phù hợp và đăng bài về sản phẩm bạn muốn trao đổi.
3. **Tìm Kiếm**: Sử dụng công cụ tìm kiếm để tìm sản phẩm bạn quan tâm.
4. **Nhắn Tin**: Liên hệ với người đăng bài để thỏa thuận trao đổi.

## Danh Mục Sản Phẩm Cơ Bản

-   **Thực Phẩm & Đồ Uống**
-   **Phương Tiện Di Chuyển**
-   **Sản Phẩm Sức Khỏe**
-   **Văn Phòng Phẩm**
-   **Dụng Cụ Nhà Cửa**
-   **Thời Trang**
-   **Máy Tính & Linh Kiện**
-   **Trang Sức**
-   **Đồ Chơi**

## Công Nghệ Sử Dụng

### Frontend

-   **React**: Thư viện JavaScript để xây dựng giao diện người dùng.
-   **Redux Toolkit**: Quản lý trạng thái ứng dụng.
-   **React Router DOM**: Điều hướng trong ứng dụng.
-   **Tailwind CSS**: Framework CSS để thiết kế giao diện.
-   **Vite**: Công cụ build và phát triển ứng dụng nhanh chóng.
-   **Axios**: Thư viện để thực hiện các yêu cầu HTTP.
-   **Socket.IO Client**: Thư viện để kết nối real-time với server.
-   **Zod**: Thư viện validation dữ liệu.
-   **React Hook Form**: Quản lý form trong React.

### Backend

-   **NestJS**: Framework Node.js để xây dựng ứng dụng server-side.
-   **TypeORM**: ORM để quản lý cơ sở dữ liệu.
-   **PostgreSQL**: Hệ quản trị cơ sở dữ liệu quan hệ.
-   **Passport**: Thư viện xác thực và ủy quyền.
-   **Socket.IO**: Thư viện để hỗ trợ real-time communication.
-   **JWT (JSON Web Tokens)**: Quản lý xác thực người dùng.
-   **Bcrypt**: Mã hóa mật khẩu.
-   **Multer**: Xử lý tải lên file.
-   **Sharp**: Xử lý ảnh.

### Dev Tools

-   **ESLint**: Kiểm tra và fix lỗi code.
-   **Prettier**: Định dạng code.
-   **Jest**: Testing framework.
-   **TypeScript**: Ngôn ngữ lập trình để phát triển ứng dụng.

## Kéo Về và Triển Khai

### 1. Clone Repository

Đầu tiên, hãy clone repository về máy của bạn:

```bash
git clone https://github.com/nguyendangkin/doi-do-online
cd doi-hang-tot
```

### 2. Cài Đặt Backend

Di chuyển vào thư mục `backend` và cài đặt các dependencies:

```bash
cd backend
npm install
```

### 3. Cài Đặt Frontend

Di chuyển vào thư mục `frontend` và cài đặt các dependencies:

```bash
cd ../frontend
npm install
```

### 4. Tạo Database

Tạo một database trong PostgreSQL với các thông tin sau:

-   **Host**: `localhost`
-   **Port**: `5432`
-   **Username**: `postgres`
-   **Password**: `12345`
-   **Database Name**: `doidoonline`

Bạn có thể sử dụng công cụ như pgAdmin hoặc chạy lệnh SQL sau để tạo database:

```sql
CREATE DATABASE doidoonline;
```

### 5. Chạy Backend

Sau khi cài đặt xong, bạn có thể chạy backend với lệnh:

```bash
npm run start:dev
```

### 6. Chạy Frontend

Trong thư mục `frontend`, chạy lệnh sau để khởi động frontend:

```bash
npm run dev
```

### 7. Truy Cập Ứng Dụng

Mở trình duyệt và truy cập vào địa chỉ `http://localhost:5173` để xem ứng dụng.
