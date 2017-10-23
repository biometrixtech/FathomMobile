/*
 * @Author: Vir Desai 
 * @Date: 2017-10-13 15:17:33 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-23 11:23:32
 */

/**
 * StackedBarChart
 *
     <StackedBarChart data={x: [], y1: [], y2: []} xAxis={'Time'} yAxis={'Cookies eaten'} width={100} height={100} />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { AppUtil } from '@lib/';

// Components
import { Axis, Spacer, Text } from '@ui/';
import { Placeholder } from '@general/';

const threshold = [
    { max: Number.POSITIVE_INFINITY, min: 1.5, color: AppColors.brand.red },
    { max: 1.2, min: 1.49, color: AppColors.brand.yellow },
    { max: 0.79, min: Number.NEGATIVE_INFINITY, color: AppColors.brand.yellow },
    { max: 1.19, min: 0.8, color: AppColors.greyText },
]


/* Component ==================================================================== */
class StackedBarChart extends Component {
    static propTypes = {
        xAxis:     PropTypes.string,
        yAxis:     PropTypes.string,
        width:     PropTypes.number,
        height:    PropTypes.number,
        tabOffset: PropTypes.number,
        max:       PropTypes.number,
        margin:    PropTypes.shape({
            horizontal: PropTypes.number,
            vertical:   PropTypes.number
        }),
        data: PropTypes.shape({
            x:  PropTypes.array,
            y1: PropTypes.array, // total
            y2: PropTypes.array, // irregular
        }),
        user:             PropTypes.object,
        setStatsCategory: PropTypes.func.isRequired,
        getTeamStats:     PropTypes.func.isRequired
    }

    static defaultProps = {
        xAxis:     null,
        yAxis:     null,
        width:     0,
        height:    0,
        max:       0,
        tabOffset: 0,
        margin:    {},
        data:      null,
    }

    constructor(props) {
        super(props);
        this.state = {
            chartHeaderHeight: 0,
            listHeaderHeight:  0,
        };
    }

    getColor = (value1, value2) => {
        if (!value1 && typeof value1 !== 'number') {
            return AppColors.greyText;
        }
        let colorIndex = threshold.findIndex(colorThreshold => colorThreshold.max >= value1 && colorThreshold.min <= value1);
        if (typeof value2 === 'number') {
            let colorIndex2 = threshold.findIndex(colorThreshold => colorThreshold.max >= value2 && colorThreshold.min <= value2);
            colorIndex = colorIndex > colorIndex2 ? colorIndex2 : colorIndex;
        }
        return threshold[colorIndex].color;
    } 

    getTickPoints (start, end, numTicks, length) {
        let res = [];
        let ticksEvery = Math.floor(length / (numTicks - 1));
        for (let cur = start; cur <= end; cur += ticksEvery) { res.push(cur); }
        return res;
    }

    renderBar = (width, height, y1, y2, index) => {
        let array = this.getTickPoints(3 * this.props.margin.horizontal, width + 6 * this.props.margin.horizontal, 7, width);
        return <G key={index}>
            <Rect
                x={array[index] + AppSizes.tickSize+1.5}
                y={height - (y1 + 0.5)}
                width={8}
                height={y1}
                fill={AppColors.brand.fogGrey}
            />
            <Rect
                x={array[index] + AppSizes.tickSize+1.5}
                y={height - (y2 + 0.5)}
                width={8}
                height={y2}
                fill={AppColors.brand.yellow}
            />
        </G>
    }

    render = () => {
        let {xAxis, yAxis, width, height, margin, data, tabOffset, user, max} = this.props;

        let startDateComponents = user.statsStartDate ? user.statsStartDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let endDateComponents = user.statsEndDate ? user.statsEndDate.split('-') : (new Date()).toLocaleDateString().split('/');
        let xScale = data ? data.x[0] instanceof Date ? AppUtil.createTimeScaleX(data.x[0], data.x[data.x.length - 1], width - 2 * margin.horizontal) : AppUtil.createScaleX(data.x[0], data.x[data.x.length - 1], width - 2 * margin.horizontal) : null;
        let yScale = AppUtil.createScaleY(0, max, height - 2 * margin.vertical, margin.vertical);

        return (
            <View>
                <View style={{ flexDirection: 'row' }} onLayout={ev => this.setState({ chartHeaderHeight: ev.nativeEvent.layout.height })}>
                    <TouchableWithoutFeedback onPress={() => user.teams[user.teamIndex] ? this.props.getTeamStats(user.teams[user.teamIndex].id, user.weekOffset-1) : null}>
                        <View style={[AppStyles.containerCentered, { flex: 1 }]}><Spacer /><Text h3>{'<'}</Text><Spacer /></View>
                    </TouchableWithoutFeedback>
                    <View style={[AppStyles.containerCentered, { flex: 2 }]}>
                        <Text>{`${startDateComponents[1]}/${startDateComponents[2]}/${startDateComponents[0].substring(2)}`}-{`${endDateComponents[1]}/${endDateComponents[2]}/${endDateComponents[0].substring(2)}`}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => user.teams[user.teamIndex] ? this.props.getTeamStats(user.teams[user.teamIndex].id, user.weekOffset+1) : null}>
                        <View style={[AppStyles.containerCentered, { flex: 1 }]}><Spacer /><Text h3>{'>'}</Text><Spacer /></View>
                    </TouchableWithoutFeedback>
                </View>
                {
                    !user.teams[user.teamIndex] || !user.teams[user.teamIndex].stats ? <View style={{ alignSelf: 'center' }}><Placeholder text={'No data to show for this range...'} /></View> :
                        <View>
                            { xAxis ? <Text style={[AppStyles.h7, { position: 'absolute', left: -4 * margin.horizontal - tabOffset * AppSizes.tickSize, top: height*9/20, transform: [{ rotate: '270deg' }] }]}>{xAxis}</Text> : null }
                            { yAxis ? <Text style={[AppStyles.subtext, { position: 'absolute', left: width/2, top: height + margin.vertical }]}>{yAxis}</Text> : null }
                            <Svg width={width + 3 * margin.horizontal} height={height}>
                                <Axis
                                    length={width - margin.horizontal}
                                    x={3 * margin.horizontal}
                                    y={height - 2 * margin.vertical}
                                    ticks={7}
                                    startVal={data.x[0]}
                                    endVal={data.x[data.x.length - 1]}
                                    scale={xScale} />
                                <Axis
                                    length={height - 3 * margin.vertical}
                                    x={3 * margin.horizontal}
                                    y={height - 2 * margin.vertical}
                                    ticks={11}
                                    startVal={0}
                                    endVal={max}
                                    scale={yScale}
                                    vertical />
                                {
                                    data.x.map((xValues, index) => this.renderBar(width - margin.horizontal, height - 2 * margin.vertical, yScale(max-data.y1[index])-yScale(max), yScale(max-data.y2[index])-yScale(max), index))
                                }
                            </Svg>
                            <Spacer size={20}/>
                            <View style={{ flexDirection: 'row' }} onLayout={ev => this.setState({ listHeaderHeight: ev.nativeEvent.layout.height })}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={AppStyles.subtext}>7day</Text>
                                        <Text style={AppStyles.subtext}>ACWR</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={AppStyles.subtext}>CHRONIC</Text>
                                        <Text style={AppStyles.subtext}>DAILY AVG</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}/>
                            </View>
                            <ScrollView style={{ backgroundColor: AppColors.brand.light, height: AppSizes.screen.usableHeight - (this.props.height + this.state.chartHeaderHeight + this.state.listHeaderHeight + 10) }} scrollEnabled={true} contentContainerStyle={{ height: (user.teams[user.teamIndex].stats && user.teams[user.teamIndex].stats.AthleteMovementQualityData ? user.teams[user.teamIndex].stats.AthleteMovementQualityData.length + 1 : 0) * 55 }}>
                                <TouchableHighlight key={-1} onPress={() => this.props.setStatsCategory(false, null)}>
                                    <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: user.selectedStats.athlete ? 'white' : AppColors.lightGrey }}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                                            <Text style={[AppStyles.subtext, { color: this.getColor(user.teams[user.teamIndex].stats && user.teams[user.teamIndex].stats.acwrGRF7) }]}>{user.teams[user.teamIndex].stats ? user.teams[user.teamIndex].stats.acwrGRF7 : ''}</Text>
                                            <Text style={[AppStyles.subtext, { color: AppColors.greyText }]}>{user.teams[user.teamIndex].stats ? user.teams[user.teamIndex].stats.chronicGRF : ''}</Text>
                                        </View>
                                        <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                                            <Text style={{ color: this.getColor(user.teams[user.teamIndex].stats && user.teams[user.teamIndex].stats.acwrGRF7) }}>Team Avg</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                {
                                    user.teams[user.teamIndex].stats && user.teams[user.teamIndex].stats.AthleteMovementQualityData && user.teams[user.teamIndex].stats.AthleteMovementQualityData.length
                                        ? user.teams[user.teamIndex].stats.AthleteMovementQualityData.map((athleteMovementQualityData, index) => {
                                            let athlete = user.teams[user.teamIndex].users_with_training_groups.find(userInGroup => userInGroup.id === athleteMovementQualityData.userId);
                                            return athlete
                                                ? <TouchableHighlight key={index} onPress={() => this.props.setStatsCategory(true, athlete.id)}>
                                                    <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2, backgroundColor: user.selectedStats.athlete && user.selectedStats.athleteId === athlete.id ? AppColors.lightGrey : 'white' }}>
                                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml }}>
                                                            <Text style={[AppStyles.subtext, { color: this.getColor(athleteMovementQualityData.acwrGRF7) }]}>{athleteMovementQualityData.acwrGRF7}</Text>
                                                            <Text style={[AppStyles.subtext, { color: AppColors.greyText }]}>{athleteMovementQualityData.chronicGRF}</Text>
                                                        </View>
                                                        <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                                                            <Text style={{ color: this.getColor(athleteMovementQualityData.acwrGRF7) }}>{athlete.first_name} {athlete.last_name}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                : null;
                                        })
                                        : null
                                }
                            </ScrollView>
                        </View>
                }
            </View>
        );
    };
}

/* Export Component ==================================================================== */
export default StackedBarChart;