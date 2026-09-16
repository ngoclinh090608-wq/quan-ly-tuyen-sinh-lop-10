/**
 * Chức năng: Tra cứu kết quả xét tuyển lớp 10 (Use Case 4)
 * Tác nhân: Học sinh (Nguyễn Minh Anh • SBD: 100001)
 *
 * Tuân thủ Use Case:
 * - Basic Flow (1-5): Tra cứu và hiển thị trạng thái trúng tuyển / không trúng tuyển, thông tin nguyện vọng tương ứng.
 * - Alternative Flow 3.1: Xem chi tiết kết quả theo từng nguyện vọng (NV1, NV2, NV3).
 * - Exception Flow 2.1: Báo lỗi khi kết quả xét tuyển chưa được công bố.
 * - Exception Flow 2.2: Báo lỗi khi không tìm thấy kết quả xét tuyển theo số báo danh.
 * - Đảm bảo tính toàn vẹn (Read-only, không làm thay đổi dữ liệu xét tuyển trên hệ thống).
 */
(() => {
    'use strict';

    // Dữ liệu kết quả xét tuyển chính thức của các thí sinh trong kỳ thi
    const admissionResults = {
        '100001': {
            sbd: '100001',
            name: 'Nguyễn Minh Anh',
            dob: '15/03/2011',
            school: 'THCS Nguyễn Du',
            scores: { toan: 8.00, van: 7.25, anh: 8.50, priority: 0.00, total: 23.75 },
            admittedWish: 1, // Trúng tuyển NV1
            admittedSchool: 'THPT Nguyễn Trãi',
            wishes: [
                {
                    order: 1,
                    schoolId: 'NT01',
                    schoolName: 'THPT Nguyễn Trãi',
                    district: 'Quận 4',
                    benchmark: 23.75,
                    status: 'admitted',
                    statusText: 'TRÚNG TUYỂN CHÍNH THỨC',
                    note: 'Điểm xét tuyển đạt điểm chuẩn NV1 của trường. Chúc mừng bạn đã trúng tuyển!'
                },
                {
                    order: 2,
                    schoolId: 'LQD02',
                    schoolName: 'THPT Lê Quý Đôn',
                    district: 'Quận 3',
                    benchmark: 25.50,
                    status: 'skipped',
                    statusText: 'KHÔNG XÉT TUYỂN',
                    note: 'Theo quy chế tuyển sinh, thí sinh đã trúng tuyển NV1 nên hệ thống không xét tiếp NV2.'
                },
                {
                    order: 3,
                    schoolId: 'TP03',
                    schoolName: 'THPT Trần Phú',
                    district: 'Quận Tân Phú',
                    benchmark: 24.25,
                    status: 'skipped',
                    statusText: 'KHÔNG XÉT TUYỂN',
                    note: 'Theo quy chế tuyển sinh, thí sinh đã trúng tuyển NV1 nên hệ thống không xét tiếp NV3.'
                }
            ]
        },
        '100005': {
            sbd: '100005',
            name: 'Võ Khánh Linh',
            dob: '18/12/2011',
            school: 'THCS Chu Văn An',
            scores: { toan: 9.00, van: 8.50, anh: 9.50, priority: 0.00, total: 27.00 },
            admittedWish: 1,
            admittedSchool: 'THPT Lê Quý Đôn',
            wishes: [
                { order: 1, schoolId: 'LQD02', schoolName: 'THPT Lê Quý Đôn', district: 'Quận 3', benchmark: 25.50, status: 'admitted', statusText: 'TRÚNG TUYỂN CHÍNH THỨC', note: 'Điểm xét tuyển đạt điểm chuẩn.' }
            ]
        },
        '100008': {
            sbd: '100008',
            name: 'Đỗ Hoàng Nam',
            dob: '14/02/2011',
            school: 'THCS Nguyễn Tri Phương',
            scores: { toan: 7.00, van: 6.50, anh: 7.50, priority: 1.00, total: 22.00 },
            admittedWish: null, // Không trúng tuyển
            admittedSchool: null,
            wishes: [
                { order: 1, schoolId: 'NT01', schoolName: 'THPT Nguyễn Trãi', district: 'Quận 4', benchmark: 23.75, status: 'failed', statusText: 'KHÔNG TRÚNG TUYỂN', note: 'Điểm thi (22.00) chưa đạt điểm chuẩn NV1 (23.75).' },
                { order: 2, schoolId: 'LQD02', schoolName: 'THPT Lê Quý Đôn', district: 'Quận 3', benchmark: 25.50, status: 'failed', statusText: 'KHÔNG TRÚNG TUYỂN', note: 'Điểm thi (22.00) chưa đạt điểm chuẩn NV2 (25.50).' },
                { order: 3, schoolId: 'TP03', schoolName: 'THPT Trần Phú', district: 'Quận Tân Phú', benchmark: 24.25, status: 'failed', statusText: 'KHÔNG TRÚNG TUYỂN', note: 'Điểm thi (22.00) chưa đạt điểm chuẩn NV3 (24.25).' }
            ]
        }
    };

    let isPublished = true; // Trạng thái công bố kết quả tuyển sinh
    let currentCandidate = admissionResults['100001']; // Mặc định là Nguyễn Minh Anh

    // DOM Helpers
    function $(id) { return document.getElementById(id); }
    function esc(str) {
        return String(str ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // Hiển thị giao diện kết quả xét tuyển
    function renderResults(candidate) {
        if (!candidate) return;

        // Điểm thi chi tiết
        $('scoreMath').textContent = candidate.scores.toan.toFixed(2);
        $('scoreLit').textContent = candidate.scores.van.toFixed(2);
        $('scoreEng').textContent = candidate.scores.anh.toFixed(2);
        $('scoreTotal').textContent = candidate.scores.total.toFixed(2);

        // Banner trúng tuyển
        const banner = $('resultHeroBanner');
        const instructionBox = $('enrollInstructionBox');

        if (candidate.admittedWish) {
            banner.style.display = 'block';
            banner.className = 'result-hero-banner';
            banner.innerHTML = `
                <span class="result-hero-tag">KẾT QUẢ XÉT TUYỂN LỚP 10 • NĂM HỌC 2026 - 2027</span>
                <h2 class="result-hero-title">🎉 CHÚC MỪNG BẠN ĐÃ TRÚNG TUYỂN VÀO LỚP 10!</h2>
                <p class="result-hero-desc">
                    Hội đồng tuyển sinh Sở GD&ĐT TP.HCM trân trọng thông báo bạn đã trúng tuyển chính thức vào trường <strong>${esc(candidate.admittedSchool)}</strong>.
                </p>
                <div class="admitted-highlight-card">
                    <div class="admitted-school-info">
                        <span class="pill green" style="background:#ffffff; color:#15803d; font-weight:bold; margin-bottom:6px;">
                            ✓ TRÚNG TUYỂN NGUYỆN VỌNG ${candidate.admittedWish}
                        </span>
                        <h3>${esc(candidate.admittedSchool)}</h3>
                        <p>Thí sinh: <strong>${esc(candidate.name)}</strong> • Số báo danh: <strong>${esc(candidate.sbd)}</strong></p>
                    </div>
                    <div class="admitted-score-badge">
                        <span>Tổng điểm xét tuyển</span>
                        <strong>${candidate.scores.total.toFixed(2)}</strong>
                    </div>
                </div>
            `;
            instructionBox.style.display = 'block';
            $('btnPrintLetter').style.display = 'inline-flex';
        } else {
            // Không trúng tuyển
            banner.style.display = 'block';
            banner.className = 'wf-alert warning';
            banner.style.padding = '24px';
            banner.style.borderRadius = '12px';
            banner.innerHTML = `
                <h2 style="font-size: 18px; margin-bottom: 8px; color: #9a631b;">RẤT TIẾC, BẠN CHƯA ĐẠT ĐIỂM TRÚNG TUYỂN</h2>
                <p style="margin-bottom: 12px; font-size: 13px;">
                    Tổng điểm xét tuyển của bạn là <strong>${candidate.scores.total.toFixed(2)}</strong>. Điểm này chưa đủ điều kiện trúng tuyển vào 3 nguyện vọng THPT công lập đã đăng ký.
                </p>
                <p class="hint">Học sinh có thể đăng ký xét tuyển bổ sung vào các Trung tâm GDNN-GDTX hoặc trường THPT tư thục theo hướng dẫn của Sở GD&ĐT.</p>
            `;
            instructionBox.style.display = 'none';
            $('btnPrintLetter').style.display = 'none';
        }

        // Danh sách so sánh nguyện vọng (Alternative Flow 3.1)
        const wishListContainer = $('wishComparisonList');
        wishListContainer.innerHTML = candidate.wishes.map(w => {
            const isAdmitted = (w.status === 'admitted');
            const diff = (candidate.scores.total - w.benchmark).toFixed(2);
            const diffSign = diff >= 0 ? `+${diff}` : diff;

            let badgeHtml = '<span class="pill green">Trúng tuyển NV' + w.order + '</span>';
            if (w.status === 'failed') badgeHtml = '<span class="pill" style="color:#ef4444;">Không trúng tuyển</span>';
            if (w.status === 'skipped') badgeHtml = '<span class="pill" style="color:#64748b;">Không xét</span>';

            return `
                <div class="wish-compare-card ${isAdmitted ? 'admitted' : ''}" data-wish-order="${w.order}">
                    <div>
                        <span class="order-badge ${isAdmitted ? 'nv1' : 'nv' + w.order}">NV ${w.order}</span>
                    </div>

                    <div class="wish-compare-title">
                        <h4>${esc(w.schoolName)}</h4>
                        <p>Mã trường: ${esc(w.schoolId)} • ${esc(w.district)}</p>
                    </div>

                    <div class="wish-compare-stat">
                        <span>Điểm chuẩn trường</span>
                        <strong>${w.benchmark.toFixed(2)}</strong>
                    </div>

                    <div class="wish-compare-stat">
                        <span>Chênh lệch điểm</span>
                        <strong style="color: ${diff >= 0 ? '#15803d' : '#dc2626'};">${diffSign} điểm</strong>
                    </div>

                    <div style="text-align: right;">
                        ${badgeHtml}
                        <button type="button" class="text-button" data-action="view-wish-detail" data-order="${w.order}" style="display:block; margin-top:4px; font-size:11px;">
                            Xem chi tiết →
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Bắt sự kiện xem chi tiết từng nguyện vọng (Alternative Flow 3.1)
        wishListContainer.querySelectorAll('[data-action="view-wish-detail"]').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const order = parseInt(btn.dataset.order, 10);
                showWishDetailModal(candidate, order);
            };
        });

        wishListContainer.querySelectorAll('.wish-compare-card').forEach(card => {
            card.onclick = () => {
                const order = parseInt(card.dataset.wishOrder, 10);
                showWishDetailModal(candidate, order);
            };
        });

        renderPrintLetter(candidate);
    }

    // Modal chi tiết nguyện vọng (Alternative Flow 3.1)
    function showWishDetailModal(candidate, wishOrder) {
        const wish = candidate.wishes.find(w => w.order === wishOrder);
        if (!wish) return;

        const dialog = $('wishDetailModal');
        $('modalWishTitle').textContent = `Chi tiết Nguyện vọng ${wish.order}: ${wish.schoolName}`;
        $('modalWishBody').innerHTML = `
            <div class="summary-box" style="margin-top:0;">
                <dl>
                    <dt>Trường THPT</dt>
                    <dd>${esc(wish.schoolName)} (${esc(wish.district)})</dd>
                    <dt>Điểm chuẩn của trường</dt>
                    <dd style="color:#1769e0; font-size:15px;">${wish.benchmark.toFixed(2)} điểm</dd>
                    <dt>Điểm xét tuyển của bạn</dt>
                    <dd style="color:#15803d; font-size:15px;">${candidate.scores.total.toFixed(2)} điểm</dd>
                    <dt>Trạng thái nguyện vọng</dt>
                    <dd><strong>${esc(wish.statusText)}</strong></dd>
                </dl>
            </div>
            <div class="wf-alert ${wish.status === 'admitted' ? 'success' : 'info'}" style="margin-bottom:0;">
                <strong>Ghi chú từ Hội đồng tuyển sinh:</strong><br>
                ${esc(wish.note)}
            </div>
        `;

        dialog.showModal();
        $('modalWishCloseBtn').focus();
    }

    // Hiển thị trạng thái công bố / chưa công bố (Exception Flow 2.1)
    function renderPublishState() {
        const publishedSection = $('publishedResultSection');
        const unpublishedSection = $('unpublishedResultSection');
        const toggleBtn = $('togglePublishResultBtn');

        if (!isPublished) {
            toggleBtn.textContent = 'Mô phỏng: Chuyển sang "Đã công bố kết quả"';
            toggleBtn.style.background = '#e7f8f0';
            toggleBtn.style.color = '#15803d';
            publishedSection.style.display = 'none';
            unpublishedSection.style.display = 'block';
        } else {
            toggleBtn.textContent = 'Mô phỏng: Kết quả chưa công bố (Ca 2.1)';
            toggleBtn.style.background = '#ffffff';
            toggleBtn.style.color = '#1e293b';
            publishedSection.style.display = 'block';
            unpublishedSection.style.display = 'none';
            renderResults(currentCandidate);
        }
    }

    // Khởi tạo
    function init() {
        const page = document.querySelector('[data-page="tra-cuu-ket-qua"]');
        if (!page) return;

        renderPublishState();

        // Đóng modal chi tiết nguyện vọng
        const dialog = $('wishDetailModal');
        $('modalWishCloseBtn').onclick = () => dialog.close();
        $('modalWishFooterCloseBtn').onclick = () => dialog.close();
        dialog.addEventListener('click', e => {
            if (e.target === dialog) dialog.close();
        });

        // Tra cứu số báo danh khác (Exception Flow 2.2)
        $('btnSearchSbd').addEventListener('click', () => {
            const inputSbd = $('searchSbdInput').value.trim();
            if (!inputSbd) {
                alert('Vui lòng nhập Số báo danh cần tra cứu.');
                return;
            }

            const found = admissionResults[inputSbd];
            const notFoundBox = $('sbdNotFoundAlert');

            if (!found) {
                // Exception Flow 2.2
                notFoundBox.hidden = false;
                notFoundBox.innerHTML = `⚠️ <strong>Không tìm thấy kết quả xét tuyển!</strong> Không tìm thấy thông tin điểm và nguyện vọng tương ứng với số báo danh <strong>"${esc(inputSbd)}"</strong>. Vui lòng kiểm tra lại.`;
                notFoundBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                notFoundBox.hidden = true;
                currentCandidate = found;
                renderResults(currentCandidate);
            }
        });

        // Toggle mô phỏng Exception Flow 2.1 (Chưa công bố kết quả)
        $('togglePublishResultBtn').addEventListener('click', () => {
            isPublished = !isPublished;
            renderPublishState();
        });

        // In giấy báo trúng tuyển
        $('btnPrintLetter').addEventListener('click', () => {
            window.print();
        });
    }

    // Chuẩn bị Giấy báo trúng tuyển bản in
    function renderPrintLetter(candidate) {
        const area = $('admissionLetterPrintArea');
        if (!area || !candidate.admittedWish) return;

        area.innerHTML = `
            <div style="text-align: center; margin-bottom: 24px;">
                <h4 style="margin: 0;">ỦY BAN NHÂN DÂN THÀNH PHỐ HỒ CHÍ MINH</h4>
                <h3 style="margin: 4px 0 0;">SỞ GIÁO DỤC VÀ ĐÀO TẠO</h3>
                <h1 style="margin: 18px 0 6px; font-size: 22px;">GIẤY BÁO TRÚNG TUYỂN VÀO LỚP 10 THPT</h1>
                <p style="margin: 0; font-style: italic;">Năm học: 2026 - 2027</p>
            </div>

            <div style="font-size: 14px; line-height: 1.8; margin-bottom: 24px;">
                <p>Hội đồng tuyển sinh Sở Giáo dục và Đào tạo Thành phố Hồ Chí Minh trân trọng thông báo:</p>
                <p>Thí sinh: <strong>${esc(candidate.name)}</strong></p>
                <p>Số báo danh: <strong>${esc(candidate.sbd)}</strong> | Ngày sinh: <strong>${esc(candidate.dob)}</strong></p>
                <p>Học sinh trường THCS: <strong>${esc(candidate.school)}</strong></p>
                <p>Kết quả điểm thi: Ngữ văn: <strong>${candidate.scores.van.toFixed(2)}</strong> | Toán: <strong>${candidate.scores.toan.toFixed(2)}</strong> | Ngoại ngữ: <strong>${candidate.scores.anh.toFixed(2)}</strong></p>
                <p>Tổng điểm xét tuyển: <strong>${candidate.scores.total.toFixed(2)}</strong> điểm</p>
                <hr style="margin: 14px 0; border: none; border-top: 1px dashed #000;">
                <p style="font-size: 16px;"><strong>ĐÃ TRÚNG TUYỂN VÀO:</strong> <span style="font-size: 18px; text-transform: uppercase;">${esc(candidate.admittedSchool)}</span></p>
                <p>Theo diện: <strong>Nguyện vọng ${candidate.admittedWish}</strong> (Điểm chuẩn trúng tuyển: <strong>${candidate.wishes[0].benchmark.toFixed(2)}</strong>)</p>
            </div>

            <div style="font-size: 13px; line-height: 1.6; background: #f9fafb; border: 1px solid #e5e7eb; padding: 14px; margin-bottom: 30px;">
                <strong>HƯỚNG DẪN LÀM THỦ TỤC NHẬP HỌC:</strong>
                <p style="margin: 4px 0 0;">Thí sinh nộp hồ sơ nhập học từ ngày <strong>26/06/2026</strong> đến 17:00 ngày <strong>05/07/2026</strong> tại trường THPT trúng tuyển. Quá thời hạn trên nếu không xác nhận nhập học, kết quả trúng tuyển sẽ bị hủy theo quy chế.</p>
            </div>

            <div style="display: flex; justify-content: space-between; text-align: center; margin-top: 40px; font-size: 14px;">
                <div>
                    <p><strong>THÍ SINH / PHỤ HUYNH</strong></p>
                    <p style="margin-top: 60px;">(Ký và ghi rõ họ tên)</p>
                </div>
                <div>
                    <p><em>TP. Hồ Chí Minh, ngày 24 tháng 06 năm 2026</em></p>
                    <p><strong>CHỦ TỊCH HỘI ĐỒNG TUYỂN SINH</strong></p>
                    <p style="margin-top: 60px;">(Ký tên và đóng dấu)</p>
                </div>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
