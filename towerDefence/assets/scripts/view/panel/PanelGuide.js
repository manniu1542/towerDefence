import PanelBase from "./PanelBase";


const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class PanelGuide extends PanelBase {



    init(panelInfo) {
       //panelInfo.panelShowWay                 panelInfo.closeData

    }

    show() {
        super.show();


    }

    close() {
        super.close();


    }

    onClosePanel() {
        console.log("关闭");
        this.close();

    }


}