// import * as THREE from '../libs/three.js';
import {textures} from '../config/index.js';

const createEarth = () => {
    const sphere = new THREE.SphereGeometry(5, 40, 40);
    const material = createEarthMaterial();
    let earth = new THREE.Mesh(sphere, material);
    earth.name = 'earth';
    return earth;
};

/**
 * 创建地球材质
 */
const createEarthMaterial = () => {
    const earthCover = new THREE.TextureLoader().load(textures.earth_cover);
    const earthBump = new THREE.TextureLoader().load(textures.earth_bump);
    const earthSpec = new THREE.TextureLoader().load(textures.earth_spec);
    let material = new THREE.MeshPhongMaterial();
    material.transparent = true;
    material.map = earthCover; // 色彩贴图
    material.bumpMap = earthBump; // 凹凸纹理图
    material.bumpScale = 0.15;
    material.specularMap = earthSpec; // 镜面反射贴图
    material.specular = new THREE.Color('#909090'); // 材料光泽
    material.shininess = 5; // 高光
    return material;
};

export {
    createEarth
};
