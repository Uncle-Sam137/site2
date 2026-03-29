// Rotation Room 文字内容
const rotationText = `<p>Hey guys! <span>Welcome</span> to M3M, hope you have a <span>great</span> time here. Our goal is to bring a <span>positive</span> impact to the crypto world through our <span>actions</span>. This is no longer a market for <span>speculators</span>, but a place where everyone can <span>profit</span> fairly. However, things might not go <span>smoothly</span> at first, so we should try to avoid becoming a pure <span>PvP</span> trading model. The violent speculation between traders could cause wild <span>fluctuations</span> in the M3M exchange rate, which could discourage new members from <span>joining</span> and hurt the project's long-term <span>vitality</span>. No matter what, we're committed to preventing that from <span>happening</span>. For example, we'll limit the frequency of project team's <span>token</span> sales, and roll out more practical <span>features</span> to help the community grow steadily and attract more <span>participants</span>, balancing out the liquidity lost due to market <span>fluctuations</span>.</p>`;

// 将文字内容插入到立方体的面中
function insertTextIntoCubeFaces() {
    // 获取所有带有text类的面
    const textFaces = document.querySelectorAll(".face.text");

    // 将文字内容插入到所有面中
    textFaces.forEach((face) => {
        face.innerHTML = rotationText;
    });
}

// 调整内容大小以适应不同屏幕
function adjustRotationContentSize() {
    const rotationContent = document.querySelector(".rotation-content");
    if (!rotationContent) return;
    
    const viewportWidth = window.innerWidth;
    const baseWidth = 1000;
    let scaleFactor = 1;
    
    if (viewportWidth < 576) {
        scaleFactor = 0.4;
    } else if (viewportWidth < 768) {
        scaleFactor = 0.5;
    } else if (viewportWidth < 992) {
        scaleFactor = 0.7;
    } else if (viewportWidth < 1200) {
        scaleFactor = 0.9;
    }
    
    rotationContent.style.transform = `scale(${scaleFactor})`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    insertTextIntoCubeFaces();
    adjustRotationContentSize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', adjustRotationContentSize);
});