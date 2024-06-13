import {
  WebGLRenderer,
  PerspectiveCamera,
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
import { RenderableComponent } from "./domains/drawing/components/Renderable";
import { SpatialSystem } from "./domains/drawing/systems/Spatial";
import { AssetSystem } from "./domains/drawing/systems/Asset";
import { LevelSystem } from "./domains/drawing/systems/Level";
import { AssetComponent } from "./domains/drawing/components/Asset";
import { GeometryCategory, MaterialCategory } from "./framework/resource/Assets";
import { ViewComponent } from "./domains/drawing/components/View";
import { FrameSystem } from "./domains/drawing/systems/Frame";
import { CameraComponent } from "./domains/drawing/components/Camera";
import { CameraCategory } from "./framework/resource/Cameras";
import { LightComponent } from "./domains/drawing/components/Light";
import { LightCategory } from "./framework/resource/Lights";
import { IlluminationSystem } from "./domains/drawing/systems/Illumination";


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

const cubeEntity = new Entity();
const cubeTransformComponent = new TransformComponent();
const cubeAssetComponent = new AssetComponent({
  geometry: GeometryCategory.Sphere,
  material: MaterialCategory.Standard,
  color: 0x0000ff,
});
const cubeRenderableComponent = new RenderableComponent<Mesh>();
const cubeViewComponent = new ViewComponent();

cubeEntity.addComponents(cubeTransformComponent, cubeAssetComponent, cubeRenderableComponent, cubeViewComponent);

const planeEntity = new Entity();
const planeTransformComponent = new TransformComponent();
planeTransformComponent.rotation.x = Math.PI / 2;
planeTransformComponent.position.y = -1;
const planeAssetComponent = new AssetComponent({
  geometry: GeometryCategory.Plane,
  material: MaterialCategory.Standard,
  color: 0x808080,
});
const planeRenderableComponent = new RenderableComponent<Mesh>();
const planeViewComponent = new ViewComponent();

planeEntity.addComponents(planeTransformComponent, planeAssetComponent, planeRenderableComponent, planeViewComponent);

const dirLightEntity = new Entity();
const dirLightTransformComponent = new TransformComponent();
dirLightTransformComponent.position.z = 7.5;
dirLightTransformComponent.position.y = 10;
dirLightTransformComponent.position.x = 5;
const dirLightObjectComponent = new LightComponent({
  category: LightCategory.Directional,
  color: 0xffffff,
  intensity: 1,
});
const dirLightRenderableComponent = new RenderableComponent<DirectionalLight>();
const dirLightViewComponent = new ViewComponent();

dirLightEntity.addComponents(dirLightTransformComponent, dirLightObjectComponent, dirLightRenderableComponent, dirLightViewComponent);

const ambientLightEntity = new Entity();
const ambientLightTransformComponent = new TransformComponent();
const ambientLightObjectComponent = new LightComponent({
  category: LightCategory.Ambient,
  color: 0x404040,
  intensity: 1,
});
const ambientLightRenderableComponent = new RenderableComponent<AmbientLight>();
const ambientLightViewComponent = new ViewComponent();

ambientLightEntity.addComponents(ambientLightTransformComponent, ambientLightObjectComponent, ambientLightRenderableComponent, ambientLightViewComponent);


const cameraEntity = new Entity();
const cameraTransformComponent = new TransformComponent();
cameraTransformComponent.position.z = 5;
cameraTransformComponent.position.y = 4;
cameraTransformComponent.position.x = 0;
const cameraComponent = new CameraComponent({
  category: CameraCategory.Perspective,
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});
const cameraRenderableComponent = new RenderableComponent<PerspectiveCamera>();

cameraEntity.addComponents(cameraTransformComponent, cameraComponent, cameraRenderableComponent);

const frameSystem = new FrameSystem();
frameSystem.addEntity(cameraEntity);

const illuminationSystem = new IlluminationSystem();
illuminationSystem.addEntity(dirLightEntity);
illuminationSystem.addEntity(ambientLightEntity);

const assetSystem = new AssetSystem();
assetSystem.addEntity(cubeEntity);
assetSystem.addEntity(planeEntity);

const spatialSystem = new SpatialSystem();
spatialSystem.addEntity(cubeEntity);
spatialSystem.addEntity(planeEntity);
spatialSystem.addEntity(dirLightEntity);
spatialSystem.addEntity(ambientLightEntity);
spatialSystem.addEntity(cameraEntity);

const levelSystem = new LevelSystem();
levelSystem.addEntity(cubeEntity);
levelSystem.addEntity(planeEntity);
levelSystem.addEntity(dirLightEntity);
levelSystem.addEntity(ambientLightEntity);



async function init() {
  const params = await loadConfig();

  const renderer = createRenderer();

  frameSystem.update();
  illuminationSystem.update();
  assetSystem.update();

  spatialSystem.update();
  levelSystem.update();

  const camera = frameSystem.getCamera(cameraEntity) as PerspectiveCamera;
  const scene = levelSystem.getScene();

  const controls = new OrbitControls(camera, renderer.domElement);

  // Setup GUI
  // setupGUI(light, material, camera, params);

  const animate = () => {
    requestAnimationFrame(animate);

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
