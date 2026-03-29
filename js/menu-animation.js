document.addEventListener('DOMContentLoaded', () => {
    const emojis = ['😘', '💕', '💖', '💗', '💓', '💝', '❤️', '😍', '🥰', '💘'];
    const navLinks = document.querySelectorAll('.nav-link');

    function createExplosion(x, y) {
        const container = document.createElement('div');
        container.className = 'emoji-explosion-container';
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
        document.body.appendChild(container);

        // 创建多个表情符号
        for (let i = 0; i < 8; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'explosion-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // 随机位置偏移
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 20 + Math.random() * 30;
            emoji.style.left = `${Math.cos(angle) * distance}px`;
            emoji.style.top = `${Math.sin(angle) * distance}px`;

            container.appendChild(emoji);
        }

        // 动画结束后移除容器
        setTimeout(() => {
            document.body.removeChild(container);
        }, 1000);
    }

    // 为每个导航链接添加鼠标悬停事件
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const rect = link.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            createExplosion(x, y);
        });
    });
});