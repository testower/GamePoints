(function () {
  'use strict';

  angular.module('myApp.game', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/game', {
      templateUrl: 'game/game.html',
      controller: 'GameCtrl'
    });
  }])

  .controller('GameCtrl', function($scope) {

    $scope.reset = generateGame;

    $scope.reset();

    function generateGame() {

      $scope.items = [];
      $scope.score = {};
      $scope.bonus = 0;
      $scope.total = 0;

      for (var i = 0; i < 9; i++) {
        $scope.items.push(generateItem());
        $scope.score[$scope.items[i].letter] = {
          qty: 0,
          total: 0
        };
      }
    }

    function generateItem() {
      var possible = "ABCD";
      var item = {};

      item.letter = possible.charAt(Math.floor(Math.random() * possible.length));
      item.collected = false;
      item.collect = function collect() {

        // Collect only once
        item.collect = function () {};

        var itemScore = $scope.score[item.letter];
        itemScore.qty++;

        var _total = 0;

        if (item.letter === 'A') {
          _total += 50;

          if (itemScore.qty % 3 === 0) {
            $scope.bonus += 50;
            _total += 50;
          }
        }

        if (item.letter === 'B') {
          _total += 30;

          if (itemScore.qty % 2 === 0) {
            $scope.bonus += 30;
            _total += 30;
          }
        }

        if (item.letter === 'C') {
          _total += 20;
        }

        if (item.letter === 'D') {
          _total += 30;
        }

        itemScore.total += _total;
        $scope.total += _total;
        item.collected = true;
      };

      return item;
    }

  });

})();
