(function () {
  'use strict';

  angular.module('myApp.game', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/game', {
      templateUrl: 'game/game.html',
      controller: 'GameCtrl'
    });
  }])

  .service('gameRuleService', function ($q, $http) {
    this.fetch = function () {
      var deferred = $q.defer();

      $http.get('game/game.json').success(function (data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    }
  })

  .service('gameEngine', function (gameRuleService) {

    // Pool of letters to generate items from
    var letterPool = [];

    // Number of items in game
    var numberOfItems = 0;

    // The rules of this game
    var rules = {};

    // Items in this game
    this.items = [];

    // Keep score for each item letter
    this.score = {};

    // The bonus total
    this.bonusTotal = 0;

    // The score total including bonus
    this.scoreTotal = 0;

    // Generate game
    this.generateGame = function generateGame() {

      this.items = [];
      this.score = {};
      this.bonusTotal = 0;
      this.scoreTotal = 0;

      gameRuleService.fetch().then(function (data) {
        letterPool = data.letterPool;
        rules = data.gameRules;
        numberOfItems = data.numberOfItems;

        generateGameItems(this);

      }.bind(this));

    }.bind(this);

    // Generate all game items
    function generateGameItems(game) {
      var items = [];
      for (var i = 0; i < numberOfItems; i++) {
        var letter = generateLetter();
        game.score[letter] = {
          qty: 0,
          total: 0
        };
        generateItem(letter, game);
      }
    }

    // Generate a game item
    function generateItem(letter, game) {
      var item = {};
      var rule = rules[letter];

      item.letter = letter;
      item.collected = false;
      item.collect = function collect() {

        // set item collected
        item.collected = true;

        // Collect only once
        item.collect = function () {};

        // letterScore holds the score totals for this letter
        var letterScore = game.score[item.letter];

        // Increment the collected quantity of this letter
        letterScore.qty++;

        // Keep a running total for this 'round', initially equals to
        // the simple score for this letter, and no bonus
        var _total = rule.score;
        var _bonus = 0;

        // Apply bonus rules
        if (rule.bonus && letterScore.qty % rule.bonus.qty === 0) {
          _total += _bonus += rule.bonus.score;
        }

        // Update totals
        letterScore.total += _total;
        game.scoreTotal += _total;
        game.bonusTotal += _bonus;
      };

      game.items.push(item);
    }

    // Get a letter randomly from the pool of letters
    function generateLetter() {
      return letterPool.charAt(Math.floor(Math.random() * letterPool.length));
    }

  })

  .controller('GameCtrl', function($scope, gameEngine) {
    $scope.gameEngine = gameEngine;
    $scope.gameEngine.generateGame();
  })

})();
