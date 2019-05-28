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
        color:        AppColors.zeplin.darkSlate,
        fontSize:     AppFonts.scaleFont(11),
        marginBottom: AppSizes.paddingXSml,
    },
    xyAxisWrapper: {
        // bottom:         0,
        // height:         300,
        // justifyContent: 'center',
        // position:       'absolute',
        // top:            0,
        // width:          AppFonts.scaleFont(12),
    },
    yAxis: {
        bottom:    0,
        color:     AppColors.zeplin.slate,
        fontSize:  AppFonts.scaleFont(10),
        height:    AppFonts.scaleFont(12),
        left:      0,
        position:  'absolute',
        textAlign: 'center',
        top:       0,
        width:     300,
    },
});

/* Component ==================================================================== */
class XAxisLabels extends PureComponent {
    render = () => {
        const { data, datum, x, y, } = this.props;
        const currentData = data[(datum - 1)];
        return (
            <View style={{position: 'absolute', top: y, left: (x - this.props.style.padding),}}>
                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(11), marginBottom: AppSizes.paddingXSml, textAlign: 'center',}}>
                    {currentData.x}
                </Text>
                { currentData.hasMultipleSports ?
                    <TabIcon
                        color={AppColors.zeplin.light}
                        icon={'checkbox-multiple-marked-circle'}
                        size={15}
                        type={'material-community'}
                    />
                    : currentData.filteredSport ?
                        <Image
                            source={currentData.filteredSport.imagePath}
                            style={{height: 15, tintColor: AppColors.zeplin.light, width: 15,}}
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
        let {
            hasLeftAxis,
            hasRightAxis,
            lineChartData,
            lineChartColor,
            updatedBarData,
        } = PlanLogic.handleFathomChartsRenderLogic(currentAlert.data, barData, currentAlert.visualization_type, currentAlert.visualization_data.plot_legends, this.props.startSliceValue, currentAlert.visualization_data, containerWidth);
        console.log('updatedBarData',updatedBarData);
        console.log('lineChartData',lineChartData);
        console.log('currentAlert',currentAlert,currentAlert.visualization_type);
        return (
            <View
                pointerEvents={'none'}
                // style={{backgroundColor: 'red',}}
            >

                {/* hasLeftAxis &&
                    <View style={[styles.xyAxisWrapper, {backgroundColor: 'blue', left: 0,}]}>
                        <Text robotoRegular style={[styles.yAxis, {backgroundColor: 'red', transform: [{ rotate: '-90deg'}],}]}>
                            {_.toLower(currentAlert.visualization_data.y_axis_1)}
                        </Text>
                    </View>
                */}

                <V.VictoryChart
                    animate={{
                        duration: 150,
                        onLoad:   { duration: 150, },
                    }}
                    // containerComponent={
                    //     <V.VictoryBrushContainer
                    //         allowDrag={false}
                    //         allowResize={false}
                    //         brushDimension={'x'}
                    //         brushDomain={{ x: currentAlert.visualization_type === 4 ? [3.5, 4.5] : [5.5, 6.5], }}
                    //         brushStyle={{ fill: AppColors.zeplin.superLight, fillOpacity: 0.75, }}
                    //     />
                    // }
                    domainPadding={{ x: AppSizes.padding, }}
                    // style={{
                    //     data: {
                    //         backgroundColor: 'green',
                    //     },
                    //     parent: {
                    //         backgroundColor: 'blue',
                    //     },
                    // }}
                >

                    {/* visualization_type 1 - always show the bar graph. will autofill for visualization_type 2. */}
                    <V.VictoryBar
                        cornerRadius={{ bottom: (AppSizes.padding / 2), top: (AppSizes.padding / 2), }}
                        data={updatedBarData}
                        style={{ data: { fill: d => currentAlert.visualization_type !== 2 ? AppColors.zeplin.light : d.fillColor, width: AppSizes.padding, }, }}
                    />

                    { (currentAlert.visualization_type === 3 || currentAlert.visualization_type === 4) &&
                        <V.VictoryGroup>
                            <V.VictoryLine
                                // animate={{ easing: '', }}
                                data={lineChartData}
                                interpolation={'monotoneX'}
                                style={currentAlert.visualization_type === 3 ?
                                    { data: { stroke: lineChartColor, strokeLinecap: 'round', strokeWidth: 5, }, }
                                    :
                                    { data: { stroke: lineChartColor, strokeDasharray: 4, strokeWidth: 4, } }
                                }
                            />
                            <V.VictoryScatter
                                // animate={{ easing: '', }}
                                data={lineChartData}
                                size={5}
                                style={{ data: { fill: lineChartColor, }, }}
                            />
                        </V.VictoryGroup>
                    }

                    { currentAlert.visualization_type === 5 &&
                        <V.VictoryScatter
                            data={lineChartData}
                            labelComponent={
                                <V.VictoryLabel
                                    dy={AppFonts.scaleFont(14)}
                                    style={{ fill: AppColors.white, fontFamily: 'Oswald', fontSize: AppFonts.scaleFont(11), fontWeight: 'regular', }}
                                    text={datum => datum.y}
                                />
                            }
                            labels={datum => datum.y}
                            size={14}
                            style={{ data: { fill: d => d.fillColor, }, }}
                        />
                    }

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
                        tickLabelComponent={<XAxisLabels data={updatedBarData} />}
                    />

                    {/* hasLeftAxis &&
                        <V.VictoryLabel
                            style={{fill: AppColors.zeplin.slate, fontFamily: 'roboto', fontSize: AppFonts.scaleFont(10),}}
                            text={_.toLower(currentAlert.visualization_data.y_axis_1)}
                            x={AppSizes.padding}
                            y={AppSizes.padding}
                        />
                    }

                    { hasRightAxis &&
                        <V.VictoryLabel
                            style={{fill: AppColors.zeplin.slate, fontFamily: 'roboto', fontSize: AppFonts.scaleFont(10),}}
                            text={_.toLower(currentAlert.visualization_data.y_axis_2)}
                            textAnchor={'end'}
                            x={(AppSizes.screen.width - (AppSizes.padding * 2))}
                            y={AppSizes.padding}
                        />
                    */}

                </V.VictoryChart>

                {/* hasRightAxis &&
                    <View style={[styles.xyAxisWrapper, {backgroundColor: 'blue', right: 0,}]}>
                        <Text robotoRegular style={[styles.yAxis, {backgroundColor: 'red', transform: [{ rotate: '90deg'}],}]}>
                            {_.toLower(currentAlert.visualization_data.y_axis_2)}
                        </Text>
                    </View>
                */}

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
                                        <View style={[styles.keyCircle, { backgroundColor: legend.color === 0 ? AppColors.zeplin.success : legend.color === 1 ? AppColors.zeplin.yellow : legend.color === 2 ? AppColors.zeplin.error : AppColors.zeplin.slate, }]} />
                                        : legend.type === 1 ?
                                            null
                                            : legend.type === 2 ?
                                                <Dash dashColor={legend.color === 0 ? AppColors.zeplin.success : legend.color === 1 ? AppColors.zeplin.yellow : legend.color === 2 ? AppColors.zeplin.error : AppColors.zeplin.slate} style={{marginRight: AppSizes.paddingSml, width: '10%',}} />
                                                :
                                                null
                                    }
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(11),}}>{_.toLower(legend.text)}</Text>
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
