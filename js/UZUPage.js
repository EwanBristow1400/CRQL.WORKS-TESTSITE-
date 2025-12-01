let UZUVideo;
let ParticlesVideo;
let PagePosDest = 0;  // initialise so it's not undefined
let PagePos = 0;
let DemoVideoOne;
let logoHitbox = null;
let canvasEl;
let currentCursor = "default";

let ButtonTextSize;

let VolumeToggle;

function preload(){
    // Paths relative to site root so they work from subdirectories.
    CFont = loadFont('img/CompoundMono.ttf');
    HFont = loadFont("img/HurleybirdJr_ATSFS.ttf");
    CRQLIMAGE = loadImage("img/CRQL_Logo.svg")
}

function setup() {
    pixelDensity(1)
    background(255,133,51);
    // Render at device pixel ratio so text doesn't look blurry/pixelated on HiDPI screens.
    pixelDensity(window.devicePixelRatio)

    canvasEl = createCanvas(windowWidth, (windowHeight*3));
    textFont(HFont);
    setCursor("default");



    UZUVideo = createVideo("../img/uzu-website-video-two-compressed.mp4", () => {
        UZUVideo.volume(0);   // mute
        UZUVideo.loop();      // autoplay + loop
        UZUVideo.showControls()
        UZUVideo.hide()
        UZUVideo.size(AUTO,windowHeight*0.6)
    });

    ParticlesVideo = createVideo("../img/UZU-Particles.webm", () => {
        ParticlesVideo.volume(0);
        ParticlesVideo.loop();  // autoplay + loop
        ParticlesVideo.hide();  // we’ll draw it manually
        ParticlesVideo.size(AUTO,windowHeight*0.6)
    });

    DemoVideoOne = createVideo("../img/dry-wet-uzuvideo(compressed).mp4", () => {
        DemoVideoOne.volume(0);          // or 0.5 if you want it quieter
        DemoVideoOne.loop();             // loops video + audio
                // still draw into canvas
        DemoVideoOne.size(AUTO,windowHeight * 0.6); // just pick a height; width auto is fine
        DemoVideoOne.autoplay()
        DemoVideoOne.showControls()
        DemoVideoOne.position (windowWidth/2, windowHeight/4 + windowHeight*2)
    });






    MainButton = createButton("Buy for £13");
    MainButton.mouseClicked(CallPurchase);
    MainButton.style("font-family", "HurleyFont");
    MainButton.position(windowWidth*0.05,windowHeight/2)
    MainButton.size(windowWidth*0.2, windowHeight*0.1)
    ButtonTextSize = windowWidth *0.02
    MainButton.style('font-size',   ButtonTextSize + 'px');

}




function draw(){
    clear()
    imageMode(CENTER)
    textAlign(LEFT,CENTER);


    PagePos = lerp(PagePos, PagePosDest, 0.2);
    PagePos = constrain(PagePos,0,(windowHeight*4))
    PagePos = round(PagePos / 1) * 1

    let offsetY = -PagePos;

    textSize(20);
    text(PagePos, 20, 50);

    // UZU
    push();
    fill(10);
    textSize(windowWidth/10);
    text("UZU", windowWidth*0.05, windowHeight/2.5);
    pop();

    image(UZUVideo, windowWidth/1.5,windowHeight/2)

    // The Freq Domain Phaser
    push();
    textFont(CFont);
    fill(10);
    textSize(windowWidth/50);
    text("The Frequency-Domain Phaser", windowWidth*0.05, windowHeight/2.2);
    pop();

    // For Razer-sharp spectral Filtering
    push();
    textFont(CFont);
    fill(0);
    textLeading(windowWidth/13)
    textSize(windowWidth/10);
    text("8192\nNotches", windowWidth*0.05, (windowHeight * 2) - windowHeight/2);
    pop();

    image(ParticlesVideo, windowWidth,windowHeight/2 + windowHeight)

    push();
    textFont(CFont);
    fill(0);
    textSize(windowWidth/50);
    text("Powered by spectral filtering.\nSimple idea, strange results",windowWidth*0.05, (windowHeight * 2.2) - windowHeight/2);
    pop();


    // --- "What does it sound like?" section ---
    push();
    textFont(CFont);
    fill(0);
    textLeading(windowWidth / 13);
    textSize(windowWidth / 10);
    text("What\nDoes it\nSound\nLike?",
        windowWidth * 0.05,
        (windowHeight * 3 + offsetY - windowHeight / 2));
    pop();






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

    push()
    noStroke()
    fill(28)
    rect(0,0,windowWidth,windowHeight*0.08)

    const logoSize = windowHeight*0.08;
    const logoX = windowHeight*0.04;
    const logoY = windowHeight*0.04;
    image(CRQLIMAGE,logoX,logoY,logoSize,logoSize)
    logoHitbox = {
        x: logoX - logoSize/2,
        y: logoY - logoSize/2,
        w: logoSize,
        h: logoSize
    };

    pop()

    const hoveringLogo =
        logoHitbox &&
        mouseX >= logoHitbox.x &&
        mouseX <= logoHitbox.x + logoHitbox.w &&
        mouseY >= logoHitbox.y &&
        mouseY <= logoHitbox.y + logoHitbox.h;
    setCursor(hoveringLogo ? "pointer" : "default");
}

function mousePressed() {
    if (!logoHitbox) return;
    const hitX = mouseX >= logoHitbox.x && mouseX <= logoHitbox.x + logoHitbox.w;
    const hitY = mouseY >= logoHitbox.y && mouseY <= logoHitbox.y + logoHitbox.h;
    if (hitX && hitY) {
        window.location.href = "index.html";
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight*3);
    MainButton.position(windowWidth*0.05,windowHeight/2)
    MainButton.size(windowWidth*0.2, windowHeight*0.1)
    ButtonTextSize = windowWidth *0.02
    MainButton.style('font-size',   ButtonTextSize + 'px');

    DemoVideoOne.position (windowWidth/2, windowHeight/4 + windowHeight*2)

    DemoVideoOne.size(AUTO, windowHeight*0.6)
    ParticlesVideo.size(AUTO,windowHeight*0.6)
}
function CallPurchase(){
    console.log("PURCHASE CALLED");
    checkout('uzu', 'uzu13', false)
}

async function checkout(product, tier, isTest) {
    const currentPage = window.location.href

    const res = await fetch(isTest ? "https://api.crql.works/checkout-test" : "https://api.crql.works/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, tier, return_url: currentPage })
    })

    const data = await res.json()
    window.location.href = data.url
}

function setCursor(cursorStyle) {
    if (!canvasEl || cursorStyle === currentCursor) return;
    currentCursor = cursorStyle;
    canvasEl.elt.style.cursor = cursorStyle;
    document.body.style.cursor = cursorStyle;
}
