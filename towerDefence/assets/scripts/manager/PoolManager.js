import {
    Singleton
} from "../utils/CSingleton";

/**
 * Created by yh on 2018/8/15.
 */
const {
    ccclass,
    property
} = cc._decorator;


@ccclass
export default class PoolManager extends Singleton {
    //  this  名字 。数量 。预制体
    static templateCreator(name, count, prefab) {
        return {
            name: name,
            initPoolCount: count,
            prefab: prefab
        }
    }
    /**
     * 初始化对象池    GameControl.PoolManager.initObjPool()
     * @param thisO
     * @param objArray   --[ templateCreator(),templateCreator()];
     */
    initObjPool(thisO, objArray) {
        let len = objArray.length;
        for (let i = 0; i < len; i++) {
            let objinfo = objArray[i];
            this.initObjPool(thisO, objinfo);
        }
    }
    //初始化对象池
    initObjPool(thisO, objInfo) {
        let name = objInfo.name;
        thisO[name] = null;
        thisO[name] = new cc.NodePool();
        let initPoolCount = objInfo.initPoolCount;

        for (let ii = 0; ii < initPoolCount; ++ii) {
            let nodeO = cc.instantiate(objInfo.prefab); // 创建节点
            nodeO.active = false;
            thisO[name].put(nodeO); // 通过 putInPool 接口放入对象池
        }
    }

    /**
     * 生成节点
     * @param this0
     * @param name  ---枚举
     * @param parent --父节点
     * @returns {*}
     */
    getNode(this0, name, parent) {
        let newObject = null,
        pool=this0[name];
        if (pool.size() > 1) {
            newObject = pool.get();
        } else {
            let nodeO = pool.get();
            newObject = cc.instantiate(nodeO);
            pool.put(nodeO);
        }
        newObject.active = true;
        parent.addChild(newObject);
        return newObject;
    }

    /**
     * 放回对象池
     * @param thisO
     * @param invalidNode
     */
    backPool(thisO, invalidNode) {
        let poolName = invalidNode.name;
        invalidNode.active = false;
        thisO[poolName].put(invalidNode);
    }

}