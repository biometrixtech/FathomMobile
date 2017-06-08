

var Entities = require('html-entities').AllHtmlEntities;

var entities = new Entities();

function striptags(input) {
    return input.replace(/(<([^>]+)>)/ig, '');
}

var UTIL = {
    objIsEmpty: function objIsEmpty(obj) {
        if (typeof obj === 'object' && !(obj instanceof Array)) {
            if (Object.keys(obj).length === 0) {
                return true;
            }
        }
        return false;
    },

    objToArr: function objToArr(obj) {
        return Object.keys(obj).map(function (k) {
            return obj[k];
        });
    },

    limitChars: function limitChars(str) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;

        if (str.length > limit) {
            return str.substr(0, limit).trim() + ' ...';
        }
        return str;
    },

    htmlEntitiesDecode: function htmlEntitiesDecode(str) {
        return entities.decode(str);
    },

    convertHtmlEntitiesArray: function convertHtmlEntitiesArray(arr) {
        var finalArr = arr;

        if (arr instanceof Array) {
            arr.forEach(function (item, key) {
                if (item instanceof Array) {
                    finalArr[key] = UTIL.convertHtmlEntitiesArray(item);
                } else if (typeof item === 'object') {
                    finalArr[key] = UTIL.convertHtmlEntitiesObject(item);
                } else if (typeof item === 'string') {
                    finalArr[key] = entities.decode(striptags(item));
                }
            });
        }

        return finalArr;
    },

    convertHtmlEntitiesObject: function convertHtmlEntitiesObject(obj) {
        var finalObj = obj;

        if (typeof obj === 'object' && !(obj instanceof Array)) {
            Object.keys(obj).forEach(function (key) {
                var item = obj[key];

                if (item instanceof Array) {
                    finalObj[key] = UTIL.convertHtmlEntitiesArray(item);
                } else if (typeof item === 'object') {
                    finalObj[key] = UTIL.convertHtmlEntitiesObject(item);
                } else if (typeof item === 'string') {
                    finalObj[key] = entities.decode(striptags(item));
                }
            });
        }

        return finalObj;
    },

    stripTags: function stripTags(str) {
        return striptags(str);
    }
};

module.exports = UTIL;
module.exports.details = {
    title: 'UTIL'
};