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
import { setupGUI, loadConfig, GUIParams } from "./gui";
import { Entity } from "./domains/core/Entity";
import { TransformComponent } from "./domains/drawing/components/Transform";
import { GeometryComponent, GeometryDefinition } from "./domains/drawing/components/Geometry";
import { MaterialComponent, MaterialDefinition } from "./domains/drawing/components/Material";
import { RenderableComponent } from "./domains/drawing/components/Renderable";
import { SpatialSystem } from "./domains/drawing/systems/Spatial";
import { AssetSystem } from "./domains/drawing/systems/Asset";
import { LevelSystem } from "./domains/drawing/systems/Level";
import { TweenSystem } from "./domains/drawing/systems/Tween";
import { MotionComponent } from "./domains/drawing/components/Motion";


const createRenderer = () => {
  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadow mapping
  const canvasDiv = document.getElementById("CANVAS");
  if (canvasDiv) {
    canvasDiv.appendChild(renderer.domElement);
  }
  return renderer;
};

const createCamera = () => {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  return camera;
};

const createCubeMaterial = (params: GUIParams) => {
  return new MeshStandardMaterial({
    color: params.material.color,
    metalness: params.material.metalness,
    roughness: params.material.roughness,
  });
}

const creatPlaneMesh = () => {
  const planeGeometry = new PlaneGeometry(10, 10);
  const planeMaterial = new MeshStandardMaterial({ color: 0x808080 });
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1;
  plane.receiveShadow = true; // Enable receiving shadows
  return plane;
};

// Create the scene
const scene = new Scene();

const cubeEntity = new Entity();

const transformComponent = new TransformComponent();
const geometryComponent = new GeometryComponent();
const materialComponent = new MaterialComponent();
const renderableComponent = new RenderableComponent<Mesh>();
const motionComponent = new MotionComponent();
motionComponent.rotationIncrement = { x: 0.01, y: 0.01, z: 0.01 };

cubeEntity.addComponents(transformComponent, geometryComponent, materialComponent, renderableComponent, motionComponent);

const spatialSystem = new SpatialSystem();
spatialSystem.addEntity(cubeEntity);

const assetSystem = new AssetSystem();
assetSystem.addEntity(cubeEntity);

const levelSystem = new LevelSystem();
levelSystem.addEntity(cubeEntity);

const tweenSystem = new TweenSystem();
tweenSystem.addEntity(cubeEntity);


async function init() {
  const params = await loadConfig();

  // Create a camera
  const camera = createCamera();
  camera.position.set(
    params.camera.positionX,
    params.camera.positionY,
    params.camera.positionZ
  );

  // Create the renderer and attach it to the CANVAS div
  const renderer = createRenderer();

  // // Create a cube with MeshStandardMaterial
  // const geometry = new BoxGeometry();
  // const material = createCubeMaterial(params);
  // const cube = new Mesh(geometry, material);
  // cube.castShadow = true; // Enable casting shadows
  // scene.add(cube);

  assetSystem.update();
  levelSystem.update(scene);

  // Create a plane as ground
  const plane = creatPlaneMesh();
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
  // setupGUI(light, material, camera, params);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    tweenSystem.update();
    spatialSystem.update();

    controls.update();

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
