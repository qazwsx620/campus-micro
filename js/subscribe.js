const subForm = document.getElementById('subForm');
const emailInput = document.getElementById('emailInput');
const successIcon = document.getElementById('successIcon');
const subscribedInfo = document.getElementById('subscribedInfo');

// 读取已订阅邮箱
(function loadEmail() {
  const saved = localStorage.getItem('campus-email');
  if (saved) {
    emailInput.value = saved;
    subscribedInfo.classList.remove('d-none');
  }
})();

// 提交
subForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!common.validateEmail(email)) {
    emailInput.classList.add('is-invalid');
    return;
  }
  emailInput.classList.remove('is-invalid');

  // 保存
  localStorage.setItem('campus-email', email);
  subscribedInfo.classList.remove('d-none');

  // 成功动画
  successIcon.classList.add('show');
  setTimeout(() => successIcon.classList.remove('show'), 1500);
});