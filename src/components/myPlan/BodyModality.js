/**
 * Body Modality
 *
    <BodyModality
        handleBodyPartClick={handleBodyPartClick}
        modality={modality}
        patchBodyActiveRecovery={patchBodyActiveRecovery}
        plan={plan}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, } from '../../constants';
import { Button, SVGImage, Spacer, TabIcon, Text, } from '../custom';
import { AppUtil, PlanLogic, } from '../../lib';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import * as MagicMove from 'react-native-magic-move';
import _ from 'lodash';
import Collapsible from 'react-native-collapsible';

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
            showInstructions: true,
        };
        this._timer = null;
        this._animatedValue = new Animated.Value(0);
    }

    componentWillUnmount = () => {
        // clear timers
        clearInterval(this._timer);
    }

    _completeBodyPartModality = () => {
        const { modality, patchBodyActiveRecovery, plan, } = this.props;
        let updatedModality = modality === 'cwi' ? 'cold_water_immersion' : modality;
        let completedBodyParts = [];
        if(updatedModality === 'heat' || updatedModality === 'ice') {
            let newBodyParts = _.cloneDeep(plan.dailyPlan[0][updatedModality].body_parts);
            completedBodyParts = _.filter(newBodyParts, ['active', true]);
        }
        patchBodyActiveRecovery(completedBodyParts, updatedModality)
            .then(res => Actions.pop())
            .catch(() => AppUtil.handleAPIErrorAlert(ErrorMessages.patchActiveRecovery));
    }

    _pauseTimer = () => {
        this.setState(
            { isPaused: true, isStarted: false, },
            () => clearInterval(this._timer),
        );
    }

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
        let newTime = this.state.isCompleted ? (time * 60) : this.state.countdownTime;
        this.setState(
            { countdownTime: newTime, isCompleted: false, isPaused: false, isStarted: true, },
            () => {
                this._timer = setInterval(this._updateTimer, 1000);
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
        const { countdownTime, isCompleted, isPaused, isStarted, showInstructions, } = this.state;
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
            <MagicMove.Scene debug={false} disabled={true} duration={500} id={sceneId} style={{flex: 1, backgroundColor: AppColors.white,}} useNativeDriver={false}>
                <View style={{flex: 1,}}>
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        bounces={false}
                        nestedScrollEnabled={true}
                        style={{backgroundColor: AppColors.white, flex: 1,}}
                    >
                        <View style={{height: AppSizes.screen.heightThreeQuarters,}}>
                            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                                <MagicMove.Image
                                    disabled={true}
                                    easing={Easing.in(Easing.cubic)}
                                    id={`${imageId}.image`}
                                    resizeMode={'cover'}
                                    source={imageSource}
                                    style={[{height: (AppSizes.screen.heightThreeQuarters - AppSizes.paddingXLrg),}, StyleSheet.absoluteFill,]}
                                    transition={MagicMove.Transition.morph}
                                    useNativeDriver={false}
                                />
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => Actions.pop()}
                                    style={{position: 'absolute', top: 0, left: 0, padding: AppSizes.isIphoneX ? ((AppSizes.iphoneXBottomBarPadding + AppSizes.padding) / 2) : AppSizes.padding,}}
                                >
                                    <TabIcon
                                        color={AppColors.white}
                                        icon={'chevron-left'}
                                        onPress={() => Actions.pop()}
                                        size={AppFonts.scaleFont(40)}
                                        type={'material-community'}
                                    />
                                </TouchableOpacity>
                                <MagicMove.Text
                                    disabled={true}
                                    duration={600}
                                    id={`${textId}.title`}
                                    style={[AppStyles.oswaldRegular, {color: AppColors.white, fontSize: AppFonts.scaleFont(35), paddingTop: AppSizes.paddingSml,}]}
                                    transition={MagicMove.Transition.move}
                                    useNativeDriver={false}
                                    zIndex={10}
                                >
                                    {pageTitle}
                                </MagicMove.Text>
                                <Text robotoRegular style={{color: AppColors.zeplin.superLight, fontSize: AppFonts.scaleFont(12), marginBottom: AppSizes.paddingLrg,}}>{pageSubtitle}</Text>
                                <View style={[Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.white, borderRadius: 10, marginHorizontal: AppSizes.paddingLrg, padding: AppSizes.paddingMed,}]}>
                                    <Text robotoRegular style={{color: AppColors.zeplin.lightSplash, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>{pageText}</Text>
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
                            </View>
                            <Button
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
                                            <Text robotoRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(15),}}>{'Recommended Body Parts'}</Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(11),}}>{`Tap on body parts you do not plan to ${modality}.`}</Text>
                                        </View>
                                        <View style={[AppStyles.row, AppStyles.containerCentered, {flexWrap: 'wrap'}]}>
                                            {_.map(recoveryObj.body_parts, (body, index) => {
                                                let bodyPart = PlanLogic.handleBodyModalityBodyPart(body);
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
                                                        style={[AppStyles.paddingSml]}
                                                    >
                                                        <SVGImage
                                                            firstTimeExperience={['all_good_body_part_tooltip']}
                                                            image={bodyPart.bodyImage}
                                                            overlay={true}
                                                            overlayText={bodyPart.mainBodyPartName}
                                                            selected={bodyPart.isSelected}
                                                            style={{width: 100, height: 100}}
                                                        />
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </View>
                                }
                                <View style={[Platform.OS === 'ios' ? AppStyles.scaleButtonShadowEffect : {elevation: 2,}, {backgroundColor: AppColors.white, borderRadius: 10, marginHorizontal: AppSizes.paddingLrg, marginTop: AppSizes.padding, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed,}]}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text oswaldRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(18),}}>{`HOW-TO ${modality === 'cwi' ? 'CWB' : _.upperCase(modality)} EFFECTIVELY`}</Text>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => this._toggleInstructions()}
                                            style={{alignSelf: 'center', flexDirection: 'row',}}
                                        >
                                            <Text robotoBold style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(11), paddingRight: AppSizes.paddingXSml,}}>{showInstructions ? 'Hide' : 'Show'}</Text>
                                            <Animated.View style={[animatedStyle,]}>
                                                <TabIcon
                                                    color={AppColors.zeplin.yellow}
                                                    icon={'chevron-up'}
                                                    size={AppFonts.scaleFont(12)}
                                                    type={'material-community'}
                                                />
                                            </Animated.View>
                                        </TouchableOpacity>
                                    </View>
                                    <Collapsible collapsed={!showInstructions} style={{paddingTop: AppSizes.padding,}}>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingXSml,}}>
                                            <View style={{backgroundColor: AppColors.zeplin.darkSlate, borderRadius: (AppSizes.paddingSml / 2), height: AppSizes.paddingSml, marginRight: AppSizes.padding, width: AppSizes.paddingSml,}} />
                                            <Text oswaldMedium style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(16),}}>{'PREP'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',}}>
                                            <View style={{borderRightColor: AppColors.zeplin.lightGrey, borderRightWidth: 1, marginRight: (AppSizes.paddingSml / 2), width: (AppSizes.paddingSml / 2),}} />
                                            <View style={{flex: 1, marginLeft: AppSizes.padding, paddingVertical: AppSizes.paddingXSml,}}>
                                                <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(10),}}>
                                                    { modality === 'heat' ?
                                                        'Locate your heating pad, or microwave a damp towel to create your own heating device.'
                                                        : modality === 'ice' ?
                                                            'Locate your ice pack or make your own by placing ice cubes in a plastic bag or in a wet towel; a pack of frozen peas is also ideal.'
                                                            :
                                                            'Fill a tub with cold water (50 \u00B0F). This should be the coldest setting on your bathtub.'
                                                    }
                                                </Text>
                                                { modality === 'cwi' &&
                                                    <View style={{flexDirection: 'row', marginTop: AppSizes.paddingXSml,}}>
                                                        <TabIcon
                                                            color={AppColors.zeplin.yellow}
                                                            icon={'alert-circle'}
                                                            size={AppFonts.scaleFont(15)}
                                                            type={'material-community'}
                                                        />
                                                        <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(9), marginLeft: AppSizes.paddingXSml,}}>
                                                            {'Research shows adding ice to your bath does not provide any additional benefits.'}
                                                        </Text>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingXSml, marginTop: AppSizes.paddingSml,}}>
                                            <View style={{backgroundColor: AppColors.zeplin.darkSlate, borderRadius: (AppSizes.paddingSml / 2), height: AppSizes.paddingSml, marginRight: AppSizes.padding, width: AppSizes.paddingSml,}} />
                                            <Text oswaldMedium style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(16),}}>{modality === 'cwi' ? 'SUBMERGE' : 'PLACE'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',}}>
                                            <View style={{borderRightColor: AppColors.zeplin.lightGrey, borderRightWidth: 1, marginRight: (AppSizes.paddingSml / 2), width: (AppSizes.paddingSml / 2),}} />
                                            <View style={{flex: 1, marginLeft: AppSizes.padding, paddingVertical: AppSizes.paddingXSml,}}>
                                                { modality === 'cwi' ?
                                                    <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(10),}}>
                                                        {'Place your body in the tub and '}
                                                        <Text robotoRegular style={{textDecorationLine: 'underline',}}>{'submerge your legs, no higher than the top of you hips'}</Text>
                                                    </Text>
                                                    :
                                                    <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(10),}}>
                                                        {`Position ${modality} to cover recommended area(s)`}
                                                    </Text>
                                                }
                                                { modality === 'ice' &&
                                                    <View style={{flexDirection: 'row', marginTop: AppSizes.paddingXSml,}}>
                                                        <TabIcon
                                                            color={AppColors.zeplin.error}
                                                            icon={'alert-circle'}
                                                            size={AppFonts.scaleFont(15)}
                                                            type={'material-community'}
                                                        />
                                                        <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(9), marginLeft: AppSizes.paddingXSml,}}>
                                                            {'Never place ice directly on an injury; move the pack around the recommended area to avoid ice burns.'}
                                                        </Text>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                        <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingXSml, marginTop: AppSizes.paddingSml,}}>
                                            <View style={{backgroundColor: AppColors.zeplin.darkSlate, borderRadius: (AppSizes.paddingSml / 2), height: AppSizes.paddingSml, marginRight: AppSizes.padding, width: AppSizes.paddingSml,}} />
                                            <Text oswaldMedium style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(16),}}>{'REST'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',}}>
                                            <View style={{marginRight: (AppSizes.paddingSml / 2), width: (AppSizes.paddingSml / 2),}} />
                                            <View style={{flex: 1, marginLeft: AppSizes.padding, paddingVertical: AppSizes.paddingXSml,}}>
                                                <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(10),}}>
                                                    {`Set a timer for ${time} and ${modality === 'cwi' ? 'rest' : 'wait'}.`}
                                                </Text>
                                                { modality === 'ice' ?
                                                    <View style={{flexDirection: 'row', marginTop: AppSizes.paddingXSml,}}>
                                                        <TabIcon
                                                            color={AppColors.zeplin.error}
                                                            icon={'alert-circle'}
                                                            size={AppFonts.scaleFont(15)}
                                                            type={'material-community'}
                                                        />
                                                        <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(9), marginLeft: AppSizes.paddingXSml,}}>
                                                            {'Never use ice for more than 30 minutes at a time; remove ice immediately if the injury appears bright pink or red.'}
                                                        </Text>
                                                    </View>
                                                    : modality === 'heat' ?
                                                        <View style={{flexDirection: 'row', marginTop: AppSizes.paddingXSml,}}>
                                                            <TabIcon
                                                                color={AppColors.zeplin.error}
                                                                icon={'alert-circle'}
                                                                size={AppFonts.scaleFont(15)}
                                                                type={'material-community'}
                                                            />
                                                            <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(9), marginLeft: AppSizes.paddingXSml,}}>
                                                                {'When using heat, be very careful to use moderate heat for a limited time to avoid burns.'}
                                                            </Text>
                                                        </View>
                                                        :
                                                        null
                                                }
                                            </View>
                                        </View>
                                    </Collapsible>
                                </View>
                            </View>
                            <Button
                                buttonStyle={{
                                    backgroundColor: AppColors.zeplin.yellow,
                                    borderRadius:    0,
                                    paddingBottom:   AppSizes.isIphoneX ? ((AppSizes.iphoneXBottomBarPadding + AppSizes.paddingMed) / 2) : AppSizes.paddingMed,
                                    paddingTop:      AppSizes.isIphoneX ? ((AppSizes.iphoneXBottomBarPadding + AppSizes.paddingMed) / 2) : AppSizes.paddingMed,
                                }}
                                onPress={() => this._completeBodyPartModality()}
                                title={`Complete ${_.chain(pageTitle).toLower().upperFirst()}`}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                            />
                        </View>
                    </ScrollView>
                </View>
            </MagicMove.Scene>
        );
    }
}

BodyModality.propTypes = {
    handleBodyPartClick:     PropTypes.func.isRequired,
    modality:                PropTypes.string.isRequired,
    patchBodyActiveRecovery: PropTypes.func.isRequired,
    plan:                    PropTypes.object.isRequired,
};

BodyModality.defaultProps = {};

BodyModality.componentName = 'BodyModality';

/* Export Component ================================================================== */
export default BodyModality;