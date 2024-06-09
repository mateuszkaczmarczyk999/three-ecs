import { Entity } from "./Entity";

export abstract class System {
  protected readonly entities: Entity[] = [];

  public abstract initialize(): void;

  public abstract update(...args: any[]): void;

  public abstract appliesTo(entity: Entity): boolean;

  public addEntity(entity: Entity) {
    if (this.appliesTo(entity)) this.entities.push(entity);
    else throw new Error("Entity does not meet system requirements");
  }

  public removeEntity(entity: Entity) {
    const index = this.entities.indexOf(entity);
    this.entities.splice(index, 1);
  }
}
