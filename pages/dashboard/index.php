<?php
include 'components/layout/header.php';
?>

<section class="content">

    <div class="page-heading">
        <div>
            <h1>Tổng quan tuyển sinh</h1>
            <p>Xin chào! Đây là thông tin tổng quan của kỳ tuyển sinh lớp 10.</p>
        </div>

        <button class="primary-button">
            + Tạo mới
        </button>
    </div>


    <!-- THỐNG KÊ -->

    <div class="stat-grid">

        <div class="stat-card">
            <div class="stat-icon blue">HS</div>

            <div>
                <span>Tổng thí sinh</span>
                <h2>1,250</h2>
                <small>Hồ sơ đã đăng ký</small>
            </div>
        </div>


        <div class="stat-card">
            <div class="stat-icon green">NV</div>

            <div>
                <span>Nguyện vọng</span>
                <h2>3,420</h2>
                <small>Nguyện vọng đã đăng ký</small>
            </div>
        </div>


        <div class="stat-card">
            <div class="stat-icon orange">PT</div>

            <div>
                <span>Phòng thi</span>
                <h2>42</h2>
                <small>Phòng thi đã tạo</small>
            </div>
        </div>


        <div class="stat-card">
            <div class="stat-icon purple">TT</div>

            <div>
                <span>Trường THPT</span>
                <h2>18</h2>
                <small>Trường tham gia tuyển sinh</small>
            </div>
        </div>

    </div>


    <!-- NỘI DUNG BÊN DƯỚI -->

    <div class="dashboard-grid">

        <div class="panel">

            <div class="panel-header">
                <div>
                    <h3>Tiến độ tuyển sinh</h3>
                    <p>Các công việc trong kỳ tuyển sinh</p>
                </div>

                <a href="#">Xem tất cả</a>
            </div>


            <div class="process-list">

                <div class="process-row">

                    <div class="process-number done">
                        ✓
                    </div>

                    <div class="process-info">
                        <strong>Tiếp nhận hồ sơ</strong>
                        <span>Đã hoàn thành</span>
                    </div>

                    <span class="status success">
                        Hoàn thành
                    </span>

                </div>


                <div class="process-row">

                    <div class="process-number">
                        2
                    </div>

                    <div class="process-info">
                        <strong>Phân phòng thi</strong>
                        <span>Đang thực hiện</span>
                    </div>

                    <span class="status processing">
                        Đang xử lý
                    </span>

                </div>


                <div class="process-row">

                    <div class="process-number">
                        3
                    </div>

                    <div class="process-info">
                        <strong>Tổ chức thi</strong>
                        <span>Chưa bắt đầu</span>
                    </div>

                    <span class="status waiting">
                        Chờ thực hiện
                    </span>

                </div>


                <div class="process-row">

                    <div class="process-number">
                        4
                    </div>

                    <div class="process-info">
                        <strong>Chấm thi và nhập điểm</strong>
                        <span>Chưa bắt đầu</span>
                    </div>

                    <span class="status waiting">
                        Chờ thực hiện
                    </span>

                </div>


                <div class="process-row">

                    <div class="process-number">
                        5
                    </div>

                    <div class="process-info">
                        <strong>Xét tuyển</strong>
                        <span>Chưa bắt đầu</span>
                    </div>

                    <span class="status waiting">
                        Chờ thực hiện
                    </span>

                </div>

            </div>

        </div>


        <div class="panel">

            <div class="panel-header">
                <div>
                    <h3>Thông báo</h3>
                    <p>Thông tin mới nhất</p>
                </div>
            </div>


            <div class="notice-list">

                <div class="notice-item">
                    <div class="notice-dot"></div>

                    <div>
                        <strong>Lịch thi tuyển sinh lớp 10</strong>
                        <p>Lịch thi đã được cập nhật.</p>
                        <span>Hôm nay</span>
                    </div>
                </div>


                <div class="notice-item">
                    <div class="notice-dot"></div>

                    <div>
                        <strong>Phân phòng thi</strong>
                        <p>Danh sách phân phòng thi đang được cập nhật.</p>
                        <span>1 ngày trước</span>
                    </div>
                </div>


                <div class="notice-item">
                    <div class="notice-dot"></div>

                    <div>
                        <strong>Chỉ tiêu tuyển sinh</strong>
                        <p>Chỉ tiêu tuyển sinh của các trường đã được công bố.</p>
                        <span>2 ngày trước</span>
                    </div>
                </div>

            </div>

        </div>

    </div>

</section>

<?php
include 'components/layout/footer.php';
?>