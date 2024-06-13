import {
  BoxGeometry,
  BufferGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
} from "three";

export enum GeometryCategory {
  Box = "Box",
  Sphere = "Sphere",
  Plane = "Plane",
}

export enum MaterialCategory {
  Basic = "Basic",
  Standard = "Standard",
}

export interface AssetDefinition {
  geometry: GeometryCategory;
  material: MaterialCategory;
  color: number;
}

export class AssetFactory {
  private static _geometry: Record<GeometryCategory, () => BufferGeometry> = {
    Box: () => new BoxGeometry(),
    Sphere: () => new SphereGeometry(),
    Plane: () => new PlaneGeometry(10, 10),
  };

  private static _material: Record<MaterialCategory, () => Material> = {
    Basic: () => new MeshBasicMaterial(),
    Standard: () => new MeshStandardMaterial(),
  };

  public static createInstance(definition: AssetDefinition): Mesh {
    const geometry = this._geometry[definition.geometry]();
    const material = this._material[definition.material]() as MeshBasicMaterial;
    material.side = 2;

    material.color.setHex(definition.color);

    const mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }
}
