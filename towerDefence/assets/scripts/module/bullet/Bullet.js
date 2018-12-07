import BulletBase from "./BulletBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends BulletBase {

    
    _harm=0;//伤害 
    _range=0;//子弹范围
    _target=null;//攻击目标 
   
    

   onLoad () {
	   
   }
   
    start () {

    }


}
