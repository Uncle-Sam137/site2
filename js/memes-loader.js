// 预加载图片函数
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// 创建带有性能优化的图片元素
function createOptimizedImage(src, alt) {
    const img = document.createElement('img');
    img.loading = 'lazy'; // 使用原生懒加载
    img.decoding = 'async'; // 异步解码
    img.style.willChange = 'transform'; // 优化动画性能
    img.style.transform = 'translateZ(0)'; // 启用GPU加速
    img.style.visibility = 'hidden';
    img.alt = alt;

    // 使用IntersectionObserver监控图片可见性
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = src;
                    requestAnimationFrame(() => {
                        img.style.visibility = 'visible';
                    });
                    observer.unobserve(img);
                }
            });
        },
        { 
            threshold: 0.1,
            rootMargin: '50px'
        }
    );

    observer.observe(img);
    return img;
}

// 动态加载GIF图片
function loadGifImages() {
    const trackLeft = document.querySelector('.track-left');
    const trackRight = document.querySelector('.track-right');

    // 使用DocumentFragment优化DOM操作
    const leftFragment = document.createDocumentFragment();
    const rightFragment = document.createDocumentFragment();

    // 初始化图片数组
    const memes1Images = [
        '20190916144526_16301.gif',
        'bae-love.gif',
        'blowing-kisses-hearts.gif',
        'ceeb653ely1g7eff3m9jig208c08c1kv.gif',
        'e527a428cdb2614ff1739c50e6d2fc9c.gif',
        'f5618231a90e44628a8d51de5262e62e.gif',
        'giphy.gif',
        'i-love-you-yolanthe-cabau.gif',
        'kiss-muah.gif',
        'kiss.gif',
        'kisses-i-love-you.gif',
        'kissing-luv.gif',
        'muah-kiss.gif',
        'puso-maria-faye-vargas.gif',
        'suki-kiss.gif'
    ];

    const memes2Images = [
        '100c57fc49de4624f05d553dd891a3e3.gif',
        '200w (1).gif',
        '200w (2).gif',
        '200w (3).gif',
        '200w.gif',
        '505f9f2e6b4c0ed63a3defda6f6dddb6.gif',
        '63da8239e46c5hb5.gif',
        '7dd6a846a4676e6d9f1e21fbe7906546.gif',
        '86491adf03103810747e6c0bd71d1300.gif',
        'tom-and-jerry-cartoons.gif',
        'v2-db23404c3a538e2f2c32ae27539b124b_b.gif',
        'yQHXgmL.gif'
    ];

    // 批量预加载图片
    function batchPreload(images, folder) {
        const batchSize = 3;
        let currentBatch = 0;

        function loadBatch() {
            const batch = images.slice(currentBatch, currentBatch + batchSize);
            if (batch.length === 0) return;

            Promise.all(batch.map(img => preloadImage(`${folder}/${img}`)))
                .then(() => {
                    currentBatch += batchSize;
                    if (currentBatch < images.length) {
                        setTimeout(loadBatch, 100);
                    }
                })
                .catch(console.error);
        }

        loadBatch();
    }

    // 为左轨道加载gif1图片
    if (trackLeft) {
        memes1Images.forEach(imageName => {
            const img = createOptimizedImage(`img/memes1/${imageName}`, 'Meme');
            leftFragment.appendChild(img);
        });
        // 复制一组实现无缝循环
        memes1Images.forEach(imageName => {
            const img = createOptimizedImage(`img/memes1/${imageName}`, 'Meme');
            leftFragment.appendChild(img);
        });
        trackLeft.appendChild(leftFragment);

        // 预加载下一组图片
        batchPreload(memes1Images, 'img/memes1');
    }

    // 为右轨道加载gif2图片
    if (trackRight) {
        memes2Images.forEach(imageName => {
            const img = createOptimizedImage(`img/memes2/${imageName}`, 'Meme');
            rightFragment.appendChild(img);
        });
        // 复制一组实现无缝循环
        memes2Images.forEach(imageName => {
            const img = createOptimizedImage(`img/memes2/${imageName}`, 'Meme');
            rightFragment.appendChild(img);
        });
        trackRight.appendChild(rightFragment);

        // 预加载下一组图片
        batchPreload(memes2Images, 'img/memes2');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', loadGifImages, { passive: true });