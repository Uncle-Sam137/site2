// Phantom钱包连接模块
class PhantomWallet {
    constructor() {
        this.provider = null;
        this.publicKey = null;
        this.isConnected = false;
        this.onConnectCallbacks = [];
        this.onDisconnectCallbacks = [];
    }

    // 初始化钱包
    async initialize() {
        try {
            // 检查是否存在Phantom Provider
            if ("phantom" in window) {
                this.provider = window.phantom?.solana;
                if (this.provider?.isPhantom) {
                    // 监听钱包事件
                    this.provider.on('connect', (publicKey) => {
                        this.handleConnect(publicKey);
                    });
                    this.provider.on('disconnect', () => {
                        this.handleDisconnect();
                    });
                    // 检查是否已经连接
                    if (this.provider.isConnected) {
                        this.publicKey = this.provider.publicKey;
                        this.isConnected = true;
                    }
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Phantom钱包初始化失败:', error);
            return false;
        }
    }

    // 连接钱包
    async connect() {
        try {
            if (!this.provider) {
                throw new Error('Phantom钱包未安装');
            }
            const resp = await this.provider.connect();
            this.handleConnect(resp.publicKey);
            return resp.publicKey.toString();
        } catch (error) {
            console.error('连接钱包失败:', error);
            throw error;
        }
    }

    // 断开连接
    async disconnect() {
        try {
            if (this.provider) {
                await this.provider.disconnect();
                this.handleDisconnect();
            }
        } catch (error) {
            console.error('断开连接失败:', error);
            throw error;
        }
    }

    // 签名消息
    async signMessage(message) {
        try {
            if (!this.isConnected) {
                throw new Error('钱包未连接');
            }
            const encodedMessage = new TextEncoder().encode(message);
            const signedMessage = await this.provider.signMessage(encodedMessage, 'utf8');
            return signedMessage;
        } catch (error) {
            console.error('消息签名失败:', error);
            throw error;
        }
    }

    // 处理连接事件
    handleConnect(publicKey) {
        this.publicKey = publicKey;
        this.isConnected = true;
        this.onConnectCallbacks.forEach(callback => callback(publicKey.toString()));
    }

    // 处理断开连接事件
    handleDisconnect() {
        this.publicKey = null;
        this.isConnected = false;
        this.onConnectCallbacks.forEach(callback => callback(null));
    }

    // 添加连接事件监听
    onConnect(callback) {
        this.onConnectCallbacks.push(callback);
    }

    // 添加断开连接事件监听
    onDisconnect(callback) {
        this.onDisconnectCallbacks.push(callback);
    }

    // 获取当前连接状态
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            publicKey: this.publicKey ? this.publicKey.toString() : null
        };
    }
}

// 创建全局钱包实例
const phantomWallet = new PhantomWallet();

// 导出钱包实例
window.phantomWallet = phantomWallet;