import PanelBase from "./PanelBase";
import Enum from "../../utils/Enum";
import MyUtils from "../../utils/MyUtils";
import GameControl from "../../control/GameControl";
import SceneFighting from "../scene/SceneFighting";


const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class PanelFightingStop extends PanelBase {

    @property(cc.Button)
    btnReopen = null;
    @property(cc.Button)
    btnManual = null;
    @property(cc.Button)
    btnBack = null;


    init() {
        this._panelShowWay = Enum.PANEL_SHOW_WAY.FADE_IN_OUT;
        MyUtils.clickEvent(this, this.btnBack, "onBack");
        MyUtils.clickEvent(this, this.btnManual, "onMannual");
        MyUtils.clickEvent(this, this.btnReopen, "onReopen");

    }

    show() {
        super.show();


    }

    close() {
        super.close();


    }

    onClosePanel() {
        console.log("关闭");
        this.close();

    }
    onBack() {
        this.onClosePanel();
        GameControl.UIManager.getScript("SceneFighting").close();
        GameControl.UIManager.showUI(Enum.SCENE_PATH.SCENE_CUSTOM_PASS);
    }
    onMannual() {

    }
    onReopen() {

    }

}