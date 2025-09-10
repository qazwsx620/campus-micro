/*************************************************
 * 评分系统脚本
 * 1. 星级评分组件
 * 2. 评分统计展示
 * 3. 用户评分功能
 * 4. 评论系统
 *************************************************/

document.addEventListener('DOMContentLoaded', function() {
    const spotId = Number(new URLSearchParams(location.search).get('id')) || 1;
    const user = common.getCurrentUser();
    
    // 初始化评分数据
    function initRatingData() {
        const ratings = JSON.parse(localStorage.getItem(`campus-ratings-${spotId}`) || '[]');
        const comments = JSON.parse(localStorage.getItem(`campus-comments-${spotId}`) || '[]');
        
        return { ratings, comments };
    }

    // 保存评分数据
    function saveRatingData(data) {
        localStorage.setItem(`campus-ratings-${spotId}`, JSON.stringify(data.ratings));
        localStorage.setItem(`campus-comments-${spotId}`, JSON.stringify(data.comments));
    }

    // 计算评分统计
    function calculateRatingStats(ratings) {
        if (ratings.length === 0) {
            return {
                average: 0,
                total: 0,
                distribution: [0, 0, 0, 0, 0] // 1-5星分布
            };
        }

        const total = ratings.length;
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const average = sum / total;

        // 计算分布
        const distribution = [0, 0, 0, 0, 0];
        ratings.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) {
                distribution[Math.floor(r.rating) - 1]++;
            }
        });

        return { average, total, distribution };
    }

    // 渲染评分统计
    function renderRatingStats() {
        const { ratings } = initRatingData();
        const stats = calculateRatingStats(ratings);

        // 更新平均分
        document.getElementById('averageRating').textContent = stats.average.toFixed(1);
        document.getElementById('totalRatings').textContent = `共 ${stats.total} 人评分`;

        // 更新星级显示
        updateStarDisplay(stats.average);

        // 渲染评分分布条
        renderRatingBars(stats.distribution, stats.total);
    }

    // 更新星级显示
    function updateStarDisplay(average) {
        const starDisplay = document.getElementById('starDisplay');
        const fullStars = Math.floor(average);
        const hasHalfStar = average % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let html = '';
        
        // 满星
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="bi bi-star-fill"></i>';
        }
        
        // 半星
        if (hasHalfStar) {
            html += '<i class="bi bi-star-half"></i>';
        }
        
        // 空星
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="bi bi-star"></i>';
        }

        starDisplay.innerHTML = html;
    }

    // 渲染评分分布条
    function renderRatingBars(distribution, total) {
        const container = document.getElementById('ratingBars');
        
        let html = '';
        for (let i = 4; i >= 0; i--) { // 从5星到1星
            const count = distribution[i];
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            html += `
                <div class="rating-item">
                    <span class="rating-label">${i + 1}星</span>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span class="rating-count">${count}</span>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    // 渲染用户评分区
    function renderUserRating() {
        const userRatingSection = document.getElementById('userRatingSection');
        
        if (!user) {
            userRatingSection.innerHTML = '<p class="text-muted">请先 <a href="login.html">登录</a> 后再评分</p>';
            return;
        }

        const { ratings } = initRatingData();
        const userRating = ratings.find(r => r.userId === user.userId);
        
        let html = `
            <div class="user-rating-form">
                <div class="mb-3">
                    <label class="form-label">你的评分：</label>
                    <div class="star-rating" id="userStarRating">
                        <i class="bi bi-star star" data-value="1"></i>
                        <i class="bi bi-star star" data-value="2"></i>
                        <i class="bi bi-star star" data-value="3"></i>
                        <i class="bi bi-star star" data-value="4"></i>
                        <i class="bi bi-star star" data-value="5"></i>
                    </div>
                    <div class="form-text">点击星星进行评分</div>
                </div>
                <button class="btn btn-submit" id="submitRating" disabled>
                    提交评分
                </button>
            </div>
        `;
        
        userRatingSection.innerHTML = html;
        
        // 初始化星级评分交互
        initStarRating(userRating ? userRating.rating : 0);
    }

    // 初始化星级评分交互
    function initStarRating(currentRating = 0) {
        const stars = document.querySelectorAll('#userStarRating .star');
        const submitBtn = document.getElementById('submitRating');
        let selectedRating = currentRating;

        // 设置初始状态
        if (currentRating > 0) {
            updateStars(currentRating);
            submitBtn.disabled = false;
        }

        // 鼠标悬停效果
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                updateStars(index + 1, true);
            });

            star.addEventListener('mouseleave', () => {
                updateStars(selectedRating);
            });

            star.addEventListener('click', () => {
                selectedRating = index + 1;
                updateStars(selectedRating);
                submitBtn.disabled = false;
            });
        });

        // 提交评分
        submitBtn.addEventListener('click', () => {
            submitUserRating(selectedRating);
        });
    }

    // 更新星星显示
    function updateStars(rating, isHover = false) {
        const stars = document.querySelectorAll('#userStarRating .star');
        
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('bi-star');
                star.classList.add('bi-star-fill');
                star.classList.add(isHover ? 'hover' : 'selected');
            } else {
                star.classList.remove('bi-star-fill', 'hover', 'selected');
                star.classList.add('bi-star');
            }
        });
    }

    // 提交用户评分
    function submitUserRating(rating) {
        if (!user) return;

        const data = initRatingData();
        const existingRatingIndex = data.ratings.findIndex(r => r.userId === user.userId);

        const ratingData = {
            userId: user.userId,
            userName: `${user.firstName} ${user.lastName}`,
            userAvatar: user.avatar,
            rating: rating,
            timestamp: new Date().toISOString()
        };

        if (existingRatingIndex >= 0) {
            // 更新现有评分
            data.ratings[existingRatingIndex] = ratingData;
        } else {
            // 添加新评分
            data.ratings.push(ratingData);
        }

        saveRatingData(data);
        renderRatingStats();
        renderUserRating();
        
        // 显示成功消息
        showToast('评分提交成功！', 'success');
    }

    // 渲染评论区
    function renderComments() {
        const { comments } = initRatingData();
        const commentsList = document.getElementById('commentsList');
        const commentSection = document.getElementById('commentSection');

        if (!user) {
            commentSection.innerHTML = '<p class="text-muted">请先 <a href="login.html">登录</a> 后发表评论</p>';
        } else {
            commentSection.innerHTML = `
                <div class="comment-form mb-4">
                    <h6>发表评论</h6>
                    <div class="mb-3">
                        <textarea class="form-control" id="commentContent" rows="3" placeholder="分享你对这个地标的看法..."></textarea>
                    </div>
                    <button class="btn btn-primary btn-sm" id="submitComment">发表评论</button>
                </div>
            `;
            
            // 绑定提交评论事件
            document.getElementById('submitComment').addEventListener('click', submitComment);
        }

        // 渲染评论列表
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="text-muted text-center">暂无评论，快来发表第一条评论吧！</p>';
            return;
        }

        // 按时间倒序排列
        const sortedComments = comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        commentsList.innerHTML = sortedComments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <img src="${comment.userAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.userName) + '&background=random'}" 
                         alt="${comment.userName}" class="comment-avatar">
                    <div class="comment-info">
                        <div class="comment-author">${comment.userName}</div>
                        <div class="comment-time">${formatTime(comment.timestamp)}</div>
                    </div>
                    ${comment.userId === (user?.userId) ? `
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteComment('${comment.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
                ${comment.rating ? `
                    <div class="comment-rating">
                        ${generateStarDisplay(comment.rating)}
                    </div>
                ` : ''}
                <div class="comment-content">${escapeHtml(comment.content)}</div>
            </div>
        `).join('');
    }

    // 提交评论
    function submitComment() {
        if (!user) return;

        const content = document.getElementById('commentContent').value.trim();
        if (!content) {
            showToast('请输入评论内容', 'warning');
            return;
        }

        const data = initRatingData();
        
        // 检查用户是否已经评论过
        const existingComment = data.comments.find(c => c.userId === user.userId);
        if (existingComment) {
            showToast('你已经发表过评论了', 'info');
            return;
        }

        const comment = {
            id: Date.now().toString(),
            userId: user.userId,
            userName: `${user.firstName} ${user.lastName}`,
            userAvatar: user.avatar,
            content: content,
            rating: data.ratings.find(r => r.userId === user.userId)?.rating || null,
            timestamp: new Date().toISOString()
        };

        data.comments.push(comment);
        saveRatingData(data);
        renderComments();
        
        // 清空输入框
        document.getElementById('commentContent').value = '';
        
        showToast('评论发表成功！', 'success');
    }

    // 删除评论
    window.deleteComment = function(commentId) {
        if (!user) return;
        
        if (confirm('确定要删除这条评论吗？')) {
            const data = initRatingData();
            data.comments = data.comments.filter(c => c.id !== commentId);
            saveRatingData(data);
            renderComments();
            showToast('评论已删除', 'success');
        }
    };

    // 生成星级显示
    function generateStarDisplay(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let html = '';
        
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="bi bi-star-fill"></i>';
        }
        if (hasHalfStar) {
            html += '<i class="bi bi-star-half"></i>';
        }
        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
            html += '<i class="bi bi-star"></i>';
        }
        
        return html;
    }

    // 格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 30) return `${days}天前`;
        
        return date.toLocaleDateString('zh-CN');
    }

    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 显示提示消息
    function showToast(message, type = 'info') {
        const toastHtml = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.innerHTML = toastHtml;
        document.body.appendChild(toastContainer);
        
        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
        toast.show();
        
        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    }
        /**
     * 计算并回写指定地标的最新平均分
     * @param {number} spotId
     * @returns {{average: number, total: number}} 最新平均分和总评分数
     */
    function calcAndSaveAverage(spotId) {
    const data = getRatingData();
    const spot = data[spotId] || { list: [] };

    const total = spot.list.length;
    if (total === 0) {
        spot.average = 0;
        spot.total   = 0;
    } else {
        const sum = spot.list.reduce((s, r) => s + r.rating, 0);
        spot.average = Number((sum / total).toFixed(2));
        spot.total   = total;
    }

    data[spotId] = spot;
    setRatingData(data);

    // 回写「基本信息」区域
    updateBasicInfo(spot.average, total);
    return { average: spot.average, total };
    }

    /** 把最新平均分/总评分数写到基本信息区 */
    function updateBasicInfo(avg, total) {
    // 基本信息区域
    document.getElementById('spotRate').textContent = avg.toFixed(1);
    // 如果还想同步「共 xx 人评分」可再写一个小元素
    const smallEl = document.querySelector('#spotRate').closest('div').querySelector('small');
    if (smallEl && total > 0) smallEl.textContent = `${total} 人评`;
    }

    // 初始化
    renderRatingStats();
    renderUserRating();
    renderComments();
    calcAndSaveAverage(spotId);
});