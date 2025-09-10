/*************************************************
 * 登录页面脚本
 * 1. 表单验证
 * 2. 用户认证
 * 3. 记住我功能
 *************************************************/

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberMe = document.getElementById('rememberMe');
    const errorAlert = document.getElementById('errorAlert');
    const errorMsg = document.getElementById('errorMsg');
    const successAlert = document.getElementById('successAlert');
    const successMsg = document.getElementById('successMsg');

    // 密码可见性切换
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

    // 记住我功能
    function loadRememberedUser() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberMe.checked = true;
        }
    }

    // 显示错误消息
    function showError(message) {
        errorMsg.textContent = message;
        errorAlert.classList.remove('d-none');
        successAlert.classList.add('d-none');
    }

    // 显示成功消息
    function showSuccess(message) {
        successMsg.textContent = message;
        successAlert.classList.remove('d-none');
        errorAlert.classList.add('d-none');
    }

    // 隐藏所有消息
    function hideMessages() {
        errorAlert.classList.add('d-none');
        successAlert.classList.add('d-none');
    }

    // 表单验证
    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showError('请填写所有必填字段');
            return false;
        }

        if (!common.validateEmail(email)) {
            showError('请输入有效的邮箱地址');
            return false;
        }

        if (password.length < 6) {
            showError('密码长度至少为6位');
            return false;
        }

        return true;
    }

    // 用户登录
    function loginUser(email, password) {
        try {
            // 获取用户数据
            const users = JSON.parse(localStorage.getItem('campus-users') || '[]');
            
            // 查找用户
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // 登录成功
                const loginData = {
                    userId: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    loginTime: new Date().toISOString()
                };
                
                // 保存登录状态
                localStorage.setItem('campus-user', JSON.stringify(loginData));
                
                // 处理记住我
                if (rememberMe.checked) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                showSuccess('登录成功！正在跳转...');
                
                // 跳转到首页
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
                return true;
            } else {
                showError('邮箱或密码错误');
                return false;
            }
        } catch (error) {
            console.error('登录错误:', error);
            showError('登录过程中发生错误，请重试');
            return false;
        }
    }

    // 表单提交处理
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideMessages();

        if (validateForm()) {
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            loginUser(email, password);
        }
    });

    // 页面加载时检查是否已登录
    function checkLoginStatus() {
        const currentUser = localStorage.getItem('campus-user');
        if (currentUser) {
            // 已登录，跳转到首页
            window.location.href = 'index.html';
        }
    }

    // 初始化
    loadRememberedUser();
    checkLoginStatus();
});