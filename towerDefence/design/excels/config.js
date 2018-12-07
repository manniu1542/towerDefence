const config = {
    'custom': {
        'key': 'id',
        'names': ['id', 'minutia', 'enemy', 'startTime', 'rewardTime', 'power', 'intervalTime'],
        'type': {self: {}, subset: {}},
        'method': function (data) {
            for (let i in data) {
                let obj = {id: i, minutia: []};
                data[i].forEach(p => {
                    delete p['id'];
                });
                obj.minutia = data[i];
                data[i] = obj;
            }
        },
    },
    'enemys': {
        'key': 'id',
        'names': ['id', 'speed','hp'],
        'type': {self: [], subset: null},
        'method': function (data) {
            //data.sort((a, b) => b.uuid - a.uuid);
        }
    },
    'towers': {
        'key': 'id',
        'names': ['id', 'attackSpeed','harm','hp','range'],
        'type': {self: [], subset: null},
        'method': function (data) {
            //data.sort((a, b) => b.uuid - a.uuid);
        }
    },

}
//type 属性： 导出的该类 属性为self， 它的下一层级为subset (若为null则终止下下层级且该层级为对象{ 表格某一横排 })
module.exports = config;