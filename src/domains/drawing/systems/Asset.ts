import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";
import { RenderableComponent } from "../components/Renderable";
import { Mesh } from "three";
import { GeometryComponent } from "../components/Geometry";
import { MaterialComponent } from "../components/Material";
import { GEOMETRY_RESOURCE, MATERIAL_RESOURCE } from "../../../framework/Resource";

export class AssetSystem extends System {
  constructor() {
    super();
  }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public update(): void {
    this.entities.forEach((entity) => {
      const geometry = entity.getComponent<GeometryComponent>(
        ComponentType.Geometry
      );
      const geometrySrc = GEOMETRY_RESOURCE["Box"];

      const material = entity.getComponent<MaterialComponent>(
        ComponentType.Material
      );
      const materialSrc = MATERIAL_RESOURCE["Standard"];
      materialSrc.color.setHex(material.color);

      const renderable = entity.getComponent<RenderableComponent<Mesh>>(
        ComponentType.Renderable
      );

      renderable.object3D = new Mesh(geometrySrc, materialSrc);
      renderable.object3D.castShadow = true;
    });
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(
      ComponentType.Transform,
      ComponentType.Renderable
    );
  }
}
