<?php
include '../../components/layout/header.php';
?>

<style>
    /* CSS RIÊNG UC9 - KHÔNG SỬA STYLE.CSS CỦA NHÓM */

    .uc9-layout {
        display: grid;
        grid-template-columns: 380px 1fr;
        gap: 20px;
        align-items: start;
    }

    .uc9-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
    }

    .uc9-council {
        width: 100%;
        padding: 14px 15px;

        text-align: left;

        background: #ffffff;
        border: 1px solid #e5e9f0;
        border-radius: 8px;

        cursor: pointer;

        transition: 0.2s;
    }

    .uc9-council:hover {
        background: #f8fbff;
        border-color: #1769e0;
    }

    .uc9-council.active {
        background: #eef5ff;
        border-color: #1769e0;
    }

    .uc9-council strong {
        display: block;
        margin-bottom: 5px;

        color: #252b36;
        font-size: 13px;
    }

    .uc9-council span {
        color: #7c8492;
        font-size: 11px;
    }

    .uc9-empty {
        padding: 35px 20px;
        text-align: center;

        color: #8a929f;
        font-size: 12px;
    }

    .uc9-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;

        margin-top: 20px;
    }

    .uc9-field {
        display: flex;
        flex-direction: column;
        gap: 7px;
    }

    .uc9-field.full {
        grid-column: 1 / -1;
    }

    .uc9-field label {
        color: #394252;

        font-size: 12px;
        font-weight: 600;
    }

    .uc9-field input {
        width: 100%;
        height: 45px;

        padding: 0 13px;

        color: #394252;
        background: #ffffff;

        border: 1px solid #d9dee7;
        border-radius: 7px;

        font-family: inherit;
        font-size: 13px;

        outline: none;
    }

    .uc9-field input:focus {
        border-color: #1769e0;

        box-shadow:
            0 0 0 3px rgba(23, 105, 224, 0.08);
    }

    .uc9-field input:disabled {
        color: #596273;
        background: #f7f8fa;

        cursor: not-allowed;
    }

    .uc9-actions {
        display: flex;
        gap: 10px;

        margin-top: 22px;
    }

    .uc9-secondary-button {
        padding: 10px 18px;

        color: #4d5664;
        background: #ffffff;

        border: 1px solid #d9dee7;
        border-radius: 7px;

        font-family: inherit;
        font-size: 12px;
        font-weight: 600;

        cursor: pointer;
    }

    .uc9-secondary-button:hover {
        background: #f7f8fa;
    }

    .uc9-message {
        display: none;

        margin-top: 20px;
        padding: 15px 18px;

        border-radius: 8px;

        font-size: 12px;
    }

    .uc9-message.success-message {
        color: #147a52;
        background: #edf9f4;
        border: 1px solid #d3f1e3;
    }

    .uc9-message.error-message {
        color: #c33d3d;
        background: #fff5f5;
        border: 1px solid #ffdada;
    }

    @media (max-width: 1000px) {

        .uc9-layout {
            grid-template-columns: 1fr;
        }

        .uc9-info-grid {
            grid-template-columns: 1fr;
        }

        .uc9-field.full {
            grid-column: auto;
        }
    }
</style>


<section class="content">

    <!-- TIÊU ĐỀ -->
    <div class="page-heading">

        <div>
            <h1>Quản lý Hội đồng thi</h1>

            <p>
                Xem và cập nhật thông tin Hội đồng thi.
            </p>
        </div>

    </div>


    <div class="uc9-layout">

        <!-- DANH SÁCH HỘI ĐỒNG THI -->
        <div class="panel">

            <div class="panel-header">

                <div>
                    <h3>Danh sách Hội đồng thi</h3>

                    <p>
                        Chọn Hội đồng thi cần xem thông tin.
                    </p>
                </div>

            </div>


            <div class="uc9-list">

                <button
                    type="button"
                    class="uc9-council"
                    onclick="selectCouncil(
                        this,
                        'HĐT001',
                        'Hội đồng thi Nguyễn Thị Minh Khai',
                        'THPT Nguyễn Thị Minh Khai',
                        'Nguyễn Văn Minh',
                        'Đang hoạt động'
                    )">

                    <strong>
                        Hội đồng thi Nguyễn Thị Minh Khai
                    </strong>

                    <span>
                        Mã Hội đồng: HĐT001
                    </span>

                </button>


                <button
                    type="button"
                    class="uc9-council"
                    onclick="selectCouncil(
                        this,
                        'HĐT002',
                        'Hội đồng thi Bùi Thị Xuân',
                        'THPT Bùi Thị Xuân',
                        'Trần Thị Hương',
                        'Đang hoạt động'
                    )">

                    <strong>
                        Hội đồng thi Bùi Thị Xuân
                    </strong>

                    <span>
                        Mã Hội đồng: HĐT002
                    </span>

                </button>


                <button
                    type="button"
                    class="uc9-council"
                    onclick="selectCouncil(
                        this,
                        'HĐT003',
                        'Hội đồng thi Lê Quý Đôn',
                        'THPT Lê Quý Đôn',
                        'Lê Văn Thành',
                        'Đang hoạt động'
                    )">

                    <strong>
                        Hội đồng thi Lê Quý Đôn
                    </strong>

                    <span>
                        Mã Hội đồng: HĐT003
                    </span>

                </button>

            </div>

        </div>


        <!-- THÔNG TIN HỘI ĐỒNG -->
        <div class="panel">

            <div class="panel-header">

                <div>
                    <h3>Thông tin Hội đồng thi</h3>

                    <p id="detailDescription">
                        Chọn một Hội đồng thi để xem thông tin.
                    </p>
                </div>

            </div>


            <!-- CHƯA CHỌN -->
            <div id="emptyState" class="uc9-empty">

                Chưa chọn Hội đồng thi.

            </div>


            <!-- CHI TIẾT -->
            <div id="detailPanel" style="display: none;">

                <div class="uc9-info-grid">


                    <div class="uc9-field">

                        <label>Mã Hội đồng</label>

                        <input
                            type="text"
                            id="councilCode"
                            disabled
                        >

                    </div>


                    <div class="uc9-field">

                        <label>Tên Hội đồng thi</label>

                        <input
                            type="text"
                            id="councilName"
                            disabled
                        >

                    </div>


                    <div class="uc9-field">

                        <label>Điểm thi</label>

                        <input
                            type="text"
                            id="examLocation"
                            disabled
                        >

                    </div>


                    <div class="uc9-field">

                        <label>Chủ tịch Hội đồng</label>

                        <input
                            type="text"
                            id="chairman"
                            disabled
                        >

                    </div>


                    <div class="uc9-field full">

                        <label>Trạng thái</label>

                        <input
                            type="text"
                            id="councilStatus"
                            disabled
                        >

                    </div>

                </div>


                <!-- NÚT XEM -->
                <div
                    id="viewActions"
                    class="uc9-actions">

                    <button
                        type="button"
                        class="primary-button"
                        onclick="enableEdit()">

                        Cập nhật thông tin

                    </button>

                </div>


                <!-- NÚT KHI CẬP NHẬT -->
                <div
                    id="editActions"
                    class="uc9-actions"
                    style="display: none;">

                    <button
                        type="button"
                        class="primary-button"
                        onclick="updateCouncil()">

                        Xác nhận cập nhật

                    </button>


                    <button
                        type="button"
                        class="uc9-secondary-button"
                        onclick="cancelEdit()">

                        Hủy

                    </button>

                </div>


                <!-- THÔNG BÁO -->
                <div
                    id="successMessage"
                    class="uc9-message success-message">

                    Cập nhật thông tin Hội đồng thi thành công.

                </div>


                <div
                    id="errorMessage"
                    class="uc9-message error-message">

                    Thông tin cập nhật không hợp lệ.
                    Vui lòng kiểm tra lại.

                </div>

            </div>

        </div>

    </div>

</section>


<script>

    let oldData = {};

    /*
        Chọn Hội đồng thi.
    */
    function selectCouncil(
        element,
        code,
        name,
        location,
        chairman,
        status
    ) {

        const councils =
            document.querySelectorAll(".uc9-council");


        councils.forEach(function(item) {
            item.classList.remove("active");
        });


        element.classList.add("active");


        document.getElementById("councilCode").value =
            code;

        document.getElementById("councilName").value =
            name;

        document.getElementById("examLocation").value =
            location;

        document.getElementById("chairman").value =
            chairman;

        document.getElementById("councilStatus").value =
            status;


        document.getElementById("emptyState")
            .style.display = "none";

        document.getElementById("detailPanel")
            .style.display = "block";


        document.getElementById("detailDescription")
            .innerText =
            "Thông tin của Hội đồng thi được chọn.";


        disableFields();


        document.getElementById("viewActions")
            .style.display = "flex";

        document.getElementById("editActions")
            .style.display = "none";


        hideMessages();
    }



    /*
        Chọn cập nhật thông tin.
    */
    function enableEdit() {

        /*
            Lưu lại dữ liệu cũ.
            Nếu người dùng bấm Hủy thì khôi phục.
        */
        oldData = {

            name:
                document.getElementById("councilName").value,

            location:
                document.getElementById("examLocation").value,

            chairman:
                document.getElementById("chairman").value,

            status:
                document.getElementById("councilStatus").value
        };


        /*
            Mã Hội đồng không chỉnh.
        */
        document.getElementById("councilName").disabled =
            false;

        document.getElementById("examLocation").disabled =
            false;

        document.getElementById("chairman").disabled =
            false;

        document.getElementById("councilStatus").disabled =
            false;


        document.getElementById("viewActions")
            .style.display = "none";

        document.getElementById("editActions")
            .style.display = "flex";


        document.getElementById("detailDescription")
            .innerText =
            "Điều chỉnh thông tin cần cập nhật.";


        hideMessages();
    }



    /*
        Xác nhận cập nhật.
    */
    function updateCouncil() {

        const name =
            document.getElementById("councilName")
                .value.trim();

        const location =
            document.getElementById("examLocation")
                .value.trim();

        const chairman =
            document.getElementById("chairman")
                .value.trim();

        const status =
            document.getElementById("councilStatus")
                .value.trim();


        /*
            Alternative Flow 9.1:
            Thông tin cập nhật không hợp lệ.
        */
        if (
            name === "" ||
            location === "" ||
            chairman === "" ||
            status === ""
        ) {

            document.getElementById("errorMessage")
                .style.display = "block";

            document.getElementById("successMessage")
                .style.display = "none";

            return;
        }


        /*
            Mô phỏng hệ thống lưu thành công.
        */
        disableFields();


        document.getElementById("viewActions")
            .style.display = "flex";

        document.getElementById("editActions")
            .style.display = "none";


        document.getElementById("successMessage")
            .style.display = "block";

        document.getElementById("errorMessage")
            .style.display = "none";


        document.getElementById("detailDescription")
            .innerText =
            "Thông tin Hội đồng thi sau khi cập nhật.";

    }



    /*
        Hủy cập nhật.
        Giữ lại thông tin trước đó.
    */
    function cancelEdit() {

        document.getElementById("councilName").value =
            oldData.name;

        document.getElementById("examLocation").value =
            oldData.location;

        document.getElementById("chairman").value =
            oldData.chairman;

        document.getElementById("councilStatus").value =
            oldData.status;


        disableFields();


        document.getElementById("viewActions")
            .style.display = "flex";

        document.getElementById("editActions")
            .style.display = "none";


        document.getElementById("detailDescription")
            .innerText =
            "Thông tin của Hội đồng thi được chọn.";


        hideMessages();
    }



    /*
        Khóa các trường khi chỉ xem thông tin.
    */
    function disableFields() {

        document.getElementById("councilName").disabled =
            true;

        document.getElementById("examLocation").disabled =
            true;

        document.getElementById("chairman").disabled =
            true;

        document.getElementById("councilStatus").disabled =
            true;

    }



    function hideMessages() {

        document.getElementById("successMessage")
            .style.display = "none";

        document.getElementById("errorMessage")
            .style.display = "none";

    }

</script>


<?php
include '../../components/layout/footer.php';
?>