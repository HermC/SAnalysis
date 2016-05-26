window.onload = function(){
    unfavor();
    addToCompare();
};

function unfavor(){
    $(".self_items").on("click",".favor",function(){
        console.log($(this.parentNode.parentNode).find(".stock_id").html());
        $(this.parentNode.parentNode).remove();
    });
}

function addToCompare(){
    $(".self_items").on("click",".add",function(){
        console.log($(this.parentNode.parentNode).find(".stock_id").html());
    });
}