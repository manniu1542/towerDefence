import SceneBase from "./SceneBase";
import GameControl from "../../control/GameControl";
import Enum from "../../utils/Enum";


const {
	ccclass,
	property
} = cc._decorator;
@ccclass
export default class SceneLoading extends SceneBase {


	@property(cc.ProgressBar) //进度条
	proBar = new cc.ProgressBar();
	@property(cc.Label) //进度条百分比
	labPercent = new cc.Label();


	init() {
		this._totalCount = 1; //总 加载 数量
		this._completeCount = 0; //完成数量
	}
	show() {
		super.show(); 
		this.proBar.progress = 0;
		this.labPercent.string = '0%';

        GameControl.ConfigManager.loadConfig(this.addCompleteCount)//加载配置表;
          
		
	}
	close() {
		super.close();

	}
    addCompleteCount=()=>
	{
        ++this._completeCount;
        this._updateUI();
        this._completeCount>=this._totalCount&&this.loadGame();

	}

	//加载游戏
	loadGame()
	{
        GameControl.UIManager.showUI(Enum.SCENE_PATH.SCENE_GAME,{},Enum.LOAD_SHOW_WAY.LOANDING,(_completeCount, _totalCount)=>{
            this._updateUI({completeCount:_completeCount,totalCount:_totalCount});
        },()=>{
			this.close();
            cc.loader.release(Enum.SCENE_PATH.SCENE_LOADING);
        })
	}


    _updateUI(uiInfo)
	{
		!uiInfo&&(uiInfo={completeCount:0,totalCount:0});
		this.proBar.progress =(uiInfo.completeCount + this._completeCount) / (uiInfo.totalCount + this._totalCount);
		this.labPercent.string = ((uiInfo.completeCount + this._completeCount) / (uiInfo.totalCount + this._totalCount) * 100).toFixed(0) + '%';
	}


}