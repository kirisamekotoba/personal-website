let treeImg;
let mapImg;
let currentSection = 'landing';
let navPoints = [];
let scribbles = []; // Array to hold random scribble decorations

function preload() {
    treeImg = loadImage('assets/tree.png');
    mapImg = loadImage('assets/map.png');
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    imageMode(CENTER);
    angleMode(DEGREES);

    setupNavPoints();

    // Create some static scribbles
    for (let i = 0; i < 5; i++) {
        scribbles.push({
            x: random(width),
            y: random(height),
            r: random(10, 50),
            points: []
        });
    }
}

function setupNavPoints() {
    // Define interactive navigation points relative to window size
    // Targeted to align with branches if possible, or just aesthetically placing them
    navPoints = [
        { label: 'Works', xRatio: 0.65, yRatio: 0.35, target: 'works' },
        { label: 'Experience', xRatio: 0.78, yRatio: 0.5, target: 'experience' },
        { label: 'About', xRatio: 0.60, yRatio: 0.6, target: 'about' }
    ];
}

function draw() {
    clear();

    // Optional: Draw subtle paper texture logic or noise here if desired

    if (currentSection === 'landing') {
        drawLanding();
    } else if (currentSection === 'works') {
        drawWorks();
    } else if (currentSection === 'experience') {
        drawExperience();
    } else if (currentSection === 'about') {
        drawAbout();
    }
}

// Helper for hand-drawn lines
function sketchyLine(x1, y1, x2, y2) {
    let d = dist(x1, y1, x2, y2);
    let steps = d / 5;
    let mainNoise = random(100);

    noFill();
    stroke(0);
    strokeWeight(1.5);
    beginShape();
    for (let i = 0; i <= steps; i++) {
        let t = i / steps;
        let x = lerp(x1, x2, t);
        let y = lerp(y1, y2, t);
        // Add noise
        let nx = (noise(mainNoise + t * 10) - 0.5) * 2; // Small 2px wiggle
        let ny = (noise(mainNoise + t * 10 + 100) - 0.5) * 2;
        vertex(x + nx, y + ny);
    }
    endShape();
}

function drawLanding() {
    // Draw Tree on the right
    // float effect
    let floatY = sin(frameCount * 0.5) * 3;

    let imgH = height * 0.85;
    let imgW = (treeImg.width / treeImg.height) * imgH;
    // Cap width if it gets too wide
    if (imgW > width * 0.6) {
        imgW = width * 0.6;
        imgH = (treeImg.height / treeImg.width) * imgW;
    }

    let treeX = width * 0.75;
    let treeY = height / 2 + floatY;

    push();
    tint(255, 230); // Slight transparency
    image(treeImg, treeX, treeY, imgW, imgH);
    pop();

    // Draw Navigation Points
    stroke(0);
    strokeWeight(1.5);
    textFont('Courier Prime');
    textSize(20);
    textAlign(RIGHT, CENTER);

    navPoints.forEach(p => {
        let px = width * p.xRatio;
        let py = height * p.yRatio + floatY; // Move with tree

        // Interaction
        let d = dist(mouseX, mouseY, px, py);
        let isHover = d < 100 && mouseX < px + 50; // Simple hit area

        let labelX = px - 20;

        if (isHover) {
            cursor(HAND);
            fill(0);
            textStyle(BOLD);
            text(p.label, labelX - 10, py); // Shift left on hover

            // Draw an arrow or underline
            sketchyLine(labelX - 10, py + 10, labelX + 60, py + 10);

            // Connector to tree center roughly
            stroke(0, 100);
            sketchyLine(labelX + 80, py, treeX, treeY);

        } else {
            fill(50);
            textStyle(NORMAL);
            text(p.label, labelX, py);

            // Branch connector
            stroke(0, 50);
            sketchyLine(labelX + 10, py, treeX, treeY * 0.9 + py * 0.1);
        }

        // Draw a loose circle "leaf" or node
        noFill();
        stroke(0);
        circle(px, py, 5 + random(2));
    });

    if (dist(mouseX, mouseY, width / 2, height / 2) > 400) cursor(ARROW); // Reset if far
}

function drawWorks() {
    // Animated Wavy Lines Background
    noFill();
    stroke(0, 40);
    strokeWeight(1);

    let t = frameCount * 0.02;

    for (let i = 0; i < height; i += 60) {
        beginShape();
        for (let x = 0; x <= width; x += 40) {
            // Perlin noise for organic wave
            let yOffset = map(noise(x * 0.005, i * 0.01, t), 0, 1, -20, 20);
            vertex(x, i + yOffset);
        }
        endShape();
    }

    drawBackButton();
}

function drawExperience() {
    // Draw Map in background
    let imgRatio = mapImg.width / mapImg.height;
    let drawWidth = width * 0.7;
    let drawHeight = drawWidth / imgRatio;

    push();
    translate(width / 2, height / 2);
    // Slow rotation or breathe
    scale(1 + sin(frameCount * 0.05) * 0.01);

    tint(255, 30); // Very faint
    image(mapImg, 0, 0, drawWidth, drawHeight);
    pop();

    // Draw connecting lines between timeline items if we knew their DOM positions
    // For now just decorative dashed lines
    stroke(0, 50);
    drawingContext.setLineDash([5, 15]);
    line(width * 0.2, height * 0.3, width * 0.2, height * 0.8);
    drawingContext.setLineDash([]);

    drawBackButton();
}

function drawAbout() {
    // Minimalist: maybe some floating ink drops?
    randomSeed(10);
    fill(0);
    noStroke();

    for (let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        let s = random(2, 5);
        // Float up
        y = (y - frameCount * 0.5 + height) % height;
        circle(x, y, s);
    }

    drawBackButton();
}

function drawBackButton() {
    cursor(ARROW); // Default

    let bx = 50;
    let by = 50;
    let isHover = mouseX < 150 && mouseY < 100;

    textAlign(LEFT, TOP);
    textSize(24);
    textFont('Special Elite');

    if (isHover) {
        cursor(HAND);
        fill(0);
        text("← Back", bx - 5, by);
        sketchyLine(bx, by + 30, bx + 80, by + 30);
    } else {
        fill(80);
        text("← Back", bx, by);
    }
}

function mousePressed() {
    if (currentSection === 'landing') {
        // Simple hit detection for nav points
        // Re-calculate positions to match draw
        // (A bit redundant but simple)
        let floatY = sin(frameCount * 0.5) * 3;

        navPoints.forEach(p => {
            let px = width * p.xRatio;
            let py = height * p.yRatio + floatY;
            if (dist(mouseX, mouseY, px, py) < 80) { // Generous hit area
                switchSection(p.target);
            }
        });
    } else {
        if (mouseX < 150 && mouseY < 100) {
            switchSection('landing');
        }
    }
}

function switchSection(target) {
    let currentEl = document.getElementById(currentSection);
    if (currentEl) {
        currentEl.classList.remove('active-section');
        setTimeout(() => {
            currentEl.style.display = 'none';
        }, 500); // 0.5s CSS transition
    }

    currentSection = target;

    let nextEl = document.getElementById(currentSection);
    if (nextEl) {
        nextEl.style.display = 'flex'; // or block/flex depending on css
        // small delay to allow display change to register before playing opacity
        setTimeout(() => {
            nextEl.classList.add('active-section');
        }, 50);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setupNavPoints(); // Re-calc positions if needed
}
