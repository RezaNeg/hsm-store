import { Hsm02Page } from './app.po';

describe('hsm02 App', () => {
  let page: Hsm02Page;

  beforeEach(() => {
    page = new Hsm02Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
