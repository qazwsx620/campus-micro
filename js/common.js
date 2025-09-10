/*************************************************
 *  campus-micro 通用脚本
 *  1. 夜间模式切换
 *  2. 返回顶部
 *  3. 导航高亮
 *  4. 收藏/取消收藏
 *  5. 邮箱验证
 *  6. 用户认证
 *************************************************/

/* ---------- 1. 夜间模式 ---------- */
const nightBtn = document.getElementById('nightBtn');
const htmlEl = document.documentElement; // <html>，方便后面换 data-theme

// 页面加载就读取偏好
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    htmlEl.classList.add('dark');
    if (nightBtn) nightBtn.innerHTML = '<i class="bi bi-sun"></i> 日间';
  }
})();

// 按钮点击切换
if (nightBtn) {
  nightBtn.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    const isDark = htmlEl.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    nightBtn.innerHTML = isDark
      ? '<i class="bi bi-sun"></i> 日间'
      : '<i class="bi bi-moon-stars"></i> 夜间';
  });
}

/* ---------- 2. 返回顶部 ---------- */
const backTopBtn = document.getElementById('backTop');
if (backTopBtn) {
  // 监听滚动
  window.addEventListener('scroll', () => {
    backTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  // 平滑滚动到顶
  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- 3. 导航高亮 ---------- */
(function activeNav() {
  const links = document.querySelectorAll('.navbar-nav .nav-link');
  const cur = location.pathname.split('/').pop(); // 当前文件名
  links.forEach(a => {
    if (a.getAttribute('href') === cur) {
      a.classList.add('active');
    }
  });
})();

/* ---------- 4. 收藏/取消收藏 ---------- */
const FAV_KEY = 'campus-fav'; // 统一 key

// 读收藏数组
function getFav() {
  return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
}

// 是否已收藏
function isFav(id) {
  return getFav().includes(Number(id));
}

// 切换收藏状态（供 detail.html ♥ 按钮调用）
function toggleFav(id) {
  id = Number(id);
  const arr = getFav();
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id); else arr.splice(idx, 1);
  localStorage.setItem(FAV_KEY, JSON.stringify(arr));
  return arr.includes(id); // 返回最新状态，方便改 UI
}

/* ---------- 5. 邮箱验证 ---------- */
function validateEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

/* ---------- 6. 用户认证 ---------- */
// 获取当前登录用户
function getCurrentUser() {
  const userData = localStorage.getItem('campus-user');
  return userData ? JSON.parse(userData) : null;
}

// 检查是否已登录
function isLoggedIn() {
  return !!getCurrentUser();
}

// 登出
function logout() {
  localStorage.removeItem('campus-user');
  localStorage.removeItem('rememberedEmail');
  window.location.href = 'login.html';
}

// 更新导航栏用户状态
function updateNavUserStatus() {
  const user = getCurrentUser();
  const navContainer = document.querySelector('.navbar-nav');
  
  if (!navContainer) return;
  
  // 移除现有的用户相关元素
  const existingUserEl = navContainer.querySelector('.user-nav-item');
  if (existingUserEl) {
    existingUserEl.remove();
  }
  
  if (user) {
    // 已登录状态
    const userHtml = `
      <li class="nav-item dropdown user-nav-item">
        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
          <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.firstName + ' ' + user.lastName) + '&background=random'}" 
               alt="用户头像" class="rounded-circle me-1" width="24" height="24">
          ${user.firstName}
        </a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#" onclick="logout()">
            <i class="bi bi-box-arrow-right"></i> 登出
          </a></li>
        </ul>
      </li>
    `;
    navContainer.insertAdjacentHTML('beforeend', userHtml);
  } else {
    // 未登录状态
    const loginHtml = `
      <li class="nav-item user-nav-item">
        <a class="nav-link" href="login.html">
          <i class="bi bi-person-circle"></i> 登录
        </a>
      </li>
    `;
    navContainer.insertAdjacentHTML('beforeend', loginHtml);
  }
}

// 页面加载时更新用户状态
document.addEventListener('DOMContentLoaded', function() {
  updateNavUserStatus();
});

/* 导出给别的页面用（ES6 模块化暂不需要，直接全局） */
window.common = {
  getFav,
  isFav,
  toggleFav,
  validateEmail,
  getCurrentUser,
  isLoggedIn,
  logout
};