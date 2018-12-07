import EnemyBase from "./EnemyBase";
import GameControl from "../../control/GameControl";
import Enum from "../../utils/Enum";



const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class Enemy extends EnemyBase {



    init(type, clip) {
        type = Number(type);
        super.init(type, clip);

        switch (Number(type)) {
            case Enum.ENEMY_TYPE.FiRST:

                break;

            default:
                break;
        }

    }


    remove() {
        super.remove();
    }

}