import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { EventListPage } from '../pages/event/event-list.page';
import { LoginPage } from '../pages/login/login.page';
import { AddEventPage } from '../pages/event/add-event.list.page';


test.describe('Gestão de Tipos de Eventos (HU 5.1)', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let eventListPage: EventListPage;
    let addEventPage: AddEventPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('grupo6@email.com', 'senha123');

        dashboardPage = new DashboardPage(page);
        await dashboardPage.assertIsOnPage();
        eventListPage = await dashboardPage.goToEventList();

        await eventListPage.assertIsOnPage();
        addEventPage = await eventListPage.goToAddEventPage();

        await addEventPage.assertIsOnPage();
    });

    test('Cenário 1: Deve cadastrar um novo tipo de evento com sucesso', async ({ page }) => {
        const eventName = `Evento de Teste ${Date.now()}`;
        const eventDescription = 'Esta é uma descrição de teste para o evento.';
        const data = {
            eventName,
            eventDescription
        }
        await addEventPage.fillEventForm(data); 

        await eventListPage.assertIsOnPage();

        await expect(page.getByText(eventName)).toBeVisible();
    });

    test('Cenário 2: Não deve cadastrar sem preencher campos obrigatórios', async ({ page }) => {
                const eventName = `Evento de Teste ${Date.now()}`;
        const eventDescription = null;
        const data = {
            eventName,
            eventDescription
        }
        await addEventPage.fillEventForm(data); 

        await eventListPage.assertIsOnPage();

        await expect(page.getByText(eventName)).toBeVisible();
    });
});
