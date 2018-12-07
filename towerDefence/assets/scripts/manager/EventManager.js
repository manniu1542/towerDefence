import {
    Singleton
} from "../utils/CSingleton";

const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class EventManager extends Singleton {

    _eventList = {}; //注册事件的列表   

    /**
     * 注册事件
     * @param {enumerate} type  类型
     * @param {Function} fun 
     * @param {boolean} once  默认false 若为true 则 只执行一次方法  
     */
    registerEvent(type,fun,target,once = false) {
        if(!((typeof type==="string") ||fun instanceof Function ||target instanceof Object))
        {
            console.error("registerEvent transfer parameters Error")
            return ;
            
        }
        !this._eventList[type] && (this._eventList[type] = []);
        if (this.eventExist(type, fun)) return;
        this._eventList[type].push({
            fun,
            target,
            once
        });
    }

    /**
     * 派发事件
     * @param {*} type 
     * @param {Object} data 给事件传的参
     */
    dispatchEvent(type, data) {
        if(!(typeof type==="string"))
        {
            console.error("dispatchEvent transfer parameters Error")
            return ;
        }
        
        if (this._eventList[type]) {
            this._eventList[type].forEach(obj => {
                obj.fun && obj.fun.call(obj.target,data);
                obj.once&&this.removeEvent(type,obj.fun);
            });
        } else {
            console.error("eventType not registered：" + type);
        }

    }
    /**
     * 移除一个事件
     * @param {*} type 
     * @param {Function} fun 
     */
    removeEvent(type, fun,target) {
        if(!((typeof type==="string") ||fun instanceof Function ||target instanceof Object))
        {
            console.error("removeEvent transfer parameters Error")
            return ;
        }
        if (this._eventList[type]) {
            let list=this._eventList[type];
            for (let index = 0; index < list.length; index++) {
                let  element = list[index];
                if (element&&element.fun == fun&&element.target==target) {
                    list.splice(index, 1);
                    break;
                }
            }
       

        }

    }
    //移除一个类型的事件
    removeEventByType(type)
    {
        if(!(type instanceof  string))
        {
            console.error("there is no such EventType:"+type);
        }
        while (this._eventList[type].length > 1) {
            this._eventList[type].shift();
        }
        this._eventList[type]&&(this._eventList[type]=undefined);
    }
    //移除一个节点上的事件
    removeEventByTarget(target)
    {
       if(!target)
       {
           console.error("there is no such EventTarget:");
       }
       for(var key in this._eventList)
       {
           for(var i=0;i<this._eventList[key].length;++i)
           {
               if(this._eventList[key][i].target===target)
               {
                    this._eventList[key].splice(i,1);
                    break;
               }
           }
       }

    }

    //事件是否存在的判断
    eventExist(type, fun) {
        return this._eventList[type].some(element => {
            if (element.fun == fun) return true;
        })
    }




}

