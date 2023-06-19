//colors from https://www.rapidtables.com/web/color/RGB_Color.html
let crimson = toRatios({r: 220, g: 20, b: 60});
let indianRed = toRatios({r: 205, g: 92, b: 92});
let salmon = toRatios({r: 250, g: 128, b: 114});
let firebrick = toRatios({r: 178, g: 34, b: 34});

function getVertsTet() {
    let vertsTri = new Float32Array([
        0.0, 0.5, 0.0,
        0.5, 0.0, 0.0,
        -0.5, 0.0, 0.0
    ]);
    let vertsTet = new Float32Array([
        0.5, 0.5, 0.5, //0 red
        0.5, -0.5, -0.5, //1 green
        -0.5, 0.5, -0.5, //2 blue
        -0.5, -0.5, 0.5, //3 white
    ]);
    return new Float32Array([
        0.5, 0.5, 0.5, //0 red
        0.5, -0.5, -0.5, //1 green
        -0.5, 0.5, -0.5, //2 blue

        0.5, -0.5, -0.5, //3 green
        -0.5, 0.5, -0.5, //4 blue
        -0.5, -0.5, 0.5, //5 white

        -0.5, 0.5, -0.5, //6 blue
        -0.5, -0.5, 0.5, //7 white
        0.5, 0.5, 0.5, //8 red

        -0.5, -0.5, 0.5, //9 white
        0.5, 0.5, 0.5, //10 red
        0.5, -0.5, -0.5, //11 green
    ]);
}

function getIndicesTet() {
    let indicesTri = new Uint16Array([ 0, 2, 1 ]);
    let indicesTet = new Uint16Array([
        0, 1, 2,
        1, 2, 3,
        2, 3, 0,
        3, 0, 1
    ]);
    return new Uint16Array([
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11
    ]);
}

function getColorsTet() {
    let vertColorsTri = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ]);

    let vertColorsTet = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        1.0, 1.0, 1.0
    ]);
    /*return new Float32Array([
        1.0, 0.0, 0.0, //0 red
        1.0, 0.0, 0.0, //1 green
        1.0, 0.0, 0.0, //2 blue

        0.0, 1.0, 0.0, //3 green
        0.0, 1.0, 0.0, //4 blue
        0.0, 1.0, 0.0, //5 white

        0.0, 0.0, 1.0, //6 blue
        0.0, 0.0, 1.0, //7 white
        0.0, 0.0, 1.0, //8 red

        1.0, 1.0, 1.0, //9 white
        1.0, 1.0, 1.0, //10 red
        1.0, 1.0, 1.0, //11 green
    ]);*/
    return new Float32Array([
        crimson.r, crimson.g, crimson.b, //0 red
        crimson.r, crimson.g, crimson.b, //1 green
        crimson.r, crimson.g, crimson.b, //2 blue

        indianRed.r, indianRed.g, indianRed.b, //3 green
        indianRed.r, indianRed.g, indianRed.b, //4 blue
        indianRed.r, indianRed.g, indianRed.b, //5 white

        salmon.r, salmon.g, salmon.b, //6 blue
        salmon.r, salmon.g, salmon.b, //7 white
        salmon.r, salmon.g, salmon.b, //8 red

        firebrick.r, firebrick.g, firebrick.b, //9 white
        firebrick.r, firebrick.g, firebrick.b, //10 red
        firebrick.r, firebrick.g, firebrick.b, //11 green
    ]);
}
