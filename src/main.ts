import {
  WebGLRenderer,
  PerspectiveCamera,
  BoxGeometry,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  Scene,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { setupGUI, loadConfig } from "./gui";

// Create the scene
const scene = new Scene();

async function init() {
  const params = await loadConfig();

  // Create a camera
  const camera = new PerspectiveCamera(
    params.camera.fov,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(
    params.camera.positionX,
    params.camera.positionY,
    params.camera.positionZ
  );

  // Create the renderer and attach it to the CANVAS div
  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadow mapping
  const canvasDiv = document.getElementById("CANVAS");
  if (canvasDiv) {
    canvasDiv.appendChild(renderer.domElement);
  }

  // Create a cube with MeshStandardMaterial
  const geometry = new BoxGeometry();
  const material = new MeshStandardMaterial({
    color: params.material.color,
    metalness: params.material.metalness,
    roughness: params.material.roughness,
  });
  const cube = new Mesh(geometry, material);
  cube.castShadow = true; // Enable casting shadows
  scene.add(cube);

  // Create a plane as ground
  const planeGeometry = new PlaneGeometry(10, 10);
  const planeMaterial = new MeshStandardMaterial({ color: 0x808080 });
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1;
  plane.receiveShadow = true; // Enable receiving shadows
  scene.add(plane);

  // Add a directional light for shadows
  const light = new DirectionalLight(0xffffff, params.light.intensity);
  light.position.set(
    params.light.positionX,
    params.light.positionY,
    params.light.positionZ
  );
  light.castShadow = true; // Enable casting shadows
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  // Add ambient light for better lighting
  const ambientLight = new AmbientLight(0x404040); // soft white light
  scene.add(ambientLight);

  // Add orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Setup GUI
  setupGUI(light, material, camera, params);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate the cube around the Y axis
    cube.rotation.y += 0.01;

    // Update the controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
  };

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Start the animation loop
  animate();
}

init();
