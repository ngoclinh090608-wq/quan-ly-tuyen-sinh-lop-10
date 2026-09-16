<?php
include '../../components/layout/header.php';
?>

<style>
.history-page {
    padding: 30px;
}

.history-title {
    margin-bottom: 25px;
}

.history-title h1 {
    font-size: 24px;
    margin-bottom: 7px;
}

.history-title p {
    color: #7b8492;
    font-size: 13px;
}

.history-card {
    background: #fff;
    border: 1px solid #e5e9ef;
    border-radius: 10px;
    margin-bottom: 22px;
    overflow: hidden;
}

.history-card-header {
    padding: 18px 22px;
    border-bottom: 1px solid #edf0f4;
}

.history-card-header h3 {
    font-size: 15px;
    margin-bottom: 4px;
}

.history-card-header p {
    font-size: 12px;
    color: #8a93a1;
}

.search-area {
    padding: 22px;
    display: grid;
    grid-template-columns: repeat(3, 1fr) auto;
    gap: 15px;
    align-items: end;
}

.form-item label {
    display: block;
    margin-bottom: 7px;
    font-size: 12px;
    font-weight: 600;
    color: #46505f;
}

.form-item select {
    width: 100%;
    height: 43px;
    border: 1px solid #d8dee7;
    border-radius: 7px;
    padding: 0 10px;
    background: white;
    outline: none;
}

.form-item select:focus {
    border-color: #1769e0;
}

.search-button {
    height: 43px;
    padding: 0 22px;
    border: none;
    border-radius: 7px;
    background: #1769e0;
    color: white;
    font-weight: 600;
    cursor: pointer;
}

.search-button:hover {
    background: #1259c2;
}

.message {
    display: none;
    margin: 0 22px 20px;
    padding: 12px 15px;
    border-radius: 7px;
    font-size: 12px;
}

.message.error {
    display: block;
    background: #fff0f0;
    color: #c23939;
    border: 1px solid #ffd6d6;
}

.message.info {
    display: block;
    background: #eef5ff;
    color: #1769e0;
    border: 1px solid #d8e8ff;
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

.view-button {
    border: 1px solid #1769e0;
    background: white;
    color: #1769e0;
    border-radius: 6px;
    padding: 7px 11px;
    cursor: pointer;
    font-size: 11px;
}

.view-button:hover {
    background: #1769e0;
    color: white;
}

.history-detail {
    display: none;
}

.history-detail.show {
    display: block;
}

.history-summary {
    display: flex;
    gap: 35px;
    flex-wrap: wrap;
    padding: 18px 22px;
    background: #f8faff;
    border-bottom: 1px solid #e8edf3;
}

.summary-item span {
    display: block;
    font-size: 10px;
    color: #8d96a4;
    margin-bottom: 5px;
}

.summary-item strong {
    font-size: 13px;
}

.status-change {
    color: #e78524;
    font-weight: 600;
}

@media(max-width: 900px) {
    .search-area {
        grid-template-columns: 1fr;
    }
}
</style>


<section class="history-page">

    <div class="history-title">
        <h1>Xem lịch sử chỉnh sửa điểm</h1>
        <p>Tra cứu và xem lịch sử thay đổi kết quả chấm thi.</p>
    </div>


    <!-- 1. ĐIỀU KIỆN TRA CỨU -->
    <div class="history-card">

        <div class="history-card-header">
            <h3>Điều kiện tra cứu</h3>
            <p>Chọn các điều kiện để tìm kiếm kết quả chấm thi.</p>
        </div>

        <div class="search-area">

            <div class="form-item">
                <label>Kỳ thi</label>
                <select id="kyThi">
                    <option value="">-- Chọn kỳ thi --</option>
                    <option value="2026">Tuyển sinh lớp 10 - 2026</option>
                </select>
            </div>

            <div class="form-item">
                <label>Môn thi</label>
                <select id="monThi">
                    <option value="">-- Chọn môn thi --</option>
                    <option value="toan">Toán</option>
                    <option value="van">Ngữ văn</option>
                    <option value="anh">Tiếng Anh</option>
                </select>
            </div>

            <div class="form-item">
                <label>Mã phách</label>
                <select id="maPhach">
                    <option value="">-- Chọn mã phách --</option>
                    <option value="P001">P001</option>
                    <option value="P002">P002</option>
                    <option value="P003">P003</option>
                </select>
            </div>

            <button class="search-button" onclick="traCuu()">
                Tra cứu
            </button>

        </div>

        <div id="searchMessage" class="message"></div>

    </div>


    <!-- 2. DANH SÁCH KẾT QUẢ -->
    <div class="history-card" id="resultCard" style="display:none;">

        <div class="history-card-header">
            <h3>Danh sách kết quả chấm thi</h3>
            <p>Chọn một kết quả để xem lịch sử chỉnh sửa điểm.</p>
        </div>

        <div class="table-wrap">

            <table class="data-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã phách</th>
                        <th>Môn thi</th>
                        <th>Điểm hiện tại</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody id="resultBody">
                </tbody>

            </table>

        </div>

    </div>


    <!-- 3. LỊCH SỬ CHỈNH SỬA -->
    <div class="history-card history-detail" id="historyCard">

        <div class="history-card-header">
            <h3>Lịch sử chỉnh sửa điểm</h3>
            <p>Thông tin các lần chỉnh sửa của kết quả chấm thi đã chọn.</p>
        </div>

        <div class="history-summary">

            <div class="summary-item">
                <span>MÃ PHÁCH</span>
                <strong id="detailMaPhach">-</strong>
            </div>

            <div class="summary-item">
                <span>MÔN THI</span>
                <strong id="detailMon">-</strong>
            </div>

            <div class="summary-item">
                <span>ĐIỂM HIỆN TẠI</span>
                <strong id="detailDiem">-</strong>
            </div>

        </div>


        <div id="historyMessage" class="message"></div>

        <div class="table-wrap" id="historyTable">

            <table class="data-table">

                <thead>
                    <tr>
                        <th>Lần chỉnh sửa</th>
                        <th>Điểm trước</th>
                        <th>Điểm sau</th>
                        <th>Người chỉnh sửa</th>
                        <th>Lý do chỉnh sửa</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>

                <tbody id="historyBody">
                </tbody>

            </table>

        </div>

    </div>

</section>


<script>

/*
    DỮ LIỆU GIẢ CHỈ DÙNG CHO PHÁC THẢO GIAO DIỆN
*/
const ketQua = {

    P001: {
        mon: "Toán",
        diem: "8.50",
        lichSu: [
            {
                lan: 1,
                cu: "8.00",
                moi: "8.50",
                nguoi: "Hội đồng chấm thi",
                lydo: "Điều chỉnh sau khi đối chiếu biên bản chấm thi",
                thoigian: "15/09/2026 09:20"
            }
        ]
    },

    P002: {
        mon: "Ngữ văn",
        diem: "7.25",
        lichSu: []
    },

    P003: {
        mon: "Tiếng Anh",
        diem: "9.00",
        lichSu: [
            {
                lan: 1,
                cu: "8.50",
                moi: "8.75",
                nguoi: "Hội đồng chấm thi",
                lydo: "Cập nhật lại điểm theo kết quả kiểm tra",
                thoigian: "14/09/2026 15:10"
            },
            {
                lan: 2,
                cu: "8.75",
                moi: "9.00",
                nguoi: "Hội đồng chấm thi",
                lydo: "Điều chỉnh sau khi rà soát kết quả chấm",
                thoigian: "15/09/2026 08:40"
            }
        ]
    }

};


function traCuu() {

    const kyThi = document.getElementById("kyThi").value;
    const monThi = document.getElementById("monThi").value;
    const maPhach = document.getElementById("maPhach").value;

    const message = document.getElementById("searchMessage");

    message.className = "message";
    message.innerHTML = "";

    document.getElementById("resultCard").style.display = "none";
    document.getElementById("historyCard").classList.remove("show");


    /*
        Alternative Flow 4.1:
        Điều kiện tra cứu không hợp lệ
    */
    if (!kyThi || !monThi || !maPhach) {

        const thieu = [];

        if (!kyThi) {
            thieu.push("Kỳ thi");
        }

        if (!monThi) {
            thieu.push("Môn thi");
        }

        if (!maPhach) {
            thieu.push("Mã phách");
        }

        message.className = "message error";
        message.innerHTML =
            "Vui lòng chọn đầy đủ điều kiện tra cứu: "
            + thieu.join(", ")
            + ".";

        return;
    }


    const data = ketQua[maPhach];


    /*
        Alternative Flow 6.1:
        Không tìm thấy kết quả chấm thi phù hợp
    */
    if (!data) {

        message.className = "message info";
        message.innerHTML =
            "Không tìm thấy kết quả chấm thi phù hợp.";

        return;
    }


    const monDaChon =
        document.getElementById("monThi")
        .options[
            document.getElementById("monThi").selectedIndex
        ]
        .text;


    if (data.mon !== monDaChon) {

        message.className = "message info";
        message.innerHTML =
            "Không tìm thấy kết quả chấm thi phù hợp.";

        return;
    }


    document.getElementById("resultCard").style.display = "block";


    document.getElementById("resultBody").innerHTML = `
        <tr>
            <td>1</td>
            <td>${maPhach}</td>
            <td>${data.mon}</td>
            <td>${data.diem}</td>
            <td>Đã chấm</td>
            <td>
                <button
                    class="view-button"
                    onclick="xemLichSu('${maPhach}')">
                    Xem lịch sử
                </button>
            </td>
        </tr>
    `;

}


function xemLichSu(maPhach) {

    const data = ketQua[maPhach];

    const card = document.getElementById("historyCard");

    card.classList.add("show");


    document.getElementById("detailMaPhach").innerText = maPhach;
    document.getElementById("detailMon").innerText = data.mon;
    document.getElementById("detailDiem").innerText = data.diem;


    const message =
        document.getElementById("historyMessage");

    const table =
        document.getElementById("historyTable");

    message.className = "message";
    message.innerHTML = "";


    /*
        Alternative Flow 9.1:
        Chưa có lịch sử chỉnh sửa điểm
    */
    if (data.lichSu.length === 0) {

        message.className = "message info";
        message.innerHTML =
            "Kết quả chấm thi chưa có lịch sử chỉnh sửa điểm.";

        table.style.display = "none";

        return;
    }


    table.style.display = "block";


    let rows = "";

    data.lichSu.forEach(item => {

        rows += `
            <tr>
                <td>${item.lan}</td>
                <td>${item.cu}</td>
                <td class="status-change">${item.moi}</td>
                <td>${item.nguoi}</td>
                <td>${item.lydo}</td>
                <td>${item.thoigian}</td>
            </tr>
        `;

    });


    document.getElementById("historyBody").innerHTML = rows;

}

</script>


<?php
include '../../components/layout/footer.php';
?>