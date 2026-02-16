export const ResearchSketch = (p) => {
    let particles = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                size: p.random(2, 8),
                color: p.random([
                    '#a63737', '#2c3e50', '#d4ac0d'
                ])
            });
        }
    };

    p.draw = () => {
        p.clear();
        p.noStroke();

        particles.forEach(pt => {
            // Browninan motion
            pt.x += p.random(-2, 2);
            pt.y += p.random(-2, 2);

            p.fill(pt.color);
            p.circle(pt.x, pt.y, pt.size);
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
