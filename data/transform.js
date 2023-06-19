function getTransMat(ZTrans, XTrans) {
    let uTransMatrix = [
        1, 0, 0, XTrans, //x
        0, 1, 0, 0, //y
        0, 0, 1, ZTrans, //z
        0, 0, 0, 1
    ];
    return transposeMatrix4x4(uTransMatrix);
}

function getRotMat(currAngl) {
    let rotMatrixXZ = [
            Math.cos(currAngl), 0, Math.sin(currAngl), 0.0,
            0, 1, 0, 0.0,
            -1 * Math.sin(currAngl), 0, Math.cos(currAngl), 0.0,
            0, 0, 0, 1
        ]; //x - z plane

    return transposeMatrix4x4(rotMatrixXZ);
}

function getModelMat(currAngl, ZTrans, XTrans=0) {
    return multiplyMatrix4x4(getRotMat(currAngl), getTransMat(ZTrans, XTrans))
}

function getViewMat() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}