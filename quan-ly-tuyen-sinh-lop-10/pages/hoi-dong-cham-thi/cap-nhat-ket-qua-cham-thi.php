<?php include '../../components/layout/header.php'; ?>

<style>
.update-page{
    padding:30px;
}
.update-title{
    margin-bottom:24px;
}
.update-title h1{
    font-size:24px;
    margin-bottom:7px;
}
.update-title p{
    color:#7b8492;
    font-size:13px;
}
.update-card{
    background:#fff;
    border:1px solid #e5e9ef;
    border-radius:10px;
    margin-bottom:22px;
    overflow:hidden;
}
.update-card-header{
    padding:18px 22px;
    border-bottom:1px solid #edf0f4;
}
.update-card-header h3{
    font-size:15px;
    margin-bottom:4px;
}
.update-card-header p{
    font-size:12px;
    color:#8a93a1;
}
.table-wrap{
    overflow-x:auto;
}
.data-table{
    width:100%;
    border-collapse:collapse;
}
.data-table th{
    background:#f7f9fc;
    color:#687282;
    font-size:11px;
    text-align:left;
    padding:13px 16px;
    border-bottom:1px solid #e7ebf0;
}
.data-table td{
    padding:14px 16px;
    font-size:12px;
    border-bottom:1px solid #eef1f4;
}
.data-table tr:hover{
    background:#fafcff;
}
.edit-button{
    border:1px solid #1769e0;
    background:#fff;
    color:#1769e0;
    border-radius:6px;
    padding:7px 11px;
    cursor:pointer;
    font-size:11px;
}
.edit-button:hover{
    background:#1769e0;
    color:#fff;
}
.edit-section{
    display:none;
}
.edit-section.show{
    display:block;
}
.info-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:14px;
    padding:20px 22px;
    background:#f8faff;
    border-bottom:1px solid #e8edf3;
}
.info-item span{
    display:block;
    color:#8d96a4;
    font-size:10px;
    margin-bottom:5px;
}
.info-item strong{
    font-size:13px;
}
.form-area{
    padding:22px;
}
.form-row{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:16px;
}
.form-item{
    margin-bottom:18px;
}
.form-item label{
    display:block;
    margin-bottom:7px;
    font-size:12px;
    font-weight:600;
    color:#46505f;
}
.form-item input,
.form-item textarea{
    width:100%;
    border:1px solid #d8dee7;
    border-radius:7px;
    padding:11px 12px;
    outline:none;
    font-family:inherit;
}
.form-item input{
    height:43px;
}
.form-item textarea{
    min-height:90px;
    resize:vertical;
}
.form-item input:focus,
.form-item textarea:focus{
    border-color:#1769e0;
}
.form-note{
    color:#8a93a1;
    font-size:11px;
    line-height:1.5;
    margin-top:-8px;
    margin-bottom:18px;
}
.action-row{
    display:flex;
    justify-content:flex-end;
    gap:10px;
}
.cancel-button,
.save-button{
    height:41px;
    padding:0 18px;
    border-radius:7px;
    font-weight:600;
    cursor:pointer;
    font-size:12px;
}
.cancel-button{
    background:#fff;
    color:#5f6876;
    border:1px solid #d8dee7;
}
.save-button{
    background:#1769e0;
    color:#fff;
    border:none;
}
.message{
    display:none;
    margin:0 22px 20px;
    padding:12px 15px;
    border-radius:7px;
    font-size:12px;
}
.message.error{
    display:block;
    background:#fff0f0;
    color:#c23939;
    border:1px solid #ffd6d6;
}
.message.success{
    display:block;
    background:#ecfaf3;
    color:#16865d;
    border:1px solid #ccefdc;
}
.confirm-box{
    display:none;
    margin:0 22px 22px;
    padding:16px;
    border:1px solid #dbe5f3;
    background:#f7faff;
    border-radius:8px;
}
.confirm-box.show{
    display:block;
}
.confirm-box p{
    font-size:12px;
    color:#4f5968;
    margin-bottom:12px;
}
.confirm-actions{
    display:flex;
    gap:8px;
}
.confirm-actions button{
    padding:8px 13px;
    border-radius:6px;
    cursor:pointer;
    font-size:11px;
}
.confirm-no{
    border:1px solid #d8dee7;
    background:#fff;
}
.confirm-yes{
    border:none;
    background:#1769e0;
    color:#fff;
}
@media(max-width:850px){
    .info-grid,
    .form-row{
        grid-template-columns:1fr;
    }
}
</style>

<section class="update-page">

    <div class="update-title">
        <h1>Cập nhật kết quả chấm thi</h1>
        <p>Chọn kết quả chấm thi cần chỉnh sửa và xác nhận cập nhật.</p>
    </div>

    <!-- BASIC FLOW: Bước 2 -->
    <div class="update-card">
        <div class="update-card-header">
            <h3>Danh sách kết quả chấm thi</h3>
            <p>Chọn một kết quả chấm thi cần cập nhật.</p>
        </div>

        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã phách</th>
                        <th>Môn thi</th>
                        <th>Kết quả hiện tại</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>P001</td>
                        <td>Toán</td>
                        <td id="score-P001">8.00</td>
                        <td>Đã chấm</td>
                        <td>
                            <button class="edit-button"
                                onclick="chonKetQua('P001','Toán','8.00')">
                                Cập nhật
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td>P002</td>
                        <td>Ngữ văn</td>
                        <td id="score-P002">7.25</td>
                        <td>Đã chấm</td>
                        <td>
                            <button class="edit-button"
                                onclick="chonKetQua('P002','Ngữ văn','7.25')">
                                Cập nhật
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td>3</td>
                        <td>P003</td>
                        <td>Tiếng Anh</td>
                        <td id="score-P003">9.00</td>
                        <td>Đã chấm</td>
                        <td>
                            <button class="edit-button"
                                onclick="chonKetQua('P003','Tiếng Anh','9.00')">
                                Cập nhật
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- BASIC FLOW: Bước 4, 5 -->
    <div class="update-card edit-section" id="editSection">

        <div class="update-card-header">
            <h3>Thông tin kết quả chấm thi</h3>
            <p>Kiểm tra thông tin và thực hiện chỉnh sửa.</p>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <span>MÃ PHÁCH</span>
                <strong id="selectedCode">-</strong>
            </div>

            <div class="info-item">
                <span>MÔN THI</span>
                <strong id="selectedSubject">-</strong>
            </div>

            <div class="info-item">
                <span>KẾT QUẢ HIỆN TẠI</span>
                <strong id="selectedOldScore">-</strong>
            </div>
        </div>

        <div class="form-area">

            <div class="form-row">
                <div class="form-item">
                    <label>Kết quả mới <span style="color:#d84b4b">*</span></label>
                    <input id="newScore" type="text"
                           placeholder="Nhập kết quả mới">
                </div>

                <div class="form-item">
                    <label>Lý do chỉnh sửa</label>
                    <input id="reason" type="text"
                           placeholder="Nhập lý do chỉnh sửa">
                </div>
            </div>

            <p class="form-note">
                Đặc tả hiện chỉ nêu “kết quả chấm thi cập nhật không hợp lệ”
                nhưng chưa quy định cụ thể điều kiện hợp lệ. Khi nhóm thống nhất
                quy tắc nghiệp vụ, bổ sung kiểm tra tại đây.
            </p>

            <div class="action-row">
                <button class="cancel-button" onclick="huyCapNhat()">
                    Hủy
                </button>

                <button class="save-button" onclick="kiemTraCapNhat()">
                    Xác nhận cập nhật
                </button>
            </div>
        </div>

        <div id="message" class="message"></div>

        <!-- BASIC FLOW: Bước 7 -->
        <div id="confirmBox" class="confirm-box">
            <p>
                Bạn có chắc chắn muốn cập nhật kết quả chấm thi này không?
            </p>

            <div class="confirm-actions">
                <button class="confirm-no" onclick="khongXacNhan()">
                    Không
                </button>

                <button class="confirm-yes" onclick="luuCapNhat()">
                    Có, cập nhật
                </button>
            </div>
        </div>

    </div>

</section>

<script>
let selectedCode = "";
let selectedSubject = "";
let selectedOldScore = "";

function chonKetQua(code, subject, score){
    selectedCode = code;
    selectedSubject = subject;
    selectedOldScore = score;

    document.getElementById("selectedCode").innerText = code;
    document.getElementById("selectedSubject").innerText = subject;
    document.getElementById("selectedOldScore").innerText = score;

    document.getElementById("newScore").value = score;
    document.getElementById("reason").value = "";

    const message = document.getElementById("message");
    message.className = "message";
    message.innerHTML = "";

    document.getElementById("confirmBox").classList.remove("show");
    document.getElementById("editSection").classList.add("show");

    document.getElementById("editSection")
        .scrollIntoView({behavior:"smooth"});
}

/*
    Alternative Flow 6.1:
    Kết quả chấm thi cập nhật không hợp lệ.

    Vì đặc tả chưa ghi rõ quy tắc hợp lệ, bản phác thảo
    chỉ kiểm tra trường bắt buộc và dữ liệu phải là số.
*/
function kiemTraCapNhat(){
    const newScore = document.getElementById("newScore").value.trim();
    const message = document.getElementById("message");

    message.className = "message";
    message.innerHTML = "";
    document.getElementById("confirmBox").classList.remove("show");

    if(newScore === "" || isNaN(newScore)){
        message.className = "message error";
        message.innerHTML =
            "Kết quả chấm thi không hợp lệ. Vui lòng chỉnh sửa lại.";
        return;
    }

    document.getElementById("confirmBox").classList.add("show");
}

/*
    Alternative Flow 7.1:
    Hội đồng chấm thi không muốn tiếp tục cập nhật.
*/
function khongXacNhan(){
    document.getElementById("confirmBox").classList.remove("show");
}

function huyCapNhat(){
    document.getElementById("editSection").classList.remove("show");
    document.getElementById("confirmBox").classList.remove("show");

    selectedCode = "";
    selectedSubject = "";
    selectedOldScore = "";
}

/*
    Basic Flow bước 8, 9, 10.
    Đây là dữ liệu demo, chưa kết nối database.
*/
function luuCapNhat(){
    const newScore = document.getElementById("newScore").value.trim();
    const message = document.getElementById("message");

    /*
       Khi nối database thật:
       - Bước 8: lưu kết quả cập nhật
       - Bước 9: ghi lịch sử chỉnh sửa điểm
       - Exception 8.1: nếu lưu thất bại thì giữ kết quả cũ
    */

    document.getElementById("score-" + selectedCode).innerText = newScore;
    document.getElementById("selectedOldScore").innerText = newScore;

    message.className = "message success";
    message.innerHTML = "Cập nhật kết quả chấm thi thành công.";

    document.getElementById("confirmBox").classList.remove("show");

    selectedOldScore = newScore;
}
</script>

<?php include '../../components/layout/footer.php'; ?>
