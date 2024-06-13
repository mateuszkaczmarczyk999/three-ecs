import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";
import { RenderableComponent } from "../components/Renderable";
import { Camera } from "three";
import { CameraComponent } from "../components/Camera";
import { CameraFactory } from "../../../framework/resource/Cameras";

export class FrameSystem extends System {
  constructor() {
    super();
  }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public update(): void {
    this.entities.forEach((entity) => {
      const camera = entity.getComponent<CameraComponent>(ComponentType.Camera);
      const renderable = entity.getComponent<RenderableComponent<Camera>>(
        ComponentType.Renderable
      );

      const cameraObject = CameraFactory.createInstance(camera.definition);

      renderable.object3D = cameraObject;
    });
  }

  public getCamera = (entity: Entity): Camera => {
    const renderable = entity.getComponent<RenderableComponent<Camera>>(
      ComponentType.Renderable
    );
    if (!renderable.object3D) throw new Error("No object3D found in RenderableComponent");
    return renderable.object3D!;
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(ComponentType.Camera, ComponentType.Renderable);
  }
}
