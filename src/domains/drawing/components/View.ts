import { Component, ComponentType } from "../../core/Component";

export class ViewComponent extends Component {
  public readonly type = ComponentType.View;
  constructor(public active: boolean = true) {
    super();
  }
}
