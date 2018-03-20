/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:08:46 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-14 13:39:35
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { G, Line, Path, Text } from 'react-native-svg';

// Consts and Libs
import { AppFonts, AppSizes } from '@theme/';

export default class Axis extends Component {
    static propTypes = {
        length:   PropTypes.number.isRequired,
        ticks:    PropTypes.number.isRequired,
        x:        PropTypes.number,
        y:        PropTypes.number,
        startVal: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        endVal:   PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        vertical: PropTypes.bool,
        scale:    PropTypes.func // if scale is specified use that scale
    };

    constructor(props) {
        super(props);
        this.state = {
            daysOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        };
    }

    render () {
        let { length, ticks, x, y, startVal, vertical, scale } = this.props;
        const TICKSIZE = AppSizes.tickSize;
        x = x || 0;
        y = y || 0;
        let endX = vertical ? x : x + length + AppSizes.padding;
        let endY = vertical ? y - length : y;
        let tickPoints = vertical ? this.getTickPoints(vertical, y, endY, ticks) : this.getTickPoints(vertical, x, endX, ticks);
        return (
            <G fill='none'>
                <Line
                    stroke='#000'
                    strokeWidth={1}
                    x1={x}
                    x2={endX}
                    y1={y}
                    y2={endY} />
                {
                    tickPoints.map(pos =>
                        <Line
                            key={pos}
                            stroke='#000'
                            strokeWidth={1}
                            x1={vertical ? x : pos + AppSizes.paddingSml}
                            y1={vertical ? pos : y}
                            x2={vertical ? x - TICKSIZE : pos + AppSizes.paddingSml}
                            y2={vertical ? pos : y + TICKSIZE} />
                    )
                }
                {
                    tickPoints.map((pos, index) => <Text
                        key={pos}
                        fill='#000'
                        stroke='#000'
                        strokeWidth={0.2}
                        fontSize={AppFonts.scaleFont(8)}
                        textAnchor='middle'
                        x={vertical ? x - 3 * TICKSIZE : pos + AppSizes.paddingSml}
                        y={vertical ? pos + 3 : y + 3 * TICKSIZE}>
                        {typeof startVal === 'number' ? Math.round(scale.invert(pos)) : this.state.daysOfWeek[index]}
                    </Text>
                    )
                }
            </G>
        );
    }

    getTickPoints (vertical, start, end, numTicks) {
        let res = [];
        if (vertical) {
            let ticksEvery = this.props.length / (numTicks - 1);
            for (let cur = start; cur >= (end - AppSizes.paddingSml); cur -= ticksEvery) { res.push(cur); }
        } else {
            let ticksEvery = Math.floor(this.props.length / (numTicks - 1));
            for (let cur = start; cur <= end; cur += ticksEvery) { res.push(cur); }
        }
        return res;
    }
}