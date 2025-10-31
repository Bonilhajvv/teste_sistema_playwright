import { type Page, expect } from 'playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async assertIsOnPage() {
    await expect(this.page).toHaveURL(/.*schools/);
  }
}
