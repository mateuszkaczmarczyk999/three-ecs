import { Camera, OrthographicCamera, PerspectiveCamera } from "three";

export enum CameraCategory {
  Perspective = "Perspective",
  Orthographic = "Orthographic",
}

export interface CameraDefinition {
  category: CameraCategory;
  fov: number;
  aspect: number;
  near: number;
  far: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export class CameraFactory {
  public static createInstance(definition: CameraDefinition): Camera {
    switch (definition.category) {
      case CameraCategory.Perspective:
        return new PerspectiveCamera(
          definition.fov,
          definition.aspect,
          definition.near,
          definition.far
        );
      case CameraCategory.Orthographic:
        return new OrthographicCamera(
          definition.left,
          definition.right,
          definition.top,
          definition.bottom,
          definition.near,
          definition.far
        );
    }
  }
}
