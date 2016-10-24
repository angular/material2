describe('radio', function () {

  describe('disabling behavior', function () {
    beforeEach(function() {
      browser.get('/radio');
    });

    it('should be checked when clicked', function () {
      element(by.id('water')).click();
      element(by.id('water')).getAttribute('class').then((value: string) => {
        expect(value).toContain('md-radio-checked');
      });

      element(by.id('leaf')).click();
      element(by.id('leaf')).getAttribute('class').then((value: string) => {
        expect(value).toContain('md-radio-checked');
      });
    });
  });
});
