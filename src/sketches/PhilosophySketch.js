export const PhilosophySketch = (p) => {
    let nodes = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        // Create nodes aligned to a grid
        for (let i = 0; i < 10; i++) {
            nodes.push({
                x: p.random(p.width),
                y: p.random(p.height),
                vx: p.random(-0.5, 0.5),
                vy: p.random(-0.5, 0.5)
            });
        }
    };

    p.draw = () => {
        p.clear();

        // Draw connecting lines (Logic)
        p.stroke(0, 30);
        p.strokeWeight(1);

        nodes.forEach((n, i) => {
            n.x += n.vx;
            n.y += n.vy;

            // Bounce
            if (n.x < 0 || n.x > p.width) n.vx *= -1;
            if (n.y < 0 || n.y > p.height) n.vy *= -1;

            // Connect to nearby nodes
            nodes.forEach((other, j) => {
                if (i !== j) {
                    let d = p.dist(n.x, n.y, other.x, other.y);
                    if (d < 150) {
                        p.line(n.x, n.y, other.x, other.y);
                    }
                }
            });

            p.fill(0);
            p.circle(n.x, n.y, 4);
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
