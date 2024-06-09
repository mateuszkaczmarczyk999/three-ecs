import { Component, ComponentType } from "../../core/Component";
import { VectorXYZ } from "../../types/Common";

export class TransformComponent extends Component {
  public readonly type = ComponentType.Transform;
  public position: VectorXYZ = { x: 0, y: 0, z: 0 };
  public rotation: VectorXYZ = { x: 0, y: 0, z: 0 };
  public scale: VectorXYZ = { x: 1, y: 1, z: 1 };
}
