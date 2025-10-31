import { type Page, type Locator, expect } from '@playwright/test';
import { StudentListPage } from './student-list.page';
import { StudentData } from './types/student.types';

export class AddStudentPage {
  readonly page: Page;

  readonly fullNameInput: Locator;
  readonly cpfInput: Locator;
  readonly dobInput: Locator;
  readonly genderSelect: Locator;
  readonly countryOfBirth: Locator;
  readonly schoolYearSelect: Locator;
  readonly guardianNameInput: Locator;
  readonly kinshipSelect: Locator;
  readonly phoneInput: Locator;
  readonly teacherSelect: Locator;
  readonly cepInput: Locator;
  readonly numberInput: Locator;
  readonly submitButton: Locator;

  readonly addGuardianButton: Locator;

  readonly serverErrorMessage: Locator;
  readonly validationMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.fullNameInput = page.getByLabel('entities.common.person.fullNameLabel');
    this.cpfInput = page.getByLabel('entities.common.person.cpfLabel');
    this.dobInput = page.getByPlaceholder('dd/mm/aaaa');
    this.genderSelect = page.getByLabel('entities.common.person.gender.label');
    this.countryOfBirth = page.getByLabel('entities.common.person.countryOfBirth');
    this.schoolYearSelect = page.getByLabel('entities.student.form.schoolYear.label');

    this.guardianNameInput = page.getByLabel("entities.common.responsible.singularC 1entities.common.responsible.nameLabel");
    this.kinshipSelect = page.getByLabel('entities.guardian.kinshipLabel');
    this.phoneInput = page.getByLabel('entities.common.person.phoneLabel');

    this.addGuardianButton = page.getByRole('button', { name: 'Adicionar Responsável' });
    this.teacherSelect = page.getByLabel('entities.student.teacherLabel');
    this.cepInput = page.getByLabel('ZIP Code');
    this.numberInput = page.getByLabel('entities.address.numberLabel');
    this.submitButton = page.getByRole('button', { name: 'entities.common.register' });

    this.serverErrorMessage = page.getByText('This CPF is already in use.');
    this.validationMessage = page.getByText('This field is required');
  }

  /**
   * Verifica se o usuário está na página de cadastro de estudante
   */
  async assertIsOnPage() {
    await expect(this.page).toHaveURL(/.*students\/new/);
    await expect(this.fullNameInput).toBeVisible();
  }

  /**
   * Preenche o formulário completo com os dados do estudante.
   */
  async fillStudentForm(data: StudentData) {
    await this.fullNameInput.fill(data.fullName);
    await this.cpfInput.fill(data.cpf);
    await this.dobInput.fill(data.dob);

    await this.genderSelect.click();

    let genderValueKey = '';
    const genderLower = data.gender.toLowerCase();

    if (genderLower === 'male') {
      genderValueKey = 'entities.common.person.gender.male';
    } else if (genderLower === 'female') {
      genderValueKey = 'entities.common.person.gender.female';
    } else if (genderLower === 'other') {
      genderValueKey = 'entities.common.person.gender.other';
    }

    await this.page.getByRole('option', { name: genderValueKey, exact: true }).click();

    await this.countryOfBirth.fill(data.country);

    await this.schoolYearSelect.click();

    let schoolYearValueKey = '';
    const schoolYearLower = data.schoolYear.toLowerCase();

    switch (schoolYearLower) {
      case 'preschool':
        genderValueKey = 'entities.student.form.schoolYear.preschool';
        break;
      case '1st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.firstYear';
        break;
      case '2st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.secondYear';
        break;
      case '3st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.thirdYear';
        break;
      case '4st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.fourthYear';
        break;
      case '5st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.fifthYear';
        break;
      case '6st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.sixthYear';
        break;
      case '7st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.seventhYear';
        break;
      case '8st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.eighthYear';
        break;
      case '9st year of preschool':
        schoolYearValueKey = 'entities.student.form.schoolYear.ninthYear';
        break;
      case '1st year of high school':
        schoolYearValueKey = 'entities.student.form.schoolYear.firstYearHigh';
        break;
      case '2nd year of high school':
        schoolYearValueKey = 'entities.student.form.schoolYear.secondYearHigh';
        break;
      case '3rd year of high school':
        schoolYearValueKey = 'entities.student.form.schoolYear.thirdYearHigh';
        break;
    }
    await this.page.getByRole('option', { name: schoolYearValueKey, exact: true }).click();
    await this.page.getByRole('option', { name: data.schoolYear, exact: true }).click();
           await this.guardianNameInput.fill('jose'); 
await this.page.getByRole('textbox', { name: 'entities.common.responsible.' }).fill('ddsa');
    // for (const [index, guardian] of data.guardians.entries()) {
    //   if (index === 0) {
    //     // Preenche o PRIMEIRO responsável (index 0)
    //     await this.guardianNameInput.fill(guardian.name);
    //     await this.kinshipSelect.click();
    //     await this.page.getByRole('option', { name: guardian.kinship, exact: true }).click();
    //     await this.phoneInput.fill(guardian.phone);
    //   } else {
    //     // Adiciona um NOVO responsável e usa os seletores dinâmicos
    //     await this.addGuardianButton.click(); // <-- O USO ESTÁ AQUI

    //     // Seletores dinâmicos para o N-ésimo responsável (baseado no seu CodeGen)
    //     await this.page.locator(`input[name="responsibles.${index}.name"]`).fill(guardian.name);

    //     // Usa .nth(index) para encontrar o combobox de parentesco correto
    //     await this.page.getByLabel('entities.guardian.kinshipLabel').nth(index).click();
    //     await this.page.getByRole('option', { name: guardian.kinship, exact: true }).click();

    //     // Seletores dinâmicos para o telefone (baseado no seu CodeGen)
    //     await this.page.locator(`input[name="responsibles.${index}.phone.number"]`).fill(guardian.phone);
    //   }
    // }

    await this.kinshipSelect.click();
    await this.page.getByRole('option', { name: data.kinship, exact: true }).click();

    await this.phoneInput.fill(data.phone);

    await this.teacherSelect.click();
    // Este parece ser um 'getByText' simples (não 'getByRole')
    await this.page.getByText(data.teacher).click();

    await this.cepInput.fill(data.cep);

    // Espera que o campo 'Number' apareça (após o CEP ser processado)
    await expect(this.numberInput).toBeVisible({ timeout: 5000 });
    await this.numberInput.fill(data.number);
  }

  /**
   * Clica no botão de submeter o formulário
   */
  async submitForm(): Promise<StudentListPage> {
    await this.submitButton.click();
    // Após o cadastro, espera-se voltar para a lista
    return new StudentListPage(this.page);
  }

  /**
   * Tenta submeter o formulário (para testes de erro)
   */
  async submitFormExpectingError() {
    await this.submitButton.click();
  }

  /**
   * Verifica a mensagem de erro do servidor (ex: CPF duplicado)
   * IMPORTANTE: 'errorMessage' deve ser o texto EXATO do erro.
   */
  async assertServerErrorMessage(errorMessage: string) {
    const errorLocator = this.page.getByText(errorMessage);
    await expect(errorLocator).toBeVisible();
  }

  /**
   * Verifica a mensagem de validação do navegador (ex: campo obrigatório)
   * IMPORTANTE: 'errorMessage' deve ser o texto EXATO do erro.
   */
  async assertRequiredFieldMessage(errorMessage: string) {
    const errorLocator = this.page.getByText(errorMessage);
    await expect(errorLocator).toBeVisible();
  }
}

