import {Singleton} from "../utils/CSingleton";
import GameControl from "../control/GameControl";

const {ccclass, property} = cc._decorator;
@ccclass
export default class AudioManager extends Singleton {


    _currentMusicName = '';//背景音乐
    _switchMusic = true;//开关背景音乐  true 开 false 关
    _switchEffect = true;//开关音效
    _switchMain = true;//总开关 负责 音乐 音效
    //播放音乐
    playMusic(name, loop = true) {
        if (this._switchMain) return;
        if (cc.audioEngine.isMusicPlaying() && this._currentMusicName == name) {
            return;
        }
        else {
            cc.audioEngine.stopMusic();
        }
        GameControl.ResourceManager.loadAudio(name).then(res => {
            cc.audioEngine.playMusic(res, loop);
            this._switchMusic = true;
            this._currentMusicName = name;
        }).catch(err => {
            console.error(err);
        })
    }
   //停止音乐
    stopMusic() {
        if (cc.audioEngine.isMusicPlaying()) {//正在播放
            cc.audioEngine.stopMusic();
        }
        this._switchMusic = false;
    }
   //音乐开关
    get switchMusic() {
        return this._switchMusic;
    }

    /**
     * 播放音效
     * @param name
     * @param loop=false
     */
    playEffect(name, loop = false) {
        if (!this.switchEffect || !this._switchMain) return;
        GameControl.ResourceManager.loadAudio(name).then(res => {
            cc.audioEngine.playEffect(res, false);
        }).catch(() => {
            console.error(err);
        })
    }
    //打开音效
    openEffect() {
        this._switchEffect = true;
    }
    //关闭音效
    stopEffect() {
        this._switchEffect = false;
    }
    //音效开关
    get switchEffect() {
        return this._switchEffect;
    }

    //总开关
    get switchMain() {
        return this._switchMain;
    }
    //总暂停
    pauseAll() {
        this._switchMain = false;
        cc.audioEngine.pauseAll();
    }
   //总恢复
    resumeAll() {
        this._switchMain = true;
        cc.audioEngine.resumeAll();
    }

}
