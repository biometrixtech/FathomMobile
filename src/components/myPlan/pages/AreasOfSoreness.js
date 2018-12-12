/**
 * AreasOfSoreness
 *
    <AreasOfSoreness
        handleAreaOfSorenessClick={(body, isAllGood) => handleAreaOfSorenessClick(body, true, isAllGood)}
        handleFormChange={handleFormChange}
        handleUpdateFirstTimeExperience={value => handleUpdateFirstTimeExperience(value)}
        ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
        scrollToBottom={this._scrollToBottom}
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
import { TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Spacer, SVGImage, Text, Tooltip, } from '../../custom';
import { PlanLogic, } from '../../../lib';

// import third-party libraries
import _ from 'lodash';

// Components
import { SoreBodyPart, } from './';

const TooltipContent = ({ handleTooltipClose, text, }) => (
    <View style={{padding: AppSizes.padding,}}>
        <Text robotoLight style={{color: AppColors.black, fontSize: AppFonts.scaleFont(15),}}>
            {text}
        </Text>
        <Spacer size={20} />
        <TouchableOpacity
            onPress={handleTooltipClose}
            style={{alignSelf: 'flex-end',}}
        >
            <Text
                robotoMedium
                style={{
                    color:    AppColors.primary.yellow.hundredPercent,
                    fontSize: AppFonts.scaleFont(15),
                }}
            >
                {'GOT IT'}
            </Text>
        </TouchableOpacity>
    </View>
);

/* Component ==================================================================== */
class AreasOfSoreness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllGood:            false,
            isAllGoodTooltipOpen: false,
        };
        this.soreBodyPartRef = {};
    }

    _handleTooltipClose = callback => {
        this.setState(
            { isAllGoodTooltipOpen: false, },
            () => {
                this.props.scrollToBottom();
                callback();
            }
        );
    }

    render = () => {
        const {
            handleAreaOfSorenessClick,
            handleFormChange,
            handleUpdateFirstTimeExperience,
            scrollToBottom,
            soreBodyParts,
            soreBodyPartsState,
            surveyObject,
            toggleSlideUpPanel,
            user,
        } = this.props;
        let { areaOfSorenessClicked, groupedNewBodyPartMap, } = PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState);
        return(
            <View>
                <Spacer size={30} />
                <Tooltip
                    animated
                    content={
                        <TooltipContent
                            handleTooltipClose={() => this._handleTooltipClose(() => {
                                handleUpdateFirstTimeExperience('all_good_body_part_tooltip');
                            })}
                            text={MyPlanConstants.allGoodBodyPartMessage()}
                        />
                    }
                    isVisible={this.state.isAllGoodTooltipOpen}
                    onClose={() => {}}
                    tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
                >
                    <TouchableOpacity
                        onPress={() => {
                            if(!this.state.isAllGoodTooltipOpen) {
                                this.setState({
                                    isAllGood: !this.state.isAllGood,
                                }, () => {
                                    if(!user.first_time_experience.includes('all_good_body_part_tooltip') && this.state.isAllGood) {
                                        this.setState({ isAllGoodTooltipOpen: true, });
                                    }
                                    if(user.first_time_experience.includes('all_good_body_part_tooltip') && this.state.isAllGood) {
                                        scrollToBottom();
                                    }
                                    handleAreaOfSorenessClick(false, true);
                                });
                            }
                        }}
                        style={{
                            alignSelf:       'center',
                            backgroundColor: !this.state.isAllGood ? AppColors.white : AppColors.primary.yellow.hundredPercent,
                            borderColor:     !this.state.isAllGood ? AppColors.zeplin.darkGrey : AppColors.primary.yellow.hundredPercent,
                            borderRadius:    5,
                            borderWidth:     1,
                            paddingVertical: 5,
                            width:           AppSizes.screen.widthTwoThirds,
                        }}
                    >
                        <Text
                            oswaldMedium
                            style={{
                                color:     !this.state.isAllGood ? AppColors.zeplin.darkGrey : AppColors.white,
                                fontSize:  AppFonts.scaleFont(18),
                                textAlign: 'center',
                            }}
                        >
                            {'NO, ALL GOOD'}
                        </Text>
                    </TouchableOpacity>
                </Tooltip>
                <Spacer size={25} />
                <Text oswaldRegular style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}]}>{'OR'}</Text>
                <Spacer size={5} />
                <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14),}]}>{'Tap to select body part(s)'}</Text>
                <Spacer size={30} />
                {_.map(groupedNewBodyPartMap, (object, key) => {
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
                })}
                <Spacer size={50} />
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