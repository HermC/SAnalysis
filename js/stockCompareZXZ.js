//此变量记录当前对比中股票的数量
var num_display;
//此数组存储图表0，1，2，3位上分别有没有展示股票
var displayList = [1,1,1,1];

window.onload = function(){
    toggleSearch();
    inputListener();
    blanketLinstener();
    clear();
    addStock();
    scrollMagic();
    perfectScroll();
    num_display = 4;
    //TODO
    //需要初始化num_display,
};


function blanketLinstener(){
    $("#blanket").on("click",".see",function(){
        console.log("see");
        if($(this).hasClass("hide")){
            if(num_display > 3){
                alert("对比股票只能小于等于四只！");
            }else{
                //如果在展示中的股票只数小于四只，给出股票id，调图表相应接口
                num_display++;
                $(this).removeClass("hide");
                console.log($(this.parentNode).find("h3").html());
            }
        }else{
            //展示列表中删除这只股票
            num_display--;
            $(this).addClass("hide");
            console.log(this.parentNode.id);
        }
        //$(this).toggleClass("hide");


    }).on("click",".delete",function(){
        console.log("delete");
        if($(this.parentNode).hasClass("display")){
            //如果在展示中的话，给出id，调图表相应接口
            console.log(this.parentNode.id);
            //TODO
        }
        //不管怎样，都在blanket中删除这个股票
        $(this.parentNode).remove();

    });
}

function clear(){
    $("#clear").bind("click",function(){
        $("#blanket").html("");
        //TODO
        //清空图表
    });
}

var temp = 11;
function addStock(name,id){
    temp++;
    $("#add").bind("click",function(){
        $("#blanket").append(
            '<li class="stock_blanket_item">'+
                '<div class="see hide"></div>'+
                '<div class="stock_info">'+
                '<h2>'+name+'</h2>'+
                '<h3>'+id+'</h3>'+
                '</div>'+
                '<img class="delete" src="../img/delete.png">'+
            '</li>');
    });
}

function scrollMagic(){
    var controller = new ScrollMagic.Controller();

    var pinBlanket = new ScrollMagic.Scene()
        .addTo(controller)
        .setPin("#blanket_wrapper");
}

function perfectScroll(){
    console.log("ps");
    var blanket = document.querySelector("#blanket");
    Ps.initialize(blanket);
    $(".ps-scrollbar-x-rail").hide();
}