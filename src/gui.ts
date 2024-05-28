import { Pane } from 'tweakpane';
import * as THREE from 'three';

interface GUIParams {
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

export function setupGUI(light: THREE.DirectionalLight, material: THREE.MeshStandardMaterial, camera: THREE.PerspectiveCamera) {
  const params: GUIParams = {
    light: {
      color: light.color.getHex(),
      intensity: light.intensity,
      positionX: light.position.x,
      positionY: light.position.y,
      positionZ: light.position.z,
    },
    material: {
      color: material.color.getHex(),
      metalness: material.metalness,
      roughness: material.roughness,
    },
    camera: {
      fov: camera.fov,
      positionX: camera.position.x,
      positionY: camera.position.y,
      positionZ: camera.position.z,
    },
  };

  const pane = new Pane();

  const lightFolder = pane.addFolder({ title: 'Light' });
  lightFolder.addBinding(params.light, 'color', { view: 'color' }).on('change', (ev) => {
    light.color.set(ev.value as number);
  });
  lightFolder.addBinding(params.light, 'intensity', { min: 0, max: 10 }).on('change', (ev) => {
    light.intensity = ev.value as number;
  });
  lightFolder.addBinding(params.light, 'positionX', { min: -10, max: 10 }).on('change', (ev) => {
    light.position.x = ev.value as number;
  });
  lightFolder.addBinding(params.light, 'positionY', { min: -10, max: 10 }).on('change', (ev) => {
    light.position.y = ev.value as number;
  });
  lightFolder.addBinding(params.light, 'positionZ', { min: -10, max: 10 }).on('change', (ev) => {
    light.position.z = ev.value as number;
  });

  const materialFolder = pane.addFolder({ title: 'Material' });
  materialFolder.addBinding(params.material, 'color', { view: 'color' }).on('change', (ev) => {
    material.color.set(ev.value as number);
  });
  materialFolder.addBinding(params.material, 'metalness', { min: 0, max: 1 }).on('change', (ev) => {
    material.metalness = ev.value as number;
  });
  materialFolder.addBinding(params.material, 'roughness', { min: 0, max: 1 }).on('change', (ev) => {
    material.roughness = ev.value as number;
  });

  const cameraFolder = pane.addFolder({ title: 'Camera' });
  cameraFolder.addBinding(params.camera, 'fov', { min: 10, max: 120 }).on('change', (ev) => {
    camera.fov = ev.value as number;
    camera.updateProjectionMatrix();
  });
  cameraFolder.addBinding(params.camera, 'positionX', { min: -10, max: 10 }).on('change', (ev) => {
    camera.position.x = ev.value as number;
  });
  cameraFolder.addBinding(params.camera, 'positionY', { min: -10, max: 10 }).on('change', (ev) => {
    camera.position.y = ev.value as number;
  });
  cameraFolder.addBinding(params.camera, 'positionZ', { min: -10, max: 10 }).on('change', (ev) => {
    camera.position.z = ev.value as number;
  });
}
