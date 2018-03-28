/*
 * @Author: Vir Desai 
 * @Date: 2017-10-16 14:59:35 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-28 10:55:11
 */

/**
 * DailyLoadChart
 *
     <DailyLoadChart data={..}/>
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Icon } from 'react-native-elements';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { Thresholds } from '@constants/';

// Components
import { Card, Spacer, Text } from '@ui/';

const MONTH_MAP = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
};

const DAYS_OF_WEEK = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];


/* Component ==================================================================== */
class DailyLoadChart extends Component {
    static propTypes = {
        graphIndex:         PropTypes.number,
        selectGraph:        PropTypes.func.isRequired,
        isGraphSelected:    PropTypes.bool,
        selectedGraphIndex: PropTypes.number,
        user:               PropTypes.object,
        data:               PropTypes.object,
        getTeamStats:       PropTypes.func.isRequired,
        startRequest:       PropTypes.func.isRequired,
        stopRequest:        PropTypes.func.isRequired,
        resetVisibleStates: PropTypes.func.isRequired,
    }

    static defaultProps = {
        width:              AppSizes.screen.width/5,
        height:             AppSizes.screen.width/5,
        isGraphSelected:    false,
        selectedGraphIndex: null,
        data:               { M: {}, Tu: {}, W: {}, Th: {}, F: {}, Sa: {}, Su: {} },
        resetVisibleStates: () => {},
    }

    constructor(props) {
        super(props);
        this.state = {
            daySelected: null,
        };
    }

    componentDidMount = () => {
        setTimeout(() => {
            if (!!this.refs && !!this.refs.scrollView && !!this.refs.scrollView.scrollTo) {
                let sevenTenthsWidth = AppSizes.screen.width * 7 / 10;
                let dailyGraphWidth = this.props.width + this.props.height * 2 / 15;
                let dayOfWeekOffset = ((new Date()).getDay() + 6) % 7;
                let offset = sevenTenthsWidth - (7.5 + dailyGraphWidth * (dayOfWeekOffset + 1));
                let absoluteOffset = Math.abs(offset > 0 ? 0 : offset);
                this.refs.scrollView.scrollTo({ x: absoluteOffset, animated: true });
            }
        }, 100);
    };

    componentWillUnmount = () => {
        this.refs.scrollView = null;
    };

    getMaxValue = (data) => {
        let values = Object.values(data);
        let max = values.reduce((current, next) => {
            let dayValues = Object.values(next).filter(val => typeof(val) === 'number');
            let dayMax = dayValues.length ? Math.max(...dayValues) : 0;
            return dayMax > current ? dayMax : current;
        }, 0);
        return max;
    };

    returnGraph = (day, width, height, maxRadius, maxValue) => {
        if (day.previousWeek && day.focusedWeek) {
            if (day.previousWeek > day.focusedWeek) {
                return (
                    <Svg width={width} height={height}>
                        <Circle cx={width/2} cy={height/2} r={maxRadius * (day.previousWeek/maxValue)} fill={AppColors.primary.grey.thirtyPercent}/>
                        <Circle cx={width/2} cy={height/2} r={maxRadius * (day.focusedWeek/maxValue)} fill={day.color.hundredPercent}/>
                    </Svg>
                );
            }
            return (
                <Svg width={width} height={height}>
                    <Circle cx={width/2} cy={height/2} r={maxRadius * (day.focusedWeek/maxValue)} fill={day.color.fiftyPercent}/>
                    <Circle cx={width/2} cy={height/2} r={maxRadius * (day.previousWeek/maxValue)} fill={day.color.hundredPercent}/>
                </Svg>
            );
        } else if (day.previousWeek) {
            return (
                <Svg width={width} height={height}>
                    <Circle cx={width/2} cy={height/2} r={maxRadius * (day.previousWeek/maxValue)} fill={AppColors.primary.grey.thirtyPercent}/>
                </Svg>
            );
        } else if (day.focusedWeek) {
            return (
                <Svg width={width} height={height}>
                    <Circle cx={width/2} cy={height/2} r={maxRadius * (day.focusedWeek/maxValue)} fill={day.color.hundredPercent}/>
                </Svg>
            );
        }
        return <Svg width={width} height={height}/>;
    }

    render = () => {
        let { width, height, user, resetVisibleStates, getTeamStats, startRequest, stopRequest, data, graphIndex, selectGraph, isGraphSelected, selectedGraphIndex } = this.props;
        let maxRadius = height/2;
        let maxValue = this.getMaxValue(data);

        let previousWeekStartDateComponents = user.previousWeekStatsStartDate ? user.previousWeekStatsStartDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let previousWeekEndDateComponents = user.previousWeekStatsEndDate ? user.previousWeekStatsEndDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let previousWeekRange = `${MONTH_MAP[previousWeekStartDateComponents[1]]} ${previousWeekStartDateComponents[2]}-${previousWeekStartDateComponents[1] === previousWeekEndDateComponents[1] ? previousWeekEndDateComponents[2] : MONTH_MAP[previousWeekEndDateComponents[1]] + ' ' + previousWeekEndDateComponents[2]}`;
        let nextWeekStartDateComponents = user.nextWeekStatsStartDate ? user.nextWeekStatsStartDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let nextWeekEndDateComponents = user.nextWeekStatsEndDate ? user.nextWeekStatsEndDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let nextWeekRange = `${MONTH_MAP[nextWeekStartDateComponents[1]]} ${nextWeekStartDateComponents[2]}-${nextWeekStartDateComponents[1] === nextWeekEndDateComponents[1] ? nextWeekEndDateComponents[2] : MONTH_MAP[nextWeekEndDateComponents[1]] + ' ' + nextWeekEndDateComponents[2]}`;
        return (
            <View style={[AppStyles.row, { height: height * 1.5 }]}>
                <ScrollView
                    ref={'scrollView'}
                    horizontal={true}
                >
                    <TouchableWithoutFeedback
                        onPress={() => user ? startRequest().then(() => getTeamStats(user, -1)).then(() => resetVisibleStates()).then(() => stopRequest()) : null}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Icon
                                style={[AppStyles.containerCentered, { padding: 10, paddingRight: 5 }]}
                                name={'arrow-back'}
                            />
                            <View style={[AppStyles.containerCentered, { padding: 10, paddingLeft: 5 }]}>
                                <Text h6 style={{ color: AppColors.primary.grey.hundredPercent, fontWeight: 'bold' }}>PREVIOUS</Text>
                                <Text h6 style={{ color: AppColors.primary.grey.hundredPercent, fontWeight: 'bold' }}>WEEK</Text>
                                <Text h6 style={{ color: AppColors.primary.grey.hundredPercent, fontWeight: 'bold' }}>{previousWeekRange}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {
                        DAYS_OF_WEEK.map((day, index) =>
                            <TouchableWithoutFeedback onPress={() => selectGraph(graphIndex, index)} key={day}>
                                <View style={{ padding: height/15, alignItems: 'center', backgroundColor: isGraphSelected && index === selectedGraphIndex ? AppColors.secondary.light_blue.hundredPercent : null }}>
                                    <Text h6 style={{ color: AppColors.primary.grey.hundredPercent, marginBottom: height/15 }}>{day}</Text>
                                    { this.returnGraph(data[day], width, height, maxRadius, maxValue) }
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }
                    <TouchableWithoutFeedback
                        onPress={() => user ? startRequest().then(() => getTeamStats(user, 1)).then(() => resetVisibleStates()).then(() => stopRequest()) : null}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[AppStyles.containerCentered, { padding: 10, paddingRight: 5 }]}>
                                <Text h6 style={{ color: AppColors.primary.grey.hundredPercent, fontWeight: 'bold' }}>NEXT</Text>
                                <Text h6 style={{ color: AppColors.primary.grey.hundredPercent, fontWeight: 'bold' }}>WEEK</Text>
                                <Text h6 style={{ color: AppColors.primary.grey.hundredPercent, fontWeight: 'bold' }}>{nextWeekRange}</Text>
                            </View>
                            <Icon
                                style={[AppStyles.containerCentered, { padding: 10, paddingLeft: 5 }]}
                                name={'arrow-forward'}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        );
    };
}

/* Export Component ==================================================================== */
export default DailyLoadChart;
