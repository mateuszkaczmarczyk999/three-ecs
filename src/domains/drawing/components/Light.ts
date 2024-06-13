import { LightDefinition } from "../../../framework/resource/Lights";
import { Component, ComponentType } from "../../core/Component";

export class LightComponent extends Component {
  public readonly type = ComponentType.Light;
  constructor(public definition: LightDefinition) {
    super();
  }
}
