// 初始化Phantom钱包实例
window.addEventListener('DOMContentLoaded', () => {
    // 创建全局钱包实例
    window.phantomWallet = new PhantomWallet();

    // 检查钱包连接状态
    const checkWalletConnection = async () => {
        try {
            const initialized = await window.phantomWallet.initialize();
            if (initialized && window.phantomWallet.isConnected) {
                const connectBtn = document.querySelector('.connect-wallet-btn');
                if (connectBtn) {
                    const publicKey = window.phantomWallet.publicKey.toString();
                    connectBtn.textContent = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
                }
            }
        } catch (error) {
            console.error('检查钱包连接状态失败:', error);
        }
    };

    // 执行初始检查
    checkWalletConnection();
});