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
import { Image, ImageBackground, Platform, View, } from 'react-native';

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
        chartData:            PropTypes.array,
        dataType:             PropTypes.number.isRequired,
        isRichDataView:       PropTypes.bool,
        pieDetails:           PropTypes.object,
        sessionDuration:      PropTypes.string,
        selectedSession:      PropTypes.object.isRequired,
        showRightSideDetails: PropTypes.bool,
        showDetails:          PropTypes.bool,
        showTitle:            PropTypes.bool,
    };

    static defaultProps = {
        chartData:            [],
        isRichDataView:       false,
        pieDetails:           {},
        sessionDuration:      '',
        showRightSideDetails: true,
        showDetails:          true,
        showTitle:            false,
    };


    _getBarWidth = chartData => {
        const dataLength = _.size(chartData);
        if(dataLength === 0) {
            return 0;
        }
        const range = [chartData[0].x, chartData[(dataLength - 1)].x];
        const extent = Math.abs(range[1] - range[0]);
        const bars = (dataLength + 2);
        const barRatio = 0.5;
        const defaultWidth = barRatio * (dataLength < 2 ? 8 : extent / bars);
        return Math.max(1, defaultWidth);
    }

    render = () => {
        const {
            chartData,
            dataType,
            isRichDataView,
            pieDetails,
            sessionDuration,
            selectedSession,
            showRightSideDetails,
            showDetails,
            showTitle,
        } = this.props;
        let {
            asymmetryIndex,
            chartActiveLegend,
            largerPieData,
            parsedSummaryTextData,
            richDataYDomain,
            rotateDeg,
            smallerPieData,
            specificSessionAsymmetryData,
        } = PlanLogic.handleBiomechanicsChartsRenderLogic(pieDetails.pieData, selectedSession, isRichDataView, chartData, dataType);
        const heightWidthMulitplier = dataType === 3 ? 0.4 : 1;
        let extraPieStyles = dataType === 3 ?
            {
                alignItems: 'center',
                alignSelf:  'center',
                height:     (pieDetails.pieHeight * heightWidthMulitplier),
                width:      (pieDetails.pieWidth * heightWidthMulitplier),
            }
            :
            {};
        let extraImageBackgroundStyles = dataType === 0 ?
            {}
            : dataType === 3 ?
                {justifyContent: 'flex-start',}
                :
                {justifyContent: 'flex-end',};
        let extraLeftStyles = dataType === 2 || dataType === 4 ?
            {
                transform: [{rotate: `-${(_.parseInt(rotateDeg) * 2)}deg`,}],
            }
            :
            {};
        const chartWidth = (AppSizes.screen.width - (AppSizes.paddingMed * 2));
        const barWidth = isRichDataView && selectedSession.duration <= 6 ?
            AppSizes.padding
            : isRichDataView ?
                this._getBarWidth(chartData)
                :
                0;
        const cornerRadius = {bottom: (barWidth / 2), top: (barWidth / 2),};
        return (
            <View pointerEvents={'none'}>

                { isRichDataView ?
                    <View>
                        <View style={{paddingLeft: AppSizes.paddingLrg, paddingRight: AppSizes.paddingSml,}}>
                            { showTitle &&
                                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14),}}>{'Pelvic Tilt Range of Motion'}</Text>
                            }
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: AppSizes.paddingXSml,}}>
                                <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{'00:00'}</Text>
                                <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{sessionDuration}</Text>
                            </View>
                            <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(chartActiveLegend ? chartActiveLegend.color[0] : 2), fontSize: AppFonts.scaleFont(10),}}>{'left'}</Text>
                        </View>
                        <V.VictoryChart
                            domain={{ y: richDataYDomain, }}
                            height={((AppSizes.screen.width - (AppSizes.paddingMed * 2)) * 0.5)}
                            padding={{bottom: AppSizes.paddingSml, left: AppSizes.paddingLrg, right: AppSizes.paddingSml, top: AppSizes.paddingSml,}}
                            width={chartWidth}
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
                                    richDataYDomain[1] > 20 ?
                                        t % 20 === 0 ?
                                            t < 0 ? `${(t * -1)}\u00B0` : `${t}\u00B0`
                                            :
                                            ''
                                        :
                                        t % 2 === 0 ?
                                            t < 0 ? `${(t * -1)}\u00B0` : `${t}\u00B0`
                                            :
                                            ''
                                }
                            />
                            {/* X-Axis */}
                            <V.VictoryAxis
                                style={{
                                    axis: { stroke: AppColors.zeplin.superLight, size: 0.5, },
                                    grid: { stroke: AppColors.transparent, },
                                }}
                                tickFormat={t => ' '}
                            />
                            {/* Bar Chart */}
                            <V.VictoryBar
                                alignment={selectedSession.duration <= 6 ? 'start' : 'middle'}
                                barWidth={selectedSession.duration <= 6 ? AppSizes.padding : null}
                                cornerRadius={cornerRadius}
                                data={chartData}
                                domainPadding={selectedSession.duration <= 6 ? { x: AppSizes.padding, } : null}
                                style={{ data: { fill: d => d.color, }, }}
                            />
                        </V.VictoryChart>
                        <View style={{marginBottom: AppSizes.paddingMed, paddingLeft: AppSizes.paddingLrg, paddingRight: AppSizes.paddingSml,}}>
                            <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(chartActiveLegend ? chartActiveLegend.color[1] : 2), fontSize: AppFonts.scaleFont(10),}}>{'right'}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: showTitle ? 'space-between' : 'center', marginHorizontal: AppSizes.paddingMed,}}>
                            { showTitle &&
                                <TabIcon
                                    color={AppColors.white}
                                    icon={'chevron-right'}
                                    size={20}
                                    type={'material-community'}
                                />
                            }
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                {selectedSession[asymmetryIndex] && selectedSession[asymmetryIndex].asymmetry && _.map(selectedSession[asymmetryIndex].asymmetry.detail_legend, (legend, i) => legend.active ? (
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
                                ) : (null))}
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
                            source={dataType === 0 ?
                                require('../../../../assets/images/standard/apt_notilt.png')
                                : dataType === 1 ?
                                    require('../../../../assets/images/standard/ankle_pitch.png')
                                    : dataType === 2 ?
                                        require('../../../../assets/images/standard/hip_drop.png')
                                        : dataType === 3 ?
                                            require('../../../../assets/images/standard/knee_valgus.png')
                                            :
                                            require('../../../../assets/images/standard/lateral_rotation.png')
                            }
                            style={[{height: pieDetails.pieHeight, marginRight: AppSizes.paddingSml, width: pieDetails.pieWidth,}, extraImageBackgroundStyles,]}
                        >
                            <View style={[{transform: [{rotate: rotateDeg,}]}, extraPieStyles,]}>
                                <V.VictoryPie
                                    containerComponent={<V.VictoryContainer responsive={false} />}
                                    cornerRadius={7}
                                    data={largerPieData}
                                    height={(pieDetails.pieHeight * heightWidthMulitplier)}
                                    innerRadius={pieDetails.pieInnerRadius}
                                    labels={datum => ''}
                                    padding={pieDetails.piePadding}
                                    style={{
                                        data: { fill: d => d.color, },
                                    }}
                                    width={(pieDetails.pieWidth * heightWidthMulitplier)}
                                />
                                <View style={[{alignSelf: 'center', position: 'absolute', width: (pieDetails.pieWidth * heightWidthMulitplier),}, extraLeftStyles,]}>
                                    <V.VictoryPie
                                        containerComponent={<V.VictoryContainer responsive={false} />}
                                        cornerRadius={7}
                                        data={smallerPieData}
                                        height={(pieDetails.pieHeight * heightWidthMulitplier)}
                                        innerRadius={pieDetails.pieInnerRadius}
                                        labels={datum => ''}
                                        padding={pieDetails.piePadding}
                                        style={{
                                            data: { fill: d => d.color, },
                                        }}
                                        width={(pieDetails.pieWidth * heightWidthMulitplier)}
                                    />
                                </View>
                            </View>
                        </ImageBackground>
                        { showRightSideDetails &&
                            <View style={{flex: 1, flexDirection: 'row', marginBottom: AppSizes.paddingSml, marginTop: AppSizes.paddingMed, paddingRight: AppSizes.paddingSml, width: pieDetails.pieRightWrapperWidth,}}>
                                <View
                                    style={{
                                        justifyContent: showDetails && specificSessionAsymmetryData && _.toInteger(specificSessionAsymmetryData.body_side) === 0 ? 'flex-end' : 'space-between',
                                    }}
                                >
                                    { (showDetails && specificSessionAsymmetryData) ?
                                        <View>
                                            {specificSessionAsymmetryData && specificSessionAsymmetryData.score.active ?
                                                <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(specificSessionAsymmetryData.score.color), fontSize: AppFonts.scaleFont(46),}}>
                                                    {specificSessionAsymmetryData.score.value}
                                                    <Text robotoRegular style={{color: AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(25),}}>
                                                        {' /100'}
                                                    </Text>
                                                </Text>
                                                :
                                                null
                                            }
                                            {specificSessionAsymmetryData.summary_text.active &&
                                                <ParsedText
                                                    parse={parsedSummaryTextData || []}
                                                    style={{...AppStyles.robotoRegular, color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18),}}
                                                >
                                                    {specificSessionAsymmetryData.summary_text.text}
                                                </ParsedText>
                                            }
                                            { specificSessionAsymmetryData.change.active &&
                                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start',}}>
                                                    <TabIcon
                                                        color={PlanLogic.returnInsightColorString(specificSessionAsymmetryData.change.color)}
                                                        containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                                                        icon={Platform.OS === 'ios' ?
                                                            specificSessionAsymmetryData.change.value >= 0 ? 'caretup' : 'caretdown'
                                                            :
                                                            specificSessionAsymmetryData.change.value >= 0 ? 'caret-up' : 'caret-down'
                                                        }
                                                        size={20}
                                                        type={Platform.OS === 'ios' ? 'antdesign' : 'font-awesome'}
                                                    />
                                                    <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(specificSessionAsymmetryData.change.color), fontSize: AppFonts.scaleFont(16),}}>
                                                        {`${specificSessionAsymmetryData.change.value || specificSessionAsymmetryData.change.value === 0 ? Math.abs(specificSessionAsymmetryData.change.value) : '--'} ${specificSessionAsymmetryData.change.text}`}
                                                    </Text>
                                                </View>
                                            }
                                        </View>
                                        :
                                        <View />
                                    }
                                    { specificSessionAsymmetryData && _.toInteger(specificSessionAsymmetryData.body_side) === 0 ?
                                        <View>
                                            <View style={{alignItems: 'center', flexDirection: 'row', marginVertical: AppSizes.paddingSml,}}>
                                                <View
                                                    style={{
                                                        backgroundColor: PlanLogic.returnInsightColorString(pieDetails && pieDetails.pieData && pieDetails.pieData.right_y_legend_color),
                                                        borderRadius:    (10 / 2),
                                                        height:          10,
                                                        marginRight:     AppSizes.paddingSml,
                                                        width:           10,
                                                    }}
                                                />
                                                <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>
                                                    {`${pieDetails && pieDetails.pieData && pieDetails.pieData.right_y_legend ? _.round(pieDetails.pieData.right_y_legend) : '0'}\u00B0 Left & Right ROM`}
                                                </Text>
                                            </View>
                                        </View>
                                        :
                                        <View>
                                            <View style={{alignItems: 'center', flexDirection: 'row', marginVertical: AppSizes.paddingSml,}}>
                                                <View
                                                    style={{
                                                        backgroundColor: PlanLogic.returnInsightColorString(pieDetails && pieDetails.pieData && pieDetails.pieData.left_y_legend_color),
                                                        borderRadius:    (10 / 2),
                                                        height:          10,
                                                        marginRight:     AppSizes.paddingSml,
                                                        width:           10,
                                                    }}
                                                />
                                                <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>
                                                    {`${pieDetails && pieDetails.pieData && pieDetails.pieData.left_y_legend ? _.round(pieDetails.pieData.left_y_legend) : '0'}\u00B0 Left ROM`}
                                                </Text>
                                            </View>
                                            <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                                <View
                                                    style={{
                                                        backgroundColor: PlanLogic.returnInsightColorString(pieDetails && pieDetails.pieData && pieDetails.pieData.right_y_legend_color),
                                                        borderRadius:    (10 / 2),
                                                        height:          10,
                                                        marginRight:     AppSizes.paddingSml,
                                                        width:           10,
                                                    }}
                                                />
                                                <Text robotoLight style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>
                                                    {`${pieDetails && pieDetails.pieData && pieDetails.pieData.right_y_legend ? _.round(pieDetails.pieData.right_y_legend) : '0'}\u00B0 Right ROM`}
                                                </Text>
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>
                        }
                    </View>
                }

            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default BiomechanicsCharts;
