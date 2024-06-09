import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";

export const GEOMETRY_RESOURCE = {
    "Box": new Mesh(new BoxGeometry(1, 1, 1)),
}

export const MATERIAL_RESOURCE = {
    "Standard": new MeshStandardMaterial({ color: 0xff0000 }),
}