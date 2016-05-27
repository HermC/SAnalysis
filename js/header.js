window.onload = function(){
    toggleSearch();
    inputListener();
};

function toggleSearch(){
    $("#search_toggle").bind("click",function(){
        if($(this).hasClass("search-close")){
            $(this).removeClass("search-close");
            $("#search_input").val("");
            $(".input-wrapper").hide();
            $(".full").hide();
        }else{
            //console.log("close");
            $(this).addClass("search-close");
            $(".input-wrapper").show();
            $(".full").show();
            $("#search_input").focus();
            search("");
        }
    })
}

function inputListener(){
    $("#search_input").bind("input propertychange",function(){
        var searchContent = $(this).val();
        search(searchContent);
    });
}

function search(search){
    var searchResult = '<h5>搜索结果：</h5>';
    var tempId;
    var tempName;
    for(var i = 0;i < stockList.length && i < 10;i++){
        tempId = stockList[i].id+"";
        tempName = stockList[i].name+"";
        if(tempId.indexOf(search) != -1 || tempName.indexOf(search) != -1){
            searchResult +='<h6>'+tempName+' '+tempId+'</h6>';
        }
    }
    $(".search_result").html(searchResult);
}