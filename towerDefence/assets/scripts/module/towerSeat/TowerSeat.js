import MyUtils from "../../utils/MyUtils";
import Enum from "../../utils/Enum";
import GameControl from "../../control/GameControl";
import SceneFighting from "../../view/scene/SceneFighting";
import Tower from "../battery/Tower";


const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class TowerSeat extends cc.Component {

    @property(cc.Button)
    btnResponse = new cc.Button();
    @property(cc.Button)
    btnSlow = null;
    @property(cc.Button)
    btnNormal = null;
    @property(cc.Button)
    btnBoom = null;
    @property(cc.Node)
    cttCreatorTower = new cc.Node();

    onLoad() {
        MyUtils.clickEvent(this, this.btnResponse, "onResponse");
        MyUtils.clickEvent(this, this.btnSlow, "onCreatorTower", Enum.TOWER_TYPE.SLOW_BASE);
        MyUtils.clickEvent(this, this.btnNormal, "onCreatorTower", Enum.TOWER_TYPE.NORMAL_BASE);
        MyUtils.clickEvent(this, this.btnBoom, "onCreatorTower", Enum.TOWER_TYPE.BOOM_BASE);
    }
    recover() {
        this.btnResponse.interactable = true;
        this.cttCreatorTower.active = false;
        this._haveTower=false;
        GameControl.EventManager.removeEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE, this.cancelResponse, this);

    }

    init(pos, parent = null) {
        this.recover();
        parent && (this.node.parent = parent);
        this.node.position = pos;
    }

    onResponse() {
        GameControl.EventManager.dispatchEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE);

        this.cttCreatorTower.active = true;
        GameControl.EventManager.registerEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE, this.cancelResponse, this);

    }
    cancelResponse() {
        this.cttCreatorTower.active = false;
        GameControl.EventManager.removeEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE, this.cancelResponse, this);
    }
    
    setTowerSeatState(bool)
    {
    
      this.recover();
    }

    onCreatorTower(clickInfo, type) {
        this.setTowerSeatState(false);
        this.btnResponse.interactable = false;
        this.cttCreatorTower.active = false;

        let sceneFighting = GameControl.UIManager.getScript("SceneFighting");
        GameControl.PoolManager.getNode(sceneFighting,
            Enum.POOL_NAME.TOWER,this.node).getComponent(Tower).init(type, this.node.position);

    }
}