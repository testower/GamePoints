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

    describe('item', function () {
      it('clicking it should change its css to btn-success', function () {
        var elm = element.all(by.css('[ng-view] .game-item')).first();

        expect(elm.getAttribute('class')).not.toMatch(/btn-success/);
        elm.click();
        expect(elm.getAttribute('class')).toMatch(/btn-success/);
      });
    });
  });

});
