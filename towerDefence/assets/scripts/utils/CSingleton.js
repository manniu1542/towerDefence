const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class CSingleton extends cc.Component {

    static _instance = null;
    static get instance() {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }
}

export class Singleton {
    static _instance = null;
    static get instance() {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }
}