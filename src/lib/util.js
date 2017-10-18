/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:08:55 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-16 23:53:11
 */

/**
 * Global Util Functions
 */

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';

const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

const d3 = {
    scale,
    shape,
};

function striptags(input) {
    return input.replace(/(<([^>]+)>)/ig, '');
}

const UTIL = {
    /**
      * Test if Obj is empty
      */
    objIsEmpty: (obj) => {
        if (typeof obj === 'object' && !(obj instanceof Array)) {
            if (Object.keys(obj).length === 0) { return true; }
        }
        return false;
    },

    /**
      * Convert Obj to Arr
      */
    objToArr: obj => Object.keys(obj).map(k => obj[k]),

    /**
      * Limit characters, placing a ... at the end
      */
    limitChars: (str, limit = 15) => {
        if (str.length > limit) { return `${str.substr(0, limit).trim()} ...`; }
        return str;
    },

    /**
      * Decode HTML Entites
      */
    htmlEntitiesDecode: str => entities.decode(str),

    /**
      * Convert all HTMLEntities when Array
      */
    convertHtmlEntitiesArray: (arr) => {
        const finalArr = arr;

        if (arr instanceof Array) {
            arr.forEach((item, key) => {
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

    /**
      * Convert all HTMLEntities when Object
      */
    convertHtmlEntitiesObject: (obj) => {
        const finalObj = obj;

        if (typeof obj === 'object' && !(obj instanceof Array)) {
            Object.keys(obj).forEach((key) => {
                const item = obj[key];

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

    /**
      * Strips all HTML tags
      */
    stripTags: str => striptags(str),

    /**
      * Create an time x-scale.
      * @param {number} start Start date.
      * @param {number} end End date.
      * @param {number} width Width to create the scale with.
      * @return {Function} D3 scale instance.
      */
    createTimeScaleX: (start, end, width) => d3.scale.scaleTime()
        .domain([start, end])
        .range([0, width])
        .tickFormat(7, '%a %d'),

    /**
      * Create an x-scale.
      * @param {number} start Start value.
      * @param {number} end End value.
      * @param {number} width Width to create the scale with.
      * @return {Function} D3 scale instance.
      */
    createScaleX: (start, end, width) => d3.scale.scaleLinear()
        .domain([start, end]).nice()
        .range([0, width]),
  
    /**
      * Create a y-scale.
      * @param {number} minY Minimum y value to use in our domain.
      * @param {number} maxY Maximum y value to use in our domain.
      * @param {number} height Height for our scale's range.
      * @return {Function} D3 scale instance.
      */
    createScaleY: (minY, maxY, height) => d3.scale.scaleLinear()
        .domain([minY, maxY]).nice(10)
        // We invert our range so it outputs using the axis that React uses.
        .range([height, 0])
        .clamp(true),
  
    /**
      * Creates a line graph SVG path that we can then use to render in our
      * React Native application with ART.
      * @param {Array.<Object>} options.data Array of data we'll use to create
      *   our graphs from.
      * @param {function} xAccessor Function to access the x value from our data.
      * @param {function} yAccessor Function to access the y value from our data.
      * @param {number} width Width our graph will render to.
      * @param {number} height Height our graph will render to.
      * @return {Object} Object with data needed to render.
      */
    createLineGraph({
        data,
        xAccessor,
        yAccessor,
        width,
        height,
    }) {
        const lastDatum = data[data.length - 1];
  
        const scaleX = this.createTimeScaleX(
            data[0].time,
            lastDatum.time,
            width
        );
  
        // Collect all y values.
        const allYValues = data.reduce((all, datum) => {
            all.push(yAccessor(datum));
            return all;
        }, []);
        // Get the min and max y value.
        const extentY = d3Array.extent(allYValues);
        const scaleY = this.createScaleY(extentY[0], extentY[1], height);
    
        const lineShape = d3.shape.line()
            .x(d => scaleX(xAccessor(d)))
            .y(d => scaleY(yAccessor(d)));
  
        return {
            data,
            scale: {
                x: scaleX,
                y: scaleY,
            },
            path:  lineShape(data),
            ticks: data.map((datum) => {
                const time = xAccessor(datum);
                const value = yAccessor(datum);
        
                return {
                    x: scaleX(time),
                    y: scaleY(value),
                    datum,
                };
            }),
        };
    }
};

/* Export ==================================================================== */
module.exports = UTIL;
module.exports.details = {
    title: 'UTIL',
};
