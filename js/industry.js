window.onload = function(){
    //scrollMagic();

    $("#more").bind("click",function(){
      $(this).toggleClass("rotate1");
        //if($(this).hasClass("rotate1")){
        //    $(".scrollmagic-pin-spacer").css("width","75%");
        //    $("#industryListWrapper").css("width","25%");
        //}else{
        //    $("#industryListWrapper").css("width","75%");
        //    $(".scrollmagic-pin-spacer").css("width","25%");
        //}
      $(".column_toggle").each(function(){
          $(this).toggle();
      })
    });

    changeStockList(0);

    $("#industry_rank_total").bind("click",function(e){
        var index = e.target.parentNode.children[0].innerHTML;
        var top = parseInt($(e.target.parentNode).offset().top) - parseInt($("#pointer_wrapper").offset().top);
        //console.log("top:"+top);
        //console.log(index);
        $("#pointer").css("top",top+"px");
        changeStockList(index-1);
    })
};

var temp = 0;

function changeStockList(index){
    //$.each($(".select"),function(i,item){
    //    $(item).css("opacity","0");
    //});
    //
    //$($(".select")[index]).css("opacity","1");
    //console.log($(".select")[index]);

    //$("#stock_rank_total").html('<tr>'+
    //    '<th class="column_rank">排名</th>'+
    //    '<th class="column_name_id">股票</th>'+
    //    '<th class="column_last">总分</th>'+
    //
    //    '<th class="column_grade column_toggle column_hide">市盈率</th>'+
    //    '<th class="column_grade column_toggle column_hide">市净率</th>'+
    //    '<th class="column_grade column_toggle column_hide">涨跌幅</th>'+
    //    '<th class="column_grade column_toggle column_hide">量比</th>'+
    //    '<th class="column_grade column_toggle column_hide">委托盘</th>'+
    //    '</tr>'
    //);
    //
    //var stockList = industry_stock[index];
    //for(var i = 0;i < stockList.length;i++){
    //    $("#stock_rank_total").append(
    //        '<tr>'+
    //        '<td>'+stock+'</td>'+
    //        '<td>浦发银行<span>sh600000</span></td>'+
    //        '<td>96</td>'+
    //        '<td class="column_toggle column_hide">23</td>'+
    //        '<td class="column_toggle column_hide">23</td>'+
    //        '<td class="column_toggle column_hide">23</td>'+
    //        '<td class="column_toggle column_hide">23</td>'+
    //        '<td class="column_toggle column_hide">23</td>'+
    //        '</tr>'
    //    );
    //}

}

window.onscroll = function(){
    if(window.scrollY >= 200 ){
        $("#stockListWrapper").css({
            "position":"absolute",
            "top":window.scrollY+100+"px",
            "right":0
        });
    }else{
        $("#stockListWrapper").css({
            "position":"relative",
            "top":0
        });
    }
};

//function scrollMagic(){
//    var controller = new ScrollMagic.Controller();
//
//    var pinBlanket = new ScrollMagic.Scene({
//        triggerElement: "#industryListWrapper",
//        triggerHook: "onLeave",
//        offset: -80
//        //duration: "100%"
//    }).addTo(controller)
//        .setPin("#stockListWrapper");
//}