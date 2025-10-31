import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly invalidLoginError: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });

    // Seletor para a mensagem de erro
    this.invalidLoginError = page.getByText('Email ou senha inválidos.');
  }

  async goto() {
    await this.page.goto('https://app.development.teai.com.br/auth/login');
  }

  /**
   * Executa o fluxo de login, mas não verifica o resultado.
   * @param email O email do usuário
   * @param password A senha do usuário
   */
  async login(email: string, password: string): Promise<void> {
    
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    
    await this.loginButton.click();
    
  }

  async assertInvalidLoginErrorVisible() {
    await expect(this.invalidLoginError).toBeVisible();
  }
}

