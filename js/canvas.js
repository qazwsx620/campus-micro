/*************************************************
 *  完整校园平面图：外环+十字干道 + 8建筑 + 点击跳转
 *************************************************/
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('map');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Canvas context not available');
    return;
  }

  // 响应式尺寸
  function resizeCanvas() {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    canvas.width = wrap.offsetWidth;
    canvas.height = Math.min(500, canvas.width * 0.6);
    draw();
  }
  
  window.addEventListener('resize', resizeCanvas);
  
  // 确保在DOM加载完成后绘制
  setTimeout(() => {
    resizeCanvas();
  }, 0);

  // 建筑数据（相对坐标 0-1，方便缩放）
  const spots = [
    {id: 1, name: '校门',     x: 0.46, y: 0.05, w: 0.08, h: 0.12},
    {id: 2, name: '图书馆',   x: 0.46, y: 0.22, w: 0.12, h: 0.15},
    {id: 3, name: '食堂',     x: 0.25, y: 0.22, w: 0.12, h: 0.15},
    {id: 4, name: '宿舍',     x: 0.68, y: 0.22, w: 0.12, h: 0.15},
    {id: 5, name: '操场',     x: 0.25, y: 0.55, w: 0.20, h: 0.25},
    {id: 6, name: '实验楼',   x: 0.55, y: 0.55, w: 0.12, h: 0.15},
    {id: 7, name: '校史馆',   x: 0.72, y: 0.55, w: 0.12, h: 0.15},
    {id: 8, name: '小吃街',   x: 0.46, y: 0.75, w: 0.08, h: 0.12}
  ];

  // 点击检测
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.width;
    const y = (e.clientY - rect.top) / canvas.height;
    spots.forEach(b => {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        window.location.href = `detail.html?id=${b.id}`;
      }
    });
  });

  // 绘制函数
  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 1. 草坪背景
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, '#e8f5e9');
    gradient.addColorStop(1, '#c8e6c9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // 2. 外环主干道（灰色双车道）
    drawRoad(0.05, 0.05, 0.90, 0.06, '#757575');  // 上横
    drawRoad(0.05, 0.89, 0.90, 0.06, '#757575');  // 下横
    drawRoad(0.05, 0.05, 0.06, 0.84, '#757575');  // 左竖
    drawRoad(0.89, 0.05, 0.06, 0.84, '#757575');  // 右竖

    // 3. 十字干道
    drawRoad(0.46, 0.11, 0.08, 0.70, '#616161');  // 纵向中轴
    drawRoad(0.11, 0.46, 0.78, 0.08, '#616161');  // 横向中轴

    // 4. 装饰性元素
    // 中心花园
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.46, Math.min(W, H) * 0.05, 0, Math.PI * 2);
    const gardenGradient = ctx.createRadialGradient(W * 0.5, H * 0.46, 0, W * 0.5, H * 0.46, Math.min(W, H) * 0.05);
    gardenGradient.addColorStop(0, '#81c784');
    gardenGradient.addColorStop(1, '#4caf50');
    ctx.fillStyle = gardenGradient;
    ctx.fill();
    
    // 花园装饰
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.46, Math.min(W, H) * 0.02, 0, Math.PI * 2);
    ctx.fillStyle = '#ffeb3b';
    ctx.fill();

    // 5. 建筑
    spots.forEach(b => {
      const x = b.x * W;
      const y = b.y * H;
      const w = b.w * W;
      const h = b.h * H;

      // 建筑主体
      const buildingGradient = ctx.createLinearGradient(x, y, x, y + h);
      buildingGradient.addColorStop(0, '#1976d2');
      buildingGradient.addColorStop(1, '#0d47a1');
      ctx.fillStyle = buildingGradient;
      roundRect(ctx, x, y, w, h, 10);
      ctx.fill();
      
      // 建筑顶部装饰
      ctx.fillStyle = '#e53935';
      roundRect(ctx, x - 2, y, w + 4, 8, 3);
      ctx.fill();

      // 编号小圆
      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 12, 0, Math.PI * 2);
      const numberGradient = ctx.createRadialGradient(x + 15, y + 15, 0, x + 15, y + 15, 12);
      numberGradient.addColorStop(0, '#ff4081');
      numberGradient.addColorStop(1, '#d81b60');
      ctx.fillStyle = numberGradient;
      ctx.fill();
      
      // 编号文字阴影
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.id, x + 16, y + 20);
      
      // 编号文字
      ctx.fillStyle = '#fff';
      ctx.fillText(b.id, x + 15, y + 19);

      // 名称背景
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      roundRect(ctx, x, y + h - 25, w, 25, 5);
      ctx.fill();
      
      // 名称
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.max(12, W * 0.015)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(b.name, x + w / 2, y + h - 10);
    });
    
    // 6. 添加标题
    ctx.fillStyle = 'rgba(13, 71, 161, 0.8)';
    ctx.font = `bold ${Math.max(18, W * 0.022)}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('校园平面图', 20, 30);
    
    // 7. 添加方向标 (罗盘)
    drawCompass(W - 50, 50, 30);
  }

  // 道路绘制工具（相对坐标）
  function drawRoad(rx, ry, rw, rh, color) {
    const x = rx * canvas.width;
    const y = ry * canvas.height;
    const w = rw * canvas.width;
    const h = rh * canvas.height;
    
    ctx.fillStyle = color;
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill();
    
    // 道路装饰线
    if (w > h) { // 横向道路
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.moveTo(x + 10, y + h/2);
      ctx.lineTo(x + w - 10, y + h/2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (h > w) { // 纵向道路
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.moveTo(x + w/2, y + 10);
      ctx.lineTo(x + w/2, y + h - 10);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  
  // 绘制方向标 (罗盘)
  function drawCompass(x, y, radius) {
    // 罗盘外圆
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#1976d2';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 罗盘内圆
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    ctx.strokeStyle = '#1976d2';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 方向指示
    ctx.fillStyle = '#1976d2';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 北
    ctx.fillText('北', x, y - radius * 0.5);
    // 南
    ctx.fillText('南', x, y + radius * 0.5);
    // 东
    ctx.fillText('东', x + radius * 0.5, y);
    // 西
    ctx.fillText('西', x - radius * 0.5, y);
    
    // 指针 (指向北)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - radius * 0.6);
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 指针箭头
    ctx.beginPath();
    ctx.moveTo(x, y - radius * 0.6);
    ctx.lineTo(x - 3, y - radius * 0.5);
    ctx.lineTo(x + 3, y - radius * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#e53935';
    ctx.fill();
  }

  // 圆角矩形
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
});