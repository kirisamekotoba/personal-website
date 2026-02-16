export const PhilosophySketch = (p) => {
    let gridCols = 12;
    let gridRows = 8;
    let colW, rowH;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        colW = p.width / gridCols;
        rowH = p.height / gridRows;
    };

    p.draw = () => {
        p.clear();
        p.stroke(0, 0, 0, 40); // High contrast black lines
        p.strokeWeight(1);

        // Draw Swiss Grid Lines
        for (let i = 1; i < gridCols; i++) {
            p.line(i * colW, 0, i * colW, p.height);
        }
        for (let j = 1; j < gridRows; j++) {
            p.line(0, j * rowH, p.width, j * rowH);
        }

        // Interactive "Focus" Box
        // Simulates the rigid structure of logic
        let c = p.floor(p.mouseX / colW);
        let r = p.floor(p.mouseY / rowH);

        p.fill(0, 0, 0, 20);
        p.noStroke();
        p.rect(c * colW, r * rowH, colW, rowH);

        // Highlight corresponding row/col
        p.fill(255, 0, 0, 100); // Swiss Red
        p.rect(c * colW, 0, colW, 5); // Top marker
        p.rect(0, r * rowH, 5, rowH); // Left marker
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        colW = p.width / gridCols;
        rowH = p.height / gridRows;
    };
};
