const NUM_COORS = 3;
const SHAPE_SIDES = 3;

async function readPly(path) {
    return loadFileFromServer(path)
        .then(file => {

            let splitFile = file.split(/\r?\n?\s/);

            splitFile = splitFile.filter(function(x) {
                return x !== "";
            });

            let vertNum = parseInt(splitFile[splitFile.indexOf("vertex") + 1]);
            console.log(`There are ${vertNum} vertices.`)
            console.log(`There are ${splitFile[splitFile.indexOf("face") + 1]} faces.`)

            let indices = [];
            // adjacency array
            let vertTris = [];
            // triangle normals
            let triangles = [];

            let vertStart = splitFile.indexOf("end_header") + 1;

            let numAttributesToIgnore = (splitFile.indexOf("face") -
                (NUM_COORS - 1) - splitFile.indexOf("z")) / NUM_COORS;

            let result = readAndMakeVerts(vertStart, vertNum, numAttributesToIgnore, splitFile, []);
            let maxPoint = result.maxPoint;
            let verts = result.verts;

            let unitSpace = convertToUnitSpace(verts, maxPoint);

            let undefAdded = 0;

            let pos = 0;
            let startOfIndices = vertStart + (vertNum * (NUM_COORS + numAttributesToIgnore));
            for (let i = startOfIndices; i < splitFile.length; i++) {
                if (pos !== 0) {
                    //add index
                    indices.push(Number(splitFile[i]));
                }

                if (pos === SHAPE_SIDES) {
                    //if we just read the third triangle index

                    //get triangle vertices and add to adjacency array
                    let tri = [
                        getFromVerts(vertTris, unitSpace,
                            NUM_COORS * indices[indices.length - NUM_COORS],
                            triangles.length), //vert indices[i - 2]
                        getFromVerts(vertTris, unitSpace,
                            NUM_COORS * indices[indices.length - (NUM_COORS - 1)],
                            triangles.length), //vert indices[i - 1]
                        getFromVerts(vertTris, unitSpace,
                            NUM_COORS * indices[indices.length - (NUM_COORS - 2)],
                            triangles.length) //vert indices[i]
                    ];

                    //compute triangle normal
                    let norm = cramersRule(tri[0], tri[1], tri[2]);
                    norm = normalizeVect(norm);
                    triangles.push(norm);

                    pos = 0;
                } else {
                    pos++;
                    undefAdded++;
                }
            }

            let vertNorms = computeVertNorms(vertTris, triangles);

            verts = Float32Array.from(unitSpace);
            indices = Uint32Array.from(indices);
            vertNorms = Float32Array.from(vertNorms);

            return {verts: verts,
                indices: indices,
                normals: vertNorms};
        })
        .catch(err => {
            console.log("Error in PLY reader: " + err);
            throw Error("File cannot be read.");
        });
}

function readAndMakeVerts(vertStart, vertNum, numAttributesToIgnore, splitFile, verts) {
    let maxPoint = -Infinity;

    let vertPos = 0;
    let ignorePos = 0;

    for (let i = vertStart; i < (vertStart + (vertNum * (NUM_COORS + numAttributesToIgnore))); i++) {

        if (ignorePos < NUM_COORS) {
            verts.push(Number(splitFile[i]));

            if (vertPos === (NUM_COORS - 1)) {
                //if we just read the z coor, update the max point with all three coors in the vert if needed
                maxPoint = Math.max(maxPoint, splitFile[i - (NUM_COORS - 1)]);
                maxPoint = Math.max(maxPoint, splitFile[i - (NUM_COORS - 2)]);
                maxPoint = Math.max(maxPoint, splitFile[i]);

                //return the coordinate tracker to 0 (x)
                vertPos = 0;
            } else {
                vertPos++;
            }
        } else {
            //attribute ignored
        }

        if (ignorePos >= (2 + numAttributesToIgnore)) {
            ignorePos = 0;
        } else {
            ignorePos++;
        }

    }

    return {maxPoint: maxPoint, verts: verts};
}

function convertToUnitSpace(verts, maxPoint) {
    let unitSpace = [];
    for (let i = 0; i < verts.length; i++) {
        unitSpace.push(verts[i] / maxPoint);
    }
    return unitSpace;
}

function computeVertNorms(vertTris, triangles) {

    let vertNorms = [];

    for (let i = 0; i < vertTris.length + (NUM_COORS - 1); i++) {
        if (vertTris[i] === undefined) {
            continue;
        }

        let theseTriNorms = [];
        for (let j = 0; j < vertTris[i].length; j++) {
            theseTriNorms.push(triangles[vertTris[i][j]]);
        }

        let norm = getAvgOfPoint(theseTriNorms);

        vertNorms.push(norm.x);
        vertNorms.push(norm.y);
        vertNorms.push(norm.z);
    }

    return vertNorms;
}

function getFromVerts(vertTris, verts, coor1Index, triIndex) {
    if (vertTris[coor1Index] === undefined) {
        vertTris[coor1Index] = [triIndex];
    } else {
        vertTris[coor1Index].push(triIndex);
    }

    return {x: verts[coor1Index], y: verts[coor1Index + 1], z: verts[coor1Index + 2]}
}

