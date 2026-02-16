export const HomeSketch = (p) => {
    let rawPoints = []; // Stores user mouse path
    let inkTrails = []; // Stores processed 'ink' lines

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(244, 241, 234); // Paper color
    };

    p.draw = () => {
        // No clear() to simulate ink build-up

        // Record mouse
        if (p.mouseIsPressed || (p.abs(p.mouseX - p.pmouseX) > 2 || p.abs(p.mouseY - p.pmouseY) > 2)) {
            rawPoints.push(p.createVector(p.mouseX, p.mouseY));

            // Draw scratchy line
            p.stroke(40, 40, 40, 200);
            p.strokeWeight(p.random(1, 3));
            p.noFill();

            p.beginShape();
            // Connect last few points with jitter
            let len = rawPoints.length;
            if (len > 2) {
                let last = rawPoints[len - 1];
                let second = rawPoints[len - 2];
                p.line(second.x + p.random(-1, 1), second.y + p.random(-1, 1), last.x, last.y);
            }
            p.endShape();
        }

        // Limit memory
        if (rawPoints.length > 500) rawPoints.shift();
    };

    p.mousePressed = () => {
        // Splatter effect
        for (let i = 0; i < 10; i++) {
            let r = p.random(2, 5);
            let x = p.mouseX + p.random(-20, 20);
            let y = p.mouseY + p.random(-20, 20);
            p.noStroke();
            p.fill(20, 20, 20, 150);
            p.circle(x, y, r);
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(244, 241, 234);
    };
};
