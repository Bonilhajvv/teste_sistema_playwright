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

