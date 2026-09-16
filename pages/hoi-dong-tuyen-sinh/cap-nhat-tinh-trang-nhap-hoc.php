<?php

$activePage = 'enrollment';
$displayName = 'Hội đồng tuyển sinh';
$displayRole = 'Cập nhật tình trạng nhập học';

include dirname(__FILE__) . '/../../components/layout/header.php';

?>

<!-- CSS RIÊNG CHO UC16 -->
<link rel="stylesheet"
      href="<?php echo htmlspecialchars($appBase); ?>/assets/css/enrollment-status.css">


<div class="enrollment-page">

    <!-- =========================
         PAGE HEADER
    ========================== -->

    <div class="enrollment-page-header">

        <div>

            <div class="enrollment-eyebrow">
                HỘI ĐỒNG TUYỂN SINH
            </div>

            <h1>
                Cập nhật tình trạng nhập học
            </h1>

            <p>
                Tra cứu và cập nhật tình trạng nhập học của thí sinh trúng tuyển.
            </p>

        </div>

        <div class="enrollment-year">
            Năm học 2026 - 2027
        </div>

    </div>


    <!-- =========================
         MESSAGE
    ========================== -->

    <div
        id="enrollmentMessage"
        class="enrollment-message"
        hidden>
    </div>


    <!-- =========================
         1. TRA CỨU THÍ SINH
    ========================== -->

    <div class="enrollment-card">

        <div class="enrollment-card-header">

            <div>

                <h2>
                    Tra cứu thí sinh
                </h2>

                <p>
                    Nhập mã thí sinh, số báo danh hoặc chọn trường THPT để tra cứu.
                </p>

            </div>

        </div>


        <form
            id="candidateSearchForm"
            class="candidate-search-form">


            <!-- MÃ THÍ SINH -->

            <div class="enrollment-form-group">

                <label for="candidateCode">
                    Mã thí sinh
                </label>

                <input
                    type="text"
                    id="candidateCode"
                    name="candidateCode"
                    placeholder="Nhập mã thí sinh">


            </div>


            <!-- SỐ BÁO DANH -->

            <div class="enrollment-form-group">

                <label for="candidateNumber">
                    Số báo danh
                </label>

                <input
                    type="text"
                    id="candidateNumber"
                    name="candidateNumber"
                    placeholder="Nhập số báo danh">

            </div>


            <!-- TRƯỜNG THPT -->

            <div class="enrollment-form-group">

                <label for="candidateSchool">
                    Trường THPT
                </label>

                <select
                    id="candidateSchool"
                    name="candidateSchool">

                    <option value="">
                        Tất cả trường
                    </option>

                    <option value="THPT Nguyễn Trãi">
                        THPT Nguyễn Trãi
                    </option>

                    <option value="THPT Lê Quý Đôn">
                        THPT Lê Quý Đôn
                    </option>

                    <option value="THPT Trần Phú">
                        THPT Trần Phú
                    </option>

                </select>

            </div>


            <!-- NÚT -->

            <div class="candidate-search-actions">

                <button
                    type="submit"
                    class="enrollment-btn enrollment-btn-primary">

                    Tìm kiếm

                </button>


                <button
                    type="button"
                    id="resetSearchButton"
                    class="enrollment-btn enrollment-btn-secondary">

                    Xóa bộ lọc

                </button>

            </div>

        </form>

    </div>


    <!-- =========================
         2. DANH SÁCH THÍ SINH
    ========================== -->

    <div class="enrollment-card">

        <div class="enrollment-card-header">

            <div>

                <h2>
                    Danh sách thí sinh trúng tuyển
                </h2>

                <p>
                    Danh sách các thí sinh đủ điều kiện cập nhật tình trạng nhập học.
                </p>

            </div>


            <div
                id="candidateCount"
                class="candidate-count">

                0 thí sinh

            </div>

        </div>


        <div class="enrollment-table-wrapper">

            <table class="enrollment-table">

                <thead>

                    <tr>

                        <th>
                            STT
                        </th>

                        <th>
                            Mã thí sinh
                        </th>

                        <th>
                            Số báo danh
                        </th>

                        <th>
                            Họ và tên
                        </th>

                        <th>
                            Trường THPT
                        </th>

                        <th>
                            NV
                        </th>

                        <th>
                            Điểm
                        </th>

                        <th>
                            Tình trạng
                        </th>

                        <th>
                            Thao tác
                        </th>

                    </tr>

                </thead>


                <tbody id="candidateTableBody">

                </tbody>

            </table>

        </div>

    </div>


    <!-- =========================
         3. CHI TIẾT CẬP NHẬT
    ========================== -->

    <div
        id="updateCard"
        class="enrollment-card update-card"
        hidden>


        <div class="enrollment-card-header">

            <div>

                <h2>
                    Cập nhật tình trạng nhập học
                </h2>

                <p>
                    Kiểm tra thông tin thí sinh trước khi xác nhận cập nhật.
                </p>

            </div>

        </div>


        <!-- THÔNG TIN THÍ SINH -->

        <div class="candidate-information">

            <div class="information-title">
                Thông tin thí sinh
            </div>


            <div class="candidate-information-grid">


                <div class="information-item">

                    <span>
                        Mã thí sinh
                    </span>

                    <strong id="detailCandidateCode">
                    </strong>

                </div>


                <div class="information-item">

                    <span>
                        Số báo danh
                    </span>

                    <strong id="detailCandidateNumber">
                    </strong>

                </div>


                <div class="information-item">

                    <span>
                        Họ và tên
                    </span>

                    <strong id="detailCandidateName">
                    </strong>

                </div>


                <div class="information-item">

                    <span>
                        Ngày sinh
                    </span>

                    <strong id="detailCandidateBirthday">
                    </strong>

                </div>


                <div class="information-item">

                    <span>
                        Trường THPT
                    </span>

                    <strong id="detailCandidateSchool">
                    </strong>

                </div>


                <div class="information-item">

                    <span>
                        Nguyện vọng
                    </span>

                    <strong id="detailCandidatePreference">
                    </strong>

                </div>


                <div class="information-item">

                    <span>
                        Điểm xét tuyển
                    </span>

                    <strong id="detailCandidateScore">
                    </strong>

                </div>


                <div class="information-item">

                    <span>
                        Kết quả tuyển sinh
                    </span>

                    <strong class="enrollment-status passed">
                        TRÚNG TUYỂN
                    </strong>

                </div>


            </div>

        </div>


        <!-- FORM CẬP NHẬT -->

        <div class="candidate-update-form">

            <div class="information-title">
                Thông tin xác nhận nhập học
            </div>


            <!-- TÌNH TRẠNG -->

            <div class="enrollment-form-group">

                <label for="newEnrollmentStatus">

                    Tình trạng nhập học

                    <span class="required">
                        *
                    </span>

                </label>


                <select
                    id="newEnrollmentStatus">

                    <option value="">
                        -- Chọn tình trạng nhập học --
                    </option>

                    <option value="confirmed">
                        Đã xác nhận nhập học
                    </option>

                    <option value="not_confirmed">
                        Chưa xác nhận nhập học
                    </option>

                    <option value="not_enrolled">
                        Không nhập học
                    </option>

                </select>


                <div
                    id="statusError"
                    class="enrollment-field-error">
                </div>

            </div>


            <!-- GHI CHÚ -->

            <div class="enrollment-form-group">

                <label for="confirmationNote">
                    Thông tin xác nhận / Ghi chú
                </label>


                <textarea
                    id="confirmationNote"
                    rows="4"
                    placeholder="Nhập thông tin xác nhận nhập học hoặc ghi chú..."></textarea>

            </div>

        </div>


        <!-- NÚT -->

        <div class="update-actions">

            <button
                type="button"
                id="cancelUpdateButton"
                class="enrollment-btn enrollment-btn-secondary">

                Hủy

            </button>


            <button
                type="button"
                id="confirmUpdateButton"
                class="enrollment-btn enrollment-btn-primary">

                Xác nhận cập nhật

            </button>

        </div>

    </div>


    <!-- =========================
         4. LỊCH SỬ CẬP NHẬT
    ========================== -->

    <div class="enrollment-card">

        <div class="enrollment-card-header">

            <div>

                <h2>
                    Lịch sử cập nhật
                </h2>

                <p>
                    Theo dõi thời gian và thông tin các lần cập nhật.
                </p>

            </div>

        </div>


        <div class="enrollment-table-wrapper">

            <table class="enrollment-table history-table">

                <thead>

                    <tr>

                        <th>
                            Thời gian
                        </th>

                        <th>
                            Mã thí sinh
                        </th>

                        <th>
                            Họ và tên
                        </th>

                        <th>
                            Tình trạng
                        </th>

                        <th>
                            Người cập nhật
                        </th>

                        <th>
                            Ghi chú
                        </th>

                    </tr>

                </thead>


                <tbody id="historyTableBody">

                    <tr>

                        <td
                            colspan="6"
                            class="empty-table">

                            Chưa có lịch sử cập nhật.

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>


<script>

/* =========================================
   DỮ LIỆU MẪU
========================================= */

const candidates = [

    {
        id: "TS00001",
        number: "10001",
        name: "Nguyễn Văn An",
        birthday: "15/05/2008",
        school: "THPT Nguyễn Trãi",
        preference: "NV1",
        score: "25.50",
        result: "passed",
        status: "not_confirmed"
    },

    {
        id: "TS00002",
        number: "10002",
        name: "Trần Thị Bình",
        birthday: "21/07/2008",
        school: "THPT Lê Quý Đôn",
        preference: "NV1",
        score: "24.75",
        result: "passed",
        status: "confirmed"
    },

    {
        id: "TS00003",
        number: "10003",
        name: "Lê Minh Châu",
        birthday: "02/03/2008",
        school: "THPT Trần Phú",
        preference: "NV2",
        score: "23.80",
        result: "passed",
        status: "not_confirmed"
    },

    {
        id: "TS00004",
        number: "10004",
        name: "Phạm Hoàng Nam",
        birthday: "09/09/2008",
        school: "THPT Nguyễn Trãi",
        preference: "NV1",
        score: "26.25",
        result: "passed",
        status: "not_enrolled"
    }

];


/* =========================================
   BIẾN
========================================= */

let selectedCandidate = null;

let updateHistory = [];


/* =========================================
   ELEMENT
========================================= */

const candidateTableBody =
    document.getElementById("candidateTableBody");

const candidateCount =
    document.getElementById("candidateCount");

const updateCard =
    document.getElementById("updateCard");

const enrollmentMessage =
    document.getElementById("enrollmentMessage");

const historyTableBody =
    document.getElementById("historyTableBody");


/* =========================================
   TEXT TRẠNG THÁI
========================================= */

function getStatusText(status) {

    switch (status) {

        case "confirmed":
            return "Đã xác nhận nhập học";

        case "not_confirmed":
            return "Chưa xác nhận nhập học";

        case "not_enrolled":
            return "Không nhập học";

        default:
            return "Chưa xác định";
    }

}


/* =========================================
   CLASS TRẠNG THÁI
========================================= */

function getStatusClass(status) {

    switch (status) {

        case "confirmed":
            return "confirmed";

        case "not_enrolled":
            return "not-enrolled";

        default:
            return "not-confirmed";

    }

}


/* =========================================
   HIỂN THỊ THÔNG BÁO
========================================= */

function showMessage(message, type) {

    enrollmentMessage.hidden = false;

    enrollmentMessage.className =
        "enrollment-message " + type;

    enrollmentMessage.textContent =
        message;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   HIỂN THỊ DANH SÁCH
========================================= */

function renderCandidates(data) {

    candidateTableBody.innerHTML = "";

    candidateCount.textContent =
        data.length + " thí sinh";


    if (data.length === 0) {

        candidateTableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="empty-table">

                    Không tìm thấy thông tin thí sinh phù hợp.

                </td>

            </tr>

        `;

        return;
    }


    data.forEach((candidate, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>


            <td>
                <strong>
                    ${candidate.id}
                </strong>
            </td>


            <td>
                ${candidate.number}
            </td>


            <td>
                ${candidate.name}
            </td>


            <td>
                ${candidate.school}
            </td>


            <td>
                ${candidate.preference}
            </td>


            <td>
                ${candidate.score}
            </td>


            <td>

                <span class="enrollment-status ${getStatusClass(candidate.status)}">

                    ${getStatusText(candidate.status)}

                </span>

            </td>


            <td>

                <button
                    type="button"
                    class="enrollment-table-button"
                    onclick="openUpdateForm('${candidate.id}')">

                    Cập nhật

                </button>

            </td>

        `;


        candidateTableBody.appendChild(row);

    });

}


/* =========================================
   MỞ FORM CẬP NHẬT
========================================= */

function openUpdateForm(candidateId) {

    selectedCandidate =
        candidates.find(
            candidate =>
                candidate.id === candidateId
        );


    if (!selectedCandidate) {
        return;
    }


    /* KIỂM TRA TRÚNG TUYỂN */

    if (selectedCandidate.result !== "passed") {

        showMessage(
            "Thí sinh không thuộc diện trúng tuyển, không thể cập nhật tình trạng nhập học.",
            "error"
        );

        return;
    }


    /* HIỂN THỊ THÔNG TIN */

    document.getElementById(
        "detailCandidateCode"
    ).textContent =
        selectedCandidate.id;


    document.getElementById(
        "detailCandidateNumber"
    ).textContent =
        selectedCandidate.number;


    document.getElementById(
        "detailCandidateName"
    ).textContent =
        selectedCandidate.name;


    document.getElementById(
        "detailCandidateBirthday"
    ).textContent =
        selectedCandidate.birthday;


    document.getElementById(
        "detailCandidateSchool"
    ).textContent =
        selectedCandidate.school;


    document.getElementById(
        "detailCandidatePreference"
    ).textContent =
        selectedCandidate.preference;


    document.getElementById(
        "detailCandidateScore"
    ).textContent =
        selectedCandidate.score;


    /* HIỂN THỊ TRẠNG THÁI HIỆN TẠI */

    document.getElementById(
        "newEnrollmentStatus"
    ).value =
        selectedCandidate.status;


    document.getElementById(
        "confirmationNote"
    ).value = "";


    document.getElementById(
        "statusError"
    ).textContent = "";


    /* HIỂN THỊ CARD */

    updateCard.hidden = false;


    updateCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   TÌM KIẾM
========================================= */

document
    .getElementById("candidateSearchForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const code =
                document
                    .getElementById("candidateCode")
                    .value
                    .trim()
                    .toLowerCase();


            const number =
                document
                    .getElementById("candidateNumber")
                    .value
                    .trim()
                    .toLowerCase();


            const school =
                document
                    .getElementById("candidateSchool")
                    .value;


            const result =
                candidates.filter(candidate => {


                    const matchCode =
                        !code ||
                        candidate.id
                            .toLowerCase()
                            .includes(code);


                    const matchNumber =
                        !number ||
                        candidate.number
                            .toLowerCase()
                            .includes(number);


                    const matchSchool =
                        !school ||
                        candidate.school === school;


                    return (
                        matchCode &&
                        matchNumber &&
                        matchSchool
                    );

                });


            renderCandidates(result);

        }
    );


/* =========================================
   XÓA BỘ LỌC
========================================= */

document
    .getElementById("resetSearchButton")
    .addEventListener(
        "click",
        function() {


            document
                .getElementById("candidateCode")
                .value = "";


            document
                .getElementById("candidateNumber")
                .value = "";


            document
                .getElementById("candidateSchool")
                .value = "";


            enrollmentMessage.hidden = true;


            renderCandidates(
                candidates
            );

        }
    );


/* =========================================
   HỦY CẬP NHẬT
========================================= */

document
    .getElementById("cancelUpdateButton")
    .addEventListener(
        "click",
        function() {


            updateCard.hidden = true;

            selectedCandidate = null;


            document
                .getElementById("statusError")
                .textContent = "";


        }
    );


/* =========================================
   XÁC NHẬN CẬP NHẬT
========================================= */

document
    .getElementById("confirmUpdateButton")
    .addEventListener(
        "click",
        function() {


            if (!selectedCandidate) {
                return;
            }


            const newStatus =
                document
                    .getElementById("newEnrollmentStatus")
                    .value;


            const note =
                document
                    .getElementById("confirmationNote")
                    .value
                    .trim();


            const statusError =
                document
                    .getElementById("statusError");


            /* KIỂM TRA TRẠNG THÁI */

            if (!newStatus) {

                statusError.textContent =
                    "Thông tin xác nhận nhập học không hợp lệ. Vui lòng chọn tình trạng nhập học.";

                return;
            }


            statusError.textContent = "";


            /* LƯU THỜI GIAN */

            const currentTime =
                new Date().toLocaleString(
                    "vi-VN"
                );


            /* CẬP NHẬT */

            selectedCandidate.status =
                newStatus;


            /* LƯU LỊCH SỬ */

            updateHistory.unshift({

                time: currentTime,

                candidateId:
                    selectedCandidate.id,

                name:
                    selectedCandidate.name,

                status:
                    newStatus,

                operator:
                    "Hội đồng tuyển sinh",

                note:
                    note || "Không có ghi chú"

            });


            /* RENDER */

            renderCandidates(
                candidates
            );


            renderHistory();


            /* ĐÓNG FORM */

            updateCard.hidden = true;


            selectedCandidate = null;


            /* THÔNG BÁO */

            showMessage(
                "Cập nhật tình trạng nhập học thành công.",
                "success"
            );

        }
    );


/* =========================================
   LỊCH SỬ
========================================= */

function renderHistory() {

    historyTableBody.innerHTML = "";


    if (updateHistory.length === 0) {

        historyTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-table">

                    Chưa có lịch sử cập nhật.

                </td>

            </tr>

        `;

        return;
    }


    updateHistory.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${item.time}
            </td>


            <td>
                ${item.candidateId}
            </td>


            <td>
                ${item.name}
            </td>


            <td>

                <span class="enrollment-status ${getStatusClass(item.status)}">

                    ${getStatusText(item.status)}

                </span>

            </td>


            <td>
                ${item.operator}
            </td>


            <td>
                ${item.note}
            </td>

        `;


        historyTableBody.appendChild(row);

    });

}


/* =========================================
   KHỞI TẠO
========================================= */

renderCandidates(
    candidates
);

renderHistory();

</script>


<?php

include dirname(__FILE__) . '/../../components/layout/footer.php';

?>