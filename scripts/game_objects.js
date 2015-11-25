//I understand all of these should have been done with 
//getter and setter methods to provide private information,
//but I realized after I finished. Because it's just a game, 
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
var KingdomCard = function (name, cost, draw, action, buy, bonus, double) {
    return {
        name: name,
        cost: cost,
        deckDraw: draw,
        actionBonus: action,
        buyBonus: buy,
        purseBonus: bonus,
        throneRoom: double,
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
            moat: [],
            throneRoom: [],
        }
    }
}
var Game = function () {
    //Key:
    //Player One: Turn = 1
    //Player Two: Turn = 2
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