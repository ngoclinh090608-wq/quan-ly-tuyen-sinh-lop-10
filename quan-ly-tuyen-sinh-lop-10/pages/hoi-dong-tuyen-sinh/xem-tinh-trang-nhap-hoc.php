```php
<?php
$activePage = 'admission-status';
$displayName = 'Hội đồng tuyển sinh';
$displayRole = 'Xem tình trạng nhập học';

include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<!-- CSS riêng của UC15 -->
<link rel="stylesheet"
      href="../../assets/css/xem-tinh-trang-nhap-hoc.css">


<section class="content admission-status-page">

    <!-- =====================================================
         TIÊU ĐỀ TRANG
    ====================================================== -->

    <div class="page-heading">

        <div>

            <div class="eyebrow">
                HỘI ĐỒNG TUYỂN SINH
            </div>

            <h1>
                Xem tình trạng nhập học
            </h1>

            <p>
                Tra cứu và theo dõi tình trạng nhập học
                của thí sinh sau khi kết quả tuyển sinh được công bố.
            </p>

        </div>

        <span class="admission-year">
            Tuyển sinh lớp 10 • 2026 - 2027
        </span>

    </div>


    <!-- =====================================================
         THÔNG BÁO
    ====================================================== -->

    <div id="pageMessage"
         class="admission-message"
         hidden>
    </div>


    <!-- =====================================================
         BỘ LỌC TRA CỨU
    ====================================================== -->

    <div class="panel search-panel">

        <div class="panel-header">

            <div>

                <h2>
                    Tra cứu tình trạng nhập học
                </h2>

                <p>
                    Nhập hoặc chọn các tiêu chí để tìm kiếm
                    thông tin thí sinh.
                </p>

            </div>

        </div>


        <form id="searchForm">

            <div class="filter-grid">

                <!-- Năm tuyển sinh -->
                <div class="form-group">

                    <label for="admissionYear">
                        Năm tuyển sinh
                    </label>

                    <select id="admissionYear">

                        <option value="2026">
                            2026 - 2027
                        </option>

                        <option value="2025">
                            2025 - 2026
                        </option>

                        <option value="2024">
                            2024 - 2025
                        </option>

                    </select>

                </div>


                <!-- Mã thí sinh -->
                <div class="form-group">

                    <label for="candidateId">
                        Mã thí sinh
                    </label>

                    <input
                        type="text"
                        id="candidateId"
                        placeholder="Nhập mã thí sinh">

                </div>


                <!-- Số báo danh -->
                <div class="form-group">

                    <label for="candidateNumber">
                        Số báo danh
                    </label>

                    <input
                        type="text"
                        id="candidateNumber"
                        placeholder="Nhập số báo danh">

                </div>


                <!-- Trường THPT -->
                <div class="form-group">

                    <label for="highSchool">
                        Trường THPT
                    </label>

                    <select id="highSchool">

                        <option value="all">
                            Tất cả trường
                        </option>

                        <option value="nguyen-trai">
                            THPT Nguyễn Trãi
                        </option>

                        <option value="tran-phu">
                            THPT Trần Phú
                        </option>

                        <option value="le-loi">
                            THPT Lê Lợi
                        </option>

                    </select>

                </div>


                <!-- Trạng thái nhập học -->
                <div class="form-group">

                    <label for="admissionStatus">
                        Trạng thái nhập học
                    </label>

                    <select id="admissionStatus">

                        <option value="all">
                            Tất cả trạng thái
                        </option>

                        <option value="confirmed">
                            Đã xác nhận nhập học
                        </option>

                        <option value="not-confirmed">
                            Chưa xác nhận nhập học
                        </option>

                        <option value="not-admitted">
                            Không trúng tuyển
                        </option>

                    </select>

                </div>

            </div>


            <!-- NÚT TRA CỨU -->

            <div class="search-actions">

                <button
                    type="button"
                    id="resetSearch"
                    class="secondary-button">

                    Xóa bộ lọc

                </button>


                <button
                    type="submit"
                    class="primary-button">

                    Tra cứu

                </button>

            </div>

        </form>

    </div>


    <!-- =====================================================
         THỐNG KÊ
    ====================================================== -->

    <div class="status-stat-grid">


        <!-- Tổng -->
        <div class="status-stat-card">

            <div class="status-stat-icon blue">
                TS
            </div>

            <div>

                <span>
                    Tổng thí sinh
                </span>

                <h2 id="totalCandidates">
                    11
                </h2>

                <small>
                    Danh sách sau xét tuyển
                </small>

            </div>

        </div>


        <!-- Đã xác nhận -->
        <div class="status-stat-card">

            <div class="status-stat-icon green">
                ĐX
            </div>

            <div>

                <span>
                    Đã xác nhận
                </span>

                <h2 id="confirmedCandidates">
                    5
                </h2>

                <small>
                    Đã hoàn tất nhập học
                </small>

            </div>

        </div>


        <!-- Chưa xác nhận -->
        <div class="status-stat-card">

            <div class="status-stat-icon orange">
                CX
            </div>

            <div>

                <span>
                    Chưa xác nhận
                </span>

                <h2 id="pendingCandidates">
                    4
                </h2>

                <small>
                    Đang chờ xác nhận
                </small>

            </div>

        </div>


        <!-- Không trúng tuyển -->
        <div class="status-stat-card">

            <div class="status-stat-icon purple">
                KĐ
            </div>

            <div>

                <span>
                    Không trúng tuyển
                </span>

                <h2 id="notAdmittedCandidates">
                    2
                </h2>

                <small>
                    Không thuộc danh sách trúng tuyển
                </small>

            </div>

        </div>

    </div>


    <!-- =====================================================
         DANH SÁCH THÍ SINH
    ====================================================== -->

    <div class="panel">

        <div class="panel-header">

            <div>

                <h2>
                    Danh sách tình trạng nhập học
                </h2>

                <p>
                    Danh sách thí sinh phù hợp với tiêu chí tra cứu.
                </p>

            </div>


            <span class="result-count">

                <strong id="resultCount">
                    3
                </strong>

                kết quả

            </span>

        </div>


        <div class="table-wrapper">

            <table class="admission-table">

                <thead>

                    <tr>

                        <th>
                            STT
                        </th>

                        <th>
                            SBD
                        </th>

                        <th>
                            Mã thí sinh
                        </th>

                        <th>
                            Họ và tên
                        </th>

                        <th>
                            Trường THPT
                        </th>

                        <th>
                            Kết quả
                        </th>

                        <th>
                            Trạng thái nhập học
                        </th>

                        <th>
                            Thao tác
                        </th>

                    </tr>

                </thead>


                <tbody id="candidateRows">


                    <!-- THÍ SINH 1 -->

                    <tr
                        data-id="TS00001"
                        data-status="confirmed">

                        <td>
                            1
                        </td>

                        <td>
                            10001
                        </td>

                        <td>
                            TS00001
                        </td>

                        <td>
                            <strong>
                                Nguyễn Văn An
                            </strong>
                        </td>

                        <td>
                            THPT Nguyễn Trãi
                        </td>

                        <td>

                            <span class="result-badge admitted">
                                Trúng tuyển
                            </span>

                        </td>

                        <td>

                            <span class="admission-status confirmed">
                                Đã xác nhận nhập học
                            </span>

                        </td>

                        <td>

                            <button
                                type="button"
                                class="view-button"
                                data-id="TS00001">

                                Xem chi tiết

                            </button>

                        </td>

                    </tr>


                    <!-- THÍ SINH 2 -->

                    <tr
                        data-id="TS00002"
                        data-status="not-confirmed">

                        <td>
                            2
                        </td>

                        <td>
                            10002
                        </td>

                        <td>
                            TS00002
                        </td>

                        <td>
                            <strong>
                                Trần Thị Bình
                            </strong>
                        </td>

                        <td>
                            THPT Trần Phú
                        </td>

                        <td>

                            <span class="result-badge admitted">
                                Trúng tuyển
                            </span>

                        </td>

                        <td>

                            <span class="admission-status not-confirmed">
                                Chưa xác nhận nhập học
                            </span>

                        </td>

                        <td>

                            <button
                                type="button"
                                class="view-button"
                                data-id="TS00002">

                                Xem chi tiết

                            </button>

                        </td>

                    </tr>


                    <!-- THÍ SINH 3 -->

                    <tr
                        data-id="TS00003"
                        data-status="not-admitted">

                        <td>
                            3
                        </td>

                        <td>
                            10003
                        </td>

                        <td>
                            TS00003
                        </td>

                        <td>
                            <strong>
                                Lê Minh Cường
                            </strong>
                        </td>

                        <td>
                            THPT Lê Lợi
                        </td>

                        <td>

                            <span class="result-badge not-admitted">
                                Không trúng tuyển
                            </span>

                        </td>

                        <td>

                            <span class="admission-status not-admitted">
                                Không trúng tuyển
                            </span>

                        </td>

                        <td>

                            <button
                                type="button"
                                class="view-button"
                                data-id="TS00003">

                                Xem chi tiết

                            </button>

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>


    <!-- =====================================================
         CHI TIẾT THÍ SINH
    ====================================================== -->

    <div
        class="panel candidate-detail"
        id="candidateDetail"
        hidden>


        <div class="panel-header">

            <div>

                <h2>
                    Chi tiết tình trạng nhập học
                </h2>

                <p>
                    Thông tin chi tiết của thí sinh được chọn.
                </p>

            </div>


            <button
                type="button"
                id="closeDetail"
                class="secondary-button">

                Đóng

            </button>

        </div>


        <!-- THÔNG TIN CƠ BẢN -->

        <div class="candidate-profile">

            <div class="candidate-avatar">
                TS
            </div>

            <div>

                <h3 id="detailName">
                    Nguyễn Văn An
                </h3>

                <p>

                    Mã thí sinh:

                    <strong id="detailId">
                        TS00001
                    </strong>

                </p>

            </div>

        </div>


        <!-- THÔNG TIN XÉT TUYỂN -->

        <div class="detail-grid">


            <div class="detail-item">

                <span>
                    Số báo danh
                </span>

                <strong id="detailSbd">
                    10001
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Năm tuyển sinh
                </span>

                <strong>
                    2026 - 2027
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Trường THPT
                </span>

                <strong id="detailSchool">
                    THPT Nguyễn Trãi
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Kết quả xét tuyển
                </span>

                <strong
                    id="detailResult"
                    class="text-success">

                    Trúng tuyển

                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Nguyện vọng trúng tuyển
                </span>

                <strong id="detailPreference">
                    NV1
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Điểm xét tuyển
                </span>

                <strong id="detailScore">
                    25.50
                </strong>

            </div>

        </div>


        <!-- TÌNH TRẠNG NHẬP HỌC -->

        <div class="admission-detail-box">

            <div class="detail-box-title">
                Tình trạng nhập học
            </div>


            <div class="detail-status-row">


                <div>

                    <span>
                        Trạng thái
                    </span>

                    <strong
                        id="detailStatus"
                        class="admission-status confirmed">

                        Đã xác nhận nhập học

                    </strong>

                </div>


                <div>

                    <span>
                        Thời gian xác nhận
                    </span>

                    <strong id="detailTime">
                        10/07/2026 09:35
                    </strong>

                </div>


                <div>

                    <span>
                        Trường xác nhận
                    </span>

                    <strong id="detailConfirmedSchool">
                        THPT Nguyễn Trãi
                    </strong>

                </div>

            </div>

        </div>

    </div>

</section>


<script>

/* =========================================================
   DỮ LIỆU MẪU
   Sau này có thể thay bằng dữ liệu từ PHP/MySQL/API
========================================================= */

const candidates = {

    TS00001: {
        id: "TS00001",
        sbd: "10001",
        name: "Nguyễn Văn An",
        school: "THPT Nguyễn Trãi",
        result: "Trúng tuyển",
        preference: "NV1",
        score: "25.50",
        status: "confirmed",
        statusText: "Đã xác nhận nhập học",
        time: "10/07/2026 09:35",
        confirmedSchool: "THPT Nguyễn Trãi"
    },

    TS00002: {
        id: "TS00002",
        sbd: "10002",
        name: "Trần Thị Bình",
        school: "THPT Trần Phú",
        result: "Trúng tuyển",
        preference: "NV2",
        score: "24.75",
        status: "not-confirmed",
        statusText: "Chưa xác nhận nhập học",
        time: "Chưa xác nhận",
        confirmedSchool: "Chưa có"
    },

    TS00003: {
        id: "TS00003",
        sbd: "10003",
        name: "Lê Minh Cường",
        school: "THPT Lê Lợi",
        result: "Không trúng tuyển",
        preference: "--",
        score: "18.25",
        status: "not-admitted",
        statusText: "Không trúng tuyển",
        time: "--",
        confirmedSchool: "--"
    }

};


/* =========================================================
   LẤY ELEMENT
========================================================= */

const searchForm =
    document.getElementById("searchForm");

const resetSearch =
    document.getElementById("resetSearch");

const pageMessage =
    document.getElementById("pageMessage");

const candidateDetail =
    document.getElementById("candidateDetail");


/* =========================================================
   HIỂN THỊ THÔNG BÁO
========================================================= */

function showMessage(message, type = "info") {

    pageMessage.hidden = false;

    pageMessage.className =
        "admission-message " + type;

    pageMessage.textContent = message;

}


/* =========================================================
   ẨN THÔNG BÁO
========================================================= */

function hideMessage() {

    pageMessage.hidden = true;

}


/* =========================================================
   XEM CHI TIẾT THÍ SINH
========================================================= */

document
    .querySelectorAll(".view-button")
    .forEach(button => {

        button.addEventListener("click", function () {

            const id =
                this.dataset.id;

            const data =
                candidates[id];


            if (!data) {

                showMessage(
                    "Không tìm thấy thông tin thí sinh phù hợp.",
                    "error"
                );

                return;

            }


            document
                .getElementById("detailName")
                .textContent = data.name;


            document
                .getElementById("detailId")
                .textContent = data.id;


            document
                .getElementById("detailSbd")
                .textContent = data.sbd;


            document
                .getElementById("detailSchool")
                .textContent = data.school;


            document
                .getElementById("detailResult")
                .textContent = data.result;


            document
                .getElementById("detailPreference")
                .textContent = data.preference;


            document
                .getElementById("detailScore")
                .textContent = data.score;


            const statusElement =
                document.getElementById("detailStatus");


            statusElement.textContent =
                data.statusText;


            statusElement.className =
                "admission-status " + data.status;


            document
                .getElementById("detailTime")
                .textContent = data.time;


            document
                .getElementById("detailConfirmedSchool")
                .textContent =
                    data.confirmedSchool;


            candidateDetail.hidden = false;


            candidateDetail.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


/* =========================================================
   ĐÓNG CHI TIẾT
========================================================= */

document
    .getElementById("closeDetail")
    .addEventListener("click", function () {

        candidateDetail.hidden = true;

    });


/* =========================================================
   TRA CỨU
========================================================= */

searchForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        hideMessage();


        const candidateId =
            document
                .getElementById("candidateId")
                .value
                .trim()
                .toUpperCase();


        const candidateNumber =
            document
                .getElementById("candidateNumber")
                .value
                .trim();


        const school =
            document
                .getElementById("highSchool")
                .value;


        const status =
            document
                .getElementById("admissionStatus")
                .value;


        const rows =
            document.querySelectorAll(
                "#candidateRows tr"
            );


        let found = 0;


        rows.forEach(row => {

            const id =
                row.dataset.id;

            const data =
                candidates[id];

            let visible = true;


            /*
             * Mã thí sinh
             */

            if (
                candidateId &&
                data.id !== candidateId
            ) {

                visible = false;

            }


            /*
             * Số báo danh
             */

            if (
                candidateNumber &&
                data.sbd !== candidateNumber
            ) {

                visible = false;

            }


            /*
             * Trường THPT
             */

            if (school !== "all") {

                let selectedSchool = "";

                if (school === "nguyen-trai") {
                    selectedSchool = "THPT Nguyễn Trãi";
                }

                if (school === "tran-phu") {
                    selectedSchool = "THPT Trần Phú";
                }

                if (school === "le-loi") {
                    selectedSchool = "THPT Lê Lợi";
                }

                if (data.school !== selectedSchool) {
                    visible = false;
                }

            }


            /*
             * Trạng thái nhập học
             */

            if (
                status !== "all" &&
                data.status !== status
            ) {

                visible = false;

            }


            row.style.display =
                visible ? "" : "none";


            if (visible) {
                found++;
            }

        });


        document
            .getElementById("resultCount")
            .textContent = found;


        /*
         * Không tìm thấy
         */

        if (found === 0) {

            showMessage(
                "Không tìm thấy thông tin thí sinh phù hợp.",
                "error"
            );

        }

    }
);


/* =========================================================
   XÓA BỘ LỌC
========================================================= */

resetSearch.addEventListener(
    "click",
    function () {

        document
            .getElementById("candidateId")
            .value = "";


        document
            .getElementById("candidateNumber")
            .value = "";


        document
            .getElementById("highSchool")
            .value = "all";


        document
            .getElementById("admissionStatus")
            .value = "all";


        document
            .querySelectorAll("#candidateRows tr")
            .forEach(row => {

                row.style.display = "";

            });


        document
            .getElementById("resultCount")
            .textContent = "3";


        hideMessage();


        candidateDetail.hidden = true;

    }
);

</script>


<?php
include dirname(__FILE__) . '/../../components/layout/footer.php';
?>
```
