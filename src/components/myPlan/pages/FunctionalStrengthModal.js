/**
 * Functional Strength Modal
 *
     <FunctionalStrengthModal
        functionalStrength={this.state.functionalStrength}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handleFSFormSubmit}
        toggleFSModal={this._toggleFunctionalStrengthModal}
        typicalSessions={this.props.typicalSessions}
     />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, Platform, ScrollView, StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { BackNextButtons, SportBlock, } from './';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    imageBackgroundStyle: {
        alignItems:      'center',
        alignSelf:       'stretch',
        backgroundColor: AppColors.transparent,
        flex:            1,
        justifyContent:  'center',
    },
    linearGradientStyle: {
        alignItems: 'center',
        alignSelf:  'stretch',
        flex:       1,
        overflow:   'visible',
    },
    lockIconStyle: {
        alignSelf:      'center',
        justifyContent: 'center',
    },
    lockIconWrapperStyle: {
        alignItems:      'center',
        alignSelf:       'center',
        backgroundColor: AppColors.zeplin.seaBlue,
        borderRadius:    AppFonts.scaleFont(40) / 2,
        height:          AppFonts.scaleFont(40),
        justifyContent:  'center',
        width:           AppFonts.scaleFont(40),
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius:  6,
    },
});

/* Component ==================================================================== */
class FunctionalStrengthModal extends Component {
    constructor(props) {
        super(props);
        this.scrollViewRef = {};
    }

    _scrollToBottom = () => {
        _.delay(() => {
            this.scrollViewRef.scrollToEnd({ animated: true, });
        }, 500);
    }

    _scrollTo = myComponentsLocation => {
        if(myComponentsLocation) {
            _.delay(() => {
                this.scrollViewRef.scrollTo({
                    x:        myComponentsLocation.x,
                    y:        myComponentsLocation.y,
                    animated: true,
                });
            }, 500);
        }
    }

    render = () => {
        const { functionalStrength, handleFormChange, handleFormSubmit, toggleFSModal, typicalSessions, } = this.props;
        let { hasPositions, isValid, selectedSportPositions, } = PlanLogic.fsModalRenderLogic(functionalStrength, typicalSessions);
        let backNextHeight = ((AppSizes.backNextButtonsHeight) + (AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.paddingMed));
        return(
            <ScrollView
                contentContainerStyle={{flexDirection: 'column', flexGrow: 1,}}
                ref={ref => {this.scrollViewRef = ref;}}
            >
                <ImageBackground
                    source={require('../../../../assets/images/standard/start_page_background.png')}
                    style={[styles.imageBackgroundStyle]}
                >
                    <LinearGradient
                        colors={['#ffffff00', 'white']}
                        start={{x: 0.0, y: 0.0}}
                        end={{x: 0.0, y: 0.65}}
                        style={[styles.linearGradientStyle]}
                    >
                        <View style={{flex: 1,}}>
                            <View
                                style={{
                                    flex:           1,
                                    height:         hasPositions ? (AppSizes.screen.height) : (AppSizes.screen.height - backNextHeight),
                                    justifyContent: 'space-between',
                                }}
                            >
                                <TabIcon
                                    containerStyle={[{alignSelf: 'flex-end', flex: 1,}]}
                                    color={AppColors.zeplin.blueGrey}
                                    icon={'close'}
                                    onPress={() => toggleFSModal()}
                                    raised={false}
                                    type={'material-community'}
                                />
                                <View style={{flex: 9, justifyContent: 'center',}}>
                                    <Text oswaldMedium style={[AppStyles.paddingVerticalSml, {color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}]}>{'LET\'S PERSONALIZE YOUR FUNCTIONAL STRENGTH!'}</Text>
                                    <Text robotoLight style={[AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}]}>{'What activity would you like to target?'}</Text>
                                    <View style={{alignSelf: 'center',}}>
                                        {_.map(typicalSessions, (session, i) => {
                                            let filteredSession = session.sport_name || session.sport_name === 0 ?
                                                _.filter(MyPlanConstants.teamSports, ['index', session.sport_name])[0]
                                                : session.strength_and_conditioning_type || session.strength_and_conditioning_type === 0 ?
                                                    _.filter(MyPlanConstants.strengthConditioningTypes, ['index', session.strength_and_conditioning_type])[0]
                                                    :
                                                    false;
                                            let displayName = filteredSession ?
                                                filteredSession.label
                                                :
                                                '';
                                            let newSportName = MyPlanConstants.translateStrengthConditioningTypeToSport(session.sport_name, session.strength_and_conditioning_type);
                                            return(
                                                <SportBlock
                                                    displayName={displayName}
                                                    filteredSession={filteredSession}
                                                    isSelected={functionalStrength.current_sport_name === newSportName}
                                                    key={i}
                                                    onPress={() => {
                                                        handleFormChange('current_position', null);
                                                        handleFormChange('current_sport_name', newSportName);
                                                        /*eslint no-shadow: 0*/
                                                        let { hasPositions, } = PlanLogic.fsModalRenderLogic(functionalStrength, typicalSessions);
                                                        if(hasPositions) {
                                                            this._scrollToBottom();
                                                        } else {
                                                            this._scrollTo({x: 0, y: 0});
                                                        }
                                                    }}
                                                />
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                            <View
                                onLayout={event => {this.positionsComponents = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}
                                style={{height: hasPositions ? (AppSizes.screen.height - backNextHeight) : 0, justifyContent: 'center',}}
                            >
                                { hasPositions ?
                                    <View>
                                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVertical, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                                            {'What is your primary position in '}
                                            <Text robotoBold>
                                                {PlanLogic.handleFunctionalStrengthOptions({ sport_name: functionalStrength.current_sport_name, }).sessionName.toLowerCase()}
                                            </Text>
                                            {'?'}
                                        </Text>
                                        <View style={{alignSelf: 'center',}}>
                                            {_.map(selectedSportPositions, (position, i) => {
                                                let isSelected = functionalStrength.current_position === i;
                                                return(
                                                    <SportBlock
                                                        displayName={position.toUpperCase()}
                                                        isSelected={isSelected}
                                                        key={i}
                                                        onPress={() => {
                                                            handleFormChange('current_position', i);
                                                            this._scrollToBottom();
                                                        }}
                                                    />
                                                )
                                            })}
                                        </View>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                            <BackNextButtons
                                handleFormSubmit={() => console.log('hiii')}
                                isValid={isValid}
                                showSubmitBtn={true}
                                submitBtnText={'Submit'}
                            />
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </ScrollView>
        );
    }
}

FunctionalStrengthModal.propTypes = {
    functionalStrength: PropTypes.object.isRequired,
    handleFormChange:   PropTypes.func.isRequired,
    handleFormSubmit:   PropTypes.func.isRequired,
    toggleFSModal:      PropTypes.func.isRequired,
    typicalSessions:    PropTypes.array.isRequired,
};

FunctionalStrengthModal.defaultProps = {};

FunctionalStrengthModal.componentName = 'FunctionalStrengthModal';

/* Export Component ================================================================== */
export default FunctionalStrengthModal;