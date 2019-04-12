/*
 * @Author: Vir Desai
 * @Date: 2018-05-05 23:34:47
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 11:42:43
 */

/**
 * Test to check if the Utils are working as expected
 */

/* global it expect jest */
/* global it expect beforeAll */
import 'react-native';

// import consts
import { AppUtil } from '../';

// setup consts
const MS_IN_DAY = 86400000;
const MS_IN_WEEK = MS_IN_DAY * 7;

// mock async-storage
beforeAll(() => {
    jest.mock('@react-native-community/async-storage');
});

// setup tests
it('Has utils available', () => {
    let numberOfUtils = 0;

    Object.keys(AppUtil).forEach(util => {
        numberOfUtils += 1;
        expect(util).not.toBe(null);
    });

    expect(numberOfUtils).not.toBe(0);
});

it('Util.objIsEmpty with a non object', () => {
    expect(AppUtil.objIsEmpty([])).toEqual(false);
});

it('Util.objIsEmpty with a empty object', () => {
    expect(AppUtil.objIsEmpty({})).toEqual(true);
});

it('Util.objIsEmpty with a non empty object', () => {
    expect(AppUtil.objIsEmpty({ key: 'value' })).toEqual(false);
});

it('Util.objToArr with a non object', () => {
    expect(AppUtil.objToArr([])).toEqual(false);
});

it('Util.objToArr with an empty object', () => {
    expect(AppUtil.objToArr({})).toEqual(false);
});

it('Util.objToArr with an object', () => {
    expect(AppUtil.objToArr({ key: 'value' })).toEqual(['value']);
});

it('Util.limitChars less than limit', () => {
    expect(AppUtil.limitChars('Short string', 15)).toEqual('Short string');
});

it('Util.limitChars more than limit', () => {
    expect(AppUtil.limitChars('Longer string than limit', 15)).toEqual('Longer string t...');
});

// it('Util.createTimeScaleX success', () => {
//     let startDate = new Date(2018, 4, 5);
//     let endDate = new Date(2018, 4, 11);
//     let width = 300;
//     let output = AppUtil.createTimeScaleX(startDate, endDate, width);
//     expect(output).toBeInstanceOf(Function);
//     expect(output(startDate.getTime() + MS_IN_DAY)).toBe('Sun 06');
//     expect(output(endDate.getTime() - MS_IN_DAY)).toBe('Thu 10');
// });

// it('Util.createScaleX success', () => {
//     let start = 100;
//     let end = 500;
//     let width = 400;
//     let output = AppUtil.createScaleX(start, end, width);
//     expect(output).toBeInstanceOf(Function);
// });

// it('Util.createScaleY success', () => {
//     let minY = 100;
//     let maxY = 500;
//     let height = 400;
//     let startY = 200;
//     let output = AppUtil.createScaleY(minY, maxY, height, startY);
//     expect(output).toBeInstanceOf(Function);
// });

it('Util.MS_IN_DAY is correct', () => {
    expect(AppUtil.MS_IN_DAY).toEqual(MS_IN_DAY);
});

it('Util.MS_IN_WEEK is correct', () => {
    expect(AppUtil.MS_IN_WEEK).toEqual(MS_IN_WEEK);
});

it('Util.formatDate less than 10 works', () => {
    let expectedDates = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
    for (let dateToFormat = 1; dateToFormat < 10; dateToFormat = dateToFormat + 1) {
        expect(AppUtil.formatDate(dateToFormat)).toEqual(expectedDates[dateToFormat-1]);
    }
});

it('Util.formatDate less than 10 fails', () => {
    let expectedDates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let dateToFormat = 1; dateToFormat < 10; dateToFormat = dateToFormat + 1) {
        expect(AppUtil.formatDate(dateToFormat)).not.toEqual(expectedDates[dateToFormat-1]);
    }
});

it('Util.formatDate greater than or equal to 10 works', () => {
    let expectedDates = [
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
        '30', '31'
    ];
    let index = 0;
    for (let dateToFormat = 10; dateToFormat < 32; dateToFormat = dateToFormat + 1) {
        expect(AppUtil.formatDate(dateToFormat)).toEqual(expectedDates[index]);
        index = index + 1;
    }
});

it('Util.getStartEndDate with no offset works', () => {
    let inputDate = new Date(2018, 4, 11, 12, 34, 56, 789); // Friday May 11th 2018 at 12:34:56.789 pm
    let expectedNewStartDate = '2018-05-07';
    let expectedNewEndDate = '2018-05-13';
    let outputDates = AppUtil.getStartEndDate(0, inputDate); // No week offset
    expect(outputDates.newStartDate).toEqual(expectedNewStartDate);
    expect(outputDates.newEndDate).toEqual(expectedNewEndDate);
});

it('Util.getStartEndDate with -1 offset works', () => {
    let inputDate = new Date(2018, 4, 11, 12, 34, 56, 789); // Friday May 11th 2018 at 12:34:56.789 pm
    let expectedNewStartDate = '2018-04-30';
    let expectedNewEndDate = '2018-05-06';
    let outputDates = AppUtil.getStartEndDate(-1, inputDate); // No week offset
    expect(outputDates.newStartDate).toEqual(expectedNewStartDate);
    expect(outputDates.newEndDate).toEqual(expectedNewEndDate);
});

it('Util.getStartEndDate with +1 offset works', () => {
    let inputDate = new Date(2018, 4, 11, 12, 34, 56, 789); // Friday May 11th 2018 at 12:34:56.789 pm
    let expectedNewStartDate = '2018-05-14';
    let expectedNewEndDate = '2018-05-20';
    let outputDates = AppUtil.getStartEndDate(1, inputDate); // No week offset
    expect(outputDates.newStartDate).toEqual(expectedNewStartDate);
    expect(outputDates.newEndDate).toEqual(expectedNewEndDate);
});

it('Util.getStartEndDate with -2 offset works', () => {
    let inputDate = new Date(2018, 4, 11, 12, 34, 56, 789); // Friday May 11th 2018 at 12:34:56.789 pm
    let expectedNewStartDate = '2018-04-23';
    let expectedNewEndDate = '2018-04-29';
    let outputDates = AppUtil.getStartEndDate(-2, inputDate); // No week offset
    expect(outputDates.newStartDate).toEqual(expectedNewStartDate);
    expect(outputDates.newEndDate).toEqual(expectedNewEndDate);
});

it('Util.getStartEndDate with +2 offset works', () => {
    let inputDate = new Date(2018, 4, 11, 12, 34, 56, 789); // Friday May 11th 2018 at 12:34:56.789 pm
    let expectedNewStartDate = '2018-05-21';
    let expectedNewEndDate = '2018-05-27';
    let outputDates = AppUtil.getStartEndDate(2, inputDate); // No week offset
    expect(outputDates.newStartDate).toEqual(expectedNewStartDate);
    expect(outputDates.newEndDate).toEqual(expectedNewEndDate);
});
