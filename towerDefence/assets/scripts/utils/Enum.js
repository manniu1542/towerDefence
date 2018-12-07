
export default class Enum {
    //场景路径
    static SCENE_PATH = {
        SCENE_LOADING: 'prefab/view/scene/SceneLoading',
        SCENE_GAME: 'prefab/view/scene/SceneGame',
        SCENE_CUSTOM_PASS: 'prefab/view/scene/SceneCustomPass',
        SCENE_FIGHTING: 'prefab/view/scene/SceneFighting',
    };
    //面板路径
    static PANEL_PATH = {
        PANEL_GUIDE: 'prefab/view/panel/PanelGuide',
        PANEL_TEMPLATE: 'prefab/view/panel/PanelTemplate',
        PANEL_FIGHTING_STOP: 'prefab/view/panel/PanelFightingStop',
    };
    //加载场景 或panel 展现方式（出现后延时时间的变化）
    static  LOAD_SHOW_WAY={
        MASK:0.02,//蒙版的 ，（）
        LOANDING:0.2,//loading的
        OTHER:0.3,//
    };
    //面板的展现方式
    static PANEL_SHOW_WAY={
        FADE_IN_OUT:'fade_in_Out', //淡入淡出
        DIRECT:'direct',//直接的
    };
    //配置表路径
    static  CONFIG_PATH="configs/config";
    //忽略 加载的列表
    static LOADING_IGNORE_LIST=(a)=> [Enum.PANEL_PATH.PANEL_GUIDE, Enum.SCENE_PATH.SCENE_LOADING].includes(a);
    //忽略 banner 广告的列表
    static BANNER_AD_IGNORE_LIST=(a)=>[Enum.SCENE_PATH.SCENE_LOADING].includes(a);

    //引导的 状态
    static GUIDE_STATE = {
        FIRST: 1,
        SECOND: 2,
        THIRD: 3,

        FINISH: 0,
    };

    //事件类型
    static EVENT_TYPE = {
      CANCEL_TOWER_SEAT_RESPONSE:"cancel_tower_seat_response",
      ENEMY_START_ACTION:"enemy_start_action",
   

    };
    //对象池名字  
    static POOL_NAME = {
        TOWER_SEAT:"TowerSeat",
        ENEMY:"Enemy",
        TOWER:"Tower",
    };
    //加载路径
    static UNIT_PATH={
        POWER_SEAT:'prefab/unit/powerSeat/PowerSeat',
        TOWER_SEAT:'prefab/unit/towerSeat/TowerSeat',
        ENEMY:'prefab/unit/enemy/Enemy',
        TOWER:'prefab/unit/tower/Tower',
    };
    //动画路径
    static MAP_ANIMATION_PATH=(a)=>"animation/map_"+a;
    //地图信息
    static MAP_INFO= {
        0:{
            TOWER_POS:[cc.v2(404,295),cc.v2(305,173),cc.v2(79,216),cc.v2(-330,100),cc.v2(-86,-56),cc.v2(-204,-265),cc.v2(-42,-279)],
            POWER_POS:cc.v2(-266,-31),
            NEXT_MINUTIA:cc.v2(619,282),
        }
    }

    //炮塔类型
    static TOWER_TYPE={ 
        SLOW_BASE:2,
        NORMAL_BASE:1,
        BOOM_BASE:3,
    }
    


    //敌人类型
    static ENEMY_TYPE=
    {
          FiRST:1,
    }

  
    //敌人状态
    static ENEMY_STATE={
        NORMAL:0,

    }

};