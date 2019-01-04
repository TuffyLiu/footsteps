GameGlobal.ImageBitmap = function() {};
import * as THREE from '../libs/three.js';
GameGlobal.THREE = THREE;
require('../libs/CopyShader.js');
require( '../libs/EffectComposer.js');
require( '../libs/ShaderPass.js');
require( '../libs/OrbitControls.js');
require( '../libs/RenderPass.js');
import {createEarth} from './earth.js';
import {createAmbient, createSpot } from './light.js';
import {createCloud} from './cloud.js';
import { createOuterGlow, AdditiveBlendShader } from './glow.js';
import {textures} from '../config/index.js';

export default class Earth {
    constructor(ctx) {
        console.log(ctx);

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.rotSpeed = 0.001;
        this.count = 0;
        // this.ctx = canvas.getContext('webgl');
        this.ctx = ctx;
        this.touch = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.scopeIndex = 0;
        this.rotAuto = true;
        this.destroy = false;
        this.init();
    }
    init() {
        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 36; // 40 fit

        this.cameraSprite = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
        this.cameraSprite.position.z = 26; // 40 fit
        this.cameraSprite.position.y = 1; // 40 fit
        // this.camera.position.set( 0, 20, 100 );
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // camera.add(this.createSpot());
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            context: this.ctx,
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        this.renderer.autoClear = true;
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.width, this.height);

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.rotateSpeed = 0.3;
        this.controls.autoRotate = false; // 自转禁止
        this.controls.enableZoom = false; // 禁止缩放
        this.controls.enablePan = false; // 禁止使用相机平移
        this.controls.enabled = true;
        // this.controls.minDistance = 100;


        this.group = new THREE.Group();
        this.scene.add(this.group);

        const pointsGroup = new THREE.Group();
        pointsGroup.name = 'pointsGroup';
        this.group.add(pointsGroup);
        this.group.rotation.y = 2 * Math.PI;

        this.earth = createEarth();
        this.cloud1 = createCloud(5.1, 'cloud1');
        this.cloud2 = createCloud(5.2, 'cloud2');
        this.cloud2.rotation.y = Math.PI;

        this.group.add(this.earth);
        this.group.add(this.cloud1);
        this.group.add(this.cloud2);


        this.scene.add(createAmbient());
        this.spotLight = createSpot();
        this.camera.add(this.spotLight);
        this.scene.add(this.camera);


        this.sceneSprite = new THREE.Scene();
        this.sprite = this.createSprite();
        this.sceneSprite.add(this.sprite);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false

        canvas.addEventListener(
            'touchend',
            this.rotationEndHandler.bind(this));
        this.createOuterFlow();
        this.animate();
    }
    destroyScene() {
        this.destroy = true;
        console.log(this.scene);
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        this.renderer.render(this.sceneSprite, this.cameraSprite);
    }
    animate() {
        if (this.controls) {
            this.controls.update();
        }
        this.cloud1.rotation.y -= this.rotSpeed / 4;
        this.cloud2.rotation.y -= this.rotSpeed / 4;

        if (this.rotAuto) {
            this.rotAutoHandler();
        }
        this.render();
        // this.renderer.render(this.scene, this.camera);
        // this.renderer.render(this.sceneSprite, this.cameraSprite);
    }
    createSprite() {
        const spriteMap = new THREE.TextureLoader().load( textures.bg_index_cover );
        const spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        const sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(10, 16, 1);
        return sprite;
    }
    createOuterFlow() {
        this.blurScene = new THREE.Scene();
        this.glowGroup = createOuterGlow();
        this.blurScene.add(this.glowGroup);
        const renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: true
        };
        const blurRenderTarget = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParameters);
        const blurRenderPass = new THREE.RenderPass(this.blurScene, this.camera);
        const sceneRenderPass = new THREE.RenderPass(this.scene, this.camera);
        this.blurComposer = new THREE.EffectComposer(this.renderer, blurRenderTarget);

        this.blurComposer.addPass(blurRenderPass);

        this.sceneComposer = new THREE.EffectComposer(this.renderer, blurRenderTarget);

        this.sceneComposer.addPass(sceneRenderPass);

        const effectBlend = new THREE.ShaderPass(AdditiveBlendShader, 'tSampler1');

        effectBlend.uniforms['tSampler2'].value = this.blurComposer.renderTarget2.texture;

        effectBlend.renderToScreen = true;

        this.sceneComposer.addPass(effectBlend);
    }
    rotAutoHandler() {
        this.camera.position.x = this.camera.position.x * Math.cos(this.rotSpeed) - this.camera.position.z * Math.sin(this.rotSpeed);

        this.camera.position.z = this.camera.position.z * Math.cos(this.rotSpeed) + this.camera.position.x * Math.sin(this.rotSpeed);

        this.count++;
        // 隔100ms检测
        if (this.count % 100 === 0) {

            this.count = 0;

            this.rotationEndHandler();
        }
    }
    rotationEndHandler(e) {
        // console.log(e);
        // if (e) {
        //     e.preventDefault && e.preventDefault();
        // }
        this.touch.x = Math.round(window.innerWidth / 2) / window.innerWidth * 2 - 1;
        this.touch.y = -(Math.round(window.innerHeight / 2) / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.touch, this.camera);
        const intersected = this.raycaster.intersectObject(this.earth);
        if (intersected && intersected.length > 0) {

        }

    }

}
