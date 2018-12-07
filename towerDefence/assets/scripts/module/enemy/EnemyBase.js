import Enum from "../../utils/Enum";
import GameControl from "../../control/GameControl";


const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class EnemyBase extends cc.Component {

    @property(cc.Animation) //1分钟
    aniMoveAction = null; //new cc.Animation();
    @property(cc.ProgressBar)
    proHp =null;
    //速度
    //@property
    speed = 0;
    //血量
    //@property
    hp = 0;
    //当前血量
    currentHp = 0;
    //减速时间
    reduceTime;
    //状态
    state = Enum.ENEMY_STATE.NORMAL;
    //当前的 clip
    currentClip = new cc.AnimationClip();
    //控制动画状态
    currentAnimationState = new cc.AnimationState();
    //初始化 
    init(type,clip) {
        this.currentClip = clip;
        let enemyData = GameControl.ConfigManager.getEnemysData(type);
        this.speed = enemyData.speed;
        this.hp = enemyData.hp;
        this.currentHp = enemyData.hp;
        this.currentClip.speed = this.speed;
        this.aniMoveAction.addClip(this.currentClip);
        this.currentAnimationState = this.aniMoveAction.getAnimationState(this.currentClip.name);
     
    }
    //行动
    action() {
        this.aniMoveAction.play(this.currentClip.name);
    }

    //移除
    remove() {
        this.aniMoveAction.removeClip(clip, true);
        this.currentClip = null;
        this.currentAnimationState = null;
    }

    //减速 效果
    reduceMoveEffect({
        reducePercent,
        reduceTime
    }) {
        if (this.reduceTime > 0) {
            this.unschedule(this.recoverNomalMoveEffect);
        }
        this.reduceTime = reduceTime;
        this.currentAnimationState.speed /= reducePercent;
        this.scheduleOnce(this.recoverNomalMoveEffect, this.reduceTime);
    }
    //恢复为正常移动效果
    recoverNomalMoveEffect() {
        this.currentAnimationState.speed = this.speed;
    }
    
    //更新血量
    updateHpShow()
    {
        this.proHp.progress=(this.currentHp/this.hp).toFixed(2);
    }


}