<?php
include '../../components/layout/header.php';
?>

<style>
    /* =========================================
       CSS RIÊNG UC10 - PHÂN CÔNG COI THI
       KHÔNG THAY ĐỔI STYLE.CSS CỦA NHÓM
    ========================================= */

    .uc10-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        align-items: start;
    }

    .uc10-field {
        margin-top: 18px;
    }

    .uc10-field label {
        display: block;
        margin-bottom: 8px;

        color: #394252;
        font-size: 12px;
        font-weight: 600;
    }

    .uc10-field select {
        width: 100%;
        height: 45px;

        padding: 0 13px;

        border: 1px solid #d9dee7;
        border-radius: 7px;

        background: #ffffff;
        color: #394252;

        font-family: inherit;
        font-size: 13px;

        outline: none;
        cursor: pointer;
    }

    .uc10-field select:focus {
        border-color: #1769e0;
        box-shadow: 0 0 0 3px rgba(23, 105, 224, 0.08);
    }

    .uc10-field select:disabled {
        background: #f5f6f8;
        color: #9aa1ac;
        cursor: not-allowed;
    }

    .uc10-officer-list {
        margin-top: 18px;
    }

    .uc10-officer-list > label {
        display: block;
        margin-bottom: 8px;

        color: #394252;
        font-size: 12px;
        font-weight: 600;
    }

    .uc10-officer-box {
        border: 1px solid #e4e8ee;
        border-radius: 8px;

        overflow: hidden;
    }

    .uc10-officer {
        display: flex;
        align-items: center;
        gap: 12px;

        padding: 14px;

        border-bottom: 1px solid #eef0f4;

        cursor: pointer;
    }

    .uc10-officer:last-child {
        border-bottom: none;
    }

    .uc10-officer:hover {
        background: #f8fbff;
    }

    .uc10-officer input {
        width: 16px;
        height: 16px;

        cursor: pointer;
    }

    .uc10-officer-info {
        flex: 1;
    }

    .uc10-officer-info strong {
        display: block;

        margin-bottom: 4px;

        color: #252b36;
        font-size: 13px;
    }

    .uc10-officer-info span {
        color: #8a93a3;
        font-size: 11px;
    }

    .uc10-actions {
        margin-top: 20px;

        display: flex;
        justify-content: flex-end;
    }

    .uc10-message {
        display: none;

        margin-top: 20px;
        padding: 15px 18px;

        border-radius: 8px;

        font-size: 12px;
        line-height: 1.5;
    }

    .uc10-message.error {
        background: #fff5f5;
        border: 1px solid #ffdada;
        color: #c33d3d;
    }

    .uc10-message.success {
        background: #edf9f4;
        border: 1px solid #d3f1e3;
        color: #147a52;
    }

    .uc10-result {
        display: none;
        margin-top: 20px;
    }

    .uc10-summary {
        display: flex;
        gap: 60px;

        padding: 18px 0;

        border-bottom: 1px solid #eef0f4;
    }

    .uc10-summary-item span {
        display: block;

        margin-bottom: 5px;

        color: #929aa7;
        font-size: 11px;
    }

    .uc10-summary-item strong {
        color: #252b36;
        font-size: 13px;
    }

    .uc10-table {
        width: 100%;
        margin-top: 10px;

        border-collapse: collapse;
    }

    .uc10-table th {
        padding: 13px 12px;

        text-align: left;

        background: #f8fafc;
        color: #596273;

        border-bottom: 1px solid #e7eaf0;

        font-size: 12px;
    }

    .uc10-table td {
        padding: 14px 12px;

        color: #394252;

        border-bottom: 1px solid #eef0f4;

        font-size: 12px;
    }

    @media (max-width: 900px) {

        .uc10-layout {
            grid-template-columns: 1fr;
        }

        .uc10-summary {
            flex-direction: column;
            gap: 15px;
        }
    }
</style>


<section class="content">

    <!-- TIÊU ĐỀ -->
    <div class="page-heading">

        <div>
            <h1>Phân công coi thi</h1>

            <p>
                Phân công cán bộ/giám thị coi thi theo điểm thi và phòng thi.
            </p>
        </div>

    </div>


    <div class="uc10-layout">

        <!-- BÊN TRÁI: CHỌN ĐIỂM THI VÀ PHÒNG THI -->
        <div class="panel">

            <div class="panel-header">

                <div>
                    <h3>Thông tin phòng thi</h3>

                    <p>
                        Chọn điểm thi và phòng thi cần phân công.
                    </p>
                </div>

            </div>


            <!-- ĐIỂM THI -->
            <div class="uc10-field">

                <label>Điểm thi</label>

                <select
                    id="examLocation"
                    onchange="loadRooms()">

                    <option value="">
                        -- Chọn điểm thi --
                    </option>

                    <option value="THPT Nguyễn Thị Minh Khai">
                        THPT Nguyễn Thị Minh Khai
                    </option>

                    <option value="THPT Bùi Thị Xuân">
                        THPT Bùi Thị Xuân
                    </option>

                    <option value="THPT Lê Quý Đôn">
                        THPT Lê Quý Đôn
                    </option>

                </select>

            </div>


            <!-- PHÒNG THI -->
            <div class="uc10-field">

                <label>Phòng thi</label>

                <select
                    id="examRoom"
                    disabled>

                    <option value="">
                        -- Chọn phòng thi --
                    </option>

                </select>

            </div>

        </div>


        <!-- BÊN PHẢI: DANH SÁCH GIÁM THỊ -->
        <div class="panel">

            <div class="panel-header">

                <div>
                    <h3>Danh sách cán bộ/giám thị</h3>

                    <p>
                        Chọn cán bộ/giám thị cần phân công.
                    </p>
                </div>

            </div>


            <div class="uc10-officer-list">

                <label>
                    Cán bộ/giám thị phục vụ coi thi
                </label>


                <div class="uc10-officer-box">

                    <label class="uc10-officer">

                        <input
                            type="checkbox"
                            name="officer"
                            value="Nguyễn Văn Minh"
                            data-code="CB001">

                        <div class="uc10-officer-info">

                            <strong>
                                Nguyễn Văn Minh
                            </strong>

                            <span>
                                Mã cán bộ: CB001
                            </span>

                        </div>

                    </label>


                    <label class="uc10-officer">

                        <input
                            type="checkbox"
                            name="officer"
                            value="Trần Thị Hương"
                            data-code="CB002">

                        <div class="uc10-officer-info">

                            <strong>
                                Trần Thị Hương
                            </strong>

                            <span>
                                Mã cán bộ: CB002
                            </span>

                        </div>

                    </label>


                    <label class="uc10-officer">

                        <input
                            type="checkbox"
                            name="officer"
                            value="Lê Văn Thành"
                            data-code="CB003">

                        <div class="uc10-officer-info">

                            <strong>
                                Lê Văn Thành
                            </strong>

                            <span>
                                Mã cán bộ: CB003
                            </span>

                        </div>

                    </label>


                    <label class="uc10-officer">

                        <input
                            type="checkbox"
                            name="officer"
                            value="Phạm Thị Lan"
                            data-code="CB004">

                        <div class="uc10-officer-info">

                            <strong>
                                Phạm Thị Lan
                            </strong>

                            <span>
                                Mã cán bộ: CB004
                            </span>

                        </div>

                    </label>

                </div>

            </div>


            <!-- XÁC NHẬN -->
            <div class="uc10-actions">

                <button
                    type="button"
                    class="primary-button"
                    onclick="saveAssignment()">

                    Xác nhận phân công

                </button>

            </div>

        </div>

    </div>


    <!-- THÔNG BÁO KHÔNG HỢP LỆ -->
    <div
        id="errorMessage"
        class="uc10-message error">

        Thông tin phân công không hợp lệ.
        Vui lòng chọn đầy đủ điểm thi, phòng thi và cán bộ/giám thị.

    </div>


    <!-- THÔNG BÁO THÀNH CÔNG -->
    <div
        id="successMessage"
        class="uc10-message success">

        Phân công coi thi thành công.

    </div>


    <!-- THÔNG TIN SAU KHI LƯU -->
    <div
        id="resultPanel"
        class="panel uc10-result">

        <div class="panel-header">

            <div>
                <h3>Thông tin phân công coi thi</h3>

                <p>
                    Thông tin phân công coi thi đã được lưu.
                </p>
            </div>

            <span class="status success">
                Đã phân công
            </span>

        </div>


        <!-- THÔNG TIN ĐIỂM THI -->
        <div class="uc10-summary">

            <div class="uc10-summary-item">

                <span>Điểm thi</span>

                <strong id="resultLocation">
                </strong>

            </div>


            <div class="uc10-summary-item">

                <span>Phòng thi</span>

                <strong id="resultRoom">
                </strong>

            </div>

        </div>


        <!-- DANH SÁCH PHÂN CÔNG -->
        <div style="overflow-x: auto;">

            <table class="uc10-table">

                <thead>

                    <tr>
                        <th>STT</th>
                        <th>Mã cán bộ</th>
                        <th>Họ và tên</th>
                        <th>Phòng thi</th>
                        <th>Trạng thái</th>
                    </tr>

                </thead>


                <tbody id="assignmentTable">
                </tbody>

            </table>

        </div>

    </div>

</section>


<script>

    /*
        Bước 3 - 4:
        Chọn điểm thi và hệ thống cung cấp danh sách phòng thi.
    */
    function loadRooms() {

        const location =
            document.getElementById("examLocation").value;

        const roomSelect =
            document.getElementById("examRoom");


        roomSelect.innerHTML =
            '<option value="">-- Chọn phòng thi --</option>';


        if (location === "") {

            roomSelect.disabled = true;

            return;
        }


        roomSelect.disabled = false;


        const rooms = [
            "Phòng 101",
            "Phòng 102",
            "Phòng 103",
            "Phòng 104"
        ];


        rooms.forEach(function(room) {

            const option =
                document.createElement("option");

            option.value = room;

            option.textContent = room;

            roomSelect.appendChild(option);

        });


        /*
            Khi đổi điểm thi,
            ẩn kết quả phân công cũ.
        */
        document.getElementById("resultPanel")
            .style.display = "none";

        document.getElementById("successMessage")
            .style.display = "none";

        document.getElementById("errorMessage")
            .style.display = "none";
    }



    /*
        Bước 7 - 10:
        Xác nhận, kiểm tra và lưu phân công.
    */
    function saveAssignment() {

        const location =
            document.getElementById("examLocation").value;

        const room =
            document.getElementById("examRoom").value;

        const selectedOfficers =
            document.querySelectorAll(
                'input[name="officer"]:checked'
            );


        /*
            Alternative Flow 8.1:
            Thông tin phân công không hợp lệ.
        */
        if (
            location === "" ||
            room === "" ||
            selectedOfficers.length === 0
        ) {

            document.getElementById("errorMessage")
                .style.display = "block";

            document.getElementById("successMessage")
                .style.display = "none";

            document.getElementById("resultPanel")
                .style.display = "none";

            return;
        }


        /*
            Thông tin hợp lệ.
        */
        document.getElementById("errorMessage")
            .style.display = "none";


        /*
            Hiển thị điểm thi và phòng thi đã lưu.
        */
        document.getElementById("resultLocation")
            .innerText = location;

        document.getElementById("resultRoom")
            .innerText = room;


        /*
            Tạo danh sách cán bộ/giám thị đã phân công.
        */
        const assignmentTable =
            document.getElementById("assignmentTable");


        assignmentTable.innerHTML = "";


        selectedOfficers.forEach(
            function(officer, index) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>${index + 1}</td>

                    <td>
                        ${officer.dataset.code}
                    </td>

                    <td>
                        ${officer.value}
                    </td>

                    <td>
                        ${room}
                    </td>

                    <td>
                        <span class="status success">
                            Đã phân công
                        </span>
                    </td>
                `;


                assignmentTable.appendChild(row);

            }
        );


        /*
            Bước 10:
            Thông báo phân công thành công.
        */
        document.getElementById("successMessage")
            .style.display = "block";


        /*
            Bước 11:
            Xem thông tin phân công đã lưu.
        */
        document.getElementById("resultPanel")
            .style.display = "block";


        document.getElementById("resultPanel")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }

</script>


<?php
include '../../components/layout/footer.php';
?>