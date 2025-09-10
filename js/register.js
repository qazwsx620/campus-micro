/*************************************************
 * 注册页面脚本
 * 1. 表单验证
 * 2. 用户注册
 * 3. 密码强度检查
 *************************************************/

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
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

    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

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

    // 检查密码强度
    function checkPasswordStrength(password) {
        if (password.length < 6) {
            return { valid: false, message: '密码长度至少为6位' };
        }
        
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            return { valid: false, message: '密码必须包含字母和数字' };
        }
        
        return { valid: true, message: '密码强度良好' };
    }

    // 检查邮箱是否已存在
    function emailExists(email) {
        try {
            const users = JSON.parse(localStorage.getItem('campus-users') || '[]');
            return users.some(user => user.email === email);
        } catch (error) {
            return false;
        }
    }

    // 表单验证
    function validateForm() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showError('请填写所有必填字段');
            return false;
        }

        if (!common.validateEmail(email)) {
            showError('请输入有效的邮箱地址');
            return false;
        }

        if (emailExists(email)) {
            showError('该邮箱已被注册');
            return false;
        }

        const passwordCheck = checkPasswordStrength(password);
        if (!passwordCheck.valid) {
            showError(passwordCheck.message);
            return false;
        }

        if (password !== confirmPassword) {
            showError('两次输入的密码不一致');
            return false;
        }

        if (!termsCheckbox.checked) {
            showError('请同意服务条款');
            return false;
        }

        return true;
    }

    // 创建新用户
    function createUser(firstName, lastName, email, password) {
        try {
            const users = JSON.parse(localStorage.getItem('campus-users') || '[]');
            
            // 生成用户ID
            const userId = Date.now().toString();
            
            // 创建用户对象
            const newUser = {
                id: userId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password, // 注意：实际项目中应该加密密码
                registerTime: new Date().toISOString(),
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=random`
            };
            
            // 添加到用户数组
            users.push(newUser);
            
            // 保存到localStorage
            localStorage.setItem('campus-users', JSON.stringify(users));
            
            return newUser;
        } catch (error) {
            console.error('创建用户错误:', error);
            return null;
        }
    }

    // 表单提交处理
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideMessages();

        if (validateForm()) {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            const newUser = createUser(firstName, lastName, email, password);
            
            if (newUser) {
                showSuccess('注册成功！正在跳转到登录页面...');
                
                // 跳转到登录页面
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showError('注册过程中发生错误，请重试');
            }
        }
    });

    // 实时密码确认验证
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
            if (confirmPassword && password === confirmPassword) {
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        }
    });
});