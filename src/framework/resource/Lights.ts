import { AmbientLight, DirectionalLight, Light } from "three";

export enum LightCategory {
  Ambient = "Ambient",
  Directional = "Directional",
}

export interface LightDefinition {
  category: LightCategory;
  color: number;
  intensity: number;
}

export class LightFactory {
  public static createInstance(definition: LightDefinition): Light {
    switch (definition.category) {
      case LightCategory.Ambient:
        return new AmbientLight(definition.color);
      case LightCategory.Directional:
        const light = new DirectionalLight(definition.color, definition.intensity);
        light.castShadow = true;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 25;
        return light;
    }
  }
}
