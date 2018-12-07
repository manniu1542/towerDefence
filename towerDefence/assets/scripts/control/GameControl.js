import ResourceManager from "../manager/ResourceManager";
import UIManager from "../manager/UIManager";
import WxSdk from "../wx/WxSdk";
import PoolManager from "../manager/PoolManager";
import EventManager from "../manager/EventManager";
import Enum from "../utils/Enum";
import ConfigManager from "../manager/ConfigManager";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";
const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class GameControl extends cc.Component {

    
    static ResourceManager=new ResourceManager();
    static UIManager=new UIManager();;
    static DataManager=new DataManager();
    static PoolManager=new PoolManager();
    static AudioManager=new AudioManager();
    static EventManager=new EventManager();
    static ConfigManager=new ConfigManager();
    onLoad() {
      
        cc.game.addPersistRootNode(this.node); //设为常驻节点EventDispatcher
        GameControl.ResourceManager = ResourceManager.instance;
        GameControl.PoolManager = PoolManager.instance;
        GameControl.UIManager = this.getComponent(UIManager);
        GameControl.EventManager = EventManager.instance;
        GameControl.ConfigManager = ConfigManager.instance;
        GameControl.AudioManager = AudioManager.instance;
       

    }
    start() {
        //请求网络 
        //得到数据 资源
        //初始化  游戏内容
        cc.debug.setDisplayStats(false);//显示运行 信息
        cc.director.getCollisionManager().enabled=true;
        cc.director.getCollisionManager().enabledDebugDraw=true;

        GameControl.UIManager.showUI(Enum.SCENE_PATH.SCENE_LOADING);
        //    WxSdk.checkSession().then(()=>{


        //    }).catch(()=>{

        //     WxSdk.login().then(()=>{


        //     }).catch(()=>{


        //     })

        //    })



    }




}