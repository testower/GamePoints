'use strict';

var gameRuleMock = {
  "letterPool": "ABCD",
  "numberOfItems": 9,
  "gameRules": {
    "A": {
      "score": 50,
      "bonus": {
        "qty": 3,
        "score": 50
      }
    },
    "B": {
      "score": 30,
      "bonus": {
        "qty": 2,
        "score": 30
      }
    },
    "C": {
      "score": 20,
      "bonus": {
        "qty": 1,
        "score": -10
      }
    },
    "D": {
      "score": 15
    }
  }
};

describe('myApp.game module', function() {

  beforeEach(module('myApp.game'));

  describe('game controller', function () {
    var gameCtrl = {};

    beforeEach(module(function ($provide) {
      $provide.value('$scope', {});
      $provide.value('gameEngine', {
        generateGame: function() {}
      });
    }));

    beforeEach(inject(function($controller) {
      gameCtrl = $controller('GameCtrl');
    }));

    it('should be defined', function () {
      expect(gameCtrl).toBeDefined();
    });
  });

  describe('gameEngine', function() {
    var gameEngine = {};

    beforeEach(module(function ($provide) {
      $provide.value('gameRuleService', {
        fetch: function () {
          return {
            then: function (callback) {
              callback(gameRuleMock);
            }
          }
        }
      });
    }));

    beforeEach(inject(function (_gameEngine_) {
      gameEngine = _gameEngine_;
      gameEngine.generateGame();
    }));

    describe('a game', function () {
      it('should have some items', function () {
        expect(gameEngine.items.length).toBeGreaterThan(0);
      });

      it('should initially have 0 points in total scores', function () {
        expect(gameEngine.scoreTotal).toBe(0);
        expect(gameEngine.bonusTotal).toBe(0);
      });

      // This test could theoretically fail, TODO: find better way to
      // test that the engine generates random games?
      it('should generate random games', function () {
        var firstGameItems = "";
        var secondGameItems = "";

        for (var i = 0; i < gameEngine.items.length; i++) {
          firstGameItems += gameEngine.items[i].letter;
        }

        // regenerate game
        gameEngine.generateGame();
        for (var i = 0; i < gameEngine.items.length; i++) {
          secondGameItems += gameEngine.items[i].letter;
        }

        expect(firstGameItems).not.toEqual(secondGameItems);
      });

      it('should generate 9 items', function () {
        expect(gameEngine.items.length).toEqual(9);
      });

      it('should increment quantity of a letter score when collecting that letter', function () {
        var item = gameEngine.items[0];
        var letterScore = gameEngine.score[item.letter];

        item.collect();
        expect(letterScore.qty).toEqual(1);
      });

      it('should item should be collected only once', function () {
        var item = gameEngine.items[0];
        var letterScore = gameEngine.score[item.letter];

        item.collect();
        item.collect();
        expect(letterScore.qty).toEqual(1);
      });

      it('should increase scoreTotal by the correct amount when one item is collected', function () {

        var item = gameEngine.items[0];
        var letterScore = gameEngine.score[item.letter];
        var rule = gameRuleMock.gameRules[item.letter];
        var score = 0;
        var bonus = 0;

        item.collect();

        score = rule.score;

        if (rule.bonus && letterScore.qty % rule.bonus.qty === 0) {
          score += bonus += rule.bonus.score;
        }

        expect(gameEngine.scoreTotal).toEqual(score);
        expect(gameEngine.bonusTotal).toEqual(bonus);
      });

      it('should have correct totals when all items are collected', function () {

        var scoreTotal = 0;
        var bonusTotal = 0;

        gameEngine.generateGame();

        for (var i = 0; i < gameEngine.items.length; i++) {
          var item = gameEngine.items[i];
          var letterScore = gameEngine.score[item.letter];
          var rule = gameRuleMock.gameRules[item.letter];
          var _total = rule.score;
          var _bonus = 0;

          item.collect();

          if (rule.bonus && letterScore.qty % rule.bonus.qty === 0) {
            _total += _bonus += rule.bonus.score;
          }

          scoreTotal += _total;
          bonusTotal += _bonus;
        }

        expect(gameEngine.scoreTotal).toEqual(scoreTotal);
        expect(gameEngine.bonusTotal).toEqual(bonusTotal);
      });

    });

  });
});
