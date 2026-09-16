/**
 * Chức năng: Cấp số báo danh cho thí sinh (Use Case 3)
 * Tác nhân: Ban tuyển sinh Sở GD&ĐT (Cán bộ quản trị kỳ thi)
 *
 * Tuân thủ Use Case:
 * - Basic Flow (1-8): Quản lý cấp SBD theo quy tắc A-B-C, chọn phạm vi, xác nhận và lưu kết quả.
 * - Alternative Flow 3.1: Cấp SBD bổ sung cho thí sinh chưa có SBD, nối tiếp dải số cũ.
 * - Alternative Flow 7.1: Hủy/Thu hồi toàn bộ kết quả cấp SBD (Reset).
 * - Alternative Flow 7.2: Xuất danh sách SBD (Export & In ấn niêm yết).
 * - Exception Flow 2.1: Báo lỗi khi chưa kết thúc thời gian đăng ký nguyện vọng.
 * - Exception Flow 6.1: Dừng cấp SBD khi phát hiện dữ liệu thí sinh bị lỗi/thiếu thông tin.
 * - Exception Flow 2.2: Chặn cấp lại khi 100% thí sinh đã có SBD (Trạng thái Hoàn tất).
 */
(() => {
    'use strict';

    const storageKey = 'tuyensinh10.candidates.sbd';

    // Danh sách thí sinh mẫu đã được thẩm định hồ sơ tuyển sinh lớp 10
    const defaultCandidates = [
        { id: 'HS001', name: 'Nguyễn Minh Anh', dob: '15/03/2011', gender: 'Nữ', school: 'THCS Nguyễn Du', cluster: 'HĐT THPT Nguyễn Trãi', sbd: '100001', room: 'P.01', status: 'valid' },
        { id: 'HS002', name: 'Trần Quốc Bảo', dob: '20/07/2011', gender: 'Nam', school: 'THCS Lê Quý Đôn', cluster: 'HĐT THPT Nguyễn Trãi', sbd: '100002', room: 'P.01', status: 'valid' },
        { id: 'HS003', name: 'Lê Ngọc Hà', dob: '11/01/2011', gender: 'Nữ', school: 'THCS Trần Phú', cluster: 'HĐT THPT Nguyễn Trãi', sbd: '100003', room: 'P.01', status: 'valid' },
        { id: 'HS004', name: 'Phạm Gia Huy', dob: '05/09/2011', gender: 'Nam', school: 'THCS Ba Đình', cluster: 'HĐT THPT Nguyễn Trãi', sbd: '100004', room: 'P.01', status: 'valid' },
        { id: 'HS005', name: 'Võ Khánh Linh', dob: '18/12/2011', gender: 'Nữ', school: 'THCS Chu Văn An', cluster: 'HĐT THPT Lê Quý Đôn', sbd: '100005', room: 'P.02', status: 'valid' },
        { id: 'HS006', name: 'Đặng Tuấn Kiệt', dob: '22/04/2011', gender: 'Nam', school: 'THCS Võ Trường Toản', cluster: 'HĐT THPT Lê Quý Đôn', sbd: '100006', room: 'P.02', status: 'valid' },
        { id: 'HS007', name: 'Bùi Bảo Ngọc', dob: '30/08/2011', gender: 'Nữ', school: 'THCS Lương Thế Vinh', cluster: 'HĐT THPT Lê Quý Đôn', sbd: '100007', room: 'P.02', status: 'valid' },
        { id: 'HS008', name: 'Đỗ Hoàng Nam', dob: '14/02/2011', gender: 'Nam', school: 'THCS Nguyễn Tri Phương', cluster: 'HĐT THPT Nguyễn Trãi', sbd: '100008', room: 'P.02', status: 'valid' },
        { id: 'HS009', name: 'Trương Thảo Vy', dob: '09/06/2011', gender: 'Nữ', school: 'THCS Trương Công Định', cluster: 'HĐT THPT Lê Quý Đôn', sbd: '100009', room: 'P.03', status: 'valid' },
        { id: 'HS010', name: 'Ngô Đức Anh', dob: '27/10/2011', gender: 'Nam', school: 'THCS Hồng Bàng', cluster: 'HĐT THPT Nguyễn Trãi', sbd: '100010', room: 'P.03', status: 'valid' },
        { id: 'HS011', name: 'Phan Minh Châu', dob: '03/05/2011', gender: 'Nữ', school: 'THCS Đồng Khởi', cluster: 'HĐT THPT Lê Quý Đôn', sbd: '100011', room: 'P.03', status: 'valid' },
        { id: 'HS012', name: 'Vũ Hải Đăng', dob: '19/11/2011', gender: 'Nam', school: 'THCS Colette', cluster: 'HĐT THPT Chuyên Lê Hồng Phong', sbd: null, room: null, status: 'valid' },
        { id: 'HS013', name: 'Hoàng Yến Nhi', dob: '25/08/2011', gender: 'Nữ', school: 'THCS Trần Văn Ơn', cluster: 'HĐT THPT Chuyên Lê Hồng Phong', sbd: null, room: null, status: 'valid' },
        { id: 'HS014', name: 'Đoàn Quang Minh', dob: '08/04/2011', gender: 'Nam', school: 'THCS Nguyễn Gia Thiều', cluster: 'HĐT THPT Chuyên Lê Hồng Phong', sbd: null, room: null, status: 'valid' }
    ];

    let candidates = [];
    let isRegistrationClosed = true; // Trạng thái chốt hồ sơ (Tiền điều kiện)
    let simulateDataError = false;   // Trạng thái mô phỏng dữ liệu lỗi (Exception Flow 6.1)

    // DOM Helpers
    function $(id) { return document.getElementById(id); }
    function esc(str) {
        return String(str ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function loadCandidates() {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    candidates = parsed;
                    return;
                }
            }
        } catch (_) {}
        candidates = JSON.parse(JSON.stringify(defaultCandidates));
        saveCandidates();
    }

    function saveCandidates() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(candidates));
            return true;
        } catch (_) {
            return false;
        }
    }

    function showMessage(text, type = 'success') {
        const box = $('sbdPageAlert');
        box.hidden = false;
        box.className = 'wf-alert ' + type;
        box.textContent = text;
        box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function clearMessage() {
        const box = $('sbdPageAlert');
        box.hidden = true;
        box.textContent = '';
    }

    // Modal Helper
    function openModal(title, contentHtml, onConfirm, confirmText = 'Xác nhận', isDanger = false) {
        const dialog = $('sbdConfirmModal');
        $('sbdModalTitle').textContent = title;
        $('sbdModalBody').innerHTML = contentHtml;

        const confirmBtn = $('sbdModalConfirmBtn');
        const cancelBtn = $('sbdModalCancelBtn');

        confirmBtn.textContent = confirmText;
        confirmBtn.className = isDanger ? 'primary-button' : 'primary-button';
        if (isDanger) confirmBtn.style.background = '#dc2626';
        else confirmBtn.style.background = '#1769e0';

        const handleConfirm = () => {
            dialog.close();
            cleanup();
            if (onConfirm) onConfirm();
        };

        const handleCancel = () => {
            dialog.close();
            cleanup();
        };

        function cleanup() {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
        }

        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);

        dialog.showModal();
        confirmBtn.focus();
    }

    // Tách tên để sắp xếp theo chuẩn tiếng Việt (Tên trước, Họ đệm sau)
    function getSortableName(fullName) {
        const parts = fullName.trim().split(/\s+/);
        const firstName = parts.pop();
        const lastName = parts.join(' ');
        return `${firstName} ${lastName}`;
    }

    // Cập nhật thẻ thống kê
    function updateStats() {
        const total = candidates.length;
        const assigned = candidates.filter(c => c.sbd).length;
        const unassigned = total - assigned;

        $('statTotalValid').textContent = total;
        $('statAssigned').textContent = assigned;
        $('statUnassigned').textContent = unassigned;

        const clusters = new Set(candidates.map(c => c.cluster));
        $('statClusters').textContent = clusters.size;

        // Trạng thái ngoại lệ 2.2: Đã cấp đủ 100%
        const isAllAssigned = (unassigned === 0);
        const assignBtn = $('btnStartAssign');

        if (isAllAssigned) {
            $('assignStatusNotice').innerHTML = '<span class="pill green">✓ Toàn bộ thí sinh đã có Số báo danh (Hoàn tất)</span>';
            assignBtn.disabled = true;
            assignBtn.title = 'Tất cả thí sinh hợp lệ đã được cấp SBD. Để cấp lại, hãy dùng chức năng Hủy/Thu hồi.';
        } else {
            $('assignStatusNotice').innerHTML = `<span class="pill orange">Còn ${unassigned} thí sinh chưa có SBD</span>`;
            assignBtn.disabled = !isRegistrationClosed;
            assignBtn.title = '';
        }
    }

    // Render bảng danh sách thí sinh
    function renderCandidateTable() {
        const keyword = $('candidateSearchInput').value.trim().toLowerCase();
        const clusterFilter = $('filterClusterSelect').value;
        const statusFilter = $('filterStatusSelect').value;

        const filtered = candidates.filter(c => {
            if (keyword) {
                const matchName = c.name.toLowerCase().includes(keyword);
                const matchSbd = c.sbd && c.sbd.toLowerCase().includes(keyword);
                const matchSchool = c.school.toLowerCase().includes(keyword);
                const matchId = c.id.toLowerCase().includes(keyword);
                if (!matchName && !matchSbd && !matchSchool && !matchId) return false;
            }
            if (clusterFilter !== 'all' && c.cluster !== clusterFilter) return false;
            if (statusFilter === 'assigned' && !c.sbd) return false;
            if (statusFilter === 'unassigned' && c.sbd) return false;
            return true;
        });

        $('filteredCandidateCount').textContent = `Hiển thị ${filtered.length} / ${candidates.length} thí sinh`;

        const tbody = $('candidateTableBody');
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty">Không tìm thấy thí sinh phù hợp với điều kiện lọc.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map((c, idx) => {
            const hasSbd = Boolean(c.sbd);
            const isError = c.status === 'error';

            return `
                <tr class="${isError ? 'has-error' : ''}">
                    <td>${idx + 1}</td>
                    <td><strong>${esc(c.id)}</strong></td>
                    <td>
                        <strong>${esc(c.name)}</strong>
                        ${isError ? '<small style="color:#ef4444; display:block;">⚠️ Thiếu ngày sinh / sai khu vực</small>' : ''}
                    </td>
                    <td>${esc(c.dob || '—')}</td>
                    <td>${esc(c.gender)}</td>
                    <td>${esc(c.school)}</td>
                    <td><span class="pill">${esc(c.cluster)}</span></td>
                    <td>
                        ${hasSbd ? `<span class="sbd-badge">${esc(c.sbd)}</span>` : '<span class="sbd-badge unassigned">Chưa cấp</span>'}
                    </td>
                    <td>${c.room ? `<strong>${esc(c.room)}</strong>` : '<span class="muted">—</span>'}</td>
                </tr>
            `;
        }).join('');
    }

    // Thuật toán cấp SBD (Basic Flow & Alternative Flow 3.1)
    function executeAssignSbd(onlyUnassigned = false, selectedCluster = 'all') {
        // Exception Flow 6.1: Kiểm tra dữ liệu thí sinh bị lỗi
        if (simulateDataError) {
            const errorList = candidates.filter(c => c.status === 'error');
            openModal(
                'Lỗi dữ liệu thí sinh (Exception Flow 6.1)',
                `<div class="wf-alert error">
                    <strong>Phát hiện hồ sơ không hợp lệ:</strong> Quá trình cấp SBD bị tạm dừng do có thí sinh thiếu thông tin bắt buộc.
                 </div>
                 <p>Danh sách hồ sơ cần rà soát trước khi cấp SBD:</p>
                 <ul style="margin: 8px 0 0 18px; line-height: 1.6;">
                    ${errorList.map(e => `<li><strong>${e.id} - ${e.name}</strong>: Thiếu ngày sinh và thông tin khu vực thi.</li>`).join('')}
                 </ul>
                 <p class="hint" style="margin-top: 12px;">Vui lòng cập nhật hoàn tất hồ sơ trước khi thực hiện lại chức năng này.</p>`,
                null,
                'Đã hiểu',
                false
            );
            return;
        }

        // Lọc danh sách thí sinh trong phạm vi cấp
        let targetList = candidates.slice();
        if (selectedCluster !== 'all') {
            targetList = targetList.filter(c => c.cluster === selectedCluster);
        }

        if (onlyUnassigned) {
            targetList = targetList.filter(c => !c.sbd);
        }

        if (targetList.length === 0) {
            showMessage('Không có thí sinh nào cần cấp Số báo danh trong phạm vi đã chọn.', 'warning');
            return;
        }

        // Sắp xếp theo thứ tự bảng chữ cái A-B-C theo Tên tiếng Việt
        targetList.sort((a, b) => {
            const nameA = getSortableName(a.name);
            const nameB = getSortableName(b.name);
            return nameA.localeCompare(nameB, 'vi');
        });

        // Tìm số báo danh tiếp theo nếu cấp bổ sung
        let currentMaxSbd = 100000;
        candidates.forEach(c => {
            if (c.sbd && !isNaN(c.sbd)) {
                const num = parseInt(c.sbd, 10);
                if (num > currentMaxSbd) currentMaxSbd = num;
            }
        });

        let nextNumber = onlyUnassigned ? (currentMaxSbd + 1) : 100001;

        // Tiến hành gán SBD và phân phòng thi tương ứng
        let assignedCount = 0;
        targetList.forEach((item, index) => {
            const realIndex = candidates.findIndex(c => c.id === item.id);
            if (realIndex !== -1) {
                const sbdStr = String(nextNumber++).padStart(6, '0');
                const roomIndex = Math.floor(assignedCount / 24) + 1; // 24 thí sinh / phòng
                const roomStr = 'P.' + String(roomIndex).padStart(2, '0');

                candidates[realIndex].sbd = sbdStr;
                candidates[realIndex].room = roomStr;
                assignedCount++;
            }
        });

        saveCandidates();
        updateStats();
        renderCandidateTable();
        renderPrintArea();

        showMessage(`✓ Đã cấp Số báo danh thành công cho ${assignedCount} thí sinh theo quy tắc A-B-C!`, 'success');
    }

    // Khởi tạo các sự kiện giao diện
    function init() {
        const page = document.querySelector('[data-page="cap-so-bao-danh"]');
        if (!page) return;

        loadCandidates();
        updateStats();
        renderCandidateTable();
        renderPrintArea();

        // 1. Thao tác bắt đầu cấp SBD (Basic Flow 3, 4, 5)
        $('btnStartAssign').addEventListener('click', () => {
            // Exception Flow 2.1: Chưa kết thúc thời gian đăng ký
            if (!isRegistrationClosed) {
                openModal(
                    'Cảnh báo: Chưa kết thúc thời gian đăng ký (Exception Flow 2.1)',
                    `<div class="wf-alert warning">
                        <strong>Chưa kết thúc thời gian chốt hồ sơ!</strong><br>
                        Hệ thống đang mở tiếp nhận đăng ký / điều chỉnh nguyện vọng. Không thể thực hiện cấp Số báo danh lúc này để tránh sai lệch dữ liệu thí sinh.
                     </div>
                     <p>Thời gian chốt hồ sơ dự kiến: 17:00 ngày 20/05/2026. Vui lòng quay lại sau thời điểm này.</p>`,
                    null,
                    'Đóng',
                    false
                );
                return;
            }

            const scopeCluster = $('sbdScopeSelect').value;
            const onlyUnassigned = $('onlyUnassignedCheckbox').checked;

            let eligibleCount = candidates.filter(c => {
                if (scopeCluster !== 'all' && c.cluster !== scopeCluster) return false;
                if (onlyUnassigned && c.sbd) return false;
                return true;
            }).length;

            if (eligibleCount === 0) {
                showMessage('Toàn bộ thí sinh trong phạm vi đã chọn đã có Số báo danh.', 'warning');
                return;
            }

            const scopeText = scopeCluster === 'all' ? 'Toàn thành phố' : scopeCluster;
            const flowText = onlyUnassigned ? 'Cấp bổ sung cho thí sinh chưa có SBD' : 'Cấp SBD mới cho toàn bộ danh sách';

            openModal(
                'Xác nhận cấp Số báo danh',
                `<p>Bạn có chắc chắn muốn thực hiện cấp Số báo danh cho <strong>${eligibleCount} thí sinh</strong>?</p>
                 <ul class="summary-wish-list" style="margin: 12px 0;">
                    <li><span>Phạm vi:</span> <strong>${esc(scopeText)}</strong></li>
                    <li><span>Chế độ:</span> <strong>${esc(flowText)}</strong></li>
                    <li><span>Quy tắc đánh số:</span> <strong>Thứ tự bảng chữ cái (A-B-C), duy nhất</strong></li>
                 </ul>
                 <p class="hint">Quá trình này sẽ tự động liên kết SBD với phòng thi và lưu vào hệ thống cơ sở dữ liệu kỳ thi.</p>`,
                () => {
                    executeAssignSbd(onlyUnassigned, scopeCluster);
                },
                'Đồng ý cấp SBD',
                false
            );
        });

        // 2. Thao tác Hủy / Thu hồi SBD (Alternative Flow 7.1)
        $('btnResetSbd').addEventListener('click', () => {
            const assignedCount = candidates.filter(c => c.sbd).length;
            if (assignedCount === 0) {
                showMessage('Hiện tại chưa có thí sinh nào được cấp Số báo danh.', 'warning');
                return;
            }

            openModal(
                '⚠️ Xác nhận HỦY / THU HỒI toàn bộ Số báo danh',
                `<div class="wf-alert error">
                    <strong>HÀNH ĐỘNG NGUY HIỂM:</strong> Hành động này sẽ xóa toàn bộ ${assignedCount} Số báo danh đã tạo và đưa tất cả thí sinh về trạng thái <strong>"Chưa có SBD"</strong>.
                 </div>
                 <p>Bạn có chắc chắn muốn hủy kết quả cấp Số báo danh hiện tại không?</p>`,
                () => {
                    candidates.forEach(c => {
                        c.sbd = null;
                        c.room = null;
                    });
                    saveCandidates();
                    updateStats();
                    renderCandidateTable();
                    renderPrintArea();
                    showMessage('Đã hủy và thu hồi toàn bộ Số báo danh. Danh sách thí sinh đã trở về trạng thái chưa có SBD.', 'warning');
                },
                'Xác nhận Hủy toàn bộ',
                true
            );
        });

        // 3. Xuất danh sách SBD (Alternative Flow 7.2)
        $('btnExportSbd').addEventListener('click', () => {
            renderPrintArea();
            window.print();
        });

        // Tìm kiếm và bộ lọc bảng
        $('candidateSearchInput').addEventListener('input', renderCandidateTable);
        $('filterClusterSelect').addEventListener('change', renderCandidateTable);
        $('filterStatusSelect').addEventListener('change', renderCandidateTable);

        // Mô phỏng Exception Flow 2.1 (Chưa kết thúc thời gian đăng ký)
        $('toggleRegClosedBtn').addEventListener('click', () => {
            isRegistrationClosed = !isRegistrationClosed;
            const btn = $('toggleRegClosedBtn');
            const notice = $('regStatusBanner');

            if (!isRegistrationClosed) {
                btn.textContent = 'Mô phỏng: Chuyển sang "Đã chốt hồ sơ"';
                btn.style.background = '#fef2f2';
                btn.style.color = '#dc2626';
                notice.className = 'wf-alert warning';
                notice.innerHTML = '⚠️ <strong>Thời gian đăng ký nguyện vọng đang mở (Chưa chốt hồ sơ)</strong>. Chức năng cấp SBD bị tạm khóa theo quy chế tuyển sinh.';
                $('btnStartAssign').disabled = true;
            } else {
                btn.textContent = 'Mô phỏng: Thời gian đăng ký vẫn đang mở (Ca 2.1)';
                btn.style.background = '#ffffff';
                btn.style.color = '#1e293b';
                notice.className = 'wf-alert success';
                notice.innerHTML = '✓ <strong>Thời gian đăng ký đã kết thúc (Dữ liệu đã chốt)</strong>. Danh sách thí sinh đủ điều kiện đã sẵn sàng để cấp Số báo danh.';
                updateStats();
            }
        });

        // Mô phỏng Exception Flow 6.1 (Lỗi dữ liệu thí sinh)
        $('toggleDataErrorBtn').addEventListener('click', () => {
            simulateDataError = !simulateDataError;
            const btn = $('toggleDataErrorBtn');

            if (simulateDataError) {
                btn.textContent = 'Mô phỏng: Đã sửa hết lỗi dữ liệu';
                btn.style.background = '#fef2f2';
                btn.style.color = '#dc2626';
                // Đánh dấu 2 thí sinh bị lỗi
                candidates[12].status = 'error';
                candidates[12].dob = '';
                candidates[13].status = 'error';
                showMessage('Đang kích hoạt mô phỏng Ca 6.1: Có 2 thí sinh bị thiếu ngày sinh/sai khu vực. Hãy bấm "Bắt đầu cấp SBD" để kiểm tra hệ thống bắt lỗi.', 'warning');
            } else {
                btn.textContent = 'Mô phỏng: Dữ liệu thí sinh bị lỗi (Ca 6.1)';
                btn.style.background = '#ffffff';
                btn.style.color = '#1e293b';
                candidates[12].status = 'valid';
                candidates[12].dob = '25/08/2011';
                candidates[13].status = 'valid';
                candidates[13].dob = '08/04/2011';
                clearMessage();
            }
            renderCandidateTable();
        });
    }

    // Chuẩn bị khu vực in ấn danh sách SBD niêm yết (Alternative Flow 7.2)
    function renderPrintArea() {
        const area = $('sbdPrintArea');
        if (!area) return;

        const rows = candidates.map((c, i) => `
            <tr>
                <td style="border: 1px solid #000; padding: 6px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: center; font-family: monospace; font-weight: bold; font-size: 14px;">${esc(c.sbd || 'Chưa cấp')}</td>
                <td style="border: 1px solid #000; padding: 6px;"><strong>${esc(c.name)}</strong></td>
                <td style="border: 1px solid #000; padding: 6px; text-align: center;">${esc(c.dob)}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: center;">${esc(c.gender)}</td>
                <td style="border: 1px solid #000; padding: 6px;">${esc(c.school)}</td>
                <td style="border: 1px solid #000; padding: 6px;">${esc(c.cluster)}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: center;"><strong>${esc(c.room || '—')}</strong></td>
            </tr>
        `).join('');

        area.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="margin: 0;">SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH</h3>
                <h2 style="margin: 6px 0;">DANH SÁCH THÍ SINH DỰ THI VÀ SỐ BÁO DANH CHÍNH THỨC</h2>
                <p style="margin: 0; font-style: italic;">Kỳ thi tuyển sinh vào lớp 10 THPT - Năm học 2026 - 2027</p>
                <p style="margin: 4px 0 0; font-size: 13px;">Ngày in niêm yết: ${new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background: #e5e7eb;">
                        <th style="border: 1px solid #000; padding: 6px;">STT</th>
                        <th style="border: 1px solid #000; padding: 6px;">SỐ BÁO DANH</th>
                        <th style="border: 1px solid #000; padding: 6px;">HỌ VÀ TÊN THÍ SINH</th>
                        <th style="border: 1px solid #000; padding: 6px;">NGÀY SINH</th>
                        <th style="border: 1px solid #000; padding: 6px;">GIỚI TÍNH</th>
                        <th style="border: 1px solid #000; padding: 6px;">TRƯỜNG THCS</th>
                        <th style="border: 1px solid #000; padding: 6px;">HỘI ĐỒNG THI</th>
                        <th style="border: 1px solid #000; padding: 6px;">PHÒNG THI</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <div style="display: flex; justify-content: space-between; margin-top: 40px; text-align: center; font-size: 13px;">
                <div><p><strong>NGƯỜI LẬP BẢNG</strong></p><p style="margin-top: 50px;">(Ký và ghi rõ họ tên)</p></div>
                <div><p><strong>TRƯỞNG BAN THƯ KÝ HỘI ĐỒNG THI</strong></p><p style="margin-top: 50px;">(Ký và đóng dấu)</p></div>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
