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
import { Platform, ScrollView, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { BackNextButtons, SportBlock, } from './';

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

                <View
                    style={{
                        flex:          1,
                        height:        hasPositions ? (AppSizes.screen.height) : (AppSizes.screen.height - backNextHeight),
                        paddingBottom: hasPositions ? backNextHeight : 0,
                    }}
                >

                    <TabIcon
                        containerStyle={[{alignItems: 'flex-end', height: backNextHeight, padding: AppSizes.padding,}]}
                        color={AppColors.zeplin.blueGrey}
                        icon={'close'}
                        onPress={() => toggleFSModal()}
                        raised={false}
                        type={'material-community'}
                    />

                    <View
                        style={{
                            height:         hasPositions ? (AppSizes.screen.height - backNextHeight) : (AppSizes.screen.height - (backNextHeight  * 2)),
                            justifyContent: 'center',
                        }}
                    >
                        <Text oswaldMedium style={[AppStyles.paddingVerticalSml, {color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}]}>{'LET\'S PERSONALIZE YOUR\nFUNCTIONAL STRENGTH!'}</Text>
                        <Text robotoLight style={[AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(28), paddingBottom: 25, textAlign: 'center',}]}>{'What activity would you\nlike to target?'}</Text>
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
                                            displayName={position}
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
                    handleFormSubmit={() => handleFormSubmit()}
                    isValid={isValid}
                    showSubmitBtn={true}
                    submitBtnText={'Submit'}
                />

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