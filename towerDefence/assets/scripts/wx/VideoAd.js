const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class BannerAd extends cc.Component {
    @property(cc.Node)
    videoNode = null;
    _adUnitId = "";
    @property(cc.Label)
    countLabel = null;

    onLoad() {
        this.audio = cc.find('Canvas').getComponent(cc.AudioSource);



    }


    onShow(adUnitId = 'adunit-9da6ed4ef6200b35') {
        if (!window.wx) return;
        if (typeof window.wx.createRewardedVideoAd !== "function") return;


        this.node.active = true;
        this._adUnitId = adUnitId;

        // let count = adMaxCount - cc.at.global.videoAd_UseCount;
        // count = count > 0 ? count : 0;

        // this.videoNode.getComponent(cc.Button).interactable = count > 0;
        // this.countLabel.string = "（" + count + "次）";

        wx.createRewardedVideoAd({
            adUnitId: this._adUnitId,
        });

        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: this._adUnitId
        });

        this.videoAd.load();
        console.log('激励视频 广告加载了', this.videoAd);
        this.videoAd.onLoad(() => {
            console.log('激励视频 广告加载成功');
            // cc.at.audio.pauseAll();
            if (this.audio.isPlaying) {
                this.audio.pause();

            }

        });

        this.videoAd.onClose(res => {
            //// cc.at.audioControl.resumeAll();
            if (this.audio.isPlaying) {
                this.audio.resume();
            }
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                // cc.at.global.videoAd_UseCount += 1;
                // cc.at.ui_gameEnd.onVideoContinueGame();
                console.log('發送游戲道具');
                cc.at.recoverPanel.recoverLife();

            } else {
                // 播放中途退出，不下发游戏奖励  
                (!cc.at.banner.bannerOpen) && cc.at.banner.onShow();
            }

        });

        this.videoAd.onError(err => {
            console.log(err, "视频广告加载失败");
            // cc.at.tip.show("视频广告加载失败");
            this.videoNode.getComponent(cc.Button).interactable = false;
        });
    }

    onClick() {
        if (this.videoAd) {

            cc.at.banner.bannerOpen && cc.at.banner.onDisable();

            this.videoAd.show().then(() => {
                console.log('激励视频 广告显示');
                //// cc.at.audioControl.pauseAll();
            }).catch(err => {
                this.videoAd.load().then(() => this.videoAd.show())
            });
        }
    }

};