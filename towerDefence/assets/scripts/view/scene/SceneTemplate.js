import SceneBase from "./SceneBase";


const {ccclass, property} = cc._decorator;
@ccclass
export default class SceneTemplate extends SceneBase {

    @property(cc.Node)
    ee=null;//new cc.Node();
 
    init()
    {
        // this.registerEvent()  注册事件
    }

    show() {
        super.show();

    }
    close() {
        super.close();

    }

}
