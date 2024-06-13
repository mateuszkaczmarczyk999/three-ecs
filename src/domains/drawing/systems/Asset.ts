import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";
import { RenderableComponent } from "../components/Renderable";
import { Mesh } from "three";
import { AssetComponent } from "../components/Asset";
import { AssetFactory } from "../../../framework/resource/Assets";

export class AssetSystem extends System {
  constructor() {
    super();
  }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public update(): void {
    this.entities.forEach((entity) => {
      const asset = entity.getComponent<AssetComponent>(ComponentType.Asset);
      const renderable = entity.getComponent<RenderableComponent<Mesh>>(
        ComponentType.Renderable
      );

      const mesh = AssetFactory.createInstance(asset.definition);

      renderable.object3D = mesh;
    });
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(
      ComponentType.Asset,
      ComponentType.Renderable
    );
  }
}
