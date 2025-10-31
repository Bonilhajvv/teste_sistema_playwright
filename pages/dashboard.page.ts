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

