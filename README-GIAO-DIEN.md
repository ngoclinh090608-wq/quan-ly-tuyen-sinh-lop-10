# Ba giao diện tuyển sinh lớp 10

## Phạm vi

Phác thảo tương tác cho UC19 (quản lý kết quả phúc khảo), UC20 (xét tuyển NV1–NV3), UC21 (học sinh gửi yêu cầu phúc khảo), theo đặc tả được cung cấp. Giữ màu chủ đạo `#1769E0`, nền `#F5F7FB`, font Arial và bố cục sidebar của dự án.

Đây là dữ liệu mẫu, được lưu bằng localStorage trong cùng trình duyệt và cùng địa chỉ website. Chưa triển khai đăng nhập, phân quyền, cơ sở dữ liệu, tải minh chứng lên máy chủ hoặc xét tuyển thực tế. Tên vai trò trên các trang dùng để minh họa tác nhân. Các mục menu cũ ngoài ba chức năng vẫn thuộc phạm vi dự án ban đầu.

## Các trang

- `pages/hoc-sinh/gui-yeu-cau-phuc-khao.php`
- `pages/hoi-dong-phuc-khao/quan-ly-ket-qua-phuc-khao.php`
- `pages/hoi-dong-tuyen-sinh/xet-tuyen.php`

Mở bằng địa chỉ HTTP của Wamp, không mở file PHP trực tiếp. Header tự nhận thư mục gốc nên hoạt động cả khi dự án nằm trong thư mục lồng nhau. Ba trang đã được liên kết trong sidebar. Đường dẫn include của dashboard cũng được sửa để đi từ trang đăng nhập tới dashboard.

## Dữ liệu đã có được chọn từ danh sách

| Thông tin | Cách sử dụng |
| --- | --- |
| Môn thi | Dropdown Toán, Ngữ văn, Tiếng Anh, lấy từ kết quả thi của học sinh |
| Yêu cầu phúc khảo | Dropdown có mã yêu cầu, họ tên, môn thi; hoặc nút chọn ngay trong bảng |
| Trạng thái xử lý | Dropdown tất cả, chờ xử lý, đã có kết quả |
| Trường THPT | Dropdown lọc kết quả trúng tuyển theo trường |
| Thí sinh, số báo danh, điểm trước, nguyện vọng, chỉ tiêu | Hiển thị từ dữ liệu, không nhập lại |

## Kiểm tra dữ liệu nhập

Các giới hạn độ dài, kích thước tệp và định dạng dưới đây là quy ước cho bản phác thảo vì đặc tả chưa đưa ra con số cụ thể.

| Trường / tình huống | Quy tắc và phản hồi |
| --- | --- |
| Môn / yêu cầu chưa chọn | Báo lỗi tại trường, đưa con trỏ về trường đầu tiên sai |
| Lý do | Bắt buộc; bỏ khoảng trắng đầu cuối; 10–1.000 ký tự; chặn ký tự điều khiển |
| Điểm sau phúc khảo | Bắt buộc; từ 0–10; tối đa hai số thập phân; chấp nhận `8.25` và `8,25`; chặn chữ, số mũ, số âm và ngoài phạm vi |
| Điểm không đổi | Không yêu cầu biên bản / minh chứng |
| Điểm thay đổi | Bắt buộc biên bản 10–2.000 ký tự và một minh chứng |
| Minh chứng | PDF, PNG, JPG/JPEG; không rỗng; tối đa 2 MB; kiểm tra phần mở rộng, MIME và chữ ký đầu tệp; có thể tải lại minh chứng đã lưu |
| Trùng môn phúc khảo | Không tạo thêm yêu cầu dù yêu cầu cũ đã có kết quả |
| Quá hạn / chưa công bố điểm | Không tiếp nhận yêu cầu |
| Chưa xử lý hết phúc khảo | Không cho chốt dữ liệu xét tuyển |
| Chưa kết thúc phúc khảo / chưa chốt điểm | Không chạy xét tuyển |
| Chỉ tiêu | Mỗi trường phải có số nguyên dương |
| Điểm và nguyện vọng xét tuyển | Điểm mẫu 0–30; đủ ba nguyện vọng khác nhau thuộc danh sách trường; số báo danh không trùng |
| Không lưu được / đầy bộ nhớ | Thông báo thất bại; giữ dữ liệu đã lưu trước đó và nội dung đang nhập |
| Dữ liệu thay đổi ở tab khác | Chặn lưu từ bản cũ, yêu cầu tải lại trang |
| Hủy ở hộp xác nhận | Không ghi dữ liệu |

## Trình tự thử

1. Trang học sinh: để trống và gửi; chọn Tiếng Anh để thử đăng ký trùng; chọn Toán hoặc Ngữ văn, nhập lý do hợp lệ rồi xác nhận gửi.
2. Trang hội đồng phúc khảo: yêu cầu vừa gửi xuất hiện trong bảng. Chọn yêu cầu bằng dropdown hoặc nút Cập nhật.
3. Nhập `abc`, `11`, `8.255` để thử lỗi điểm. Nhập điểm khác điểm gốc để kiểm tra yêu cầu biên bản và minh chứng. Nhập điểm bằng điểm gốc để thử nhánh không thay đổi.
4. Xử lý các yêu cầu còn chờ. Chuyển sang xét tuyển, chọn Hoàn tất phúc khảo và chốt điểm. Bước này đóng tiếp nhận yêu cầu trong dữ liệu mẫu.
5. Thực hiện xét tuyển; bộ dữ liệu có hai thí sinh cùng 25 điểm tại chỉ tiêu cuối THPT Nguyễn Trãi (nếu giữ nguyên điểm mẫu). Chọn A để nhận cả nhóm hoặc B để chỉ nhận nhóm điểm cao hơn. Quy tắc đồng điểm áp dụng ở từng lượt NV1, NV2 và NV3.
6. Kiểm tra danh sách dự kiến, lọc theo trường và xác nhận lưu. Tải lại trang để kiểm tra kết quả chính thức.
7. Chạy xét tuyển lại rồi hủy để kiểm tra kết quả chính thức trước đó được giữ nguyên.

Điểm xét tuyển trong bộ mẫu được giả định là tổng ba môn, không hệ số hay điểm ưu tiên. Khi sửa điểm phúc khảo, tổng điểm mẫu được điều chỉnh theo chênh lệch và dữ liệu cần được chốt lại. Kết quả xét tuyển chính thức lưu cả điểm tại thời điểm xét để giữ nguyên lịch sử. Quy tắc tính điểm thực tế cần được xác nhận khi làm backend.

Bộ dữ liệu ban đầu gồm 3 yêu cầu (2 chờ, 1 đã có kết quả), 11 thí sinh và 3 trường. Thời hạn mẫu là 7 ngày từ lần khởi tạo. Có thể khởi tạo lại bằng cách xóa riêng khóa `tuyensinh10.workflow.v1` của website trong bộ nhớ trình duyệt rồi tải lại; thao tác này xóa các thay đổi mẫu đã thử.

## Kiểm chứng

- PHP được kiểm tra cú pháp bằng PHP 5.2.6 của Wamp hiện có.
- JavaScript được kiểm tra cú pháp bằng Node.
- Kiểm tra thuật toán tự động: điểm hợp lệ / không hợp lệ, độ dài, điều kiện xét tuyển, ưu tiên NV1–NV3, hai phương án đồng điểm, vượt chỉ tiêu có xác nhận, không trúng tuyển và hủy.
- Kiểm tra trực tiếp trên trình duyệt: gửi thiếu dữ liệu / trùng môn / thành công; điểm ngoài phạm vi; thiếu minh chứng; lưu điểm không đổi và điểm thay đổi với tệp PNG; minh chứng và kết quả giữ sau tải lại; chặn xét tuyển trước chốt; xử lý đồng điểm; lưu kết quả chính thức; chặn gửi quá hạn.
- Kiểm tra chiều rộng 390 px cho cả ba trang: không tràn ngang toàn trang, bảng rộng cuộn trong khung và menu di động mở được.

Các ca mô phỏng bộ nhớ đầy, thiếu chỉ tiêu và dữ liệu nguyện vọng sai chưa được thao tác trực tiếp qua trình duyệt; điều kiện chỉ tiêu và nguyện vọng được kiểm tra bằng kiểm thử thuật toán.
