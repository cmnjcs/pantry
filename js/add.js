var quantity = 1;
function incrementQuantity() {
    quantity++;
    $("#txtQuantity").val(quantity);
}
function decrementQuantity() {
    if (quantity > 0){
        quantity--;
    }
    $("#txtQuantity").val(quantity);
}
function updateQuantity() {
    quantity = $("#txtQuantity").val();
}
function populateDefaultData() {
    $("#txtCost").val("5");
    $("#exp_date").val("2014-04-26");
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}
$(document).ready(function () {
    if (getParameterByName("ok") != null) {
        $("#itemName").val("apple");
        populateDefaultData();
    }
});