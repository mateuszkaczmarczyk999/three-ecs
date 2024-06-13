import { System } from "../../core/System";
import { ComponentType } from "../../core/Component";
import { Entity } from "../../core/Entity";
import { RenderableComponent } from "../components/Renderable";
import { Light } from "three";
import { LightComponent } from "../components/Light";
import { LightFactory } from "../../../framework/resource/Lights";

export class IlluminationSystem extends System {
  constructor() {
    super();
  }

  public initialize(): void {
    throw new Error("Method not implemented.");
  }

  public update(): void {
    this.entities.forEach((entity) => {
      const light = entity.getComponent<LightComponent>(ComponentType.Light);
      const renderable = entity.getComponent<RenderableComponent<Light>>(
        ComponentType.Renderable
      );

      const lightObject = LightFactory.createInstance(light.definition);

      renderable.object3D = lightObject;
    });
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponents(ComponentType.Light, ComponentType.Renderable);
  }
}
