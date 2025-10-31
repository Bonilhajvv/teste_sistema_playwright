import { type Page, type Locator, expect } from '@playwright/test';
import { AddStudentPage } from './add-student.page';

export class StudentListPage {
  readonly page: Page;
  readonly addStudentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addStudentButton = page.locator('button:has-text("Add new student")');
  }

  async assertIsOnPage() {
    await expect(this.page).toHaveURL(/.*students/);
    await expect(this.addStudentButton).toBeVisible({ timeout: 10000 });
  }

  async goToAddStudentPage(): Promise<AddStudentPage> {
    await this.addStudentButton.click();
    return new AddStudentPage(this.page);
  }
}

