/**
 * ==========================================================================
 * JavaScript: Xem phân công ra đề thi (Use Case 8 - Hội đồng ra đề thi)
 * Hệ thống Quản lý tuyển sinh lớp 10
 *
 * Đáp ứng đầy đủ đặc tả nghiệp vụ:
 * - Tiền điều kiện: Hội đồng ra đề thi đã đăng nhập thành công và được phân quyền xem.
 *   Kỳ thi và thông tin phân công ra đề đã tồn tại trong hệ thống.
 * - Hậu điều kiện: Hội đồng ra đề thi xem được thông tin phân công ra đề thuộc phạm vi.
 *   Dữ liệu phân công không bị thay đổi (read-only).
 * - Basic Flow (1-9):
 *   1. Chọn chức năng xem phân công ra đề thi.
 *   2. Hiển thị danh sách các kỳ thi có phân công ra đề thuộc phạm vi của Hội đồng.
 *   3. Chọn kỳ thi cần xem phân công.
 *   4. Kiểm tra quyền truy cập và thông tin phân công tương ứng.
 *   5. Hiển thị danh sách các môn thi được phân công ra đề.
 *   6. Chọn môn thi cần xem chi tiết.
 *   7. Hiển thị thông tin phân công gồm kỳ thi, môn thi, thời gian thực hiện & nhiệm vụ.
 *   8. Xem thông tin phân công ra đề thi.
 *   9. Kết thúc Use Case.
 * - Alternative Flow:
 *   + 6.1: Hội đồng ra đề thi chọn môn thi khác.
 *   + 8.1: Hội đồng ra đề thi quay lại danh sách phân công (các môn thi).
 * - Exception Flow:
 *   + 2.1: Không có phân công ra đề thi -> Báo chưa có phân công -> Kết thúc.
 *   + 4.1: Không có quyền xem thông tin phân công -> Báo không đủ quyền -> Kết thúc.
 *   + 7.1: Không thể tải thông tin phân công -> Báo không thể lấy thông tin -> Quay lại bước 6.
 * ==========================================================================
 */

(() => {
    'use strict';

    // Thông tin người dùng đăng nhập (Actor: Hội đồng ra đề thi)
    const CURRENT_ACTOR = {
        name: 'ThS. Lê Hoàng Nam',
        role: 'Hội đồng ra đề thi • Ban đề thi Tuyển sinh lớp 10',
        department: 'Hội đồng ra đề thi Sở GD&ĐT',
        permission: 'PERMISSION_VIEW_QUESTION_ASSIGNMENT'
    };

    // Danh mục Kỳ thi thuộc phạm vi Hội đồng (Basic Flow 2)
    const EXAMS_DATA = [
        {
            id: 'KT2026',
            name: 'Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2026 - 2027',
            status: 'active',
            year: '2026 - 2027',
            hasPermission: true,
            hasAssignments: true
        },
        {
            id: 'KT2025',
            name: 'Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2025 - 2026 (Đã hoàn thành)',
            status: 'archived',
            year: '2025 - 2026',
            hasPermission: true,
            hasAssignments: true
        },
        {
            id: 'KT_BLOCKED',
            name: 'Kỳ thi chọn HSG Lớp 9 cấp Thành phố 2026 (Không có quyền truy cập)',
            status: 'restricted',
            year: '2026',
            hasPermission: false, // Dùng để test Ca 4.1
            hasAssignments: true
        },
        {
            id: 'KT_EMPTY',
            name: 'Kỳ thi tuyển sinh lớp 10 bổ sung đợt 2 (Chưa phân công)',
            status: 'pending',
            year: '2026',
            hasPermission: true,
            hasAssignments: false // Dùng để test Ca 2.1
        }
    ];

    // Dữ liệu phân công ra đề thi theo từng môn (Basic Flow 5 & 7)
    const ASSIGNMENTS_DATA = {
        'KT2026': [
            {
                id: 'M01',
                subjectCode: 'TOAN',
                subjectName: 'Toán học',
                examDuration: '120 phút',
                format: 'Tự luận (100%)',
                targetSchool: 'Tuyển sinh THPT công lập đại trà',
                startDate: '20/05/2026 08:00',
                endDate: '04/06/2026 17:00',
                examDate: '06/06/2026 (Buổi sáng)',
                isolationArea: 'Khu cách ly Vòng 1 - Tầng 3, Nhà khách Sở GD&ĐT (Tuyệt đối bí mật)',
                securityLevel: 'Tối Mật (Theo danh mục bí mật Nhà nước độ Tối Mật)',
                status: 'in_progress',
                headOfTeam: 'ThS. Lê Hoàng Nam (Chuyên viên Toán Sở GD&ĐT)',
                reviewer: 'TS. Nguyễn Văn Hùng (Đại học Sư phạm TP.HCM)',
                members: [
                    { name: 'ThS. Lê Hoàng Nam', role: 'Tổ trưởng tổ ra đề', school: 'Sở GD&ĐT TP.HCM' },
                    { name: 'TS. Nguyễn Văn Hùng', role: 'Cán bộ phản biện đề thi', school: 'ĐH Sư phạm TP.HCM' },
                    { name: 'Thầy Trần Đình Trọng', role: 'Giáo viên biên soạn', school: 'THPT Chuyên Lê Hồng Phong' },
                    { name: 'Cô Phạm Thị Minh Tuyết', role: 'Giáo viên biên soạn', school: 'THPT Nguyễn Thượng Hiền' }
                ],
                requirements: [
                    'Nội dung đề thi nằm trong chương trình THCS hiện hành, chủ yếu ở lớp 9.',
                    'Đảm bảo 4 cấp độ nhận thức: Nhận biết (30%), Thông hiểu (30%), Vận dụng (30%), Vận dụng cao (10%).',
                    'Đề thi phải có câu hỏi gắn với giải quyết tình huống thực tiễn.',
                    'Gồm 01 đề chính thức và 01 đề dự bị kèm hướng dẫn chấm và đáp án chi tiết.'
                ]
            },
            {
                id: 'M02',
                subjectCode: 'VAN',
                subjectName: 'Ngữ văn',
                examDuration: '120 phút',
                format: 'Tự luận (Đọc hiểu & Làm văn)',
                targetSchool: 'Tuyển sinh THPT công lập đại trà',
                startDate: '20/05/2026 08:00',
                endDate: '04/06/2026 17:00',
                examDate: '06/06/2026 (Buổi chiều)',
                isolationArea: 'Khu cách ly Vòng 1 - Tầng 2, Nhà khách Sở GD&ĐT',
                securityLevel: 'Tối Mật',
                status: 'in_progress',
                headOfTeam: 'TS. Phan Thị Thùy Dung (Sở GD&ĐT)',
                reviewer: 'PGS.TS. Trần Mạnh Cường (ĐH Khoa học Xã hội & Nhân văn)',
                members: [
                    { name: 'TS. Phan Thị Thùy Dung', role: 'Tổ trưởng tổ ra đề', school: 'Sở GD&ĐT TP.HCM' },
                    { name: 'PGS.TS. Trần Mạnh Cường', role: 'Cán bộ phản biện đề thi', school: 'ĐH KHXH&NV TP.HCM' },
                    { name: 'Cô Đỗ Thùy Trang', role: 'Giáo viên biên soạn', school: 'THPT Chuyên Trần Đại Nghĩa' },
                    { name: 'Thầy Nguyễn Quang Hải', role: 'Giáo viên biên soạn', school: 'THPT Gia Định' }
                ],
                requirements: [
                    'Ngữ liệu đọc hiểu mới, không trùng lắp ngữ liệu trong sách giáo khoa.',
                    'Câu hỏi nghị luận xã hội mang tính gợi mở, bồi dưỡng lý tưởng sống cao đẹp.',
                    'Có thang điểm cụ thể và đáp án mở khuyến khích tính sáng tạo của học sinh.'
                ]
            },
            {
                id: 'M03',
                subjectCode: 'ANH',
                subjectName: 'Tiếng Anh (Ngoại ngữ 1)',
                examDuration: '90 phút',
                format: 'Trắc nghiệm kết hợp Tự luận',
                targetSchool: 'Tuyển sinh THPT công lập đại trà',
                startDate: '20/05/2026 08:00',
                endDate: '04/06/2026 17:00',
                examDate: '07/06/2026 (Buổi sáng)',
                isolationArea: 'Khu cách ly Vòng 1 - Tầng 2, Nhà khách Sở GD&ĐT',
                securityLevel: 'Tối Mật',
                status: 'in_progress',
                headOfTeam: 'ThS. Nguyễn Thị Bích Ngọc (Sở GD&ĐT)',
                reviewer: 'TS. Anthony Miller (Chuyên gia ĐH Sư phạm)',
                members: [
                    { name: 'ThS. Nguyễn Thị Bích Ngọc', role: 'Tổ trưởng tổ ra đề', school: 'Sở GD&ĐT TP.HCM' },
                    { name: 'TS. Anthony Miller', role: 'Chuyên gia phản biện', school: 'ĐH Sư phạm TP.HCM' },
                    { name: 'Cô Vũ Phương Linh', role: 'Giáo viên biên soạn', school: 'THPT Lê Quý Đôn' },
                    { name: 'Thầy Lê Quốc Hưng', role: 'Giáo viên biên soạn', school: 'THPT Bùi Thị Xuân' }
                ],
                requirements: [
                    'Cấu trúc đề gồm 40 câu: Ngữ âm, Từ vựng - Ngữ pháp, Điền từ, Đọc hiểu và Viết lại câu.',
                    'Độ chuẩn hóa cao, kiểm tra toàn diện năng lực giao tiếp và tư duy ngôn ngữ.',
                    'Bàn giao đầy đủ file audio chuẩn đối với phần kỹ năng nghe (nếu có).'
                ]
            },
            {
                id: 'M04',
                subjectCode: 'HOA_CHUYEN',
                subjectName: 'Hóa học (Môn Chuyên)',
                examDuration: '150 phút',
                format: 'Tự luận (Môn Chuyên)',
                targetSchool: 'Lớp 10 Chuyên THPT Chuyên Lê Hồng Phong & Trần Đại Nghĩa',
                startDate: '20/05/2026 08:00',
                endDate: '04/06/2026 17:00',
                examDate: '07/06/2026 (Buổi chiều)',
                isolationArea: 'Khu cách ly Vòng 1 - Tầng 4, Nhà khách Sở GD&ĐT',
                securityLevel: 'Tối Mật',
                status: 'in_progress',
                headOfTeam: 'TS. Hoàng Minh Trí (ĐH Khoa học Tự nhiên)',
                reviewer: 'TS. Đặng Thanh Tâm (Sở GD&ĐT TP.HCM)',
                members: [
                    { name: 'TS. Hoàng Minh Trí', role: 'Tổ trưởng tổ ra đề', school: 'ĐH Khoa học Tự nhiên TP.HCM' },
                    { name: 'TS. Đặng Thanh Tâm', role: 'Cán bộ phản biện đề thi', school: 'Sở GD&ĐT TP.HCM' },
                    { name: 'Thầy Lương Thế Kiệt', role: 'Giáo viên biên soạn', school: 'THPT Chuyên Lê Hồng Phong' }
                ],
                requirements: [
                    'Nội dung chuyên sâu, phân hóa năng khiếu môn Hóa học vượt trội.',
                    'Tăng cường các bài toán thí nghiệm và thực nghiệm hóa học hiện đại.'
                ]
            }
        ],
        'KT2025': [
            {
                id: 'M01_2025',
                subjectCode: 'TOAN_25',
                subjectName: 'Toán học (2025 - 2026)',
                examDuration: '120 phút',
                format: 'Tự luận',
                targetSchool: 'Tuyển sinh THPT công lập đại trà',
                startDate: '22/05/2025',
                endDate: '05/06/2025',
                examDate: '06/06/2025',
                isolationArea: 'Nhà khách Công đoàn Giáo dục',
                securityLevel: 'Tối Mật (Đã giải mật sau thi)',
                status: 'completed',
                headOfTeam: 'ThS. Lê Hoàng Nam',
                reviewer: 'TS. Nguyễn Văn Hùng',
                members: [
                    { name: 'ThS. Lê Hoàng Nam', role: 'Tổ trưởng tổ ra đề', school: 'Sở GD&ĐT TP.HCM' },
                    { name: 'TS. Nguyễn Văn Hùng', role: 'Cán bộ phản biện đề thi', school: 'ĐH Sư phạm TP.HCM' }
                ],
                requirements: ['Nhiệm vụ ra đề thi năm học 2025 - 2026 đã hoàn tất và lưu trữ hồ sơ.']
            }
        ]
    };

    // State ứng dụng
    let currentExamId = 'KT2026';
    let currentSubjectId = 'M01';
    let simulateLoadError = false; // Ca 7.1: Giả lập lỗi tải dữ liệu
    let currentStep = 8; // Đang ở bước xem chi tiết

    // DOM Utilities
    const $ = id => document.getElementById(id);
    const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    // Toast thông báo trượt
    function showToast(text, type = 'success') {
        const existing = document.querySelector('.assignment-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `wf-alert ${type} assignment-toast`;
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.zIndex = '1100';
        toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        toast.style.maxWidth = '420px';
        toast.style.animation = 'toastSlideUp 0.3s ease';
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

    // Banner cảnh báo đầu trang
    function setPageAlert(text, type = 'error') {
        const alertBox = $('assignmentPageAlert');
        if (!alertBox) return;

        if (!text) {
            alertBox.hidden = true;
            alertBox.textContent = '';
            return;
        }

        alertBox.hidden = false;
        alertBox.className = `wf-alert ${type}`;
        alertBox.innerHTML = `<strong>${type === 'success' ? '✓ Thông báo:' : type === 'warning' ? '⚠ Chú ý:' : '✖ Cảnh báo / Lỗi:'}</strong> ${esc(text)}`;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Khởi tạo bộ chọn Kỳ thi (Basic Flow 2 & 3)
    function initExamSelector() {
        const select = $('examSelect');
        if (!select) return;

        select.innerHTML = EXAMS_DATA.map(e => `
            <option value="${esc(e.id)}" ${e.id === currentExamId ? 'selected' : ''}>
                ${esc(e.name)}
            </option>
        `).join('');

        select.addEventListener('change', () => {
            handleSelectExam(select.value);
        });
    }

    // Xử lý chọn Kỳ thi (Basic Flow 3, 4 & Exception 2.1, 4.1)
    function handleSelectExam(examId) {
        setPageAlert('');
        currentExamId = examId;
        const exam = EXAMS_DATA.find(e => e.id === examId);
        if (!exam) return;

        // 4. Kiểm tra quyền truy cập tương ứng (Exception Flow 4.1)
        if (!exam.hasPermission) {
            setPageAlert(`Không có quyền xem thông tin phân công (Ca ngoại lệ 4.1): Hệ thống xác định Hội đồng ra đề thi không có quyền xem thông tin phân công của kỳ thi "${exam.name}". Hệ thống từ chối cung cấp dữ liệu. Use Case kết thúc.`, 'error');
            showToast('Lỗi: Bạn không có quyền xem kỳ thi này!', 'error');
            $('subjectsSection').hidden = true;
            $('assignmentDetailSection').hidden = true;
            updateStats(0);
            return;
        }

        // Kiểm tra có dữ liệu phân công không (Exception Flow 2.1)
        if (!exam.hasAssignments || !ASSIGNMENTS_DATA[examId] || ASSIGNMENTS_DATA[examId].length === 0) {
            setPageAlert(`Chưa có phân công ra đề thi (Ca ngoại lệ 2.1): Hệ thống xác định Hội đồng ra đề thi chưa có thông tin phân công ra đề nào tại kỳ thi "${exam.name}". Không có dữ liệu bị thay đổi. Use Case kết thúc.`, 'warning');
            showToast('Chưa có thông tin phân công!', 'warning');
            $('subjectsSection').hidden = true;
            $('assignmentDetailSection').hidden = true;
            updateStats(0);
            return;
        }

        // Basic Flow 5: Hiển thị danh sách các môn thi được phân công
        const subjects = ASSIGNMENTS_DATA[examId];
        $('subjectsSection').hidden = false;
        currentSubjectId = subjects[0].id; // Mặc định môn đầu
        updateStats(subjects.length);
        renderSubjectsGrid(subjects);

        // Basic Flow 6, 7, 8: Hiển thị chi tiết môn đầu tiên
        handleSelectSubject(currentSubjectId);
    }

    // Cập nhật Thẻ Thống Kê
    function updateStats(subjectCount) {
        const exam = EXAMS_DATA.find(e => e.id === currentExamId);
        if ($('statSubjectCount')) $('statSubjectCount').textContent = `${subjectCount} môn thi`;
        if ($('statExamYear')) $('statExamYear').textContent = exam ? exam.year : '2026 - 2027';
        if ($('statSecurityLevel')) $('statSecurityLevel').textContent = 'Tối Mật (Vòng 1)';
        if ($('statAssignmentStatus')) $('statAssignmentStatus').textContent = 'Đã ban hành quyết định';
    }

    // Render lưới các môn thi được phân công (Basic Flow 5)
    function renderSubjectsGrid(subjects) {
        const grid = $('subjectsGrid');
        if (!grid) return;

        grid.innerHTML = subjects.map(s => {
            const isSelected = s.id === currentSubjectId;
            return `
                <div class="subject-card ${isSelected ? 'active' : ''}" data-subject-id="${esc(s.id)}">
                    <div class="subject-card-header">
                        <div>
                            <h4 class="subject-card-title">${esc(s.subjectName)}</h4>
                            <span class="subject-card-code">${esc(s.subjectCode)}</span>
                        </div>
                        <span class="pill ${s.status === 'completed' ? 'green' : 'blue'}">
                            ${s.status === 'completed' ? '✓ Đã hoàn thành' : '⚡ Đang thực hiện'}
                        </span>
                    </div>
                    <div class="subject-card-meta">
                        <div>⏱ <span>Thời gian làm bài: <strong>${esc(s.examDuration)}</strong> (${esc(s.format)})</span></div>
                        <div>📅 <span>Ngày thi chính thức: <strong>${esc(s.examDate)}</strong></span></div>
                        <div>👤 <span>Tổ trưởng: <strong>${esc(s.headOfTeam)}</strong></span></div>
                    </div>
                    <div class="subject-card-footer">
                        <span style="font-size: 11px; color: #64748b;">${s.members ? s.members.length : 0} thành viên tổ ra đề</span>
                        <span>Xem chi tiết nhiệm vụ ➔</span>
                    </div>
                </div>
            `;
        }).join('');

        // Bắt sự kiện chọn môn thi (Basic Flow 6 & Alternative Flow 6.1)
        grid.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', () => {
                const subId = card.getAttribute('data-subject-id');
                handleSelectSubject(subId);
            });
        });
    }

    // Xử lý chọn Môn thi cần xem chi tiết (Basic Flow 6, 7, 8 & Alternative Flow 6.1 & Exception 7.1)
    function handleSelectSubject(subjectId) {
        setPageAlert('');

        // Exception Flow 7.1: Không thể tải thông tin phân công
        if (simulateLoadError) {
            setPageAlert('Không thể tải thông tin phân công (Ca ngoại lệ 7.1): Hệ thống không thể cung cấp thông tin phân công ra đề của môn thi đã chọn tại thời điểm hiện tại do gián đoạn kết nối bảo mật. Dữ liệu phân công không bị thay đổi. Quay lại bước 6.', 'error');
            showToast('Lỗi: Không thể tải dữ liệu phân công môn thi!', 'error');
            return;
        }

        currentSubjectId = subjectId;

        // Cập nhật giao diện active card
        document.querySelectorAll('.subject-card').forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-subject-id') === subjectId);
        });

        const subjects = ASSIGNMENTS_DATA[currentExamId] || [];
        const subject = subjects.find(s => s.id === subjectId);
        if (!subject) return;

        // Basic Flow 7 & 8: Hiển thị thông tin phân công chi tiết
        renderAssignmentDetail(subject);
        $('assignmentDetailSection').hidden = false;

        // Thông báo nếu là Alternative Flow 6.1
        showToast(`Đã chuyển sang xem phân công môn ${subject.subjectName}`, 'success');
    }

    // Render Khung Chi tiết phân công (Basic Flow 7 & 8)
    function renderAssignmentDetail(s) {
        const exam = EXAMS_DATA.find(e => e.id === currentExamId);
        const container = $('assignmentDetailContent');
        if (!container) return;

        container.innerHTML = `
            <div class="assignment-detail-card">
                <div class="assignment-detail-header">
                    <div>
                        <div style="font-size: 11px; text-transform: uppercase; color: #1769e0; font-weight: 700;">
                            NHIỆM VỤ RA ĐỀ THI • MÔN ${esc(s.subjectName).toUpperCase()}
                        </div>
                        <h3>
                            <span>📘</span> Môn thi: ${esc(s.subjectName)} (${esc(s.subjectCode)})
                            <span class="pill blue">${esc(s.targetSchool)}</span>
                        </h3>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button type="button" id="btnBackToSubjectList" class="secondary-button" style="padding: 8px 14px; font-size: 12px;" title="Quay lại danh sách các môn thi (Ca 8.1)">
                            ← Quay lại danh sách môn (Ca 8.1)
                        </button>
                        <button type="button" id="btnPrintAssignmentDoc" class="primary-button" style="padding: 8px 16px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
                            <span>🖨</span> In biên bản phân công ra đề
                        </button>
                    </div>
                </div>

                <div class="assignment-detail-body">
                    <!-- Thông tin tổng quan nhiệm vụ -->
                    <div class="detail-section-grid">
                        <div class="detail-box">
                            <h4><span>📋</span> Thông tin kỳ thi &amp; Môn thi phân công (Bước 7)</h4>
                            <table class="detail-info-table">
                                <tbody>
                                    <tr>
                                        <td class="label">Kỳ thi:</td>
                                        <td class="value"><strong>${esc(exam ? exam.name : '')}</strong></td>
                                    </tr>
                                    <tr>
                                        <td class="label">Môn thi:</td>
                                        <td class="value"><strong>${esc(s.subjectName)} (${esc(s.subjectCode)})</strong></td>
                                    </tr>
                                    <tr>
                                        <td class="label">Thời gian làm bài:</td>
                                        <td class="value">${esc(s.examDuration)}</td>
                                    </tr>
                                    <tr>
                                        <td class="label">Hình thức thi:</td>
                                        <td class="value">${esc(s.format)}</td>
                                    </tr>
                                    <tr>
                                        <td class="label">Đối tượng tuyển sinh:</td>
                                        <td class="value">${esc(s.targetSchool)}</td>
                                    </tr>
                                    <tr>
                                        <td class="label">Ngày thi chính thức:</td>
                                        <td class="value"><strong style="color:#1769e0;">${esc(s.examDate)}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="detail-box" style="border-left: 3px solid #159465;">
                            <h4><span>🔒</span> Thời gian thực hiện &amp; Khu vực cách ly</h4>
                            <table class="detail-info-table">
                                <tbody>
                                    <tr>
                                        <td class="label">Bắt đầu cách ly:</td>
                                        <td class="value"><strong>${esc(s.startDate)}</strong></td>
                                    </tr>
                                    <tr>
                                        <td class="label">Kết thúc cách ly:</td>
                                        <td class="value"><strong>${esc(s.endDate)}</strong> (Sau khi thi xong)</td>
                                    </tr>
                                    <tr>
                                        <td class="label">Khu vực làm việc:</td>
                                        <td class="value"><strong>${esc(s.isolationArea)}</strong></td>
                                    </tr>
                                    <tr>
                                        <td class="label">Độ mật tài liệu:</td>
                                        <td class="value"><span class="pill" style="background:#fee2e2; color:#dc2626; font-weight:bold;">${esc(s.securityLevel)}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="label">Cán bộ phản biện:</td>
                                        <td class="value">${esc(s.reviewer)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Danh sách thành viên tổ ra đề thi -->
                    <div class="detail-box" style="margin-bottom: 20px;">
                        <h4><span>👥</span> Danh sách nhân sự tổ ra đề thi môn ${esc(s.subjectName)}</h4>
                        <table class="team-table">
                            <thead>
                                <tr>
                                    <th style="width: 50px; text-align: center;">STT</th>
                                    <th>Họ và tên cán bộ</th>
                                    <th>Nhiệm vụ phân công</th>
                                    <th>Đơn vị công tác</th>
                                    <th style="width: 130px; text-align: center;">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(s.members || []).map((m, idx) => `
                                    <tr>
                                        <td style="text-align: center; color: #64748b;">${idx + 1}</td>
                                        <td><strong>${esc(m.name)}</strong></td>
                                        <td><span class="pill blue">${esc(m.role)}</span></td>
                                        <td>${esc(m.school)}</td>
                                        <td style="text-align: center;"><span class="pill green">✓ Đã tiếp nhận</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Yêu cầu chuyên môn và quy chuẩn đề thi -->
                    <div class="detail-box">
                        <h4><span>⚖</span> Yêu cầu chuyên môn &amp; Quy định bảo mật ra đề</h4>
                        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.7;">
                            ${(s.requirements || []).map(r => `<li>${esc(r)}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Cảnh báo bảo mật Nhà nước -->
                    <div class="security-alert-box">
                        <strong>🛡 CẢNH BÁO BẢO MẬT &amp; CAM KẾT TRÁCH NHIỆM:</strong><br>
                        Tất cả các thành viên Hội đồng ra đề thi chịu trách nhiệm cá nhân trước Giám đốc Sở GD&ĐT và trước pháp luật về tính chính xác, bảo mật của đề thi và hướng dẫn chấm. Mọi hành vi làm lộ, lọt bí mật đề thi sẽ bị xử lý nghiêm minh theo quy định pháp luật.
                    </div>
                </div>
            </div>
        `;

        // Bắt sự kiện quay lại danh sách môn (Alternative Flow 8.1)
        $('btnBackToSubjectList')?.addEventListener('click', () => {
            handleBackToSubjects();
        });

        // Bắt sự kiện in biên bản phân công ra đề
        $('btnPrintAssignmentDoc')?.addEventListener('click', () => {
            openPrintAssignmentModal(s);
        });
    }

    // Alternative Flow 8.1: Quay lại danh sách các môn thi được phân công
    function handleBackToSubjects() {
        setPageAlert('Hội đồng ra đề thi đã quay lại danh sách các môn thi được phân công (Ca thay thế 8.1). Quay lại bước 6.', 'warning');
        showToast('Đã quay lại danh sách môn thi!', 'warning');
        $('subjectsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Mở Modal In biên bản phân công ra đề
    function openPrintAssignmentModal(s) {
        const exam = EXAMS_DATA.find(e => e.id === currentExamId);
        const modal = $('printAssignmentModal');
        const container = $('printAssignmentContent');
        if (!modal || !container || !s) return;

        container.innerHTML = `
            <div style="padding: 10px; line-height: 1.5; font-size: 13px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; text-align: center; margin-bottom: 20px;">
                    <div>
                        <strong>ỦY BAN NHÂN DÂN TP. HỒ CHÍ MINH</strong><br>
                        <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO</strong><br>
                        <span>Số: 1024/QĐ-SGDĐT</span>
                    </div>
                    <div>
                        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
                        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
                        <em>TP. Hồ Chí Minh, ngày 15 tháng 05 năm 2026</em>
                    </div>
                </div>

                <div style="text-align: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 16px; text-transform: uppercase;">QUYẾT ĐỊNH &amp; BIÊN BẢN PHÂN CÔNG RA ĐỀ THI</h3>
                    <div style="font-style: italic;">(Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2026 - 2027)</div>
                </div>

                <p><strong>Môn thi phân công:</strong> ${esc(s.subjectName)} (${esc(s.subjectCode)})</p>
                <p><strong>Thời gian thực hiện cách ly:</strong> Từ ${esc(s.startDate)} đến ${esc(s.endDate)}</p>
                <p><strong>Địa điểm làm việc:</strong> ${esc(s.isolationArea)}</p>

                <div style="font-weight: bold; margin-top: 14px; margin-bottom: 6px;">DANH SÁCH CÁN BỘ THAM GIA TỔ RA ĐỀ:</div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
                    <thead>
                        <tr style="background: #f1f5f9;">
                            <th style="border: 1px solid #333; padding: 6px;">STT</th>
                            <th style="border: 1px solid #333; padding: 6px;">Họ và tên</th>
                            <th style="border: 1px solid #333; padding: 6px;">Nhiệm vụ</th>
                            <th style="border: 1px solid #333; padding: 6px;">Đơn vị công tác</th>
                            <th style="border: 1px solid #333; padding: 6px;">Chữ ký nhận</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(s.members || []).map((m, idx) => `
                            <tr>
                                <td style="border: 1px solid #333; padding: 6px; text-align: center;">${idx + 1}</td>
                                <td style="border: 1px solid #333; padding: 6px;"><strong>${esc(m.name)}</strong></td>
                                <td style="border: 1px solid #333; padding: 6px;">${esc(m.role)}</td>
                                <td style="border: 1px solid #333; padding: 6px;">${esc(m.school)}</td>
                                <td style="border: 1px solid #333; padding: 6px;"></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="display: grid; grid-template-columns: 1fr 1fr; text-align: center; margin-top: 30px;">
                    <div>
                        <strong>TỔ TRƯỞNG TỔ RA ĐỀ THI</strong><br>
                        <em>(Ký và ghi rõ họ tên)</em><br><br><br><br>
                        <strong>${esc(s.headOfTeam)}</strong>
                    </div>
                    <div>
                        <strong>GIÁM ĐỐC SỞ GD&amp;ĐT TP. HỒ CHÍ MINH</strong><br>
                        <em>(Ký tên, đóng dấu)</em><br><br><br><br>
                        <strong>Nguyễn Văn Hiếu</strong>
                    </div>
                </div>
            </div>
        `;

        modal.showModal();
    }

    // Cài đặt thanh kiểm thử kịch bản (Simulation Controls)
    function initSimulationControls() {
        // Ca 1: Basic Flow (1-9)
        $('btnSimulateBasic')?.addEventListener('click', () => {
            currentExamId = 'KT2026';
            if ($('examSelect')) $('examSelect').value = 'KT2026';
            simulateLoadError = false;
            const btn = $('btnSimulateLoadError');
            if (btn) btn.classList.remove('active-error');
            handleSelectExam('KT2026');
            setPageAlert('Đã tải kịch bản Basic Flow (1-9): Đã hiển thị phân công ra đề thi Kỳ thi tuyển sinh lớp 10 năm học 2026 - 2027.', 'success');
        });

        // Ca 6.1: Chọn môn thi khác
        $('btnSimulateAltSubject')?.addEventListener('click', () => {
            // Chuyển sang môn Ngữ văn hoặc Tiếng Anh
            const targetId = currentSubjectId === 'M01' ? 'M02' : 'M01';
            handleSelectSubject(targetId);
            setPageAlert(`Kích hoạt Alternative Flow 6.1: Hội đồng ra đề thi đã chọn môn thi khác (${targetId === 'M02' ? 'Ngữ văn' : 'Toán học'}). Hệ thống kiểm tra và hiển thị phân công tương ứng. Quay lại bước 8.`, 'warning');
        });

        // Ca 8.1: Quay lại danh sách phân công
        $('btnSimulateBackList')?.addEventListener('click', () => {
            handleBackToSubjects();
        });

        // Ca 2.1: Không có phân công ra đề thi
        $('btnSimulateNoAssignments')?.addEventListener('click', () => {
            currentExamId = 'KT_EMPTY';
            if ($('examSelect')) $('examSelect').value = 'KT_EMPTY';
            handleSelectExam('KT_EMPTY');
        });

        // Ca 4.1: Không có quyền xem thông tin phân công
        $('btnSimulateNoPermission')?.addEventListener('click', () => {
            currentExamId = 'KT_BLOCKED';
            if ($('examSelect')) $('examSelect').value = 'KT_BLOCKED';
            handleSelectExam('KT_BLOCKED');
        });

        // Ca 7.1: Không thể tải thông tin phân công
        $('btnSimulateLoadError')?.addEventListener('click', () => {
            simulateLoadError = !simulateLoadError;
            const btn = $('btnSimulateLoadError');
            if (btn) {
                btn.classList.toggle('active-error', simulateLoadError);
                btn.textContent = simulateLoadError ? '⚠ Đang bật lỗi tải (Ca 7.1)' : '⚠️ Ca 7.1: Lỗi tải phân công';
            }
            if (simulateLoadError) {
                setPageAlert('Đã BẬT giả lập lỗi tải dữ liệu phân công (Ca 7.1). Khi bạn click chọn môn thi bất kỳ, hệ thống sẽ báo lỗi và giữ nguyên dữ liệu.', 'error');
            } else {
                setPageAlert('Đã tắt giả lập lỗi tải dữ liệu phân công.', 'success');
            }
        });

        // Nút khôi phục dữ liệu mặc định
        $('btnResetData')?.addEventListener('click', () => {
            currentExamId = 'KT2026';
            if ($('examSelect')) $('examSelect').value = 'KT2026';
            simulateLoadError = false;
            const btn = $('btnSimulateLoadError');
            if (btn) {
                btn.classList.remove('active-error');
                btn.textContent = '⚠️ Ca 7.1: Lỗi tải phân công';
            }
            handleSelectExam('KT2026');
            setPageAlert('Đã khôi phục dữ liệu ban đầu cho Use Case 8.', 'success');
            showToast('Dữ liệu mặc định đã sẵn sàng!', 'success');
        });
    }

    // Khởi tạo trang
    function init() {
        initExamSelector();
        initSimulationControls();
        handleSelectExam(currentExamId);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
