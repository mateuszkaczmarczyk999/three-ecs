import { BufferGeometry, Camera, MeshDepthMaterialParameters, MeshDepthMaterial, MeshStandardMaterial, MeshStandardMaterialParameters, Object3D, Scene, ShaderLib, UniformsUtils, WebGLRenderer } from "three";


export class CustomDepthShaderMaterial extends MeshDepthMaterial {
    uniforms: any;
    constructor(parameters: MeshDepthMaterialParameters) {
        super(parameters);

        this.uniforms = UniformsUtils.merge([
            ShaderLib.standard.uniforms,
            {
                lengthX: { value: 0.0 },
                lengthZ: { value: 0.0 }
            }
        ]);

        // Add a custom attribute to distinguish vertex groups
        this.onBeforeCompile = (shader) => {
            shader.uniforms.lengthX = this.uniforms.lengthX;
            shader.uniforms.lengthZ = this.uniforms.lengthZ;

            shader.vertexShader = `
                uniform float lengthX;
                uniform float lengthZ;
                varying vec2 vUv;

                ${shader.vertexShader}
            `.replace(
                '#include <begin_vertex>',
                `

                vec3 transformed = vec3(position);
                if (transformed.x > 0.0) {
                    transformed.x += lengthX;
                }
                if (transformed.x < 0.0) {
                    transformed.x -= lengthX;
                }
                if (transformed.z > 0.0) {
                    transformed.z += lengthZ;
                }
                if (transformed.z < 0.0) {
                    transformed.z -= lengthZ;
                }

                `
            );
        };
    }

    // Update the material when needed
    customProgramCacheKey() {
        return this.type;
    }

    onBeforeRender(
        renderer: WebGLRenderer,
        scene: Scene,
        camera: Camera,
        geometry: BufferGeometry,
        object: Object3D) {
        if (this.userData.shader) {
            this.userData.shader.uniforms.time.value = performance.now() / 1000;
        }
    }
}

export class CustomShaderMaterial extends MeshStandardMaterial {
    uniforms: any;
    constructor(parameters: MeshStandardMaterialParameters) {
        super(parameters);

        this.uniforms = UniformsUtils.merge([
            ShaderLib.standard.uniforms,
            {
                lengthX: { value: 0.0 },
                lengthZ: { value: 0.0 }
            }
        ]);

        // Add a custom attribute to distinguish vertex groups
        this.onBeforeCompile = (shader) => {
            shader.uniforms.lengthX = this.uniforms.lengthX;
            shader.uniforms.lengthZ = this.uniforms.lengthZ;

            shader.vertexShader = `
                uniform float lengthX;
                uniform float lengthZ;
                varying vec2 vUv;

                ${shader.vertexShader}
            `.replace(
                '#include <begin_vertex>',
                `

                vec3 transformed = vec3(position);
                if (transformed.x > 0.0) {
                    transformed.x += lengthX;
                }
                if (transformed.x < 0.0) {
                    transformed.x -= lengthX;
                }
                if (transformed.z > 0.0) {
                    transformed.z += lengthZ;
                }
                if (transformed.z < 0.0) {
                    transformed.z -= lengthZ;
                }

                vUv = uv;
                `
            );
        };
    }

    // Update the material when needed
    customProgramCacheKey() {
        return this.type;
    }

    onBeforeRender(
        renderer: WebGLRenderer,
        scene: Scene,
        camera: Camera,
        geometry: BufferGeometry,
        object: Object3D) {
        if (this.userData.shader) {
            this.userData.shader.uniforms.time.value = performance.now() / 1000;
        }
    }
}
