/**
 * Body Modality
 *
    <BodyModality
        handleBodyPartClick={handleBodyPartClick}
        markStartedRecovery={markStartedRecovery}
        modality={modality}
        patchBodyActiveRecovery={patchBodyActiveRecovery}
        plan={plan}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, Platform, ScrollView, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, } from '../../constants';
import { Button, SVGImage, Spacer, TabIcon, Text, } from '../custom';
import { AppUtil, PlanLogic, } from '../../lib';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import Collapsible from 'react-native-collapsible';
import LinearGradient from 'react-native-linear-gradient';
import SlidingUpPanel from 'rn-sliding-up-panel';

/* Component ==================================================================== */
class BodyModality extends Component {
    constructor(props) {
        super(props);
        let dailyPlanObj = props.plan ? props.plan.dailyPlan[0] : false;
        const { time, } = PlanLogic.handleBodyModalityRenderLogic(dailyPlanObj, props.modality);
        this.state = {
            countdownTime:    (time * 60),
            isCompleted:      false,
            isPaused:         false,
            isStarted:        false,
            isSubmitting:     false,
            showInstructions: true,
        };
        this._animatedValue = new Animated.Value(0);
        this._panel = {};
        this._scrollToBottomTimer = null;
        this._scrollViewRef = {};
        this._timer = null;
    }

    componentWillUnmount = () => {
        // clear timers
        clearInterval(this._timer);
        clearInterval(this._scrollToBottomTimer);
    }

    _completeBodyPartModality = () => {
        const { modality, patchBodyActiveRecovery, plan, user, } = this.props;
        let updatedModality = modality === 'cwi' ? 'cold_water_immersion' : modality;
        let completedBodyParts = [];
        if(updatedModality === 'heat' || updatedModality === 'ice') {
            let newBodyParts = _.cloneDeep(plan.dailyPlan[0][updatedModality].body_parts);
            completedBodyParts = _.filter(newBodyParts, ['active', true]);
        }
        this.setState(
            { isSubmitting: true, },
            () => patchBodyActiveRecovery(completedBodyParts, updatedModality, user.id)
                .then(res => Actions.pop())
                .catch(() => this.setState({isSubmitting: false,}, () => AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery)))
        );
    }

    _hideSlideUpPanel = () => this._panel.hide()

    _pauseTimer = () => {
        this.setState(
            { isPaused: true, isStarted: false, },
            () => clearInterval(this._timer),
        );
    }

    _scrollToBottom = () => this._scrollViewRef.scrollToEnd({ animated: true, })

    _showSlideUpPanel = () => this._panel.show()

    _toggleInstructions = () => {
        this.setState(
            { showInstructions: !this.state.showInstructions, },
            () => {
                Animated.timing(this._animatedValue, {
                    duration: 300,
                    toValue:  this.state.showInstructions ? 0 : 1,
                }).start();
            }
        );
    }

    _toggleTimer = time => {
        const { modality, markStartedRecovery, user, } = this.props;
        let updatedModality = modality === 'cwi' ? 'cold_water_immersion' : modality;
        markStartedRecovery(updatedModality, user.id);
        this.setState(
            { showInstructions: false, },
            () => {
                Animated.timing(this._animatedValue, {
                    duration: 300,
                    toValue:  1,
                }).start();
                let newTime = this.state.isCompleted ? (time * 60) : this.state.countdownTime;
                this.setState(
                    { countdownTime: newTime, isCompleted: false, isPaused: false, isStarted: true, },
                    () => {
                        this._timer = setInterval(this._updateTimer, 1000);
                        this._scrollToBottomTimer = _.delay(() => this._scrollToBottom(), 500);
                    }
                );
            }
        );
    }

    _secondsToTime = timeInSeconds => {
        let pad = (num, size) => ('000' + num).slice(size * -1);
        let time = parseFloat(timeInSeconds).toFixed(3);
        // let hours = _.floor(time / 60 / 60);
        let minutes = _.floor(time / 60) % 60;
        let seconds = _.floor(time - minutes * 60);
        // let milliseconds = time.slice(-3);
        return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
        // return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(milliseconds, 3)}`;
    }

    _updateTimer = () => {
        if(this.state.countdownTime === 0) {
            this._pauseTimer();
            this.setState({ isCompleted: true, isPaused: false, isStarted: false, });
        } else {
            this.setState({ countdownTime: (this.state.countdownTime - 1), });
        }
    }

    render = () => {
        const { countdownTime, isCompleted, isPaused, isStarted, isSubmitting, showInstructions, } = this.state;
        let { handleBodyPartClick, modality, plan, } = this.props;
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        const {
            equipmentRequired,
            extraTimeText,
            imageId,
            imageSource,
            pageSubtitle,
            pageText,
            pageTitle,
            recoveryObj,
            sceneId,
            textId,
            time,
        } = PlanLogic.handleBodyModalityRenderLogic(dailyPlanObj, modality);
        const interpolateRotation = this._animatedValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '180deg'],
        });
        const animatedStyle = {transform: [{rotate: interpolateRotation,}]};
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>
                <View style={{flex: 1,}}>
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        bounces={false}
                        contentContainerStyle={{flexGrow: 1,}}
                        nestedScrollEnabled={true}
                        ref={ref => {this._scrollViewRef = ref;}}
                    >
                        <View style={{height: AppSizes.screen.heightTwoThirds,}}>
                            <View style={{flex: 1,}}>
                                <Image
                                    resizeMode={'cover'}
                                    source={imageSource}
                                    style={[{height: (AppSizes.screen.heightTwoThirds - AppSizes.paddingXLrg), width: AppSizes.screen.width,}, StyleSheet.absoluteFill,]}
                                />
                                <LinearGradient
                                    colors={['rgba(112, 190, 199, 0.8)', 'rgba(112, 190, 199, 0.8)']}
                                    end={{x: 1, y: 0}}
                                    start={{x: 0, y: 0}}
                                    style={[{alignItems: 'center', flex: 1, justifyContent: 'center',}]}
                                >
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => Actions.pop()}
                                        style={{position: 'absolute', top: 0, left: 0, marginTop: AppSizes.statusBarHeight, padding: AppSizes.padding,}}
                                    >
                                        <TabIcon
                                            color={AppColors.white}
                                            icon={'chevron-left'}
                                            onPress={() => Actions.pop()}
                                            size={AppFonts.scaleFont(40)}
                                            type={'material-community'}
                                        />
                                    </TouchableOpacity>
                                    <Text oswaldRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(35), paddingTop: AppSizes.paddingSml,}}>
                                        {pageTitle}
                                    </Text>
                                    <Text robotoRegular style={{color: AppColors.zeplin.superLight, fontSize: AppFonts.scaleFont(13), marginBottom: AppSizes.paddingLrg,}}>{pageSubtitle}</Text>
                                    <View style={[Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.white, borderRadius: 12, marginHorizontal: AppSizes.paddingLrg, padding: AppSizes.paddingMed,}]}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>{pageText}</Text>
                                    </View>
                                    <Spacer size={AppSizes.padding} />
                                    <View style={{flexDirection: 'row',}}>
                                        <TabIcon
                                            color={AppColors.white}
                                            containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                            icon={'clock-outline'}
                                            size={AppFonts.scaleFont(20)}
                                            type={'material-community'}
                                        />
                                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}>
                                            {`${time} minutes`}
                                            { extraTimeText &&
                                                <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}>{` ${extraTimeText}`}</Text>
                                            }
                                        </Text>
                                    </View>
                                    <Spacer size={AppSizes.padding} />
                                    <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'Equipment:'}</Text>
                                    <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{equipmentRequired}</Text>
                                </LinearGradient>
                            </View>
                            <Button
                                background={Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback.Ripple('transparent', false) : null}
                                buttonStyle={StyleSheet.flatten([Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.zeplin.yellow, borderRadius: (AppSizes.paddingXLrg), flexDirection: isCompleted ? 'column' : 'row', height: (AppSizes.paddingXLrg * 2), position: 'relative', top: -AppSizes.paddingXLrg, width: (AppSizes.paddingXLrg * 2),}])}
                                containerStyle={{alignItems: 'center', height: AppSizes.paddingXLrg, overflow: 'visible',}}
                                icon={isCompleted ? {
                                    color: AppColors.white,
                                    name:  'restore-clock',
                                    size:  30,
                                    type:  'material-community',
                                } : null}
                                onPress={() => !isStarted ? this._toggleTimer(time) : this._pauseTimer()}
                                title={isCompleted ? 'Repeat?' : (isStarted || isPaused) && countdownTime >= 0 ? this._secondsToTime(countdownTime) : 'Start\ntimer'}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), opacity: isPaused ? 0.5 : 1,}}
                            />
                        </View>
                        <View>
                            <View style={{paddingBottom: AppSizes.paddingLrg, paddingTop: AppSizes.padding,}}>
                                { recoveryObj && recoveryObj.body_parts &&
                                    <View>
                                        <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}>{'Recommended Body Parts'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{`Tap on body parts you do not plan to ${modality}.`}</Text>
                                        </View>
                                        <View style={[AppStyles.row, {flexWrap: 'wrap', paddingHorizontal: (AppSizes.paddingLrg - AppSizes.paddingSml),}]}>
                                            {_.map(recoveryObj.body_parts, (body, index) => {
                                                let bodyPart = PlanLogic.handleBodyModalityBodyPart(body);
                                                let containerWidth = (AppSizes.screen.width - ((AppSizes.paddingLrg - AppSizes.paddingSml) * 2));
                                                let iconHeightWidth = _.round( ((containerWidth - (AppSizes.paddingSml * 4)) / 3) );
                                                return(
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        key={`body_part-${index}`}
                                                        onPress={() => {
                                                            this.setState(
                                                                { isAllGood: false, },
                                                                () => handleBodyPartClick(dailyPlanObj, body.body_part_location, body.side, modality === 'cwi' ? 'cold_water_immersion' : modality),
                                                            );
                                                        }}
                                                        style={[
                                                            index % 3 === 2 ?
                                                                {paddingLeft: AppSizes.paddingSml,}
                                                                : index % 3 === 0 ?
                                                                    {paddingRight: AppSizes.paddingSml,}
                                                                    :
                                                                    {paddingHorizontal: AppSizes.paddingSml,},
                                                            {paddingVertical: AppSizes.paddingSml,}
                                                        ]}
                                                    >
                                                        <SVGImage
                                                            firstTimeExperience={['all_good_body_part_tooltip']}
                                                            image={bodyPart.bodyImage}
                                                            overlay={true}
                                                            overlayText={bodyPart.mainBodyPartName}
                                                            selected={bodyPart.isSelected}
                                                            style={{height: iconHeightWidth, width: iconHeightWidth,}}
                                                        />
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </View>
                                }
                                <View style={[Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.white, borderRadius: 12, marginHorizontal: AppSizes.paddingLrg, marginTop: AppSizes.padding, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed,}]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18),}}>{`HOW-TO ${modality === 'cwi' ? 'CWB' : _.upperCase(modality)} EFFECTIVELY`}</Text>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => this._toggleInstructions()}
                                            style={{alignItems: 'center', flexDirection: 'row',}}
                                        >
                                            <Text robotoBold style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(12), paddingRight: AppSizes.paddingXSml,}}>{showInstructions ? 'Hide' : 'Show'}</Text>
                                            <Animated.View style={[animatedStyle,]}>
                                                <TabIcon
                                                    color={AppColors.zeplin.yellow}
                                                    icon={'chevron-up'}
                                                    size={20}
                                                    type={'material-community'}
                                                />
                                            </Animated.View>
                                        </TouchableOpacity>
                                    </View>
                                    <Collapsible collapsed={!showInstructions} style={{paddingTop: AppSizes.padding,}}>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingXSml,}}>
                                            <View style={{backgroundColor: AppColors.zeplin.slate, borderRadius: (AppSizes.paddingSml / 2), height: AppSizes.paddingSml, marginRight: AppSizes.padding, width: AppSizes.paddingSml,}} />
                                            <Text oswaldMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16),}}>{'PREP'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',}}>
                                            <View style={{borderRightColor: AppColors.zeplin.slateXLight, borderRightWidth: 1, marginRight: (AppSizes.paddingSml / 2), width: (AppSizes.paddingSml / 2),}} />
                                            <View style={{flex: 1, marginLeft: AppSizes.padding, paddingVertical: AppSizes.paddingXSml,}}>
                                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>
                                                    { modality === 'heat' ?
                                                        'Prepare a heating pad, hot water bottle, or wet towel to be moderately hot.'
                                                        : modality === 'ice' ?
                                                            'Prepare an ice pack'
                                                            :
                                                            'Fill a tub with cold tap water (no ice) high enough to submerge your legs'
                                                    }
                                                </Text>
                                                <Spacer size={AppSizes.paddingXSml} />
                                                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>
                                                    { modality === 'heat' ?
                                                        'TIP: Dampen a bath towel, wring out excess water, & heat in the microwave for 10-15 seconds.'
                                                        : modality === 'ice' ?
                                                            'TIP: You can use ice cubes in a plastic bag or a bag of frozen peas.'
                                                            :
                                                            'TIP: Research shows 50-60\u00B0F is most effective to flush waste and reduce inflammation, which matches the coldest setting on most house-hold tubs.'
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingXSml, marginTop: AppSizes.paddingSml,}}>
                                            <View style={{backgroundColor: AppColors.zeplin.slate, borderRadius: (AppSizes.paddingSml / 2), height: AppSizes.paddingSml, marginRight: AppSizes.padding, width: AppSizes.paddingSml,}} />
                                            <Text oswaldMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16),}}>{modality === 'cwi' ? 'SUBMERGE' : 'PLACE'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',}}>
                                            <View style={{borderRightColor: AppColors.zeplin.slateXLight, borderRightWidth: 1, marginRight: (AppSizes.paddingSml / 2), width: (AppSizes.paddingSml / 2),}} />
                                            <View style={{flex: 1, marginLeft: AppSizes.padding, paddingVertical: AppSizes.paddingXSml,}}>
                                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>
                                                    { modality === 'heat' ?
                                                        'Position the heat to cover the entire muscle or joint.'
                                                        : modality === 'ice' ?
                                                            'Position the ice to cover the entire muscle or joint.'
                                                            :
                                                            'Completely submerge your lower body, no higher than the top of you hips'
                                                    }
                                                </Text>
                                                <Spacer size={AppSizes.paddingXSml} />
                                                { (modality === 'heat' || modality === 'ice') &&
                                                    <View style={{flexDirection: 'row', marginTop: AppSizes.paddingXSml,}}>
                                                        <TabIcon
                                                            color={AppColors.zeplin.error}
                                                            icon={'alert-circle'}
                                                            size={AppFonts.scaleFont(15)}
                                                            type={'material-community'}
                                                        />
                                                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), marginLeft: AppSizes.paddingXSml,}}>
                                                            { modality === 'heat' ?
                                                                'Do not place heat on swollen or bruised areas.'
                                                                :
                                                                'Keep the pack moving to avoid ice burns.'
                                                            }
                                                        </Text>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingXSml, marginTop: AppSizes.paddingSml,}}>
                                            <View style={{backgroundColor: AppColors.zeplin.slate, borderRadius: (AppSizes.paddingSml / 2), height: AppSizes.paddingSml, marginRight: AppSizes.padding, width: AppSizes.paddingSml,}} />
                                            <Text oswaldMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16),}}>{'REST'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',}}>
                                            <View style={{marginRight: (AppSizes.paddingSml / 2), width: (AppSizes.paddingSml / 2),}} />
                                            <View style={{flex: 1, marginLeft: AppSizes.padding, paddingVertical: AppSizes.paddingXSml,}}>
                                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>
                                                    { modality === 'heat' || modality === 'ice' ?
                                                        `Set a timer for ${time} minutes and wait.`
                                                        :
                                                        'Set a timer for 11–15 min and wait.'
                                                    }
                                                </Text>
                                                <Spacer size={AppSizes.paddingXSml} />
                                                { (modality === 'heat' || modality === 'ice') &&
                                                    <View style={{flexDirection: 'row', marginTop: AppSizes.paddingXSml,}}>
                                                        <TabIcon
                                                            color={AppColors.zeplin.error}
                                                            icon={'alert-circle'}
                                                            size={AppFonts.scaleFont(15)}
                                                            type={'material-community'}
                                                        />
                                                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), marginLeft: AppSizes.paddingXSml,}}>
                                                            { modality === 'heat' ?
                                                                'When using heat, be very careful to use moderate heat for a limited time to avoid burns.'
                                                                : modality === 'ice' ?
                                                                    'Never treat a body part with ice for more than 25 minutes, and remove the pack if your skin becomes bright pink or red.'
                                                                    :
                                                                    null
                                                            }
                                                        </Text>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                        { (modality === 'heat' || modality === 'ice') &&
                                            <Text onPress={() => this._showSlideUpPanel()} robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(13), paddingTop: AppSizes.padding, textAlign: 'center',}}>
                                                {'Additional precautions'}
                                            </Text>
                                        }
                                    </Collapsible>
                                </View>
                            </View>
                            { modality === 'cwi' &&
                                <Text onPress={() => this._showSlideUpPanel()} robotoRegular style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(13), paddingBottom: AppSizes.paddingLrg, textAlign: 'center',}}>
                                    {'See the science'}
                                </Text>
                            }
                        </View>
                        <Button
                            buttonStyle={StyleSheet.flatten([AppStyles.buttonVerticalPadding, {backgroundColor: AppColors.zeplin.yellow, borderRadius: 0,}])}
                            containerStyle={{flex: 1, justifyContent: 'flex-end',}}
                            disabled={isSubmitting}
                            disabledStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                            disabledTitleStyle={{color: AppColors.white,}}
                            loading={isSubmitting}
                            onPress={() => this._completeBodyPartModality()}
                            title={`Complete ${_.chain(pageTitle).toLower().startCase()}`}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                        />
                    </ScrollView>
                    <SlidingUpPanel
                        allowDragging={false}
                        ref={ref => {this._panel = ref;}}
                        showBackdrop={false}
                    >
                        <View style={{flex: 1, flexDirection: 'column',}}>
                            <View style={{backgroundColor: AppColors.zeplin.navy, flex: 1, opacity: 0.8,}} />
                            <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.superLight, flexDirection: 'row', justifyContent: 'space-between', paddingRight: AppSizes.paddingMed, paddingVertical: AppSizes.paddingSml,}}>
                                <Text oswaldMedium style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), paddingLeft: AppSizes.paddingLrg, }}>{modality === 'cwi' ? 'THE SCIENCE OF CWB' : `${_.toUpper(pageTitle)}${modality === 'heat' ? 'ING' : ''} PRECAUTIONS`}</Text>
                                <TabIcon
                                    color={AppColors.zeplin.slate}
                                    icon={'close'}
                                    onPress={() => this._hideSlideUpPanel()}
                                    size={30}
                                    type={'material-community'}
                                />
                            </View>
                            { modality === 'heat' ?
                                <View style={{backgroundColor: AppColors.white, padding: AppSizes.paddingLrg,}}>
                                    <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Do not use heat treatments after activity.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Do not use heat after an acute injury.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingLrg,}}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Never use heat where swelling is involved because swelling is caused by bleeding in the tissue, and heat just draws more blood to the area.'}</Text>
                                    </View>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), paddingBottom: AppSizes.paddingSml,}}>{'Don\'t use cold or heat packs:'}</Text>
                                    <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Over areas of skin that are in poor condition.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Over areas of skin with poor sensation to heat or cold.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Over areas of the body with known poor circulation.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'if you have diabetes.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingLrg,}}>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'in the presence of infection.'}</Text>
                                    </View>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), paddingBottom: AppSizes.paddingSml,}}>
                                        {'If you have questions regarding the proper treatment of an injury, call the '}
                                        <Text robotoBold>{'doctors'}</Text>
                                        {' or '}
                                        <Text robotoBold>{'physical therapists'}</Text>
                                        {' at your local medical center.'}
                                    </Text>
                                </View>
                                : modality === 'ice' ?
                                    <View style={{backgroundColor: AppColors.white, padding: AppSizes.paddingLrg,}}>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Never place ice directly on an injury'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Keep the ice pack moving to avoid ice burns '}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Never treat with ice for more than 25 minutes, and remove the pack immediately if the injury appears bright pink or red'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingLrg,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Don\'t use ice packs on the left shoulder if you have a heart condition, and don\'t use ice packs around the front or side of the neck.'}</Text>
                                        </View>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), paddingBottom: AppSizes.paddingSml,}}>{'Don\'t use cold or heat packs:'}</Text>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Over areas of skin that are in poor condition.'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Over areas of skin with poor sensation to heat or cold.'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'Over areas of the body with known poor circulation.'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'if you have diabetes.'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingLrg,}}>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{'\u2022'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingXSml,}}>{'in the presence of infection.'}</Text>
                                        </View>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), paddingBottom: AppSizes.paddingSml,}}>
                                            {'If you have questions regarding the proper treatment of an injury, call the '}
                                            <Text robotoBold>{'doctors'}</Text>
                                            {' or '}
                                            <Text robotoBold>{'physical therapists'}</Text>
                                            {' at your local medical center.'}
                                        </Text>
                                    </View>
                                    :
                                    <View style={{backgroundColor: AppColors.white, flex: 1, padding: AppSizes.paddingLrg,}}>
                                        <ScrollView>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), paddingBottom: AppSizes.paddingLrg,}}>
                                                {'A meta-analysis (Dupuy, 2018) evaluated the impact of recovery techniques on delayed onset muscle soreness (DOMS), perceived fatigue, muscle damage, and inflammatory markers after physical exercise. The effect of cold water immersion (CWB) on DOMS and perceived fatigue was significant.'}
                                            </Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), paddingBottom: AppSizes.paddingLrg,}}>
                                                {'An exposure of 11–15\u00B0C over 11–15 min was considered to be the optimal circumstance to obtain a positive impact of CWB after exercise to reduce DOMS (Machado et al., 2016).'}
                                            </Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), paddingBottom: AppSizes.paddingLrg,}}>
                                                {'A common explanation of the impact of CWB on DOMS and fatigue is a reduction in exercise-induced inflammation and muscle damage. Hydrostatic pressure may facilitate the transport of fluids from the muscle to the blood and therefore eliminate metabolites (Wilcock et al., 2006a,b; Leeder et al., 2012).'}
                                            </Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), paddingBottom: AppSizes.paddingLrg,}}>
                                                {'Vasoconstriction due to cold temperature may also reduce fluid diffusion into the interstitial space (Eston and Peters, 1999) and locally diminish the inflammatory reaction (Coté et al., 1988), which in turn may reduce the feeling of pain (Smith, 1991).'}
                                            </Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                                                {'Cold alone has also a direct analgesic impact (Leppäluoto et al., 2008). — relieve pain Citation: Dupuy O, Douzi W, Theurot D, Bosquet L and Dugué B (2018) An Evidence-Based Approach for Choosing Post-exercise Recovery Techniques to Reduce Markers of Muscle Damage, Soreness, Fatigue, and Inflammation: A Systematic Review With Meta-Analysis. Front. Physiol. 9:403. doi: 10.3389/fphys.2018.00403'}
                                            </Text>
                                        </ScrollView>
                                    </View>
                            }
                        </View>
                    </SlidingUpPanel>
                </View>
            </View>
        );
    }
}

BodyModality.propTypes = {
    handleBodyPartClick:     PropTypes.func.isRequired,
    markStartedRecovery:     PropTypes.func.isRequired,
    modality:                PropTypes.string.isRequired,
    patchBodyActiveRecovery: PropTypes.func.isRequired,
    plan:                    PropTypes.object.isRequired,
    user:                    PropTypes.object.isRequired,
};

BodyModality.defaultProps = {};

BodyModality.componentName = 'BodyModality';

/* Export Component ================================================================== */
export default BodyModality;
