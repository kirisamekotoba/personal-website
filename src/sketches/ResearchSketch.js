export const ResearchSketch = (p) => {
    let particles = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        // Create nodes
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                vx: p.random(-0.5, 0.5),
                vy: p.random(-0.5, 0.5),
                type: p.random() > 0.5 ? 'circle' : 'square'
            });
        }
    };

    p.draw = () => {
        p.clear();
        p.stroke(255, 255, 255, 50); // White lines on (assumed) blue bg
        p.strokeWeight(1);

        // Dashed lines (simulated)
        // P5 doesn't have native dashed lines easily, just draw solid low opacity

        particles.forEach((pt, i) => {
            pt.x += pt.vx;
            pt.y += pt.vy;

            // Bounce
            if (pt.x < 0 || pt.x > p.width) pt.vx *= -1;
            if (pt.y < 0 || pt.y > p.height) pt.vy *= -1;

            p.noFill();
            p.stroke(255, 255, 255, 100);

            if (pt.type === 'circle') p.ellipse(pt.x, pt.y, 10, 10);
            else p.rect(pt.x - 5, pt.y - 5, 10, 10);

            // Connect nearby
            particles.forEach((other, j) => {
                let d = p.dist(pt.x, pt.y, other.x, other.y);
                if (d < 100) {
                    p.line(pt.x, pt.y, other.x, other.y);
                }
            });

            // Draw "Measurement" lines to edges sometimes
            if (i % 5 === 0) {
                p.stroke(255, 255, 255, 20);
                p.line(pt.x, pt.y, pt.x, p.height);
            }
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
