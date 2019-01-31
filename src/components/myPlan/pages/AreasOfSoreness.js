/**
 * AreasOfSoreness
 *
    <AreasOfSoreness
        handleAreaOfSorenessClick={(body, isAllGood) => handleAreaOfSorenessClick(body, true, isAllGood)}
        handleFormChange={handleFormChange}
        handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
        ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
        scrollToArea={this._scrollToArea}
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
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
            handleFormChange,
            handleUpdateFirstTimeExperience,
            scrollToArea,
            soreBodyParts,
            soreBodyPartsState,
            surveyObject,
            toggleSlideUpPanel,
            user,
        } = this.props;
        let { areaOfSorenessClicked, groupedNewBodyPartMap, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState);
        return(
            <View>
                <Spacer size={20} />
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState(
                                {
                                    isAllGood:     !this.state.isAllGood,
                                    showWholeArea: false,
                                },
                                () => handleAreaOfSorenessClick(false, true),
                            )
                        }
                        style={[styles.shadowEffect, styles.allGoodCircle, {backgroundColor: !this.state.isAllGood ? AppColors.zeplin.superLight : AppColors.zeplin.yellow,}]}
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
                    <View style={{backgroundColor: 'red', width: AppSizes.padding,}} />
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                isAllGood:     false,
                                showWholeArea: !this.state.showWholeArea,
                            }, () => {
                                if(this.state.showWholeArea) {
                                    scrollToArea(this._soreBodyPartRef);
                                }
                            });
                        }}
                        style={[styles.shadowEffect, styles.allGoodCircle, {backgroundColor: !this.state.showWholeArea ? AppColors.zeplin.superLight : AppColors.zeplin.yellow,}]}
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
                <Spacer size={30} />
                <View
                    onLayout={event => {this._soreBodyPartRef = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y,}}}
                >
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
                                    <Spacer size={5} />
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
                </View>
            </View>
        )
    }
}

AreasOfSoreness.propTypes = {
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    handleFormChange:          PropTypes.func.isRequired,
    soreBodyParts:             PropTypes.object.isRequired,
    soreBodyPartsState:        PropTypes.array.isRequired,
    surveyObject:              PropTypes.object,
    user:                      PropTypes.object.isRequired,
};

AreasOfSoreness.defaultProps = {};

AreasOfSoreness.componentName = 'AreasOfSoreness';

/* Export Component ================================================================== */
export default AreasOfSoreness;