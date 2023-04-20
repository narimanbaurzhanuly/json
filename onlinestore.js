// Create the arrays which we will use to store our users interactions 

let cart = [];
let vinylObject = [];
let discountCode = [];
let deliveryLock = [];
let discountLock = 0;

// When the page loads, create session storage items, or if already created, load the users saved interactions and shopping choices

function sessionStart() {
    if (JSON.parse(sessionStorage.getItem("price") === null)) {
        sessionStorage.setItem("price", JSON.stringify(cart));
        sessionStorage.setItem("object", JSON.stringify(vinylObject));
        sessionStorage.setItem("discount", JSON.stringify(discountCode));
        sessionStorage.setItem("delivery", JSON.stringify(deliveryLock));
        sessionStorage.setItem("discLock", JSON.stringify(discountLock));
        $(document).ready(function() {
            $("#deliveryOption").hide();
        });
    } else {
        cart = JSON.parse(sessionStorage.getItem("price"));
        vinylObject = JSON.parse(sessionStorage.getItem("object"));
        deliveryLock = JSON.parse(sessionStorage.getItem("delivery"));
        discountLock = JSON.parse(sessionStorage.getItem("discLock"));
        let total = cart.reduce(function(a, b) {
            return a + b
        }, 0)
        if (cart[0] === 0) {
            $(".fas").css("color", "#696464");

        } else {
            $(".fas").css("color", "#ff5200");
        }
        if (total === 0) {
            $("#total").html("Total: R0");
            $(".fas").css("color", "#696464");
            $("#deliveryOption").hide();
        } else {
            $("#total").html("Total: R" + (total - discountLock));
            $(".fas").css("color", "#ff5200");
            $("#vat").html("VAT: R" + (15 * total) / 100);
        }
        if (deliveryLock[0] !== 1 && deliveryLock[0] !== 2 && total !== 0) {
            $("#deliveryOption").hide();
            $("#express").prop("checked", false);
            $("#standard").prop("checked", false);
            $("#total").html("Total: R" + (total - discountLock));
            $("#delivShow").html("Delivery: R0")
            $("#vat").html("VAT: R" + (15 * total) / 100);
        }
        if (deliveryLock[0] == 1 && total !== 0) {
            $("#total").html("Total: R" + (total + 99.99 - discountLock));
            $("#delivery").prop("checked", true);
            $("#express").prop("checked", true);
            $("#deliveryOption").show();
            $("#delivShow").html("Delivery: R99.99")
            let num = (15 * (total + 99.99) / 100);
            $("#vat").html("VAT: R" + num.toFixed(2));
        }
        if (deliveryLock[0] == 2 && total !== 0) {
            $("#total").html("Total: R" + (total + 49.99 - discountLock));
            $("#delivery").prop("checked", true);
            $("#standard").prop("checked", true);
            $("#deliveryOption").show();
            $("#delivShow").html("Delivery: R49.99")
            let num = (15 * (total + 49.99) / 100);
            $("#vat").html("VAT: R" + num.toFixed(2));
        }
        $("#discShow").html("Discount: -R" + discountLock);

        // Adds a list of the user's items they have added to their cart

        let i = 0;
        vinylObject.forEach(function(e) {
            let para = document.createElement("p");
            para.value = i;
            i++;
            para.innerHTML = "#" + e.title + " | " + e.description + " | " + e.colour + " | " + "R" + e.value;
            let removeBtn = document.createElement("p");
            removeBtn.innerHTML = "Remove"
            removeBtn.setAttribute("class", "removeBtn")
            removeBtn.setAttribute("onclick", "removeThis(this)")
            para.appendChild(removeBtn);
            $("#checkout").append(para);
        });
    };
}

// vinyl object blueprint 

let vinyl = function(title, description, colour, value) {
    this.title = title;
    this.description = description;
    this.colour = colour;
    this.value = value;
};

// On click of add to cart button, create object for specific vinyl, alert basket total + delivery costs + discount subtraction

function generate(title, description, colour, value) {
    cart = JSON.parse(sessionStorage.getItem("price"));
    vinylObject = JSON.parse(sessionStorage.getItem("object"));
    discountLock = JSON.parse(sessionStorage.getItem("discLock"));
    let newVinyl = new vinyl(
        title,
        description,
        colour,
        value,
    );
    vinylObject.push(newVinyl)
    let prices = parseInt(value);
    cart.push(prices);
    let total = cart.reduce(function(a, b) {
        return a + b
    }, 0)
    if (deliveryLock[0] !== 1 && deliveryLock[0] !== 2) {
        alert("Cart Total: R" + (total - discountLock));
        $(".cart").animate({ height: "+= 50%" });
    }
    if (deliveryLock[0] == 1 && total !== 0) {
        alert("Cart Total: R" + (total + 99.99 - discountLock));
        $(".cart").animate({ height: "+= 50%" });
    }
    if (deliveryLock[0] == 2 && total !== 0) {
        alert("Cart Total: R" + (total + 49.99 - discountLock));
        $(".cart").animate({ height: "+= 50%" });
    }
    $(".fas").css("color", "#ff5200");

    sessionStorage.setItem("price", JSON.stringify(cart));
    sessionStorage.setItem("object", JSON.stringify(vinylObject));
    sessionStorage.setItem("discLock", JSON.stringify(discountLock));
}

// Lets the user delete individual items from their cart

function removeThis(e) {
    cart = JSON.parse(sessionStorage.getItem("price"));
    vinylObject = JSON.parse(sessionStorage.getItem("object"));
    discountCode = JSON.parse(sessionStorage.getItem("discount"));
    discountLock = JSON.parse(sessionStorage.getItem("discLock"));
    let paraValue = e.parentElement.value;
    vinylObject.splice(paraValue, 1);
    cart.splice(paraValue, 1);
    e.parentElement.remove();
    let total = cart.reduce(function(a, b) {
        return a + b
    }, 0)
    if (total === 0) {
        $("#total").html("Total: R0");
        $(".fas").css("color", "#696464");
        $("#vat").html("VAT: R0")
    } else {
        if ($("#express").prop("checked") == true) {
            $("#total").html("Total: R" + (total + 99.99 - discountLock));
            let num = (15 * (total + 99.99) / 100);
            $("#vat").html("VAT: R" + num.toFixed(2));
        } else if ($("#standard").prop("checked") == true) {
            $("#total").html("Total: R" + (total + 49.99 - discountLock));
            let num = (15 * (total + 49.99) / 100);
            $("#vat").html("VAT: R" + num.toFixed(2));
        } else {
            $("#total").html("Total: R" + (total - discountLock));
            $("#vat").html("VAT: R" + (15 * total) / 100);
        }
        $(".fas").css("color", "#ff5200");
    }
    sessionStorage.setItem("price", JSON.stringify(cart));
    sessionStorage.setItem("object", JSON.stringify(vinylObject));
    sessionStorage.setItem("discount", JSON.stringify(discountCode));
}

// Applies a discount to the total if the user inputs the code "vinyl"

$("#discount").click(function() {
    cart = JSON.parse(sessionStorage.getItem("price"));
    discountCode = JSON.parse(sessionStorage.getItem("discount"));
    discountLock = JSON.parse(sessionStorage.getItem("discLock"));
    if ($("#total").html() == "Total: R0") {
        alert("Fill Ya Basket!");
    }
    if ($("#code").val() == "vinyl" && $("#total").html() != "Total: R0") {
        discountCode.push("vinyl");
    } else if ($("#total").html() != "Total: R0") {
        alert("Code Not Valid!")
    }
    if (discountCode.length === 1 && $("#total").html() != "Total: R0") {
        discountLock = 20;
        alert("Discount Applied!");
        discountCode.push(1);
    } else if (discountCode.length > 1 && $("#code").val() == "vinyl" && $("#total").html() != "Total: R0") {
        alert("Code Already Applied!")
    }
    sessionStorage.setItem("price", JSON.stringify(cart));
    sessionStorage.setItem("discount", JSON.stringify(discountCode));
    sessionStorage.setItem("discLock", JSON.stringify(discountLock));

});

// Adds the item to the users basket and takes them to checkout page

function buy(title, description, colour, value) {
    cart = JSON.parse(sessionStorage.getItem("price"));
    vinylObject = JSON.parse(sessionStorage.getItem("object"));
    let newVinyl = new vinyl(
        title,
        description,
        colour,
        value,
    );
    vinylObject.push(newVinyl)
    let prices = parseInt(value);
    cart.push(prices);
    $(".fas").css("color", "#ff5200");
    sessionStorage.setItem("price", JSON.stringify(cart));
    sessionStorage.setItem("object", JSON.stringify(vinylObject));
}

// Takes the users delivery option and adds it to the total

$("#delivery").click(function() {
    $("#deliveryOption").show();
});
$("#collection").click(function() {
    cart = JSON.parse(sessionStorage.getItem("price"));
    deliveryLock = JSON.parse(sessionStorage.getItem("delivery"));
    discountLock = JSON.parse(sessionStorage.getItem("discLock"));
    deliveryLock[0] = 3;
    $("#delivShow").html("Delivery: R0")
    sessionStorage.setItem("delivery", JSON.stringify(deliveryLock));
    let total = cart.reduce(function(a, b) {
        return a + b
    }, 0)
    $("#deliveryOption").hide();
    $("#express").prop("checked", false);
    $("#standard").prop("checked", false);
    if (total !== 0) {
        $("#total").html("Total: R" + (total - discountLock));
        $("#vat").html("VAT: R" + (15 * total) / 100);
    }
});
$("#express").click(function() {
    cart = JSON.parse(sessionStorage.getItem("price"));
    deliveryLock = JSON.parse(sessionStorage.getItem("delivery"));
    discountLock = JSON.parse(sessionStorage.getItem("discLock"));
    let total = cart.reduce(function(a, b) {
        return a + b
    }, 0)
    if (total !== 0) {
        deliveryLock[0] = 1;
        $("#delivShow").html("Delivery: R99.99")
        sessionStorage.setItem("delivery", JSON.stringify(deliveryLock));
        $("#total").html("Total: R" + (total + 99.99 - discountLock));
        let num = (15 * (total + 99.99) / 100);
        $("#vat").html("VAT: R" + num.toFixed(2));
    }
});
$("#standard").click(function() {
    cart = JSON.parse(sessionStorage.getItem("price"));
    deliveryLock = JSON.parse(sessionStorage.getItem("delivery"));
    discountLock = JSON.parse(sessionStorage.getItem("discLock"));
    let total = cart.reduce(function(a, b) {
        return a + b
    }, 0)
    if (total !== 0) {
        deliveryLock[0] = 2;
        $("#delivShow").html("Delivery: R49.99")
        sessionStorage.setItem("delivery", JSON.stringify(deliveryLock));
        $("#total").html("Total: R" + (total + 49.99 - discountLock));
        let num = (15 * (total + 49.99) / 100);
        $("#vat").html("VAT: R" + num.toFixed(2));
    }
})

// Confirms the user's order and gives them a random order number and then resets their cart

$("#confirmBtn").click(function() {
    cart = JSON.parse(sessionStorage.getItem("price"));
    vinylObject = JSON.parse(sessionStorage.getItem("object"));
    deliveryLock = JSON.parse(sessionStorage.getItem("delivery"));
    discountCode = JSON.parse(sessionStorage.getItem("discount"));
    discountLock = JSON.parse(sessionStorage.getItem("discLock"));
    let total = cart.reduce(function(a, b) {
        return a + b
    }, 0)
    if (total !== 0) {
        alert("Your order was successful. your order number is: ON" + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + "\r\nAn email will be sent to you shortly!");
        cart = [];
        vinylObject = [];
        deliveryLock = [];
        discountCode = [];
        discountLock = 0;
    } else {
        alert("Fill Ya Basket!")
    }
    sessionStorage.setItem("price", JSON.stringify(cart));
    sessionStorage.setItem("object", JSON.stringify(vinylObject));
    sessionStorage.setItem("discount", JSON.stringify(discountCode));
    sessionStorage.setItem("delivery", JSON.stringify(deliveryLock));
    sessionStorage.setItem("discLock", JSON.stringify(discountLock));
});

// Clears the user's cart

$("#clearBtn").click(function() {
    cart = JSON.parse(sessionStorage.getItem("price"));
    vinylObject = JSON.parse(sessionStorage.getItem("object"));
    deliveryLock = JSON.parse(sessionStorage.getItem("delivery"));
    discountCode = JSON.parse(sessionStorage.getItem("discount"));
    discountLock = JSON.parse(sessionStorage.getItem("discLock"));
    let total = cart.reduce(function(a, b) {
        return a + b
    }, 0)
    if (total !== 0) {
        alert("Cleared!");
        cart = [];
        vinylObject = [];
        deliveryLock = [];
        discountCode = [];
        discountLock = 0;
    } else {
        alert("Nada to Clear!")
    }
    sessionStorage.setItem("price", JSON.stringify(cart));
    sessionStorage.setItem("object", JSON.stringify(vinylObject));
    sessionStorage.setItem("discount", JSON.stringify(discountCode));
    sessionStorage.setItem("delivery", JSON.stringify(deliveryLock));
    sessionStorage.setItem("discLock", JSON.stringify(discountLock));
});

// Creates a drop-down category menu

$("#drop").click(function() {
    $(".drop").slideToggle();
    $(this).css("color", "orange").animate({ fontSize: "1.1rem" });
});