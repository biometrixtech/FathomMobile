/**
 * TrendChild
 *
    <TrendChild />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StatusBar, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { Button, TabIcon, Text, } from '../custom';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import { Circle, G, Line, Rect, Text as SVGText, } from 'react-native-svg';
import { Grid, LineChart, } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

/* Component ==================================================================== */
class TrendChild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineChartTooltipIndex: 5,
        };
    }

    render = () => {
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

        return (
            <View style={{flex: 1,}}>

                <View style={{backgroundColor: AppColors.white,}}>
                    <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
                    <View style={{justifyContent: 'center', marginBottom: AppSizes.padding, marginTop: AppSizes.statusBarHeight,}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => Actions.trends()}
                            style={{alignSelf: 'flex-start', padding: AppSizes.padding,}}
                        >
                            <TabIcon
                                color={AppColors.zeplin.mediumGrey}
                                icon={'chevron-left'}
                                size={40}
                                type={'material-community'}
                            />
                        </TouchableOpacity>
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(24), textAlign: 'center',}}>
                            {'Parent Alert Header 1'}
                        </Text>
                    </View>
                </View>

                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    bounces={false}
                    nestedScrollEnabled={true}
                    style={{backgroundColor: AppColors.white, flex: 1, paddingBottom: AppSizes.paddingLrg,}}
                >

                    <View
                        onTouchStart={evt => this.setState({ lineChartTooltipIndex: Math.round(evt.nativeEvent.locationX / AppSizes.screen.width * lineChartData.length), })}
                        style={{backgroundColor: AppColors.zeplin.superLight, marginBottom: AppSizes.padding, padding: AppSizes.padding,}}
                    >
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'Data Visualization 1'}</Text>
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
                    </View>

                    <View style={{backgroundColor: AppColors.white, borderRadius: 6, marginBottom: AppSizes.padding, marginHorizontal: AppSizes.paddingMed, padding: AppSizes.padding,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'Child Alert Header - cards'}</Text>

                    </View>

                    <View style={{backgroundColor: AppColors.zeplin.superLight, marginBottom: AppSizes.padding, marginHorizontal: AppSizes.paddingMed, padding: AppSizes.padding,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'Goals, activities'}</Text>
                    </View>

                    <Button
                        buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, width: AppSizes.screen.widthThird,}}
                        containerStyle={[{alignItems: 'center',}]}
                        onPress={() => Actions.myPlan()}
                        title={'My Plan'}
                        titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                    />

                </ScrollView>
            </View>
        );
    }
}

TrendChild.propTypes = {};

TrendChild.defaultProps = {};

TrendChild.componentName = 'TrendChild';

/* Export Component ================================================================== */
export default TrendChild;