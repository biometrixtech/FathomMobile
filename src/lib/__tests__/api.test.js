/*
 * @Author: Vir Desai 
 * @Date: 2018-05-05 23:34:47 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-05-06 22:57:42
 */

/**
 * Test to check if the API is working as expected
 */

/* global it expect jest */
import 'react-native';

import { AppAPI } from '../';

it('Handle API error', () => {
    let errorMessage = 'error message';
    expect(AppAPI.handleError(errorMessage)).toEqual(errorMessage);
});

it('Has debug', () => {
    expect(AppAPI.debug).toBeInstanceOf(Function);
});

it('Has api endpoints available', () => {
    let numberOfEndpoints = 0;

    Object.keys(AppAPI).forEach(endpoint => {
        numberOfEndpoints += 1;
        expect(endpoint).not.toBe(null);
    });

    expect(numberOfEndpoints).not.toBe(0);
});

it('Has stats endpoints available', () => {
    let numberOfEndpoints = 0;

    Object.keys(AppAPI.stats).forEach((endpoint) => {
        numberOfEndpoints += 1;
        expect(endpoint).not.toBe(null);
    });

    expect(numberOfEndpoints).not.toBe(0);
});

it('Has preprocessing endpoints available', () => {
    let numberOfEndpoints = 0;

    Object.keys(AppAPI.preprocessing).forEach((endpoint) => {
        numberOfEndpoints += 1;
        expect(endpoint).not.toBe(null);
    });

    expect(numberOfEndpoints).not.toBe(0);
});

it('Has hardware endpoints available', () => {
    let numberOfEndpoints = 0;

    Object.keys(AppAPI.hardware).forEach((endpoint) => {
        numberOfEndpoints += 1;
        expect(endpoint).not.toBe(null);
    });

    expect(numberOfEndpoints).not.toBe(0);
});

it('Has api REST methods available', () => {
    const excludedEndpoints = [
        'debug',
        'handleError',
        'getToken',
        'stats',
        'preprocessing',
        'hardware',
    ];

    Object.keys(AppAPI).forEach((endpoint) => {
        if (excludedEndpoints.indexOf(endpoint) > -1) { return; }
        expect(typeof AppAPI[endpoint].get).toEqual('function');
        expect(typeof AppAPI[endpoint].post).toEqual('function');
        expect(typeof AppAPI[endpoint].patch).toEqual('function');
        expect(typeof AppAPI[endpoint].put).toEqual('function');
        expect(typeof AppAPI[endpoint].delete).toEqual('function');
    });
});

it('Has stats REST methods available', () => {
    Object.keys(AppAPI.stats).forEach((endpoint) => {
        expect(typeof AppAPI.stats[endpoint].get).toEqual('function');
        expect(typeof AppAPI.stats[endpoint].post).toEqual('function');
        expect(typeof AppAPI.stats[endpoint].patch).toEqual('function');
        expect(typeof AppAPI.stats[endpoint].put).toEqual('function');
        expect(typeof AppAPI.stats[endpoint].delete).toEqual('function');
    });
});

it('Has preprocessing REST methods available', () => {
    Object.keys(AppAPI.preprocessing).forEach((endpoint) => {
        expect(typeof AppAPI.preprocessing[endpoint].get).toEqual('function');
        expect(typeof AppAPI.preprocessing[endpoint].post).toEqual('function');
        expect(typeof AppAPI.preprocessing[endpoint].patch).toEqual('function');
        expect(typeof AppAPI.preprocessing[endpoint].put).toEqual('function');
        expect(typeof AppAPI.preprocessing[endpoint].delete).toEqual('function');
    });
});

it('Has hardware REST methods available', () => {
    Object.keys(AppAPI.hardware).forEach((endpoint) => {
        expect(typeof AppAPI.hardware[endpoint].get).toEqual('function');
        expect(typeof AppAPI.hardware[endpoint].post).toEqual('function');
        expect(typeof AppAPI.hardware[endpoint].patch).toEqual('function');
        expect(typeof AppAPI.hardware[endpoint].put).toEqual('function');
        expect(typeof AppAPI.hardware[endpoint].delete).toEqual('function');
    });
});