function getClippingPlane() {
    return {right: 1, left: -1, top: 1, bottom: -1, far: 10, near: 1}
}

function getProjMat(type) {
    let cp = getClippingPlane();

    let uProjMatrix;

    if (type === "parallel") {
        uProjMatrix = [
            2 / (cp.right - cp.left), 0, 0, -1 * ((cp.left + cp.right) / (cp.right - cp.left)),
            0, 2 / (cp.top - cp.bottom), 0, -1 * ((cp.top + cp.bottom) / (cp.top - cp.bottom)),
            0, 0, -1 * (2 / (cp.far - cp.near)), -1 * ((cp.far + cp.near) / (cp.far - cp.near)),
            0, 0, 0, 1
        ];
        //console.log(uProjMatrix);
    } else if (type === "perspective") {
        let r = -1 * cp.left;
        let t = -1 * cp.bottom;

        uProjMatrix = [
            cp.near / r, 0, 0, 0,
            0, cp.near / t, 0, 0,
            0, 0, (-1 * (cp.far + cp.near)) / (cp.far - cp.near), (-2 * cp.far * cp.near) / (cp.far - cp.near),
            0, 0, -1, 0
        ]; //symmetric frustum

    } else {
        console.log(type + " is an invalid projection type. Choose parallel or perspective.")
    }

    return transposeMatrix4x4(uProjMatrix);
}