/**
 * BiomechanicsSummary
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { BiomechanicsCharts, } from './graphs';
import { ParsedText, Spacer, TabIcon, Text, } from '../custom';
import { PlanLogic, } from '../../lib';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';

/*
  NOTE:
  steps:
    1- Pie Chart
    2- Rich Data
    3- Effects of Asymmetry
    4- Searching for Insights
*/

/* Component ==================================================================== */
const BiomechanicsSummary = ({ currentIndex, plan, step, title, }) => {
    let {
        leftPieInnerRadius,
        leftPieWidth,
        parsedData,
        pieData,
        pieLeftWrapperWidth,
        pieRightWrapperWidth,
        rightPieInnerRadius,
        rightPieWidth,
        selectedSession,
        sessionDuration,
        updatedChartData,
    } = PlanLogic.handleBiomechanicsAptRenderLogic(plan, currentIndex, step);
    return (
        <View style={{backgroundColor: AppColors.white, flex: 1,}}>

            <View style={{backgroundColor: AppColors.white, height: AppSizes.statusBarHeight,}} />

            <View style={{flex: 1,}}>

                <View>
                    <TabIcon
                        color={AppColors.zeplin.slateLight}
                        containerStyle={[{alignSelf: 'flex-start',}]}
                        icon={'chevron-left'}
                        onPress={() => Actions.pop()}
                        size={40}
                        type={'material-community'}
                    />
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{title}</Text>
                    <Spacer size={AppSizes.padding} />
                    { step === 1 ?
                        <BiomechanicsCharts
                            pieDetails={{
                                leftPieInnerRadius,
                                leftPieWidth,
                                pieData,
                                pieLeftWrapperWidth,
                                pieRightWrapperWidth,
                                rightPieInnerRadius,
                                rightPieWidth,
                            }}
                            selectedSession={selectedSession}
                        />
                        : step === 2 ?
                            <BiomechanicsCharts
                                chartData={updatedChartData}
                                isRichDataView={true}
                                sessionDuration={sessionDuration}
                                selectedSession={selectedSession}
                            />
                            : step === 3 ?
                                <View>
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../../../assets/images/standard/effectsasymmetry.png')}
                                        style={{alignSelf: 'center', height: 150, width: 150,}}
                                    />
                                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingMed,}}>
                                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginRight: AppSizes.padding,}}>
                                            <View
                                                style={{
                                                    backgroundColor: AppColors.zeplin.warningLight,
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{'Overactivity'}</Text>
                                        </View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginRight: AppSizes.padding,}}>
                                            <View
                                                style={{
                                                    backgroundColor: AppColors.zeplin.splashLight,
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{'Weakness'}</Text>
                                        </View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                            <View
                                                style={{
                                                    backgroundColor: AppColors.zeplin.splashXLight,
                                                    borderRadius:    (10 / 2),
                                                    height:          10,
                                                    marginRight:     AppSizes.paddingSml,
                                                    width:           10,
                                                }}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{'Elevated Strain'}</Text>
                                        </View>
                                    </View>
                                </View>
                                : step === 4 ?
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../../../assets/images/standard/research.png')}
                                        style={{alignSelf: 'center', height: 75, width: 75,}}
                                    />
                                    :
                                    null
                    }
                    <Spacer size={step === 1 ? 0 : AppSizes.padding} />
                </View>

                <ScrollView
                    style={[
                        AppStyles.scaleButtonShadowEffect,
                        {
                            backgroundColor:   AppColors.zeplin.superLight,
                            flex:              1,
                            paddingHorizontal: AppSizes.paddingLrg,
                        }
                    ]}
                >
                    <View style={{flex: 1, paddingVertical: AppSizes.padding,}}>
                        { step === 1 || step === 2 ?
                            <ParsedText
                                parse={parsedData}
                                style={[AppStyles.robotoLight, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18),},]}
                            >
                                {step === 1 ? selectedSession.asymmetry.apt.summary_take_away_text : selectedSession.asymmetry.apt.detail_text}
                            </ParsedText>
                            :
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18),}}>
                                { step === 3 ?
                                    'Chronic anterior pelvic asymmetry may correlate with imbalances in these muscle groups.'
                                    : step === 4 ?
                                        'We\'re searching for strength & length imbalances in your tissues to design your optimal recovery & prevention.'
                                        :
                                        null
                                }
                            </Text>
                        }
                        <Spacer size={AppSizes.padding} />
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                            { step === 1 ?
                                'How It\'s Measured:'
                                : step === 2 ?
                                    'Why this asymmetry matters:'
                                    : step === 3 ?
                                        'What this means:'
                                        : step === 4 ?
                                            'How to get Insights faster:'
                                            :
                                            null
                            }
                        </Text>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                            { step === 1 ?
                                'The range of anterior pelvic tilt is measured by the motion of your hips when you arch your lower back. We measure this range of motion while left foot is in contact with the ground and compare that to right foot ground contacts to identify asymmetry. We\'ll try to identify and correct the imbalances at the source to avoid the potential effects.\n\nFor best results, remember to consistently place your "hip sensor" in the center of your spine and on your sacrum, just above the tailbone.'
                                : step === 2 ?
                                    'Anterior pelvic motion asymmetry can be caused by uneven terrain or by imbalance in the lats, hip flexors, and a nearly a dozen other muscles.\n\nChronic asymmetry is likely driven by imbalances like over-activity, tightness, under-activity, and weakness in these muscles which can lead to skeletal misalignments. This has sweeping influence on other muscular structures affecting performance and increasing overuse injury risk.\n\nCombined with other movement data, training data, soreness, pain, and more we try to identify your body part imbalances and the best corrective exercise to efficiently address them.'
                                    : step === 3 ?
                                        'Chronic asymmetry in your anterior pelvic range of motion may hint at left-right imbalances in overactivity, weakness and tightness within a series of tissues which stabilize your hips. These imbalances typically place exess strain on other muscles, joints, and tissues in the manner pictured above.\n\nHowever, asymmetry in your anterior pelvic range of motion may be caused by environmental factors (like running on an uneven surface or trail) as well as biomechanical imbalances. So to help us to weed out your movement from your environment it\'s important to wear your system consistently in training.'
                                        : step === 4 ?
                                            'We use every data point you give us to build a map of your bodies strengths and weaknesses. This map is unique to you and is used to identify potential imbalances that actively adapt  your activity plan.\n\nUse your Fathom sensors in as many running workouts as you can and log your training and soreness as much as possible to optimize your plan\'s as effectiveness and efficiency.'
                                            :
                                            null
                            }
                        </Text>
                    </View>
                </ScrollView>

            </View>

        </View>
    );
};

BiomechanicsSummary.propTypes = {
    currentIndex: PropTypes.number.isRequired,
    plan:         PropTypes.object.isRequired,
    step:         PropTypes.number.isRequired,
    title:        PropTypes.string.isRequired,
};

BiomechanicsSummary.defaultProps = {};

BiomechanicsSummary.componentName = 'BiomechanicsSummary';

/* Export Component ================================================================== */
export default BiomechanicsSummary;