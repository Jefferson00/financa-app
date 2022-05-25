describe('Home', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen', async () => {
    await element(by.id('google-login-button')).tap();
   // await element(by.id('container')).tapAtPoint({x:0, y:0});
   // await web.element().tapAtPoint(0, 0);
    //await web.element(by.web.cssSelector('#identifierId')).typeText('someone@example.com');
    //await element(by.text('Add another account')).tap();
    await expect(element(by.type(`android.widget.toast`))).toBeVisible();
  });
});
