import GameControl from "../../control/GameControl";
import CEvent from "../../utils/CEvent";
import MyUtils from "../../utils/MyUtils";
import Enum from "../../utils/Enum";


const {
	ccclass,
	property
} = cc._decorator;
@ccclass
export default class PanelBase extends CEvent {

	_init = false;
	_panelShowWay=Enum.PANEL_SHOW_WAY.DIRECT;//面板打开方式 
	//关闭按钮
	@property(cc.Button)
	btnClose = null;
	@property(cc.Sprite)
	imgBlackBg = null;
	@property(cc.Node)
	cttBody = null;
	baseInit() {
		if (this._init) return;
		this.init && this.init();
		this.btnClose && MyUtils.clickEvent(this, this.btnClose, "onClosePanel");
		(this._panelShowWay ==Enum.PANEL_SHOW_WAY.DIRECT)&&(this.imgBlackBg.enabled=false);
		this._init = true;
	}

	show() {
		this.baseInit();
		this.node.active = true;
		this.node.parent = GameControl.UIManager.cttPanelParent;
		switch (this._panelShowWay) {
			case Enum.PANEL_SHOW_WAY.DIRECT:

				break;
			case Enum.PANEL_SHOW_WAY.FADE_IN_OUT:
				this.cttBody.opacity = 0;
				this.cttBody.scaleX = 0;
				this.cttBody.scaleY = 0;
				let action = cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255));
				action.easing(cc.easeIn(3.0));
				this.cttBody.runAction(action);
				break;
			default:
				break;
		}



	}

	close() {
		// GameControl.AudioManager.playEffect();播放按钮 的音效
		switch (this._panelShowWay) {
			case Enum.PANEL_SHOW_WAY.DIRECT:
				this.node.removeFromParent(false);
				break;
			case Enum.PANEL_SHOW_WAY.FADE_IN_OUT:
				this.cttBody.stopAllActions();
				let action = cc.sequence(cc.spawn(cc.scaleTo(0.2, 0, 0), cc.fadeTo(0.2, 0)), cc.callFunc(() => {
					this.node.removeFromParent(false);
				}));
				action.easing(cc.easeOut(3.0));
				this.cttBody.runAction(action);
				break;
			default:
				break;
		}


	}




}