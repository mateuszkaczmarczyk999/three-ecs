import { Pane } from "tweakpane";
import {
  DirectionalLight,
  MeshStandardMaterial,
  PerspectiveCamera,
} from "three";

export interface GUIParams {
  light: {
    color: number;
    intensity: number;
    positionX: number;
    positionY: number;
    positionZ: number;
  };
  material: {
    color: number;
    metalness: number;
    roughness: number;
  };
  camera: {
    fov: number;
    positionX: number;
    positionY: number;
    positionZ: number;
  };
}

export async function loadConfig(): Promise<GUIParams> {
  const defaultConfig = await loadJSON("/src/default-config.json");
  try {
    const userConfig = await loadJSON("/src/config.json");
    return { ...defaultConfig, ...userConfig };
  } catch {
    return defaultConfig;
  }
}

async function loadJSON(url: string): Promise<any> {
  const response = await fetch(url);
  return response.json();
}

export function setupGUI(
  light: DirectionalLight,
  material: MeshStandardMaterial,
  camera: PerspectiveCamera,
  params: GUIParams
) {
  const pane = new Pane();

  const lightFolder = pane.addFolder({ title: "Light" });
  lightFolder
    .addBinding(params.light, "color", { view: "color" })
    .on("change", (ev) => {
      light.color.set(ev.value as number);
    });
  lightFolder
    .addBinding(params.light, "intensity", { min: 0, max: 10 })
    .on("change", (ev) => {
      light.intensity = ev.value as number;
    });
  lightFolder
    .addBinding(params.light, "positionX", { min: -10, max: 10 })
    .on("change", (ev) => {
      light.position.x = ev.value as number;
    });
  lightFolder
    .addBinding(params.light, "positionY", { min: -10, max: 10 })
    .on("change", (ev) => {
      light.position.y = ev.value as number;
    });
  lightFolder
    .addBinding(params.light, "positionZ", { min: -10, max: 10 })
    .on("change", (ev) => {
      light.position.z = ev.value as number;
    });

  const materialFolder = pane.addFolder({ title: "Material" });
  materialFolder
    .addBinding(params.material, "color", { view: "color" })
    .on("change", (ev) => {
      material.color.set(ev.value as number);
    });
  materialFolder
    .addBinding(params.material, "metalness", { min: 0, max: 1 })
    .on("change", (ev) => {
      material.metalness = ev.value as number;
    });
  materialFolder
    .addBinding(params.material, "roughness", { min: 0, max: 1 })
    .on("change", (ev) => {
      material.roughness = ev.value as number;
    });

  const cameraFolder = pane.addFolder({ title: "Camera" });
  cameraFolder
    .addBinding(params.camera, "fov", { min: 10, max: 120 })
    .on("change", (ev) => {
      camera.fov = ev.value as number;
      camera.updateProjectionMatrix();
    });
  cameraFolder
    .addBinding(params.camera, "positionX", { min: -10, max: 10 })
    .on("change", (ev) => {
      camera.position.x = ev.value as number;
    });
  cameraFolder
    .addBinding(params.camera, "positionY", { min: -10, max: 10 })
    .on("change", (ev) => {
      camera.position.y = ev.value as number;
    });
  cameraFolder
    .addBinding(params.camera, "positionZ", { min: -10, max: 10 })
    .on("change", (ev) => {
      camera.position.z = ev.value as number;
    });

  pane.addButton({ title: "Export Config" }).on("click", () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(params));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "config.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });
}
