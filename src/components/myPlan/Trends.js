/**
 * Trends
 *
    <Trends />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, StatusBar, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Text, } from '../custom';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { AreaChart, BarChart, Grid, LineChart, Path, } from 'react-native-svg-charts';
import { Circle, ClipPath, Defs, G, Line, LinearGradient, Rect, Stop, Text as SVGText, } from 'react-native-svg';
import * as shape from 'd3-shape';

/* Component ==================================================================== */
class Trends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineChartTooltipIndex: 5,
        };
    }

    render = () => {
        // let { plan, } = this.props;

        const lineChartData = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ];
        const LineChartHorizontalLine = (({ y }) => (
            <Line
                key={ 'zero-axis' }
                stroke={ 'grey' }
                strokeDasharray={ [ 4, 8 ] }
                strokeWidth={ 2 }
                x1={ '0%' }
                x2={ '100%' }
                y1={ y(50) }
                y2={ y(50) }
            />
        ));
        const LineChartTooltip = ({ x, y }) => (
            <G
                key={ 'tooltip' }
                // onPress={ () => console.log('tooltip clicked') }
                x={ x(this.state.lineChartTooltipIndex) - (75 / 2) }
            >
                <G
                    y={ 50 }
                >
                    <Rect
                        fill={ 'white' }
                        height={ 40 }
                        rx={ 10 }
                        ry={ 10 }
                        stroke={ 'grey' }
                        width={ 75 }
                    />
                    <SVGText
                        alignmentBaseline={ 'middle' }
                        dy={ 20 }
                        stroke={ AppColors.zeplin.yellow }
                        textAnchor={ 'middle' }
                        x={ 75 / 2 }
                    >
                        { `${lineChartData[this.state.lineChartTooltipIndex]} \u00B0C` }
                    </SVGText>
                </G>
                <G
                    x={ 75 / 2 }
                >
                    <Line
                        stroke={ 'grey' }
                        strokeWidth={ 2 }
                        y1={ 50 + 40 }
                        y2={ y(lineChartData[this.state.lineChartTooltipIndex]) }
                    />
                    <Circle
                        cy={ y(lineChartData[this.state.lineChartTooltipIndex]) }
                        fill={ 'white' }
                        r={ 6 }
                        stroke={ AppColors.zeplin.yellow }
                        strokeWidth={ 2 }
                    />
                </G>
            </G>
        );

        const areaChartData = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]
        const indexToClipFrom = 10
        const AreaChartGradient = () => (
            <Defs key={ 'defs' }>
                <LinearGradient id={ 'gradient' } x1={ '0%' } y={ '0%' } x2={ '0%' } y2={ '100%' }>
                    <Stop offset={ '0%' } stopColor={ 'rgb(134, 65, 244)' } stopOpacity={ 0.8 }/>
                    <Stop offset={ '100%' } stopColor={ 'rgb(134, 65, 244)' } stopOpacity={ 0.2 }/>
                </LinearGradient>
            </Defs>
        );
        const AreaChartClips = ({ x, width }) => (
            <Defs key={ 'clips' }>
                <ClipPath id={ 'clip-path-1' } key={ '0' }>
                    <Rect x={ 0 } y={ '0' } width={ x(indexToClipFrom) } height={ '100%' }/>
                </ClipPath>
                <ClipPath id="clip-path-2" key={ '1' }>
                    <Rect x={ x(indexToClipFrom) } y={ '0' } width={ width - x(indexToClipFrom) } height={ '100%' }/>
                </ClipPath>
            </Defs>
        );
        const AreaChartLine = ({ line }) => (
            <Path
                clipPath={ 'url(#clip-path-1)' }
                d={ line }
                fill={ 'none' }
                key={ 'line' }
                stroke={ 'green' }
            />
        );
        const AreaChartDashedLine = ({ line }) => (
            <Path
                clipPath={ 'url(#clip-path-2)' }
                d={ line }
                fill={ 'none' }
                key={ 'dashed-line' }
                stroke={ 'green' }
                strokeDasharray={ [ 4, 4 ] }
            />
        );

        const barChartData = [
            {value: 50,},
            {value: 10,svg: {fill: 'rgba(134, 65, 244, 0.5)',},},
            {value: 40,svg: {stroke: 'purple',strokeWidth: 2,fill: 'white',strokeDasharray: [ 4, 2 ],},},
            {value: 95,svg: {fill: 'url(#gradient)',},},
            {value: 85,svg: {fill: 'green',},},
        ];
        const BarChartGradient = () => (
            <Defs key={'gradient'}>
                <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
                    <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'}/>
                    <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'}/>
                </LinearGradient>
            </Defs>
        );

        return (
            <View style={{flex: 1,}}>

                <View style={{backgroundColor: AppColors.zeplin.superLight,}}>
                    <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
                    <View style={{height: AppSizes.navbarHeight, marginBottom: AppSizes.padding, marginTop: AppSizes.statusBarHeight,}}>
                        <Image
                            source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                            style={[AppStyles.navbarImageTitle, {alignSelf: 'center', justifyContent: 'center',}]}
                        />
                    </View>
                    <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(34), marginBottom: AppSizes.paddingLrg, textAlign: 'center',}}>
                        {'STATUS'}
                    </Text>
                </View>

                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    bounces={false}
                    nestedScrollEnabled={true}
                    style={{backgroundColor: AppColors.white, flex: 1, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.paddingLrg,}}
                >

                    <TouchableOpacity
                        onPress={() => Actions.trendChild()}
                        onTouchStart={evt => this.setState({ lineChartTooltipIndex: Math.round(evt.nativeEvent.locationX / AppSizes.screen.width * lineChartData.length), })}
                        style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 6, marginBottom: AppSizes.paddingMed, padding: AppSizes.padding,}]}
                    >
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(18),}}>{'Parent Alert Header 1'}</Text>
                        <LineChart
                            animate={true}
                            animationDuration={1000}
                            contentInset={{ top: 20, bottom: 20 }}
                            curve={ shape.curveLinear }
                            data={ lineChartData }
                            style={{ height: 200 }}
                            svg={{
                                stroke:      AppColors.zeplin.yellow,
                                strokeWidth: 2,
                            }}
                        >
                            <Grid />
                            <LineChartHorizontalLine />
                            <LineChartTooltip />
                        </LineChart>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Actions.trendChild()} style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 6, marginBottom: AppSizes.paddingMed, padding: AppSizes.padding,}]}>
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(18),}}>{'Parent Alert Header 2'}</Text>
                        <AreaChart
                            animate={true}
                            animationDuration={1000}
                            contentInset={{ top: 30, bottom: 30 }}
                            data={ areaChartData }
                            style={{ height: 200 }}
                            svg={{
                                clipPath: 'url(#clip-path-1)',
                                fill:     'url(#gradient)',
                            }}
                        >
                            <Grid />
                            <AreaChartGradient />
                            <AreaChartClips />
                            <AreaChartLine />
                            <AreaChartDashedLine />
                        </AreaChart>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Actions.trendChild()} style={[AppStyles.scaleButtonShadowEffect, {backgroundColor: AppColors.white, borderRadius: 6, marginBottom: AppSizes.paddingMed, padding: AppSizes.padding,}]}>
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(18),}}>{'Parent Alert Header 3'}</Text>
                        <BarChart
                            animate={true}
                            animationDuration={1000}
                            contentInset={{ top: 20, bottom: 20 }}
                            data={barChartData}
                            gridMin={0}
                            style={{ height: 200 }}
                            svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                            yAccessor={({ item }) => item.value}
                        >
                            <Grid />
                            <BarChartGradient />
                        </BarChart>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        );
    }
}

Trends.propTypes = {};

Trends.defaultProps = {};

Trends.componentName = 'Trends';

/* Export Component ================================================================== */
export default Trends;