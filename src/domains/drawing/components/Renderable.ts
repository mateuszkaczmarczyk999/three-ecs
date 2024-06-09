import { Component, ComponentType } from "../../core/Component";

export class RenderableComponent<T> extends Component {
  public readonly type = ComponentType.Renderable;
  public object3D: T | null = null;
}
