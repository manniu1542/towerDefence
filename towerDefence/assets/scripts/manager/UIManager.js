
import GameControl from "../control/GameControl";
import Enum from "../utils/Enum";
import MyUtils from "../utils/MyUtils";

const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class UIManager extends cc.Component {

    @property(cc.Node)
    cttSceneParent = null;
    @property(cc.Node)
    cttPanelParent = null;
    @property(cc.Node)
    cttTipParent = null;
    @property(cc.Node)
    cttLoadParent = null;
    @property(cc.Node)
    cttAdParent = null;

    onLoad() {
        
        this._UIMap = {}; //所有的ui 脚本管理
        this._arr = []; //管理 ui 节点

        this.imgLoading = MyUtils.CCFind(this.cttLoadParent, null, "imgLoading");
        this.cImgPrompt = MyUtils.CCFind(this.cttTipParent, null, "cImgPrompt");
        this.labDescribe = MyUtils.CCFind(this.cttTipParent, null, "cImgPrompt/labDescribe");
        
    }



    showUI(prefabPath, params, loadWay = Enum.LOAD_SHOW_WAY.MASK, onProgress = null, onComplete = null) {

        this.showBannerAd(prefabPath);
        let arr = prefabPath.split('/');
        let scriptName = arr[arr.length - 1];
         //先检测是否有此节点  
        if(this._UIMap.hasOwnProperty(scriptName))
        {
            this.showLoading(loadWay);
            this.scheduleOnce(() => {
                this.hideLoading(loadWay);
            }, loadWay);
            this._UIMap[scriptName].show(params);
            return;
        }
        GameControl.ResourceManager.loadPerfab(prefabPath, (complete, total) => {
            onProgress && onProgress(complete, total);
            if (!Enum.LOADING_IGNORE_LIST(prefabPath) && !this.loading) {
                this.loading = true;
                this.showLoading(loadWay);
            }
        }).then(res => {
            this.loading = false;
            let uiNode = cc.instantiate(res);
            uiNode.setContentSize(cc.winSize);
            uiNode.setPosition(0, 0);
            this._UIMap[scriptName] = uiNode.getComponent(scriptName);
            this._UIMap[scriptName].show(params);
            onComplete && onComplete();
            this.scheduleOnce(() => {
                this.hideLoading(loadWay);
            }, loadWay);
        }).catch(err => {
            console.error("loadPerfab:" + prefabPath + "\n" + err.message);
        })
    }
    //得到场景 节点
    


    //放入节点  到 管理其中
    push(node) {
        let name = node.name;
        let result = this.get(name);
        if (!result) {
            this._arr.push({
                name,
                node
            });
        } else {
            this._arr.splice(result.index, 1);
            this._arr.push({
                name,
                node
            });
        }
        this.hideCurrentNode();
    }

    //隐藏当前节点
    hideCurrentNode() {
        if (this._arr.length > 1) {
            let child = this._arr[this._arr.length - 2];
            if (child) {
                child.node.removeFromParent();
            }
        }
    }

    //展示当前节点
    showCurrentNode() {
        let parent = this.cttSceneParent;
        let child = this._arr[this._arr.length - 1].node;
        parent.addChild(child);
    }

    //通过名字删除 节点 
    deleteByName(name) {
        this._arr.some((obj, index) => {
            if (obj.name == name) {
                this._arr.splice(index, 1);
                return false;
            }
        });
    }

    //弹出
    pop() {
        this._arr.pop();
        this.showCurrentNode();
    }

    //通多名字得到 当前节点
    get(name) {
        let result = null;
        this._arr.forEach((obj, index) => {
            if (obj.name == name) {
                result = {
                    obj: obj,
                    index: index
                };
            }
        });
        return result;
    }
    getScript(name)
    {
        if(!(name in this._UIMap))//this._UIMap.test(name)
        {
            console.error("function:getScript--- this._UIMap is no such "+name);
            return null;
        }
   
       return this._UIMap[name]

    }

    //展示loading
    showLoading(loadWay) {
        if (this.cttLoadParent.active) {
            return;
        }
        this.cttLoadParent.active = true;
        this.imgLoading.active = false;
        switch (loadWay) {
            case Enum.LOAD_SHOW_WAY.MASK:
                break;
            case Enum.LOAD_SHOW_WAY.LOANDING:
                this.imgLoading.active = true;
                this.playLoadingAction();
                break;
            case Enum.LOAD_SHOW_WAY.MASK:
                break;
        }

    }

    //隐藏loading
    hideLoading(loadWay) {
        this.cttLoadParent.active = false;

        switch (loadWay) {
            case Enum.LOAD_SHOW_WAY.MASK:
                break;
            case Enum.LOAD_SHOW_WAY.LOANDING:
                this.stopLoadingAction();
                break;
            case Enum.LOAD_SHOW_WAY.MASK:
                break;
        }

    }

    //播放loading的动画
    playLoadingAction() {
        this.stopLoadingAction();
        let action = cc.repeatForever(cc.sequence(cc.rotateTo(0.3, 180), cc.rotateTo(0.3, 360)));
        this.imgLoading.runAction(action);
    }

    //停止loading
    stopLoadingAction() {

        this.imgLoading.stopAllActions();
        this.imgLoading.rotation = 0;
    }


    //提示
    showTip(content, delay = 1) {
        this.labDescribe.string = content;
        this.playTipAction(delay);
    }
   //提示动画
    playTipAction(delay) {
        this.cImgPrompt.stopAllActions();
        this.cttTipParent.active = true;
        this.cImgPrompt.active = true;
        this.cImgPrompt.opacity = 0;
        let action1 = cc.fadeIn(0.3);
        let action2 = cc.delayTime(delay);
        let action3 = cc.fadeOut(0.3);
        this.cImgPrompt.runAction(cc.sequence(action1, action2, action3, cc.callFunc(() => {
            this.cttTipParent.active = false;
            this.cImgPrompt.active = false;
            this.cImgPrompt.opacity = 0;
        })));
    }

    showBannerAd(prefabPath) {
        return;
        let guide = Enum.GUIDE_STATE.FINISH;
        if (guide != Enum.GUIDE_STATE.FINISH) { //引导没过  开启
            this.bannerNode.active = false;
            return;
        }

        if (Enum.BANNER_AD_IGNORE_LIST(prefabPath)) {
            this.bannerNode.active = false;
            return;
        }
        this.bannerNode.getComponent(BannerAd).show();
    }

    showVideoAd(successCallback, failCallback) {
        return;
        this.videoNode.getComponent(VideoAd).show(successCallback, failCallback);
    }
}