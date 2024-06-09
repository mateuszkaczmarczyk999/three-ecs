import { Component, ComponentType } from "../../core/Component";
import { VectorXYZ } from "../../types/Common";

export class MotionComponent extends Component {
  public readonly type = ComponentType.Motion;
  public positionIncrement: VectorXYZ = { x: 0, y: 0, z: 0 };
  public rotationIncrement: VectorXYZ = { x: 0, y: 0, z: 0 };
  public scaleIncrement: VectorXYZ = { x: 0, y: 0, z: 0 };
}
