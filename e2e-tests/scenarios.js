'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /game when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/game");
  });


  describe('game', function() {

    beforeEach(function() {
      browser.get('index.html#/game');
    });


    it('should render game when user navigates to /game', function() {
      expect(element.all(by.css('[ng-view] h3')).first().getText()).
        toMatch(/Game points/);
    });

    describe('collecting an item', function () {
      var elm = element.all(by.css('[ng-view] .game-item')).first();
      it('should change its appearance to indicate that is has been collected', function () {
        elm.click();
        expect(elm.getAttribute('class')).toMatch(/btn-success/);
      });

    });
  });

});
