export abstract class Component {
  abstract type: ComponentType;
}

export enum ComponentType {
  Geometry = "Geometry",
  Material = "Material",
  Renderable = "Renderable",
  Transform = "Transform",
  Intersect = "Intersect",
  Motion = "Motion",
}
