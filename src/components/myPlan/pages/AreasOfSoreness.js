/**
 * AreasOfSoreness
 *
    <AreasOfSoreness
        handleAreaOfSorenessClick={(body, isAllGood) => handleAreaOfSorenessClick(body, true, isAllGood)}
        handleFormChange={handleFormChange}
        handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
        headerTitle={`Do you have any${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' other ' : ' new '}pain or soreness?`}
        ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { Spacer, SVGImage, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

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
            handleUpdateFirstTimeExperience,
            headerTitle,
            scrollToArea,
            scrollToTop,
            soreBodyParts,
            soreBodyPartsState,
            user,
        } = this.props;
        let { areaOfSorenessClicked, groupedNewBodyPartMap, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState);
        return(
            <View
                style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}}
            >
                <View style={{
                    flex:           1,
                    height:         (AppSizes.screen.height - (AppSizes.statusBarHeight + AppSizes.progressPillsHeight + ((AppSizes.backNextButtonsHeight) + (AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.paddingMed)))),
                    justifyContent: 'center',
                }}>
                    <Spacer size={AppSizes.padding} />
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>{headerTitle}</Text>
                    <Spacer size={AppSizes.padding} />
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                        <TouchableOpacity
                            onPress={() =>
                                this.setState(
                                    {
                                        isAllGood:     !this.state.isAllGood,
                                        showWholeArea: false,
                                    },
                                    () => {
                                        scrollToTop();
                                        handleAreaOfSorenessClick(false, true);
                                    },
                                )
                            }
                            style={[
                                AppStyles.xxLrgCircle,
                                styles.shadowEffect,
                                Platform.OS === 'ios' ? {} : {elevation: 2,},
                                {backgroundColor: !this.state.isAllGood ? AppColors.zeplin.superLight : AppColors.zeplin.yellow,},
                            ]}
                        >
                            <Text
                                oswaldMedium
                                style={{
                                    color:     !this.state.isAllGood ? AppColors.zeplin.blueGrey : AppColors.white,
                                    fontSize:  AppFonts.scaleFont(27),
                                    textAlign: 'center',
                                }}
                            >
                                {'NO'}
                            </Text>
                        </TouchableOpacity>
                        <View style={{width: AppSizes.padding,}} />
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    isAllGood:     false,
                                    showWholeArea: !this.state.showWholeArea,
                                }, () => {
                                    _.delay(() => {
                                        handleAreaOfSorenessClick(false, false, true);
                                        if(this.state.showWholeArea) {
                                            scrollToArea(this._soreBodyPartRef);
                                        } else {
                                            scrollToTop();
                                        }
                                    }, 500);
                                });
                            }}
                            style={[
                                AppStyles.xxLrgCircle,
                                styles.shadowEffect,
                                Platform.OS === 'ios' ? {} : {elevation: 2,},
                                {backgroundColor: !this.state.showWholeArea ? AppColors.zeplin.superLight : AppColors.zeplin.yellow,},
                            ]}
                        >
                            <Text
                                oswaldMedium
                                style={{
                                    color:     !this.state.showWholeArea ? AppColors.zeplin.blueGrey : AppColors.white,
                                    fontSize:  AppFonts.scaleFont(27),
                                    textAlign: 'center',
                                }}
                            >
                                {'YES'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View onLayout={event => {this._soreBodyPartRef = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y,}}} >
                    <Spacer size={this.state.showWholeArea ? AppSizes.paddingLrg : 0} />
                    { this.state.showWholeArea ?
                        _.map(groupedNewBodyPartMap, (object, key) => {
                            let bodyPartMap = _.orderBy(object, ['order'], ['asc']);
                            return(
                                <View key={key}>
                                    <Text
                                        oswaldMedium
                                        style={[
                                            AppStyles.textCenterAligned,
                                            {
                                                color:    AppColors.zeplin.darkGrey,
                                                fontSize: AppFonts.scaleFont(18),
                                            }
                                        ]}
                                    >
                                        {key.length > 0 ? key.toUpperCase() : 'OTHER'}
                                    </Text>
                                    <Spacer size={AppSizes.paddingXSml} />
                                    <View style={[AppStyles.row, AppStyles.containerCentered, {flexWrap: 'wrap'}]}>
                                        {_.map(bodyPartMap, (body, index) => {
                                            let areasOfSorenessBodyPart = PlanLogic.handleAreasOfSorenessBodyPart(areaOfSorenessClicked, body, soreBodyParts);
                                            return(
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    key={`AreasOfSoreness-${index}`}
                                                    onPress={() => {
                                                        this.setState(
                                                            { isAllGood: false, },
                                                            () => handleAreaOfSorenessClick(body)
                                                        );
                                                    }}
                                                    style={[AppStyles.paddingSml]}
                                                >
                                                    <SVGImage
                                                        firstTimeExperience={user.first_time_experience}
                                                        handleUpdateFirstTimeExperience={handleUpdateFirstTimeExperience}
                                                        image={areasOfSorenessBodyPart.bodyImage}
                                                        overlay={true}
                                                        overlayText={areasOfSorenessBodyPart.mainBodyPartName}
                                                        selected={areasOfSorenessBodyPart.isSelected}
                                                        style={{width: 100, height: 100}}
                                                    />
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            )
                        })
                        :
                        null
                    }
                    <Spacer size={this.state.showWholeArea ? AppSizes.paddingSml : 0} />
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