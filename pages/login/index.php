<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Đăng nhập</title>

    <link rel="stylesheet" href="../../assets/css/style.css">
</head>

<body class="login-page">

<div class="login-wrapper">

    <div class="login-image">

        <a href="../../index.php" class="back-home">
            ← Trang chủ
        </a>

        <div class="login-intro">

            <div class="login-big-logo">
                <img src="../../assets/images/logo.png" alt="Logo tuyển sinh">
            </div>

            <h1>
                HỆ THỐNG QUẢN LÝ<br>
                TUYỂN SINH LỚP 10
            </h1>

            <p>
                Quản lý thông tin tuyển sinh, kỳ thi,
                điểm thi và kết quả xét tuyển.
            </p>

        </div>

    </div>


    <div class="login-form-area">

        <div class="login-form-box">

            <div class="login-title">
                <h2>Đăng nhập</h2>

                <p>
                    Vui lòng nhập thông tin tài khoản để tiếp tục.
                </p>
            </div>


            <form>

                <div class="input-group">
                    <label>Tên đăng nhập</label>

                    <input
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                    >
                </div>


                <div class="input-group">
                    <label>Mật khẩu</label>

                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                    >
                </div>


                <div class="login-options">

                    <label>
                        <input type="checkbox">
                        Ghi nhớ đăng nhập
                    </label>

                    <a href="#">Quên mật khẩu?</a>

                </div>


                <a href="../dashboard/index.php" class="login-submit">
                    Đăng nhập
                </a>

            </form>


            <div class="login-note">
                Hệ thống quản lý tuyển sinh lớp 10
            </div>

        </div>

    </div>

</div>

</body>
</html>