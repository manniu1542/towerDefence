import TowerBase from "./TowerBase";
import Enum from "../../utils/Enum";
import GameControl from "../../control/GameControl";
import MyUtils from "../../utils/MyUtils";
import TowerSeat from "../towerSeat/TowerSeat";


const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class Tower extends TowerBase {

    @property(cc.CircleCollider)
    colliderBody = new cc.CircleCollider();
    @property(cc.Button)
    btnControl = new cc.Button();;
    @property(cc.Node)
    cttControl = new cc.Node();;
    @property(cc.Button)
    btnUp = null;
    @property(cc.Button)
    btnRemove = null;


    _hp = 0; //血量
    _attackSpeed = 0;
    _harm = 0;
    _range = 0;
    _type = null; //炮台类型 

    onLoad() {

        MyUtils.clickEvent(this, this.btnControl, "onControl");
        MyUtils.clickEvent(this, this.btnRemove, "onRemove");
        MyUtils.clickEvent(this, this.btnUp, "onUp");
    }
    onDisable()
    {
        this.recover();
        GameControl.EventManager.removeEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE, this.cancelControl, this);



    }
    //恢复
    recover()
    {
       this._hp = 0; //血量
       this._attackSpeed = 0;
       this._harm = 0;
       this._range = 0;
       this._type = null; //炮台类型 
    }
    init(type, position) {
        this._type = type;
      
        this.baseAttributeAssign();

        switch (this._type) {
            case Enum.TOWER_TYPE.SLOW_BASE:


                break;
            case Enum.TOWER_TYPE.NORMAL_BASE:


                break;
            case Enum.TOWER_TYPE.BOOM_BASE:

                break;
            default:
                break;
        }


    }
    //基础属性的赋值
    baseAttributeAssign() {
        this.node.position = cc.Vec2.ZERO;
        let data = GameControl.ConfigManager.getTowersData(this._type)
        this._hp = data._hp;
        this._attackSpeed = data._attackSpeed;
        this._harm = data.harm;
        this._range = data.range;
        //初始化组件
        this.colliderBody.radius = this._range;
        this.cttControl.active = false;

    }
    //控制  
    onControl() {
        GameControl.EventManager.dispatchEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE);
        this.cttControl.active = true;
        GameControl.EventManager.registerEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE, this.cancelControl, this);
    }
    cancelControl() {
        this.cttControl.active = false;
        GameControl.EventManager.removeEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE, this.cancelControl, this);
    }
    //移除
    onRemove() {
        GameControl.EventManager.dispatchEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE);
        this.node.parent.getComponent(TowerSeat).setTowerSeatState();
        
        this.recover();
        GameControl.PoolManager.backPool(GameControl.UIManager.getScript("SceneFighting"),this.node);


    }
    //升级
    onUp() {
        console.log("升级");


    }

}