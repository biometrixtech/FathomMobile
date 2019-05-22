/**
 * FathomCharts
 *
     <FathomCharts
        barData={data}
        currentAlert={currentAlert}
        startSliceValue={7}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View, } from 'react-native';

// import third-party libraries
import { BarChart, Grid, LineChart, Path, } from 'react-native-svg-charts';
import { Circle, ClipPath, Defs, G, Rect, } from 'react-native-svg';
import * as scale from 'd3-scale';
import _ from 'lodash';
import Dash from 'react-native-dash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { PlanLogic, } from '../../../lib';

// Components
import { TabIcon, Text, } from '../../custom';
import { XAxis, } from './';

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
    yAxis: {
        color:    AppColors.zeplin.slate,
        fontSize: AppFonts.scaleFont(10),
    },
});

/* Component ==================================================================== */
{/*
<Circle
    cx={x(index)}
    cy={y(value.value) - 10}
    fill={value.color === 0 ? AppColors.zeplin.success : value.color === 1 ? AppColors.zeplin.yellow : AppColors.zeplin.error}
    key={index}
    r={10}
    spacingInner={0.5}
    spacingOuter={0.5}
    stroke={value.color === 0 ? AppColors.zeplin.success : value.color === 1 ? AppColors.zeplin.yellow : AppColors.zeplin.error}
>
    <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(11),}}>{value.value}</Text>
</Circle>
<SVGText
    alignmentBaseline={'middle'}
    fill={value.color === 0 ? AppColors.zeplin.success : value.color === 1 ? AppColors.zeplin.yellow : AppColors.zeplin.error}
    fontFamily={'Oswald'}
    fontSize={AppFonts.scaleFont(11)}
    fontWeight={'regular'}
    key={index}
    textAnchor={'middle'}
    x={x(index) + (bandwidth / 2)}
    y={y(value.value) - 10}
>
    {value.value}
</SVGText>*/}

const Clips = ({ extraData, width, x, }) => (
    <Defs key={ 'clips' }>
        <ClipPath id="clip-path-1">
            <Rect x={ '0' } y={ '0' } width={ x( (extraData.length - 3) ) } height={ '100%' }/>
        </ClipPath>
        <ClipPath id={ 'clip-path-2' }>
            <Rect x={ x( (extraData.length - 3) ) } y={ '0' } width={ width - x( (extraData.length - 3) ) } height={ '100%' }/>
        </ClipPath>
    </Defs>
);

const DashedLine = ({ line, }) => (
    <Path
        clipPath={ 'url(#clip-path-2)' }
        d={ line }
        fill={ 'none' }
        key={ 'line-1' }
        stroke={AppColors.zeplin.yellow}
        strokeDasharray={ [ 4, 4 ] }
        strokeWidth={ 2 }
    />
);

const Decorator = ({ data, fillColor, x, y, }) => (
    _.map(data, (value, index) => (
        <Circle
            cx={x(index)}
            cy={y(value.value)}
            fill={fillColor}
            key={index}
            r={7}
            spacingInner={0.5}
            spacingOuter={0.5}
            stroke={fillColor}
        />
    ))
);

const RampMuscularStrength = ({ bandwidth, extraData, x, y, }) => (
    _.map(extraData, (value, index) => (
        <Circle
            cx={x(index)}
            cy={y(value.value) - 10}
            fill={value.color === 0 ? AppColors.zeplin.success : value.color === 1 ? AppColors.zeplin.yellow : AppColors.zeplin.error}
            key={index}
            r={10}
            spacingInner={0.5}
            spacingOuter={0.5}
            stroke={value.color === 0 ? AppColors.zeplin.success : value.color === 1 ? AppColors.zeplin.yellow : AppColors.zeplin.error}
        >
            <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(11),}}>{value.value}</Text>
        </Circle>
    ))
);

const Shadow = ({ fillColor, line, }) => (
    <Path
        d={line}
        fill={'none'}
        key={'shadow-1'}
        stroke={fillColor}
        strokeOpacity={0.16}
        strokeWidth={4}
        y={3}
    />
);

class FathomCharts extends PureComponent {
    static propTypes = {
        barData:         PropTypes.array.isRequired,
        currentAlert:    PropTypes.object,
        startSliceValue: PropTypes.number.isRequired,
    };

    static defaultProps = {
        currentAlert: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            width:  0,
        };
    }

    _onLayout = event => {
        const { nativeEvent: { layout: { height, width, } } } = event;
        // console.log(width);
        this.setState({ height, width, });
    }

    render = () => {
        const { barData, currentAlert, } = this.props;
        let {
            chartFlex,
            hasLeftAxis,
            hasRightAxis,
            lineChartData,
            lineChartColor,
            updatedBarData,
        } = PlanLogic.handleFathomChartsRenderLogic(currentAlert.data, barData, currentAlert.visualization_type, currentAlert.visualization_data.plot_legends, this.props.startSliceValue, currentAlert.visualization_data);
        // let updatedBarData = this._cleanBarChartData(barData, currentAlert.visualization_type, currentAlert.visualization_data.plot_legends);
        let extraData = [{color: 0, value: 60,}, {color: 0, value: 51,}, {color: 2, value: 400,}, {color: 2, value: 40,}, {color: 1, value: 0,}, {color: 1, value: 38,}, {color: 0, value: 34,}];
        return (
            <View>
                <View style={{flexDirection: 'row',}}>
                    { hasLeftAxis &&
                        <View style={{alignItems: 'center', flex: 0.5, justifyContent: 'center',}}>
                            <View style={{alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-90deg'}], width: 200,}}>
                                <Text robotoRegular style={[styles.yAxis,]}>{_.toLower(currentAlert.visualization_data.y_axis_1)}</Text>
                            </View>
                        </View>
                    }
                    <View onLayout={event => this._onLayout(event)} style={{flex: chartFlex,}}>
                        { updatedBarData.length > 0 ?
                            <View style={{height: 200,}}>
                                <BarChart
                                    animate={true}
                                    animationDuration={300}
                                    contentInset={{bottom: 10, top: 10,}}
                                    data={updatedBarData}
                                    gridMin={0}
                                    spacingInner={0.5}
                                    spacingOuter={0.5}
                                    style={{flex: 1,}}
                                    yAccessor={({ item }) => item.value}
                                >
                                    <Grid svg={{ stroke: AppColors.zeplin.superLight, strokeOpacity: 0.5, strokeWidth: 1, }} />
                                    {/* currentAlert.visualization_type === 5 ?
                                        <RampMuscularStrength extraData={extraData} />
                                        :
                                        null
                                    */}
                                </BarChart>
                                {/* currentAlert.visualization_type === 4 ?
                                    <LineChart
                                        animate={true}
                                        animationDuration={300}
                                        contentInset={{bottom: 20, top: 20,}}
                                        data={lineChartData}
                                        spacingInner={0.5}
                                        spacingOuter={0.5}
                                        style={[StyleSheet.absoluteFill,]}
                                        svg={{
                                            clipPath:    'url(#clip-path-1)',
                                            stroke:      lineChartColor,
                                            strokeWidth: 5,
                                        }}
                                        yAccessor={({ item }) => item.value}
                                    >
                                        <Clips extraData={lineChartData} />
                                        <Decorator fillColor={lineChartColor} />
                                        <DashedLine />
                                        {/*<Shadow fillColor={lineChartColor} />/}
                                    </LineChart>
                                    :
                                    null
                                */}
                                { currentAlert.visualization_type === 3 ?
                                    <LineChart
                                        animate={true}
                                        animationDuration={300}
                                        contentInset={{bottom: 20, top: 20,}}
                                        data={lineChartData}
                                        spacingInner={0.5}
                                        spacingOuter={0.5}
                                        style={[StyleSheet.absoluteFill,]}
                                        svg={{
                                            stroke:      lineChartColor,
                                            strokeWidth: 5,
                                        }}
                                        yAccessor={({ item }) => item.value}
                                    >
                                        <Decorator fillColor={lineChartColor} />
                                        <Shadow fillColor={lineChartColor} />
                                    </LineChart>
                                    :
                                    null
                                }
                            </View>
                            :
                            <View style={{height: 200,}}>
                                <Text>{'EMPTY'}</Text>
                            </View>
                        }
                        <XAxis
                            data={updatedBarData}
                            formatLabel={(value, index) => updatedBarData[index].label}
                            scale={scale.scaleBand}
                            spacingInner={0.5}
                            spacingOuter={0.5}
                            style={{marginTop: 10,}}
                            svg={{fontSize: AppFonts.scaleFont(11),}}
                        />
                        {/*<View style={{alignItems: 'center', flex: 1, flexDirection: 'row',}}>
                            {_.map(updatedBarData, (value, key) =>
                                <View key={key} style={{alignItems: 'center', flex: 1, justifyContent: 'center', marginHorizontal: 0.5, paddingHorizontal: 0.5,}}>
                                    <Text robotoRegular style={[styles.label, value.fillColor ? {color: value.fillColor,} : {},]}>{value.label}</Text>
                                    { value.hasMultipleSports ?
                                        <TabIcon
                                            color={value.fillColor ? value.fillColor : AppColors.zeplin.light}
                                            icon={'checkbox-multiple-marked-circle'}
                                            size={20}
                                            type={'material-community'}
                                        />
                                        : value.filteredSport ?
                                            <Image
                                                source={value.filteredSport.imagePath}
                                                style={{height: 20, tintColor: value.fillColor ? value.fillColor : AppColors.zeplin.light, width: 20,}}
                                            />
                                            :
                                            <View style={{height: 20, width: 20,}} />
                                    }
                                </View>
                            )}
                        </View>*/}
                    </View>
                    { hasRightAxis &&
                        <View style={{alignItems: 'center', flex: 0.5, justifyContent: 'center',}}>
                            <View style={{alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '90deg'}], width: 200,}}>
                                <Text robotoRegular style={[styles.yAxis,]}>{_.toLower(currentAlert.visualization_data.y_axis_2)}</Text>
                            </View>
                        </View>
                    }
                </View>

                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingMed,}}>
                    { currentAlert.visualization_data &&
                        _.map(currentAlert.visualization_data.plot_legends, (legend, key) =>
                            <View
                                key={key}
                                style={[
                                    {alignItems: 'center', flex: (1 / currentAlert.visualization_data.plot_legends.length), flexDirection: 'row', justifyContent: 'center',},
                                    key % 2 === 0 ? {marginRight: AppSizes.padding,} : {},
                                ]}
                            >
                                { legend.type === 0 ?
                                    <View style={[styles.keyCircle, { backgroundColor: legend.color === 0 ? AppColors.zeplin.success : legend.color === 1 ? AppColors.zeplin.yellow : AppColors.zeplin.error, }]} />
                                    :
                                    <Dash dashColor={legend.color === 0 ? AppColors.zeplin.success : legend.color === 1 ? AppColors.zeplin.yellow : AppColors.zeplin.error} style={{flex: 0.1, marginRight: AppSizes.paddingSml,}} />
                                }
                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(11),}}>{_.toLower(legend.text)}</Text>
                            </View>
                        )
                    }
                </View>

            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default FathomCharts;
