/**
 * Trends
 *
    <Trends
        clearPlanAlert={clearPlanAlert}
        plan={plan}
        updateUser={updateUser}
        user={user}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, } from '../../constants';
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { BiomechanicsCharts, InsightsCharts, } from './graphs';
import { AppUtil, PlanLogic, SensorLogic, } from '../../lib';
import { AnimatedCircularProgress, FathomModal, ParsedText, TabIcon, Text, } from '../custom';
// import { SVGImage, Spacer, } from '../custom';
import { ContactUsModal, } from '../general';
import { store } from '../../store';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';
import SlidingUpPanel from 'rn-sliding-up-panel';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    pillsWrapper: color => ({
        backgroundColor:   `${PlanLogic.returnInsightColorString(color)}${PlanLogic.returnHexOpacity(0.15)}`,
        borderRadius:      100,
        marginHorizontal:  AppSizes.paddingXSml,
        marginTop:         AppSizes.paddingSml,
        paddingHorizontal: AppSizes.paddingSml,
        paddingVertical:   AppSizes.paddingXSml,
    }),
    modalTouchable: {
        backgroundColor:   AppColors.white,
        elevation:         4,
        paddingHorizontal: AppSizes.paddingLrg,
        paddingVertical:   AppSizes.paddingLrg,
        shadowColor:       'rgba(0, 0, 0, 0.16)',
        shadowOffset:      { height: 3, width: 0, },
        shadowOpacity:     1,
        shadowRadius:      20,
    },
    cardContainer: {
        backgroundColor: AppColors.white,
        borderRadius:    12,
        elevation:       2,
        marginBottom:    AppSizes.padding,
        paddingVertical: AppSizes.padding,
    },
    cardTitle: {
        color:             AppColors.zeplin.slateLight,
        fontSize:          AppFonts.scaleFont(16),
        paddingHorizontal: AppSizes.padding,
    },
    lockedCardText: {
        color:             AppColors.white,
        fontSize:          AppFonts.scaleFont(15),
        paddingHorizontal: AppSizes.padding,
        textAlign:         'center',
    },
    lockedCardWrapper: {
        backgroundColor: `${AppColors.zeplin.slateLight}B3`,
        borderRadius:    6,
        bottom:          0,
        flex:            1,
        left:            0,
        paddingVertical: AppSizes.padding,
        position:        'absolute',
        right:           0,
        top:             0,
        width:           '100%',
    },
    sessionDataLineWrapper: (isFirst, isLast) => ({
        borderTopColor:    AppColors.zeplin.superLight,
        borderTopWidth:    2,
        marginTop:         isFirst ? AppSizes.padding : 0,
        paddingBottom:     isLast ? 0 : AppSizes.paddingXSml,
        paddingHorizontal: AppSizes.padding,
        paddingTop:        AppSizes.paddingXSml,
    }),
});

/* Component ==================================================================== */
const BiomechanicsSummary = ({ plan, session, toggleSlideUpPanel, }) => {
    console.log('session',session);
    const dataToDisplay = [
        {
            dataType: 0,
            index:    'apt',
        },
        {
            dataType: 2,
            index:    'hip_drop',
        },
        {
            dataType: 1,
            index:    'ankle_pitch',
        },
        {
            dataType: null,
            index:    'knee_valgus',
        },
        {
            dataType: null,
            index:    'hip_rotation',
        }
    ]; // needs to be in order
    return (
        <View
            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect, {paddingVertical: AppSizes.paddingLrg,}]}
        >

            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: AppSizes.padding,}}>
                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(24),}}>
                    {_.find(MyPlanConstants.teamSports, o => o.index === session.sport_name).label || ''}
                </Text>
                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11),}}>
                    {`${moment(session.event_date.replace('Z', '')).format('hh:mma')}, ${SensorLogic.convertMinutesToHrsMins(session.duration, true)}`}
                </Text>
            </View>

            { session.score.active &&
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: AppSizes.padding, }}>
                    <AnimatedCircularProgress
                        arcSweepAngle={320}
                        backgroundColor={AppColors.zeplin.superLight}
                        fill={session.score.value}
                        lineCap={'round'}
                        rotation={200}
                        size={AppSizes.screen.widthThird}
                        style={{marginRight: AppSizes.paddingSml, paddingHorizontal: AppSizes.paddingXSml, paddingVertical: AppSizes.paddingXSml,}}
                        tintColor={PlanLogic.returnInsightColorString(session.score.color)}
                        width={15}

                        childrenContainerStyle={{marginLeft: 5, marginTop: AppSizes.paddingXSml,}}
                    >
                        {
                            (fill) => (
                                <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(session.score.color), fontSize: AppFonts.scaleFont(30),}}>
                                    {`${session.score.value}%`}
                                </Text>
                            )
                        }
                    </AnimatedCircularProgress>
                    <View style={{alignSelf: 'flex-end', flex: 1, flexDirection: 'row',}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(20),}}>
                            {session.score.text}
                        </Text>
                        <TabIcon
                            color={AppColors.zeplin.slateLight}
                            containerStyle={[{justifyContent: 'flex-end',}]}
                            icon={'help-circle-outline'}
                            onPress={toggleSlideUpPanel}
                            size={20}
                            type={'material-community'}
                        />
                    </View>
                </View>
            }

            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                { _.map(session.summary_pills, (pill, i) =>
                    <View key={i} style={[styles.pillsWrapper(pill.color),]}>
                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(pill.color), fontSize: AppFonts.scaleFont(12),}}>
                            {pill.text}
                        </Text>
                    </View>
                )}
            </View>

            {/*for each item session.apt, session.hip_drop, session.ankle_pitch, session.knee_valgus, session.hip_rotation*/}
            { _.map(dataToDisplay, (data, i) => {
                const sessionData = session[data.index];
                console.log('sessionData',sessionData);
                let pieWrapperWidth = (AppSizes.screen.widthHalf);
                let pieLeftWrapperWidth = (pieWrapperWidth * 0.55);
                let pieRightWrapperWidth = (pieWrapperWidth * 0.45);
                let leftPieWidth = (pieLeftWrapperWidth - 35);
                let leftPieInnerRadius = ((leftPieWidth * 99) / 350);
                let rightPieWidth = pieLeftWrapperWidth;
                let rightPieInnerRadius = ((rightPieWidth * 125) / 400);
                let extraInnerRadiusToRemove = Platform.OS === 'ios' ? 0 : 20;
                rightPieInnerRadius = (rightPieInnerRadius - extraInnerRadiusToRemove);
                let pieData = sessionData.summary_data;
                if(sessionData.active && (data.dataType || data.dataType === 0)) {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.2}
                            key={i}
                            onPress={() => console.log(`hi from ${data.dataType}: ${data.index}`)} // AppUtil.pushToScene('biomechanics', {dataType: data.dataType,})
                            style={[styles.sessionDataLineWrapper(i === 0, (i + 1) === dataToDisplay.length),]}
                        >
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                                <View>
                                    <BiomechanicsCharts
                                        dataType={data.dataType}
                                        pieDetails={{
                                            leftPieInnerRadius,
                                            leftPieWidth,
                                            pieData,
                                            pieLeftWrapperWidth,
                                            pieRightWrapperWidth,
                                            rightPieInnerRadius,
                                            rightPieWidth,
                                        }}
                                        selectedSession={sessionData}
                                        showRightSideDetails={false}
                                        showDetails={false}
                                    />
                                </View>
                                <View>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(14),}}>
                                        {sessionData.dashboard_title}
                                    </Text>
                                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start',}}>
                                        { sessionData.score.active &&
                                            <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(sessionData.score.color), fontSize: AppFonts.scaleFont(25),}}>
                                                {`${sessionData.score.value}%`}
                                            </Text>
                                        }
                                        { sessionData.score.active &&
                                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginLeft: AppSizes.paddingSml,}}>
                                                <TabIcon
                                                    color={PlanLogic.returnInsightColorString(sessionData.change.color)}
                                                    containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                                                    icon={sessionData.change.value && sessionData.change.value > 0 ? 'arrow-top-right' : 'arrow-bottom-right'}
                                                    size={15}
                                                    type={'material-community'}
                                                />
                                                <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(sessionData.change.color), fontSize: AppFonts.scaleFont(12),}}>
                                                    {`${sessionData.change.value || sessionData.change.value === 0 ? sessionData.change.value : '--'} ${sessionData.change.text}`}
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                                <TabIcon
                                    color={AppColors.zeplin.slateXLight}
                                    containerStyle={[{alignItems: 'flex-end', justifyContent: 'center',}]}
                                    icon={'arrow-right'}
                                    size={20}
                                    type={'simple-line-icon'}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                }
                return null;
            })}

        </View>
    );
}

class Trends extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isCoachModalOpen: false,
            isContactUsOpen:  false,
        };
        this._carousel = {};
        this._panel = {};
        this._timer = null;
    }

    componentDidMount = () => {
        const { user, } = this.props;
        if(!user.first_time_experience.includes('trends_coach')) {
            this._timer = _.delay(() => this.setState({ isCoachModalOpen: true, }), 1000);
        }
    }

    componentWillUnmount = () => {
        // clear timers
        clearInterval(this._timer);
    }

    _handleUpdateFirstTimeExperience = (value, callback) => {
        const { updateUser, user, } = this.props;
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.first_time_experience = [value];
        let newUserObj = _.cloneDeep(user);
        newUserObj.first_time_experience.push(value);
        // update reducer as API might take too long to return a value
        store.dispatch({
            type: DispatchActions.USER_REPLACE,
            data: newUserObj
        });
        // update user object
        updateUser(newUserPayloadObj, user.id)
            .then(res => {
                if(callback) {
                    callback();
                }
            });
    }

    _toggleContactUsWebView = () => this.setState({ isContactUsOpen: !this.state.isContactUsOpen, })

    render = () => {
        const { isCoachModalOpen, isContactUsOpen, } = this.state;
        const { plan, } = this.props;
        let {
            biomechanicsSummary,
            bodyResponse,
            bodyResponseIcon,
            bodyResponseIconType,
            bodyResponseImageSource,
            bodyResponseSportName,
            bodyResponseSubtitleColor,
            currentBodyResponseAlertText,
            currentWorkloadAlertText,
            isBodyResponseLocked,
            isWorkloadLocked,
            parsedSummaryTextData,
            recoveryQuality,
            workload,
            workloadIcon,
            workloadIconType,
            workloadImageSource,
            workloadSportName,
            workloadSubtitleColor,
        } = PlanLogic.handleTrendsRenderLogic(plan);
        console.log('biomechanicsSummary',biomechanicsSummary);
        return (
            <View style={{flex: 1,}}>

                <ScrollView
                    nestedScrollEnabled={true}
                    style={{backgroundColor: AppColors.white, flex: 1,}}
                >

                    <View style={{backgroundColor: AppColors.zeplin.superLight, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.statusBarHeight > 0 ? AppSizes.statusBarHeight : AppSizes.paddingLrg,}}>
                        <View style={{flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center',}}>
                            <View style={{flex: 1, justifyContent: 'center',}} />
                            <Image
                                source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                                style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
                            />
                            <View style={{flex: 1, justifyContent: 'center', paddingRight: AppSizes.paddingSml,}} />
                        </View>
                        { recoveryQuality.active &&
                            <View style={{flex: 1,}}>
                                { recoveryQuality.change.active &&
                                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end',}}>
                                        <TabIcon
                                            color={PlanLogic.returnInsightColorString(recoveryQuality.change.color)}
                                            containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                                            icon={recoveryQuality.change.value && recoveryQuality.change.value > 0 ? 'arrow-top-right' : 'arrow-bottom-right'}
                                            size={15}
                                            type={'material-community'}
                                        />
                                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(recoveryQuality.change.color), fontSize: AppFonts.scaleFont(12),}}>
                                            {`${recoveryQuality.change.value || recoveryQuality.change.value === 0 ? recoveryQuality.change.value : '--'} ${recoveryQuality.change.text}`}
                                        </Text>
                                    </View>
                                }
                                { recoveryQuality.score.active &&
                                    <View>
                                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(recoveryQuality.score.color), fontSize: AppFonts.scaleFont(61),}}>
                                            {recoveryQuality.score.value || recoveryQuality.score.value === 0 ? recoveryQuality.score.value : '--'}
                                            <Text robotoRegular style={{color: AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(20),}}>
                                                {'/100'}
                                            </Text>
                                        </Text>
                                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(recoveryQuality.score.color), fontSize: AppFonts.scaleFont(15),}}>
                                            {recoveryQuality.score.text}
                                        </Text>
                                    </View>
                                }
                                { recoveryQuality.summary_text.active &&
                                    <View style={{marginTop: AppSizes.paddingMed,}}>
                                        { (recoveryQuality.summary_text.text && recoveryQuality.summary_text.text.length > 0) &&
                                            <ParsedText
                                                parse={parsedSummaryTextData || []}
                                                style={{...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18),}}
                                            >
                                                {recoveryQuality.summary_text.text}
                                            </ParsedText>
                                        }
                                        {_.map(recoveryQuality.summary_text.text_items, (text, i) => {
                                            let parsedTextItemsData = _.map(recoveryQuality.summary_text.text_items.bold_text, (prop, key) => {
                                                let newParsedData = {};
                                                newParsedData.pattern = new RegExp(prop.text, 'i');
                                                newParsedData.style = [AppStyles.robotoBold];
                                                return newParsedData;
                                            });
                                            return (
                                                <ParsedText
                                                    key={i}
                                                    parse={parsedTextItemsData || []}
                                                    style={{...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18),}}
                                                >
                                                    {`\u2022 ${text.text}`}
                                                </ParsedText>
                                            );
                                        })}
                                    </View>
                                }
                            </View>
                        }
                    </View>

                    <View style={{paddingHorizontal: AppSizes.paddingMed, paddingTop: AppSizes.padding,}}>

                        { biomechanicsSummary.active &&
                            _.map(biomechanicsSummary.sessions, (session, i) =>
                                <BiomechanicsSummary
                                    key={i}
                                    plan={plan}
                                    session={session}
                                    toggleSlideUpPanel={() => this._panel.show()}
                                />
                            )
                        }

                        <TouchableOpacity
                            activeOpacity={isWorkloadLocked ? 1 : 0.2}
                            onPress={isWorkloadLocked ? () => {} : () => AppUtil.pushToScene('insight', { insightType: 8, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isWorkloadLocked &&
                                <Text robotoRegular style={[styles.cardTitle,]}>{'Workouts'}</Text>
                            }
                            <InsightsCharts
                                currentAlert={workload}
                                data={workload.data}
                                showSelection={false}
                            />
                            { isWorkloadLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text robotoRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'Workouts'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'No Workout data yet.\nKeep logging symptoms for insight into how your body responds to training.'}</Text>
                                    </View>
                                </View>
                            }
                            { currentWorkloadAlertText &&
                                <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginHorizontal: AppSizes.paddingSml, marginTop: AppSizes.paddingSml,}}>
                                    <View style={{alignSelf: 'flex-start', alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.paddingMed,}}>
                                        { workloadIcon ?
                                            <TabIcon
                                                color={workloadSubtitleColor}
                                                containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                                icon={workloadIcon}
                                                size={20}
                                                type={workloadIconType}
                                            />
                                            : workloadSportName ?
                                                <Image
                                                    source={workloadImageSource}
                                                    style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: workloadSubtitleColor, width: 20,}}
                                                />
                                                :
                                                null
                                        }
                                        {currentWorkloadAlertText}
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={isBodyResponseLocked ? 1 : 0.2}
                            onPress={isBodyResponseLocked ? () => {} : () => AppUtil.pushToScene('insight', { insightType: 7, })}
                            style={[styles.cardContainer, AppStyles.scaleButtonShadowEffect,]}
                        >
                            { !isBodyResponseLocked &&
                                <Text robotoRegular style={[styles.cardTitle,]}>{'Pain & Soreness'}</Text>
                            }
                            <InsightsCharts
                                currentAlert={bodyResponse}
                                data={bodyResponse.data}
                                showSelection={false}
                            />
                            { isBodyResponseLocked &&
                                <View style={[styles.lockedCardWrapper,]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text robotoRegular style={[styles.cardTitle, {color: AppColors.white,}]}>{'Pain & Soreness'}</Text>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'lock'}
                                            iconStyle={[{shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1,}]}
                                            size={40}
                                        />
                                    </View>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                                        <Text robotoRegular style={[styles.lockedCardText,]}>{'No Body Response data yet.\nKeep logging symptoms for insight into how your body responds to training.'}</Text>
                                    </View>
                                </View>
                            }
                            { currentBodyResponseAlertText &&
                                <View style={{borderTopColor: AppColors.zeplin.superLight, borderTopWidth: 1, marginTop: AppSizes.paddingSml,}}>
                                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingSml, paddingTop: AppSizes.paddingMed,}}>
                                        { bodyResponseIcon ?
                                            <TabIcon
                                                color={bodyResponseSubtitleColor}
                                                containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                                icon={bodyResponseIcon}
                                                size={20}
                                                type={bodyResponseIconType}
                                            />
                                            : bodyResponseSportName ?
                                                <Image
                                                    source={bodyResponseImageSource}
                                                    style={{height: 20, marginRight: AppSizes.paddingSml, tintColor: bodyResponseSubtitleColor, width: 20,}}
                                                />
                                                :
                                                null
                                        }
                                        {currentBodyResponseAlertText}
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>

                    </View>

                </ScrollView>

                <FathomModal
                    hasBackdrop={false}
                    isVisible={isCoachModalOpen}
                >
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end',}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.setState({ isCoachModalOpen: false, } , () => this._handleUpdateFirstTimeExperience('trends_coach'))}
                            style={[styles.modalTouchable,]}
                        >
                            <Text robotoMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), marginBottom: AppSizes.paddingSml,}}>
                                {'Welcome to your Trends'}
                            </Text>
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginBottom: AppSizes.padding,}}>
                                {'Here, you\'ll find your data & any meaningful trends & insights that our AI system finds!'}
                            </Text>
                            <Text robotoMedium style={{alignSelf: 'flex-end', color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(22),}}>
                                {'GOT IT'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </FathomModal>

                <ContactUsModal
                    handleModalToggle={this._toggleContactUsWebView}
                    isModalOpen={isContactUsOpen}
                />

                <SlidingUpPanel
                    allowDragging={false}
                    backdropOpacity={0.8}
                    ref={ref => {this._panel = ref;}}
                >
                    <View style={{flex: 1, flexDirection: 'column',}}>
                        <View style={{flex: 1,}} />
                        <View style={{backgroundColor: AppColors.white,}}>
                            <View style={{backgroundColor: AppColors.primary.white.hundredPercent, flexDirection: 'row', padding: AppSizes.padding,}}>
                                <Text robotoMedium style={{color: AppColors.zeplin.slate, flex: 9, fontSize: AppFonts.scaleFont(22),}}>
                                    {'Movement Efficiency Score'}
                                </Text>
                                <TabIcon
                                    containerStyle={[{flex: 1,}]}
                                    icon={'close'}
                                    iconStyle={[{color: AppColors.black}]}
                                    onPress={() => this._panel.hide()}
                                    reverse={false}
                                    size={30}
                                    type={'material-community'}
                                />
                            </View>
                            <View style={{padding: AppSizes.paddingLrg,}}>
                                <Text robotobol style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginBottom: AppSizes.padding,}}>
                                    {'What is my Movement Efficiency Score?'}
                                </Text>
                                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                                    {'Functional efficiency is the ability of the neuromuscular system to recruit correct muscle synergies, at the right time, with the appropriate amount of force to perform functional tasks with the least amount of energy and stress on the HMS. This helps prevent overtraining and the development of movement impairment syndromes.'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </SlidingUpPanel>

            </View>
        );
    }
}

Trends.propTypes = {
    clearPlanAlert: PropTypes.func.isRequired,
    plan:           PropTypes.object.isRequired,
    updateUser:     PropTypes.func.isRequired,
    user:           PropTypes.object.isRequired,
};

Trends.defaultProps = {};

Trends.componentName = 'Trends';

/* Export Component ================================================================== */
export default Trends;
