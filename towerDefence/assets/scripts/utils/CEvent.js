import GameControl from "../control/GameControl";


const {ccclass, property} = cc._decorator;
@ccclass
export default class CEvent extends cc.Component {
    _events = [];//事件

   // 激活时  添加 事件
    onEnable() {
        this._events.forEach(event => {
            GameControl.EventManager.registerEvent(event.type, event.fun, event.target);
        })
    }

    // 取消激活 时。移除 事件
    onDisable() {
        this._events.length && GameControl.EventManager.removeEventByTarget(this);
    }

    //添加事件
    registerEvent(_type, _fun) {
        this._events.push({type: _type, fun: _fun})
        GameControl.EventManager.registerEvent(_type, _fun, this);
    }

    //发送事件
    dispatchEvent(type, data) {
        GameControl.EventManager.dispatchEvent(type, data);
    }

    //移除事件
    removeEvent(type) {
        if (this._events.length <= 0) {
            console.error("the node event is empty")
            return;
        }
        let index = null;
        this._events.forEach((event, count) => {
            if (event.type == type) {
                index = count;
            }
        });
        if (!index) {
            console.error("the node no such event" + type)
            return;
        }
        GameControl.EventManager.removeEvent(type, this._events[index].fun, this);
        this._events.splice(index, 1);
    }
}
