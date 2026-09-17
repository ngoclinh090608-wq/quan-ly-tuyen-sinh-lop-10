<?php
include '../../components/layout/header.php';
?>

<style>
    /* CSS RIÊNG CHO UC8 - KHÔNG ẢNH HƯỞNG FILE STYLE.CSS CỦA NHÓM */

    .uc8-filter {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 18px;
        align-items: end;
        margin-top: 20px;
    }

    .uc8-field label {
        display: block;
        margin-bottom: 8px;
        color: #394252;
        font-size: 12px;
        font-weight: 600;
    }

    .uc8-field select {
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

    .uc8-field select:focus {
        border-color: #1769e0;
        box-shadow: 0 0 0 3px rgba(23, 105, 224, 0.08);
    }

    .uc8-search-button {
        height: 45px;
        min-width: 110px;
    }

    .uc8-result {
        margin-top: 20px;
    }

    .uc8-summary {
        display: flex;
        gap: 60px;

        padding: 18px 0;
        margin-bottom: 5px;

        border-bottom: 1px solid #eef0f4;
    }

    .uc8-summary-item {
        min-width: 200px;
    }

    .uc8-summary-item span {
        display: block;
        margin-bottom: 5px;

        color: #929aa7;
        font-size: 11px;
    }

    .uc8-summary-item strong {
        color: #252b36;
        font-size: 13px;
    }

    .uc8-table-wrapper {
        width: 100%;
        overflow-x: auto;
    }

    .uc8-table {
        width: 100%;
        border-collapse: collapse;
    }

    .uc8-table th {
        padding: 14px 12px;

        text-align: left;

        color: #596273;
        background: #f8fafc;

        font-size: 12px;
        font-weight: 600;

        border-bottom: 1px solid #e7eaf0;
    }

    .uc8-table td {
        padding: 14px 12px;

        color: #394252;
        font-size: 12px;

        border-bottom: 1px solid #eef0f4;
    }

    .uc8-table tbody tr:hover {
        background: #f8fbff;
    }

    .uc8-compare {
        margin-top: 22px;
        padding: 18px;

        background: #f7f9fc;

        border: 1px solid #edf0f4;
        border-radius: 8px;
    }

    .uc8-compare h4 {
        margin-bottom: 9px;
        font-size: 13px;
    }

    .uc8-compare p {
        margin-top: 5px;

        color: #667080;

        font-size: 12px;
        line-height: 1.6;
    }

    .uc8-error {
        display: none;

        margin-top: 20px;
        padding: 16px 18px;

        background: #fff5f5;

        border: 1px solid #ffdada;
        border-radius: 8px;
    }

    .uc8-error strong {
        display: block;
        margin-bottom: 5px;

        color: #d14343;
        font-size: 13px;
    }

    .uc8-error p {
        color: #7a5252;
        font-size: 12px;
    }

    @media (max-width: 900px) {
        .uc8-filter {
            grid-template-columns: 1fr;
        }

        .uc8-search-button {
            width: 100%;
        }

        .uc8-summary {
            flex-direction: column;
            gap: 15px;
        }
    }
</style>


<section class="content">

    <!-- TIÊU ĐỀ -->
    <div class="page-heading">

        <div>
            <h1>Tra cứu thông tin lô bài thi</h1>

            <p>
                Tra cứu thông tin theo điểm thi và phòng thi
                để phục vụ công tác đối chiếu bài thi.
            </p>
        </div>

    </div>


    <!-- PHẦN TRA CỨU -->
    <div class="panel">

        <div class="panel-header">

            <div>
                <h3>Thông tin tra cứu</h3>

                <p>
                    Chọn điểm thi và phòng thi cần tra cứu.
                </p>
            </div>

        </div>


        <div class="uc8-filter">

            <!-- ĐIỂM THI -->
            <div class="uc8-field">

                <label>Điểm thi</label>

                <select id="examLocation"
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
            <div class="uc8-field">

                <label>Phòng thi</label>

                <select id="examRoom">

                    <option value="">
                        -- Chọn phòng thi --
                    </option>

                </select>

            </div>


            <!-- NÚT TRA CỨU -->
            <div>

                <button
                    type="button"
                    class="primary-button uc8-search-button"
                    onclick="searchCandidates()">

                    Tra cứu

                </button>

            </div>

        </div>

    </div>


    <!-- THÔNG BÁO LỖI -->
    <div id="errorMessage"
         class="uc8-error">

        <strong>
            Không thể thực hiện tra cứu
        </strong>

        <p id="errorText"></p>

    </div>


    <!-- KẾT QUẢ TRA CỨU -->
    <div id="resultPanel"
         class="panel uc8-result"
         style="display: none;">

        <div class="panel-header">

            <div>

                <h3>
                    Danh sách thí sinh theo phòng thi
                </h3>

                <p>
                    Thông tin phục vụ đối chiếu với bài thi
                    thực tế được bàn giao.
                </p>

            </div>


            <span class="status success">
                <span id="candidateCount">0</span>
                thí sinh
            </span>

        </div>


        <!-- THÔNG TIN ĐIỂM THI VÀ PHÒNG THI -->
        <div class="uc8-summary">

            <div class="uc8-summary-item">

                <span>Điểm thi</span>

                <strong id="selectedLocation">
                </strong>

            </div>


            <div class="uc8-summary-item">

                <span>Phòng thi</span>

                <strong id="selectedRoom">
                </strong>

            </div>

        </div>


        <!-- DANH SÁCH THÍ SINH -->
        <div class="uc8-table-wrapper">

            <table class="uc8-table">

                <thead>

                    <tr>
                        <th>STT</th>

                        <th>Số báo danh</th>

                        <th>Họ và tên</th>

                        <th>Ngày sinh</th>

                        <th>Phòng thi</th>

                        <th>Trạng thái dự thi</th>
                    </tr>

                </thead>


                <tbody>

                    <tr>
                        <td>1</td>

                        <td>100001</td>

                        <td>Nguyễn Văn An</td>

                        <td>12/03/2011</td>

                        <td class="room-value"></td>

                        <td>
                            <span class="status success">
                                Có mặt
                            </span>
                        </td>
                    </tr>


                    <tr>
                        <td>2</td>

                        <td>100002</td>

                        <td>Trần Thị Bình</td>

                        <td>24/07/2011</td>

                        <td class="room-value"></td>

                        <td>
                            <span class="status success">
                                Có mặt
                            </span>
                        </td>
                    </tr>


                    <tr>
                        <td>3</td>

                        <td>100003</td>

                        <td>Lê Hoàng Minh</td>

                        <td>05/11/2011</td>

                        <td class="room-value"></td>

                        <td>
                            <span class="status success">
                                Có mặt
                            </span>
                        </td>
                    </tr>


                    <tr>
                        <td>4</td>

                        <td>100004</td>

                        <td>Phạm Gia Hân</td>

                        <td>18/09/2011</td>

                        <td class="room-value"></td>

                        <td>
                            <span class="status success">
                                Có mặt
                            </span>
                        </td>
                    </tr>

                </tbody>

            </table>

        </div>


        <!-- THÔNG TIN ĐỐI CHIẾU -->
        <div class="uc8-compare">

            <h4>
                Thông tin phục vụ đối chiếu
            </h4>

            <p>
                Tổng số thí sinh trong danh sách:
                <strong id="totalCandidates">4</strong>
            </p>

            <p>
                Bộ phận cắt phách sử dụng danh sách trên
                để đối chiếu với bài thi thực tế được bàn giao.
            </p>

        </div>

    </div>

</section>


<script>

    /*
        Khi chọn điểm thi
        hệ thống cung cấp danh sách phòng thi.
    */
    function loadRooms() {

        const examLocation =
            document.getElementById("examLocation").value;

        const examRoom =
            document.getElementById("examRoom");


        examRoom.innerHTML =
            '<option value="">-- Chọn phòng thi --</option>';


        if (examLocation !== "") {

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

                examRoom.appendChild(option);

            });

        }


        document.getElementById("resultPanel")
            .style.display = "none";

        document.getElementById("errorMessage")
            .style.display = "none";
    }



    /*
        Thực hiện tra cứu.
    */
    function searchCandidates() {

        const examLocation =
            document.getElementById("examLocation").value;

        const examRoom =
            document.getElementById("examRoom").value;


        const errorMessage =
            document.getElementById("errorMessage");

        const resultPanel =
            document.getElementById("resultPanel");


        /*
            Không chọn điểm thi.
        */
        if (examLocation === "") {

            document.getElementById("errorText")
                .innerText =
                "Vui lòng chọn điểm thi cần tra cứu.";

            errorMessage.style.display = "block";

            resultPanel.style.display = "none";

            return;
        }


        /*
            Không chọn phòng thi.
        */
        if (examRoom === "") {

            document.getElementById("errorText")
                .innerText =
                "Vui lòng chọn phòng thi cần tra cứu.";

            errorMessage.style.display = "block";

            resultPanel.style.display = "none";

            return;
        }


        /*
            Điều kiện hợp lệ.
        */
        errorMessage.style.display = "none";


        document.getElementById("selectedLocation")
            .innerText = examLocation;

        document.getElementById("selectedRoom")
            .innerText = examRoom;


        /*
            Cập nhật phòng thi vào danh sách.
        */
        const roomValues =
            document.querySelectorAll(".room-value");


        roomValues.forEach(function(item) {

            item.innerText = examRoom;

        });


        /*
            Số lượng thí sinh mẫu.
        */
        document.getElementById("candidateCount")
            .innerText = "4";

        document.getElementById("totalCandidates")
            .innerText = "4";


        /*
            Hiển thị kết quả.
        */
        resultPanel.style.display = "block";


        resultPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

</script>


<?php
include '../../components/layout/footer.php';
?>