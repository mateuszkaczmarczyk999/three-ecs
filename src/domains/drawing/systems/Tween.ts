import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";
import { RenderableComponent } from "../components/Renderable";
import { Mesh } from "three";
import { TransformComponent } from "../components/Transform";
import { MotionComponent } from "../components/Motion";

export class TweenSystem extends System {
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
      const motion = entity.getComponent<MotionComponent>(ComponentType.Motion);

      transform.position.x += motion.positionIncrement.x;
      transform.position.y += motion.positionIncrement.y;
      transform.position.z += motion.positionIncrement.z;

      transform.rotation.x += motion.rotationIncrement.x;
      transform.rotation.y += motion.rotationIncrement.y;
      transform.rotation.z += motion.rotationIncrement.z;
    });
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(ComponentType.Transform, ComponentType.Motion);
  }
}
