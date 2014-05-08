            $("#navbar").load("./navbar.html");
            $("#nav_add").addClass("active"); // TODO: make this line work
            items = {}; // associate ids item names
            item = function(id, quality, item_name, img_src, quantity, date) {
                items[id] = item_name;
                // hahaha
                return ('' +
                    '<div class="item ' + quality + ' panel panel-default" id="' + id +'">' +
                    '<div class="panel-body">' + 
                        '<img src="' + img_src + '" class="icon" height="70" width="70"/>'+
                        '<div class="info" style="float: left;">'+
                            '<h4><span class="item_name">' + item_name + '</span></h4> x<span class="quantity" id="quantity' + id +'">' + quantity + '</span> <br>'+
                           'Expires: <input type="date" class="exp_date" value="' + date + '">'+
                        '</div>'+
                            '<span class="item_buttons">'+
                                '<button type="button" class="btn btn-default plus" id="plus' + id + '"><span class="glyphicon glyphicon-plus-sign"></span></button>'+
                                '<button type="button" class="btn btn-default minus" id="minus' + id + '"><span class="glyphicon glyphicon-minus-sign"></span></button>'+
                                '<button type="button" class="btn btn-default trash" id="trash' + id  + '"><span class="glyphicon glyphicon-trash"></span></button>'+
                            '</span>'+
                        '<div class="clear"></div>'+
                    '</div>'+
                '</div> ');
            }
            $('#items').append(item(1, 'bad', 'Apples', 'images/apple.jpg', 2, '2014-04-16'));
            $('#items').append(item(2, 'bad', 'Milk', 'images/milk.jpg', 1, '2014-04-17'));
            $('#items').append(item(3, 'okay', 'Bread', 'images/bread.jpg', 1, '2014-04-18'));
            $('#items').append(item(4, 'okay', 'Bananas', 'images/banana.jpg', 3, '2014-04-18'));
            $('#items').append(item(5, 'okay', 'Avocados', 'images/avocado.jpg', 2, '2014-04-20'));
            $('#items').append(item(6, 'good', 'Cheese', 'images/cheese.jpg', 1, '2014-04-22'));
            $('#items').append(item(7, 'good', 'Chicken thighs', 'images/chicken.jpg', 4, '2014-04-24'));
            $('#items').append(item(8, 'good', 'Peaches', 'images/peach.jpg', 5, '2014-04-24'));
            $('#items').append(item(9, 'good', 'Oranges', 'images/orange.jpg', 2, '2014-04-25'));
            $('#items').append(item(10, 'good', 'Lettuce', 'images/lettuce.jpg', 1, '2014-04-26'));

            changeValue = function(id, amount, action) {
               value = $('#quantity' + id);
               num = parseInt(value.html()) + amount;
               value.html(num);
               // if value < 0 -> delete item
               if (num <= 0) {
                    $('#' + id).remove();
                    $('#items').prepend('<div class="alert alert-warning fade in">' +
                       '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
                        '<strong>' + items[id] + '</strong> ' + action + '.' +
                        '</div>');
               }
            }

            $('.plus').click(
                function(event) {
                    // check if clicking button or span? Pick the parent (button) if span was clicked.
                    button = $(event.target)[0];
                    // might have clicked on span...
                    if ($(button).is('span')) {
                        button = $(button).parent();
                    } else {
                        button = $(button);
                    }
                    button_id = button.attr('id');
                    id = button_id.split("plus")[1];
                    changeValue(id, 1, "deleted");
                });
            $('.minus').click(
                function(event) {
                    // check if clicking button or span? Pick the parent (button) if span was clicked.
                    button = $(event.target)[0];
                    // might have clicked on span...
                    if ($(button).is('span')) {
                        button = $(button).parent();
                    } else {
                        button = $(button);
                    }
                    button_id = button.attr('id');
                    id = button_id.split("minus")[1];
                    changeValue(id, -1, "deleted");
                });
            $('.trash').click(
                function(event) {
                    // check if clicking button or span? Pick the parent (button) if span was clicked.
                    button = $(event.target)[0];
                    // might have clicked on span...
                    if ($(button).is('span')) {
                        button = $(button).parent();
                    } else {
                        button = $(button);
                    }
                    button_id = button.attr('id');
                    id = button_id.split("trash")[1];
                    currId = id;
                    maximum = parseInt($('#quantity' + id).html());
                    $('#trashItem').html(items[id].toLowerCase());
                    $('#trashModal').modal('show');
                });
            $('#trashSelected').click(
                function(event) {
                    changeValue(currId, -quantity, "trashed");
                });
            $('#trashAll').click(
                function(event) {
                    changeValue(currId, -maximum, "trashed");
                });
            var quantity = 1;
            var maximum = 1; // changes with item to delete
            var currId = 1;
            function incrementQuantity() {
                if (quantity < maximum) {
                    quantity++;
                }
                $("#txtQuantity").val(quantity);
            }
            function decrementQuantity() {
                if (quantity > 0) {
                    quantity--;
                }
                $("#txtQuantity").val(quantity);
            }
            function updateQuantity() {
                quantity = $("#txtQuantity").val();
            }