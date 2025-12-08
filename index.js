
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(600, 400);
document.getElementById('model-container').appendChild(renderer.domElement);


let geometry = new THREE.BoxGeometry();

let cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
scene.add(cube);

// per face color
const colorMaterials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000}), // right 
    new THREE.MeshBasicMaterial({ color: 0x00ff00}), // Left 
    new THREE.MeshBasicMaterial({ color: 0x0000ff}), // Top 
    new THREE.MeshBasicMaterial({ color: 0xffff00}), // bottom
    new THREE.MeshBasicMaterial({ color: 0x00ffff}), // front 
    new THREE.MeshBasicMaterial({ color: 0xff00ff}), // back
];

// Outline

const edges = new THREE.EdgesGeometry(geometry);
let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6de8af }));
scene.add(line);

camera.position.z = 3;

//  color toggle
let isOriginalColor = true;
function toggleColorMode() {
    scene.remove(cube);

    if (isCube) {
        // Cube mode: use per-face colors OR white
        if (isOriginalColor) {
            cube = new THREE.Mesh(geometry, colorMaterials);
        } else {
            cube = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
        }
    } else {
        // Torus mode: always single-color
        cube = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({ color: isOriginalColor ? 0x00ff99 : 0xffffff })
        );
    }

    cube.rotation.copy(line.rotation);
    scene.add(cube);

    isOriginalColor = !isOriginalColor;
}
  
// wireFrame
function toggleWireFrameMode() {
    cube.material.wireframe =  !cube.material.wireframe;

}


//  cube / Doughnut ( torus)
let isCube = true;
function toggleShapeMode() {
    scene.remove(cube);
    scene.remove(line);

    if (isCube) {
        geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    } else {
        geometry = new THREE.BoxGeometry();
    }

    cube = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    const newEdges = new THREE.EdgesGeometry(geometry);
    line = new THREE.LineSegments(
        newEdges,
        new THREE.LineBasicMaterial({ color: 0x6de8af })
    );

    scene.add(cube);
    scene.add(line);

    isCube = !isCube;
}


function toggleLowPolyWireframe() {
    // Remove current objects
    scene.remove(cube);
    scene.remove(line);

    // Very low detail torus geometry
    geometry = new THREE.TorusGeometry(1, 0.3, 8, 16);

    // Invisible mesh (only wireframe will show)
    cube = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            visible: false 
        })
    );

    // Green neon outline
    const lowPolyEdges = new THREE.EdgesGeometry(geometry);
    line = new THREE.LineSegments(
        lowPolyEdges,
        new THREE.LineBasicMaterial({ color: 0x00ff99 })
    );

    scene.add(cube);
    scene.add(line);

    // Mark shape as torus
    isCube = false;
}

function toggleHighPolyWireframe() {
    scene.remove(cube);
    scene.remove(line);

    // High detail torus: more segments = smoother wireframe
    geometry = new THREE.TorusGeometry(1, 0.3, 40, 200);

    // Create invisible mesh (we only want the wireframe edges)
    cube = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            visible: false
        })
    );

    // GREEN neon wireframe
    const highPolyEdges = new THREE.EdgesGeometry(geometry);
    line = new THREE.LineSegments(
        highPolyEdges,
        new THREE.LineBasicMaterial({ color: 0x00ff99 })
    );

    scene.add(cube);
    scene.add(line);

    isCube = false;
}

//  background theme
let isDark = true;

function toggleTheme() {
    const body = document.body;

    if (isDark) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
    }

    isDark = !isDark;
}


let previousTime = 0;

function animate(time) {
    requestAnimationFrame(animate);

    // delta in seconds
    const delta = (time - previousTime) / 2000;
    previousTime = time;

    const rotationSpeed = 0.6; // matches original 0.01 per frame at 60fps

    cube.rotation.x += rotationSpeed * delta;
    cube.rotation.y += rotationSpeed * delta;
    line.rotation.x += rotationSpeed * delta;
    line.rotation.y += rotationSpeed * delta;

    renderer.render(scene, camera);
}

animate(0);