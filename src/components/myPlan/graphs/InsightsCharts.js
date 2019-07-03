/**
 * InsightsCharts
 *
     <InsightsCharts
        currentAlert={currentAlert}
        data={currentAlert.data}
        selectedIndex={currentDataIndex}
        showSelection={showSelection}
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
import { AppColors, AppFonts, AppSizes, MyPlan as MyPlanConstants, } from '../../../constants';
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
        fontSize:     AppFonts.scaleFont(12),
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
        color:     AppColors.zeplin.slateLight,
        fontSize:  AppFonts.scaleFont(10),
        textAlign: 'center',
        width:     300,
    },
});

/* Component ==================================================================== */
class XAxisLabels extends PureComponent {
    render = () => {
        const { data, index, selectedIndex, showSelection, x, y, } = this.props;
        const currentData = data[index];
        if(!currentData) {
            return (null);
        }
        return (
            <View
                style={[
                    showSelection ? {borderColor: selectedIndex === index ? AppColors.zeplin.slateXLight : AppColors.transparent, borderRadius: 10, borderWidth: 2,} : {},
                    {left: (x - this.props.style.padding), position: 'absolute', top: y,}
                ]}
            >
                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), marginBottom: AppSizes.paddingXSml, textAlign: 'center',}}>
                    {currentData.x.charAt(1) ? `${currentData.x.charAt(0)}${currentData.x.charAt(1)}` : currentData.x.charAt(0)}
                </Text>
                { currentData.hasMultipleSports ?
                    <TabIcon
                        color={AppColors.zeplin.slateXLight}
                        icon={'checkbox-multiple-marked-circle'}
                        size={15}
                        type={'material-community'}
                    />
                    : currentData.filteredSport ?
                        <Image
                            source={currentData.filteredSport.imagePath}
                            style={{height: 15, tintColor: AppColors.zeplin.slateXLight, width: 15,}}
                        />
                        :
                        <View />
                }

            </View>
        );
    }
}

class InsightsCharts extends PureComponent {
    static propTypes = {
        currentAlert:  PropTypes.object,
        data:          PropTypes.array.isRequired,
        selectedIndex: PropTypes.number,
        showSelection: PropTypes.bool,
    };

    static defaultProps = {
        currentAlert:  false,
        selectedIndex: -1,
        showSelection: true,
    };

    render = () => {
        const { currentAlert, data, selectedIndex, showSelection, } = this.props;
        if(!currentAlert || !currentAlert.visualization_type || !currentAlert.visualization_data) {
            return (null);
        }
        let {
            barWidth,
            currentLineGraphData,
            hasLeftAxis,
            hasRightAxis,
            updatedBarData,
        } = PlanLogic.handleInsightsChartsRenderLogic(currentAlert, data);
        return (
            <View pointerEvents={'none'}>

                { (hasLeftAxis && showSelection) &&
                    <View style={[styles.xyAxisWrapper, {left: 0,}]}>
                        <Text robotoRegular style={[styles.yAxis, {transform: [{ rotate: '-90deg'}],}]}>
                            {currentAlert.visualization_data.y_axis_1}
                        </Text>
                    </View>
                }

                <V.VictoryChart
                    animate={true}
                    domainPadding={{ x: AppSizes.padding, }}
                    height={200}
                    maxDomain={currentAlert.visualization_type === 7 ? {y: 5,} : {}}
                    minDomain={currentAlert.visualization_type === 7 ? {y: 0,} : {}}
                >

                    {/* Y-Axis */}
                    <V.VictoryAxis
                        dependentAxis
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
                        tickFormat={t => ' '}
                    />

                    {/* X-Axis */}
                    <V.VictoryAxis
                        style={{
                            axis: {
                                stroke:        AppColors.zeplin.superLight,
                                strokeOpacity: 0.5,
                                size:          1,
                            },
                            grid: {
                                stroke:          t => showSelection && (t - 1) === selectedIndex ? AppColors.zeplin.slateXLight : AppColors.transparent,
                                strokeDasharray: [5, 5],
                                size:            1,
                            },
                        }}
                        tickLabelComponent={
                            <XAxisLabels
                                data={(currentAlert.visualization_type === 8 || currentAlert.visualization_type === 9) ? updatedBarData : currentLineGraphData.pain}
                                selectedIndex={selectedIndex}
                                showSelection={showSelection}
                            />
                        }
                    />

                    {/* visualization_type 8*/}
                    { (currentAlert.visualization_type === 8 || currentAlert.visualization_type === 9) &&
                        <V.VictoryBar
                            cornerRadius={{ bottom: (barWidth / 2), top: (barWidth / 2), }}
                            data={updatedBarData}
                            style={{ data: { fill: d => d.fillColor, width: barWidth, }, }}
                        />
                    }

                    {/* visualization_type 7*/}
                    { currentAlert.visualization_type === 7 &&
                        <V.VictoryGroup>
                            <V.VictoryLine
                                data={currentLineGraphData.pain}
                                interpolation={'monotoneX'}
                                style={{ data: { stroke: d => d[0].color, strokeLinecap: 'round', strokeWidth: 5, }, }}
                            />
                            <V.VictoryScatter
                                data={currentLineGraphData.pain}
                                size={5}
                                style={{ data: { fill: d => d.color, }, }}
                            />
                            <V.VictoryLine
                                data={currentLineGraphData.soreness}
                                interpolation={'monotoneX'}
                                style={{ data: { stroke: d => d[0].color, strokeLinecap: 'round', strokeWidth: 5, }, }}
                            />
                            <V.VictoryScatter
                                data={currentLineGraphData.soreness}
                                size={5}
                                style={{ data: { fill: d => d.color, }, }}
                            />
                        </V.VictoryGroup>
                    }

                </V.VictoryChart>

                { (hasRightAxis && showSelection) &&
                    <View style={[styles.xyAxisWrapper, {right: 0,}]}>
                        <Text robotoRegular style={[styles.yAxis, {transform: [{ rotate: '90deg'}],}]}>
                            {currentAlert.visualization_data.y_axis_2}
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
                                        <View
                                            style={[
                                                styles.keyCircle,
                                                { backgroundColor: PlanLogic.returnInsightColorString(legend.color), }
                                            ]}
                                        />
                                        : legend.type === 1 ?
                                            null
                                            : legend.type === 2 ?
                                                <Dash
                                                    dashColor={PlanLogic.returnInsightColorString(legend.color)}
                                                    style={{
                                                        marginRight: AppSizes.paddingSml,
                                                        width:       '10%',
                                                    }}
                                                />
                                                : legend.type === 3 ?
                                                    <View
                                                        style={{
                                                            backgroundColor: PlanLogic.returnInsightColorString(legend.color),
                                                            borderRadius:    5,
                                                            height:          10,
                                                            marginRight:     AppSizes.paddingSml,
                                                            width:           35,
                                                        }}
                                                    />
                                                    :
                                                    null
                                    }
                                    <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(legend.color), fontSize: AppFonts.scaleFont(12),}}>{legend.text}</Text>
                                </View>
                            );
                        })
                    }
                </View>

            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default InsightsCharts;
