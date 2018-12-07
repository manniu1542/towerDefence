

const {ccclass, property} = cc._decorator;

@ccclass
export default class PowerSeat extends cc.Component {


     init(pos)
     {
         
          this.node.position=pos;

     }



}
