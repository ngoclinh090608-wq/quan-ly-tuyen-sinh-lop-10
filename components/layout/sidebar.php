<aside class="sidebar" id="appSidebar">
    <button class="mobile-close" aria-label="Đóng menu">✕</button>
    <div class="sidebar-logo">
        <div class="logo-icon">10</div>
        <div>
            <h2>TUYỂN SINH</h2>
            <span>Quản lý tuyển sinh lớp 10</span>
        </div>
    </div>

    <nav class="sidebar-menu">
        <a href="<?php echo htmlspecialchars($appBase); ?>/" class="menu-item">
            <span class="menu-icon">⌂</span>
            <span>Trang chủ</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/dashboard/index.php" class="menu-item <?php echo $activePage === 'dashboard' ? 'active' : ''; ?>">
            <span class="menu-icon">📊</span>
            <span>Bảng điều khiển</span>
        </a>

        <div class="menu-title">TUYỂN SINH</div>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoc-sinh/xem-thong-tin-tuyen-sinh.php" class="menu-item <?php echo $activePage === 'admission-info' ? 'active' : ''; ?>">
            <span class="menu-icon">▣</span>
            <span>Thông tin tuyển sinh</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoc-sinh/quan-ly-nguyen-vong-xet-tuyen-lop-10.php" class="menu-item <?php echo $activePage === 'wishes' ? 'active' : ''; ?>">
            <span class="menu-icon">✓</span>
            <span>Nguyện vọng xét tuyển</span>
        </a>

        <a href="#" class="menu-item">
            <span class="menu-icon">▤</span>
            <span>Hồ sơ thí sinh</span>
        </a>

        <div class="menu-title">KỲ THI</div>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/so-gd/cap-so-bao-danh.php" class="menu-item <?php echo $activePage === 'candidate-sbd' ? 'active' : ''; ?>">
            <span class="menu-icon">🪪</span>
            <span>Cấp số báo danh</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoi-dong-ra-de/xem-phan-cong-ra-de.php" class="menu-item <?php echo $activePage === 'question-assignment' ? 'active' : ''; ?>">
            <span class="menu-icon">📜</span>
            <span>Phân công ra đề</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/so-gd/tao-thong-tin-phong-thi.php" class="menu-item <?php echo $activePage === 'exam-rooms' ? 'active' : ''; ?>">
            <span class="menu-icon">□</span>
            <span>Phòng thi</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/so-gd/phan-phong-thi.php" class="menu-item <?php echo $activePage === 'assign-rooms' ? 'active' : ''; ?>">
            <span class="menu-icon">◎</span>
            <span>Phân phòng thi</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoi-dong-cham-thi/nhap-diem-thi.php" class="menu-item <?php echo $activePage === 'nhap-diem-thi' ? 'active' : ''; ?>">
            <span class="menu-icon">✎</span>
            <span>Nhập điểm thi</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoi-dong-phuc-khao/quan-ly-ket-qua-phuc-khao.php" class="menu-item <?php echo $activePage === 'review' ? 'active' : ''; ?>">
            <span class="menu-icon">↻</span>
            <span>Kết quả phúc khảo</span>
        </a>
        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoc-sinh/gui-yeu-cau-phuc-khao.php" class="menu-item <?php echo $activePage === 'request' ? 'active' : ''; ?>">
            <span class="menu-icon">✉</span><span>Gửi yêu cầu phúc khảo</span>
        </a>

        <div class="menu-title">KẾT QUẢ</div>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoi-dong-tuyen-sinh/xet-tuyen.php" class="menu-item <?php echo $activePage === 'admission' ? 'active' : ''; ?>">
            <span class="menu-icon">☆</span>
            <span>Xét tuyển NV1, NV2, NV3</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoc-sinh/tra-cuu-ket-qua-xet-tuyen.php" class="menu-item <?php echo $activePage === 'admission-result' ? 'active' : ''; ?>">
            <span class="menu-icon">▥</span>
            <span>Tra cứu kết quả xét tuyển</span>
        </a>
    </nav>
</aside>
