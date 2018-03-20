/*
 * @Author: Vir Desai 
 * @Date: 2017-10-16 14:59:35 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-19 00:24:50
 */

/**
 * CircularProgress
 *
     <CircularProgress percentage={60} width={100} height={100} />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View,TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { Thresholds } from '@constants/';

// Components
import { Spacer, Text } from '@ui/';


/* Component ==================================================================== */
class CircularProgress extends Component {
    static propTypes = {
        graphIndex:         PropTypes.number,
        selectGraph:        PropTypes.func.isRequired,
        isGraphSelected:    PropTypes.bool,
        width:              PropTypes.number,
        height:             PropTypes.number,
        percentageOverall:  PropTypes.number,
        percentageToDate:   PropTypes.number,
        getTeamStats:       PropTypes.func.isRequired,
        startRequest:       PropTypes.func.isRequired,
        stopRequest:        PropTypes.func.isRequired,
        resetVisibleStates: PropTypes.func.isRequired,
        textViewStyle:      PropTypes.object,
    }

    static defaultProps = {
        width:              AppSizes.screen.widthThird,
        height:             AppSizes.screen.widthThird,
        isGraphSelected:    false,
        percentageOverall:  0,
        percentageToDate:   0,
        blankColor:         AppColors.chart.light,
        previousWeekColor:  AppColors.chart.grey,
        progressColor:      AppColors.chart.blue,
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
        let { width, height, percentageOverall, percentageToDate, textViewStyle, blankColor, progressColor, fillColor, previousWeekColor, graphIndex, selectGraph, isGraphSelected } = this.props;

        let circleHeight = height / 2;
        let circleWidth = width / 2;
        return (
            <View>
                <Spacer />
                <View style={[AppStyles.row, { height }]} onLayout={ev => this.setState({ graphHeight: ev.nativeEvent.layout.height })}>
                    <View style={[AppStyles.flex1]}/>
                    <View style={[AppStyles.flex2, AppStyles.containerCentered]}>
                        <Text h4 style={{ color: AppColors.greyText }}>WEEKLY</Text>
                        <Text h4 style={{ color: AppColors.greyText }}>LOAD</Text>
                        <Text h6 style={{ color: AppColors.greyText, fontWeight: 'bold' }}>COMPARED TO</Text>
                        <Text h6 style={{ color: AppColors.greyText, fontWeight: 'bold' }}>PREVIOUS WEEK</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => selectGraph(graphIndex, 0)}>
                        <View style={[AppStyles.flex2, AppStyles.containerCentered, { backgroundColor: isGraphSelected ? AppColors.chart.light : null }]}>
                            <Svg width={this.state.graphHeight || width} height={this.state.graphHeight || height}>
                                <Circle cx={circleWidth} cy={circleHeight} r={circleHeight} fill={blankColor}/>
                                <Path 
                                    d={`M${circleWidth} ${circleHeight} L${circleHeight} 0 ${this.generateArc(percentageToDate, circleHeight)} Z`}
                                    strokeLinecap={'round'}
                                    strokeLinejoin={'round'}
                                    fill={previousWeekColor}
                                />
                                <Path 
                                    d={`M${circleWidth} ${circleHeight} L${circleHeight} 0 ${this.generateArc(percentageOverall, circleHeight)} Z`}
                                    strokeLinecap={'round'}
                                    strokeLinejoin={'round'}
                                    fill={progressColor}
                                />
                                <Circle cx={circleWidth} cy={circleHeight} r={(circleHeight)*0.75} fill={isGraphSelected ? AppColors.chart.light : fillColor}/>
                            </Svg>
                            <View style={textViewStyle}>
                                <Text h2 style={{ color: AppColors.greyText }}>{percentageOverall}%</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[AppStyles.flex1]}/>
                </View>
            </View>
        );
    };
}

/* Export Component ==================================================================== */
export default CircularProgress;
