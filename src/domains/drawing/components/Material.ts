import { Component, ComponentType } from "../../core/Component";

export class MaterialComponent extends Component {
  public readonly type = ComponentType.Material;
  public definition: MaterialDefinition = MaterialDefinition.Basic;
  public color: number = 0xff8080;
}

export enum MaterialDefinition {
  Basic = "Basic",
  Phong = "Phong",
  Standard = "Standard",
  Lambert = "Lambert",
  Physical = "Physical",
}
