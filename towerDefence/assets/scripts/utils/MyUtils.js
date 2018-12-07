const {
    ccclass,
} = cc._decorator;
@ccclass
export default class MyUtils {
    /**
     * 得到一个大于等于0，小于1之间的随机数
     * @returns {number}
     */
    static randomFloat01 = function () {
        return Math.random();
    };

    /**
     * 
     * @param {*} target    目标节点 
     * @param {cc.Button|cc.Toggle} _switch  按钮 
     * @param {*} scriptName    脚本名
     * @param {*} data          传入的数据
     * @param {*} funName       方法名
     * return  该按钮的事件
     */
    static clickEvent(target, _switch, funName, data = null, scriptName = null) {
        if (!(_switch || scriptName || funName)) {
            console.error("MyUtils:clickEvent is transfor parameters error");
            return;
        }
        let clickEv = new cc.Component.EventHandler();
        clickEv.target = target.node;
        clickEv.component = target.name.split("<")[0];
        scriptName && (clickEv.component = scriptName.split("<")[0]);
        clickEv.handler = funName;
        data && (clickEv.customEventData = data);
        _switch.clickEvents.push(clickEv);
        return clickEv;
    }

    static CCFind(node, type = null, path = null) {
        if (!path) {
            return node.getComponent(type);
        } else if (!type) {
            return cc.find(path, node);
        }
        return cc.find(path, node).getComponent(type);
    }

    /**
     * 得到一个两数之间的随机整数，包括两个数在内
     * @param min
     * @param max
     * @returns {*}
     */
    static randomIntInclude = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        if (min == max)
            return min;
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    };

    /**
     * 在指定数组中随机取出N个不重复的数据
     * @param resArr
     * @param ranNum
     * @returns {Array}
     */
    static randomDiffValueFromArr = function (resArr, ranNum) {
        var arr = [];
        var result = [];
        if (!resArr || resArr.length <= 0 || ranNum <= 0) {
            return result;
        }
        for (var i = 0; i < resArr.length; i++) {
            arr.push(resArr[i]);
        }
        if (ranNum >= arr.length) {
            return arr;
        }
        ranNum = Math.min(ranNum, arr.length - 1);
        for (var i = 0; i < ranNum; i++) {
            var ran = RandomUtil.getRandomIntInclusive(0, arr.length - 1);
            result.push(arr.splice(ran, 1)[0]);
        };
        return result;
    };

    static stageHeight = function () {
        return cc.view.getVisibleSize().height;
    };

    static stageWidth = function () {
        return cc.view.getVisibleSize().width;
    };

    /**
     * 移动像素单位距离
     * @param horizonDistance verticalDistance
     * return linearVelocity 线性速度速度
     * */
    static getLinearVelocity = function (verticalDistance, horizonDistance = 0) {
        let linearVelocity = cc.v2();
        let gravity = Math.abs(cc.director.getPhysicsManager().gravity.y);

        let t1 = Math.sqrt(2 * verticalDistance / gravity);
        linearVelocity.y = gravity * t1;
        if (horizonDistance == 0) {
            linearVelocity.x = 0;
        } else {
            let h = 50;
            let t2 = Math.sqrt(2 * h / gravity);
            linearVelocity.x = horizonDistance / (t1 + t2);
        }
        return linearVelocity;
    }

    /**
     * down
     * */
    static getLinearVelocityDown = function (verticalDistance, horizonDistance) {
        let linearVelocity = cc.v2();
        let gravity = Math.abs(cc.director.getPhysicsManager().gravity.y);
        linearVelocity.y = 0;
        let t = Math.sqrt(2 * verticalDistance / gravity);
        linearVelocity.x = horizonDistance / t;
        return linearVelocity;
    }

    /**
     * 震屏效果
     * @param node
     * @param duration 震屏时间
     * */
    static getLinearVelocityDown = function (node, duration = 0.02, delay, callback) {
        node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.delayTime(delay),
                    cc.moveTo(duration, cc.p(5, 7)),
                    cc.moveTo(duration, cc.p(-6, 7)),
                    cc.moveTo(duration, cc.p(-13, 3)),
                    cc.moveTo(duration, cc.p(3, -6)),
                    cc.moveTo(duration, cc.p(-5, 5)),
                    cc.moveTo(duration, cc.p(2, -8)),
                    cc.moveTo(duration, cc.p(-8, -10)),
                    cc.moveTo(duration, cc.p(3, 10)),
                    cc.moveTo(duration, cc.p(0, 0)),
                    cc.callFunc(() => {
                        callback && callback();
                    })
                )
            )
        );
    };
    /**
     * 数值转换
     * */
    static numToString = function (value) {
        let tips = '';
        if (value <= 0) {
            tips = '0';
        } else if (value < 100000) {
            tips = value;
        } else if (value < 100000000) {
            tips = (value / 1000).toFixed(2) + '千';
        } else if (value < 10000000000) {

            tips = (value / 100000).toFixed(2) + '十万';
        } else if (value < 1000000000000) {

            tips = (value / 1000000).toFixed(2) + '百万';
        } else if (value < 100000000000000) {
            tips = (value / 100000000).toFixed(2) + '亿';
        }
        return tips;
    }

    /**
     * 保留小数
     * */
    static toFixed = function (num, count) {
        let str = '';
        let aStr = num.toString();
        let aArr = aStr.split('.');
        if (aArr.length > 1) {
            str = aArr[0] + "." + aArr[1].substr(0, count);
        }
        if (str == '') {
            str = aStr;
        }
        return str;
    }
    /**
     * 获取当前节点转换到某节点下的坐标
     * @param {cc.Node} curNode
     * @param {cc.Node} targetNode
     * */
    static getNodePos = function (curNode, targetNode) {
        let worldPos = curNode.parent.convertToWorldSpace(curNode.position);
        let pos = targetNode.convertToNodeSpace(worldPos);
        return pos;
    }
    /**
     * 判断时间戳是否在今天
     * */
    static isToday = function (time) {
        if (new Date(time).toDateString() === new Date().toDateString()) {
            return true;
        }
        return false;
    }
    /**
     * 格式化时间
     * fmt "yyyy-MM-dd hh:mm:ss"
     * */
    static timeFormat = function (second) {
        if (second < 60) {
            return '00' + '00:' + stringFormat(second, 2);
        } else if (second < 60 * 60) {
            return '00:' + stringFormat(Math.floor(second / 60), 2) + ':' + stringFormat(second % 60, 2);
        } else {
            return stringFormat(Math.floor(second / 60 / 60), 2) + ':' + stringFormat(Math.floor(second % 3600 / 60), 2) + ':' + stringFormat(second % 3600 % 60, 2);
        }
    }
    static dateFormat = function (date, fmt) {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }




    zeros = [
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000"
    ];
    static stringFormat = function (value, count) {
        let index = count - value.toString().length - 1;
        if (index < 0) {
            return value.toString();
        }
        return zeros[index] + value;
    }

    /**
     * scrowview 创建 children
     * */
    static addToContent = function (content, prefab, dataArr, script) {
        content.children.forEach(child => {
            child.active = false;
        });
        for (let i = 0; i < dataArr.length; ++i) {
            let node = content.children[i];
            if (!node) {
                node = cc.instantiate(prefab);
                content.addChild(node);
            }
            node.active = true;
            node.getComponent(script).init(dataArr[i], i);
        }
    }

    /**将数字转换为中文数字
     * */
    static changeNumber = function (number) {
        let nums = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        return nums[number - 1];
    }

    /**
     * 计算距离
     * @param p1
     * @param p2
     * @returns {number}
     */
    static distancePoint = function (p1, p2) {
        return MyUtils.distance(p1.x, p1.y, p2.x, p2.y);
    }

    /**
     * 计算距离
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {number}
     */
    static distance = function (x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    static centerPoint = function (p1, p2) {
        return {
            x: Math.min(p1.x, p2.x) + Math.abs(p1.x - p2.x) / 2,
            y: Math.min(p1.y, p2.y) + Math.abs(p1.y - p2.y) / 2,
        }
    }

    /**
     * 计算两点直线的弧度
     * @param p1
     * @param p2
     * @returns {number}
     */
    static radian = function (p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    /**
     * 计算两点直线的角度
     * @param p1
     * @param p2
     * @returns {number}
     */
    static angle = function (p1, p2) {
        return MyUtils.radiusToAngle(MyUtils.radian(p1, p2));
    }


    /**
     * 获取一个随机整数
     * @param max
     * @param min
     * @returns {number}
     */
    static makeRandomInt = function (max, min = 0) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static getRandomDirection = function () {
        let arr = [1, -1];
        return arr[makeRandomInt(2, 0)];

    }

    /**
     * 获取一个随机浮点数
     * @param max
     * @param min
     * @returns {number}
     */
    static makeRandomFloat = function (max, min = 0) {
        return Math.random() * (max - min) + min;
    }

    /**
     * 生成一个基于value的range偏移的随机数
     * @param value
     * @param range
     * @returns {number}
     */
    static makeRandomByRange = function (value, range) {
        return value + (Math.random() * range * 2 - range);
    }

    /**
     * 生成一个随机整数数组
     * @param len
     * @returns {string}
     */
    static makeRandomIntArr = function (len, max, min = 0) {
        let target = [];
        for (let i = 0; i < len; i++) {
            target.push(MyUtils.makeRandomInt(max));
        }

        return target;
    }

    /**
     * 生成一个范围数组
     * @param to
     * @param from
     * @param step
     * @returns {Array<number>}
     */
    static makeOrderIntArray = function (to, from = 0, step = 1) {
        let result = [];
        for (let i = from; i <= to; i += step) {
            result.push(i);
        }

        return result;
    }

    /**
     * 打乱一个数组
     * @param arr
     * @returns {any}
     */
    static mixArray = function (arr) {
        for (let i = 0, len = Math.round(arr.length / 2); i < len; i++) {
            let a = MyUtils.makeRandomInt(arr.length);
            let b = MyUtils.makeRandomInt(arr.length);
            let temp = arr[a];
            arr[a] = arr[b];
            arr[b] = temp;
        }

        return arr;
    }

    /**
     * 打乱一个二维数组
     * @param arr
     * @returns {}
     */
    static mixArray2 = function (arr) {
        let cH = arr[0].length;
        let cV = arr.length;
        let pos0 = [];
        let pos1 = [];
        for (let i = 0, len = Math.round(cH * cV / 2); i < len; i++) {
            pos0 = [MyUtils.makeRandomInt(cH), MyUtils.makeRandomInt(cV)];
            pos1 = [MyUtils.makeRandomInt(cH), MyUtils.makeRandomInt(cV)];
            let temp = arr[pos0[0]][pos0[1]];
            arr[pos0[0]][pos0[1]] = arr[pos1[0]][pos1[1]];
            arr[pos1[0]][pos1[1]] = temp;
        }

        return arr;
    }

    /**
     * 随机从一个数组中取出一项
     * @param arr
     * @param del
     * @returns {*}
     */
    static getRandomFromArray = function (arr, del = false) {
        let index = MyUtils.makeRandomInt(arr.length);
        let item = arr[index];
        if (del) {
            arr.splice(index, 1);
        }

        return item;
    }

    /**
     * 根据范围阻隔
     * @param value
     * @param lower
     * @param upper
     * @returns {number}
     */
    static fixRange = function (value, lower, upper) {
        if (value < lower) {
            value = lower;
        } else if (value > upper) {
            value = upper;
        }

        return value;
    }

    /**
     * 根据范围补足
     * @param value
     * @param max
     * @param min
     * @returns {number}
     */
    static roundFix = function (value, max, min = 0) {
        if (value < min) {
            value += max - min;
        } else if (value >= max) {
            value -= max - min;
        }

        return value;
    }

    /**
     * 弧度转角度
     * @param radius
     * @returns {number}
     */
    static radiusToAngle = function (radius) {
        return radius * 180 / Math.PI;
    }

    /**
     * 角度转弧度
     * @param angle
     * @returns {number}
     */
    static angleToRadius = function (angle) {
        return angle * Math.PI / 180;
    }

    /**
     * 数组向右旋转
     * @param arr
     * @returns {Array}
     */
    static turnRight = function (arr) {
        let temp = [];
        for (let t = 0, tl = arr.length; t < tl; t++) {
            temp.push([]);
        }
        for (let i = 0, il = arr.length; i < il; i++) {
            for (let j = 0, jl = arr[i].length; j < jl; j++) {
                temp[i][j] = arr[jl - j - 1][i];
            }
        }
        return temp;
    }

    /**
     * 数组向左旋转
     * @param arr
     * @returns {Array}
     */
    static turnLeft = function (arr) {
        let temp = [];
        for (let t = 0, tl = arr.length; t < tl; t++) {
            temp.push([]);
        }
        for (let i = 0, il = arr.length; i < il; i++) {
            for (let j = 0, jl = arr[i].length; j < jl; j++) {
                temp[i][j] = arr[j][jl - i - 1];
            }
        }
        return temp;
    }

    /**
     * 根据两点计算量化方向,用于手势识别
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @returns {number}
     */
    static calDir = function (x0, y0, x1, y1) {
        if (x0 == x1 && y0 == y1) {
            return -1;
        }

        let r = Math.atan2(y1 - y0, x1 - x0);
        let d;
        if (Math.abs(r) < Math.PI / 4) {
            d = 0;
        } else if (Math.abs(r) > Math.PI / 4 * 3) {
            d = 2;
        } else if (r > 0) {
            d = 1;
        } else {
            d = 3;
        }
        return d;
    }

    /**
     * 数值正负计算
     * @param num
     * @returns {number}
     */
    static sign = function (num) {
        return num == 0 ? 0 : (num > 0 ? 1 : -1);
    }

    /**
     * 把一个正整数分割成若干个整数
     * @param total
     * @param count
     * @returns {Array}
     */
    static split = function (total, count) {
        let result = [];
        for (let i = 0; i < count; i++) {
            result[i] = 0;
        }
        for (let i = 0; i < total; i++) {
            result[MyUtils.makeRandomInt(count)]++;
        }
        return result;
    }

    static bezierPoints = function (points, count) {
        let result = [];
        let t = 0;
        let arr2;

        let perT = 1 / (count - 1);
        for (let i = 0; i < count; i++) {
            let arr = points.concat();
            for (let k = arr.length - 1; k > 0; k--) {
                arr2 = [];
                for (let j = 0, lj = arr.length; j < lj - 1; j++) {
                    arr2.push(unit(arr[j], arr[j + 1], t));
                }
                arr = arr2;
            }

            result.push(arr[0]);

            t += perT;
        }

        function unit(a, b, t) {
            return {
                x: (b.x - a.x) * t + a.x,
                y: (b.y - a.y) * t + a.y,
            };
        }

        return result;
    }

    static pointInPolygon = function (points, point) {
        let polySides = points.length,
            i, j = polySides - 1;
        let oddNodes = false;

        let x = point.x,
            y = point.y;

        for (i = 0; i < polySides; i++) {
            let ix = points[i].x;
            let iy = points[i].y;
            let jx = points[j].x;
            let jy = points[j].y;
            if ((iy < y && jy >= y ||
                    jy < y && iy >= y) &&
                (ix <= x || jx <= x)) {
                if (ix + (y - iy) / (jy - iy) * (jx - ix) < x) {
                    oddNodes = !oddNodes;
                }
            }
            j = i;
        }

        return oddNodes;
    }

    static intersectToPolygon = function (points, intersect) {
        let aa = intersect[0];
        let bb = intersect[1];

        let cc, dd;

        let result = false;
        for (let i = 0, li = points.length; i < li; i++) {
            cc = points[i];
            if (i == li - 1) {
                dd = points[0];
            } else {
                dd = points[i + 1];
            }

            if (MyUtils.intersectToIntersect(aa, bb, cc, dd)) {
                result = true;
                break;
            }
        }

        return result;
    }

    static intersectToIntersect = function (aa, bb, cc, dd) {
        let delta = determinant(bb.x - aa.x, cc.x - dd.x, bb.y - aa.y, cc.y - dd.y);
        if (delta <= (1e-6) && delta >= -(1e-6)) {
            return false;
        }
        let namenda = determinant(cc.x - aa.x, cc.x - dd.x, cc.y - aa.y, cc.y - dd.y) / delta;
        if (namenda > 1 || namenda < 0) {
            return false;
        }
        let miu = determinant(bb.x - aa.x, cc.x - aa.x, bb.y - aa.y, cc.y - aa.y) / delta;
        if (miu > 1 || miu < 0) {
            return false;
        }
        return true;

        function determinant(v1, v2, v3, v4) {
            return (v1 * v3 - v2 * v4);
        }
    }

    static segmentsIntr = function (a, b, c, d) {
        let area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
        let area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

        if (area_abc * area_abd >= 0) {
            return false;
        }

        let area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
        let area_cdb = area_cda + area_abc - area_abd;
        if (area_cda * area_cdb >= 0) {
            return false;
        }

        let t = area_cda / (area_abd - area_abc);
        let dx = t * (b.x - a.x),
            dy = t * (b.y - a.y);
        return {
            x: a.x + dx,
            y: a.y + dy
        };
    }

    static isNullArray = function (arr) {
        let result = true;
        arr.some(item => {
            if (item !== undefined && item !== null) {
                result = false;

                return true;
            }
        });

        return result;
    }


























}