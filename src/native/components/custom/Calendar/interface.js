/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 15:02:40 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-23 15:02:40 
 */

import XDate from 'xdate';

function padNumber(n) {
    if (n < 10) {
        return `0${n}`;
    }
    return n;
}

function xdateToData(xdate) {
    const dateString = xdate.toString('yyyy-MM-dd');
    return {
        year:       xdate.getFullYear(),
        month:      xdate.getMonth() + 1,
        day:        xdate.getDate(),
        timestamp:  XDate(dateString, true).getTime(),
        dateString: dateString
    };
}

function parseDate(d) {
    if (!d) {
        return null;
    } else if (d.timestamp) { // conventional data timestamp
        return XDate(d.timestamp, true);
    } else if (d instanceof XDate) { // xdate
        return XDate(d.toString('yyyy-MM-dd'), true);
    } else if (d.getTime) { // javascript date
        const dateString = d.getFullYear() + '-' + padNumber((d.getMonth() + 1)) + '-' + padNumber(d.getDate());
        return XDate(dateString, true);
    } else if (d.year) {
        const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
        return XDate(dateString, true);
    } else if (d) { // timestamp nuber or date formatted as string
        return XDate(d, true);
    }
    return null;
}

module.exports = {
    xdateToData,
    parseDate
};

