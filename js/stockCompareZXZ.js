//此变量记录当前对比中股票的数量
var num_display;
//此数组存储图表0，1，2，3位上分别有没有展示股票
//var displayList = [1,1,1,1];

var displayedStocksData = [];
var hideStocksData = [];

window.onload = function(){

    toggleSearch();
    inputListener();
    addInputListener();
    blanketLinstener();
    clear();
    addInit();
    scrollMagic();
    perfectScroll();
    addStock();
    addStock();
    addStock();
    addStock();

    num_display = 0;

    //TODO
    //需要初始化num_display,
};

var blanketContent;

function addInputListener(){
    $("#blanket_wrapper").on("click","#add",function(){
        blanketContent = $("#blanket_wrapper").html();
       $("#blanket_wrapper").html(
            '<div class="add_input_wrapper">'+
            '<input id="add_input" type="text" placeholder="搜索股票名字或id">'+
            '<img id="add_input_clear" src="../img/add.png">'+
            '</div>'+
            '<h6>点击搜索结果添加至对比列表中</h6>'+
            '<ul class="add_result_wrapper">'+
            '</ul>'
       );
        add_search("");
    }).on("click","#add_input_clear",function(){
        $("#blanket_wrapper").html(blanketContent);
    }).on("click","li",function(){
        $("#blanket_wrapper").html(blanketContent);
        //TODO
        console.log($(this).find("span").html());
    });

    $("#blanket_wrapper").on("input propertychange","#add_input",function(){
        var searchContent = $(this).val();
        add_search(searchContent);
    });
}

function add_search(search){
    var searchResult = '';
    var resultNum = 0;
    var tempId;
    var tempName;
    for(var i = 0;i < stockList.length && resultNum < 10;i++){
        tempId = stockList[i].id+"";
        tempName = stockList[i].name+"";
        if(tempId.indexOf(search) != -1 || tempName.indexOf(search) != -1){
            searchResult +='<li><h5>'+tempName+'</h5><span>'+tempId+'</span></li>';
            resultNum ++;
        }
    }
    $(".add_result_wrapper").html(searchResult);
}

function blanketLinstener(){
    $("#blanket").on("click",".see",function(){
        if($(this).hasClass("hide")){
            if(num_display > 3){
                alert("对比股票只能小于等于四只！");
            }else{
                //如果在展示中的股票只数小于四只，给出股票id，调图表相应接口
                num_display++;
                $(this).removeClass("hide");
                $(this.parentNode).addClass("display");
                //console.log($(this.parentNode).find("h3").html());

                var stockid = $(this.parentNode).find("h3").html();
                var i;
                for(i=0;i<hideStocksData.length;i++){
                    if(hideStocksData[i].id==stockid){
                        break;
                    }
                }
                if(i>=hideStocksData.length){
                    //$.ajax();
                    var data = generateSingleStockData(stockid);
                    displayedStocksData.push(data);
                }else{
                    displayedStocksData.push(hideStocksData[i]);
                    hideStocksData.splice(i, 1);
                }
            }
        }else{
            //展示列表中删除这只股票
            num_display--;
            $(this).addClass("hide");
            $(this.parentNode).removeClass("display");

            var stockid = $(this.parentNode).find("h3").html();
            var i;
            for(i=0;i<displayedStocksData.length;i++){
                if(displayedStocksData[i].id==stockid){
                    break;
                }
            }
            if(i>=displayedStocksData.length){

            }else{
                hideStocksData.push(displayedStocksData[i]);
                displayedStocksData.splice(i, 1);
            }
        }

        generateChartsData();
        validateCharts();
        //$(this).toggleClass("hide");

    }).on("click",".delete",function(){
        console.log("delete");
        console.log(this.parentNode);
        //if($(this.parentNode).hasClass("display")){
        //    //如果在展示中的话，给出id，调图表相应接口
        //    console.log($(this.parentNode).find("h3").html());
        //    //TODO
        //}

        var stockid = $(this.parentNode).find("h3").html();
        var i;
        for(i=0;i<displayedStocksData.length;i++){
            if(displayedStocksData[i].id==stockid){
                displayedStocksData.splice(i, 1);
                break;
            }
        }
        for(i=0;i<hideStocksData.length;i++){
            if(hideStocksData[i].id==stockid){
                hideStocksData.splice(i, 1);
                break;
            }
        }

        deleteCompareStock(stockid);

        num_display--;
        //不管怎样，都在blanket中删除这个股票
        $(this.parentNode).remove();

        generateChartsData();
        validateCharts();
    });
}

function clear(){
    $("#clear").bind("click",function(){
        $("#blanket").html("");
        //TODO
        //清空图表
    });
}

function addInit(){
    $("#add").bind("click",addStock);
}


var tmp = 1;

function addStock() {
    $("#blanket").append(
        '<li class="stock_blanket_item">'+
        '<div class="see hide"></div>'+
        '<div class="stock_info">'+
        '<h2>'+tmp+'</h2>'+
        '<h3>'+tmp+'</h3>'+
        '</div>'+
        '<img class="delete" src="../img/delete.png">'+
        '</li>');
    tmp++;
}

function scrollMagic(){
    var controller = new ScrollMagic.Controller();

    var pinBlanket = new ScrollMagic.Scene()
        .addTo(controller)
        .setPin("#blanket_wrapper");
}

function updateCompareStocks() {
    var tmp = $.cookie('compareStock');
    if(tmp==undefined) return;
    var currentStocks = $.cookie('compareStock').split(',');
    if(currentStocks[0]=="null"){
        currentStocks.shift();
    }
    $.ajax({
        url: "/stock/compare.do"
    });
}

function deleteCompareStock(id) {
    var tmp = $.cookie('compareStock');
    if(tmp==undefined) return;
    var stocks = tmp.split(",");
    for(var i=0;i<stocks.length;i++){
        if(stocks[i]==id){
            stocks.splice(i, 1);
            break;
        }
    }
    if(stocks.length==0){
        $.cookie('compareStock', null);
    }else{
        $.cookie('compareStock', stocks.join(","));
    }
}

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
var RSIChart;
var KDJChart;
var bollChart;

AmCharts.ready(function() {
    AmCharts.theme = AmCharts.themes.dark;

    //initCompareStock();

    initRadarChart();
    initFutureChart();
    initMACDChart();
    initKDJChart();
    initRSIChart();
    initBollChart();
});

/****************************************
 * 图表数据的转换
 * */
function validateCharts() {
    initRadarChart();
    initFutureChart();
    initKDJChart();
    initRSIChart();
    initMACDChart();
    initBollChart();
}
function generateChartsData() {
    if(displayedStocksData.length==0) return;

    radarData = [{
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
    futureData = [];
    MACDData = [];
    volumeData = [];
    totalMoneyData = [];
    RSIData = [];
    KDJData = [];
    bollData = [];

    var i, j;
    for(i=0;i<displayedStocksData.length;i++){
        radarData[0][displayedStocksData[i].id] = displayedStocksData[i].radar_data.adj_price;
        radarData[1][displayedStocksData[i].id] = displayedStocksData[i].radar_data.turnover;
        radarData[2][displayedStocksData[i].id] = displayedStocksData[i].radar_data.pe_ttm;
        radarData[3][displayedStocksData[i].id] = displayedStocksData[i].radar_data.pb;
        radarData[4][displayedStocksData[i].id] = displayedStocksData[i].radar_data.quantityrelative;
    }
    var length = displayedStocksData[0].other_data.length;
    for(i=0;i<length;i++){
        var date = displayedStocksData[0].other_data[i].date;

        //var futureJson = {"date": date};
        var MACDJson = {"date": date};
        var volumeJson = {"date": date};
        var totalMoneyJson = {"date": date};
        var RSIJson = {"date": date};
        var KDJson = {"date": date};
        var bollJson = {"date": date};

        for(j=0;j<displayedStocksData.length;j++){
            var id = displayedStocksData[j].id;
            var otherData = displayedStocksData[j].other_data;

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
        var date2 = displayedStocksData[0].forecast_data[i].date;

        var futureJson = {"date": date2};

        for(j=0;j<displayedStocksData.length;j++){
            var id = displayedStocksData[j].id;
            var future = displayedStocksData[j].forecast_data;
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

    for(var i=0;i<displayedStocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.title = displayedStocksData[i].id;
        graph.valueField = displayedStocksData[i].id;
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

    for(var i=0;i<displayedStocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = displayedStocksData[i].id;
        graph.valueField = displayedStocksData[i].id;
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

    for(var i=0;i<displayedStocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "column";
        graph.title = displayedStocksData[i].id;
        graph.valueField = displayedStocksData[i].id;
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

    for(var i=0;i<displayedStocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = displayedStocksData[i].id;
        graph.valueField = displayedStocksData[i].id;
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

function initKDJChart() {
    KDJChart = new AmCharts.AmSerialChart();
    KDJChart.dataProvider = KDJData;
    KDJChart.categoryField = "date";
    KDJChart.dataDateFormat = "YYYY-MM-DD";

    var categoryAxis = KDJChart.categoryAxis;
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

    for(var i=0;i<displayedStocksData.length;i++){
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = displayedStocksData[i].id;
        graph.valueField = displayedStocksData[i].id;
        graph.fillAlphas = 0;
        KDJChart.addGraph(graph);
    }

    var legend = new AmCharts.AmLegend();
    legend.labelText = "[[title]]";
    legend.position = "top";
    KDJChart.legend = legend;

    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to fals if you want the cursor to work in "select" mode
    KDJChart.addChartCursor(chartCursor);

    KDJChart.write('kdj_graph');
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

    for (var i = 0; i < displayedStocksData.length; i++) {
        var graph = new AmCharts.AmGraph();
        graph.type = "line";
        graph.title = displayedStocksData[i].id;
        graph.valueField = displayedStocksData[i].id;
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

function perfectScroll(){
    console.log("ps");
    var blanket = document.querySelector("#blanket");
    Ps.initialize(blanket);
    $(".ps-scrollbar-x-rail").hide();
}