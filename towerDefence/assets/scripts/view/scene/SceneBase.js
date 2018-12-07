import GameControl from "../../control/GameControl";
import CEvent from "../../utils/CEvent";


const {
	ccclass,
	property
} = cc._decorator;
@ccclass
export default class SceneBase extends CEvent {


	_init = false;

	baseInit() {
		if(this._init)return;
		this._init = true;
		this.init && this.init();
	}
	/**
	 *  
	 * @param {*} lateInitFun   是完全完成初始化后 的方法。 
	 */
	show(info) {
		this.baseInit();
		this.recaver&&this.recaver(); //变量的恢复初始值
		this.node.parent = GameControl.UIManager.cttSceneParent;
		GameControl.UIManager.push(this.node);
		info && info.fun.call(this, info.data);
	}

	back() {
		this.node.removeFromParent(false);
		GameControl.UIManager.pop();
	}

	close() {
		this.recaver&&this.recaver();
		this.node.removeFromParent(false);
		GameControl.UIManager.deleteByName(this.node.name);
	}
    


}