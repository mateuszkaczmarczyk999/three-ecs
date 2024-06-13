import { CameraDefinition } from "../../../framework/resource/Cameras";
import { Component, ComponentType } from "../../core/Component";

export class CameraComponent extends Component {
  public readonly type = ComponentType.Camera;
  constructor(public definition: CameraDefinition) {
    super();
  }
}
