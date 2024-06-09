import { System } from "../../core/System";
import { Entity } from "../../core/Entity";
import { ComponentType } from "../../core/Component";

export class AssetSystem extends System {

  constructor() { super() }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public update(): void {
    throw new Error("Method not implemented.");
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(ComponentType.Geometry, ComponentType.Material);
  }
}
