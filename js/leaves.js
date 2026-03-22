document.addEventListener("DOMContentLoaded", function () {
    const leafCount = 10; // Number of leaves
    const leafSpeed = 10; // Speed of leaves (lower number is faster)
    const leaves = [];

    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement("img");
        leaf.src = "images/leaves.png";
        leaf.style.position = "fixed"; // Fixed position
        leaf.style.top = `${Math.random() * window.innerHeight}px`;
        leaf.style.left = `${window.innerWidth + Math.random() * 100}px`;
        leaf.style.width = "35px";
        leaf.style.height = "auto";
        leaf.style.opacity = "1";
        leaf.style.zIndex = "900"; // Z-index set to 900
        leaf.style.pointerEvents = "none"; // Pointer events disabled
        document.body.appendChild(leaf);
        leaves.push({ element: leaf, speed: Math.random() * 5 + 1, rotation: Math.random() * 360 });
    }

    function animateLeaves() {
        leaves.forEach((leaf) => {
            let leftPosition = parseFloat(leaf.element.style.left);
            let topPosition = parseFloat(leaf.element.style.top);

            leftPosition -= leaf.speed;
            topPosition += Math.sin(Date.now() / 1000) * 2; // Random vertical movement

            if (leftPosition < -100) {
                leftPosition = window.innerWidth + Math.random() * 100;
                topPosition = Math.random() * window.innerHeight;
            }

            leaf.rotation += 2; // Rotation of the leaf
            leaf.element.style.transform = `rotate(${leaf.rotation}deg)`;
            leaf.element.style.left = `${leftPosition}px`;
            leaf.element.style.top = `${topPosition}px`;
        });

        requestAnimationFrame(animateLeaves);
    }

    animateLeaves();
});
