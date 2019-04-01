/* global it expect jest */
/* global it expect beforeAll */
import 'react-native';

// import consts
import { onboardingUtils, } from '../../constants/utils';

// mock async-storage
beforeAll(() => {
    jest.mock('@react-native-community/async-storage');
});

// setup tests
it('Password Validation - Empty String', () => {
    let passwordString = '';
    expect(onboardingUtils.isPasswordValid(passwordString).isValid).toEqual(false);
});

it('Password Validation - Invalid String', () => {
    let passwordString = 'fathom!';
    expect(onboardingUtils.isPasswordValid(passwordString).isValid).toEqual(false);
});

it('Password Validation - Short String', () => {
    let passwordString = 'Fat12';
    expect(onboardingUtils.isPasswordValid(passwordString).isValid).toEqual(false);
});

it('Password Validation - Valid', () => {
    let passwordString = 'Fathom123';
    expect(onboardingUtils.isPasswordValid(passwordString).isValid).toEqual(true);
});

it('Password Validation - Valid', () => {
    let passwordString = 'Fathom123!';
    expect(onboardingUtils.isPasswordValid(passwordString).isValid).toEqual(true);
});

it('Password Validation - Valid', () => {
    let passwordString = 'Fathom123<>';
    expect(onboardingUtils.isPasswordValid(passwordString).isValid).toEqual(true);
});

it('Phone Number Validation - Valid', () => {
    let phoneNumber = '1234567890';
    expect(onboardingUtils.isPhoneNumberValid(phoneNumber)).toEqual(true);
});

it('Phone Number Validation - Valid', () => {
    let phoneNumber = '(123) 456-7890';
    expect(onboardingUtils.isPhoneNumberValid(phoneNumber)).toEqual(true);
});

it('Phone Number Validation - Valid', () => {
    let phoneNumber = '123-456-7890';
    expect(onboardingUtils.isPhoneNumberValid(phoneNumber)).toEqual(true);
});

it('Phone Number Validation - Invalid - short', () => {
    let phoneNumber = '123456789';
    expect(onboardingUtils.isPhoneNumberValid(phoneNumber)).toEqual(false);
});

it('Phone Number Validation - Invalid - short', () => {
    let phoneNumber = '123-456-78';
    expect(onboardingUtils.isPhoneNumberValid(phoneNumber)).toEqual(false);
});

it('Phone Number Validation - Invalid - long', () => {
    let phoneNumber = '1-123-456-78';
    expect(onboardingUtils.isPhoneNumberValid(phoneNumber)).toEqual(false);
});

it('Phone Number Validation - Invalid - Has Text', () => {
    let phoneNumber = '123-FAT-HOM1';
    expect(onboardingUtils.isPhoneNumberValid(phoneNumber)).toEqual(false);
});

it('Email Validation - Invalid - .c', () => {
    let emailString = 'mazen@fathomai.c';
    expect(onboardingUtils.isEmailValid(emailString).isValid).toEqual(false);
});

it('Email Validation - Invalid - no @', () => {
    let emailString = 'mazenfathomai.com';
    expect(onboardingUtils.isEmailValid(emailString).isValid).toEqual(false);
});

it('Email Validation - Valid - .com', () => {
    let emailString = 'mazen@fathomai.com';
    expect(onboardingUtils.isEmailValid(emailString).isValid).toEqual(true);
});

it('Email Validation - Valid - .mil', () => {
    let emailString = 'mazen@fathomai.mil';
    expect(onboardingUtils.isEmailValid(emailString).isValid).toEqual(true);
});

it('Email Validation - Valid - with Special Characters', () => {
    let emailString = 'mazen+test@fathomai.com';
    expect(onboardingUtils.isEmailValid(emailString).isValid).toEqual(true);
});

it('Has Whitespaces Validation - Valid', () => {
    let str = 'HeLlO World';
    expect(onboardingUtils.hasWhiteSpaces(str)).toEqual(true);
});

it('Has Whitespaces Validation - Invalid', () => {
    let str = 'helloworld';
    expect(onboardingUtils.hasWhiteSpaces(str)).toEqual(false);
});

it('Inches to Meters Validation - 1 in', () => {
    let inches = 1;
    let expectedResult = '0.03';
    expect(onboardingUtils.inchesToMeters(inches)).toEqual(expectedResult);
});

it('Inches to Meters Validation - 72 in', () => {
    let inches = 72;
    let expectedResult = '1.83';
    expect(onboardingUtils.inchesToMeters(inches)).toEqual(expectedResult);
});

it('Inches to Meters Validation - 50 (string) in', () => {
    let inches = '50';
    let expectedResult = '1.27';
    expect(onboardingUtils.inchesToMeters(inches)).toEqual(expectedResult);
});

it('Inches to Meters Validation - 7A2 (string) in', () => {
    let inches = '7A2'; // JS will trim this string to only grab items prior to the first non-number
    let expectedResult = '0.18';
    expect(onboardingUtils.inchesToMeters(inches)).toEqual(expectedResult);
});

it('Lbs to Kgs Validation - 1 in', () => {
    let lbs = 1;
    let expectedResult = '0.45';
    expect(onboardingUtils.lbsToKgs(lbs)).toEqual(expectedResult);
});

it('Lbs to Kgs Validation - 250 in', () => {
    let lbs = 250;
    let expectedResult = '113.40';
    expect(onboardingUtils.lbsToKgs(lbs)).toEqual(expectedResult);
});

it('Lbs to Kgs Validation - 200 (string) in', () => {
    let lbs = '250';
    let expectedResult = '113.40';
    expect(onboardingUtils.lbsToKgs(lbs)).toEqual(expectedResult);
});

it('Lbs to Kgs Validation - 25BB0 (string) in', () => {
    let lbs = '25BB0'; // JS will trim this string to only grab items prior to the first non-number
    let expectedResult = '11.34';
    expect(onboardingUtils.lbsToKgs(lbs)).toEqual(expectedResult);
});

it('Meters to Inches Validation - 1 in', () => {
    let meters = 1;
    let expectedResult = '39.37';
    expect(onboardingUtils.metersToInches(meters)).toEqual(expectedResult);
});

it('Meters to Inches Validation - 72 in', () => {
    let meters = 72;
    let expectedResult = '2834.65';
    expect(onboardingUtils.metersToInches(meters)).toEqual(expectedResult);
});

it('Meters to Inches Validation - 50 (string) in', () => {
    let meters = '50';
    let expectedResult = '1968.51';
    expect(onboardingUtils.metersToInches(meters)).toEqual(expectedResult);
});

it('Meters to Inches Validation - 7A2 (string) in', () => {
    let meters = '7A2'; // JS will trim this string to only grab items prior to the first non-number
    let expectedResult = '275.59';
    expect(onboardingUtils.metersToInches(meters)).toEqual(expectedResult);
});

it('Kgs to Lbs Validation - 1 in', () => {
    let kgs = 1;
    let expectedResult = '2.20';
    expect(onboardingUtils.kgsToLbs(kgs)).toEqual(expectedResult);
});

it('Kgs to Lbs Validation - 70 in', () => {
    let kgs = 70;
    let expectedResult = '154.32';
    expect(onboardingUtils.kgsToLbs(kgs)).toEqual(expectedResult);
});

it('Kgs to Lbs Validation - 50 (string) in', () => {
    let kgs = '50';
    let expectedResult = '110.23';
    expect(onboardingUtils.kgsToLbs(kgs)).toEqual(expectedResult);
});

it('Kgs to Lbs Validation - 25BB0 (string) in', () => {
    let kgs = '25BB0'; // JS will trim this string to only grab items prior to the first non-number
    let expectedResult = '55.12';
    expect(onboardingUtils.kgsToLbs(kgs)).toEqual(expectedResult);
});

it('Is User Account Information Validation - empty strings', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = '';
    user.personal_data.last_name = '';
    user.personal_data.email = '';
    user.personal_data.phone_number = '';
    user.password = '';
    expect(onboardingUtils.isUserAccountInformationValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - fName only', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = '';
    user.personal_data.email = '';
    user.personal_data.phone_number = '';
    user.password = '';
    expect(onboardingUtils.isUserAccountInformationValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - fName, lName only', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = '';
    user.personal_data.phone_number = '';
    user.password = '';
    expect(onboardingUtils.isUserAccountInformationValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - fName, lName only, invalid email', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = 'mazenfathomai.com';
    user.personal_data.phone_number = '';
    user.password = '';
    expect(onboardingUtils.isUserAccountInformationValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - fName, lName, email only', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = 'mazen@fathomai.com';
    user.personal_data.phone_number = '';
    user.password = '';
    expect(onboardingUtils.isUserAccountInformationValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - fName, lName, email only, invalid phone number', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = 'mazen@fathomai.com';
    user.personal_data.phone_number = '123456789';
    user.password = '';
    expect(onboardingUtils.isUserAccountInformationValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - fName, lName, email, phone number only', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = 'mazen@fathomai.com';
    user.personal_data.phone_number = '123456789';
    user.password = '';
    expect(onboardingUtils.isUserAccountInformationValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - fName, lName, email, phone number only, invalid password', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = 'mazen@fathomai.com';
    user.personal_data.phone_number = '1234567890';
    user.password = 'Fathom';
    expect(onboardingUtils.isUserAccountInformationValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - valid input', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = 'mazen@fathomai.com';
    user.personal_data.phone_number = '1234567890';
    user.password = 'Fathom123';
    user.confirm_password = 'Fathom123';
    let isUpdatingUser = false;
    expect(onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).isValid).toEqual(true);
});

it('Is User Account Information Validation - valid input - invalid password as we are in "update" mode', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = 'mazen@fathomai.com';
    user.personal_data.phone_number = '1234567890';
    user.password = 'Fathom';
    let isUpdatingUser = true;
    expect(onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).isValid).toEqual(true);
});

it('Is User Account Information Validation - valid input - no password as we are in "update" mode', () => {
    let user = {};
    user.personal_data = {};
    user.personal_data.first_name = 'Mazen';
    user.personal_data.last_name = 'Chami';
    user.personal_data.email = 'mazen@fathomai.com';
    user.personal_data.phone_number = '1234567890';
    let isUpdatingUser = true;
    expect(onboardingUtils.isUserAccountInformationValid(user, isUpdatingUser).isValid).toEqual(true);
});

it('Is User Account Information Validation - all empty inputs', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = ''; // '1-sensor' or '3-sensor'
    user.injury_status = ''; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '';
    user.personal_data.zip_code = '';
    user.biometric_data.sex = ''; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '';
    user.biometric_data.height.in = '';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - system_type only', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = ''; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '';
    user.personal_data.zip_code = '';
    user.biometric_data.sex = ''; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '';
    user.biometric_data.height.in = '';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - system_type, injury_status only', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '';
    user.personal_data.zip_code = '';
    user.biometric_data.sex = ''; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '';
    user.biometric_data.height.in = '';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - system_type, injury_status, birth_date only', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '';
    user.biometric_data.sex = ''; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '';
    user.biometric_data.height.in = '';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - system_type, injury_status, zip_code only', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '27701';
    user.biometric_data.sex = ''; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '';
    user.biometric_data.height.in = '';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - system_type, injury_status, zip_code, sex only', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '27701';
    user.biometric_data.sex = 'other'; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '';
    user.biometric_data.height.in = '';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - system_type, injury_status, zip_code, sex, lb only', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '27701';
    user.biometric_data.sex = 'other'; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '200';
    user.biometric_data.height.in = '';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(true);
});

it('Is User Account Information Validation - valid fields', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '27701';
    user.biometric_data.sex = 'other'; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '200';
    user.biometric_data.height.in = '72';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(true);
});

it('Is User Account Information Validation - valid fields with empty system_type', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = ''; // '1-sensor' or '3-sensor' or ''
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '27701';
    user.biometric_data.sex = 'other'; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '200';
    user.biometric_data.height.in = '72';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(true);
});

it('Is User Account Information Validation - valid fields NOT sex', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '27701';
    user.biometric_data.sex = 'intersex'; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '200';
    user.biometric_data.height.in = '72';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(false);
});

it('Is User Account Information Validation - valid fields NOT zip_code', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'returning_from_injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '277';
    user.biometric_data.sex = 'other'; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '200';
    user.biometric_data.height.in = '72';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(true);
});

it('Is User Account Information Validation - valid fields NOT injury_status', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '1-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '277';
    user.biometric_data.sex = 'other'; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '200';
    user.biometric_data.height.in = '72';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(true);
});

it('Is User Account Information Validation - valid fields NOT system_type', () => {
    let user = {};
    user.personal_data = {};
    user.biometric_data = {};
    user.biometric_data.mass = {};
    user.biometric_data.height = {};
    user.system_type = '0-sensor'; // '1-sensor' or '3-sensor'
    user.injury_status = 'injury'; // 'healthy', 'healthy_chronically_injured', 'returning_from_injury', 'returning_from_acute_injury'
    user.personal_data.birth_date = '10/10/1989';
    user.personal_data.zip_code = '277';
    user.biometric_data.sex = 'other'; // 'male', 'female', 'other'
    user.biometric_data.mass.lb = '200';
    user.biometric_data.height.in = '72';
    expect(onboardingUtils.isUserAboutValid(user).isValid).toEqual(true);
});
