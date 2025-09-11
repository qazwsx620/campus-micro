/*************************************************
 *  详情页：读取 URL 参数 → 换图+文字 → 收藏♥
 *************************************************/

// 8 套数据（与 list.js 对应，可再扩展字段）
const spots = {
  1: {name: '校门',    img: 'gate',     desc: '学校正门，新生打卡第一站，近距离感受“亚洲第一门”。', loc: '校园北侧', time: '全天', rate: '0.0', tel: '0571-12345678'},
  2: {name: '图书馆',  img: 'library',  desc: '藏书百万，自习圣地。',       loc: '中轴线上', time: '7:00-22:00', rate: '0.0', tel: '0571-23456789'},
  3: {name: '食堂',    img: 'canteen',  desc: '网红菜品，性价比之王。',     loc: '校园西北方', time: '6:30-21:30', rate: '0.0', tel: '0571-34567890'},
  4: {name: '宿舍',    img: 'dormitory',desc: '温馨小家，空调独卫。',       loc: '东北侧生活区', time: '全天', rate: '0.0', tel: '0571-45678901'},
  5: {name: '操场',    img: 'playground', desc: '400 米标准跑道，灯光球场，肆意挥洒汗水。', loc: '西南侧', time: '6:00-22:00', rate: '0.0', tel: '0571-56789012'},
  6: {name: '实验楼',  img: 'lab',      desc: '设备先进，科研重地。',       loc: '东南侧，紧挨校史馆', time: '8:00-21:00', rate: '0.0', tel: '0571-67890123'},
  7: {name: '校史馆',  img: 'art',     desc: '一步百年，感受世事变迁。', loc: '东南侧，紧挨实验楼', time: '9:00-21:00', rate: '0.0', tel: '0571-78901234'},
  8: {name: '小吃街',  img: 'shop',     desc: '日用百货，小吃零食饮料一站式。', loc: '中轴线上，图书馆正后方', time: '7:00-23:30', rate: '0.0', tel: '0571-89012345'}
};

// 读 URL 参数
const id = Number(new URLSearchParams(location.search).get('id')) || 1;
const data = spots[id] || spots[1];

// 换内容
document.getElementById('spotTitle').textContent = data.name;
document.getElementById('spotName').textContent = data.name;
document.getElementById('spotDesc').textContent = data.desc;
document.getElementById('spotImg').src = `assets/images/${data.img}.jpg`;
document.getElementById('spotLoc').textContent = data.loc;
document.getElementById('spotTime').textContent = data.time;
document.getElementById('spotRate').textContent = data.rate;
document.getElementById('spotTel').textContent = data.tel;

// 收藏按钮
const favBtn = document.getElementById('favBtn');

// 检查用户是否已登录
function checkLogin() {
  return common.isLoggedIn();
}

function syncHeart() {
  const loved = common.isFav(id);
  favBtn.classList.toggle('loved', loved);
  favBtn.innerHTML = loved
    ? '<i class="bi bi-heart-fill"></i> 已收藏'
    : '<i class="bi bi-heart"></i> 收藏';
}

syncHeart();

favBtn.onclick = () => {
  // 检查用户是否已登录
  if (!checkLogin()) {
    // 用户未登录，跳转到登录页面
    window.location.href = 'login.html';
    return;
  }
  
  // 用户已登录，执行收藏操作
  common.toggleFav(id);
  syncHeart();
};

// 返回顶部（common.js 已加载，直接监听）
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});