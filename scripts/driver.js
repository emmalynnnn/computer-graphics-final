
MySample.main = (function() {
    'use strict';

    //let backgroundColor = {r: 0, g: 0, b: 0};
    let backgroundColor = {r: .3, g: 0, b: .3};

    let previousTime = 0;
    let currAngl = (Math.PI) / 4;
    let zTrans = -1.6;

    let canvas = document.getElementById('canvas-main');
    let gl = canvas.getContext('webgl2');

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    let vertexShader;
    let fragmentShader;
    let shaderProgram;

    let vertices;
    let indices;
    let normals;

    let vertexBuffer;
    let indexBuffer;
    let normalBuffer;

    let slot = 1;

    let color0 = [.9, .2, .6];
    let color1 = [.1, .85, .3];
    let color2 = [.3, .1, .9];
    let color3 = [1.0, .84, 0];

    let objColor = [.8, .2, .8];

    let model = "models/bunny-low.ply";
    model = "assets/bunny.ply";
    //let model = "models/dragon_vrip.ply";


    let cubeMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, "assets/crimson-tide_rt.jpg");
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, "assets/crimson-tide_lf.jpg");
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, "assets/crimson-tide_up.jpg");
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, "assets/crimson-tide_dn.jpg");
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, "assets/crimson-tide_ft.jpg");
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, "assets/crimson-tide_bk.jpg");
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


    readPly(model)
        .then(plyData => {
            vertices = plyData.verts;
            indices = plyData.indices;
            normals = plyData.normals;

            vertexBuffer = setUpBuffer(vertices);
            indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            normalBuffer = setUpBuffer(normals);

            return loadFileFromServer('shaders/simple.vert')
        })
        .then(source => {

            vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, source);
            gl.compileShader(vertexShader);

            return loadFileFromServer('shaders/simple.frag')
        })
        .then(source1 => {
            fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, source1);
            gl.compileShader(fragmentShader);

            shaderProgram = gl.createProgram();

            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);

            requestAnimationFrame(animationLoop);
        });

    function setUpBuffer(geometry) {
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {

        const rotationRate = 0.0004;
        currAngl = currAngl + (rotationRate * elapsedTime);

        slot = Math.trunc(slot + (rotationRate * elapsedTime * 800));
        let numSlots = 1700;
        slot = slot % numSlots;

        let light0;
        let light1;
        let light2;

        light0 = color0;

        let specLight;

        if (slot <= (numSlots / 3)) {
            specLight = [0,0,0];
        } else {
            specLight = color3;
        }

        let uViewMatrix = getViewMat();
        let location = gl.getUniformLocation(shaderProgram, 'uView');
        gl.uniformMatrix4fv(location, false, uViewMatrix);

        let uProjMatrix = getProjMat("perspective");
        location = gl.getUniformLocation(shaderProgram, 'uProj');
        gl.uniformMatrix4fv(location, false, uProjMatrix);

        let uObjMat = objColor;
        location = gl.getUniformLocation(shaderProgram, 'uObjMat');
        gl.uniform3fv(location, uObjMat);

        let uLightEmission = light0;
        location = gl.getUniformLocation(shaderProgram, 'uLightEmission');
        gl.uniform3fv(location, uLightEmission);

        let uLightPos = [
            0,
            4,
            2
        ];
        location = gl.getUniformLocation(shaderProgram, 'uLightPos');
        gl.uniform3fv(location, uLightPos);

        let uSpecLight = specLight;
        location = gl.getUniformLocation(shaderProgram, 'uSpecLight');
        gl.uniform3fv(location, uSpecLight);

        let uSpecPos = [
            1,
            1,
            5
        ];
        location = gl.getUniformLocation(shaderProgram, 'uSpecPos');
        gl.uniform3fv(location, uSpecPos);

        let shiny = [3];
        location = gl.getUniformLocation(shaderProgram, 'shiny');
        gl.uniform1fv(location, shiny);

        let uAmbientLight = [.03, .01, .09];
        location = gl.getUniformLocation(shaderProgram, 'uAmbientLight');
        gl.uniform3fv(location, uAmbientLight);
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {

        //gl.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
        gl.uniform1i(uSampler, 0);

        let uModelMatrix = getModelMat(currAngl, zTrans, 0);
        let location = gl.getUniformLocation(shaderProgram, 'uModel');
        gl.uniformMatrix4fv(location, false, uModelMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        let norm = gl.getAttribLocation(shaderProgram, 'aNormal');
        gl.enableVertexAttribArray(norm);
        gl.vertexAttribPointer(norm, 3, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 3, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        let position = gl.getAttribLocation(shaderProgram, 'aPosition');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 3, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {

        let elapsedTime = time - previousTime;
        previousTime = time;

        update(elapsedTime);
        render();

        requestAnimationFrame(animationLoop);
    }

    console.log('initializing...');

}());