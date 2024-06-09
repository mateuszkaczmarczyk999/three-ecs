import { Entity } from "./Entity";

export abstract class  System {
    protected readonly entities: Entity[] = []

    public abstract initialize(): void;

    public abstract update(): void;

    public abstract appliesTo(entity: Entity): boolean

    public addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    public removeEntity(entity: Entity) {
        const index = this.entities.indexOf(entity);
        this.entities.splice(index, 1);
    }
}
