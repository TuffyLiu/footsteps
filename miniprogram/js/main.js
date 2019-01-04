
import Earth from './earth-scene/index.js'
/**
 * 游戏主函数
 */

export default class Main {
    constructor() {
        this.aniId = 0;
        this.ctx = canvas.getContext('webgl');
        this.restart();
    }
    restart() {
        this.earth= new Earth(this.ctx);
        // this.earth.destroyScene();
        console.log(this.earth);
        this.animate();
    }
    animate() {
        window.cancelAnimationFrame(this.aniId);
        this.animate = this.animate.bind(this);
        this.earth.animate();
        this.aniId = window.requestAnimationFrame(this.animate);
    }
}
