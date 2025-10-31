import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login/login.page';

test.describe('Autenticação (HU 2.1)', () => {

  test('Cenário 1: Deve fazer login com sucesso', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('grupo6@email.com', 'senha123');

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertIsOnPage();
  });

  test('Cenário 2: Não deve fazer login com email de formato inválido', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('email-invalido.com', 'senha123');

    await loginPage.assertInvalidLoginErrorVisible();
    
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('Cenário 3: Deve fazer login com email em maiúsculas (ser case-insensitive)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('GRUPO6@email.com', 'senha123');

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertIsOnPage();
  });

});

