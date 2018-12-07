import SceneBase from "./SceneBase";
import PowerSeat from "../../module/powerSeat/PowerSeat";
import GameControl from "../../control/GameControl";
import PoolManager from "../../manager/PoolManager";
import Enum from "../../utils/Enum";
import TowerSeat from "../../module/towerSeat/TowerSeat";
import MyUtils from "../../utils/MyUtils";
import Enemy from "../../module/enemy/Enemy";
import Tower from "../../module/battery/Tower";



const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class SceneFighting extends SceneBase {
    @property(cc.Button)
    btnNextMinutia = new cc.Button();
    @property(cc.Button)
    btnAddSpeedFight = null; // new cc.Button();
    @property(cc.Button)
    btnStop = new cc.Button();
    @property(cc.Label)
    labMinutiaTip = new cc.Label();
    @property(PowerSeat)
    scrPowerSeat = new PowerSeat();
    @property(cc.Sprite)
    cImgMap = null;
    @property(cc.Node)
    cttTowerSeat = new cc.Node();
    @property(cc.Node)
    cttTower = null;
    @property(cc.Node)
    cttEnemy = new cc.Node();
    @property(cc.Button)
    btnMinutia = new cc.Button();

    init() {
        MyUtils.clickEvent(this, this.btnAddSpeedFight, "onAddSpeedFight");
        MyUtils.clickEvent(this, this.btnStop, "onStop");
        MyUtils.clickEvent(this, this.btnNextMinutia, "onNextMinutia");
        MyUtils.clickEvent(this, this.btnMinutia, "onNextMinutia");

    }
    recaver() {
        this.mapInfo = null; //地图信息
        this.minutiaCount = 0; //小节计数
        this.clearMapObj(); //清除地图物体
        this.arrClickMinutia = []; //是否 点击 小节的记录
        this.currentMinutia = null; //当前 小节

    }
    show(mapInfo) {
        super.show();
        if (!(Object.keys(Enum.MAP_INFO)).includes(String(mapInfo.id))) {
            console.error("transform parameter : this.mapInfo  error");
            return
        }
        this.mapInfo = mapInfo;
        this.cImgMap.node.on(cc.Node.EventType.TOUCH_START, this.cancelTowerSeatResponse, this);
        this.testMapLoadObjToPool().then(() => {
            this.creatorMapObj()
        }).catch(err => console.error(err));


    }
    close() {
        super.close();
        this.cImgMap.node.off(cc.Node.EventType.TOUCH_START, this.cancelTowerSeatResponse, this);
    }
    //取消防御塔的响应
    cancelTowerSeatResponse() {
        GameControl.EventManager.dispatchEvent(Enum.EVENT_TYPE.CANCEL_TOWER_SEAT_RESPONSE);
    }

    //清除 地图物体
    clearMapObj() {
        if (!this.cttTowerSeat.children.length) return; // 证明 还没有 load 完成
        let poolMgr = GameControl.PoolManager,
            arrTowerSeat = this.cttTowerSeat.children,
            arrEnemy = this.cttEnemy.children;
        for (let i = arrTowerSeat.length - 1; i >= 0; --i) {
            let tower = arrTowerSeat[i].getComponentInChildren(Tower)
            tower && poolMgr.backPool(this, tower.node);
            poolMgr.backPool(this, arrTowerSeat[i]);
        }

        for (let i = arrEnemy.length - 1; i >= 0; --i) {
            poolMgr.backPool(this, arrEnemy[i]);
        }
    }
    //测试 有没有加载 地图物体到对象池
    testMapLoadObjToPool() {
        return new Promise((resolve, reject) => {
            if (Object.keys(this).includes(Enum.POOL_NAME.TOWER_SEAT)) {
                resolve();
                return;
            }
            let promiseArr = [];
            promiseArr.push(GameControl.ResourceManager.loadPerfab(Enum.UNIT_PATH.TOWER_SEAT));
            promiseArr.push(GameControl.ResourceManager.loadPerfab(Enum.UNIT_PATH.ENEMY));
            promiseArr.push(GameControl.ResourceManager.loadPerfab(Enum.UNIT_PATH.TOWER));
            Promise.all(promiseArr).then(result => {
                result.forEach((element, index) => {
                    switch (index) {
                        case 0:
                            GameControl.PoolManager.initObjPool(this, PoolManager.templateCreator(Enum.POOL_NAME.TOWER_SEAT, 20, element));
                            break;
                        case 1:
                            GameControl.PoolManager.initObjPool(this, PoolManager.templateCreator(Enum.POOL_NAME.ENEMY, 20, element));
                            break;
                        case 2:
                            GameControl.PoolManager.initObjPool(this, PoolManager.templateCreator(Enum.POOL_NAME.TOWER, 20, element));
                            break;
                        default:
                            break;
                    }
                });
                resolve();
            }).catch(err => {
                reject(err);
            });
        })

    }
    //生成物体到地图
    creatorMapObj() {
        let poolMgr = GameControl.PoolManager;
        console.log(this.mapInfo);
        Enum.MAP_INFO[this.mapInfo.id].TOWER_POS.forEach(element => { //生成 节点
            let tower = poolMgr.getNode(this, Enum.POOL_NAME.TOWER_SEAT, this.cttTowerSeat).getComponent(TowerSeat);
            tower.init(element);
        })
        //生成 开始按钮 
        this.btnMinutia.position = Enum.MAP_INFO[this.mapInfo.id].NEXT_MINUTIA;
        this.scrPowerSeat.init(Enum.MAP_INFO[this.mapInfo.id].POWER_POS);
        this.delayNextMinutia();
        this.updateMinutiaShow();
    }
    //设置延时打开 每个小节    //到达间隔时间判断 按钮是否 为false , 当怪物
    delayNextMinutia(time = 0) {
        let ee = time == 0 ? 0 : 1;
        console.log(this.minutiaCount);
        let currentMinutia = this.mapInfo.minutia[this.minutiaCount - ee];
        let times = currentMinutia.startTime + Math.floor(time / 1000);
        this.scheduleOnce(() => {
            if (this.arrClickMinutia[this.minutiaCount]) {
                return;
            }
            this.onNextMinutia();
        }, times);
        this.btnMinutia.node.color = cc.Color.WHITE;
        this.btnMinutia.node.runAction(cc.tintTo(times, cc.Color.RED)); //按钮播放 。
    }

    updateBtnMinutia(bool) {
        if (!this.judgeMinutiaCountIsValid(this.minutiaCount)) return;
        this.btnNextMinutia.interactable = bool;
        this.btnMinutia.node.active = bool;
    }


    //加速战斗
    onAddSpeedFight() {
        this.cancelTowerSeatResponse();

    }
    //开始暂停 (炮塔停止攻击，子弹停止。怪物停止走动。)
    onStop() {
        this.cancelTowerSeatResponse();

        GameControl.UIManager.showUI(Enum.PANEL_PATH.PANEL_FIGHTING_STOP);


    }
    //更新小节ui
    updateMinutiaShow() {
        let minutia = this.mapInfo.minutia;
        if (!this.judgeMinutiaCountIsValid(this.minutiaCount - 1)) return;
        this.labMinutiaTip.string = minutia[this.minutiaCount - 1].minutia + "/" + minutia.length;
    }
    //判断 当前小节的有效性
    judgeMinutiaCountIsValid(minutiaCount) {
        if (!this.mapInfo.minutia) return false
        return minutiaCount >= 0 && minutiaCount < this.mapInfo.minutia.length;
    }
    //下小节 行动的间隔时间 (秒)
    minutiaActionIntervalTime(minutiaCount) {
        let currentMinutia = this.mapInfo.minutia[minutiaCount],
            arrEnemyName = String(currentMinutia.enemy).split("");
        return currentMinutia.intervalTime * (arrEnemyName.length - 1) + 1;

    }


    //下个小节 开启  (先判断，当前是否可以点击，点击要生成那一块)
    onNextMinutia() {
        this.cancelTowerSeatResponse();
        this.updateBtnMinutia(false);

        let canNext = false,
            currentMinutia = null,
            arrEnemy = null,
            nextMinutiaActionIntervalTime = null;

        //点击过后等待 time  显示按钮  

        if (this.minutiaCount == 0) {
            currentMinutia = this.mapInfo.minutia[this.minutiaCount];
            arrEnemy = String(currentMinutia.enemy).split("");
            nextMinutiaActionIntervalTime = (currentMinutia.intervalTime * (arrEnemy.length - 1) + 1) * 1000;

            this.clickMinutiaTime = new Date().getTime();
            this.scheduleOnce(() => {
                this.updateBtnMinutia(true);
                this.delayNextMinutia(nextMinutiaActionIntervalTime);
            }, Math.floor(nextMinutiaActionIntervalTime / 1000));
            this.arrClickMinutia[this.minutiaCount] = true;
            ++this.minutiaCount;
            canNext = true;

        } else if (this.judgeMinutiaCountIsValid(this.minutiaCount - 1)) {
            currentMinutia = this.mapInfo.minutia[this.minutiaCount - 1];
            arrEnemy = String(currentMinutia.enemy).split("");
            nextMinutiaActionIntervalTime = (currentMinutia.intervalTime * (arrEnemy.length - 1) + 1) * 1000;
            if (new Date().getTime() - this.clickMinutiaTime >= nextMinutiaActionIntervalTime) {
                currentMinutia = this.mapInfo.minutia[this.minutiaCount];
                arrEnemy = String(currentMinutia.enemy).split("");
                this.clickMinutiaTime = new Date().getTime();
                this.scheduleOnce(() => {
                    this.updateBtnMinutia(true);
                    this.delayNextMinutia(nextMinutiaActionIntervalTime);
                }, Math.floor(nextMinutiaActionIntervalTime / 1000));
                this.arrClickMinutia[this.minutiaCount] = true;
                ++this.minutiaCount;

                canNext = true;
            }

        }
        if (!canNext) return;
        this.updateMinutiaShow();
        //拿出 敌人 
        this.getCurrentMinutiaEnemy(currentMinutia);
    }

    getCurrentMinutiaEnemy(currentMinutia) {
        let arrEnemy = String(currentMinutia.enemy).split("");
        GameControl.ResourceManager.loadAnimationClip(Enum.MAP_ANIMATION_PATH(this.mapInfo.id)).then(res => {
            arrEnemy.forEach((element, index) => {
                let enemy = GameControl.PoolManager.getNode(this, Enum.POOL_NAME.ENEMY, this.cttEnemy).getComponent(Enemy);
                enemy.init(element, res);
                if (index == 0) {
                    enemy.action();
                } else {
                    this.scheduleOnce(() => {
                        enemy.action();
                    }, index * currentMinutia.intervalTime);
                }
            });
        }).catch(err => console.log(err));
    }

}