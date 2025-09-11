/**
 * 动态调整固定导航栏位置的脚本（已简化）
 * 当前使用CSS固定定位，此脚本保留以备将来可能的动态调整需求
 */

document.addEventListener('DOMContentLoaded', function() {
  // 当前版本使用CSS固定定位，不需要JavaScript干预
  // 如需恢复动态定位，可取消注释以下代码并调整common.css中的相关样式
  
  /*
  // 获取头部和导航栏元素
  const header = document.querySelector('header.fixed-top');
  const nav = document.getElementById('mainNav') || document.querySelector('nav.fixed-top');
  
  if (header && nav) {
    // 确保导航栏有fixed定位
    nav.style.position = 'fixed';
    
    // 使用 ResizeObserver 监听头部尺寸变化
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const headerHeight = entry.contentRect.height;
        // 设置导航栏的顶部位置
        nav.style.top = headerHeight + 'px';
      }
    });
    
    // 开始观察头部元素
    resizeObserver.observe(header);
    
    // 初始设置
    const headerHeight = header.offsetHeight;
    nav.style.top = headerHeight + 'px';
  }
  */
});