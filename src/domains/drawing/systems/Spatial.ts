import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";

export class SpatialSystem extends System {

  constructor() { super() }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public update(): void {
    throw new Error("Method not implemented.");
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(ComponentType.Transform, ComponentType.Renderable);
  }
}
