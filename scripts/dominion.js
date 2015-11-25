var initGameboard = function () {
    $('.buy').hide();
    $('.action').hide();
    $('.win').hide();
    $('.content').hide();
    
    playerOne = new Player("Player One");
    playerTwo = new Player("Player Two");
    
    for (var i = 0; i < 50; i++) {
        gameboard.treasury.copper.push(TreasureCard('Copper', 1, 0))
        gameboard.treasury.silver.push(TreasureCard('Silver', 2, 3))
        gameboard.treasury.gold.push(TreasureCard('Gold', 3, 6))
    }
    for (var i = 0; i < 7; i++) {
        //Game rules: For two players, each player starts out with 7 coppers
        playerOne.deck.push(TreasureCard('Copper', 1, 0))
        playerTwo.deck.push(TreasureCard('Copper', 1, 0))

        //Game rules: For two players, instantiate 7 kingdom cards. Technically 8,
        //but didn't want to make another for loop.
        //Key: KingdomCard(name, cost, draw, action, buy, treasuryBonus)
        gameboard.kingdomCards.cellar.push(KingdomCard('Cellar', 2, 1, 1, 0, 0))
        gameboard.kingdomCards.festival.push(KingdomCard('Festival', 5, 0, 2, 1, 2))
        gameboard.kingdomCards.laboratory.push(KingdomCard('Laboratory', 5, 2, 1, 0, 0))
        gameboard.kingdomCards.workshop.push(KingdomCard('Workshop', 3, 0, 0, 0, 4))
        gameboard.kingdomCards.smithy.push(KingdomCard('Smithy', 4, 3, 0, 0, 0))
        gameboard.kingdomCards.councilRoom.push(KingdomCard('Councilroom', 5, 4, 0, 1, 0))
        gameboard.kingdomCards.village.push(KingdomCard('Village', 3, 1, 2, 0, 0))
        gameboard.kingdomCards.woodcutter.push(KingdomCard('Woodcutter', 3, 0, 0, 1, 2))

        //Currently unrepresented in html, or 8 card game. Uncomment to make 10 card game.         
        //gameboard.kingdomCards.market.push(KingdomCard('Market', 5, 1, 1, 1, 1))
        //gameboard.kingdomCards.moat.push(KingdomCard('Moat', 2, 2, 0, 0, 0))

        gameboard.victoryPoints.estate.push(VictoryCard('Estate', 1, 2))
        gameboard.victoryPoints.duchy.push(VictoryCard('Duchy', 3, 5))
        gameboard.victoryPoints.province.push(VictoryCard('Province', 6, 8))
    }
    for (var i = 0; i < 3; i++) {
        //Game rules: Give each player three estates to start with
        playerOne.deck.push(VictoryCard('Estate', 1, 3))
        playerTwo.deck.push(VictoryCard('Estate', 1, 3))
    }

    playerOne.deck = shuffle(playerOne.deck);
    playerTwo.deck = shuffle(playerTwo.deck);
}

var setStart = function(rematch, p1Name, p2Name) {
    $('.home').hide();
    $('.action').show();
    $('.content').show();
    if (!rematch) {
        if ($('#teamOne')[0].value) {
            if ($('#teamOne')[0].value.indexOf(' ') > 0) {
                playerOne.name = $('#teamOne')[0].value;
            } else {
                playerOne.name = "Monarch " + $('#teamOne')[0].value;
            }
        }
        if ($('#teamTwo')[0].value) {
            if ($('#teamTwo')[0].value.indexOf(' ') > 0) {
                playerTwo.name = $('#teamTwo')[0].value;
            } else {
                playerTwo.name = "Monarch " + $('#teamTwo')[0].value;
            }
        }
    } else if (rematch) {
        playerOne.name = p1Name;
        playerTwo.name = p2Name;
    }
}

var doTransition = function(elem, apply){
    if(apply){
        elem.css('z-index', '15');
        elem.addClass('transition');
    } else {
        elem.css('z-index', '11');
        setTimeout(function(){
            elem.css('zindex','10');
        },500);
        elem.removeClass('transition');
    }
}
var showPopup = function(message){
    $('#modal-body').empty().html(message);
    $('#popup').modal('show');
    setTimeout(function(){
        $('#popup').modal('hide');
    }, 1700);
}

/*
*Takes a player's discard pile, moves it to deck, and
*then shuffles
*@param {Object} player
*/
var reloadDeck = function (player) {
    //If poping discard, length gets reduced during iteration
    var discardLength = player.discard.length;
    for (var i = 0; i < discardLength; i++) {
        player.deck.push(player.discard.pop());
    }
    shuffle(player.deck);
}
/*
*Function found on stack overflow. Standard shuffler.
*@param {Object} o
*/
var shuffle = function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/*
*Gives back who's turn it is based on global turn variable
*@return {Object} player
*/
var getPlayer = function () {
    if (game.turn % 2 == 1) {
        return playerOne;
    } else if (game.turn % 2 == 0) {
        return playerTwo;
    } else {
        console.log("Error with turn");
        return;
    }
}
/*
*Takes a player's shuffled deck and returns 
*the first five cards
*@param {Object} deck
*@return {Object} hand
*/
var getHand = function (deck) {
    var hand = []
    for (var i = 0; i < 5; i++) {
        hand.push(deck.pop())
    }
    return hand;
}

/*
*Main logic to set up new turn and action sequence
*/
var PlayAction = function () {
    //Increment the game turn and set game
    //stage to 1 (Action stage)
    game.turn++;
    game.stage = 1;

    //Get the current player and reset all bonuses
    var player = getPlayer();
    player.action = 1;
    player.buy = 1;
    player.treasury = 0;
    player.deckDraw = 0;

    //Discard any cards left in hand from previous turn. 
    //Because of pop function, have to store hand length 
    //in a seperate variable, otherwise it will update.
    if (player.hand.length > 0) {
        var handLength = player.hand.length;
        for (var i = 0; i < handLength; i++) {
            player.discard.push(player.hand.pop());
        }
    }

    //If the deck is too small to give a full hand,
    //get all from discard and shuffle them.
    if (player.deck.length < 5) {
        reloadDeck(player);
    }
    
    //Reset gameboard/DOM
    $('.buy').hide();
    $('.action').show();
    $('.hand').empty();
    $('#actionCredits').empty();
    $('#buyCredits').empty();
    $('#treasury').empty();
    $('#discardCount').empty();
    $('#deckCount').empty();
    $('#actionStatus').empty();
    $('#actionCredits').append('Action credits: ' + player.action);
    $('#discardCount').append("Discard: " + player.discard.length);
    $('.panelTitle').html(player.name);

    //Get the player's hand from his/her deck. Takes the card out of the deck
    //to be placed in discard later.
    var hand = getHand(player.deck);
    hand.forEach(function (card) {
        var img = $('<img>', {
            class      : 'card',
            id         : card.name,
            src        : 'styles/images/' + card.name + '.jpg'
        });
        $('.hand').append(img);
    });

    //We want this displayed after the hand has been pulled from the deck
    $('#deckCount').append("Deck: " + player.deck.length);

    //Easier to getHand first, then push it into player object's hand
    var handLength = hand.length;
    for (var i = 0; i < handLength; i++) {
        player.hand.push(hand.pop());
    }
}
/*
*Main logic to set up buy sequence
*/
var PlayBuy = function () {
    var player = getPlayer();
    game.stage = 2;
    //Live update of current hand value vs storing in a new variable
    player.treasury = player.getHandValue();
    
    //Hide action sequence DOM nodes and show buy sequence
    $('.action').hide()
    $('.buy').show();
    $('#buyStatus').empty()
    $('#buyCredits').append('Buy credits: ' + player.buy);
    $('#treasury').append('Treasury value: ' + player.treasury);
    if (gameboard.victoryPoints.province.length > 1){
        $('#provincePanel').empty().append(gameboard.victoryPoints.province.length + " Provinces left")
    } else {
        $('#provincePanel').empty().append(gameboard.victoryPoints.province.length + " Province left")
    }
}
/*
*Main logic for handling a card click. Takes an event as a parameter 
*that can be used to get the current target of the click. This is only
*called when a card is clicked as set by a click listener. 
*@param {Object} e
*/
var CardHandler = function (e) {
    var player = getPlayer();
    var stage = game.getStage();
    var card = e.currentTarget.getAttribute('id');
    
    $('#actionStatus').empty()
    $('#buyStatus').empty()

    //If there aren't any more cards in this stack, turn the card over
    for (cardType in gameboard) {
        for (key in gameboard[cardType]) {
            if (gameboard[cardType][key].length === 0) {
                $('#' + key).removeAttr('src').attr('src', 'styles/images/CardBack.jpg')
            }
        }
    }

    //If Action Stage (stage 1)
    if (stage == 1) {
        if (card === "deck" && player.deckDraw > 0) {
            
            if (player.deck.length == 0) {
                reloadDeck(player);
            }
            
            var deckCard = player.deck.pop();
            player.deckDraw--;
            player.hand.push(deckCard);
            
            $('.hand').append('<img class="card" id="' + deckCard.name + '" src="styles/images/' + deckCard.name + '.jpg">')            
            $('#deckCount').empty().append("Deck: " + player.deck.length);
        } 
        //If card clicked wasn't a deck card, but an action is available
        else if (player.action > 0) {
            for (var i = 0; i < player.hand.length; i++) {
                if (card.toLowerCase() === player.hand[i]['name'].toLowerCase() 
                        && player.hand[i]['type'] === "Kingdom") {
                    if (player.action > 0) {
                        var cardObject = player.hand.splice(i, 1);

                        player.action--;
                        player.action += cardObject[0].actionBonus;
                        player.deckDraw += cardObject[0].deckDraw;
                        player.buy += cardObject[0].buyBonus;
                        player.purseBonus += cardObject[0].purseBonus;

                        e.currentTarget.setAttribute('src', 'styles/images/CardBack.jpg');
                        e.currentTarget.setAttribute('id', '')
                        
                        $('#actionCredits').empty().append('Action credits: ' + player.action);

                        $('#actionStatus').empty().html(cardObject[0].name + " played!");
                        player.discard.push(cardObject[0]);
                    }
                    break;
                }
            }
        }
        else if (player.action == 0) {
            showPopup("You are out of actions. Move along.");
        }
    } 
    //If buy stage and player has buys left
    else if (stage == 2 && player.buy > 0) {
        $('#treasury').empty().append('Treasury value: ' + player.treasury);

        for (cardType in gameboard) {
            for (key in gameboard[cardType]) {
                if (card === key && gameboard[cardType][key].length > 0) {
                    if (gameboard[cardType][key][0].cost <= player.treasury) {
                        var cardObject = gameboard[cardType][key].pop();

                        //Adds all victory points to player object to retrieve 
                        //them easily at the end of the game
                        if(cardType === "victoryPoints") {
                            if (key == "province"){
                                if (gameboard.victoryPoints.province.length > 1){
                                    $('#provincePanel').empty().append(gameboard.victoryPoints.province.length + " Provinces left")
                                } else {
                                    $('#provincePanel').empty().append(gameboard.victoryPoints.province.length + " Province left")
                                }                            
                            }
                            player.victoryPoints += cardObject.value;
                        }
                        
                        player.buy--;
                        player.treasury = player.treasury - cardObject.cost;
                        player.discard.push(cardObject);
                        player.purseBonus = 0;
                        
                        $('#buyCredits').empty().append('Buy credits: ' + player.buy);
                        $('#treasury').empty().append('Treasury value: ' + player.treasury);
                        $('#buyStatus').empty().html('+' + card.capitalize() + " bought");
                        
                        break;
                    }
                    //$('#buyStatus').empty().html("You don't have enough money");
                    showPopup("You don't have enough money. Move along.")
                }
            }
        }

    } else if (player.buy == 0) {
        showPopup("You have 0 buys left. Move along.")
    } else if (player.treasury == 0){
        showPopup("You have no money. Move along.")
    }
    
    //Check win after each card click event
    checkWin(player);
}

/*
*Check the win based on how many province cards are left.
*@return {Object} player
*/
var checkWin = function (player) {
    if (gameboard.victoryPoints.province.length === 0) {
        
        $('.action').hide()
        $('.buy').hide();
        $('.content').hide();
        $('.win').show();
        $('#winner').html(player.name + " wins with " + player.victoryPoints + " victory points" )
        
    } 
}