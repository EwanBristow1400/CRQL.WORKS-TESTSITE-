let UZUVideo;
let ParticlesVideo;
let PagePosDest = 0;  // initialise so it's not undefined
let PagePos = 0;

let DemoVideoOne;

function preload(){
    CFont = loadFont('../img/CompoundMono.ttf');
    HFont = loadFont("../img/HurleybirdJr_ATSFS.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1); // lower pixel density to reduce GPU/CPU overhead on high-DPI screens
    textFont(HFont);

    UZUVideo = createVideo("../img/uzu-website-video-two-compressed.mp4", () => {
        UZUVideo.volume(0);
        UZUVideo.loop();
        UZUVideo.hide();
        sizeMediaToTarget(UZUVideo, windowWidth * 0.8, windowHeight * 0.8);
    });


    ParticlesVideo = createVideo("../img/UZU-Particles.webm", () => {
        ParticlesVideo.volume(0);
        ParticlesVideo.loop();
        ParticlesVideo.hide();
        sizeMediaToTarget(ParticlesVideo, windowWidth * 0.6, windowHeight * 0.6);
    });

    DemoVideoOne = createVideo("../img/dry-wet-uzuvideo(compressed).mp4", () => {
        DemoVideoOne.volume(0);

        DemoVideoOne.showControls();

    });

    MainButton = createButton("Buy for £13");
    MainButton.mouseClicked(CallPurchase);
    MainButton.style("font-family", "HurleyFont");
}

const lastButtonLayout = {
    x: null,
    y: null,
    w: null,
    h: null,
    fontSize: null,
};

function draw(){
    background(255,133,51);
    textAlign(LEFT,CENTER);




    PagePos = lerp(PagePos, PagePosDest, 0.1);
    PagePos = constrain(PagePos,0,(windowHeight*4))
    PagePos = round(PagePos / 1) * 1

    let offsetY = -PagePos;

    updateButtonLayout(offsetY);

    // debug readout
    push();
    textSize(20);
    text(PagePos, 20, 50);
    pop();

    // UZU
    push();
    fill(10);
    textSize(windowWidth/10);
    text("UZU", windowWidth*0.05, windowHeight/2.5 + offsetY);
    pop();

    // The Freq Domain Phaser
    push();
    textFont(CFont);
    fill(10);
    textSize(windowWidth/50);
    text("The Frequency-Domain Phaser", windowWidth*0.05, windowHeight/2.2 + offsetY);
    pop();

    // For Razer-sharp spectral Filtering
    push();
    textFont(CFont);
    fill(0);
    textLeading(windowWidth/13)
    textSize(windowWidth/10);
    text("8192\nNotches", windowWidth*0.05, (windowHeight * 2 + offsetY - windowHeight/2));
    pop();


    image(ParticlesVideo,windowWidth/2, (windowHeight * 1.75 + offsetY - windowHeight/2))

    push();
    textFont(CFont);
    fill(0);
    textSize(windowWidth/50);
    text("Powered by spectral filtering.\nSimple idea, strange results",windowWidth*0.05, (windowHeight * 2.2 + offsetY - windowHeight/2));
    pop();


    // 8192 Notches
    push();
    textFont(CFont);
    fill(0);

    textLeading(windowWidth/13)
    textSize(windowWidth/10);
    text("What\nDoes it\nSound\nLike?", windowWidth*0.05,(windowHeight * 3 + offsetY - windowHeight/2));
    pop();

    let DemoVideoOneHeight = DemoVideoOne.height;
    DemoVideoOne.position(
        windowWidth/2,
        (windowHeight * 3 + offsetY - windowHeight/2) - DemoVideoOne.height / 2
    );


    // 8192 Notches
    push();
    textFont(CFont);
    fill(0)
    textLeading(windowWidth/13)
    textSize(windowWidth/10);
    text("VST3\nCLAP\nAU", windowWidth*0.05, (windowHeight * 4 + offsetY - windowHeight/2));
    pop();

    push();
    textFont(CFont);
    fill(0);
    textSize(windowWidth/50);
    text("Versions for Windows, Mac and Linux",windowWidth*0.05, (windowHeight * 4.25 + offsetY - windowHeight/2));
    pop();

    // VIDEO
    let vw = UZUVideo.width;
    let vh = UZUVideo.height;

    if (vw > 0 && vh > 0) {
        let maxW = windowWidth  * 0.8;
        let maxH = windowHeight * 0.8;
        let scaleW = maxW / vw;
        let scaleH = maxH / vh;
        let scale = min(scaleW, scaleH);
        let newW = vw * scale;
        let newH = vh * scale;

        let x = windowWidth - newW * 1.4;
        let y = windowHeight/2 - newH/2 + offsetY;

        roundedImage(UZUVideo, x, y, newW, newH, 20);
    }
    push()

    noStroke()
    fill(255)
    noCursor()
    blendMode(DIFFERENCE)
    circle(mouseX, mouseY, 30)
    pop()
}

function roundedImage(img, x, y, w, h, r) {
    const ctx = drawingContext;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.clip();

    image(img, x, y, w, h);

    ctx.restore();
}

function mouseWheel(event) {
    PagePosDest += event.delta;
    PagePosDest = constrain(PagePosDest,0,windowHeight* 3)
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function CallPurchase(){
    console.log("PURCHASE CALLED");
}

function updateButtonLayout(offsetY) {
    const x = windowWidth * 0.05;
    const y = windowHeight / 2 + offsetY;
    const w = windowWidth * 0.2;
    const h = windowHeight * 0.1;
    const fontSize = windowWidth * 0.02;

    // Only touch DOM when values change to avoid unnecessary layout work each frame
    if (lastButtonLayout.x !== x || lastButtonLayout.y !== y) {
        MainButton.position(x, y);
        lastButtonLayout.x = x;
        lastButtonLayout.y = y;
    }

    if (lastButtonLayout.w !== w || lastButtonLayout.h !== h) {
        MainButton.size(w, h);
        lastButtonLayout.w = w;
        lastButtonLayout.h = h;
    }

    if (lastButtonLayout.fontSize !== fontSize) {
        MainButton.style("font-size", fontSize + "px");
        lastButtonLayout.fontSize = fontSize;
    }
}

function sizeMediaToTarget(media, targetW, targetH) {
    // Resize DOM video to avoid decoding/drawing at full resolution
    const mw = media.width || targetW;
    const mh = media.height || targetH;
    const scale = min(targetW / mw, targetH / mh);
    const newW = mw * scale;
    const newH = mh * scale;
    media.size(newW, newH);
}
