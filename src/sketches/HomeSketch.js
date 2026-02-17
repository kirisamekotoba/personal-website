// HomeSketch: Subtle paper-grain background + click-to-draw ink
export const HomeSketch = (p) => {
    let dots = [];
    let t = 0;
    let strokes = []; // stored ink points

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        // Sparse floating dots
        for (let i = 0; i < 40; i++) {
            dots.push({
                x: p.random(p.width),
                y: p.random(p.height),
                size: p.random(1.5, 4),
                drift: p.random(0.1, 0.4),
                phase: p.random(p.TWO_PI)
            });
        }
    };

    p.draw = () => {
        p.clear();
        t += 0.005;

        // Gentle grain dots drifting
        p.noStroke();
        dots.forEach(d => {
            let alpha = 30 + 20 * p.sin(t * 2 + d.phase);
            p.fill(80, 70, 60, alpha);
            let dx = p.sin(t + d.phase) * d.drift * 30;
            let dy = p.cos(t * 0.7 + d.phase) * d.drift * 20;
            p.circle(d.x + dx, d.y + dy, d.size);
        });

        // Draw stored ink strokes
        p.stroke(40, 35, 30, 180);
        p.noFill();
        for (const stroke of strokes) {
            if (stroke.length < 2) continue;
            p.beginShape();
            for (const pt of stroke) {
                p.strokeWeight(pt.w);
                p.curveVertex(pt.x, pt.y);
            }
            p.endShape();
        }

        // Draw current stroke if mouse is pressed
        if (p.mouseIsPressed) {
            const current = strokes[strokes.length - 1];
            if (current) {
                current.push({
                    x: p.mouseX + p.random(-0.5, 0.5),
                    y: p.mouseY + p.random(-0.5, 0.5),
                    w: p.random(1, 2.5)
                });
            }
        }
    };

    p.mousePressed = () => {
        // Start a new stroke
        strokes.push([{
            x: p.mouseX,
            y: p.mouseY,
            w: p.random(1, 2.5)
        }]);

        // Ink splatter
        p.noStroke();
        p.fill(30, 25, 20, 100);
        for (let i = 0; i < 5; i++) {
            p.circle(
                p.mouseX + p.random(-10, 10),
                p.mouseY + p.random(-10, 10),
                p.random(1.5, 3.5)
            );
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
