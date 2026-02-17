// AboutSketch: Minimal. Just quiet floating rings.
export const AboutSketch = (p) => {
    let t = 0;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
        p.clear();
        t += 0.003;
        p.noFill();
        p.stroke(0, 0, 0, 15);
        p.strokeWeight(1);

        for (let i = 0; i < 5; i++) {
            let x = p.width * 0.5 + p.sin(t + i) * 100;
            let y = p.height * 0.5 + p.cos(t * 0.8 + i * 0.7) * 80;
            let r = 60 + i * 40 + p.sin(t + i * 2) * 20;
            p.ellipse(x, y, r, r);
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
