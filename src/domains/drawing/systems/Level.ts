import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";
import { RenderableComponent } from "../components/Renderable";
import { Mesh, Scene } from "three";

export class LevelSystem extends System {
  private _scene: Scene = new Scene();

  constructor() {
    super();
  }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public getScene = () => this._scene;

  public update(): void {
    this.entities.forEach((entity) => {
      const renderable = entity.getComponent<RenderableComponent<Mesh>>(
        ComponentType.Renderable
      );
      if (!renderable.object3D) throw new Error("No object3D found in RenderableComponent");
      this._scene.add(renderable.object3D!);
    });
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(
      ComponentType.Renderable,
      ComponentType.View
    );
  }
}
