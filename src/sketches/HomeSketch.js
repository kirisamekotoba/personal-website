export const HomeSketch = (p) => {
    let t = 0;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
        p.clear();
        p.noFill();
        p.stroke(0, 50);

        // Gentle Sine Waves
        t += 0.01;
        for (let i = 0; i < p.height; i += 50) {
            p.beginShape();
            for (let x = 0; x < p.width; x += 20) {
                let y = i + p.sin(x * 0.01 + t) * 20;
                p.vertex(x, y);
            }
            p.endShape();
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
