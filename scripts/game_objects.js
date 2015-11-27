//I understand all of these should have been done with 
//getter and setter methods to provide private information,
//but I realized after I finished the basic logic. Because it's just a game, 
//I'm not going to refactor it. 

var VictoryCard = function (name, value, cost) {
    return {
        name: name,
        value: value,
        cost: cost,
        type: 'Victory'
    }
}
var TreasureCard = function (name, value, cost) {
    return {
        name: name,
        value: value,
        cost: cost,
        type: 'Treasure'
    }
}
var KingdomCard = function (name, cost, draw, action, buy, bonus, double, workshop) {
    return {
        name: name,
        cost: cost,
        deckDraw: draw,
        actionBonus: action,
        buyBonus: buy,
        purseBonus: bonus,
        throneRoom: double,
        workshop: workshop,
        type: 'Kingdom'
    }
}
var Player = function (name) {
    return {
        name: name,
        deck: [],
        hand: [],
        discard: [],
        treasury: 0,
        action: 1,
        buy: 1,
        deckDraw: 0,
        purseBonus: 0,
        victoryPoints: 3,
        throneRoomDouble: 0,
        workshopBonus: 0,
        getHandValue: function () {
            var count = 0;
            this.hand.forEach(function (card) {
                if (card.type === 'Treasure') {
                    count += card.value
                }
            })
            return count + this.purseBonus;
        }
    }
}
var Gameboard = function () {
    return {
        victoryPoints: {
            estate: [],
            duchy: [],
            province: []
        },
        treasury: {
            copper: [],
            silver: [],
            gold: []
        },
        kingdomCards: {
            cellar: [],
            festival: [],
            workshop: [],
            market: [],
            smithy: [],
            village: [],
            woodcutter: [],
            laboratory: [],
            councilRoom: [],
            throneRoom: []
        }
    }
}
var Game = function () {
    //Key:
    //Turn :    1 = Player One
    //          2 = Player Two
    //Stage:    0 = New game
    //          1 = Action
    //          2 = Buy
    return {
        turn: 0,
        stage: 0,
        getStage: function () {
            return this.stage;
        }
    }
}