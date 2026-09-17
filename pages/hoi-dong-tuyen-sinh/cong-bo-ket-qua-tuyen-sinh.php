<?php
$pageTitle = "Công bố điểm thi";

require_once '../../components/layout/header.php';
?>

<link rel="stylesheet"
      href="../../assets/css/cong-bo-ket-qua-tuyen-sinh.css">

<style>
    .scope-note {
        margin-top: 12px;
        padding: 12px 15px;
        background: #eef5ff;
        border: 1px solid #d8e8ff;
        border-radius: 8px;
        color: #1769e0;
        font-size: 13px;
    }

    .status-ready {
        color: #18794e;
        font-weight: 600;
    }

    .status-published-text {
        color: #1769e0;
        font-weight: 600;
    }

    .status-unpublished-text {
        color: #d97706;
        font-weight: 600;
    }

    .summary {
        flex-wrap: wrap;
    }
</style>


<div class="publish-page">

    <!-- HEADER -->
    <div class="page-header">

        <div>
            <h1>Công bố điểm thi</h1>

            <p>
                Công bố danh sách điểm thi để thí sinh có thể tra cứu kết quả.
            </p>
        </div>

    </div>


    <!-- THÔNG TIN CÔNG BỐ -->
    <div class="publish-card">

        <div class="card-header">

            <div>
                <h2>Phạm vi công bố</h2>

                <p>
                    Chọn kỳ thi và môn thi cần công bố.
                </p>
            </div>

        </div>


        <div class="form-grid">

            <!-- KỲ THI -->
            <div class="form-group">

                <label for="ky-thi">
                    Kỳ thi
                </label>

                <select id="ky-thi"
                        onchange="loadExamResult()">

                    <option value="2026">
                        Tuyển sinh lớp 10 - 2026
                    </option>

                    <option value="2025">
                        Tuyển sinh lớp 10 - 2025
                    </option>

                </select>

            </div>


            <!-- MÔN THI -->
            <div class="form-group">

                <label for="mon-thi">
                    Môn thi
                </label>

                <select id="mon-thi"
                        onchange="loadExamResult()">

                    <option value="toan">
                        Toán
                    </option>

                    <option value="van">
                        Ngữ văn
                    </option>

                    <option value="anh">
                        Tiếng Anh
                    </option>

                </select>

            </div>

        </div>


        <!-- TRẠNG THÁI CÔNG BỐ -->
        <div class="status-row">

            <span class="status-label">
                Trạng thái công bố:
            </span>

            <span id="publish-status"
                  class="status-badge status-unpublished">

                Chưa công bố

            </span>

        </div>


        <div class="scope-note">
            Điểm thi sẽ được công bố theo toàn bộ danh sách của kỳ thi
            và môn thi đã chọn, không công bố từng thí sinh riêng lẻ.
        </div>

    </div>


    <!-- DANH SÁCH KẾT QUẢ -->
    <div class="publish-card">

        <div class="result-header">

            <div>

                <h2>
                    Danh sách kết quả chấm thi
                </h2>

                <p>
                    Danh sách kết quả đã hoàn tất chấm và đủ điều kiện công bố.
                </p>

            </div>

        </div>


        <!-- THÔNG BÁO -->
        <div id="system-alert"
             class="system-alert hidden">

            <span id="alert-message"></span>

        </div>


        <!-- TABLE -->
        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>STT</th>

                        <th>Số báo danh</th>

                        <th>Mã phách</th>

                        <th>Môn thi</th>

                        <th>Điểm thi</th>

                        <th>Trạng thái chấm</th>

                        <th>Trạng thái công bố</th>

                    </tr>

                </thead>


                <tbody id="result-table-body">
                </tbody>

            </table>

        </div>


        <!-- SUMMARY -->
        <div class="summary">

            <div class="summary-item">

                <span>
                    Tổng số bài thi
                </span>

                <strong id="total-result">
                    0
                </strong>

            </div>


            <div class="summary-item">

                <span>
                    Đã chấm
                </span>

                <strong id="total-graded">
                    0
                </strong>

            </div>


            <div class="summary-item">

                <span>
                    Chưa công bố
                </span>

                <strong id="total-unpublished">
                    0
                </strong>

            </div>


            <div class="summary-item">

                <span>
                    Đã công bố
                </span>

                <strong id="total-published">
                    0
                </strong>

            </div>

        </div>


        <!-- ACTION -->
        <div class="publish-actions">

            <button
                class="btn-primary"
                id="publish-button"
                onclick="openPublishModal()">

                Công bố điểm thi

            </button>

        </div>

    </div>

</div>


<!-- =========================
     MODAL XÁC NHẬN
========================= -->

<div id="publish-modal"
     class="modal-overlay">

    <div class="modal">

        <div class="modal-header">

            <h3>
                Xác nhận công bố điểm thi
            </h3>

            <button
                class="modal-close"
                onclick="closePublishModal()">

                ×

            </button>

        </div>


        <div class="modal-body">

            <p>
                Bạn có chắc chắn muốn công bố toàn bộ điểm thi
                của
                <strong id="confirm-exam">
                    kỳ thi
                </strong>
                -
                <strong id="confirm-subject">
                    môn thi
                </strong>
                ?
            </p>


            <div class="warning-box">

                Sau khi xác nhận, trạng thái của toàn bộ danh sách
                sẽ chuyển sang
                <strong>Đã công bố</strong>
                và thí sinh có thể tra cứu điểm thi.

            </div>

        </div>


        <div class="modal-actions">

            <button
                class="btn-secondary"
                onclick="closePublishModal()">

                Hủy

            </button>


            <button
                class="btn-primary"
                onclick="confirmPublish()">

                Xác nhận công bố

            </button>

        </div>

    </div>

</div>


<script>

/*
=====================================================
DỮ LIỆU GIẢ CHỈ DÙNG CHO PHÁC THẢO GIAO DIỆN
Sau này dữ liệu sẽ lấy từ CSDL kết quả chấm thi.
=====================================================
*/

const examData = {

    "2026-toan": {

        published: false,

        rows: [

            {
                sbd: "010001",
                maPhach: "P001",
                mon: "Toán",
                diem: "8.50"
            },

            {
                sbd: "010002",
                maPhach: "P002",
                mon: "Toán",
                diem: "7.25"
            },

            {
                sbd: "010003",
                maPhach: "P003",
                mon: "Toán",
                diem: "9.00"
            },

            {
                sbd: "010004",
                maPhach: "P004",
                mon: "Toán",
                diem: "6.75"
            }

        ]

    },


    "2026-van": {

        published: false,

        rows: [

            {
                sbd: "010001",
                maPhach: "V001",
                mon: "Ngữ văn",
                diem: "7.50"
            },

            {
                sbd: "010002",
                maPhach: "V002",
                mon: "Ngữ văn",
                diem: "8.00"
            },

            {
                sbd: "010003",
                maPhach: "V003",
                mon: "Ngữ văn",
                diem: "6.50"
            }

        ]

    },


    /*
        Dùng để minh họa Alternative Flow:
        Danh sách đã được công bố trước đó.
    */
    "2026-anh": {

        published: true,

        rows: [

            {
                sbd: "010001",
                maPhach: "A001",
                mon: "Tiếng Anh",
                diem: "9.00"
            },

            {
                sbd: "010002",
                maPhach: "A002",
                mon: "Tiếng Anh",
                diem: "8.25"
            },

            {
                sbd: "010003",
                maPhach: "A003",
                mon: "Tiếng Anh",
                diem: "7.75"
            }

        ]

    },


    "2025-toan": {

        published: true,

        rows: [

            {
                sbd: "020001",
                maPhach: "P101",
                mon: "Toán",
                diem: "8.00"
            },

            {
                sbd: "020002",
                maPhach: "P102",
                mon: "Toán",
                diem: "7.50"
            }

        ]

    }

};


/*
=====================================================
LẤY KHÓA DỮ LIỆU HIỆN TẠI
=====================================================
*/

function getCurrentKey() {

    const exam =
        document.getElementById(
            "ky-thi"
        ).value;

    const subject =
        document.getElementById(
            "mon-thi"
        ).value;

    return exam + "-" + subject;

}


/*
=====================================================
LOAD DANH SÁCH KẾT QUẢ
=====================================================
*/

function loadExamResult() {

    const key =
        getCurrentKey();

    const data =
        examData[key];

    const tableBody =
        document.getElementById(
            "result-table-body"
        );

    const button =
        document.getElementById(
            "publish-button"
        );


    /*
        Reset thông báo
    */
    hideAlert();


    /*
        Trường hợp chưa có dữ liệu
    */
    if (!data) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center; padding:30px;">
                    Chưa có kết quả chấm thi phù hợp.
                </td>
            </tr>
        `;


        document.getElementById(
            "total-result"
        ).innerText = "0";


        document.getElementById(
            "total-graded"
        ).innerText = "0";


        document.getElementById(
            "total-unpublished"
        ).innerText = "0";


        document.getElementById(
            "total-published"
        ).innerText = "0";


        setPublishStatus(false);


        button.disabled = true;

        button.innerText =
            "Không có dữ liệu";

        return;
    }


    /*
        Hiển thị dữ liệu
    */

    let rows = "";


    data.rows.forEach(
        function(item, index) {

            const publicationStatus =
                data.published
                ? `
                    <span class="status-published-text">
                        Đã công bố
                    </span>
                  `
                : `
                    <span class="status-unpublished-text">
                        Chưa công bố
                    </span>
                  `;


            rows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${item.sbd}
                    </td>

                    <td>
                        ${item.maPhach}
                    </td>

                    <td>
                        ${item.mon}
                    </td>

                    <td>
                        ${item.diem}
                    </td>

                    <td>
                        <span class="status-ready">
                            Đã chấm
                        </span>
                    </td>

                    <td>
                        ${publicationStatus}
                    </td>

                </tr>

            `;

        }
    );


    tableBody.innerHTML =
        rows;


    /*
        Cập nhật số liệu tổng hợp
    */

    document.getElementById(
        "total-result"
    ).innerText =
        data.rows.length;


    document.getElementById(
        "total-graded"
    ).innerText =
        data.rows.length;


    document.getElementById(
        "total-unpublished"
    ).innerText =
        data.published
        ? "0"
        : data.rows.length;


    document.getElementById(
        "total-published"
    ).innerText =
        data.published
        ? data.rows.length
        : "0";


    /*
        Cập nhật trạng thái
    */

    setPublishStatus(
        data.published
    );


    /*
        Alternative Flow:
        Danh sách đã được công bố.
    */

    if (data.published) {

        button.disabled = true;

        button.innerText =
            "Đã công bố";

        button.classList.add(
            "published-button"
        );

    }
    else {

        button.disabled = false;

        button.innerText =
            "Công bố điểm thi";

        button.classList.remove(
            "published-button"
        );

    }

}


/*
=====================================================
CẬP NHẬT TRẠNG THÁI CÔNG BỐ
=====================================================
*/

function setPublishStatus(
    published
) {

    const status =
        document.getElementById(
            "publish-status"
        );


    if (published) {

        status.innerText =
            "Đã công bố";

        status.className =
            "status-badge status-published";

    }
    else {

        status.innerText =
            "Chưa công bố";

        status.className =
            "status-badge status-unpublished";

    }

}


/*
=====================================================
MỞ MODAL
=====================================================
*/

function openPublishModal() {

    const key =
        getCurrentKey();

    const data =
        examData[key];


    /*
        Alternative Flow:
        Kết quả đã được công bố.
    */

    if (!data) {

        showAlert(
            "Không có kết quả chấm thi để công bố.",
            "error"
        );

        return;

    }


    if (data.published) {

        showAlert(
            "Danh sách điểm thi này đã được công bố.",
            "info"
        );

        return;

    }


    const examSelect =
        document.getElementById(
            "ky-thi"
        );


    const subjectSelect =
        document.getElementById(
            "mon-thi"
        );


    const examText =
        examSelect.options[
            examSelect.selectedIndex
        ].text;


    const subjectText =
        subjectSelect.options[
            subjectSelect.selectedIndex
        ].text;


    document.getElementById(
        "confirm-exam"
    ).innerText =
        examText;


    document.getElementById(
        "confirm-subject"
    ).innerText =
        subjectText;


    document.getElementById(
        "publish-modal"
    ).classList.add(
        "show"
    );

}


/*
=====================================================
HỦY XÁC NHẬN
Alternative Flow: Người dùng không xác nhận.
=====================================================
*/

function closePublishModal() {

    document.getElementById(
        "publish-modal"
    ).classList.remove(
        "show"
    );

}


/*
=====================================================
XÁC NHẬN CÔNG BỐ
=====================================================
*/

function confirmPublish() {

    const key =
        getCurrentKey();

    const data =
        examData[key];


    if (!data) {
        return;
    }


    closePublishModal();


    const button =
        document.getElementById(
            "publish-button"
        );


    button.disabled =
        true;


    button.innerText =
        "Đang công bố...";


    /*
        Giả lập hệ thống ghi nhận trạng thái công bố.

        Khi có database:
        PHP sẽ cập nhật trạng thái toàn bộ danh sách
        sang "Đã công bố".
    */

    setTimeout(
        function() {

            data.published =
                true;


            loadExamResult();


            showAlert(
                "Công bố điểm thi thành công. Thí sinh đã có thể tra cứu kết quả.",
                "success"
            );

        },
        700
    );

}


/*
=====================================================
THÔNG BÁO
=====================================================
*/

function showAlert(
    message,
    type
) {

    const alert =
        document.getElementById(
            "system-alert"
        );


    const text =
        document.getElementById(
            "alert-message"
        );


    text.innerText =
        message;


    alert.className =
        "system-alert " + type;

}


/*
=====================================================
ẨN THÔNG BÁO
=====================================================
*/

function hideAlert() {

    const alert =
        document.getElementById(
            "system-alert"
        );


    alert.className =
        "system-alert hidden";

}


/*
=====================================================
CLICK BÊN NGOÀI MODAL
=====================================================
*/

document
    .getElementById(
        "publish-modal"
    )
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closePublishModal();

            }

        }
    );


/*
=====================================================
LOAD LẦN ĐẦU
=====================================================
*/

loadExamResult();

</script>


<?php
require_once '../../components/layout/footer.php';
?>