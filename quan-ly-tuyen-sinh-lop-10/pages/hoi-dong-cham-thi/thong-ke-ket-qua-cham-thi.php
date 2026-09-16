<?php include '../../components/layout/header.php'; ?>

<style>
.stats-page {
    padding: 30px;
}

.stats-title {
    margin-bottom: 24px;
}

.stats-title h1 {
    font-size: 24px;
    margin-bottom: 7px;
}

.stats-title p {
    font-size: 13px;
    color: #7b8492;
}

.stats-card {
    background: #fff;
    border: 1px solid #e5e9ef;
    border-radius: 10px;
    margin-bottom: 22px;
    overflow: hidden;
}

.stats-card-header {
    padding: 18px 22px;
    border-bottom: 1px solid #edf0f4;
}

.stats-card-header h3 {
    font-size: 15px;
    margin-bottom: 4px;
}

.stats-card-header p {
    font-size: 12px;
    color: #8a93a1;
}

.filter-area {
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
    background: #fff;
    outline: none;
}

.form-item select:focus {
    border-color: #1769e0;
}

.stats-button {
    height: 43px;
    padding: 0 22px;
    border: none;
    border-radius: 7px;
    background: #1769e0;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
}

.stats-button:hover {
    background: #1259c2;
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

.message.error {
    display: block;
    background: #fff0f0;
    color: #c23939;
    border: 1px solid #ffd6d6;
}

.result-area {
    display: none;
}

.result-area.show {
    display: block;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 22px;
}

.summary-card {
    background: #fff;
    border: 1px solid #e5e9ef;
    border-radius: 10px;
    padding: 20px;
}

.summary-card span {
    font-size: 11px;
    color: #8b94a2;
}

.summary-card h2 {
    font-size: 25px;
    margin: 8px 0 5px;
}

.summary-card small {
    font-size: 10px;
    color: #a0a7b1;
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

.progress {
    height: 7px;
    background: #edf1f5;
    border-radius: 20px;
    overflow: hidden;
    min-width: 120px;
}

.progress span {
    display: block;
    height: 100%;
    background: #1769e0;
    border-radius: 20px;
}

.section-note {
    padding: 14px 22px;
    background: #fafcff;
    color: #7f8896;
    font-size: 11px;
    border-top: 1px solid #eef1f4;
}

@media(max-width: 1000px) {
    .summary-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .filter-area {
        grid-template-columns: 1fr 1fr;
    }
}

@media(max-width: 650px) {
    .summary-grid,
    .filter-area {
        grid-template-columns: 1fr;
    }
}
</style>


<section class="stats-page">

    <div class="stats-title">
        <h1>Thống kê kết quả chấm thi</h1>
        <p>
            Tổng hợp kết quả chấm thi theo kỳ thi,
            môn thi và trạng thái chấm.
        </p>
    </div>


    <!-- ĐIỀU KIỆN THỐNG KÊ -->
    <div class="stats-card">

        <div class="stats-card-header">
            <h3>Điều kiện thống kê</h3>
            <p>Chọn dữ liệu cần thống kê.</p>
        </div>

        <div class="filter-area">

            <div class="form-item">
                <label>Kỳ thi</label>

                <select id="kyThi">
                    <option value="">
                        -- Chọn kỳ thi --
                    </option>

                    <option value="2026">
                        Tuyển sinh lớp 10 - 2026
                    </option>

                    <option value="2025">
                        Tuyển sinh lớp 10 - 2025
                    </option>
                </select>
            </div>


            <div class="form-item">
                <label>Môn thi</label>

                <select id="monThi">
                    <option value="tatca">
                        Tất cả môn thi
                    </option>

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


            <div class="form-item">
                <label>Trạng thái chấm</label>

                <select id="trangThai">
                    <option value="tatca">
                        Tất cả trạng thái
                    </option>

                    <option value="dacham">
                        Đã chấm
                    </option>

                    <option value="chuacham">
                        Chưa chấm
                    </option>
                </select>
            </div>


            <button
                class="stats-button"
                onclick="thongKe()">
                Thống kê
            </button>

        </div>


        <div
            id="message"
            class="message">
        </div>

    </div>



    <!-- KẾT QUẢ THỐNG KÊ -->
    <div
        id="resultArea"
        class="result-area">


        <!-- THỐNG KÊ TỔNG QUAN -->
        <div class="summary-grid">

            <div class="summary-card">
                <span>
                    TỔNG SỐ BÀI THI
                </span>

                <h2 id="totalExam">
                    0
                </h2>

                <small>
                    Bài thi trong phạm vi thống kê
                </small>
            </div>


            <div class="summary-card">
                <span>
                    ĐÃ CHẤM
                </span>

                <h2 id="gradedExam">
                    0
                </h2>

                <small>
                    Kết quả đã được ghi nhận
                </small>
            </div>


            <div class="summary-card">
                <span>
                    CHƯA CHẤM
                </span>

                <h2 id="ungradedExam">
                    0
                </h2>

                <small>
                    Bài thi chưa có kết quả
                </small>
            </div>


            <div class="summary-card">
                <span>
                    ĐIỂM TRUNG BÌNH
                </span>

                <h2 id="averageScore">
                    0
                </h2>

                <small>
                    Tính trên các bài đã chấm
                </small>
            </div>

        </div>



        <!-- BẢNG THỐNG KÊ -->
        <div class="stats-card">

            <div class="stats-card-header">
                <h3>
                    Thống kê theo môn thi
                </h3>

                <p>
                    Số lượng bài thi và kết quả chấm
                    theo từng môn.
                </p>
            </div>


            <div class="table-wrap">

                <table class="data-table">

                    <thead>
                        <tr>
                            <th>Môn thi</th>
                            <th>Tổng số bài</th>
                            <th>Đã chấm</th>
                            <th>Chưa chấm</th>
                            <th>Điểm trung bình</th>
                            <th>Tiến độ chấm</th>
                        </tr>
                    </thead>


                    <tbody id="statsBody">
                    </tbody>

                </table>

            </div>


            <div class="section-note">
                Dữ liệu hiện tại là dữ liệu mẫu
                phục vụ phác thảo giao diện.
            </div>

        </div>

    </div>

</section>


<script>

/*
    Dữ liệu mẫu vì hiện tại
    chưa kết nối MySQL/database.
*/
const duLieu = {

    2026: [

        {
            id: "toan",
            mon: "Toán",
            tong: 420,
            daCham: 400,
            chuaCham: 20,
            diemTB: 7.35
        },

        {
            id: "van",
            mon: "Ngữ văn",
            tong: 420,
            daCham: 390,
            chuaCham: 30,
            diemTB: 6.82
        },

        {
            id: "anh",
            mon: "Tiếng Anh",
            tong: 420,
            daCham: 410,
            chuaCham: 10,
            diemTB: 7.68
        }

    ],


    /*
        Dùng để test trường hợp
        không có dữ liệu thống kê.
    */
    2025: []

};



function thongKe() {

    const kyThi =
        document.getElementById("kyThi").value;

    const monThi =
        document.getElementById("monThi").value;

    const trangThai =
        document.getElementById("trangThai").value;


    const message =
        document.getElementById("message");

    const resultArea =
        document.getElementById("resultArea");


    message.className = "message";
    message.innerHTML = "";

    resultArea.classList.remove("show");



    /*
        Trường hợp chưa chọn kỳ thi
    */
    if (!kyThi) {

        message.className =
            "message error";

        message.innerHTML =
            "Vui lòng chọn kỳ thi cần thống kê.";

        return;
    }



    let data =
        duLieu[kyThi] || [];



    /*
        Nếu chọn một môn cụ thể
    */
    if (monThi !== "tatca") {

        data = data.filter(
            item => item.id === monThi
        );

    }



    /*
        Không có dữ liệu phù hợp
    */
    if (data.length === 0) {

        message.className =
            "message info";

        message.innerHTML =
            "Không có dữ liệu kết quả chấm thi phù hợp.";

        return;
    }



    let tong = 0;
    let daCham = 0;
    let chuaCham = 0;
    let tongDiem = 0;
    let soBaiCoDiem = 0;



    data.forEach(item => {

        /*
            Thống kê tất cả trạng thái
        */
        if (trangThai === "tatca") {

            tong += item.tong;
            daCham += item.daCham;
            chuaCham += item.chuaCham;

        }


        /*
            Chỉ thống kê bài đã chấm
        */
        else if (trangThai === "dacham") {

            tong += item.daCham;
            daCham += item.daCham;

        }


        /*
            Chỉ thống kê bài chưa chấm
        */
        else if (trangThai === "chuacham") {

            tong += item.chuaCham;
            chuaCham += item.chuaCham;

        }


        tongDiem +=
            item.diemTB * item.daCham;

        soBaiCoDiem +=
            item.daCham;

    });



    /*
        Tính điểm trung bình
    */
    let diemTB = "-";

    if (
        soBaiCoDiem > 0 &&
        trangThai !== "chuacham"
    ) {

        diemTB =
            (tongDiem / soBaiCoDiem)
            .toFixed(2);

    }



    document.getElementById(
        "totalExam"
    ).innerText = tong;


    document.getElementById(
        "gradedExam"
    ).innerText = daCham;


    document.getElementById(
        "ungradedExam"
    ).innerText = chuaCham;


    document.getElementById(
        "averageScore"
    ).innerText = diemTB;



    /*
        Hiển thị bảng thống kê
    */
    let rows = "";


    data.forEach(item => {

        const percent =
            item.tong > 0
                ? Math.round(
                    (item.daCham / item.tong)
                    * 100
                )
                : 0;



        let tongHienThi =
            item.tong;

        let daChamHienThi =
            item.daCham;

        let chuaChamHienThi =
            item.chuaCham;



        /*
            Nếu chỉ lọc bài đã chấm
        */
        if (trangThai === "dacham") {

            tongHienThi =
                item.daCham;

            chuaChamHienThi = 0;

        }



        /*
            Nếu chỉ lọc bài chưa chấm
        */
        if (trangThai === "chuacham") {

            tongHienThi =
                item.chuaCham;

            daChamHienThi = 0;

        }



        rows += `
            <tr>

                <td>
                    ${item.mon}
                </td>

                <td>
                    ${tongHienThi}
                </td>

                <td>
                    ${daChamHienThi}
                </td>

                <td>
                    ${chuaChamHienThi}
                </td>

                <td>
                    ${
                        trangThai === "chuacham"
                        ? "-"
                        : item.diemTB.toFixed(2)
                    }
                </td>

                <td>

                    <div style="
                        display:flex;
                        align-items:center;
                        gap:9px;
                    ">

                        <div class="progress">

                            <span
                                style="
                                width:${percent}%;
                                ">
                            </span>

                        </div>

                        <strong
                            style="
                            font-size:11px;
                            ">
                            ${percent}%
                        </strong>

                    </div>

                </td>

            </tr>
        `;

    });



    document.getElementById(
        "statsBody"
    ).innerHTML = rows;


    resultArea.classList.add("show");

}

</script>


<?php include '../../components/layout/footer.php'; ?>