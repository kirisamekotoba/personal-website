export const AboutSketch = (p) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    };

    p.draw = () => {
        p.clear();

        // Subtle 3D rotation based on mouse
        let locX = p.mouseX - p.height / 2;
        let locY = p.mouseY - p.width / 2;

        p.ambientLight(50);
        p.directionalLight(255, 255, 255, 0.25, 0.25, 0);
        p.pointLight(0, 0, 255, locX, locY, 250);

        // Just some floating geometric shapes for minimalism
        p.push();
        p.rotateZ(p.frameCount * 0.01);
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);
        p.noFill();
        p.stroke(0, 50);
        p.box(300);
        p.pop();
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
