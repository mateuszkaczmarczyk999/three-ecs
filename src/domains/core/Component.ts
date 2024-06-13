export abstract class Component {
  abstract type: ComponentType;
}

export enum ComponentType {
  Asset = "Asset",
  Camera = "Camera",
  Light = "Light",
  View = "View",
  Renderable = "Renderable",
  Transform = "Transform",
  Intersect = "Intersect",
  Motion = "Motion",
}
