import SceneBase from "./SceneBase";
import MyUtils from "../../utils/MyUtils";
import GameControl from "../../control/GameControl";
import Enum from "../../utils/Enum";

const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class SceneGame extends SceneBase {

    @property(cc.Button)
    btnStartGame = new cc.Button();
    @property(cc.Toggle)
    togMusic = new cc.Toggle();

    init() {
        MyUtils.clickEvent(this, this.btnStartGame, "onStartGame");
        MyUtils.clickEvent(this, this.togMusic, "onMusicSwitch");
     
    }

    show() {
        super.show();

    }
    close() {
        super.close();
    }

    onStartGame() {
        this.close();
        GameControl.UIManager.showUI(Enum.SCENE_PATH.SCENE_CUSTOM_PASS);
    }
    onMusicSwitch() {
        this.togMusic.isChecked ? GameControl.AudioManager.pauseAll() : GameControl.AudioManager.resumeAll();
    }
}