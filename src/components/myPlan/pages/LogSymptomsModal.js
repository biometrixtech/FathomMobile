/**
 * SessionsCompletionModal
 *
    <SessionsCompletionModal
        isModalOpen={this.state.isModalOpen}
        onClose={this._closePrepareSessionsCompletionModal}
        sessions={[]}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { Checkbox, FathomModal, Spacer, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

// Components
import { AreasOfSoreness, BackNextButtons, ProgressPill, SurveySlideUpPanel, } from './';

// import third-party libraries
import _ from 'lodash';
import { ButtonGroup, } from 'react-native-elements';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    floatingBottomButtons: {
        bottom:            0,
        flexDirection:     'row',
        justifyContent:    'space-between',
        paddingHorizontal: AppSizes.paddingSml,
        position:          'absolute',
        right:             0,
    },
    modalButtonWrapper: {
        backgroundColor:   AppColors.zeplin.yellow,
        borderRadius:      100,
        paddingHorizontal: AppSizes.paddingXLrg,
        paddingVertical:   AppSizes.paddingMed,
    },
});

/* Component ==================================================================== */
class LogSymptomsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBodyOverlayButtonLocked: false,
            isBodyOverlayFront:        true,
            isSlideUpPanelExpanded:    true,
            isSlideUpPanelOpen:        false,
        };
        this.areasOfSorenessRef = {};
    }

    _toggleSlideUpPanel = (isExpanded = true) => {
        this.setState({
            isSlideUpPanelExpanded: isExpanded,
            isSlideUpPanelOpen:     !this.state.isSlideUpPanelOpen,
        });
    }

    render = () => {
        const {
            handleAreaOfSorenessClick,
            handleClose,
            handleFormChange,
            handleFormSubmit,
            isModalOpen,
            soreBodyParts,
            soreness,
            user,
        } = this.props;
        const {
            isBodyOverlayButtonLocked,
            isBodyOverlayFront,
            isSlideUpPanelExpanded,
            isSlideUpPanelOpen,
        } = this.state;
        let newSoreBodyParts = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts);
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreness);
        return(
            <FathomModal isVisible={isModalOpen}>

                <View style={{backgroundColor: AppColors.white, flex: 1,}}>
                    <ScrollView
                        bounces={false}
                        contentContainerStyle={{flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between',}}
                        nestedScrollEnabled={true}
                        overScrollMode={'never'}
                        stickyHeaderIndices={[0]}
                    >
                        <ProgressPill
                            currentStep={3}
                            onClose={handleClose}
                            totalSteps={3}
                        />
                        <AreasOfSoreness
                            handleAreaOfSorenessClick={(body, isAllGood, showFAB, resetSections, side, callback) => handleAreaOfSorenessClick(body, false, isAllGood, resetSections, side, callback, true)}
                            handleFormChange={handleFormChange}
                            handleUpdateFirstTimeExperience={value => console.log(value)}
                            headerTitle={'Do you have any areas of discomfort?'}
                            isBodyOverlayFront={isBodyOverlayFront}
                            ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                            newSoreBodyParts={newSoreBodyParts}
                            scrollToArea={xyObject => console.log(xyObject)}
                            scrollToTop={() => console.log()}
                            soreBodyParts={soreBodyParts}
                            soreBodyPartsState={soreness}
                            surveyObject={{}}
                            toggleSlideUpPanel={this._toggleSlideUpPanel}
                            user={user}
                        />
                    </ScrollView>
                    <View style={[styles.floatingBottomButtons,]}>
                        <View style={{flex: 1,}}>
                            <ButtonGroup
                                buttons={['Front', 'Back']}
                                containerStyle={{backgroundColor: `${AppColors.zeplin.splashXLight}${PlanLogic.returnHexOpacity(0.8)}`, borderRadius: AppSizes.paddingLrg, borderWidth: 0, marginLeft: 0, marginTop: 0,}}
                                innerBorderStyle={{width: 0,}}
                                onPress={selectedIndex => isBodyOverlayButtonLocked ?
                                    {}
                                    :
                                    this.setState(
                                        { isBodyOverlayButtonLocked: true, isBodyOverlayFront: (selectedIndex === 0), },
                                        () => _.delay(() => this.setState({ isBodyOverlayButtonLocked: false, }), 800)
                                    )
                                }
                                selectedButtonStyle={{backgroundColor: `${AppColors.zeplin.splashLight}${PlanLogic.returnHexOpacity(0.8)}`,}}
                                selectedIndex={isBodyOverlayFront ? 0 : 1}
                                selectedTextStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                                textStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                            />
                        </View>
                        <View style={{flex: 1,}}>
                            <BackNextButtons
                                addOpacityToSubmitBtn={0.8}
                                handleFormSubmit={areaOfSorenessClicked.length > 0 ?
                                    () => handleFormSubmit()
                                    :
                                    () => handleClose()
                                }
                                isValid={true}
                                showSubmitBtn={true}
                                submitBtnText={areaOfSorenessClicked.length === 0 ? 'No, All Good!' : 'Submit'}
                            />
                        </View>
                    </View>
                </View>

                <SurveySlideUpPanel
                    expandSlideUpPanel={() => this.setState({ isSlideUpPanelExpanded: true, })}
                    isSlideUpPanelExpanded={isSlideUpPanelExpanded}
                    isSlideUpPanelOpen={isSlideUpPanelOpen}
                    toggleSlideUpPanel={isExpanded => this._toggleSlideUpPanel(isExpanded)}
                />

            </FathomModal>
        )
    }
}

LogSymptomsModal.propTypes = {
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    handleClose:               PropTypes.func.isRequired,
    handleFormChange:          PropTypes.func.isRequired,
    handleFormSubmit:          PropTypes.func.isRequired,
    isModalOpen:               PropTypes.bool.isRequired,
    soreBodyParts:             PropTypes.object.isRequired,
    soreness:                  PropTypes.array.isRequired,
    user:                      PropTypes.object.isRequired,
};

LogSymptomsModal.defaultProps = {};

LogSymptomsModal.componentName = 'LogSymptomsModal';

/* Export Component ================================================================== */
export default LogSymptomsModal;