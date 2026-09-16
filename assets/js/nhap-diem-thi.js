/**
 * ==========================================================================
 * JavaScript: Nhập điểm thi (Use Case 5 - Hội đồng chấm thi)
 * Hệ thống Quản lý tuyển sinh lớp 10
 *
 * Đáp ứng đầy đủ đặc tả nghiệp vụ:
 * - Tiền điều kiện: Đã đăng nhập, có quyền nhập điểm, kỳ thi/môn thi/bài thi tồn tại, chấm thi hoàn tất.
 * - Hậu điều kiện: Điểm hợp lệ được lưu, trạng thái cập nhật, thông tin người nhập & thời điểm được ghi nhận.
 * - Basic Flow (1-13): Chọn chức năng -> Chọn kỳ thi/môn thi -> Danh sách bài thi -> Chọn bài thi
 *   -> Nhập điểm -> Kiểm tra hợp lệ -> Xác nhận -> Lưu điểm & cập nhật -> Ghi nhận người & thời gian -> Thông báo -> Kết thúc.
 * - Alternative Flow:
 *   + 5.1: Chọn bài thi khác bất kỳ lúc nào.
 *   + 9.1: Điều chỉnh điểm trước khi lưu (từ hộp thoại xác nhận).
 *   + 12.1: Tiếp tục nhập điểm cho bài thi kế tiếp chưa có điểm.
 * - Exception Flow:
 *   + 4.1: Không có bài thi cần nhập điểm (với môn thi đã chọn).
 *   + 8.1: Điểm thi không hợp lệ (trống, sai định dạng, ngoài khoảng 0-10).
 *   + 8.2: Bài thi chưa đủ điều kiện nhập điểm (chưa hoàn tất chấm thi).
 *   + 10.1: Không thể lưu điểm thi (Mô phỏng lỗi hệ thống lưu trữ).
 *   + 10.2: Điểm bài thi đã được xác nhận chính thức (không thể thay đổi).
 * ==========================================================================
 */

(() => {
    'use strict';

    const STORAGE_KEY = 'tuyensinh10.uc5_nhapdiem.v2';

    // Thông tin tài khoản đăng nhập (Actor: Hội đồng chấm thi)
    const CURRENT_ACTOR = {
        name: 'Nguyễn Thị Thúy Vy',
        role: 'Hội đồng chấm thi',
        department: 'Ban Thư ký & Chấm thi',
        permission: 'PERMISSION_ENTER_SCORES'
    };

    // Danh mục Kỳ thi (Basic Flow 2)
    const EXAMS = [
        {
            id: 'KT2026',
            name: 'Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2026 - 2027',
            status: 'active',
            year: '2026 - 2027'
        },
        {
            id: 'KT2025',
            name: 'Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2025 - 2026',
            status: 'closed',
            year: '2025 - 2026'
        }
    ];

    // Danh mục Môn thi (Basic Flow 2)
    const SUBJECTS = [
        {
            id: 'TOAN',
            name: 'Toán',
            maxScore: 10,
            step: 0.25,
            coeff: 1,
            description: 'Thang điểm 10, bước điểm 0.25, hình thức: Tự luận'
        },
        {
            id: 'VAN',
            name: 'Ngữ văn',
            maxScore: 10,
            step: 0.25,
            coeff: 1,
            description: 'Thang điểm 10, bước điểm 0.25, hình thức: Tự luận'
        },
        {
            id: 'ANH',
            name: 'Tiếng Anh',
            maxScore: 10,
            step: 0.25,
            coeff: 1,
            description: 'Thang điểm 10, bước điểm 0.25, hình thức: Trắc nghiệm + Tự luận'
        },
        {
            id: 'HOA',
            name: 'Hóa học (Chuyên)',
            maxScore: 10,
            step: 0.25,
            coeff: 2,
            description: 'Môn thi chuyên (Dùng kiểm thử ngoại lệ 4.1: Chưa có bài thi)'
        }
    ];

    // Bộ dữ liệu bài thi mẫu phong phú, phục vụ đầy đủ các kịch bản
    const DEFAULT_PAPERS = [
        // --- MÔN TOÁN ---
        {
            id: 'BT-T01',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-001',
            phongThi: 'Phòng 01',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'HOAN_TAT', // Đã chấm xong
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Bài thi bình thường'
        },
        {
            id: 'BT-T02',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-002',
            phongThi: 'Phòng 01',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Bài thi bình thường'
        },
        {
            id: 'BT-T03',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-003',
            phongThi: 'Phòng 01',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'DA_NHAP',
            diem: 8.50,
            nguoiNhap: 'Nguyễn Thị Thúy Vy',
            thoiGianNhap: '16/09/2026 14:20:15',
            ghiChu: 'Đã nhập điểm lần 1'
        },
        {
            id: 'BT-T04',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-004',
            phongThi: 'Phòng 02',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Bài thi bình thường'
        },
        {
            id: 'BT-T05',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-005',
            phongThi: 'Phòng 02',
            tuiBaiThi: 'Túi 02',
            trangThaiCham: 'CHUA_HOAN_TAT', // Exception 8.2: Chưa chấm xong
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Chưa hoàn tất chấm vòng 2 (Đang đối sánh)'
        },
        {
            id: 'BT-T06',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-006',
            phongThi: 'Phòng 02',
            tuiBaiThi: 'Túi 02',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHINH_THUC', // Exception 10.2: Điểm đã xác nhận chính thức
            trangThaiNhapDiem: 'DA_NHAP',
            diem: 9.25,
            nguoiNhap: 'Ban Thư ký HĐ Chấm thi',
            thoiGianNhap: '15/09/2026 09:30:00',
            ghiChu: 'Điểm đã xác nhận chính thức và khóa sổ'
        },
        {
            id: 'BT-T07',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-007',
            phongThi: 'Phòng 03',
            tuiBaiThi: 'Túi 02',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Bài thi bình thường'
        },
        {
            id: 'BT-T08',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-008',
            phongThi: 'Phòng 03',
            tuiBaiThi: 'Túi 02',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'DA_NHAP',
            diem: 6.75,
            nguoiNhap: 'Cô Lê Thị Mai',
            thoiGianNhap: '16/09/2026 10:15:40',
            ghiChu: 'Đã nhập điểm lần 1'
        },
        {
            id: 'BT-T09',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-009',
            phongThi: 'Phòng 04',
            tuiBaiThi: 'Túi 03',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Bài thi bình thường'
        },
        {
            id: 'BT-T10',
            examId: 'KT2026',
            subjectId: 'TOAN',
            maPhach: 'P-TOAN-010',
            phongThi: 'Phòng 04',
            tuiBaiThi: 'Túi 03',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Bài thi bình thường'
        },

        // --- MÔN NGỮ VĂN ---
        {
            id: 'BT-V01',
            examId: 'KT2026',
            subjectId: 'VAN',
            maPhach: 'P-VAN-101',
            phongThi: 'Phòng 01',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Bài thi bình thường'
        },
        {
            id: 'BT-V02',
            examId: 'KT2026',
            subjectId: 'VAN',
            maPhach: 'P-VAN-102',
            phongThi: 'Phòng 01',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'DA_NHAP',
            diem: 7.75,
            nguoiNhap: 'Nguyễn Thị Thúy Vy',
            thoiGianNhap: '16/09/2026 15:10:00',
            ghiChu: 'Đã nhập điểm'
        },
        {
            id: 'BT-V03',
            examId: 'KT2026',
            subjectId: 'VAN',
            maPhach: 'P-VAN-103',
            phongThi: 'Phòng 02',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'CHUA_HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Đang chấm kiểm tra'
        },

        // --- MÔN TIẾNG ANH ---
        {
            id: 'BT-A01',
            examId: 'KT2026',
            subjectId: 'ANH',
            maPhach: 'P-ANH-201',
            phongThi: 'Phòng 01',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'CHUA_NHAP',
            diem: null,
            nguoiNhap: null,
            thoiGianNhap: null,
            ghiChu: 'Bài thi trắc nghiệm + tự luận'
        },
        {
            id: 'BT-A02',
            examId: 'KT2026',
            subjectId: 'ANH',
            maPhach: 'P-ANH-202',
            phongThi: 'Phòng 01',
            tuiBaiThi: 'Túi 01',
            trangThaiCham: 'HOAN_TAT',
            trangThaiXacNhan: 'CHUA_KHOA',
            trangThaiNhapDiem: 'DA_NHAP',
            diem: 9.00,
            nguoiNhap: 'Nguyễn Thị Thúy Vy',
            thoiGianNhap: '16/09/2026 11:00:22',
            ghiChu: 'Đã hoàn tất nhập điểm'
        }
    ];

    // State ứng dụng
    let papers = [];
    let currentExamId = 'KT2026';
    let currentSubjectId = 'TOAN';
    let selectedPaperId = null;
    let pendingScore = null;

    // Cờ mô phỏng kịch bản ngoại lệ (Simulation Flags)
    let simulateSaveError = false; // Exception Flow 10.1

    // DOM Utilities
    const $ = id => document.getElementById(id);
    const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    // Format ngày giờ Việt Nam
    function formatNow() {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    // Tải dữ liệu từ LocalStorage
    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    papers = parsed;
                    return;
                }
            }
        } catch (_) {}
        papers = JSON.parse(JSON.stringify(DEFAULT_PAPERS));
        saveData();
    }

    // Lưu dữ liệu vào LocalStorage
    function saveData() {
        if (simulateSaveError) {
            // Exception Flow 10.1: Giả lập lỗi lưu
            return false;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
            return true;
        } catch (_) {
            return false;
        }
    }

    // Hiển thị Toast thông báo
    function showToast(text, type = 'success') {
        const existing = document.querySelector('.score-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `score-toast ${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✓' : '⚠'}</span>
            <span>${esc(text)}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Hiển thị Banner cảnh báo trên trang
    function setPageAlert(text, type = 'error') {
        const alertBox = $('scorePageAlert');
        if (!alertBox) return;

        if (!text) {
            alertBox.hidden = true;
            alertBox.textContent = '';
            return;
        }

        alertBox.hidden = false;
        alertBox.className = `wf-alert ${type}`;
        alertBox.innerHTML = `<strong>${type === 'success' ? '✓ Thành công:' : type === 'warning' ? '⚠ Chú ý:' : '✖ Lỗi:'}</strong> ${esc(text)}`;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Khởi tạo các bộ chọn dropdown Kỳ thi & Môn thi (Basic Flow 2)
    function initSelectors() {
        const examSelect = $('examSelect');
        const subjectSelect = $('subjectSelect');

        if (examSelect) {
            examSelect.innerHTML = EXAMS.map(e => `
                <option value="${esc(e.id)}" ${e.id === currentExamId ? 'selected' : ''}>
                    ${esc(e.name)} (${esc(e.status === 'active' ? 'Đang chấm & nhập điểm' : 'Đã kết thúc')})
                </option>
            `).join('');

            examSelect.addEventListener('change', () => {
                currentExamId = examSelect.value;
                selectedPaperId = null;
                render();
            });
        }

        if (subjectSelect) {
            subjectSelect.innerHTML = SUBJECTS.map(s => `
                <option value="${esc(s.id)}" ${s.id === currentSubjectId ? 'selected' : ''}>
                    ${esc(s.name)} (Hệ số ${s.coeff})
                </option>
            `).join('');

            subjectSelect.addEventListener('change', () => {
                currentSubjectId = subjectSelect.value;
                selectedPaperId = null;
                setPageAlert('');
                render();
            });
        }
    }

    // Lọc danh sách bài thi theo kỳ thi và môn thi hiện tại (Basic Flow 4)
    function getFilteredPapers() {
        let list = papers.filter(p => p.examId === currentExamId && p.subjectId === currentSubjectId);

        // Lọc theo từ khóa tìm kiếm (Mã phách, phòng thi)
        const keyword = ($('searchInput')?.value || '').trim().toLowerCase();
        if (keyword) {
            list = list.filter(p => 
                p.maPhach.toLowerCase().includes(keyword) || 
                p.phongThi.toLowerCase().includes(keyword) ||
                p.tuiBaiThi.toLowerCase().includes(keyword)
            );
        }

        // Lọc theo trạng thái nhập điểm
        const statusFilter = $('statusFilter')?.value || 'all';
        if (statusFilter === 'chua_nhap') {
            list = list.filter(p => p.trangThaiNhapDiem === 'CHUA_NHAP');
        } else if (statusFilter === 'da_nhap') {
            list = list.filter(p => p.trangThaiNhapDiem === 'DA_NHAP');
        } else if (statusFilter === 'chua_cham_xong') {
            list = list.filter(p => p.trangThaiCham !== 'HOAN_TAT');
        }

        return list;
    }

    // Cập nhật Thẻ Thống kê (Statistics)
    function updateStats() {
        const allInSubject = papers.filter(p => p.examId === currentExamId && p.subjectId === currentSubjectId);
        const total = allInSubject.length;
        const entered = allInSubject.filter(p => p.trangThaiNhapDiem === 'DA_NHAP').length;
        const notEntered = allInSubject.filter(p => p.trangThaiNhapDiem === 'CHUA_NHAP' && p.trangThaiCham === 'HOAN_TAT').length;
        const notEligible = allInSubject.filter(p => p.trangThaiCham !== 'HOAN_TAT' || p.trangThaiXacNhan === 'CHINH_THUC').length;

        if ($('statTotalPapers')) $('statTotalPapers').textContent = total;
        if ($('statEnteredScores')) {
            const percent = total > 0 ? Math.round((entered / total) * 100) : 0;
            $('statEnteredScores').textContent = `${entered} (${percent}%)`;
        }
        if ($('statPendingScores')) $('statPendingScores').textContent = notEntered;
        if ($('statNotEligible')) $('statNotEligible').textContent = notEligible;
    }

    // Render Bảng danh sách bài thi (Basic Flow 4)
    function renderPaperTable() {
        const tbody = $('paperTableBody');
        const emptyBox = $('emptyPaperBox');
        const tableWrap = $('paperTableWrap');
        const list = getFilteredPapers();
        const allInSubject = papers.filter(p => p.examId === currentExamId && p.subjectId === currentSubjectId);

        // Exception Flow 4.1: Không có bài thi cần nhập điểm
        if (allInSubject.length === 0) {
            if (tableWrap) tableWrap.hidden = true;
            if (emptyBox) {
                emptyBox.hidden = false;
                emptyBox.innerHTML = `
                    <div class="empty-paper-icon">📭</div>
                    <h3>Không có bài thi cần nhập điểm</h3>
                    <p>Hệ thống không tìm thấy bài thi nào cần nhập điểm đối với môn thi đã chọn trong kỳ thi này. Vui lòng kiểm tra lại môn thi hoặc danh sách phân công chấm thi.</p>
                `;
            }
            // Đóng Use Case hoặc reset form nhập
            renderInputPanel(null);
            return;
        }

        // Nếu có bài thi trong môn nhưng bộ lọc tìm kiếm ra 0
        if (emptyBox) emptyBox.hidden = true;
        if (tableWrap) tableWrap.hidden = false;

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty">Không tìm thấy bài thi nào phù hợp với điều kiện tìm kiếm/lọc.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map((paper, idx) => {
            const isSelected = paper.id === selectedPaperId;
            let statusBadge = '';
            let actionBtn = '';

            // Kiểm tra trạng thái chấm thi (Exception 8.2)
            if (paper.trangThaiCham !== 'HOAN_TAT') {
                statusBadge = '<span class="pill orange">Chưa xong chấm thi</span>';
            } else if (paper.trangThaiXacNhan === 'CHINH_THUC') { // Exception 10.2
                statusBadge = '<span class="pill blue">Đã khóa chính thức</span>';
            } else if (paper.trangThaiNhapDiem === 'DA_NHAP') {
                statusBadge = '<span class="pill green">Đã nhập điểm</span>';
            } else {
                statusBadge = '<span class="pill">Chưa nhập điểm</span>';
            }

            // Điểm hiển thị
            let scoreDisplay = '<span class="score-display-cell no-score">—</span>';
            if (paper.diem !== null && paper.diem !== undefined) {
                scoreDisplay = `<span class="score-display-cell has-score">${Number(paper.diem).toFixed(2)}</span>`;
            }

            // Nút thao tác
            if (paper.trangThaiXacNhan === 'CHINH_THUC') {
                actionBtn = `<button type="button" class="text-button select-paper-btn" data-id="${esc(paper.id)}" title="Xem thông tin bài thi đã khóa">Xem chi tiết</button>`;
            } else if (paper.trangThaiCham !== 'HOAN_TAT') {
                actionBtn = `<button type="button" class="text-button select-paper-btn" data-id="${esc(paper.id)}" style="color:#d97706;" title="Bài thi chưa đủ điều kiện nhập điểm">Kiểm tra</button>`;
            } else if (paper.trangThaiNhapDiem === 'DA_NHAP') {
                actionBtn = `<button type="button" class="secondary-button select-paper-btn" style="padding:5px 10px; font-size:11px;" data-id="${esc(paper.id)}">Sửa điểm</button>`;
            } else {
                actionBtn = `<button type="button" class="primary-button select-paper-btn" style="padding:5px 12px; font-size:11px;" data-id="${esc(paper.id)}">Nhập điểm</button>`;
            }

            return `
                <tr class="${isSelected ? 'selected-exam-row' : ''}" data-id="${esc(paper.id)}">
                    <td>${idx + 1}</td>
                    <td>
                        <span class="phach-badge">${esc(paper.maPhach)}</span>
                        <small style="color:#64748b;">${esc(paper.tuiBaiThi)} • ${esc(paper.phongThi)}</small>
                    </td>
                    <td>${scoreDisplay}</td>
                    <td>${statusBadge}</td>
                    <td>
                        ${paper.nguoiNhap ? `<strong>${esc(paper.nguoiNhap)}</strong>` : '<span style="color:#94a3b8;">Chưa ghi nhận</span>'}
                        ${paper.thoiGianNhap ? `<small style="color:#64748b;">${esc(paper.thoiGianNhap)}</small>` : ''}
                    </td>
                    <td style="text-align: right;">${actionBtn}</td>
                </tr>
            `;
        }).join('');

        // Lắng nghe sự kiện chọn bài thi (Basic Flow 5 & Alternative Flow 5.1)
        tbody.querySelectorAll('.select-paper-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const paperId = btn.getAttribute('data-id');
                selectPaper(paperId);
            });
        });

        tbody.querySelectorAll('tr').forEach(tr => {
            tr.addEventListener('click', () => {
                const paperId = tr.getAttribute('data-id');
                if (paperId) selectPaper(paperId);
            });
        });
    }

    // Chọn bài thi cần nhập điểm (Basic Flow 5, Alternative Flow 5.1)
    function selectPaper(paperId) {
        selectedPaperId = paperId;
        const paper = papers.find(p => p.id === paperId);
        if (!paper) return;

        // Cập nhật UI bảng
        document.querySelectorAll('#paperTableBody tr').forEach(r => {
            r.classList.toggle('selected-exam-row', r.getAttribute('data-id') === paperId);
        });

        // Hiển thị thông tin bài thi (Basic Flow 6)
        renderInputPanel(paper);
    }

    // Hiển thị panel nhập điểm (Basic Flow 6)
    function renderInputPanel(paper) {
        const panel = $('scoreInputPanel');
        if (!panel) return;

        if (!paper) {
            panel.innerHTML = `
                <div class="panel-header">
                    <div>
                        <h2>Nhập điểm bài thi</h2>
                        <p>Chọn một bài thi từ danh sách bên trái để bắt đầu nhập điểm.</p>
                    </div>
                </div>
                <div class="empty" style="padding: 40px 20px;">
                    <div style="font-size: 36px; margin-bottom: 10px;">📋</div>
                    <p style="color: #64748b;">Chưa có bài thi nào được chọn.</p>
                    <span style="font-size: 12px; color: #94a3b8;">Vui lòng bấm nút <strong>"Nhập điểm"</strong> trên dòng bài thi tương ứng.</span>
                </div>
            `;
            return;
        }

        const currentSubject = SUBJECTS.find(s => s.id === paper.subjectId) || { name: 'Môn thi', maxScore: 10, step: 0.25 };

        // Kiểm tra Exception 8.2: Bài thi chưa đủ điều kiện nhập điểm
        const isNotEligible = paper.trangThaiCham !== 'HOAN_TAT';

        // Kiểm tra Exception 10.2: Điểm bài thi đã được xác nhận chính thức
        const isOfficialLocked = paper.trangThaiXacNhan === 'CHINH_THUC';

        let warningBanner = '';
        if (isNotEligible) {
            warningBanner = `
                <div class="wf-alert error" style="margin-bottom: 16px;">
                    <strong>⛔ Bài thi chưa đủ điều kiện nhập điểm (Ca ngoại lệ 8.2):</strong><br>
                    Hệ thống phát hiện bài thi này <strong>chưa hoàn tất quá trình chấm thi</strong> (${esc(paper.ghiChu)}). 
                    Điểm thi không được phép ghi nhận cho đến khi công tác chấm thi hoàn tất.
                </div>
            `;
        } else if (isOfficialLocked) {
            warningBanner = `
                <div class="wf-alert warning" style="margin-bottom: 16px;">
                    <strong>🔒 Điểm bài thi đã được xác nhận chính thức (Ca ngoại lệ 10.2):</strong><br>
                    Điểm của bài thi này đã được Ban Thư ký khóa sổ và công bố chính thức. 
                    <strong>Không thể thay đổi điểm</strong> bằng chức năng nhập điểm thông thường.
                </div>
            `;
        }

        panel.innerHTML = `
            <div class="panel-header">
                <div>
                    <h2>${isOfficialLocked ? 'Thông tin bài thi đã chốt điểm' : paper.trangThaiNhapDiem === 'DA_NHAP' ? 'Chỉnh sửa điểm bài thi' : 'Nhập điểm bài thi'}</h2>
                    <p>Mã phách: <strong style="color:#1769e0;">${esc(paper.maPhach)}</strong> • ${esc(currentSubject.name)}</p>
                </div>
                <span class="pill ${isOfficialLocked ? 'blue' : isNotEligible ? 'orange' : paper.trangThaiNhapDiem === 'DA_NHAP' ? 'green' : ''}">
                    ${isOfficialLocked ? 'Đã khóa điểm' : isNotEligible ? 'Chưa xong chấm' : paper.trangThaiNhapDiem === 'DA_NHAP' ? 'Đã nhập điểm' : 'Chờ nhập điểm'}
                </span>
            </div>

            ${warningBanner}

            <div class="score-active-target">
                <div class="score-active-target-title">Thông tin chi tiết bài thi (Bước 6)</div>
                <div class="target-details-grid">
                    <div class="target-details-item">
                        <span>Mã bài thi / Mã phách:</span>
                        <strong class="phach-badge">${esc(paper.maPhach)}</strong>
                    </div>
                    <div class="target-details-item">
                        <span>Môn thi:</span>
                        <strong>${esc(currentSubject.name)}</strong>
                    </div>
                    <div class="target-details-item">
                        <span>Phòng thi & Túi bài:</span>
                        <strong>${esc(paper.phongThi)} (${esc(paper.tuiBaiThi)})</strong>
                    </div>
                    <div class="target-details-item">
                        <span>Điểm hiện tại:</span>
                        <strong style="color:${paper.diem !== null ? '#159465' : '#7b8492'}; font-size:14px;">
                            ${paper.diem !== null ? Number(paper.diem).toFixed(2) : 'Chưa có điểm'}
                        </strong>
                    </div>
                    <div class="target-details-item">
                        <span>Trạng thái chấm thi:</span>
                        <strong>${paper.trangThaiCham === 'HOAN_TAT' ? '✓ Đã hoàn tất chấm' : '⚠ Đang chấm (Chưa xong)'}</strong>
                    </div>
                    <div class="target-details-item">
                        <span>Người phụ trách nhập:</span>
                        <strong>${esc(CURRENT_ACTOR.name)}</strong>
                    </div>
                </div>
            </div>

            <form id="scoreInputForm" novalidate onsubmit="return false;">
                <div class="field">
                    <label for="scoreInput">
                        Điểm bài thi (Thang điểm 0 - ${currentSubject.maxScore}) <span class="required">*</span>
                    </label>
                    <div class="big-score-input-wrap">
                        <input 
                            type="text" 
                            id="scoreInput" 
                            class="big-score-input"
                            inputmode="decimal" 
                            placeholder="0.00" 
                            maxlength="5"
                            value="${paper.diem !== null ? paper.diem : ''}"
                            ${isNotEligible || isOfficialLocked ? 'disabled' : ''}
                            aria-describedby="scoreInputHint scoreInputError"
                        />
                        <div>
                            <span class="hint" id="scoreInputHint">
                                Nhập số từ 0.00 đến 10.00 (Chấp nhận dấu chấm hoặc phẩy, vd: 8.25 hoặc 8,5).
                            </span>
                            <div class="field-error" id="scoreInputError"></div>
                        </div>
                    </div>

                    ${!isNotEligible && !isOfficialLocked ? `
                        <div class="quick-score-buttons">
                            <span style="font-size: 11px; color: #64748b; align-self: center; margin-right: 4px;">Điểm nhanh:</span>
                            <button type="button" class="quick-score-btn" data-val="5.00">5.00</button>
                            <button type="button" class="quick-score-btn" data-val="6.50">6.50</button>
                            <button type="button" class="quick-score-btn" data-val="7.00">7.00</button>
                            <button type="button" class="quick-score-btn" data-val="7.75">7.75</button>
                            <button type="button" class="quick-score-btn" data-val="8.00">8.00</button>
                            <button type="button" class="quick-score-btn" data-val="8.50">8.50</button>
                            <button type="button" class="quick-score-btn" data-val="9.00">9.00</button>
                            <button type="button" class="quick-score-btn" data-val="9.50">9.50</button>
                            <button type="button" class="quick-score-btn" data-val="10.00">10.00</button>
                        </div>
                    ` : ''}
                </div>

                <div class="field">
                    <label for="paperNote">Ghi chú của Hội đồng chấm (Tùy chọn)</label>
                    <input 
                        type="text" 
                        id="paperNote" 
                        placeholder="Nhập ghi chú nếu có (ví dụ: bài thi có biểu hiện đặc biệt)..."
                        value="${esc(paper.ghiChu || '')}"
                        ${isNotEligible || isOfficialLocked ? 'disabled' : ''}
                    />
                </div>

                <div class="actions">
                    <button type="button" id="btnCancelInput" class="secondary-button">
                        Hủy / Chọn bài khác
                    </button>

                    ${!isNotEligible && !isOfficialLocked ? `
                        <button type="button" id="btnSubmitScore" class="primary-button">
                            Xác nhận nhập điểm (Bước 9)
                        </button>
                    ` : `
                        <button type="button" class="primary-button" disabled>
                            ${isOfficialLocked ? 'Điểm đã khóa chính thức' : 'Chưa đủ điều kiện nhập điểm'}
                        </button>
                    `}
                </div>
            </form>
        `;

        // Focus vào ô nhập điểm nếu bài thi hợp lệ
        if (!isNotEligible && !isOfficialLocked) {
            setTimeout(() => {
                const input = $('scoreInput');
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 100);
        }

        // Lắng nghe nút chọn điểm nhanh
        panel.querySelectorAll('.quick-score-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = $('scoreInput');
                if (input && !input.disabled) {
                    input.value = btn.getAttribute('data-val');
                    clearFieldError();
                    input.focus();
                }
            });
        });

        // Nút Hủy / Chọn bài khác (Alternative Flow 5.1)
        $('btnCancelInput')?.addEventListener('click', () => {
            selectedPaperId = null;
            clearFieldError();
            render();
        });

        // Nút Xác nhận nhập điểm (Basic Flow 8, 9)
        $('btnSubmitScore')?.addEventListener('click', () => {
            handleValidateAndConfirm(paper);
        });

        // Nhấn Enter trong ô điểm
        $('scoreInput')?.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleValidateAndConfirm(paper);
            }
        });
    }

    // Xóa thông báo lỗi trường nhập
    function clearFieldError() {
        const errorEl = $('scoreInputError');
        const input = $('scoreInput');
        if (errorEl) errorEl.textContent = '';
        if (input) input.removeAttribute('aria-invalid');
    }

    // Báo lỗi trường nhập (Exception Flow 8.1)
    function showFieldError(msg) {
        const errorEl = $('scoreInputError');
        const input = $('scoreInput');
        if (errorEl) errorEl.textContent = msg;
        if (input) {
            input.setAttribute('aria-invalid', 'true');
            input.focus();
            input.select();
        }
    }

    // Kiểm tra tính hợp lệ của điểm thi (Basic Flow 8, Exception 8.1, 8.2, 10.2)
    function handleValidateAndConfirm(paper) {
        clearFieldError();
        setPageAlert('');

        // Kiểm tra Exception 8.2: Bài thi chưa đủ điều kiện
        if (paper.trangThaiCham !== 'HOAN_TAT') {
            setPageAlert(`Bài thi ${paper.maPhach} chưa hoàn tất quá trình chấm thi. Bài thi chưa đủ điều kiện nhập điểm. Điểm không được ghi nhận.`, 'error');
            return;
        }

        // Kiểm tra Exception 10.2: Điểm đã xác nhận chính thức
        if (paper.trangThaiXacNhan === 'CHINH_THUC') {
            setPageAlert(`Điểm của bài thi ${paper.maPhach} đã được xác nhận chính thức. Không thể thay đổi điểm bằng chức năng nhập điểm.`, 'error');
            return;
        }

        const input = $('scoreInput');
        const rawValue = (input?.value || '').trim();

        // 8.1: Kiểm tra bỏ trống
        if (!rawValue) {
            showFieldError('Vui lòng nhập điểm của bài thi.');
            setPageAlert('Điểm thi không hợp lệ: Điểm bài thi không được để trống.', 'error');
            return;
        }

        // Chuẩn hóa dấu phẩy thành dấu chấm
        const normalized = rawValue.replace(',', '.');

        // 8.1: Kiểm tra định dạng số (tối đa 2 chữ số thập phân)
        if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
            showFieldError('Điểm phải là chữ số hợp lệ, tối đa 2 chữ số thập phân (Ví dụ: 8.25 hoặc 8,5).');
            setPageAlert('Điểm thi không hợp lệ: Không đúng định dạng số thập phân.', 'error');
            return;
        }

        const scoreNum = parseFloat(normalized);

        // 8.1: Kiểm tra nằm ngoài thang điểm 0 - 10
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
            showFieldError('Điểm bài thi phải nằm trong thang điểm từ 0.00 đến 10.00.');
            setPageAlert('Điểm thi không hợp lệ: Điểm nằm ngoài thang điểm quy định (0.00 - 10.00).', 'error');
            return;
        }

        pendingScore = {
            paperId: paper.id,
            score: scoreNum,
            note: ($('paperNote')?.value || '').trim()
        };

        // Mở hộp thoại xác nhận (Basic Flow 9)
        openConfirmModal(paper, scoreNum);
    }

    // Mở Modal xác nhận nhập điểm (Basic Flow 9, Alternative Flow 9.1)
    function openConfirmModal(paper, scoreNum) {
        const modal = $('scoreConfirmModal');
        if (!modal) return;

        const currentSubject = SUBJECTS.find(s => s.id === paper.subjectId) || { name: 'Môn thi' };

        $('confirmMaPhach').textContent = paper.maPhach;
        $('confirmMonThi').textContent = currentSubject.name;
        $('confirmPhongThi').textContent = `${paper.phongThi} (${paper.tuiBaiThi})`;
        $('confirmOldScore').textContent = paper.diem !== null ? Number(paper.diem).toFixed(2) : 'Chưa có';
        $('confirmNewScore').textContent = scoreNum.toFixed(2);
        $('confirmActor').textContent = `${CURRENT_ACTOR.name} (${CURRENT_ACTOR.role})`;
        $('confirmTime').textContent = formatNow();

        modal.showModal();

        // Nút Chỉnh sửa lại (Alternative Flow 9.1: Điều chỉnh điểm trước khi lưu)
        $('btnAdjustScore').onclick = () => {
            modal.close();
            const input = $('scoreInput');
            if (input) {
                input.focus();
                input.select();
            }
        };

        // Nút Lưu điểm (Basic Flow 10, 11, 12, Exception 10.1)
        $('btnSaveScoreConfirmed').onclick = () => {
            modal.close();
            executeSaveScore(paper, scoreNum);
        };
    }

    // Thực hiện lưu điểm và hoàn tất Use Case (Basic Flow 10, 11, 12, Exception Flow 10.1)
    function executeSaveScore(paper, scoreNum) {
        // Exception Flow 10.1: Không thể lưu điểm thi
        if (simulateSaveError) {
            setPageAlert('Hệ thống không thể lưu điểm thi do lỗi kết nối cơ sở dữ liệu. Điểm chưa được ghi nhận vào hệ thống. Dữ liệu điểm trước đó không bị thay đổi.', 'error');
            showToast('Không thể lưu điểm thi. Vui lòng thử lại!', 'error');
            return;
        }

        // Basic Flow 10: Lưu điểm thi và cập nhật trạng thái bài thi
        paper.diem = scoreNum;
        paper.trangThaiNhapDiem = 'DA_NHAP';
        paper.ghiChu = pendingScore?.note || paper.ghiChu;

        // Basic Flow 11: Ghi nhận người thực hiện và thời điểm nhập điểm
        paper.nguoiNhap = CURRENT_ACTOR.name;
        paper.thoiGianNhap = formatNow();

        const success = saveData();
        if (!success) {
            setPageAlert('Hệ thống không thể lưu điểm thi. Điểm chưa được ghi nhận. Dữ liệu điểm trước đó không bị thay đổi.', 'error');
            showToast('Lỗi lưu trữ dữ liệu!', 'error');
            return;
        }

        // Basic Flow 12: Thông báo nhập điểm thành công
        setPageAlert(`Nhập điểm thành công cho bài thi ${paper.maPhach} (${scoreNum.toFixed(2)} điểm). Người thực hiện: ${paper.nguoiNhap} lúc ${paper.thoiGianNhap}.`, 'success');
        showToast(`Đã lưu điểm ${scoreNum.toFixed(2)} cho bài thi ${paper.maPhach}!`, 'success');

        // Tìm bài thi tiếp theo chưa nhập điểm (Alternative Flow 12.1)
        const allInSubject = papers.filter(p => p.examId === currentExamId && p.subjectId === currentSubjectId);
        const nextPending = allInSubject.find(p => p.trangThaiNhapDiem === 'CHUA_NHAP' && p.trangThaiCham === 'HOAN_TAT');

        // Cập nhật lại giao diện
        updateStats();
        renderPaperTable();

        if (nextPending) {
            // Có nút/hướng dẫn chuyển sang bài tiếp theo (Alternative Flow 12.1)
            selectedPaperId = nextPending.id;
            renderPaperTable();
            renderInputPanel(nextPending);
            setPageAlert(`Nhập điểm thành công cho bài ${paper.maPhach}! Hệ thống đã tự động chuyển sang bài thi tiếp theo cần nhập: ${nextPending.maPhach}.`, 'success');
        } else {
            // Nếu đã nhập hết các bài thi hợp lệ
            renderInputPanel(paper);
            showToast('Chúc mừng! Đã hoàn thành nhập điểm cho tất cả bài thi hợp lệ của môn này.', 'success');
        }
    }

    // Thiết lập các công cụ kiểm thử mô phỏng (Simulation Test Controls)
    function initSimulationControls() {
        const btnTestBasic = $('btnSimulateBasic');
        const btnTestNoPapers = $('btnSimulateNoPapers');
        const btnTestInvalid = $('btnSimulateInvalid');
        const btnTestNotEligible = $('btnSimulateNotEligible');
        const btnTestSaveError = $('btnSimulateSaveError');
        const btnTestLocked = $('btnSimulateLocked');
        const btnResetData = $('btnResetData');

        // Ca 1: Basic Flow
        btnTestBasic?.addEventListener('click', () => {
            currentSubjectId = 'TOAN';
            $('subjectSelect').value = 'TOAN';
            const pending = papers.find(p => p.subjectId === 'TOAN' && p.trangThaiNhapDiem === 'CHUA_NHAP' && p.trangThaiCham === 'HOAN_TAT') || papers[0];
            render();
            if (pending) {
                selectPaper(pending.id);
                $('scoreInput').value = '8.75';
                setPageAlert('Đã tải kịch bản Basic Flow: Đã chọn bài thi ' + pending.maPhach + ' và điền sẵn điểm hợp lệ 8.75. Hãy bấm "Xác nhận nhập điểm".', 'warning');
            }
        });

        // Ca 4.1: Không có bài thi cần nhập điểm
        btnTestNoPapers?.addEventListener('click', () => {
            currentSubjectId = 'HOA';
            $('subjectSelect').value = 'HOA';
            selectedPaperId = null;
            setPageAlert('Kích hoạt Exception Flow 4.1: Môn Hóa học (Chuyên) không có bài thi cần nhập điểm.', 'warning');
            render();
        });

        // Ca 8.1: Điểm không hợp lệ
        btnTestInvalid?.addEventListener('click', () => {
            currentSubjectId = 'TOAN';
            $('subjectSelect').value = 'TOAN';
            const paper = papers.find(p => p.subjectId === 'TOAN' && p.trangThaiCham === 'HOAN_TAT') || papers[0];
            render();
            selectPaper(paper.id);
            $('scoreInput').value = '12.50';
            setPageAlert('Kích hoạt Exception Flow 8.1: Thử nhập điểm 12.50 (ngoài thang điểm 0-10). Hãy bấm "Xác nhận nhập điểm" để kiểm tra.', 'warning');
            handleValidateAndConfirm(paper);
        });

        // Ca 8.2: Bài thi chưa đủ điều kiện nhập điểm
        btnTestNotEligible?.addEventListener('click', () => {
            currentSubjectId = 'TOAN';
            $('subjectSelect').value = 'TOAN';
            const notEligiblePaper = papers.find(p => p.trangThaiCham !== 'HOAN_TAT');
            render();
            if (notEligiblePaper) {
                selectPaper(notEligiblePaper.id);
                setPageAlert('Kích hoạt Exception Flow 8.2: Bài thi ' + notEligiblePaper.maPhach + ' chưa hoàn tất chấm thi (vòng 2) nên bị chặn nhập điểm.', 'error');
            }
        });

        // Ca 10.1: Mô phỏng lỗi lưu hệ thống
        btnTestSaveError?.addEventListener('click', () => {
            simulateSaveError = !simulateSaveError;
            btnTestSaveError.classList.toggle('active-error', simulateSaveError);
            btnTestSaveError.textContent = simulateSaveError ? '⚠ Đang bật lỗi lưu (Ca 10.1)' : 'Mô phỏng lỗi lưu (Ca 10.1)';
            setPageAlert(simulateSaveError ? 'Đã BẬT mô phỏng lỗi lưu hệ thống (Exception 10.1). Khi bấm xác nhận lưu điểm, hệ thống sẽ báo lỗi không thể lưu.' : 'Đã tắt mô phỏng lỗi lưu.', simulateSaveError ? 'error' : 'success');
        });

        // Ca 10.2: Điểm bài thi đã được xác nhận chính thức
        btnTestLocked?.addEventListener('click', () => {
            currentSubjectId = 'TOAN';
            $('subjectSelect').value = 'TOAN';
            const lockedPaper = papers.find(p => p.trangThaiXacNhan === 'CHINH_THUC');
            render();
            if (lockedPaper) {
                selectPaper(lockedPaper.id);
                setPageAlert('Kích hoạt Exception Flow 10.2: Điểm bài thi ' + lockedPaper.maPhach + ' đã được xác nhận chính thức và khóa sổ, không thể thay đổi.', 'warning');
            }
        });

        // Khôi phục dữ liệu gốc
        btnResetData?.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu bài thi mẫu ban đầu không?')) {
                papers = JSON.parse(JSON.stringify(DEFAULT_PAPERS));
                simulateSaveError = false;
                if (btnTestSaveError) {
                    btnTestSaveError.classList.remove('active-error');
                    btnTestSaveError.textContent = 'Mô phỏng lỗi lưu (Ca 10.1)';
                }
                saveData();
                selectedPaperId = null;
                setPageAlert('Đã khôi phục toàn bộ dữ liệu bài thi mẫu thành công.', 'success');
                showToast('Dữ liệu mẫu đã được khôi phục!', 'success');
                render();
            }
        });

        // Tìm kiếm và lọc bảng bài thi
        $('searchInput')?.addEventListener('input', () => renderPaperTable());
        $('statusFilter')?.addEventListener('change', () => renderPaperTable());
    }

    // Render toàn trang
    function render() {
        updateStats();
        renderPaperTable();

        // Nếu đã có bài thi được chọn thì render panel nhập điểm
        const currentPaper = papers.find(p => p.id === selectedPaperId);
        renderInputPanel(currentPaper || null);
    }

    // Khởi tạo trang
    function init() {
        loadData();
        initSelectors();
        initSimulationControls();
        render();

        // Tự động chọn bài thi chưa nhập điểm đầu tiên nếu có
        const firstPending = papers.find(p => p.examId === currentExamId && p.subjectId === currentSubjectId && p.trangThaiNhapDiem === 'CHUA_NHAP' && p.trangThaiCham === 'HOAN_TAT');
        if (firstPending) {
            selectPaper(firstPending.id);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
