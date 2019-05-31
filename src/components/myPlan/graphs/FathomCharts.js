/**
 * FathomCharts
 *
     <FathomCharts
        barData={data}
        containerWidth={AppSizes.screen.width}
        currentAlert={currentAlert}
        startSliceValue={7}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View, } from 'react-native';

// import third-party libraries
import * as V from 'victory-native';
import _ from 'lodash';
import Dash from 'react-native-dash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { PlanLogic, } from '../../../lib';

// Components
import { TabIcon, Text, } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    keyCircle: {
        borderRadius: (10 / 2),
        height:       10,
        marginRight:  AppSizes.paddingSml,
        width:        10,
    },
    label: {
        color:        AppColors.zeplin.slate,
        fontSize:     AppFonts.scaleFont(11),
        marginBottom: AppSizes.paddingXSml,
    },
    xyAxisWrapper: {
        alignItems:     'center',
        bottom:         0,
        justifyContent: 'center',
        position:       'absolute',
        top:            0,
        width:          AppFonts.scaleFont(30),
    },
    yAxis: {
        color:     AppColors.zeplin.slate,
        fontSize:  AppFonts.scaleFont(10),
        textAlign: 'center',
        width:     300,
    },
});

/* Component ==================================================================== */
class XAxisLabels extends PureComponent {
    render = () => {
        const { data, index, type, x, y, } = this.props;
        const currentData = data[index];
        let dataArrayLengthTrim = type === 4 ? 4 : 1;
        let highlightedIndex = index === (data.length - dataArrayLengthTrim);
        if(!currentData) {
            return (null);
        }
        return (
            <View style={{left: (x - this.props.style.padding), position: 'absolute', top: y,}}>
                { highlightedIndex ?
                    <Text robotoBold style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(11), marginBottom: AppSizes.paddingXSml, textAlign: 'center',}}>
                        {data.length === 14 ? currentData.x.charAt(0) : currentData.x}
                    </Text>
                    :
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(11), marginBottom: AppSizes.paddingXSml, textAlign: 'center',}}>
                        {data.length === 14 ? currentData.x.charAt(0) : currentData.x}
                    </Text>
                }
                { currentData.hasMultipleSports ?
                    <TabIcon
                        color={highlightedIndex ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight}
                        icon={'checkbox-multiple-marked-circle'}
                        size={15}
                        type={'material-community'}
                    />
                    : currentData.filteredSport ?
                        <Image
                            source={currentData.filteredSport.imagePath}
                            style={{height: 15, tintColor: highlightedIndex ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight, width: 15,}}
                        />
                        :
                        <View />
                }

            </View>
        );
    }
}

class FathomCharts extends PureComponent {
    static propTypes = {
        barData:         PropTypes.array.isRequired,
        currentAlert:    PropTypes.object,
        startSliceValue: PropTypes.number.isRequired,
    };

    static defaultProps = {
        currentAlert: false,
    };

    render = () => {
        const { barData, containerWidth, currentAlert, } = this.props;
        if(!currentAlert || !currentAlert.visualization_type || !currentAlert.visualization_data) {
            return (null);
        }
        let {
            barWidth,
            hasLeftAxis,
            hasRightAxis,
            lineChartData,
            lineChartColor,
            updatedBarData,
        } = PlanLogic.handleFathomChartsRenderLogic(currentAlert.data, barData, currentAlert.visualization_type, currentAlert.visualization_data.plot_legends, this.props.startSliceValue, currentAlert.visualization_data, containerWidth);
        if(currentAlert.visualization_type === 4) {
            console.log('lineChartData',lineChartData);
            console.log('updatedBarData',updatedBarData);
            console.log('currentAlert',currentAlert,currentAlert.visualization_type);
        }
        return (
            <View pointerEvents={'none'}>

                { hasLeftAxis &&
                    <View style={[styles.xyAxisWrapper, {left: 0,}]}>
                        <Text robotoRegular style={[styles.yAxis, {transform: [{ rotate: '-90deg'}],}]}>
                            {_.toLower(currentAlert.visualization_data.y_axis_1)}
                        </Text>
                    </View>
                }


                <V.VictoryChart
                    animate={{ duration: 300, }}
                    domainPadding={{ x: AppSizes.padding, }}
                >

                    {/* Y-Axis */}
                    <V.VictoryAxis
                        dependentAxis
                        tickFormat={t => ' '}
                        standalone={true}
                        style={{
                            axis: {
                                stroke:        AppColors.transparent,
                                strokeOpacity: 0.5,
                                size:          1,
                            },
                            grid: {
                                stroke:        AppColors.zeplin.superLight,
                                strokeOpacity: 0.5,
                                size:          1,
                            },
                            tickLabels: {
                                fontSize: 0,
                            },
                        }}
                        x={updatedBarData.length === 14 ? 'key' : 'x'}
                    />

                    {/* X-Axis */}
                    <V.VictoryAxis
                        style={{
                            axis: {
                                stroke:        AppColors.zeplin.superLight,
                                strokeOpacity: 0.5,
                                size:          1,
                            },
                        }}
                        tickLabelComponent={<XAxisLabels data={updatedBarData} type={currentAlert.visualization_type} />}
                        tickValues={_.map(updatedBarData, o => updatedBarData.length === 14 ? o.key : o.x)}
                        x={updatedBarData.length === 14 ? 'key' : 'x'}
                    />

                    {/* visualization_type 1 - always show the bar graph. will autofill for visualization_type 2. */}
                    <V.VictoryBar
                        animate={false}
                        cornerRadius={{ bottom: (barWidth / 2), top: (barWidth / 2), }}
                        data={updatedBarData}
                        style={{ data: { fill: d => currentAlert.visualization_type !== 2 ? AppColors.zeplin.slateXLight : d.fillColor, width: barWidth, }, }}
                        x={updatedBarData.length === 14 ? 'key' : 'x'}
                    />

                    { currentAlert.visualization_type === 3 &&
                        <V.VictoryGroup>
                            <V.VictoryLine
                                data={lineChartData}
                                interpolation={'monotoneX'}
                                style={{ data: { stroke: lineChartColor, strokeLinecap: 'round', strokeWidth: 5, }, }}
                                x={updatedBarData.length === 14 ? 'key' : 'x'}
                            />
                            <V.VictoryScatter
                                data={lineChartData}
                                size={5}
                                style={{ data: { fill: lineChartColor, }, }}
                                x={updatedBarData.length === 14 ? 'key' : 'x'}
                            />
                        </V.VictoryGroup>
                    }

                    { currentAlert.visualization_type === 4 &&
                        <V.VictoryGroup>
                            <V.VictoryLine
                                data={_.map(lineChartData, (data, key) => {
                                    if(key >= 0 && key <= 2) {
                                        let newData = _.cloneDeep(data);
                                        newData.value = null;
                                        newData.y = null;
                                        return newData;
                                    }
                                    return data;
                                })}
                                interpolation={'monotoneX'}
                                style={{ data: { stroke: lineChartColor, strokeDasharray: 4, strokeWidth: 4, }, }}
                                x={updatedBarData.length === 14 ? 'key' : 'x'}
                            />
                            <V.VictoryLine
                                data={_.map(lineChartData, (data, key) => {
                                    if(key >= 4 && key <= 6) {
                                        let newData = _.cloneDeep(data);
                                        newData.value = null;
                                        newData.y = null;
                                        return newData;
                                    }
                                    return data;
                                })}
                                interpolation={'monotoneX'}
                                style={{ data: { stroke: lineChartColor, strokeLinecap: 'round', strokeWidth: 4, }, }}
                                x={updatedBarData.length === 14 ? 'key' : 'x'}
                            />
                            <V.VictoryScatter
                                data={lineChartData}
                                size={5}
                                style={{ data: { fill: lineChartColor, }, }}
                                x={updatedBarData.length === 14 ? 'key' : 'x'}
                            />
                        </V.VictoryGroup>
                    }

                    { currentAlert.visualization_type === 5 &&
                        <V.VictoryScatter
                            data={lineChartData}
                            labelComponent={
                                <V.VictoryLabel
                                    dy={AppFonts.scaleFont(14)}
                                    style={{ fill: AppColors.white, fontFamily: 'Oswald', fontSize: AppFonts.scaleFont(11), }}
                                    text={datum => datum.displayValue}
                                />
                            }
                            labels={datum => datum.y}
                            size={14}
                            style={{ data: { fill: d => d.fillColor, }, }}
                            x={updatedBarData.length === 14 ? 'key' : 'x'}
                        />
                    }

                </V.VictoryChart>

                { hasRightAxis &&
                    <View style={[styles.xyAxisWrapper, {right: 0,}]}>
                        <Text robotoRegular style={[styles.yAxis, {transform: [{ rotate: '90deg'}],}]}>
                            {_.toLower(currentAlert.visualization_data.y_axis_2)}
                        </Text>
                    </View>
                }

                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingXSml,}}>
                    { currentAlert.visualization_data &&
                        _.map(currentAlert.visualization_data.plot_legends, (legend, key) => {
                            if(legend.text.length === 0) { return (null); }
                            return (
                                <View
                                    key={key}
                                    style={[
                                        {alignItems: 'center', flex: (1 / currentAlert.visualization_data.plot_legends.length), flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.paddingSml,},
                                        (key % 2 !== 0 || key === 0) && currentAlert.visualization_data.plot_legends.length !== 1 ? {marginRight: AppSizes.padding,} : {},
                                    ]}
                                >
                                    { legend.type === 0 ?
                                        <View style={[styles.keyCircle, { backgroundColor: legend.color === 0 ? AppColors.zeplin.successLight : legend.color === 1 ? AppColors.zeplin.warningLight : legend.color === 2 ? AppColors.zeplin.errorLight : AppColors.zeplin.slateXLight, }]} />
                                        : legend.type === 1 ?
                                            null
                                            : legend.type === 2 ?
                                                <Dash dashColor={legend.color === 0 ? AppColors.zeplin.successLight : legend.color === 1 ? AppColors.zeplin.warningLight : legend.color === 2 ? AppColors.zeplin.errorLight : AppColors.zeplin.slateXLight} style={{marginRight: AppSizes.paddingSml, width: '10%',}} />
                                                :
                                                null
                                    }
                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11),}}>{_.toLower(legend.text)}</Text>
                                </View>
                            );
                        })
                    }
                </View>

                <View style={[StyleSheet.absoluteFill, {height: '100%', width: '100%',},]} />

            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default FathomCharts;
