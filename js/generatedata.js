/**
 * Created by Hermit on 16/5/23.
 */
var tmp_single_data = [];
var radarData = [
    {
        "key": "MACD",
        "value": 0
    }, {
        "key": "KDJ",
        "value": 40
    }, {
        "key": "RSI",
        "value": 56
    }, {
        "key": "换手率",
        "value": 29
    }, {
        "key": "量比",
        "value": 60
    }];

var intradayChartData = [];

var tmp_future_data = [];

Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

function generateGradeData() {
    var firstDate = new Date();
    firstDate.setHours(0, 0, 0, 0);

    firstDate.setDate(firstDate.getDate() - 365);
    for (var i = 0; i < 365; i++) {
        var newDate = new Date(firstDate);

        newDate.setDate(newDate.getDate() + i);
        var open = Math.round(Math.random() * (30) + 100);

        var close = open + Math.round(Math.random() * (15) - Math.random() * 10);
        var low;
        if (open < close) {
            low = open - Math.round(Math.random() * 5);
        } else {
            low = close - Math.round(Math.random() * 5);
        }

        var high;
        if (open < close) {
            high = close + Math.round(Math.random() * 5);
        } else {
            high = open + Math.round(Math.random() * 5);
        }
        var MA_5 = Math.round(Math.random() * 50 + 100);
        var MA_20 = Math.round(Math.random() *  50 + 90);

        var volume = Math.round(Math.random() * (1000 + i)) + 100 + i;
        var amount = Math.random() * 1000 * 2;

        var MACD = Math.pow(-1, i) * Math.random() * 5;
        var DIFF = MACD + Math.random() * 10;
        var DEA = MACD - Math.random() * 5;
        var atr = MACD - Math.random() * 8;

        var K = MA_5;
        var D = MA_5 + Math.random() * 10;
        var J = MA_5 + Math.random() * 2;

        var RSI = MA_5;

        var Boll_upper = 10 * Math.random().toFixed(2);
        var Boll_middle = 5 * Math.random().toFixed(2);
        var Boll_lower = 7 * Math.random().toFixed(2);

        var date = newDate.Format("yyyy-MM-dd");

        tmp_single_data[i] = ({
            "date": date,

            "open": open,
            "close": close,
            "high": high,
            "low": low,
            "ma5": MA_5.toFixed(2),
            "ma20": MA_20.toFixed(2),

            "volume": volume,
            "total": amount.toFixed(2),

            "macd": MACD.toFixed(2),
            "diff": DIFF.toFixed(2),
            "dea": DEA.toFixed(2),
            "atr": atr.toFixed(2),

            "slowK": K.toFixed(2),
            "slowD": D.toFixed(2),
            "slowJ": J.toFixed(2),

            "rsi": RSI.toFixed(2),

            "boll_upper": Boll_upper.toFixed(2),
            "boll_middle": Boll_middle.toFixed(2),
            "boll_low": Boll_lower.toFixed(2)
        });
    }
}

function generateDynamicData() {
    var firstDate = new Date(2012, 0, 1);
    firstDate.setDate(firstDate.getDate() - 1000);
    firstDate.setHours(0, 0, 0, 0);

    for (var i = 0; i < 1000; i++) {
        var newDate = new Date(firstDate);
        newDate.setHours(0, i, 0, 0);

        var a = Math.round(Math.random() * (40 + i)) + 100 + i;
        var b = Math.round(Math.random() * 100000000);

        intradayChartData.push({
            date: newDate,
            value: a,
            volume: b
        });
    }
}

function generateFutureData() {
    var firstDate = new Date(2012, 0, 1);
    firstDate.setDate(firstDate.getDate() - 1000);
    firstDate.setHours(0, 0, 0, 0);

    for (var i = 1; i <= 3; i++) {
        var newDate = new Date();
        newDate.setDate(firstDate.getDate() + i);

        var point = Math.round(Math.random() * (40 + i)) + 100 + i;
        var max = point + Math.random() * 10;
        var min = point - Math.random() * 10;

        tmp_future_data.push({
            date: newDate,
            max: max.toFixed(2),
            point: point.toFixed(2),
            min: min.toFixed(2)
        });
    }
}