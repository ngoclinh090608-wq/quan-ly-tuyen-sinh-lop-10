<?php
$pageTitle = "Công bố kết quả tuyển sinh";

require_once '../../components/layout/header.php';
?>

<link rel="stylesheet"
      href="../../assets/css/cong-bo-ket-qua-tuyen-sinh.css">


<div class="publish-page">

    <!-- HEADER -->
    <div class="page-header">

        <div>
            <h1>Công bố kết quả tuyển sinh</h1>

            <p>
                Kiểm tra và công khai kết quả tuyển sinh để thí sinh tra cứu
            </p>
        </div>

    </div>


    <!-- THÔNG TIN CÔNG BỐ -->
    <div class="publish-card">

        <div class="card-header">

            <div>
                <h2>Thông tin công bố</h2>

                <p>
                    Chọn năm và đợt tuyển sinh cần công bố
                </p>
            </div>

        </div>


        <div class="form-grid">

            <!-- Năm tuyển sinh -->
            <div class="form-group">

                <label for="nam-tuyen-sinh">
                    Năm tuyển sinh
                </label>

                <select id="nam-tuyen-sinh"
                        onchange="loadAdmissionResult()">

                    <option value="2026">
                        2026
                    </option>

                    <option value="2025">
                        2025
                    </option>

                    <option value="2024">
                        2024
                    </option>

                </select>

            </div>


            <!-- Đợt tuyển sinh -->
            <div class="form-group">

                <label for="dot-tuyen-sinh">
                    Đợt tuyển sinh
                </label>

                <select id="dot-tuyen-sinh"
                        onchange="loadAdmissionResult()">

                    <option value="1">
                        Đợt 1
                    </option>

                    <option value="2">
                        Đợt 2
                    </option>

                </select>

            </div>

        </div>


        <!-- TRẠNG THÁI -->
        <div class="status-row">

            <span class="status-label">
                Trạng thái công bố:
            </span>

            <span id="publish-status"
                  class="status-badge status-unpublished">

                Chưa công bố

            </span>

        </div>

    </div>


    <!-- DANH SÁCH KẾT QUẢ -->
    <div class="publish-card">

        <div class="result-header">

            <div>

                <h2>
                    Danh sách kết quả tuyển sinh
                </h2>

                <p>
                    Kết quả xét tuyển đã được phê duyệt
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

                        <th>Mã thí sinh</th>

                        <th>Họ và tên</th>

                        <th>Trường THPT</th>

                        <th>Nguyện vọng</th>

                        <th>Điểm xét tuyển</th>

                        <th>Kết quả</th>

                    </tr>

                </thead>


                <tbody id="result-table-body">

                    <tr>

                        <td>1</td>

                        <td>TS001</td>

                        <td>Nguyễn Văn An</td>

                        <td>
                            THPT Nguyễn Thị Minh Khai
                        </td>

                        <td>NV1</td>

                        <td>38.50</td>

                        <td>
                            <span class="result-pass">
                                Trúng tuyển
                            </span>
                        </td>

                    </tr>


                    <tr>

                        <td>2</td>

                        <td>TS002</td>

                        <td>Trần Thị Bình</td>

                        <td>
                            THPT Lê Hồng Phong
                        </td>

                        <td>NV1</td>

                        <td>35.00</td>

                        <td>
                            <span class="result-pass">
                                Trúng tuyển
                            </span>
                        </td>

                    </tr>


                    <tr>

                        <td>3</td>

                        <td>TS003</td>

                        <td>Lê Văn Cường</td>

                        <td>
                            THPT Trần Phú
                        </td>

                        <td>NV2</td>

                        <td>27.50</td>

                        <td>
                            <span class="result-fail">
                                Không trúng tuyển
                            </span>
                        </td>

                    </tr>


                    <tr>

                        <td>4</td>

                        <td>TS004</td>

                        <td>Phạm Thị Dung</td>

                        <td>
                            THPT Nguyễn Thị Minh Khai
                        </td>

                        <td>NV1</td>

                        <td>40.00</td>

                        <td>
                            <span class="result-pass">
                                Trúng tuyển
                            </span>
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>


        <!-- SUMMARY -->
        <div class="summary">

            <div class="summary-item">

                <span>Tổng số thí sinh</span>

                <strong id="total-student">
                    250
                </strong>

            </div>


            <div class="summary-item">

                <span>Trúng tuyển</span>

                <strong id="total-pass">
                    180
                </strong>

            </div>


            <div class="summary-item">

                <span>Không trúng tuyển</span>

                <strong id="total-fail">
                    70
                </strong>

            </div>

        </div>


        <!-- ACTION -->
        <div class="publish-actions">

            <button
                class="btn-primary"
                id="publish-button"
                onclick="openPublishModal()">

                Công bố kết quả

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
                Xác nhận công bố kết quả
            </h3>

            <button
                class="modal-close"
                onclick="closePublishModal()">

                ×

            </button>

        </div>


        <div class="modal-body">

            <p>
                Bạn có chắc chắn muốn công bố kết quả tuyển sinh
                <strong id="confirm-year">
                    năm 2026
                </strong>
                -
                <strong id="confirm-round">
                    Đợt 1
                </strong>
                ?
            </p>


            <div class="warning-box">

                Sau khi xác nhận, kết quả sẽ được công khai
                trên hệ thống để thí sinh tra cứu.

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

/* =========================
   LOAD RESULT
========================= */

function loadAdmissionResult() {

    const year =
        document.getElementById(
            'nam-tuyen-sinh'
        ).value;

    const round =
        document.getElementById(
            'dot-tuyen-sinh'
        ).value;


    document.getElementById(
        'result-table-body'
    ).style.opacity = '0.5';


    setTimeout(function () {

        document.getElementById(
            'result-table-body'
        ).style.opacity = '1';

        document.getElementById(
            'result-table-body'
        ).innerHTML = `

            <tr>

                <td>1</td>

                <td>TS001</td>

                <td>Nguyễn Văn An</td>

                <td>
                    THPT Nguyễn Thị Minh Khai
                </td>

                <td>NV1</td>

                <td>38.50</td>

                <td>
                    <span class="result-pass">
                        Trúng tuyển
                    </span>
                </td>

            </tr>

            <tr>

                <td>2</td>

                <td>TS002</td>

                <td>Trần Thị Bình</td>

                <td>
                    THPT Lê Hồng Phong
                </td>

                <td>NV1</td>

                <td>35.00</td>

                <td>
                    <span class="result-pass">
                        Trúng tuyển
                    </span>
                </td>

            </tr>

            <tr>

                <td>3</td>

                <td>TS003</td>

                <td>Lê Văn Cường</td>

                <td>
                    THPT Trần Phú
                </td>

                <td>NV2</td>

                <td>27.50</td>

                <td>
                    <span class="result-fail">
                        Không trúng tuyển
                    </span>
                </td>

            </tr>

        `;

    }, 300);

}


/* =========================
   OPEN MODAL
========================= */

function openPublishModal() {

    const year =
        document.getElementById(
            'nam-tuyen-sinh'
        ).value;

    const round =
        document.getElementById(
            'dot-tuyen-sinh'
        );

    const roundText =
        round.options[
            round.selectedIndex
        ].text;


    document.getElementById(
        'confirm-year'
    ).innerText =
        'năm ' + year;


    document.getElementById(
        'confirm-round'
    ).innerText =
        roundText;


    document.getElementById(
        'publish-modal'
    ).classList.add('show');

}


/* =========================
   CLOSE MODAL
========================= */

function closePublishModal() {

    document.getElementById(
        'publish-modal'
    ).classList.remove('show');

}


/* =========================
   CONFIRM PUBLISH
========================= */

function confirmPublish() {

    closePublishModal();


    const button =
        document.getElementById(
            'publish-button'
        );


    button.disabled = true;

    button.innerText =
        'Đang công bố...';


    setTimeout(function () {

        document.getElementById(
            'publish-status'
        ).innerText =
            'Đã công bố';


        document.getElementById(
            'publish-status'
        ).className =
            'status-badge status-published';


        button.innerText =
            'Đã công bố';


        button.classList.add(
            'published-button'
        );


        showAlert(
            'Công bố kết quả tuyển sinh thành công.',
            'success'
        );


    }, 800);

}


/* =========================
   ALERT
========================= */

function showAlert(message, type) {

    const alert =
        document.getElementById(
            'system-alert'
        );

    const text =
        document.getElementById(
            'alert-message'
        );


    text.innerText = message;

    alert.className =
        'system-alert ' + type;


}


/* =========================
   CLOSE MODAL WHEN CLICK
========================= */

document
    .getElementById('publish-modal')
    .addEventListener(
        'click',
        function(event) {

            if (
                event.target === this
            ) {

                closePublishModal();

            }

        }
    );

</script>


<?php
require_once '../../components/layout/footer.php';
?>