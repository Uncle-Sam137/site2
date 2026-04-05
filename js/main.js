// 性能优化的防抖函数
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction() {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, arguments);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// 移动端菜单功能
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        // 切换菜单状态
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击导航链接时关闭菜单
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // 点击空白区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}
async function connectWallet(type) {
    if (type === 'phantom') {
        try {
            // 初始化钱包
            const initialized = await window.phantomWallet.initialize();
            if (!initialized) {
                window.open('https://phantom.app/', '_blank');
                return;
            }

            // 连接钱包
            const publicKey = await window.phantomWallet.connect();

            // 更新UI显示
            const connectBtn = document.querySelector('.connect-wallet-btn');
            connectBtn.textContent = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
            
            // 关闭钱包选择模态框
            if (typeof closeWalletModal === 'function') {
                closeWalletModal();
            }

            // 监听钱包断开连接事件
            window.phantomWallet.onDisconnect(() => {
                connectBtn.textContent = 'Connect Wallet';
            });

        } catch (err) {
            console.error('连接钱包失败:', err);
            alert('Failed to connect to Phantom wallet');
        }
    }
}
// 使用IntersectionObserver优化滚动检测
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
                observer.unobserve(entry.target); // 一旦显示就停止观察
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px'
    });

    // 获取所有需要动画的元素并开始观察
    document.querySelectorAll('.believe-section, .future-section, .footer')
        .forEach(section => observer.observe(section));
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupScrollAnimation();
}, { passive: true });