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
}

var stocks = [];
var stocksData = [];
var radarData = [{
    key: "后复权价"
}, {
    key: "换手率"
}, {
    key: "市盈率"
}, {
    key: "市净率"
}, {
    key: "量比"
}];

var futureData = [];
var MACDData = [];
var volumeData = [];
var totalMoneyData = [];
var RSIData = [];
var KDJData = [];
var bollData = [];

var radarChart;
var futureChart;
var MACDChart;
var volumeChart;
var totalMoneyChart;
var RSIChart;
var KDChart;

AmCharts.ready(function() {
    AmCharts.theme = AmCharts.themes.dark;

    initCompareStock();

    initRadarChart();
    initFutureChart();
    initMACDChart();
    //initVolumeChart();
    //initTotalMoneyChart();
    initKDChart();
    initRSIChart();
    initBollChart();
});

var charts;

function initCompareStock() {
    //updateData();
    generateStocksData();
    stocksData = tmp_stocks_data;
    generateChartsData();
}


/****************************************
 * 图表数据的转换
 * */
function generateChartsData() {

    if(stocksData.length==0) return;
    var i, j;
    for(i=0;i<stocksData.length;i++){
        radarData[0][stocksData[i].id] = stocksData[i].radar_data.adj_price;
        radarData[1][stocksData[i].id] = stocksData[i].radar_data.turnover;
        radarData[2][stocksData[i].id] = stocksData[i].radar_data.pe_ttm;
        radarData[3][stocksData[i].id] = stocksData[i].radar_data.pb;
        radarData[4][stocksData[i].id] = stocksData[i].radar_data.quantityrelative;
    }
    var length = stocksData[0].other_data.length;
    for(i=0;i<length;i++){
        var date = stocksData[0].other_data[i].date;

        //var futureJson = {"date": date};
        var MACDJson = {"date": date};
        var volumeJson = {"date": date};
        var totalMoneyJson = {"date": date};
        var RSIJson = {"date": date};
        var KDJson = {"date": date};
        var bollJson = {"date": date};

        for(j=0;j<stocksData.length;j++){
            var id = stocksData[j].id;
            var otherData = stocksData[j].other_data;

            //futureJson[id] = otherData[i].future;
            MACDJson[id] = otherData[i].MACD;
            volumeJson[id] = otherData[i].volume;
            totalMoneyJson[id] = otherData[i].totalMoney;
            RSIJson[id] = otherData[i].RSI;
            KDJson[id] = otherData[i].KD;
            bollJson[id] = otherData[i].boll;
        }

        //futureData.push(futureJson);
        MACDData.push(MACDJson);
        volumeData.push(volumeJson);
        totalMoneyData.push(totalMoneyJson);
        RSIData.push(RSIJson);
        KDJData.push(KDJson);
        bollData.push(bollJson);
    }

    for(i=0;i<3;i++){
        var date2 = stocksData[0].forecast_data[i].date;

        var futureJson = {"date": date2};

        for(j=0;j<stocksData.length;j++){
            var id = stocksData[j].id;
            var future = stocksData[j].forecast_data;
            futureJson[id] = future[i].forecast;
        }
        futureData.push(futureJson);
    }

}

function initRadarChart() {
    radarChart = new AmCharts.AmRadarChart();
    radarChart.dataProvider = radarData;
    radarChart.categoryField = "key";

    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisAlpha = 0.15;
    valueAxis.minimum = 0;
    valueAxis.dashLength = 3;
    valueAxis.axisTitleOffset = 20;
    valueAxis.gridCount = 5;
    radarChart.addValueAxis(valueAxis);

    for(var i=0;i<stocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.title = stocksData[i].id;
        graph.valueField = stocksData[i].id;
        graph.bullet = "round";
        graph.balloonText = "score: [[value]]";
        radarChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "left";
    radarChart.legend = legend;

    // WRITE
    radarChart.write("compare_grade");
}

function initFutureChart() {
    futureChart = new AmCharts.AmSerialChart();
    futureChart.dataProvider = futureData;
    futureChart.categoryField = "date";
    futureChart.dataDateFormat = "YYYY-MM-DD";

    var categoryAxis = futureChart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.gridColor = "#000000";
    categoryAxis.axisColor = "#555555";
    // we want custom date formatting, so we change it in next line
    categoryAxis.dateFormats = [{
        period: 'DD',
        format: 'DD'
    }, {
        period: 'WW',
        format: 'MMM DD'
    }, {
        period: 'MM',
        format: 'MMM'
    }, {
        period: 'YYYY',
        format: 'YYYY'
    }];

    for(var i=0;i<stocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = stocksData[i].id;
        graph.valueField = stocksData[i].id;
        graph.bullet = "round";
        futureChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    futureChart.legend = legend;

    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to fals if you want the cursor to work in "select" mode
    futureChart.addChartCursor(chartCursor);

    futureChart.write('compare_forecast');
}

function initMACDChart() {
    MACDChart = new AmCharts.AmSerialChart();
    MACDChart.dataProvider = MACDData;
    MACDChart.categoryField = "date";
    MACDChart.dataDateFormat = "YYYY-MM-DD";

    var categoryAxis = MACDChart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.gridColor = "#000000";
    categoryAxis.axisColor = "#555555";
    // we want custom date formatting, so we change it in next line
    categoryAxis.dateFormats = [{
        period: 'DD',
        format: 'DD'
    }, {
        period: 'WW',
        format: 'MMM DD'
    }, {
        period: 'MM',
        format: 'MMM'
    }, {
        period: 'YYYY',
        format: 'YYYY'
    }];

    for(var i=0;i<stocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "column";
        graph.title = stocksData[i].id;
        graph.valueField = stocksData[i].id;
        graph.fillAlphas = 1;
        MACDChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    MACDChart.legend = legend;

    //var scrollbar = new AmCharts.ChartScrollbar();
    //scrollbar.graphType = "line";
    //MACDChart.addChartScrollbar(scrollbar);

    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to fals if you want the cursor to work in "select" mode
    MACDChart.addChartCursor(chartCursor);

    MACDChart.write('macd_graph');

    //zoomChart(MACDChart, MACDData);
}

function initVolumeChart() {
    volumeChart = new AmCharts.AmSerialChart();
    volumeChart.dataProvider = volumeData;
    volumeChart.categoryField = "date";
    volumeChart.dataDateFormat = "YYYY-MM-DD";

    var categoryAxis = volumeChart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.gridColor = "#000000";
    categoryAxis.axisColor = "#555555";
    // we want custom date formatting, so we change it in next line
    categoryAxis.dateFormats = [{
        period: 'DD',
        format: 'DD'
    }, {
        period: 'WW',
        format: 'MMM DD'
    }, {
        period: 'MM',
        format: 'MMM'
    }, {
        period: 'YYYY',
        format: 'YYYY'
    }];

    for(var i=0;i<stocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "column";
        graph.title = stocksData[i].id;
        graph.valueField = stocksData[i].id;
        graph.fillAlphas = 1;
        volumeChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    volumeChart.legend = legend;

    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to fals if you want the cursor to work in "select" mode
    volumeChart.addChartCursor(chartCursor);

    volumeChart.write('volume');
}

function initTotalMoneyChart() {
    totalMoneyChart = new AmCharts.AmSerialChart();
    totalMoneyChart.dataProvider = totalMoneyData;
    totalMoneyChart.categoryField = "date";
    totalMoneyChart.dataDateFormat = "YYYY-MM-DD";

    var categoryAxis = totalMoneyChart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.gridColor = "#000000";
    categoryAxis.axisColor = "#555555";
    // we want custom date formatting, so we change it in next line
    categoryAxis.dateFormats = [{
        period: 'DD',
        format: 'DD'
    }, {
        period: 'WW',
        format: 'MMM DD'
    }, {
        period: 'MM',
        format: 'MMM'
    }, {
        period: 'YYYY',
        format: 'YYYY'
    }];

    for(var i=0;i<stocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = stocksData[i].id;
        graph.valueField = stocksData[i].id;
        graph.fillAlphas = 0;
        totalMoneyChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    totalMoneyChart.legend = legend;

    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to fals if you want the cursor to work in "select" mode
    totalMoneyChart.addChartCursor(chartCursor);

    totalMoneyChart.write('totalMoney');
}

function initRSIChart() {
    RSIChart = new AmCharts.AmSerialChart();
    RSIChart.dataProvider = RSIData;
    RSIChart.categoryField = "date";
    RSIChart.dataDateFormat = "YYYY-MM-DD";

    var categoryAxis = RSIChart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.gridColor = "#000000";
    categoryAxis.axisColor = "#555555";
    // we want custom date formatting, so we change it in next line
    categoryAxis.dateFormats = [{
        period: 'DD',
        format: 'DD'
    }, {
        period: 'WW',
        format: 'MMM DD'
    }, {
        period: 'MM',
        format: 'MMM'
    }, {
        period: 'YYYY',
        format: 'YYYY'
    }];

    for(var i=0;i<stocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = stocksData[i].id;
        graph.valueField = stocksData[i].id;
        graph.fillAlphas = 0;
        RSIChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    RSIChart.legend = legend;

    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to fals if you want the cursor to work in "select" mode
    RSIChart.addChartCursor(chartCursor);

    RSIChart.write('rsi_graph');
}

function initKDChart() {
    KDChart = new AmCharts.AmSerialChart();
    KDChart.dataProvider = KDJData;
    KDChart.categoryField = "date";
    KDChart.dataDateFormat = "YYYY-MM-DD";

    var categoryAxis = KDChart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.gridColor = "#000000";
    categoryAxis.axisColor = "#555555";
    // we want custom date formatting, so we change it in next line
    categoryAxis.dateFormats = [{
        period: 'DD',
        format: 'DD'
    }, {
        period: 'WW',
        format: 'MMM DD'
    }, {
        period: 'MM',
        format: 'MMM'
    }, {
        period: 'YYYY',
        format: 'YYYY'
    }];

    for(var i=0;i<stocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = stocksData[i].id;
        graph.valueField = stocksData[i].id;
        graph.fillAlphas = 0;
        KDChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    KDChart.legend = legend;

    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to fals if you want the cursor to work in "select" mode
    KDChart.addChartCursor(chartCursor);

    KDChart.write('kdj_graph');
}

function initBollChart() {
    bollChart = new AmCharts.AmSerialChart();
    bollChart.dataProvider = bollData;
    bollChart.categoryField = "date";
    bollChart.dataDateFormat = "YYYY-MM-DD";

    var categoryAxis = bollChart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.gridColor = "#000000";
    categoryAxis.axisColor = "#555555";
    // we want custom date formatting, so we change it in next line
    categoryAxis.dateFormats = [{
        period: 'DD',
        format: 'DD'
    }, {
        period: 'WW',
        format: 'MMM DD'
    }, {
        period: 'MM',
        format: 'MMM'
    }, {
        period: 'YYYY',
        format: 'YYYY'
    }];

    for(var i=0;i<stocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = stocksData[i].id;
        graph.valueField = stocksData[i].id;
        graph.fillAlphas = 0;
        bollChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    bollChart.legend = legend;

    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to fals if you want the cursor to work in "select" mode
    bollChart.addChartCursor(chartCursor);

    bollChart.write('boll_graph');
}

function zoomChart(chart, chartData) {
    console.log(chart);
    chart.zoomToDates(chartData[chartData.length-10].date.replace(/-/g, "/"),
        chartData[chartData.length-1].date.replace(/-/g, "/"));
}

/*************************************************
 * 对比股票的删除和数据更新
 * */
function deleteCompareStocks(id) {
    var tmp = $.cookie('compareStock');

    if(tmp==undefined) return;

    stocks = $.cookie('compareStock').split(',');

    var stock = id;
    var index;

    for(index=0;index<stocks.length;index++){
        if(stocks[index]==stock) break;
    }

    stocks.splice(index, 1);
    //stocksData.splice(index, 1);//todo

    if(stocks.length==0){
        $.cookie("compareStock", null, {
            expire: -10,
            path: '/'
        });
        console.log($.cookie("compareStock"));
    }else{
        var result = stocks.join(",");
        $.cookie('compareStock', result, {
            expire: 10,
            path: '/'
        });

        console.log($.cookie('compareStock'));
    }
}

function updateData() {
    var tmp = $.cookie('compareStock');
    if(tmp==undefined) return;
    var currentStocks = $.cookie('compareStock').split(',');
    if(currentStocks[0]=="null"){
        currentStocks.shift();
    }
    if(stocks.toString()!=currentStocks.toString()) {
        var unchanges = [];
        //stocks = currentStocks;
        var i, j;
        for(i=0;i<stocks.length;i++){
            for(j=0;j<currentStocks.length;j++){
                if(stocks[i]==currentStocks[j]){
                    unchanges.push(stocks[i]);
                }
            }
        }
        var changes = [];
        for(i=0;i<currentStocks.length;i++){
            var notIn = true;
            for(j=0;j<unchanges.length;j++){
                if(unchanges[i]==currentStocks[j]){
                    notIn = false;
                }
            }
            if(notIn){
                changes.push(currentStocks[i]);
            }
        }

        for(i=0;i<changes.length;i++){
            stocks.push(changes[i]);
            if(stocks.length>4){
                var id = stocks.shift();
            }

            console.log(stocks);
        }
        //stocks = currentStocks;
        $.ajax({

            success: function(data) {

            }
        });
    }
}