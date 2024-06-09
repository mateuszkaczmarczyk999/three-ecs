import { Component, ComponentType } from "../../core/Component";

export class GeometryComponent extends Component {
  public readonly type = ComponentType.Geometry;
  public definition: GeometryDefinition = GeometryDefinition.Box;
}

export enum GeometryDefinition {
  Box = "Box",
  Sphere = "Sphere",
  Cylinder = "Cylinder",
  Cone = "Cone",
  Plane = "Plane",
  Torus = "Torus",
  TorusKnot = "TorusKnot",
  Circle = "Circle",
  Ring = "Ring",
  Line = "Line",
  Points = "Points",
  Text = "Text",
}
