/**
 * 调试和微调固定定位元素的脚本
 */

document.addEventListener('DOMContentLoaded', function() {
  // 获取头部和导航栏元素
  const header = document.querySelector('header.fixed-top');
  const nav = document.querySelector('nav.fixed-top');
  
  if (header && nav) {
    // 输出头部和导航栏的高度信息用于调试
    console.log('Header height:', header.offsetHeight);
    console.log('Nav height:', nav.offsetHeight);
    
    // 获取body元素
    const body = document.querySelector('body.with-fixed-header');
    
    // 如果需要微调，可以在这里添加代码
    // 例如，根据实际高度调整导航栏位置
    const headerHeight = header.offsetHeight;
    nav.style.top = headerHeight + 'px';
    
    // 调整body的padding-top
    if (body) {
      const totalHeight = headerHeight + nav.offsetHeight + 10; // 添加一些间隙
      body.style.paddingTop = totalHeight + 'px';
    }
  }
});