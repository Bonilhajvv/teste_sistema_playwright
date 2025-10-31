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

