describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen', async () => {
    await expect(element(by.text('Controle suas finanças de um jeito simples'))).toBeVisible();
  });

  it('should show phone login screen after tap', async () => {
    await element(by.id('phone-login-button')).tap();
    await expect(element(by.text('Informe seu número'))).toBeVisible();
  });
});
