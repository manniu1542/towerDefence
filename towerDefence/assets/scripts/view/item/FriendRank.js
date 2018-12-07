const OPEND_SIGN = {
    SHOW: 0,
    LEFT: 1,
    RIGHT: 2,
}
const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class FriendRank extends cc.Component {

    @property(cc.Node)
    world = null;


    onLoad() {
        this.playName = "ss";
    }
     //设置 手机常量 在游戏运行时
    setUsuallyBright() {
        if (!CC_WECHATGAME) return;
        wx.setKeepScreenOn({
            keepScreenOn: true,
            success: res => {

            }
        })
    }
    //发送数据给微信   （在提交 排行榜分数时 注入。）
    sendScoreToWX(myScore) {
        let value = {
            'score': myScore,
            'updataTime': (new Date()).getTime()
        };
        let list = [{
            'key': 'score',
            'value': JSON.stringify(value)
        }];

        if (!CC_WECHATGAME) return;
        wx.setUserCloudStorage({
            KVDataList: list,
            success: (res) => {

            },
            fail: (err) => {

            }
        })

    }

    onWorld() {

        this.world.opacity = 255;
        this.node.active = false;

    }

    onFriend() {

        this.world.opacity = 0;
        //重置 世界位置
        this.node.active = true;
        if (CC_WECHATGAME) {
            wx.getOpenDataContext().postMessage({
                info: OPEND_SIGN.SHOW,
                name: this.playName
            });


        }
    }
    onFriendRight() {

        if (CC_WECHATGAME) {

            wx.getOpenDataContext().postMessage({
                info: OPEND_SIGN.RIGHT
            });
        }
    }
    onFriendLeft() {

        if (CC_WECHATGAME) {

            wx.getOpenDataContext().postMessage({
                info: OPEND_SIGN.LEFT
            });
        }
    }


}