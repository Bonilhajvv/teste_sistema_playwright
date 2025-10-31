import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page'; // Precisamos disto aqui agora

// Agrupamos todos os testes de autenticação
test.describe('Autenticação (HU 2.1)', () => {

  // Nosso teste original, agora refatorado
  test('Cenário 1: Deve fazer login com sucesso', async ({ page }) => {
    // ARRANGE
    const loginPage = new LoginPage(page);
    
    // ACT
    await loginPage.goto();
    await loginPage.login('grupo6@email.com', 'senha123'); // Ação de login

    // ASSERT
    // A asserção agora acontece no teste, não na page
    const dashboardPage = new DashboardPage(page); // Criamos a page de destino
    await dashboardPage.assertIsOnPage(); // Verificamos se chegamos lá
  });

  // NOVO TESTE: Email com formato inválido
  test('Cenário 2: Não deve fazer login com email de formato inválido', async ({ page }) => {
    // ARRANGE
    const loginPage = new LoginPage(page);

    // ACT
    await loginPage.goto();
    await loginPage.login('email-invalido.com', 'senha123'); // Tenta logar com email ruim

    // ASSERT
    // 1. Verifica se a mensagem de erro apareceu
    await loginPage.assertInvalidLoginErrorVisible();
    
    // 2. Verifica se continuamos na página de login
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  // NOVO TESTE: Email com letras maiúsculas (Case-Sensitive)
  test('Cenário 3: Deve fazer login com email em maiúsculas (ser case-insensitive)', async ({ page }) => {
    // ARRANGE
    const loginPage = new LoginPage(page);

    // ACT
    // Usamos o email correto, mas com letras maiúsculas
    await loginPage.goto();
    await loginPage.login('GRUPO6@email.com', 'senha123');

    // ASSERT
    // Esperamos que o login funcione (prova que é case-insensitive)
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertIsOnPage();
  });

});

