import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";
import { RenderableComponent } from "../components/Renderable";
import { Mesh, Scene } from "three";

export class LevelSystem extends System {
  constructor() {
    super();
  }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public update(scene: Scene): void {
    this.entities.forEach((entity) => {
      const renderable = entity.getComponent<RenderableComponent<Mesh>>(
        ComponentType.Renderable
      );
      if (!renderable.object3D) throw new Error("No object3D found in RenderableComponent");
      scene.add(renderable.object3D!);
    });
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(
      ComponentType.Renderable
    );
  }
}
