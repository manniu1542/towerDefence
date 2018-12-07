
const{ccclass,property}=cc._decorator;
@ccclass
export default class BannerAd extends cc.Component {

    _adUnitId = 0;
    _bannerAd_Interval = 5;


    onShow(adUnitId = 'adunit-29d20f7c81738806', bannerAd_Interval = 400) {
        if (!window.wx) return;
        if (typeof window.wx.createBannerAd !== "function") return;
        this._adUnitId = adUnitId;
        this._bannerAd_Interval = bannerAd_Interval;
        this.node.active = true;
        this.create();

        this.schedule(this.create, this._bannerAd_Interval);
        this.bannerOpen = true;
    }

    onDisable() {
        if (!window.wx) return;
        if (typeof window.wx.createBannerAd !== "function") return;
        this.bannerAd.hide();
        this.unschedule(this.create);
        this.bannerOpen = false;
    }

    // 创建
    create() {
        let vis = cc.view.getVisibleSize();
        let fra = cc.view.getFrameSize();
        let scaleX = fra.width / vis.width;
        let scaleY = fra.height / vis.height;
        let width = this.node.width * scaleX;
        let height = this.node.height * scaleY;
        let top = (fra.height / 2 - this.node.y * scaleY) - height / 2;
        let left = (fra.width / 2 + this.node.x * scaleX) - width / 2;

        if (this.bannerAd) {
            this.bannerAd.destroy();
        }

        this.bannerAd = wx.createBannerAd({
            adUnitId: this._adUnitId,
            style: {
                left: left,
                top: top,
                width: width,
                height: height,
            }
        });
        this.bannerAd.show();
    }

}