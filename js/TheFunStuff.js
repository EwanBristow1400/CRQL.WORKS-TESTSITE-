let gridGfx;              // offscreen grid
let squaresize = 0;
let squares = [];

let PagePos = 0;
let PagePosTarget = 0;
let ScrollUp = 0;
let firstrectpos = 0;


const palette = ["#ff8533", "#3399ff", "#bb33ff", "#33ff33", "#ff3333"];


function preload(){
    font = loadFont('../img/CompoundMono.ttf');
    UZUImage = loadImage("../img/SexyUZUImage.png");
}
function setup() {

    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    noStroke();

    squaresize = (windowWidth + windowHeight) / 80;

    makeGridBuffer();
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    background(0);

    for (let i = 0; i < 60; i++) {
        squares.push(new _square());
    }
}

function draw() {

    PagePos = lerp(PagePos, PagePosTarget, 0.1)
    PagePos = round(PagePos, 1)
    PagePos = constrain(PagePos, 0, 10000);
    // semi-clear for trails
    background(0, 0, 0, 30);

    // draw static grid (cheap, 1 call)
    image(gridGfx, 0, 0, width, height);

    for (const sq of squares) {
        sq.show();
    }

    fill(0)
    rectMode(CENTER)
    rect(windowWidth/2, windowHeight/2, windowWidth*0.9,120, 10)
    rectMode(CORNER)

    fill(255)


    rect(0,PagePos*-1 + windowHeight,windowWidth, windowHeight*20)
    if(PagePos > windowHeight){
        ScrollUp = PagePos-windowHeight

    }
    else(
        ScrollUp = 0
    )

    PagePos = constrain(PagePos, 0, 2000)
    ScrollUp = constrain(ScrollUp,0,2000)

    let cardheight = windowHeight*0.7
    let cardwidth = windowWidth*0.25

    push()
    fill(255,0,0)
    rectMode(TOP)
    rect((windowWidth/2) - (cardwidth/2), windowHeight - ScrollUp, cardwidth, cardheight)
    pop()

    image(UZUImage,(windowWidth/2) - (cardwidth/2), windowHeight - ScrollUp, cardwidth, cardheight)

    push()
    fill(255,0,0)
    rectMode(TOP)
    rect((windowWidth/5) - (cardwidth/2), windowHeight - ScrollUp, cardwidth, cardheight)
    pop()

    push()
    fill(255,0,0)
    rectMode(TOP)
    rect((windowWidth/1.25) - (cardwidth/2), windowHeight - ScrollUp, cardwidth, cardheight)
    pop()





    blendMode(DIFFERENCE)

    textSize(squaresize * 4.3);
    textFont(font)


    text("WE MAKE AUDIO TOOLS", width / 2, (height / 2) - ScrollUp );
    blendMode(BLEND)




    image(gridGfx, 0, 0, width, height);
    fill(255,0,0)
    textSize(40)

    text(PagePos, 60, 40)
    text(windowWidth, 60, 80)



}


function mouseDragged() {
    // snap to grid
    const x = Math.round(mouseX / squaresize) * squaresize;
    const y = Math.round(mouseY / squaresize) * squaresize;
    fill(255);
    square(x, y, squaresize, 5);
}

function mouseWheel(event) {
  PagePosTarget += event.delta;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    squaresize = (windowWidth + windowHeight) / 80;
    makeGridBuffer();
}

// ---------------------- helpers -----------------------

function makeGridBuffer() {
    gridGfx = createGraphics(windowWidth, windowHeight);
    gridGfx.clear();
    gridGfx.noStroke();
    gridGfx.fill(100);

    // cache locally for speed
    const step = squaresize;
    const w = windowWidth;
    const h = windowHeight;

    for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
            gridGfx.circle(x, y, 2);
        }
    }
}

// ---------------------- square class ------------------

class _square {
    constructor() {
        this.x = random(0, windowWidth);
        this.y = random(0, windowHeight);
        this.xvel = random(-10, 10);
        this.yvel = random(-10, 10);
        this.col = random(palette); // pick a random colour once
    }

    show() {
        // move
        this.x += this.xvel;
        this.y += this.yvel;

        // wrap — keep this fast
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

        // snap to grid — use a small helper instead of 2x Math.round
        const gx = snapToGrid(this.x);
        const gy = snapToGrid(this.y);

        fill(this.col);
        rect(gx, gy, squaresize, squaresize, 10);
    }
}

// snap helper — avoids repeating the formula
function snapToGrid(v) {
    return Math.round(v / squaresize) * squaresize;
}


//function scrollupgrid(){
//    for ()
//}