// 表情符号对象池
class EmojiPool {
    constructor(size = 30) {
        this.pool = [];
        this.size = size;
        this.container = null;
        this.activeEmojis = new Set();
        this.init();
    }

    init() {
        if (this.container) {
            document.body.removeChild(this.container);
        }
        this.container = document.createElement('div');
        this.container.className = 'emoji-rain-container';
        document.body.appendChild(this.container);

        // 预创建emoji元素
        const fragment = document.createDocumentFragment();
        const emojis = ['✨', '💫', '⭐', '🌟', '💥', '🎆', '🌠', '💖', '💝'];
        for (let i = 0; i < this.size; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.display = 'none';
            fragment.appendChild(emoji);
            this.pool.push(emoji);
        }
        this.container.appendChild(fragment);
    }

    acquire() {
        const emoji = this.pool.find(emoji => !this.activeEmojis.has(emoji));
        if (emoji) {
            this.activeEmojis.add(emoji);
            emoji.style.display = 'block';
        }
        return emoji;
    }

    release(emoji) {
        if (this.activeEmojis.has(emoji)) {
            emoji.style.display = 'none';
            emoji.style.animation = 'none';
            emoji.offsetHeight; // 触发重排以重置动画
            this.activeEmojis.delete(emoji);
        }
    }

    startAnimation(emoji) {
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight * 0.8; // 从屏幕下方开始
        const endY = startY - (300 + Math.random() * 200); // 向上运动
        const animationDuration = 1 + Math.random() * 1.5; // 更快的动画速度
        const scale = 0.6 + Math.random() * 0.8; // 更大的大小范围
        const rotation = Math.random() * 720 - 360; // 更大的旋转范围

        emoji.style.left = `${startX}px`;
        emoji.style.top = `${startY}px`;
        emoji.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        emoji.style.transition = `all ${animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        // 使用 setTimeout 来确保过渡效果生效
        setTimeout(() => {
            emoji.style.top = `${endY}px`;
            emoji.style.opacity = '0';
        }, 50);

        const handleTransitionEnd = () => {
            this.release(emoji);
            emoji.removeEventListener('transitionend', handleTransitionEnd);
        };

        emoji.addEventListener('transitionend', handleTransitionEnd);
    }

    cleanup() {
        if (this.container) {
            this.activeEmojis.forEach(emoji => this.release(emoji));
            document.body.removeChild(this.container);
            this.container = null;
        }
        this.pool = [];
        this.activeEmojis.clear();
    }
}

// 使用 sessionStorage 来跟踪动画是否已经播放过
const ANIMATION_PLAYED_KEY = 'emojiRainPlayed';

// 开始表情雨动画
function startEmojiRain() {
    // 检查动画是否已经播放过
    if (sessionStorage.getItem(ANIMATION_PLAYED_KEY)) {
        return;
    }

    const emojiPool = new EmojiPool(30);
    let isRunning = true;
    let lastTime = performance.now();
    const interval = 80; // 创建新emoji的间隔（毫秒）
    const duration = 8000; // 表情雨持续时间（毫秒）

    const createEmoji = (currentTime) => {
        if (!isRunning) return;

        if (currentTime - lastTime >= interval) {
            const emoji = emojiPool.acquire();
            if (emoji) {
                emojiPool.startAnimation(emoji);
            }
            lastTime = currentTime;
        }

        requestAnimationFrame(createEmoji);
    };

    requestAnimationFrame(createEmoji);

    // 设置定时器，在指定时间后停止动画并清理资源
    setTimeout(() => {
        isRunning = false;
        setTimeout(() => {
            emojiPool.cleanup();
            // 标记动画已经播放过
            sessionStorage.setItem(ANIMATION_PLAYED_KEY, 'true');
        }, 3000); // 等待3秒，确保所有动画都完成
    }, duration);
}

// 页面加载完成后启动动画
document.addEventListener('DOMContentLoaded', () => {
    startEmojiRain();
});