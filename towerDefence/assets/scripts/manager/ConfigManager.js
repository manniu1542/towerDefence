import {
    Singleton
} from "../utils/CSingleton";
import GameControl from "../control/GameControl";
import Enum from "../utils/Enum";


const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class ConfigManager extends Singleton {

    //_config = {}; //配置表加载

    //管卡 （当前的管卡index 得到 此关卡所有数据）
    //加载配置
    loadConfig(resolve, reject) {

        GameControl.ResourceManager.loadJson(Enum.CONFIG_PATH).then(res => {
            //this._config = res.json;
            this.initConfig(res.json);
            resolve && resolve();
            return
        }).catch(err => {
            console.error(err.message);
            reject && reject(err);
        })

    }
    initConfig(data) {
        this._custom = data.custom;
        this._enemys=data.enemys;
        this._towers=data.towers;
    }

    getCustomPassData(mapIndex) {
        return this._custom[mapIndex];
    }
    getEnemysData(index)
    {
      return this._enemys[index-1];
    }
    getTowersData(index)
    {
        return this._towers[index-1];
    }


}