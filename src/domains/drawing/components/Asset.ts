import { AssetDefinition } from "../../../framework/resource/Assets";
import { Component, ComponentType } from "../../core/Component";

export class AssetComponent extends Component {
  public readonly type = ComponentType.Asset;
  constructor(public definition: AssetDefinition) {
    super();
  }
}
