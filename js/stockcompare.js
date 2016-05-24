
/***********************************************
 * 删除对比股票
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
    //stocksData.splice(index, 1);

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

/************************************************
 * 更新数据
 */
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