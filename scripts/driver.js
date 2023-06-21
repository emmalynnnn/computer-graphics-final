
MySample.main = (function() {
    'use strict';

    let backgroundColor = {r: 45/255, g: 10/255, b: 80/255};

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

    let vertices1;
    let indices1;
    let normals1;

    let vertexBuffer;
    let indexBuffer;
    let normalBuffer;

    let vertexBuffer1;
    let indexBuffer1;
    let normalBuffer1;

    let slot = 1;

    let color0 = [.9, .2, .6];
    let color1 = [.1, .85, .3];
    let color2 = [.3, .1, .9];
    let color3 = [1.0, .84, 0];
    let color4 = [.2, .2, .8];


    let objColor = [.8, .2, .8];

    let model = "models/bunny.ply";
    let model1 = "models/dragon_vrip.ply";


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

            return readPly(model1)
        })
        .then(plyData => {
            vertices1 = plyData.verts;
            indices1 = plyData.indices;
            normals1 = plyData.normals;

            vertexBuffer1 = setUpBuffer(vertices1);
            indexBuffer1 = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer1);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices1, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            normalBuffer1 = setUpBuffer(normals1);

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
        
        let specLight;

        if (slot <= (numSlots / 4)) {
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

        let uLightEmission = color0;
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
            6
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

        gl.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let uModelMatrix = getModelMat(currAngl, zTrans, -.6);
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


        let uModelMatrix1 = getModelMat(currAngl, zTrans, .6);
        location = gl.getUniformLocation(shaderProgram, 'uModel');
        gl.uniformMatrix4fv(location, false, uModelMatrix1);

        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer1);
        norm = gl.getAttribLocation(shaderProgram, 'aNormal');
        gl.enableVertexAttribArray(norm);
        gl.vertexAttribPointer(norm, 3, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 3, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
        position = gl.getAttribLocation(shaderProgram, 'aPosition');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 3, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer1);
        gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_INT, 0);
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