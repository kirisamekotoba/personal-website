export const ResearchSketch = (p) => {
    let particles = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (let i = 0; i < 25; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                vx: p.random(-0.3, 0.3),
                vy: p.random(-0.3, 0.3),
                type: p.random() > 0.5 ? 'circle' : 'square'
            });
        }
    };

    p.draw = () => {
        p.clear();
        // Light theme: dark strokes on light bg
        particles.forEach((pt, i) => {
            pt.x += pt.vx;
            pt.y += pt.vy;
            if (pt.x < 0 || pt.x > p.width) pt.vx *= -1;
            if (pt.y < 0 || pt.y > p.height) pt.vy *= -1;

            p.noFill();
            p.stroke(0, 0, 0, 30);
            p.strokeWeight(1);

            if (pt.type === 'circle') p.ellipse(pt.x, pt.y, 10, 10);
            else p.rect(pt.x - 5, pt.y - 5, 10, 10);

            // Connect nearby
            particles.forEach((other) => {
                let d = p.dist(pt.x, pt.y, other.x, other.y);
                if (d < 100) {
                    p.stroke(0, 0, 0, 15);
                    p.line(pt.x, pt.y, other.x, other.y);
                }
            });

            if (i % 5 === 0) {
                p.stroke(0, 0, 0, 8);
                p.line(pt.x, pt.y, pt.x, p.height);
            }
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
