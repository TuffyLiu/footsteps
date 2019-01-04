// import * as THREE from '../libs/three.js';

/**
 * [创建全局光源]
 */
const createAmbient = () => {
    let ambientLight = new THREE.AmbientLight(0x393939, 0.3);
    ambientLight.name = 'ambient';
    return ambientLight;
};

/**
 * [创建平行光源]
 */
const createDirectional = () => {
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.x = 0;
    directionalLight.position.y = 0;
    directionalLight.position.z = -500;
    directionalLight.intensity = 1;
    directionalLight.name = 'directional';
    return directionalLight;
};

/**
 * 创建点光源
 */
const createSpot = () => {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 1.2;
    spotLight.position.x = -26;
    spotLight.position.y = 11;
    spotLight.position.z = -11;
    spotLight.angle = 0.2;
    spotLight.castShadow = false;
    spotLight.penumbra = 0.4;
    spotLight.distance = 124;
    spotLight.decay = 1;
    spotLight.shadow.camera.near = 50;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 35;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.name = 'spotLight';
    return spotLight;
};

export {
    createAmbient,
    createDirectional,
    createSpot
};
