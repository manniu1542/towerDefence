import CSingleton  from "../utils/CSingleton";

const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class ResourceManager extends CSingleton {
    //预制体的字典
    perfabMaps = {};
    //图片帧的字典
    spriteFrameMaps = {};
    //图集的字典
    spriteAtlasMaps = {};
    //地图的字典
    tiledMapAssetMaps = {};
    //龙骨的字典
    dragonBonesMaps = {};
    //声音的字典
    audioMaps = {};
    //json的字典
    jsonMaps = {};
    //字体的字典
    fontMap = {};
    //动画的字典
    animationClipMaps={};
   
    //加载预制资源
    //image.png/image, prefab, anim
    //url:View/UI/DarkMaskLayer 对应 /assert/resource/View/UI/DarkMaskLayer
    //如果有图集图片等包函在预制中则会被同步加载
    load(url,type, resolve, reject,progress=null) {

        !progress&&(progress=()=>{});
        cc.loader.loadRes(url, type, progress, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (res instanceof cc.Prefab) {
                this.perfabMaps[res._name] = res;
            } else if (res instanceof cc.SpriteFrame) {
                this.spriteFrameMaps[res._name] = res
            } else if (res instanceof cc.SpriteAtlas) {
                this.spriteAtlasMaps[res._name] = res
            } else if (res instanceof cc.TiledMapAsset) {
                this.tiledMapAssetMaps[res._name] = res
            } else if (res instanceof cc.AudioClip) {
                this.audioMaps[res._name] = res;
            } else if (res instanceof cc.Texture2D) {
                this.texture2DMap[res._name] = res;
            } else if (res instanceof cc.Font) {
                this.fontMap[res._name] = res;
            }
            resolve(res);
        })

    }


   /**
     * laod prefab
     * @param perfabName
     * @param progress    completedCount   totalCount
     * @returns {*}
     */
    loadPerfab(name,progress=null) {
        return new Promise((resolve, reject) => {
            if(this.perfabMaps[name])
            {
              resolve(this.perfabMaps[name])
              return;
            } 
         this.load(name, cc.Prefab,resolve,reject,progress);
      })
    }

    /**
     * load spriteFrame
     * @param name
     * @param cb
     * @returns {*}
     */
    loadSpriteFrame(name,progress=null) {
        return new Promise((resolve, reject) => {
              if(this.spriteFrameMaps[name])
              {   
                resolve(this.spriteFrameMaps[name])
                return;
              } 
           this.load(name, cc.SpriteFrame,resolve,reject,progress);
        })
    }

    /**
     * load SpriteAtlas
     * @param name
     * @param cb
     * @returns {*}
     */
    loadSpriteAtlas(name, progress) {
        return new Promise((resolve, reject) => {
            if(this.spriteAtlasMaps[name])
            {   
              resolve(this.spriteAtlasMaps[name])
              return;
            } 
           this.load(name, cc.SpriteAtlas,resolve,reject,progress);
      })
    }



    /**
     * get tmx asset
     * @param tmxName
     * @return {*}
     */
    getTmxAsset(tmxName) {
        if (this.tiledMapAssetMaps[tmxName]) return this.tiledMapAssetMaps[tmxName];
        return false
    }

    /**
     * load dragon bones
     * @param dragonBonesDir
     * @param cb
     */
    loadDragonBones(dragonBonesDir, cb) {
              return;
        var strDir = dragonBonesDir;
        if (this.dragonBonesMaps[strDir] && this.dragonBonesMaps[strDir][0] && this.dragonBonesMaps[strDir][1]) {
            //已经加载
            cb(false, this.dragonBonesMaps[strDir][0], this.dragonBonesMaps[strDir][1]);
            return;
        }
        //load
        cc.loader.loadResDir(strDir, function (err, assets) {
            if (err) {
                return;
            } else {
                var assertArr = new Array(2);
                assets.forEach(function (asset) {
                    if (asset instanceof dragonBones.DragonBonesAsset) {
                        assertArr[0] = asset;
                    }
                    if (asset instanceof dragonBones.DragonBonesAtlasAsset) {
                        assertArr[1] = asset;
                    }
                });
                this.dragonBonesMaps[strDir] = assertArr;

                return cb(false, this.dragonBonesMaps[strDir][0], this.dragonBonesMaps[strDir][1]);
            }
        });
    }
    /**
	 * 动态加载龙骨
	 * @param animationDisplay 龙骨组件
	 * @param path 龙骨地址
	 * @param armatureName Armature名称
	 * @param newAnimation Animation名称
	 * @param completeCallback 动画播放完毕的回调
	 * @param playTimes 播放次数 -1是根据龙骨文件 0五险循环 >0是播放次数
	 */
	loadDragonBones(animationDisplay, path, armatureName, newAnimation, loadCompleteCallback,playCompleteCallback, playTimes = 1) { //动态加载龙骨
        return;
        if(!animationDisplay){
			return;
		}
		if(animationDisplay.armature()){
			animationDisplay.armature().animation.stop();
		}
		animationDisplay.dragonAsset = null;
		animationDisplay.dragonAtlasAsset = null;
		cc.loader.loadResDir(path, function (err, assets) {
			if (err || assets.length <= 0) return;
			assets.forEach(asset => {
				if (asset instanceof dragonBones.DragonBonesAsset) {
					animationDisplay.dragonAsset = asset;
				}
				if (asset instanceof dragonBones.DragonBonesAtlasAsset) {
					animationDisplay.dragonAtlasAsset = asset;
				}
			});

			animationDisplay.armatureName = armatureName;
			animationDisplay.armature().animation.play(newAnimation, playTimes);
			if (playCompleteCallback){
				animationDisplay.addEventListener(dragonBones.EventObject.COMPLETE, playCompleteCallback);
			}
			loadCompleteCallback && loadCompleteCallback()
		})
	}

	releaseDragonBones(url){
		cc.loader.releaseResDir(url , cc.Texture2D);
	}
    /**
     * 音频加载
     * @param name
     * @param cb
     * @return {*}
     */
    loadAudio(name, progress) {
        return new Promise((resolve, reject) => {
            if(this.audioMaps[name])
            {   
              resolve(this.audioMaps[name])
              return;
            } 
           this.load(name, cc.AudioClip,resolve,reject,progress);
      })
    }

    /**
     * load json
     * @param name
     * @param cb
     * @return {*}
     */
    loadJson(name,progress=null) {
    
        return new Promise((resolve, reject) => {
            if(this.jsonMaps[name])
            {   
              resolve(this.jsonMaps[name])
              return;
            } 
           this.load(name, cc.JsonAsset,resolve,reject,progress);
      })
    }

    /**
     * load spriteFrame
     * @param name
     * @param cb
     * @returns {*}
     */
    loadTexture2D(name, progress=null) {
        return new Promise((resolve, reject) => {
            if(this.texture2DMap[name])
            {   
              resolve(this.texture2DMap[name])
              return;
            } 
           this.load(name, cc.Texture2D,resolve,reject,progress);
      })
    }

    /**
     * load font
     * @param name
     * @param cb
     * @returns {*}
     */
    loadFont(name, progress=null) {
   

        return new Promise((resolve, reject) => {
            if(this.fontMap[name])
            {   
              resolve(this.fontMap[name])
              return;
            } 
           this.load(name, cc.Font,resolve,reject,progress);
      })
    }
    loadAnimationClip(name, progress=null) {
   

        return new Promise((resolve, reject) => {
            if(this.animationClipMaps[name])
            {   
              resolve(this.animationClipMaps[name])
              return;
            } 
           this.load(name, cc.AnimationClip,resolve,reject,progress);
      })
    }
}