<?php include '../../components/layout/header.php'; ?>

<style>
.publish-page {
    padding: 30px;
}

.publish-title {
    margin-bottom: 24px;
}

.publish-title h1 {
    font-size: 24px;
    margin-bottom: 7px;
}

.publish-title p {
    color: #7b8492;
    font-size: 13px;
}

.publish-card {
    background: #fff;
    border: 1px solid #e5e9ef;
    border-radius: 10px;
    margin-bottom: 22px;
    overflow: hidden;
}

.publish-card-header {
    padding: 18px 22px;
    border-bottom: 1px solid #edf0f4;
}

.publish-card-header h3 {
    font-size: 15px;
    margin-bottom: 4px;
}

.publish-card-header p {
    color: #8a93a1;
    font-size: 12px;
}

.table-wrap {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th {
    background: #f7f9fc;
    color: #687282;
    font-size: 11px;
    text-align: left;
    padding: 13px 16px;
    border-bottom: 1px solid #e7ebf0;
}

.data-table td {
    padding: 14px 16px;
    font-size: 12px;
    border-bottom: 1px solid #eef1f4;
}

.data-table tr:hover {
    background: #fafcff;
}

.status {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
}

.status.ready {
    background: #fff3df;
    color: #d47b16;
}

.status.published {
    background: #e4f7ed;
    color: #16865d;
}

.publish-button {
    border: 1px solid #1769e0;
    background: #fff;
    color: #1769e0;
    border-radius: 6px;
    padding: 7px 12px;
    cursor: pointer;
    font-size: 11px;
}

.publish-button:hover {
    background: #1769e0;
    color: #fff;
}

.detail-card {
    display: none;
}

.detail-card.show {
    display: block;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    padding: 20px 22px;
    background: #f8faff;
}

.detail-item span {
    display: block;
    font-size: 10px;
    color: #8d96a4;
    margin-bottom: 5px;
}

.detail-item strong {
    font-size: 13px;
}

.action-area {
    padding: 20px 22px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancel-button,
.confirm-button {
    height: 41px;
    padding: 0 18px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.cancel-button {
    background: #fff;
    border: 1px solid #d8dee7;
    color: #5f6876;
}

.confirm-button {
    background: #1769e0;
    border: none;
    color: #fff;
}

.confirm-box {
    display: none;
    margin: 0 22px 22px;
    padding: 17px;
    background: #f7faff;
    border: 1px solid #dbe5f3;
    border-radius: 8px;
}

.confirm-box.show {
    display: block;
}

.confirm-box p {
    font-size: 12px;
    color: #4f5968;
    margin-bottom: 13px;
}

.confirm-actions {
    display: flex;
    gap: 9px;
}

.confirm-actions button {
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
}

.no-button {
    background: #fff;
    border: 1px solid #d8dee7;
}

.yes-button {
    background: #1769e0;
    color: #fff;
    border: none;
}

.message {
    display: none;
    margin: 0 22px 20px;
    padding: 12px 15px;
    border-radius: 7px;
    font-size: 12px;
}

.message.info {
    display: block;
    background: #eef5ff;
    color: #1769e0;
    border: 1px solid #d8e8ff;
}

.message.success {
    display: block;
    background: #ecfaf3;
    color: #16865d;
    border: 1px solid #ccefdc;
}

.message.error {
    display: block;
    background: #fff0f0;
    color: #c23939;
    border: 1px solid #ffd6d6;
}

@media(max-width: 900px) {
    .detail-grid {
        grid-template-columns: 1fr 1fr;
    }
}
</style>


<section class="publish-page">

    <div class="publish-title">
        <h1>Công bố điểm thi</h1>

        <p>
            Quản lý và công bố kết quả thi
            để học sinh có thể tra cứu điểm.
        </p>
    </div>


    <!-- BASIC FLOW: bước 2 -->
    <div class="publish-card">

        <div class="publish-card-header">
            <h3>Danh sách kết quả thi</h3>

            <p>
                Chọn kết quả thi cần công bố.
            </p>
        </div>


        <div class="table-wrap">

            <table class="data-table">

                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Kỳ thi</th>
                        <th>Môn thi</th>
                        <th>Số bài thi</th>
                        <th>Trạng thái công bố</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>


                <tbody>

                    <tr>
                        <td>1</td>

                        <td>
                            Tuyển sinh lớp 10 - 2026
                        </td>

                        <td>
                            Toán
                        </td>

                        <td>
                            420
                        </td>

                        <td>
                            <span
                                id="status-toan"
                                class="status ready">
                                Sẵn sàng công bố
                            </span>
                        </td>

                        <td>
                            <button
                                class="publish-button"
                                onclick="
                                chonKetQua(
                                    'toan',
                                    'Tuyển sinh lớp 10 - 2026',
                                    'Toán',
                                    '420'
                                )">
                                Công bố
                            </button>
                        </td>
                    </tr>


                    <tr>
                        <td>2</td>

                        <td>
                            Tuyển sinh lớp 10 - 2026
                        </td>

                        <td>
                            Ngữ văn
                        </td>

                        <td>
                            420
                        </td>

                        <td>
                            <span
                                id="status-van"
                                class="status ready">
                                Sẵn sàng công bố
                            </span>
                        </td>

                        <td>
                            <button
                                class="publish-button"
                                onclick="
                                chonKetQua(
                                    'van',
                                    'Tuyển sinh lớp 10 - 2026',
                                    'Ngữ văn',
                                    '420'
                                )">
                                Công bố
                            </button>
                        </td>
                    </tr>


                    <!-- dùng để test Alternative Flow 4.1 -->
                    <tr>
                        <td>3</td>

                        <td>
                            Tuyển sinh lớp 10 - 2026
                        </td>

                        <td>
                            Tiếng Anh
                        </td>

                        <td>
                            420
                        </td>

                        <td>
                            <span
                                id="status-anh"
                                class="status published">
                                Đã công bố
                            </span>
                        </td>

                        <td>
                            <button
                                class="publish-button"
                                onclick="
                                chonKetQua(
                                    'anh',
                                    'Tuyển sinh lớp 10 - 2026',
                                    'Tiếng Anh',
                                    '420'
                                )">
                                Công bố
                            </button>
                        </td>
                    </tr>

                </tbody>

            </table>

        </div>

    </div>



    <!-- BASIC FLOW: bước 4 -->
    <div
        id="detailCard"
        class="publish-card detail-card">

        <div class="publish-card-header">
            <h3>Thông tin kết quả thi</h3>

            <p>
                Kiểm tra thông tin trước khi công bố.
            </p>
        </div>


        <div class="detail-grid">

            <div class="detail-item">
                <span>KỲ THI</span>
                <strong id="detailExam">-</strong>
            </div>


            <div class="detail-item">
                <span>MÔN THI</span>
                <strong id="detailSubject">-</strong>
            </div>


            <div class="detail-item">
                <span>SỐ BÀI THI</span>
                <strong id="detailCount">-</strong>
            </div>


            <div class="detail-item">
                <span>TRẠNG THÁI</span>
                <strong id="detailStatus">-</strong>
            </div>

        </div>


        <div id="message" class="message">
        </div>


        <!-- BASIC FLOW: bước 5 -->
        <div class="action-area">

            <button
                class="cancel-button"
                onclick="huy()">
                Hủy
            </button>


            <button
                class="confirm-button"
                onclick="yeuCauXacNhan()">
                Công bố điểm thi
            </button>

        </div>



        <!-- BASIC FLOW: bước 6 -->
        <div
            id="confirmBox"
            class="confirm-box">

            <p>
                Bạn có chắc chắn muốn công bố
                kết quả thi này không?
            </p>


            <div class="confirm-actions">

                <!-- Alternative Flow 7.1 -->
                <button
                    class="no-button"
                    onclick="khongXacNhan()">
                    Không
                </button>


                <!-- Basic Flow bước 7 -->
                <button
                    class="yes-button"
                    onclick="xacNhanCongBo()">
                    Xác nhận công bố
                </button>

            </div>

        </div>

    </div>

</section>


<script>

let selectedId = "";



function chonKetQua(
    id,
    kyThi,
    monThi,
    soBai
) {

    const statusElement =
        document.getElementById(
            "status-" + id
        );


    const status =
        statusElement.innerText.trim();


    const message =
        document.getElementById(
            "message"
        );


    message.className = "message";
    message.innerHTML = "";


    document.getElementById(
        "confirmBox"
    ).classList.remove("show");



    /*
        Alternative Flow 4.1
        Kết quả thi đã được công bố.
    */
    if (status === "Đã công bố") {

        document.getElementById(
            "detailCard"
        ).classList.add("show");


        document.getElementById(
            "detailExam"
        ).innerText = kyThi;


        document.getElementById(
            "detailSubject"
        ).innerText = monThi;


        document.getElementById(
            "detailCount"
        ).innerText = soBai;


        document.getElementById(
            "detailStatus"
        ).innerText = status;


        message.className =
            "message info";


        message.innerHTML =
            "Kết quả thi này đã được công bố. Vui lòng chọn kết quả thi khác.";


        return;

    }



    selectedId = id;


    document.getElementById(
        "detailExam"
    ).innerText = kyThi;


    document.getElementById(
        "detailSubject"
    ).innerText = monThi;


    document.getElementById(
        "detailCount"
    ).innerText = soBai;


    document.getElementById(
        "detailStatus"
    ).innerText = status;


    document.getElementById(
        "detailCard"
    ).classList.add("show");


    document.getElementById(
        "detailCard"
    ).scrollIntoView({
        behavior: "smooth"
    });

}



/*
    Basic Flow bước 6:
    hệ thống yêu cầu xác nhận.
*/
function yeuCauXacNhan() {

    if (!selectedId) {
        return;
    }


    document.getElementById(
        "confirmBox"
    ).classList.add("show");

}



/*
    Alternative Flow 7.1:
    Ban Tuyển sinh không xác nhận công bố.
*/
function khongXacNhan() {

    document.getElementById(
        "confirmBox"
    ).classList.remove("show");


    const message =
        document.getElementById(
            "message"
        );


    message.className =
        "message info";


    message.innerHTML =
        "Đã hủy công bố. Trạng thái kết quả thi được giữ nguyên.";

}



/*
    Basic Flow bước 8 và 9.
    Hiện tại dùng dữ liệu mẫu,
    chưa kết nối database.
*/
function xacNhanCongBo() {

    if (!selectedId) {
        return;
    }


    const status =
        document.getElementById(
            "status-" + selectedId
        );


    /*
        Khi nối database:
        hệ thống sẽ lưu trạng thái
        Đã công bố vào CSDL.

        Nếu lưu thất bại thì xử lý
        Exception Flow 8.1.
    */


    status.innerText =
        "Đã công bố";


    status.className =
        "status published";


    document.getElementById(
        "detailStatus"
    ).innerText =
        "Đã công bố";


    document.getElementById(
        "confirmBox"
    ).classList.remove("show");


    const message =
        document.getElementById(
            "message"
        );


    message.className =
        "message success";


    message.innerHTML =
        "Công bố điểm thi thành công.";


    selectedId = "";

}



/*
    Hủy thao tác và giữ nguyên dữ liệu.
*/
function huy() {

    document.getElementById(
        "detailCard"
    ).classList.remove("show");


    document.getElementById(
        "confirmBox"
    ).classList.remove("show");


    selectedId = "";

}

</script>


<?php include '../../components/layout/footer.php'; ?>