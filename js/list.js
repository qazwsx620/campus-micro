/*************************************************
 *  列表页：渲染 8 个地标 + 实时搜索 + 关键词高亮
 *************************************************/

// 8 条数据（后续可改对象，保持字段一致）
const spots = [
  {id: 1, name: '校门',    img: 'gate',     desc: '学校正门，新生打卡第一站，近距离感受“亚洲第一门”。'},
  {id: 2, name: '图书馆',  img: 'library',  desc: '藏书百万，自习圣地。'},
  {id: 3, name: '食堂',    img: 'canteen',  desc: '网红菜品，性价比之王。'},
  {id: 4, name: '宿舍',    img: 'dormitory', desc: '温馨小家，空调独卫，上床下桌。'},
  {id: 5, name: '操场',    img: 'playground', desc: '400米标准跑道，夜晚灯光球场，肆意挥洒汗水。'},
  {id: 6, name: '实验楼',  img: 'lab',      desc: '设备先进，科研重地。'},
  {id: 7, name: '校史馆',  img: 'art',     desc: '一步百年，感受世事变迁。'},
  {id: 8, name: '小吃街',  img: 'shop',     desc: '日用百货，小吃零食饮料一站式。'}
];

const searchInput = document.getElementById('searchInput');
const grid = document.getElementById('cardGrid');
const noResult = document.getElementById('noResult');

// 初始渲染
renderCards(spots);

// 监听输入
searchInput.addEventListener('input', () => {
  const key = searchInput.value.trim().toLowerCase();
  const filtered = spots.filter(item =>
    item.name.toLowerCase().includes(key) ||
    item.desc.toLowerCase().includes(key)
  );
  renderCards(filtered, key);
});

// 渲染函数
function renderCards(data, keyword = '') {
  if (data.length === 0) {
    grid.innerHTML = '';
    noResult.classList.remove('d-none');
    return;
  }
  noResult.classList.add('d-none');
  grid.innerHTML = data.map(item => `
    <div class="col-lg-3 col-md-4 col-6">
      <div class="card h-100 shadow-sm">
        <div style="position:relative;">
          <img src="assets/images/${item.img}.jpg" class="card-img-top" alt="${item.name}">
          <span class="card-badge">${item.id}</span>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${highlight(item.name, keyword)}</h5>
          <p class="card-text flex-grow-1">${highlight(item.desc, keyword)}</p>
          <a href="detail.html?id=${item.id}" class="btn btn-primary btn-sm mt-auto">查看详情</a>
        </div>
      </div>
    </div>
  `).join('');
}

// 关键词高亮
function highlight(text, keyword) {
  if (!keyword) return text;
  const reg = new RegExp(`(${keyword})`, 'gi');
  return text.replace(reg, '<mark>$1</mark>');
}