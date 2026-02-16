let textureImg;
let particles = [];
let waves = [];

function preload() {
    // Attempt to load texture, fallback if missing
    // Use a try-catch pattern visually by checking if image loads? 
    // p5.js loadImage error handling is via callback, but we will just load it.
    // If it fails, we just don't draw it.
    textureImg = loadImage('assets/texture.png',
        () => { console.log("Texture loaded"); },
        () => { console.log("Texture failed (using fallback)"); }
    );
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');

    // Initialize Particles (Dots)
    for (let i = 0; i < 30; i++) {
        particles.push(new Dot());
    }

    // Initialize Waves
    for (let i = 0; i < 5; i++) {
        waves.push(new Wave(i * height / 5));
    }
}

function draw() {
    // Muted background clear
    // We want the CSS background to show through, but maybe we modify it slightly
    // clear() allows CSS background to shine. Be careful with 'texture' overlay.
    clear();

    // Draw Texture Overlay if loaded (multiply effect simulation via Tint)
    if (textureImg) {
        push();
        blendMode(MULTIPLY);
        tint(255, 30); // Very subtle
        image(textureImg, 0, 0, width, height);
        pop();
    }

    // Draw Waves
    waves.forEach(w => {
        w.update();
        w.display();
    });

    // Draw Particles
    particles.forEach(p => {
        p.update();
        p.display();
    });

    // Mouse Interaction: Draw a geometric influence
    noFill();
    stroke(0, 20);
    circle(mouseX, mouseY, 50);
}

class Dot {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-0.5, 0.5);
        this.vy = random(-0.5, 0.5);
        this.size = random(3, 8);
        this.color = random([
            '#a63737', // Red
            '#2c3e50', // Blue
            '#d4ac0d', // Yellow
            '#2b2b2b'  // Grey
        ]);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > width) this.y = 0;

        // Mouse interact
        let d = dist(mouseX, mouseY, this.x, this.y);
        if (d < 100) {
            let angle = atan2(this.y - mouseY, this.x - mouseX);
            this.x += cos(angle) * 1;
            this.y += sin(angle) * 1;
        }
    }

    display() {
        noStroke();
        fill(this.color);
        circle(this.x, this.y, this.size);
    }
}

class Wave {
    constructor(yBase) {
        this.yBase = yBase;
        this.offset = random(1000);
        this.speed = random(0.005, 0.01);
        this.amp = random(20, 50);
        this.color = color(0, 0, 0, 10); // Very faint grey
    }

    update() {
        this.offset += this.speed;
    }

    display() {
        noFill();
        stroke(this.color);
        strokeWeight(1);

        beginShape();
        for (let x = 0; x <= width; x += 20) {
            let y = this.yBase + sin(x * 0.01 + this.offset) * this.amp;
            // Add noise
            y += map(noise(x * 0.01, this.offset), 0, 1, -10, 10);
            vertex(x, y);
        }
        endShape();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
