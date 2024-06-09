import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";
import { RenderableComponent } from "../components/Renderable";
import { Mesh } from "three";
import { TransformComponent } from "../components/Transform";

export class SpatialSystem extends System {
  constructor() {
    super();
  }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public update(): void {
    this.entities.forEach((entity) => {
      const transform = entity.getComponent<TransformComponent>(
        ComponentType.Transform
      );
      const renderable = entity.getComponent<RenderableComponent<Mesh>>(
        ComponentType.Renderable
      );

      if (!renderable.object3D)
        throw new Error("No object3D found in RenderableComponent");

      renderable.object3D.position.set(
        transform.position.x,
        transform.position.y,
        transform.position.z
      );
      renderable.object3D.rotation.set(
        transform.rotation.x,
        transform.rotation.y,
        transform.rotation.z
      );
    });
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(
      ComponentType.Transform,
      ComponentType.Renderable
    );
  }
}
