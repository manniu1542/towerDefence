import PanelBase from "./PanelBase";


const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class PanelTemplate extends PanelBase {



    init(panelInfo) {
       //this.panelInfo.panelShowWay                 this.panelInfo.closeData

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