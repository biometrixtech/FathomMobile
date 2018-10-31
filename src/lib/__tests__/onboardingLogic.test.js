/* global it expect jest */
import 'react-native';

import { onboardingUtils } from '../../constants/utils';

it('Password Validation - Empty String', () => {
    let passwordString = '';
    expect(onboardingUtils.isPasswordValid(passwordString).isValid).toEqual(false);
});

it('Password Validation - Invalid String', () => {
    let passwordString = 'fathom123!';
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
