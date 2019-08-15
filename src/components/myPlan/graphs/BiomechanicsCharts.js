/**
 * BiomechanicsCharts
 *
     <BiomechanicsCharts
         chartData={updatedChartData}
         isRichDataView={true}
         sessionDuration={sessionDuration}
         selectedSession={selectedSession}
         showTitle={true}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, View, } from 'react-native';

// import third-party libraries
import * as V from 'victory-native';
import _ from 'lodash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { PlanLogic, } from '../../../lib';

// Components
import { ParsedText, Spacer, TabIcon, Text, } from '../../custom';

/* Component ==================================================================== */
class BiomechanicsCharts extends PureComponent {
    static propTypes = {
        chartData:       PropTypes.array,
        isRichDataView:  PropTypes.bool,
        pieDetails:      PropTypes.object,
        sessionDuration: PropTypes.string,
        selectedSession: PropTypes.object.isRequired,
        showDetails:     PropTypes.bool,
        showTitle:       PropTypes.bool,
    };

    static defaultProps = {
        chartData:       [],
        isRichDataView:  false,
        pieDetails:      {},
        sessionDuration: '',
        showDetails:     true,
        showTitle:       false,
    };

    render = () => {
        const { chartData, isRichDataView, pieDetails, sessionDuration, selectedSession, showDetails, showTitle, } = this.props;
        let {
            largerPieData,
            parsedSummaryData,
            rotateDeg,
            smallerPieData,
        } = PlanLogic.handleBiomechanicsChartsRenderLogic(pieDetails.pieData, selectedSession, isRichDataView);
        return (
            <View pointerEvents={'none'}>

                { isRichDataView ?
                    <View>
                        <View style={{marginTop: AppSizes.paddingMed, paddingLeft: AppSizes.paddingLrg, paddingRight: AppSizes.paddingSml,}}>
                            { showTitle &&
                                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14),}}>{'Pelvic Tilt Range of Motion'}</Text>
                            }
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.paddingXSml, marginTop: AppSizes.paddingSml,}}>
                                <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{'00:00'}</Text>
                                <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{sessionDuration}</Text>
                            </View>
                            <Text robotoRegular style={{color: AppColors.zeplin.purpleLight, fontSize: AppFonts.scaleFont(10),}}>{'left'}</Text>
                        </View>
                        <V.VictoryChart
                            domain={{ y: [-10, 10], }}
                            height={((AppSizes.screen.width - (AppSizes.paddingMed * 2)) * 0.5)}
                            padding={{bottom: AppSizes.paddingSml, left: AppSizes.paddingLrg, right: AppSizes.paddingSml, top: AppSizes.paddingSml,}}
                            width={(AppSizes.screen.width - (AppSizes.paddingMed * 2))}
                        >
                            {/* Y-Axis */}
                            <V.VictoryAxis
                                crossAxis={false}
                                dependentAxis
                                style={{
                                    axis:       { stroke: AppColors.transparent, size: 0, },
                                    grid:       { stroke: AppColors.zeplin.superLight, size: 0.5, },
                                    tickLabels: { ...AppFonts.robotoLight, color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(6), },
                                }}
                                tickCount={20}
                                tickFormat={t =>
                                    t % 2 === 0 ?
                                        t < 0 ? `${(t * -1)}\u00B0` : `${t}\u00B0`
                                        :
                                        ''
                                }
                            />
                            {/* X-Axis */}
                            <V.VictoryAxis
                                style={{
                                    axis: { stroke: AppColors.white, size: 1, },
                                    grid: { stroke: AppColors.transparent, },
                                }}
                                tickFormat={t => ' '}
                            />
                            {/* Bar Chart */}
                            <V.VictoryBar
                                data={chartData}
                                style={{ data: { fill: d => d.color, }, }}
                            />
                        </V.VictoryChart>
                        <View style={{marginBottom: AppSizes.paddingMed, paddingLeft: AppSizes.paddingLrg, paddingRight: AppSizes.paddingSml,}}>
                            <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(10),}}>{'right'}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: showTitle ? 'space-between' : 'center', marginHorizontal: AppSizes.paddingMed, marginBottom: AppSizes.paddingMed,}}>
                            { showTitle &&
                                <TabIcon
                                    color={AppColors.white}
                                    icon={'chevron-right'}
                                    size={20}
                                    type={'material-community'}
                                />
                            }
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                {_.map(selectedSession.asymmetry.apt.detail_legend, (legend, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            i % 2 === 0 ? {marginRight: AppSizes.padding,} : {},
                                            {alignItems: 'center', flexDirection: 'row', justifyContent: 'center',},
                                        ]}
                                    >
                                        {_.map(legend.color, (color, index) =>
                                            <View
                                                key={index}
                                                style={{
                                                    backgroundColor: PlanLogic.returnInsightColorString(color),
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                        )}
                                        <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{legend.text}</Text>
                                    </View>
                                ))}
                            </View>
                            { showTitle &&
                                <TabIcon
                                    color={AppColors.zeplin.slateXLight}
                                    icon={'chevron-right'}
                                    size={20}
                                    type={'material-community'}
                                />
                            }
                        </View>
                    </View>
                    :
                    <View style={{flexDirection: 'row',}}>
                        <ImageBackground
                            imageStyle={{borderRadius: 12,}}
                            source={require('../../../../assets/images/standard/apt_notilt.png')}
                            style={{height: pieDetails.pieLeftWrapperWidth, width: pieDetails.pieLeftWrapperWidth,}}
                        >
                            <View style={{transform: [{rotate: rotateDeg,}]}}>
                                <V.VictoryPie
                                    cornerRadius={7}
                                    data={largerPieData}
                                    height={pieDetails.pieLeftWrapperWidth}
                                    innerRadius={pieDetails.rightPieInnerRadius}
                                    labels={d => ''}
                                    style={{
                                        data: { fill: d => d.color},
                                    }}
                                    width={pieDetails.rightPieWidth}
                                />
                                <View style={{alignSelf: 'center', position: 'absolute', width: pieDetails.rightPieWidth,}}>
                                    <V.VictoryPie
                                        cornerRadius={7}
                                        data={smallerPieData}
                                        height={pieDetails.pieLeftWrapperWidth}
                                        innerRadius={pieDetails.rightPieInnerRadius}
                                        labels={d => ''}
                                        style={{
                                            data: { fill: d => d.color},
                                        }}
                                        width={pieDetails.rightPieWidth}
                                    />
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={{flexDirection: 'row', marginBottom: AppSizes.paddingSml, marginTop: AppSizes.paddingMed, paddingRight: AppSizes.paddingSml, width: pieDetails.pieRightWrapperWidth,}}>
                            <View style={{flex: showTitle ? 9 : 1, justifyContent: 'space-between',}}>
                                { showDetails ?
                                    <View>
                                        { showTitle &&
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(24),}}>{'Pelvic Tilt'}</Text>
                                        }
                                        { selectedSession && selectedSession.asymmetry && selectedSession.asymmetry.apt && _.toInteger(selectedSession.asymmetry.apt.summary_side) === 0 ?
                                            <Image
                                                resizeMode={'contain'}
                                                source={require('../../../../assets/images/standard/allcaughtup.png')}
                                                style={{height: 60, tintColor: AppColors.zeplin.successLight, width: 60,}}
                                            />
                                            :
                                            <Text robotoRegular style={{color: AppColors.zeplin.purpleLight, fontSize: AppFonts.scaleFont(38),}}>{`${_.round(selectedSession.asymmetry.apt.summary_percentage)}%`}</Text>
                                        }
                                        <ParsedText
                                            parse={parsedSummaryData}
                                            style={[AppStyles.robotoRegular, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),},]}
                                        >
                                            {selectedSession && selectedSession.asymmetry && selectedSession.asymmetry.apt ? selectedSession.asymmetry.apt.summary_text : ''}
                                        </ParsedText>
                                    </View>
                                    :
                                    <View />
                                }
                                { selectedSession && selectedSession.asymmetry && selectedSession.asymmetry.apt && _.toInteger(selectedSession.asymmetry.apt.summary_side) === 0 ?
                                    <View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginVertical: AppSizes.paddingSml,}}>
                                            <View
                                                style={{
                                                    backgroundColor: AppColors.zeplin.successLight,
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'Left & Right Symmetry'}</Text>
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginVertical: AppSizes.paddingSml,}}>
                                            <View
                                                style={{
                                                    backgroundColor: AppColors.zeplin.purpleLight,
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                            <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{'Left side ROM'}</Text>
                                        </View>
                                        <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                            <View
                                                style={{
                                                    backgroundColor: AppColors.zeplin.splashLight,
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                            <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{'Right side ROM'}</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                            { showTitle &&
                                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                                    <TabIcon
                                        color={AppColors.zeplin.slateXLight}
                                        icon={'chevron-right'}
                                        size={20}
                                        type={'material-community'}
                                    />
                                </View>
                            }
                        </View>
                    </View>
                }

            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default BiomechanicsCharts;
