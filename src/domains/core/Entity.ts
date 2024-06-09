import { Component, ComponentType } from "./Component";

export class Entity {
  private readonly _components: Map<ComponentType, Component> = new Map();

  constructor() {}

  public addComponent(component: Component): void {
    this._components.set(component.type, component);
  }

  public addComponents(...components: Component[]): void {
    components.forEach((component) => this.addComponent(component));
  }

  public hasComponent(componentType: ComponentType): boolean {
    return this._components.has(componentType);
  }

  public hasComponents(...componentTypes: ComponentType[]): boolean {
    return componentTypes.every((componentType) =>
      this.hasComponent(componentType)
    );
  }

  public removeComponent(componentType: ComponentType): void {
    if (!this._components.delete(componentType)) {
      throw new Error(`No component of type ${componentType}`);
    }
  }

  public removeComponents(...componentTypes: ComponentType[]): void {
    for (const componentType of componentTypes) {
      this.removeComponent(componentType);
    }
  }

  public getComponent<T extends Component>(componentType: ComponentType): T {
    if (!this.hasComponent(componentType))
      throw new Error(`No component of type ${componentType}`);
    return this._components.get(componentType) as T;
  }

  public getComponents<T extends Component>(...componentTypes: ComponentType[]): T[] {
    return componentTypes.map((componentType) =>
      this.getComponent(componentType)
    );
  }
}
