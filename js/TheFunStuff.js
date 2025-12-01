let gridGfx;              // offscreen grid
let canvasEl;
let squaresize = 0;
let squares = [];
let PagePos = 0;
let PagePosTarget = 0;
let ScrollUp = 0;
let scrollLimit = 0;
let currentCursor = "default";
let UZUVIDEO;
let LOCDVideo;
let videoHitbox = null;      // UZU
let locdVideoHitbox = null;  // LOCD
let font;
let UZUFont;
let CRQLIMAGE;
let warmedVideos = false;

const palette = ["#ff8533", "#3399ff", "#bb33ff", "#33ff33", "#ff3333"];

// ---------------------- p5 lifecycle ------------------

function preload() {
    // Use paths relative to the site root so they work when hosted in subdirectories.
    font = loadFont("img/CompoundMono.ttf");
    UZUFont = loadFont("img/HurleybirdJr_ATSFS.ttf");
    CRQLIMAGE = loadImage("img/CRQL_LOGO.svg");
}

function setup() {
    // --- Videos ---
    UZUVIDEO = createVideo("../img/uzu-website-video-two-compressed.mp4", () => {
        UZUVIDEO.volume(0);
        UZUVIDEO.loop();
        UZUVIDEO.hide();
    });

    LOCDVideo = createVideo("../img/LOCD_WEBSITE_LOOP_BOTTOM.mp4", () => {
        LOCDVideo.volume(0);
        LOCDVideo.loop();
        LOCDVideo.hide();
    });

    // --- Canvas ---
    canvasEl = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    noStroke();
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    background(0);

    setCursor("default");
    updateScrollLimit();

    squaresize = (windowWidth + windowHeight) / 80;
    makeGridBuffer();

    // floating squares
    for (let i = 0; i < 60; i++) {
        squares.push(new _square());
    }

    // Warm up assets used on UZU/LOCD pages so navigation feels instant.
    warmVideosOnce();
}

function draw() {
    // scroll position
    PagePosTarget = constrain(PagePosTarget, 0, scrollLimit);
    PagePos = lerp(PagePos, PagePosTarget, 0.2);
    PagePos = Math.round(PagePos * 10) / 10; // round to 0.1
    PagePos = constrain(PagePos, 0, scrollLimit);

    ScrollUp = max(0, PagePos - windowHeight);

    // semi-clear for trails
    background(0, 0, 0, 40);

    // draw static grid
    image(gridGfx, 0, 0, width, height);

    // animated squares
    for (const sq of squares) {
        sq.show();
    }

    // central rounded panel in hero
    fill(0);
    rectMode(CENTER);
    rect(windowWidth / 2, windowHeight / 2, windowWidth * 0.9, squaresize * 4, squaresize * 60);
    rectMode(CORNER);

    fill(255)
    rect(0, PagePos * -1 + windowHeight, windowWidth, scrollLimit);
    
    // main hero text
    blendMode(DIFFERENCE);
    textSize(squaresize * 4.3);
    textFont(font);
    text("WE MAKE AUDIO TOOLS", width / 2, (height / 2) - ScrollUp);
    blendMode(BLEND);

    // grid overlay again for a bit of extra pop
    image(gridGfx, 0, 0, width, height);

    // ----------------- MEDIA / SECTIONS -----------------

    // Hover flags for cursor
    let hoveringUZU = false;
    let hoveringLOCD = false;

    push();
    imageMode(CENTER);

    // --- UZU VIDEO + TEXT SECTION ---

    if (UZUVIDEO.width > 0 && UZUVIDEO.height > 0) {
        let uzuTargetWidth  = windowWidth * 0.3;
        let uzuAspect       = UZUVIDEO.width / UZUVIDEO.height;
        let uzuTargetHeight = uzuTargetWidth / uzuAspect;

        let uzuCx = windowWidth / 1.5;
        let uzuCy = windowHeight + windowHeight / 2 - ScrollUp;

        image(UZUVIDEO, uzuCx, uzuCy, uzuTargetWidth, uzuTargetHeight);

        const hitX = uzuCx - uzuTargetWidth / 2;
        const hitY = uzuCy - uzuTargetHeight / 2;

        videoHitbox = { x: hitX, y: hitY, w: uzuTargetWidth, h: uzuTargetHeight };

        hoveringUZU =
            mouseX >= hitX &&
            mouseX <= hitX + uzuTargetWidth &&
            mouseY >= hitY &&
            mouseY <= hitY + uzuTargetHeight;
    } else {
        videoHitbox = null;
    }

    pop();

    // UZU text
    push();
    fill(0);
    textFont(UZUFont);
    textAlign(LEFT);

    textSize(squaresize * 4.3);
    text("UZU", windowWidth * 0.1, windowHeight + windowHeight / 2 - ScrollUp);

    textSize(squaresize);
    textFont(font);
    text("The Frequency-Domain Phaser",
        windowWidth * 0.1,
        windowHeight + windowHeight / 1.8 - ScrollUp
    );
    pop();


    // ----------------- LOCD SECTION -----------------

    // LOCD text
    push();
    textAlign(LEFT);
    textFont(font);
    fill(0);

    textSize(squaresize * 4.3);
    const locdTitleY = windowHeight * 1.95 + windowHeight / 2 - ScrollUp;
    text("L O C D", windowWidth * 0.1, locdTitleY);

    textSize(squaresize);
    text("Locked Oscillator Correlation Device",
        windowWidth * 0.1,
        windowHeight * 2 + windowHeight / 1.8 - ScrollUp
    );
    pop();

    // LOCD video
    push();
    imageMode(CENTER);

    if (LOCDVideo.width > 0 && LOCDVideo.height > 0) {
        let locdTargetWidth  = windowWidth * 0.3;
        let locdAspect       = LOCDVideo.width / LOCDVideo.height;
        let locdTargetHeight = locdTargetWidth / locdAspect;

        let locdCx = windowWidth / 1.5;
        let locdCy = windowHeight * 2 + windowHeight / 2 - ScrollUp;

        image(LOCDVideo, locdCx, locdCy, locdTargetWidth, locdTargetHeight);

        const hitX = locdCx - locdTargetWidth / 2;
        const hitY = locdCy - locdTargetHeight / 2;

        locdVideoHitbox = { x: hitX, y: hitY, w: locdTargetWidth, h: locdTargetHeight };

        hoveringLOCD =
            mouseX >= hitX &&
            mouseX <= hitX + locdTargetWidth &&
            mouseY >= hitY &&
            mouseY <= hitY + locdTargetHeight;
    } else {
        locdVideoHitbox = null;
    }

    pop();

    // ----------------- NAV BAR + LOGO -----------------

    push();
    noStroke();
    fill(28);
    rectMode(CORNER);
    rect(0, 0, windowWidth, windowHeight * 0.08);
    imageMode(CENTER);
    image(CRQLIMAGE, windowHeight * 0.04, windowHeight * 0.04, windowHeight * 0.08, windowHeight * 0.08);
    pop();

    // ----------------- CURSOR -----------------]


    // LOCD text
    push();
    textAlign(LEFT);
    textFont(font);
    fill(0);

    textSize(squaresize * 4.3);
    const WhoAreWeTitle = windowHeight * 2.9+ windowHeight / 2 - ScrollUp;
    text("Who are we?", windowWidth * 0.1, WhoAreWeTitle);

    textSize(squaresize);
    text("Hi! Ewan and Will here. We're two idiots with computers\njust trying to make fun audio tools. ",
        windowWidth * 0.1,
        windowHeight * 3 + windowHeight / 1.8 - ScrollUp
    );

    pop();

    setCursor(hoveringUZU || hoveringLOCD ? "pointer" : "default");
}
// ---------------------- input handlers ---------------

function mouseWheel(event) {
    PagePosTarget = constrain(PagePosTarget + event.delta, 0, scrollLimit);
    return false; // prevent browser scroll
}

function mousePressed() {
    // UZU click
    if (videoHitbox) {
        const withinX = mouseX >= videoHitbox.x && mouseX <= videoHitbox.x + videoHitbox.w;
        const withinY = mouseY >= videoHitbox.y && mouseY <= videoHitbox.y + videoHitbox.h;

        if (withinX && withinY) {
            window.location.href = "uzu.html";
            return;
        }
    }

    // LOCD click
    if (locdVideoHitbox) {
        const withinX = mouseX >= locdVideoHitbox.x && mouseX <= locdVideoHitbox.x + locdVideoHitbox.w;
        const withinY = mouseY >= locdVideoHitbox.y && mouseY <= locdVideoHitbox.y + locdVideoHitbox.h;

        if (withinX && withinY) {
            window.location.href = "locd.html"; // adjust if your LOCD page is named differently
            return;
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    squaresize = (windowWidth + windowHeight) / 80;
    makeGridBuffer();
    updateScrollLimit();
}

// ---------------------- helpers -----------------------

function setCursor(cursorStyle) {
    if (!canvasEl || cursorStyle === currentCursor) return;
    currentCursor = cursorStyle;
    canvasEl.elt.style.cursor = cursorStyle;
    document.body.style.cursor = cursorStyle;
}

function updateScrollLimit() {
    scrollLimit = windowHeight * 20;
    PagePos = constrain(PagePos, 0, scrollLimit);
    PagePosTarget = constrain(PagePosTarget, 0, scrollLimit);
}

function makeGridBuffer() {
    gridGfx = createGraphics(windowWidth, windowHeight);
    gridGfx.clear();
    gridGfx.noStroke();
    gridGfx.fill(100);

    const step = squaresize;
    const w = windowWidth;
    const h = windowHeight;

    for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
            gridGfx.circle(x, y, 2);
        }
    }
}

function snapToGrid(v) {
    return Math.round(v / squaresize) * squaresize;
}

// ---------------------- preload helpers ----------------

function warmVideo(src) {
    const v = document.createElement("video");
    v.src = src;
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.style.position = "absolute";
    v.style.width = "1px";
    v.style.height = "1px";
    v.style.opacity = "0";

    const cleanup = () => v.remove();
    v.addEventListener("canplaythrough", cleanup, { once: true });
    v.addEventListener("error", cleanup, { once: true });

    document.body.appendChild(v);
}

function warmVideosOnce() {
    if (warmedVideos) return;
    warmedVideos = true;

    warmVideo("img/uzu-website-video-two-compressed.mp4");
    warmVideo("img/UZU-Particles.webm");
    warmVideo("img/dry-wet-uzuvideo(compressed).mp4");
    warmVideo("img/LOCD_WEBSITE_LOOP_BOTTOM.mp4");
}

// ---------------------- square class ------------------

class _square {
    constructor() {
        this.x = random(0, windowWidth);
        this.y = random(0, windowHeight);
        this.xvel = random(-10, 10);
        this.yvel = random(-10, 10);
        this.col = random(palette);
    }

    show() {
        // move
        this.x += this.xvel;
        this.y += this.yvel;

        // wrap
        if (this.x > windowWidth) {
            this.x = 0;
            this.xvel = random(-10, 10);
        } else if (this.x < 0) {
            this.x = windowWidth;
            this.xvel = random(-10, 10);
        }

        if (this.y > windowHeight) {
            this.y = 0;
            this.yvel = random(0, 10);
        } else if (this.y < 0) {
            this.y = windowHeight;
            this.yvel = random(0, 10);
        }

        const gx = snapToGrid(this.x);
        const gy = snapToGrid(this.y);

        fill(this.col);
        rect(gx, gy, squaresize, squaresize, 10);
    }
}
