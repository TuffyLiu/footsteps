// import * as THREE from '../libs/three.js';
import {textures} from '../config/index.js';

const createCloud = (radius, name) => {
    const cloudSphere = new THREE.SphereGeometry(radius, 40, 40);
    const cloudMaterial = createClodMaterial();
    let cloudMesh = new THREE.Mesh(cloudSphere, cloudMaterial);
    cloudMesh.name = name;
    return cloudMesh;
};
/**
 * 创建地球表面云材质
 */
const createClodMaterial = () => {
    const cloudTexture = new THREE.TextureLoader().load(textures.earth_cloud);
    let material = new THREE.MeshPhongMaterial();
    material.map = cloudTexture;
    material.transparent = true;
    material.opacity = 1;
    material.blending = THREE.AdditiveBlending;
    return material;
};

export {
    createCloud
};
