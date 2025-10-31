import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login/login.page';
import { AddStudentPage } from '../pages/student/add-student.page';
import { StudentListPage } from '../pages/student/student-list.page';
import { StudentData } from '../pages/student/types/student.types';

const baseStudentData: StudentData = {
  fullName: `Test Student ${Date.now()}`,
  cpf: `111.${Math.floor(Math.random() * 900) + 100}.333-44`,
  dob: '01/01/2010',
  gender: 'Male',
  country: 'Brazil',
  schoolYear: '7st year of Preschool',
  
  guardianName: 'jose', 
  kinship: 'Mother', 
  phone: '(11) 99999-9999',
  
  teacher: 'Professor IMA',
  cep: '87308786',
  number: '123',
};

const expectedCpfErrorMessage = 'This CPF is already in use.'; 
const expectedRequiredFieldMessage = 'This field is required';


test.describe('Gestão de Estudantes (HU 3.1 - Simplificado)', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let studentListPage: StudentListPage;
  let addStudentPage: AddStudentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('grupo6@email.com', 'senha123');
    
    dashboardPage = new DashboardPage(page);
    await dashboardPage.assertIsOnPage(); 
    studentListPage = await dashboardPage.goToStudentList();
    
    await studentListPage.assertIsOnPage();
    addStudentPage = await studentListPage.goToAddStudentPage();

    await addStudentPage.assertIsOnPage();
  });

  test('Cenário 1: Deve cadastrar um novo estudante com sucesso', async ({ page }) => {
    await addStudentPage.fillStudentForm(baseStudentData);
    const finalStudentListPage = await addStudentPage.submitForm();

    await finalStudentListPage.assertIsOnPage();
    await expect(page.getByText(baseStudentData.fullName)).toBeVisible();
  });

  test('Cenário 2: Não deve cadastrar sem preencher campos obrigatórios', async ({ page }) => {
    await addStudentPage.submitFormExpectingError();

    await addStudentPage.assertRequiredFieldMessage(expectedRequiredFieldMessage);
    await expect(page).toHaveURL(/.*students\/new/);
  });

  test('Cenário 3: Não deve cadastrar um estudante com CPF duplicado', async ({ page }) => {
    const duplicateData: StudentData = {
      ...baseStudentData, 
      cpf: '768.341.040-38', 
      fullName: `Test Student CPF Duplicado ${Date.now()}` 
    };
    
    await addStudentPage.fillStudentForm(duplicateData);
    await addStudentPage.submitFormExpectingError();

    await addStudentPage.assertServerErrorMessage(expectedCpfErrorMessage);
    await expect(page).toHaveURL(/.*students\/new/);
  });
  
});

