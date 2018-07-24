/*
 * @Author: Vir Desai 
 * @Date: 2017-10-16 14:59:35 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-10 18:23:02
 */

/**
 * CircularProgress
 *
     <CircularProgress percentage={60} width={100} height={100} />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';

// Components
import { Spacer, Text } from '@ui/';


/* Component ==================================================================== */
class CircularProgress extends Component {
    static propTypes = {
        width:              PropTypes.number,
        height:             PropTypes.number,
        percentageOverall:  PropTypes.number,
        percentageToDate:   PropTypes.number,
        startRequest:       PropTypes.func.isRequired,
        stopRequest:        PropTypes.func.isRequired,
        resetVisibleStates: PropTypes.func.isRequired,
        textViewStyle:      PropTypes.object,
    }

    static defaultProps = {
        width:              AppSizes.screen.widthTwoThirds,
        height:             AppSizes.screen.widthTwoThirds,
        percentageOverall:  0,
        percentageToDate:   0,
        blankColor:         AppColors.secondary.light_blue.fiftyPercent,
        previousWeekColor:  AppColors.primary.grey.thirtyPercent,
        progressColor:      AppColors.secondary.blue.hundredPercent,
        fillColor:          'white',
        resetVisibleStates: () => {},
        textViewStyle:      {
            position:       'absolute',
            top:            0,
            bottom:         0,
            justifyContent: 'center',
            alignItems:     'center',
        },
    }

    constructor(props) {
        super(props);
        this.state = {
            graphHeight: 0,
        };
    }

    generateArc = (percentage, height) => {
        if (percentage >= 100) {
            percentage = 99.999;
        }
        const a = percentage * 2 * Math.PI / 100; // angle (in radian) depends on percentage
        const r = height; // radius of the circle
        let rx = r;
        let ry = r;
        let xAxisRotation = 0;
        let largeArcFlag = 1;
        let sweepFlag = 1;
        let x = r + r * Math.sin(a);
        let y = r - r * Math.cos(a);
        if (percentage <= 50) {
            largeArcFlag = 0;
        } else {
            largeArcFlag = 1;
        }

        return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`;
    };

    render = () => {
        let { width, height, percentageOverall, percentageToDate, textViewStyle, blankColor, progressColor, fillColor, previousWeekColor } = this.props;

        let circleHeight = height / 2;
        let circleWidth = width / 2;
        return (
            <View>
                <Spacer size={20} />
                <View style={[AppStyles.row, { height }]} onLayout={ev => this.setState({ graphHeight: ev.nativeEvent.layout.height })}>
                    <View style={[AppStyles.flex1]}/>
                    <View style={[AppStyles.flex2, AppStyles.containerCentered]}>
                        <Svg width={this.state.graphHeight || width} height={this.state.graphHeight || height}>
                            <Circle cx={circleWidth} cy={circleHeight} r={circleHeight} fill={blankColor}/>
                            <Path 
                                d={`M${circleWidth} ${circleHeight} L${circleHeight} 0 ${this.generateArc(percentageToDate !== 0 && percentageToDate < percentageOverall ? percentageOverall : percentageToDate, circleHeight)} Z`}
                                strokeLinecap={'round'}
                                strokeLinejoin={'round'}
                                fill={percentageToDate < percentageOverall ? progressColor.fiftyPercent : previousWeekColor}
                            />
                            <Path 
                                d={`M${circleWidth} ${circleHeight} L${circleHeight} 0 ${this.generateArc(percentageToDate !== 0 && percentageToDate < percentageOverall ? percentageToDate : percentageOverall, circleHeight)} Z`}
                                strokeLinecap={'round'}
                                strokeLinejoin={'round'}
                                fill={progressColor.hundredPercent}
                            />
                            <Circle cx={circleWidth} cy={circleHeight} r={(circleHeight)*0.8} fill={fillColor}/>
                        </Svg>
                        {
                            percentageOverall === 0 && percentageToDate === 0 ?
                                <View style={textViewStyle}>
                                    <Text h5 style={{ fontWeight: '400'}}>Capture one complete</Text>
                                    <Text h5 style={{ fontWeight: '400'}}>week of training</Text>
                                    <Text h5 style={{ fontWeight: '400'}}>to receive target</Text>
                                    <Text h5 style={{ fontWeight: '400'}}>load recommendations</Text>
                                </View> :
                                <View style={textViewStyle}>
                                    <View style={[AppStyles.row]}>
                                        <Text h0>{percentageOverall}</Text>
                                        <Text h2 style={{ alignSelf: 'flex-end', fontWeight: '400', paddingBottom: 10 }}>%</Text>
                                    </View>
                                    <Text h5 style={{ fontWeight: '500'}}>WEEKLY</Text>
                                    <Text h5 style={{ fontWeight: '500'}}>LOAD</Text>
                                </View>
                        }
                    </View>
                    <View style={[AppStyles.flex1]}/>
                </View>
            </View>
        );
    };
}

/* Export Component ==================================================================== */
export default CircularProgress;
