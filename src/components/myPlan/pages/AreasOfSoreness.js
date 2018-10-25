/**
 * AreasOfSoreness
 *
    <AreasOfSoreness
        handleAreaOfSorenessClick={(body, isAllGood) => handleAreaOfSorenessClick(body, true, isAllGood)}
        handleFormChange={handleFormChange}
        ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
        scrollToBottom={this._scrollToBottom}
        soreBodyParts={soreBodyParts}
        soreBodyPartsState={dailyReadiness.soreness} || {postSession.soreness}
        surveyObject={dailyReadiness} || {postSession}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Spacer, SVGImage, Text, } from '../../custom';

// import third-party libraries
import _ from 'lodash';

// Components
import { SoreBodyPart, } from './';

/* Component ==================================================================== */
class AreasOfSoreness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllGood: false,
        };
    }

    render = () => {
        const { handleAreaOfSorenessClick, handleFormChange, scrollToBottom, soreBodyParts, soreBodyPartsState, surveyObject, } = this.props;
        let filteredBodyPartMap = _.filter(MyPlanConstants.bodyPartMapping, (u, i) => _.findIndex(soreBodyParts, o => o.body_part === i) === -1);
        let newBodyPartMap = _.filter(filteredBodyPartMap, o => {
            let itemStateFiltered = _.filter(soreBodyParts.body_parts, {body_part: o.index});
            return o.order &&
                _.findIndex(soreBodyParts.body_parts, u => u.body_part === o.index && u.side === 0) === -1 &&
                (itemStateFiltered.length === 1 || itemStateFiltered.length === 0);
        });
        let areaOfSorenessClicked = _.filter(soreBodyPartsState, bodyPartState => _.findIndex(soreBodyParts.body_parts, bodyPartProp => bodyPartProp.body_part === bodyPartState.body_part && bodyPartProp.side === bodyPartState.side) === -1);
        let groupedNewBodyPartMap = _.groupBy(newBodyPartMap, 'location');
        return(
            <View>
                <Spacer size={30} />
                <Button
                    backgroundColor={!this.state.isAllGood ? AppColors.white : AppColors.primary.yellow.hundredPercent}
                    buttonStyle={{
                        alignSelf:       'center',
                        borderRadius:    5,
                        paddingVertical: 5,
                        width:           AppSizes.screen.widthTwoThirds,
                    }}
                    color={!this.state.isAllGood ? AppColors.zeplin.darkGrey : AppColors.white}
                    fontFamily={AppStyles.robotoMedium.fontFamily}
                    fontWeight={AppStyles.robotoMedium.fontWeight}
                    onPress={() => {
                        this.setState({
                            isAllGood: !this.state.isAllGood,
                        }, () => {
                            handleAreaOfSorenessClick(false, true);
                            if(this.state.isAllGood) {
                                scrollToBottom();
                            }
                        });
                    }}
                    outlined={true}
                    raised={false}
                    textStyle={{ fontSize: AppFonts.scaleFont(14), }}
                    title={'NO, ALL GOOD'}
                />
                <Spacer size={30} />
                <Text oswaldMedium style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(12),}]}>{'OR'}</Text>
                <Spacer size={30} />
                <Text robotoLight style={[AppStyles.textCenterAligned, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14),}]}>{'Tap to select body part(s)'}</Text>
                {_.map(groupedNewBodyPartMap, (object, key) => {
                    let bodyPartMap = _.orderBy(object, ['order'], ['asc']);
                    return(
                        <View key={key}>
                            <Text
                                oswaldMedium
                                style={[
                                    AppStyles.textCenterAligned,
                                    {
                                        color:         AppColors.zeplin.darkGrey,
                                        fontSize:      AppFonts.scaleFont(18),
                                        paddingBottom: AppSizes.paddingSml,
                                        paddingTop:    AppSizes.padding,
                                    }
                                ]}
                            >
                                {key.length > 0 ? key.toUpperCase() : 'OTHER'}
                            </Text>
                            <View style={[AppStyles.row, AppStyles.containerCentered, {flexWrap: 'wrap'}]}>
                                {_.map(bodyPartMap, (body, index) => {
                                    let isSelected = false;
                                    _.map(areaOfSorenessClicked, area => {
                                        if(area.body_part === body.index) {
                                            isSelected = true;
                                        }
                                    });
                                    let bodyImage = body.image[0] || body.image[2];
                                    let bodyIndexInState = _.findIndex(soreBodyParts.body_parts, a => a.body_part === body.index);
                                    if(body.bilateral && bodyIndexInState > -1) {
                                        let newBodyImageIndex = soreBodyParts.body_parts[bodyIndexInState].side === 1 ? 2 : 1;
                                        bodyImage = body.image[newBodyImageIndex];
                                    }
                                    let mainBodyPartName = (
                                        body.label.slice(-1) === 's' && body.bilateral
                                    ) ?
                                        body.label === 'Achilles' ?
                                            body.label.toUpperCase()
                                            : body.label === 'Calves' ?
                                                'CALF'
                                                :
                                                body.label.slice(0, -1).toUpperCase()
                                        :
                                        body.label.toUpperCase();
                                    return(
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            key={`AreasOfSoreness0${index}`}
                                            onPress={() => {
                                                this.setState({
                                                    isAllGood: false,
                                                }, () => {
                                                    handleAreaOfSorenessClick(body);
                                                });
                                            }}
                                            style={[AppStyles.paddingSml]}
                                        >
                                            <SVGImage
                                                image={bodyImage}
                                                overlay={true}
                                                overlayText={mainBodyPartName}
                                                selected={isSelected}
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
                {_.map(areaOfSorenessClicked, (area, i) => {
                    return(
                        <View key={`AreasOfSoreness1${i}`} style={[AppStyles.paddingVertical]}>
                            <SoreBodyPart
                                bodyPart={MyPlanConstants.bodyPartMapping[area.body_part]}
                                bodyPartSide={area.side}
                                handleFormChange={handleFormChange}
                                surveyObject={surveyObject}
                            />
                        </View>
                    )
                })}
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
};
AreasOfSoreness.defaultProps = {};
AreasOfSoreness.componentName = 'AreasOfSoreness';

/* Export Component ================================================================== */
export default AreasOfSoreness;