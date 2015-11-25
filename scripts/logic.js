var playerOne;
var playerTwo;
var gameboard = new Gameboard();
var game = new Game();

$(function () {
    initGameboard();
        
    $('#start').on('click', function () {
        setStart(false);
        PlayAction();
    });

    //Card handling
    $('body').on('click', '.card', function (e) {
        CardHandler(e);
    })

    //Starts buy sequence
    $('#actionNext').on('click', function () {
        PlayBuy();
    })
    
    //Starts next turn's action sequence
    $('#buyNext').on('click', function () {
        PlayAction();
    })
    
    $('#new-game').on('click', function() {
        var p1Name = playerOne.name;
        var p2Name = playerTwo.name;
        initGameboard();
        setStart(true, p1Name, p2Name);
        PlayAction();
    })
    
    //Hover magnification effect
    $('body').on('mouseenter', '.card', function(){
        doTransition($(this), true);
    });
    $('body').on('mouseleave', '.card', function(){
        doTransition($(this), false);
    });
});