/**
 * AreasOfSoreness
 *
    <AreasOfSoreness
        handleAreaOfSorenessClick={(body, isAllGood) => handleAreaOfSorenessClick(body, true, isAllGood)}
        handleFormChange={handleFormChange}
        handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
        headerTitle={`Do you have any${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' other ' : ' new '}pain or soreness?`}
        isBodyOverlayFront={isBodyOverlayFront}
        ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
        newSoreBodyParts={newSoreBodyParts}
        scrollToArea={this._scrollToArea}
        scrollToTop={() => this._scrollToTop(this.myAreasOfSorenessComponent)}
        soreBodyParts={soreBodyParts}
        soreBodyPartsState={dailyReadiness.soreness} || {postSession.soreness}
        surveyObject={dailyReadiness} || {postSession}
        toggleSlideUpPanel={this._toggleSlideUpPanel}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Spacer, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { BodyPartSelector, } from './';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    allGoodBtnWrapper: isValid => ({
        alignSelf:         'center',
        backgroundColor:   isValid ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight,
        borderRadius:      100,
        paddingHorizontal: AppSizes.padding,
        paddingVertical:   AppSizes.paddingXSml,
    }),
});

/* Component ==================================================================== */
class AreasOfSoreness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllGood:     false,
            showWholeArea: false,
        };
        this._soreBodyPartRef = {};
    }

    render = () => {
        const {
            handleAreaOfSorenessClick,
            handleFormChange,
            headerTitle,
            isBodyOverlayFront,
            newSoreBodyParts,
            soreBodyParts,
            soreBodyPartsState,
        } = this.props;
        let { areaOfSorenessClicked, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState);
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}}>
                <View>
                    <Spacer size={AppSizes.padding} />
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(25),}]}>
                        {headerTitle}
                    </Text>
                    {/*<Spacer size={AppSizes.padding} />
                    <TouchableOpacity
                        onPress={() => this.setState({ isAllGood: !this.state.isAllGood, })}
                        style={[styles.allGoodBtnWrapper(this.state.isAllGood),]}
                    >
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'No, all good!'}</Text>
                    </TouchableOpacity>*/}
                    <Spacer size={AppSizes.padding} />
                    <BodyPartSelector
                        areaOfSorenessClicked={areaOfSorenessClicked}
                        handleBodyPartClick={(body, side, callback) => handleAreaOfSorenessClick(body, false, false, false, side, callback)}
                        handleFormChange={handleFormChange}
                        isBodyOverlayFront={isBodyOverlayFront}
                        newSoreBodyParts={newSoreBodyParts}
                    />
                    <Spacer size={AppSizes.padding} />
                </View>
            </View>
        )
    }
}

AreasOfSoreness.propTypes = {
    handleAreaOfSorenessClick:       PropTypes.func.isRequired,
    handleFormChange:                PropTypes.func.isRequired,
    handleUpdateFirstTimeExperience: PropTypes.func.isRequired,
    headerTitle:                     PropTypes.string.isRequired,
    isBodyOverlayFront:              PropTypes.bool.isRequired,
    newSoreBodyParts:                PropTypes.array.isRequired,
    scrollToArea:                    PropTypes.func.isRequired,
    scrollToTop:                     PropTypes.func.isRequired,
    soreBodyParts:                   PropTypes.object.isRequired,
    soreBodyPartsState:              PropTypes.array.isRequired,
    surveyObject:                    PropTypes.object.isRequired,
    toggleSlideUpPanel:              PropTypes.func.isRequired,
    user:                            PropTypes.object.isRequired,
};

AreasOfSoreness.defaultProps = {};

AreasOfSoreness.componentName = 'AreasOfSoreness';

/* Export Component ================================================================== */
export default AreasOfSoreness;