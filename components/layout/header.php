<?php
$scriptPath = str_replace('\\', '/', $_SERVER['SCRIPT_NAME']);
$pagesPosition = strpos($scriptPath, '/pages/');
$appBase = $pagesPosition !== false ? substr($scriptPath, 0, $pagesPosition) : rtrim(dirname($scriptPath), '/');
if (!isset($activePage)) $activePage = '';
if (!isset($displayName)) $displayName = 'Quản trị viên';
if (!isset($displayRole)) $displayRole = 'Ban Tuyển sinh';
?>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Quản lý tuyển sinh lớp 10</title>

    <link rel="stylesheet"
          href="<?php echo htmlspecialchars($appBase); ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/admissions.css">
</head>

<body>

<div class="app">

    <?php include dirname(__FILE__) . '/sidebar.php'; ?>
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <main class="main">

        <header class="topbar">

            <div class="topbar-left">
                <button class="menu-button" aria-label="Mở menu" aria-expanded="false" aria-controls="appSidebar">☰</button>

                <div>
                    <h3>Hệ thống tuyển sinh lớp 10</h3>
                    <p>Năm học 2026 - 2027</p>
                </div>
            </div>

            <div class="topbar-right">

                <button class="notification">
                    ♢
                </button>

                <div class="user">
                    <div class="avatar"><?php echo mb_substr($displayName, 0, 1, 'UTF-8'); ?></div>

                    <div class="user-info">
                        <strong><?php echo htmlspecialchars($displayName); ?></strong>
                        <span><?php echo htmlspecialchars($displayRole); ?></span>
                    </div>

                    <span class="arrow">⌄</span>
                </div>

            </div>

        </header>
