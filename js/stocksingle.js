var navList;
var navContents;
var preNavIndex;
var secondNavList = ['<div id="nav-sec0" class="nav-sec-item"><a href="#k_wrapper" class="targeted">K线图</a> <a href="#macd_wrapper">MACD</a> <a href="#rsi_wrapper">RSI</a> <a href="#kdj_wrapper">KDJ</a><a href="#boll_wrapper">BOLL</a></div>',
    '<div id="nav-sec1" class="nav-sec-item"> <a href="#grade_wrapper" class="targeted">股票评分</a> <a href="#bench_relative_wrapper">大盘相关</a> </div>',
    '<div id="nav-sec2" class="nav-sec-item"> <a href="#forecast_one" class="targeted">走势预测</a> </div>',
    '<div id="nav-sec3" class="nav-sec-item"> <a href="#dynamic_trade_wrapper" class="targeted">实时交易</a> <a href="#text_instruction">实时分析</a> </div>',
    '<div id="nav-sec4" class="nav-sec-item"> <a href="#company_intro" class="targeted">公司简介</a> <a href="#company_rise">增长</a> <a href="#company_profit">盈利能力</a> <a href="#company_financial">财务状况</a> </div>'];
window.onload = function(){
    navList = document.querySelectorAll(".nav-item");
    navContents = document.querySelectorAll(".stock_content");
    preNavIndex = 0;
    navListener();
};

window.onscroll = function(){
    //if(window.scrollY > 190){
    //    $("#nav").css({
    //        "position":"absolute",
    //        "top":window.scrollY+70+"px",
    //        "background":"rgba(3,27,47,1)"
    //    })
    //}else{
    //    $("#nav").css({
    //        "top":0,
    //        "position":"relative",
    //        "background":"none"
    //    })
    //}

    if(window.scrollY >= 270 ){
        $("#nav-sec").css({
            "position":"absolute",
            "top":window.scrollY+110+"px"
        });
    }else{
        $("#nav-sec").css({
            "position":"absolute",
            "top":"380px"
        });
    }
};

function navListener(){
    $("#nav").on("click",".nav-item",function(){
        var index = 0;
        for(var i = 0;i < navList.length;i++){
            if(this == navList[i]){
                index = i;
            }
        }
        $(navList[preNavIndex]).removeClass("active");
        $(navList[index]).addClass("active");
        $(navContents[preNavIndex]).hide();
        $(navContents[index]).show();
        $("#nav-sec").html(secondNavList[index]);
        preNavIndex = index;
    });

    $("#nav-sec").on("click","a",function(){
        $(this.parentNode).find("a").each(function(){
           $(this).removeClass("targeted");
        });
        $(this).addClass("targeted");
    }).on("click","#toTop",function(){
        console.log("111");
        window.scrollTo(0,0);
        $("#nav-sec").css({
            "position":"absolute",
            "top":"380px"
        });
    })


}

var stock_id;

window.setInterval(requestDynamicData, 5000);

/***************************************************
 * 动态更新数据
 * */
function requestDynamicData() {
    console.log("request");
    if(stock_id==undefined||stock_id==null){
        return;
    }
    $.ajax({
        type: 'GET',
        url: "/stock/active.do?id="+stock_id,
        dataType: 'json',
        success: function(data) {
            updateDynamicData(data);
        },
        error: function() {
            //alert("current futureData error");
        }
    });
}

function updateDynamicData(data) {
    $("#dynamic_price").html();
    $("#dynamic_devia_val").html();
    $("#dynamic_devia_per").html();
    $("#dynamic_open").html();
    $("#dynamic_volume").html();
    $("#dynamic_close").html();
    $("#dynamic_high").html();
    $("#dynamic_low").html();
    $("#dynamic_up_stop").html();
    $("#dynamic_inner_count").html();
    $("#dynamic_amount").html();
    $("#dynamic_committee").html();
    $("#dynamic_avail_amount").html();
    $("#dynamic_pe").html();
    $("#dynamic_profit_per").html();
    $("#dynamic_total_volume").html();
    $("#dynamic_turnover").html();
    $("#dynamic_down_stop").html();
    $("#dynamic_outer_count").html();
    $("#dynamic_amplitude").html();
    $("#dynamic_quantity_ratio").html();
    $("#dynamic_total_amount").html();
    $("#dynamic_pb").html();
    $("#dynamic_value_per_stock").html();
    $("#dynamic_available_stock").html();
}

/****************************************************
 * 添加对比股票
 * */
function addCompareStock(id) {

    var tmp = $.cookie('compareStock');

    var result;

    if(tmp!=undefined){
        var result = tmp.split(",");
        if(result[0]=="null"){
            result.shift();
        }

        for(var i=0;i<result.length;i++){
            if(result[i]==id){
                return;
            }
        }

        result.push(id);

        if(result.length>4){
            result.shift();
        }

    }else{
        result = [id];
    }

    $.cookie('compareStock', result.join(','), {
        expire: 10,
        path: '/'
    });

    console.log($.cookie('compareStock'));
}

/******************************************************
 * 添加/删除自选股
 */
function operateFavStock() {
    var tmp = $.cookie('favouriteStock');
    var isExist = false;
    var result;

    if(tmp!=undefined){
        result = tmp.split(",");

        var i;
        for(i=0;i<result.length;i++){
            if(result[i]==stock_id){
                isExist = true;
                return;
            }
        }

        if(isExist){
            //删除
            result.splice(i, 1);
            if(result.length==0){
                $.cookie('favouriteStock', null, {
                    expire: -1
                });
                return;
            }
        }else{
            //添加
            result.push(stock_id);
        }

    }else{
        result = [stock_id];
    }

    $.cookie('favouriteStock', result.join(","), {
        expire: 10
    });
}

/*
* 图表的变量声明以及初始化等方法
* */
var chartData;
var graderData;
var dynamicData;
var futureData;

var tabChartData = [];

var dataSet;

var charts = [];

var valueChart;
//var volumeChart;
var macdChart;
var rsiChart;
var kdjChart;
var bollChart;

var radarChart;

var intradayChart;

var futureChart;

AmCharts.ready(function() {
    AmCharts.theme = AmCharts.themes.dark;
    generateGradeData();
    generateDynamicData();
    generateFutureData();
    chartData = tmp_single_data;
    graderData = radarData;
    dynamicData = intradayChartData;
    futureData = tmp_future_data;

    for(var i=chartData.length-20;i<chartData.length;i++){
        tabChartData.push(chartData[i]);
    }

    initDataSet();
    initValueChart();
    initMacdChart();
    initRsiChart();
    initKdjChart();
    initBollChart();

    initGradeChart();
    initDynamicChart();
    initFutureChart();

    //showBasic();
    //showDynamic();
});

function initDataSet() {
    dataSet = new AmCharts.DataSet();
    dataSet.fieldMappings = [{
        fromField: "open",
        toField: "open"
    }, {
        fromField: "close",
        toField: "close"
    }, {
        fromField: "high",
        toField: "high"
    }, {
        fromField: "low",
        toField: "low"
    }, {
        fromField: "ma5",
        toField: "ma5"
    }, {
        fromField: "ma20",
        toField: "ma20"
    }, {
        fromField: "volume",
        toField: "volume"
    }, {
        fromField: "total",
        toField: "total"
    }, {
        fromField: "macd",
        toField: "macd"
    }, {
        fromField: "diff",
        toField: "diff"
    }, {
        fromField: "dea",
        toField: "dea"
    }, {
        fromField: "atr",
        toField: "atr"
    }, {
        fromField: "slowK",
        toField: "slowK"
    }, {
        fromField: "slowD",
        toField: "slowD"
    }, {
        fromField: "slowJ",
        toField: "slowJ"
    }, {
        fromField: "rsi",
        toField: "rsi"
    }, {
        fromField: "boll_upper",
        toField: "boll_upper"
    }, {
        fromField: "boll_middle",
        toField: "boll_middle"
    }, {
        fromField: "boll_low",
        toField: "boll_low"
    }];

    dataSet.dataProvider = chartData;
    dataSet.categoryField = "date";
}

function initValueChart() {
    valueChart = new AmCharts.AmStockChart();
    valueChart.addClassNames = true;

    valueChart.dataSets = [dataSet];

    //*******************************************ValuePanel
    var valuePanel = new AmCharts.StockPanel();
    valuePanel.title = "Value";

    var valueGraph = new AmCharts.StockGraph();
    valueGraph.title = "Value";
    valueGraph.type = "candlestick";
    valueGraph.openField = "open";
    valueGraph.closeField = "close";
    valueGraph.highField = "high";
    valueGraph.lowField = "low";
    valueGraph.valueField = "close";
    valueGraph.lineColor = "#eb6877";
    valueGraph.fillColors = "#eb6877";
    valueGraph.negativeLineColor = "#88cc66";
    valueGraph.negativeFillColors = "#88cc66";
    valueGraph.fillAlphas = 1;
    valueGraph.balloonText = "open:<b>[[open]]</b><br>close:<b>[[close]]</b><br>low:<b>[[low]]</b><br>high:<b>[[high]]</b>";
    valueGraph.useDataSetColors = false;
    valuePanel.addStockGraph(valueGraph);

    var ma5Graph = new AmCharts.StockGraph();
    ma5Graph.title = "MA 5";
    ma5Graph.type = "line";
    ma5Graph.valueField = "ma5";
    ma5Graph.fillColors = "#ffffcc";
    ma5Graph.lineColor = "#ffffCC";
    ma5Graph.balloonText = "MA 5: <b>[[value]]</b>";
    ma5Graph.useDataSetColors = false;
    valuePanel.addStockGraph(ma5Graph);

    var ma20Graph = new AmCharts.StockGraph();
    ma20Graph.title = "MA 20";
    ma20Graph.type = "line";
    ma20Graph.valueField = "ma20";
    ma20Graph.balloonText = "MA 20: <b>[[value]]</b>";
    valuePanel.addStockGraph(ma20Graph);

    var valueLegend = new AmCharts.StockLegend();
    valueLegend.position = "top";
    valuePanel.stockLegend = valueLegend;


    var volumePanel = new AmCharts.StockPanel();
    volumePanel.title = "Volume/Total";
    volumePanel.showCategoryAxis = false;

    var volumeAxis = new AmCharts.ValueAxis();
    volumeAxis.inside = true;
    var totalAxis = new AmCharts.ValueAxis();
    totalAxis.inside = true;
    volumePanel.addValueAxis(volumeAxis);
    volumePanel.addValueAxis(totalAxis);

    var volumeGraph = new AmCharts.StockGraph();
    volumeGraph.title = "Volume/Total";
    volumeGraph.type = "column"
    volumeGraph.fillAlphas = 1;
    volumeGraph.valueField = "volume";
    volumeGraph.fillColors = "#cc9966";
    volumeGraph.lineColor = "#cc9966";
    volumeGraph.valueAxis = volumeAxis;
    volumeGraph.useDataSetColors = false;

    var totalGraph = new AmCharts.StockGraph();
    totalGraph.title = "Total";
    totalGraph.type = "line";
    totalGraph.valueField = "total";
    totalGraph.useDataSetColors = false;

    volumePanel.addStockGraph(volumeGraph);
    volumePanel.addStockGraph(totalGraph);

    var volumeLegend = new AmCharts.StockLegend();
    volumeLegend.position = "top";
    volumePanel.stockLegend = volumeLegend;

    var cursor = new AmCharts.ChartCursorSettings();
    cursor.fullWidth = true;
    cursor.valueBalloonsEnabled = true;
    cursor.cursorAlpha = 0.1
    valueChart.chartCursorSettings = cursor;

    var scrollbar = new AmCharts.ChartScrollbarSettings();
    scrollbar.updateOnReleaseOnly = false;
    //scrollbar.position = "top";
    valueChart.chartScrollbarSettings = scrollbar;

    var categoryAxe = new AmCharts.CategoryAxesSettings();
    categoryAxe.groupToPeriods = ["WW", "MM"];
    categoryAxe.maxSeries = 60;
    valueChart.categoryAxesSettings = categoryAxe;

    valuePanel.percentHeight = 65;
    volumePanel.percentHeight = 35;

    valueChart.panels = [valuePanel, volumePanel];

    valueChart.write("stock_graph");

    zoomChart(valueChart, chartData);
}

function initMacdChart() {
    macdChart = new AmCharts.AmSerialChart();
    charts.push(macdChart);

    //macd图表的全局设置
    macdChart.addClassNames = true;
    macdChart.title = "MACD";
    macdChart.dataProvider = tabChartData;
    macdChart.categoryField = "date";
    macdChart.dataDateFormat = "YYYY-MM-DD";

    var macdAxis = new AmCharts.ValueAxis();
    macdAxis.inside = true;
    macdChart.addValueAxis(macdAxis);

    var categoryAxis = macdChart.categoryAxis;
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
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

    var macdGraph = new AmCharts.AmGraph();
    macdGraph.title = "MACD";
    macdGraph.type = "column";
    macdGraph.valueField = "macd";
    macdGraph.fillAlphas = 1;
    macdGraph.fillColors = "#6699cc";
    macdGraph.lineColor = "#6699cc";
    macdGraph.useDataSetColors = false;
    macdGraph.balloonText = "MACD: <b>[[value]]</b>";
    //macdGraph.fillColors = "#eb6877";
    //macdGraph.negativeFillColors = "#88bb66";
    macdChart.addGraph(macdGraph);

    var diffGraph = new AmCharts.AmGraph();
    diffGraph.title = "DIFF";
    diffGraph.type = "line";
    diffGraph.valueField = "diff";
    diffGraph.lineColor = "#669999";
    diffGraph.useDataSetColors = false;
    diffGraph.balloonText = "DIFF: <b>[[value]]</b>";
    macdChart.addGraph(diffGraph);

    var atrGraph = new AmCharts.AmChart();
    atrGraph.title = "ATR";
    atrGraph.type = "line";
    atrGraph.valueField = "atr";
    atrGraph.lineColor = "#990033";
    atrGraph.useDataSetColors = false;
    atrGraph.balloonText = "ATR: <b>[[value]]</b>";
    macdChart.addGraph(atrGraph);

    var deaGraph = new AmCharts.AmChart();
    deaGraph.title = "DEA";
    deaGraph.valueField = "dea";
    deaGraph.lineColor = "#cccc99";
    deaGraph.useDataSetColors = false;
    deaGraph.balloonText = "DEA: <b>[[value]]</b>";
    macdChart.addGraph(deaGraph);

    var cursor = new AmCharts.ChartCursor();
    cursor.valueBalloonsEnabled = true;
    cursor.fullWidth = true;
    cursor.cursorAlpha = 0.1;

    macdChart.chartCursor = cursor;

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    macdChart.legend = legend;

    macdChart.write("macd_graph");

    zoomChart(macdChart, tabChartData);
}

function initRsiChart() {
    rsiChart = new AmCharts.AmSerialChart();
    charts.push(rsiChart);

    //rsi图表的全局设置
    rsiChart.addClassNames = true;
    rsiChart.title = "RSI";
    rsiChart.dataProvider = tabChartData;
    rsiChart.categoryField = "date";
    rsiChart.dataDateFormat = "YYYY-MM-DD";

    var rsiAxis = new AmCharts.ValueAxis();
    rsiAxis.inside = true;

    rsiChart.addValueAxis(rsiAxis);

    var categoryAxis = rsiChart.categoryAxis;
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
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

    var rsiGraph = new AmCharts.AmGraph();
    rsiGraph.title = "RSI";
    rsiGraph.type = "line";
    rsiGraph.valueField = "rsi";
    rsiGraph.lineColor = "#669999";
    rsiGraph.useDataSetColors = false;
    rsiGraph.balloonText = "RSI: <b>[[value]]</b>";
    rsiChart.addGraph(rsiGraph);

    var cursor = new AmCharts.ChartCursor();
    cursor.valueBalloonsEnabled = true;
    cursor.fullWidth = true;
    cursor.cursorAlpha = 0.1;
    rsiChart.chartCursor = cursor;

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    rsiChart.legend = legend;

    rsiChart.write("rsi_graph");

    zoomChart(rsiChart, tabChartData);
}

function initKdjChart() {
    kdjChart = new AmCharts.AmSerialChart();
    charts.push(kdjChart);

    //rsi图表的全局设置
    kdjChart.addClassNames = true;
    kdjChart.title = "KDJ";
    kdjChart.dataProvider = tabChartData;
    kdjChart.categoryField = "date";
    kdjChart.dataDateFormat = "YYYY-MM-DD";

    var kdjAxis = new AmCharts.ValueAxis();
    kdjAxis.inside = true;

    kdjChart.addValueAxis(kdjAxis);

    var categoryAxis = kdjChart.categoryAxis;
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
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

    var KGraph = new AmCharts.AmGraph();
    KGraph.title = "Slow K";
    KGraph.type = "line";
    KGraph.valueField = "slowK";
    KGraph.lineColor = "#669999";
    KGraph.useDataSetColors = false;
    KGraph.balloonText = "slowK: <b>[[value]]</b>";
    kdjChart.addGraph(KGraph);

    var DGraph = new AmCharts.AmGraph();
    DGraph.title = "Slow D";
    DGraph.type = "line";
    DGraph.valueField = "slowD";
    DGraph.lineColor = "#ffffcc";
    DGraph.useDataSetColors = false;
    DGraph.balloonText = "slowD: <b>[[value]]</b>";
    kdjChart.addGraph(DGraph);

    var JGraph = new AmCharts.AmGraph();
    JGraph.title = "Slow J";
    JGraph.type = "line";
    JGraph.valueField = "slowJ";
    JGraph.lineColor = "#990033";
    JGraph.useDataSetColors = false;
    JGraph.balloonText = "slowJ: <b>[[value]]</b>";
    kdjChart.addGraph(JGraph);

    var cursor = new AmCharts.ChartCursor();
    cursor.valueBalloonsEnabled = true;
    cursor.fullWidth = true;
    cursor.cursorAlpha = 0.1;
    kdjChart.chartCursor = cursor;

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    kdjChart.legend = legend;

    kdjChart.write("kdj_graph");

    zoomChart(kdjChart, tabChartData);
}

function initBollChart() {
    bollChart = new AmCharts.AmSerialChart();
    charts.push(bollChart);

    //rsi图表的全局设置
    bollChart.addClassNames = true;
    bollChart.title = "BOLL";
    bollChart.dataProvider = tabChartData;
    bollChart.categoryField = "date";
    bollChart.dataDateFormat = "YYYY-MM-DD";

    var bollAxis = new AmCharts.ValueAxis();
    bollAxis.inside = true;

    bollChart.addValueAxis(bollAxis);

    var categoryAxis = bollChart.categoryAxis;
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
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

    var upperGraph = new AmCharts.AmGraph();
    upperGraph.title = "BOLL UPPER";
    upperGraph.type = "line";
    upperGraph.valueField = "boll_upper";
    upperGraph.lineColor = "#669999";
    upperGraph.useDataSetColors = false;
    upperGraph.balloonText = "boll upper: <b>[[value]]</b>";
    bollChart.addGraph(upperGraph);

    var middleGraph = new AmCharts.AmGraph();
    middleGraph.title = "BOLL MIDDLE";
    middleGraph.type = "line";
    middleGraph.valueField = "boll_middle";
    middleGraph.lineColor = "#ffffcc";
    middleGraph.useDataSetColors = false;
    middleGraph.balloonText = "boll middle: <b>[[value]]</b>";
    bollChart.addGraph(middleGraph);

    var lowGraph = new AmCharts.AmGraph();
    lowGraph.title = "BOLL LOW";
    lowGraph.type = "line";
    lowGraph.valueField = "boll_low";
    lowGraph.lineColor = "#990033";
    lowGraph.useDataSetColors = false;
    lowGraph.balloonText = "boll low: <b>[[value]]</b>";
    bollChart.addGraph(lowGraph);

    var cursor = new AmCharts.ChartCursor();
    cursor.valueBalloonsEnabled = true;
    cursor.fullWidth = true;
    cursor.cursorAlpha = 0.1;
    bollChart.chartCursor = cursor;

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    bollChart.legend = legend;

    bollChart.write("boll_graph");

    zoomChart(bollChart, tabChartData);
}

function zoomChart(chart, chartData) {
    if(chartData.length<=30) return;
    chart.zoom(new Date(chartData[chartData.length-30].date.replace(/-/g, "/"))
        , new Date(chartData[chartData.length-1].date.replace(/-/g, "/")));
}

function initGradeChart() {
    radarChart = new AmCharts.AmRadarChart();
    radarChart.dataProvider = graderData;
    radarChart.categoryField = "key";

    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisAlpha = 0.15;
    valueAxis.minimum = 0;
    valueAxis.dashLength = 3;
    valueAxis.axisTitleOffset = 20;
    valueAxis.gridCount = 5;
    radarChart.addValueAxis(valueAxis);

    var graph = new AmCharts.AmGraph();
    graph.valueField = "value";
    graph.bullet = "round";
    graph.bulletSize = 10;
    graph.balloonText = "score: [[value]]";
    radarChart.addGraph(graph);

    // WRITE
    radarChart.write("grade_radar");
}

function initDynamicChart() {
    intradayChart = new AmCharts.AmStockChart();

    var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
    categoryAxesSettings.minPeriod = "mm";
    intradayChart.categoryAxesSettings = categoryAxesSettings;

    var dataSet = new AmCharts.DataSet();
    //dataSet.color = "#b0de09";
    dataSet.fieldMappings = [{
        fromField: "value",
        toField: "value"
    }, {
        fromField: "volume",
        toField: "volume"
    }];
    dataSet.dataProvider = dynamicData;
    dataSet.categoryField = "date";

    intradayChart.dataSets = [dataSet];

    var timeSharePanel = new AmCharts.StockPanel();
    timeSharePanel.showCategoryAxis = false;
    timeSharePanel.title = "Value";
    timeSharePanel.percentHeight = 70;

    var valueGraph = new AmCharts.StockGraph();
    valueGraph.valueField = "value";
    valueGraph.type = "smoothedLine";
    valueGraph.lineThickness = 2;
    valueGraph.bullet = "round";
    valueGraph.bulletSize = 4;
    valueGraph.bulletBorderColor = "#FFFFFF";
    valueGraph.bulletBorderAlpha = 1;
    valueGraph.bulletBorderThickness = 2;
    timeSharePanel.addStockGraph(valueGraph);

    var stockLegend1 = new AmCharts.StockLegend();
    stockLegend1.valueTextRegular = " ";
    stockLegend1.markerType = "none";
    timeSharePanel.stockLegend = stockLegend1;

    var volumePanel = new AmCharts.StockPanel();
    volumePanel.showCategoryAxis = true;
    volumePanel.title = "Volume";
    volumePanel.percentHeight = 30;

    var volumeGraph = new AmCharts.StockGraph();
    volumeGraph.valueField = "volume";
    volumeGraph.type = "column";
    volumeGraph.cornerRadiusTop = 2;
    volumeGraph.fillAlphas = 1;
    volumePanel.addStockGraph(volumeGraph);

    intradayChart.panels = [timeSharePanel, volumePanel];

    // OTHER SETTINGS ////////////////////////////////////
    var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
    scrollbarSettings.graph = valueGraph;
    scrollbarSettings.usePeriod = "10mm"; // this will improve performance
    scrollbarSettings.updateOnReleaseOnly = false;
    scrollbarSettings.position = "bottom";
    intradayChart.chartScrollbarSettings = scrollbarSettings;

    var cursorSettings = new AmCharts.ChartCursorSettings();
    cursorSettings.valueBalloonsEnabled = true;
    intradayChart.chartCursorSettings = cursorSettings;

    var panelsSettings = new AmCharts.PanelsSettings();
    panelsSettings.mouseWheelZoomEnabled = true;
    panelsSettings.usePrefixes = true;
    intradayChart.panelsSettings = panelsSettings;

    intradayChart.write('dynamic_graph');
}

function initFutureChart() {
    futureChart = new AmCharts.AmSerialChart();
    futureChart.addClassNames = true;

    //future图表的全局设置
    futureChart.addClassNames = true;
    futureChart.title = "BOLL";
    futureChart.dataProvider = futureData;
    futureChart.categoryField = "date";
    futureChart.dataDateFormat = "YYYY-MM-DD";

    var futureAxis = new AmCharts.ValueAxis();
    futureAxis.inside = true;

    futureChart.addValueAxis(futureAxis);

    var categoryAxis = futureChart.categoryAxis;
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 50;
    categoryAxis.gridAlpha = 0.1;
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

    var maxGraph = new AmCharts.AmGraph();
    maxGraph.id = "maxGraph";
    maxGraph.title = "最大预估";
    maxGraph.type = "line";
    maxGraph.valueField = "max";
    futureChart.addGraph(maxGraph);

    var minGraph = new AmCharts.AmGraph();
    minGraph.title = "最小预估";
    minGraph.type = "line";
    minGraph.fillAlphas = 0.2;
    minGraph.fillToGraph = "maxGraph";
    minGraph.valueField = "min";
    futureChart.addGraph(minGraph);

    var pointGraph = new AmCharts.AmGraph();
    pointGraph.title = "中值";
    pointGraph.type = "line";
    pointGraph.bullet = "round";
    pointGraph.bulletSize = 10;
    pointGraph.bulletBorderThickness = 1;
    pointGraph.lineAlpha = 0;
    pointGraph.valueField = "point";
    futureChart.addGraph(pointGraph);

    var legend = new AmCharts.AmLegend();
    legend.position = "top";
    futureChart.legend = legend;

    var cursor = new AmCharts.ChartCursor();
    cursor.fullWidth = false;
    futureChart.chartCursor = cursor;

    futureChart.write("forecast_graph");
}