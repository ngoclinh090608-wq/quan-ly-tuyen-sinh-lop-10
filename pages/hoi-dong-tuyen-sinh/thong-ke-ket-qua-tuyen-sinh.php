<?php
$pageTitle = "Thống kê kết quả tuyển sinh";
require_once '../../components/layout/header.php';
?>

<link rel="stylesheet"
      href="../../assets/css/thong-ke-ket-qua-tuyen-sinh.css">

<div class="statistics-page">

    <!-- Tiêu đề -->
    <div class="page-header">
        <div>
            <h1>Thống kê kết quả tuyển sinh</h1>
            <p>Thống kê và tổng hợp dữ liệu tuyển sinh theo các tiêu chí</p>
        </div>
    </div>

    <!-- Bộ lọc thống kê -->
    <div class="statistics-card">

        <div class="card-title">
            <h2>Bộ lọc thống kê</h2>
            <p>Chọn năm tuyển sinh và nội dung cần thống kê</p>
        </div>

        <div class="filter-grid">

            <!-- Năm tuyển sinh -->
            <div class="form-group">
                <label for="nam-tuyen-sinh">
                    Năm tuyển sinh
                </label>

                <select id="nam-tuyen-sinh">
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
            </div>

            <!-- Nội dung thống kê -->
            <div class="form-group">
                <label for="noi-dung-thong-ke">
                    Nội dung thống kê
                </label>

                <select id="noi-dung-thong-ke"
                        onchange="changeStatisticType()">

                    <option value="">
                        -- Chọn nội dung thống kê --
                    </option>

                    <option value="thcs">
                        Theo trường THCS
                    </option>

                    <option value="thpt">
                        Theo trường THPT
                    </option>

                    <option value="nguyen-vong">
                        Theo nguyện vọng
                    </option>

                    <option value="nhap-hoc">
                        Tình trạng nhập học
                    </option>

                    <option value="trung-tuyen">
                        Kết quả trúng tuyển
                    </option>

                </select>
            </div>

            <!-- Tiêu chí -->
            <div class="form-group full-width">

                <label for="tieu-chi">
                    Tiêu chí
                </label>

                <select id="tieu-chi">

                    <option value="">
                        -- Chọn nội dung thống kê trước --
                    </option>

                </select>

            </div>

        </div>

        <div class="filter-actions">

            <button class="btn-primary"
                    onclick="performStatistics()">

                <span>Thống kê</span>

            </button>

            <button class="btn-secondary"
                    onclick="resetStatistics()">

                Đặt lại

            </button>

        </div>

    </div>


    <!-- Kết quả thống kê -->
    <div class="statistics-result"
         id="statistics-result">

        <div class="result-header">

            <div>
                <h2>Kết quả thống kê</h2>

                <p id="result-description">
                    Chưa có dữ liệu thống kê
                </p>
            </div>

            <div class="report-actions">

                <button class="btn-outline"
                        onclick="printReport()">

                    In báo cáo

                </button>

                <button class="btn-success"
                        onclick="exportReport()">

                    Xuất báo cáo

                </button>

            </div>

        </div>


        <!-- Thẻ số liệu -->
        <div class="summary-grid">

            <div class="summary-card">

                <div class="summary-label">
                    Tổng hồ sơ đăng ký
                </div>

                <div class="summary-value">
                    120
                </div>

            </div>


            <div class="summary-card">

                <div class="summary-label">
                    Số thí sinh dự thi
                </div>

                <div class="summary-value">
                    115
                </div>

            </div>


            <div class="summary-card">

                <div class="summary-label">
                    Số thí sinh trúng tuyển
                </div>

                <div class="summary-value">
                    85
                </div>

            </div>


            <div class="summary-card">

                <div class="summary-label">
                    Đã xác nhận nhập học
                </div>

                <div class="summary-value">
                    80
                </div>

            </div>

        </div>


        <!-- Bảng kết quả -->
        <div class="result-table-card">

            <div class="table-header">

                <div>
                    <h3>Chi tiết kết quả thống kê</h3>

                    <span>
                        Năm tuyển sinh 2026
                    </span>
                </div>

            </div>


            <div class="table-responsive">

                <table>

                    <thead>

                        <tr>
                            <th>STT</th>
                            <th>Nội dung</th>
                            <th>Đăng ký</th>
                            <th>Dự thi</th>
                            <th>Trúng tuyển</th>
                            <th>Đã nhập học</th>
                            <th>Tỷ lệ nhập học</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td>1</td>

                            <td>
                                THCS Nguyễn Du
                            </td>

                            <td>120</td>

                            <td>115</td>

                            <td>85</td>

                            <td>80</td>

                            <td>
                                <span class="percentage">
                                    94.12%
                                </span>
                            </td>

                        </tr>


                        <tr>
                            <td>2</td>

                            <td>
                                THCS Trần Phú
                            </td>

                            <td>135</td>

                            <td>130</td>

                            <td>92</td>

                            <td>87</td>

                            <td>
                                <span class="percentage">
                                    94.57%
                                </span>
                            </td>

                        </tr>


                        <tr class="total-row">

                            <td colspan="2">
                                Tổng cộng
                            </td>

                            <td>255</td>

                            <td>245</td>

                            <td>177</td>

                            <td>167</td>

                            <td>
                                94.35%
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>


<script>

function changeStatisticType() {

    const type =
        document.getElementById('noi-dung-thong-ke').value;

    const criteria =
        document.getElementById('tieu-chi');

    criteria.innerHTML = '';

    if (type === '') {

        criteria.innerHTML =
            '<option value="">-- Chọn nội dung thống kê trước --</option>';

    }

    else if (type === 'thcs') {

        criteria.innerHTML = `
            <option value="">-- Chọn trường THCS --</option>
            <option value="thcs-nguyen-du">
                THCS Nguyễn Du
            </option>
            <option value="thcs-tran-phu">
                THCS Trần Phú
            </option>
            <option value="thcs-le-loi">
                THCS Lê Lợi
            </option>
        `;

    }

    else if (type === 'thpt') {

        criteria.innerHTML = `
            <option value="">-- Chọn trường THPT --</option>
            <option value="thpt-nguyen-thi-minh-khai">
                THPT Nguyễn Thị Minh Khai
            </option>
            <option value="thpt-le-hong-phong">
                THPT Lê Hồng Phong
            </option>
            <option value="thpt-tran-phu">
                THPT Trần Phú
            </option>
        `;

    }

    else if (type === 'nguyen-vong') {

        criteria.innerHTML = `
            <option value="">-- Chọn nguyện vọng --</option>
            <option value="nv1">Nguyện vọng 1</option>
            <option value="nv2">Nguyện vọng 2</option>
            <option value="nv3">Nguyện vọng 3</option>
        `;

    }

    else if (type === 'nhap-hoc') {

        criteria.innerHTML = `
            <option value="">-- Chọn tình trạng --</option>
            <option value="da-xac-nhan">
                Đã xác nhận nhập học
            </option>
            <option value="chua-xac-nhan">
                Chưa xác nhận nhập học
            </option>
            <option value="khong-nhap-hoc">
                Không nhập học
            </option>
        `;

    }

    else if (type === 'trung-tuyen') {

        criteria.innerHTML = `
            <option value="">-- Chọn tiêu chí --</option>
            <option value="theo-thpt">
                Theo trường THPT
            </option>
            <option value="theo-nguyen-vong">
                Theo nguyện vọng
            </option>
        `;

    }

}


function performStatistics() {

    const year =
        document.getElementById('nam-tuyen-sinh').value;

    const type =
        document.getElementById('noi-dung-thong-ke').value;

    const criteria =
        document.getElementById('tieu-chi').value;


    if (type === '') {

        alert(
            'Vui lòng chọn nội dung thống kê.'
        );

        return;
    }


    if (criteria === '') {

        alert(
            'Vui lòng chọn tiêu chí thống kê.'
        );

        return;
    }


    document.getElementById('result-description').innerText =
        'Kết quả thống kê năm ' + year +
        ' theo nội dung đã chọn.';

    document.getElementById('statistics-result')
        .classList.add('show');

}


function resetStatistics() {

    document.getElementById('nam-tuyen-sinh').value =
        '2026';

    document.getElementById('noi-dung-thong-ke').value =
        '';

    document.getElementById('tieu-chi').innerHTML =
        '<option value="">-- Chọn nội dung thống kê trước --</option>';

    document.getElementById('statistics-result')
        .classList.remove('show');

}


function printReport() {

    window.print();

}


function exportReport() {

    alert(
        'Chức năng xuất báo cáo sẽ được thực hiện khi tích hợp backend.'
    );

}

</script>


<?php
require_once '../../components/layout/footer.php';
?>