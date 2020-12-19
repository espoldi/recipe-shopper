//declaring global vraiables
var searchInput = "";
var currentIds = [];
var ingredientID = "";
var counter = 0;
let ingredientList = [];

document.getElementById("displayJsDate").textContent = moment().format('dddd, MMMM Do YYYY');

// Trivia Banner
function setBanner() {

    let getTrivia = `https://jservice.io/api/category?id=49`;

    $.ajax({

        url: getTrivia,
        method: "GET"

    }).then(function (response) {

        let spot = Math.floor(Math.random() * 215) + 1;

        // Loop to weed out empty entries
        if (response.clues[spot].question === "" || response.clues[spot].answer === "") {
            setBanner();
        }
        else {
            var triviaValue = response.clues[spot].answer;
            $(".triviaBanner").append(`${response.clues[spot].question}? <button class="triviaReveal" value=${response.clues[spot].answer}>Reveal Answer</button>`);
        }

        $(".triviaReveal").on("click", function () {
            $(".triviaReveal").text(triviaValue);
        })
    })
}
setBanner();


//Spoonacular Recipe API - call based on searched input 
let apiKey = "908fa13543d44e09a8394d63af4bb148";
let recipeCount = 8;

function searchRecipe(searchInput) {
    currentIds = [];
    $(".searchResults").empty();

    let queryURL = `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&number=${recipeCount}&query=${searchInput}`;

    $.ajax({
        url: queryURL,
        method: "GET"

    }).then(function (response) {

        var local = localStorage.setItem(recipeCount, searchInput);

        for (var i = 0; i < response.results.length; i++) {

            //console.log("IDresponse", response.results[i].id); //to test API URL

            currentIds.push(response.results[i].id);

            //let id = response.results[i].id;          

        }
        renderTopRecipes();
    });
}

//Spoonacular Recipe API - second call for dynamically generated cards, and ingredientList
function renderTopRecipes() {

    //console.log("Ids", currentIds);


    currentIds.forEach(function (element, j, arr) {

        ingredientList = [];

        console.log(element);
        let queryURL = `https://api.spoonacular.com/recipes/${element}/information?apiKey=${apiKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            //console.log("foreach", response);

            $(".searchResults").append(

                `<div>
                        <article class="card cardCSS">
                             <a href="${response.sourceUrl}" title="full recipe"><img src="${response.image}" style="width: 100%;" ></a>
                            <footer>
                            <hr>
                            <p style="font-size: 12px; font-weight:bold;">Prep Time: ${response.readyInMinutes}, Servings: ${response.servings}</p>
                            <h4> ${response.title}</h4>
                            <button class="button fas fa-cookie-bite" value="${response.id}" title="Add Ingredients to Shopping List"></button>
                            <p style="height: 10ch;">Description: ${response.summary}</p>
                            </footer>
                            </article>
                            </div>`
            );

            //adding ingredients into ingredientList array for shopping cart
            let arr = []

            for (var i = 0; i < response.extendedIngredients.length; i++) {
                arr.push(response.extendedIngredients[i].name);

            }

            ingredientList.push({
                [`recipe${counter}`]: arr
            });

            counter += 1;

        });

    });

    console.log("ingredients", ingredientList);
}


//var ingredientList = {
    //     recipe0 : [],


    // var getIngredients = function(recipe) {

    // $(".fa-cookie-bite").on("click", function (event) {
    // console.log("ingredients",recipe);


    //      = event.target.value;
    //     //ingredientList = event.target;
    //     console.log(ingredientID);

    //     foodItem = `https://api.spoonacular.com/recipes/${ingredientID}/ingredientWidget.json`;

    // //     for (var i = 0; i < ingredientID.length; i++) {ingredientID
    // //         console.log(ingredientID)
    // //     }

    //})
//}


//CLICK HANDLERS
// Show shopping list
$(".fa-shopping-basket").on("click", function () {
    $(".listPopup").show();
});

// Hide shopping list using close button
$(".closeList").on("click", function () {
    $(".listPopup").hide();
});

// Show About us section
$(".fa-users").on("click", function () {
    $(".aboutUs").show();
});

// Hide About us section
$(".closeDev").on("click", function () {
    $(".aboutUs").hide();
});


// Show burger menu
$(".burger").on("click", function () {
    $(".menu").attr(transform, scaleX(0));
});

// Hide trivia banner
$(".closeBanner").on("click", function () {
    $(".triviaBanner").hide();
})

// Clear search input
$(".clearBtn").on("click", function (event) {
    event.preventDefault();

    $('input[type="search"]').val('');
})

// Toggler hiding/showing diet restrictions
$('.fa-sliders-h').click(function () {
    $('.filters').slideToggle(700); // Toggles the slide motion of the box
});

// Search button click
$(".fa-search").on("click", function (event) {


    event.preventDefault();

    var searchInput = $(".searchRecipe").val();
    //console.log(searchInput)
    //if input is blank, return from funciton
    if (searchInput === "") {
        return;
    }

    searchRecipe(searchInput);
});