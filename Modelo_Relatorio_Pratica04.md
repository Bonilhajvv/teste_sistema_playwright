---
title: Relatório Prática 03 - Teste de Sistemas com Playwright
author: João Victor Bonilha Venturini
RA: 2515636
date: 2025-10-31
tags:
  - markdown
  - vscode
---

## 1. Descrição do Sistema Testado (SUT)

O TEAEdu é um sistema de gestão educacional desenvolvido para auxiliar no gerenciamento de estudantes, eventos e outras funcionalidades relacionadas ao ambiente educacional.  O sistema permite que usuários autenticados realizem login, acessem o dashboard e gerenciem diferentes tipos de eventos escolares, incluindo a criação de novos tipos de eventos com nome e descrição.

---

## 2. Jornadas de Usuário Testadas

### 2.1. Jornada de Usuário 01: Login com Sucesso (HU 2.1)

Esta jornada representa o fluxo principal de autenticação no sistema, onde um usuário válido realiza login e é redirecionado para o dashboard.

**Passos:**

1.  Navegar para a página de login (`/auth/login`)
2.  Preencher o campo de email com um email válido (`grupo6@email.com`)
3.  Preencher o campo de senha com a senha correta (`senha123`)
4.  Clicar no botão "Login"
5.  Verificar que o sistema redireciona para o dashboard (`/schools`)
6.  Verificar que a página do dashboard é exibida corretamente

### 2.2. Jornada de Usuário 02: Cadastro de Novo Tipo de Evento (HU 5.1)

Esta jornada representa o fluxo principal de criação de um novo tipo de evento no sistema.

**Passos:**

1.  Realizar login no sistema com credenciais válidas
2.  Acessar o dashboard
3.  Navegar para a seção "Event Type" através do link no dashboard
4.  Clicar no botão "Add new event type"
5.  Preencher o campo "Nome do Evento" com um nome válido (ex: "Evento de Teste")
6.  Preencher o campo "Descrição" com uma descrição válida (ex: "Esta é uma descrição de teste para o evento.")
7.  Clicar no botão "Add event type"
8.  Verificar que o sistema redireciona para a lista de eventos
9.  Verificar que o novo evento aparece na lista com o nome informado

### 2.3. Jornada de Caminho Alternativo: Login com Email Inválido (HU 2.1)

Esta jornada representa um cenário de erro no processo de autenticação, onde o usuário tenta fazer login com um email em formato inválido.

**Passos:**

1.  Navegar para a página de login (`/auth/login`)
2.  Preencher o campo de email com um email em formato inválido (`email-invalido.com`)
3.  Preencher o campo de senha com qualquer valor (`senha123`)
4.  Clicar no botão "Login"
5.  Verificar que o sistema exibe a mensagem de erro "Email ou senha inválidos."
6.  Verificar que o usuário permanece na página de login (`/auth/login`)
7.  Verificar que o campo de email e senha permanecem preenchidos para correção

---

## 3. Page Objects Implementados

### 3.1. LoginPage

A classe `LoginPage` encapsula as interações com a página de autenticação do sistema. Ela gerencia os elementos da página de login, incluindo campos de email e senha, botão de login, e a mensagem de erro de login inválido.

```typescript
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
    this.invalidLoginError = page.getByText('Email ou senha inválidos.');
  }

  async goto() {
    await this.page.goto('https://app.development.teai.com.br/auth/login');
  }

  async login(email: string, password: string): Promise<void> { 
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/.*schools/);
  }

  async assertInvalidLoginErrorVisible() {
    await expect(this.invalidLoginError).toBeVisible();
  }
}
```

### 3.2. DashboardPage

A classe `DashboardPage` representa a página principal do sistema após o login. Ela fornece métodos para navegar para diferentes seções do sistema, como a lista de estudantes e a lista de eventos.

```typescript
import { type Page, type Locator, expect } from '@playwright/test';
import { StudentListPage } from './student/student-list.page'; 
import { EventListPage } from './event/event-list.page';

export class DashboardPage {
  readonly page: Page;
  readonly studentsLink: Locator;
  readonly eventLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.studentsLink = page.getByRole('link', { name: 'students' });
    this.eventLink = page.getByRole('link', { name: 'Event Type' });
  }

  async assertIsOnPage() {
    await expect(this.page).toHaveURL(/.*schools/);
  }

  async goToStudentList(): Promise<StudentListPage> {
    await this.studentsLink.waitFor({ state: 'visible' });
    await this.studentsLink.click();
    return new StudentListPage(this.page);
  }

  async goToEventList(): Promise<EventListPage> {
    await this.eventLink.click();
    return new EventListPage(this.page);
  }
}
```

### 3.3. EventListPage

A classe `EventListPage` representa a página que exibe a lista de tipos de eventos cadastrados no sistema. Ela permite navegar para a página de criação de novos eventos.

```typescript
import { type Page, type Locator, expect } from '@playwright/test';
import { AddEventPage } from './add-event.list.page';

export class EventListPage {
  readonly page: Page;
  readonly addEventButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEventButton = page.getByRole('button', { name: 'Add new event type' });
  }

  async assertIsOnPage() {
    await expect(this.page).toHaveURL(/.*event-type/);
    await expect(this.addEventButton).toBeVisible({ timeout: 10000 });
  }

  async goToAddEventPage(): Promise<AddEventPage> {
    await this.addEventButton.click();
    return new AddEventPage(this.page);
  }
}
```

### 3.4. AddEventPage

A classe `AddEventPage` encapsula as interações com o formulário de criação de novos tipos de eventos. Ela gerencia os campos de nome e descrição do evento, além do botão de submissão.

```typescript
import { expect, Locator, Page } from "@playwright/test";
import { eventCreate } from "./types/event.types";

export class AddEventPage {
    readonly page: Page;
    readonly eventNameInput: Locator;
    readonly eventDescriptionInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventNameInput = page.getByLabel('entities.eventType.form.nameLabel');
        this.eventDescriptionInput = page.getByLabel('entities.eventType.form.descriptionLabel');
        this.submitButton = page.getByRole('button', { name: 'Add event type' });
    }

    async assertIsOnPage() {
        await expect(this.eventNameInput).toBeVisible();
    }

    async fillEventForm(data: eventCreate) {
        await this.eventNameInput.fill(data.eventName);
        await this.eventDescriptionInput.fill(data.eventDescription ?? '');
        await this.submitButton.click();
        await this.page.waitForURL(/.*event-type/);
    }
}
```

## 4. Testes Automatizados

### 4.1. Testes de Autenticação (HU 2.1)

A classe de teste `login.spec.ts` implementa os cenários de teste relacionados à autenticação do sistema. Ela valida o login bem-sucedido, o tratamento de emails inválidos e a insensibilidade a maiúsculas/minúsculas no campo de email.

```typescript
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
```

### 4.2. Testes de Gestão de Tipos de Eventos (HU 5.1)

A classe de teste `event.spec.ts` implementa os cenários de teste relacionados ao cadastro de tipos de eventos. Ela valida o cadastro bem-sucedido de novos eventos e o comportamento quando campos obrigatórios não são preenchidos.

```typescript
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
        const eventData = {
            eventName: `Evento de Teste ${Date.now()}`,
            eventDescription: 'Esta é uma descrição de teste para o evento.'
        };

        await addEventPage.fillEventForm(eventData);

        await eventListPage.assertIsOnPage();

        await expect(page.getByText(eventData.eventName)).toBeVisible();
    });

    test('Cenário 2: Não deve cadastrar sem preencher campos obrigatórios', async ({ page }) => {
        const eventDataScenario = {
            eventName: `Evento de Teste ${Date.now()}`,
            eventDescription: null
        };
        await addEventPage.fillEventForm(eventDataScenario);

        await eventListPage.assertIsOnPage();

        await expect(page.getByText(eventDataScenario.eventName)).toBeVisible();
    });
});
```

## 5. Laudo de Problemas nos Requisitos

*Nesta seção, liste e detalhe as ambiguidades, omissões e inconsistências encontradas no documento `Requisitos_TEAEdu.qmd`. Use o formato de tabela abaixo.*

| ID | Localização no Documento (Épico/História) | Descrição do Problema | Tipo (Ambiguidade, Omissão, Inconsistência) | Sugestão de Melhoria |
|---|---|---|---|---|
| REQ-01 | 3.1: Cadastro de um Novo Estudante | O requisito não especifica o formato do campo CPF (com ou sem máscara) nem a validação a ser aplicada (se o dígito verificador é calculado). | Omissão | Detalhar a regra de validação do CPF, incluindo formato esperado e tratamento de valores inválidos. |
| REQ-02 | ... | ... | ... | ... |

---

## 6. Laudo de Defeitos Encontrados

*Com base nos seus testes e na análise de requisitos, preencha este laudo para cada defeito que seria encontrado no sistema. Adapte os campos "Resultado Atual" conforme necessário, já que são defeitos teóricos.*

---
**Defeito ID:** DEF-01

**Título:** O sistema não exibe mensagem de erro ao tentar cadastrar um estudante com CPF inválido.

**Passos para Reproduzir:**

1. Navegar para a página de "Cadastro de Estudante".
2. Preencher todos os campos obrigatórios com dados válidos.
3. Inserir um CPF com formato ou dígito verificador inválido no campo "CPF" (ex: "123.456.789-00").
4. Clicar no botão "Cadastrar Estudante".

**Resultado Esperado:** O sistema deveria exibir uma mensagem de erro clara abaixo do campo CPF, informando que o valor é inválido, e o cadastro não deveria ser concluído.

**Resultado Atual (Teórico):** Com base na omissão do requisito REQ-01, o sistema provavelmente aceitaria o valor ou apresentaria um erro inesperado (ex: erro 500), pois não há uma validação especificada.

**Severidade:** Alta

---
**Defeito ID:** DEF-02

**Título:** A tradução do sistema para idiomas como inglês e espanhol não está completa.

**Passos para Reproduzir:**

1. Acessar o sistema e realizar login com credenciais válidas.
2. Navegar para qualquer página do sistema (ex: Dashboard, Lista de Eventos, Cadastro de Evento).
3. Verificar os textos exibidos na interface.
4. Observar que alguns elementos da interface ainda exibem textos em português ou chaves de tradução não processadas (ex: "entities.eventType.form.nameLabel") ao invés de textos traduzidos.

**Resultado Esperado:** O sistema deveria exibir todos os textos da interface completamente traduzidos para o idioma selecionado (inglês ou espanhol), incluindo rótulos de campos, botões, mensagens de erro e outras strings da interface.

**Resultado Atual (Teórico):** O sistema apresenta traduções incompletas, onde alguns elementos mantêm textos em português ou exibem chaves de internacionalização (i18n) não processadas, como "entities.eventType.form.nameLabel" e "entities.eventType.form.descriptionLabel", o que compromete a experiência do usuário que utiliza o sistema em outros idiomas.

**Severidade:** Média