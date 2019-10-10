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
import { Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Spacer, SVGImage, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';
import { BodyPartSelector, } from './';

// import third-party libraries
import _ from 'lodash';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  6,
    },
    allGoodCircle: {
        alignSelf:         'center',
        borderRadius:      85 / 2,
        height:            85,
        justifyContent:    'center',
        marginBottom:      20,
        paddingHorizontal: AppSizes.paddingSml,
        width:             85,
    },
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
            handleUpdateFirstTimeExperience,
            headerTitle,
            isBodyOverlayFront,
            newSoreBodyParts,
            scrollToArea,
            scrollToTop,
            soreBodyParts,
            soreBodyPartsState,
            user,
        } = this.props;
        let { areaOfSorenessClicked, groupedNewBodyPartMap, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState);
        let pillsHeight = (AppSizes.statusBarHeight + AppSizes.progressPillsHeight);
        let backNextHeight = ((AppSizes.backNextButtonsHeight) + (AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.paddingMed));
        let btnsWrapperHeight = this.state.showWholeArea ?
            (AppSizes.screen.height - pillsHeight)
            :
            (AppSizes.screen.height - (pillsHeight + backNextHeight));
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}}>
                <View>
                    <Spacer size={AppSizes.padding} />
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(32),}]}>{headerTitle}</Text>
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