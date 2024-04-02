let scene = new THREE.Scene();
document.addEventListener('mousemove', onMouseMove, false);
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let mouseX;
let mouseY;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let distance = Math.min(200, window.innerWidth / 4);
let geometry = new THREE.Geometry();

for (let i = 0; i < 1600; i++) {

    let vertex = new THREE.Vector3();

    let theta = THREE.Math.randFloatSpread(360);
    let phi = THREE.Math.randFloatSpread(360);

    vertex.x = distance * Math.sin(theta) * Math.cos(phi);
    vertex.y = distance * Math.sin(theta) * Math.sin(phi);
    vertex.z = distance * Math.cos(theta);

    geometry.vertices.push(vertex);
}

let particles = new THREE.Points(geometry, new THREE.PointsMaterial({
    color: 0xff44ff,
    size: 2
}));
particles.boundingSphere = 50;

let renderingParent = new THREE.Group();
renderingParent.add(particles);

let resizeContainer = new THREE.Group();
resizeContainer.add(renderingParent);
scene.add(resizeContainer);

camera.position.z = 400;

let animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

let myTween;
function onMouseMove(event) {
    if (myTween)
        myTween.kill();

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    myTween = gsap.to(particles.rotation, { duration: 0.1, x: mouseY * -1, y: mouseX });
}

animate();

let animProps = { scale: 1, xRot: 0, yRot: 0 };
gsap.to(animProps, {
    duration: 10, scale: 1.3, repeat: -1, yoyo: true, ease: 'sine', onUpdate: function () {
        renderingParent.scale.set(animProps.scale, animProps.scale, animProps.scale);
    }
});

gsap.to(animProps, {
    duration: 120, xRot: Math.PI * 2, yRot: Math.PI * 4, repeat: -1, yoyo: true, ease: 'none', onUpdate: function () {
        renderingParent.rotation.set(animProps.xRot, animProps.yRot, 0);
    }
});
