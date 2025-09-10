// 全数据（与 list.js 相同，方便复用）
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

const favGrid = document.getElementById('favGrid');
const favCount = document.getElementById('favCount');
const clearBtn = document.getElementById('clearBtn');
const emptyTip = document.getElementById('emptyTip');

// 初始渲染
renderFav();

// 一键清空
clearBtn.addEventListener('click', () => {
  if (confirm('确定清空所有收藏？')) {
    localStorage.removeItem('campus-fav');
    renderFav();
  }
});

function renderFav() {
  const arr = common.getFav(); // 来自 common.js
  favCount.textContent = arr.length;
  if (arr.length === 0) {
    favGrid.innerHTML = '';
    emptyTip.classList.remove('d-none');
    clearBtn.disabled = true;
    return;
  }
  emptyTip.classList.add('d-none');
  clearBtn.disabled = false;

  // 按收藏顺序渲染
  favGrid.innerHTML = arr.map(id => {
    const item = spots.find(s => s.id === id) || {};
    return `
      <div class="col-lg-3 col-md-4 col-6">
        <div class="card h-100 shadow-sm">
          <img src="assets/images/${item.img}.jpg" class="card-img-top" alt="${item.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text flex-grow-1">${item.desc}</p>
            <div class="d-flex justify-content-between">
              <a href="detail.html?id=${item.id}" class="btn btn-primary btn-sm">查看</a>
              <button class="btn btn-outline-danger btn-sm"
                onclick="removeFav(${item.id})">
                <i class="bi bi-heartbreak"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// 单点取消
function removeFav(id) {
  common.toggleFav(id); // 再点一次 = 删除
  renderFav();          // 重新渲染
}