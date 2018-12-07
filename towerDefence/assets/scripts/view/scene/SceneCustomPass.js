import SceneBase from "./SceneBase";
import MyUtils from "../../utils/MyUtils";
import GameControl from "../../control/GameControl";
import Enum from "../../utils/Enum";



const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class SceneCustomPass extends SceneBase {

    @property(cc.Button)
    btnBack = new cc.Button();
    @property(cc.Button)
    btnMannul =new cc.Button();
    @property(cc.Button)
    btnSkill =new cc.Button();
    @property([cc.Button])
    arrBtnCustomPass=[];
  
    //一张 关卡表  。。   一张  怪物  表。   炮台表 。

    init() {
        MyUtils.clickEvent(this,this.btnBack,"onBackGame");
        MyUtils.clickEvent(this,this.btnMannul,"onMannul");
        MyUtils.clickEvent(this,this.btnSkill,"onSkill");
        this.arrBtnCustomPass.forEach((element,_index) => {
            MyUtils.clickEvent(this,element,"onCustomPass",{index:_index});
        });
     
    }
    show() {
        super.show();
   
 
      
    }
    
    close() {
        super.close();

    }

    onBackGame()
    {
        this.close();
        console.log("onBackGame");
        GameControl.UIManager.showUI(Enum.SCENE_PATH.SCENE_GAME);
    }
    onMannul()
    {
        console.log("onMannul");
    }
    onSkill()
    {
        console.log("onSkill");
    }
    onCustomPass(fingerInfo,mapInfo)
    {
        this.close();      
        GameControl.UIManager.showUI(Enum.SCENE_PATH.SCENE_FIGHTING,GameControl.ConfigManager.getCustomPassData(mapInfo.index));
    }
}