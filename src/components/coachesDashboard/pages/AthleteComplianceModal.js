/**
 * AthleteComplianceModal
 *
    <AthleteComplianceModal
        completedAtheltes={completedAtheltes}
        complianceColor={complianceColor}
        incompleteAtheltes={incompleteAtheltes}
        numOfCompletedAthletes={numOfCompletedAthletes}
        numOfIncompletedAthletes={numOfIncompletedAthletes}
        numOfTotalAthletes={numOfTotalAthletes}
        toggleComplianceModal={this._toggleComplianceModal}
        trainingCompliance={trainingCompliance}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, ScrollView, StyleSheet, TouchableHighlight, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { Spacer, TabIcon, Text, } from '../../custom';

// import third-party libraries
import _ from 'lodash';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    complianceModalAthleteNameWrapper: {
        alignSelf:         'center',
        borderBottomColor: AppColors.zeplin.shadow,
        borderBottomWidth: 1,
        borderStyle:       'solid',
        width:             (AppSizes.screen.widthThreeQuarters - (AppSizes.paddingLrg + AppSizes.paddingLrg)),
    },
    contentHeaderWrapper: {
        alignItems:        'center',
        backgroundColor:   AppColors.primary.grey.twentyPercent,
        borderRadius:      5,
        flexDirection:     'row',
        marginBottom:      AppSizes.paddingXSml,
        paddingHorizontal: AppSizes.paddingXSml,
        paddingVertical:   AppSizes.paddingSml,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius:  6,
    },
});

/* Component ==================================================================== */
class AthleteComplianceModal extends Component {
    constructor(props) {
        super(props);
        let {
            completedAtheltes,
            incompleteAtheltes,
            numOfCompletedAthletes,
            numOfIncompletedAthletes,
            numOfTotalAthletes,
            trainingCompliance,
        } = this.props;
        this.state = {
            page:              'readiness',
            readinessSections: [
                {
                    content:        incompleteAtheltes,
                    leftIcon:       'alert-circle',
                    leftIconColor:  AppColors.zeplin.error,
                    leftIconFamily: 'material-community',
                    title:          'SURVEYS NOT COMPLETED',
                    subtitle:       `${numOfIncompletedAthletes}/${numOfTotalAthletes}`,
                },
                {
                    content:  completedAtheltes,
                    title:    'SURVEYS COMPLETED',
                    subtitle: `${numOfCompletedAthletes}/${numOfTotalAthletes}`,
                },
            ],
            readinessAccordionSection: 0,
            trainingAccordionSection:  0,
            trainingSections:          [
                {
                    content:        trainingCompliance.no_response,
                    leftIcon:       'alert-circle',
                    leftIconColor:  AppColors.zeplin.error,
                    leftIconFamily: 'material-community',
                    title:          'NO RESPONSE LOGGED',
                    subtitle:       `${trainingCompliance.no_response.length}/${numOfTotalAthletes}`,
                },
                {
                    content:  trainingCompliance.rest_day,
                    title:    'REST DAY LOGGED',
                    subtitle: `${trainingCompliance.rest_day.length}/${numOfTotalAthletes}`,
                },
                {
                    content:  trainingCompliance.sessions_logged,
                    title:    'TRAINING LOGGED',
                    subtitle: `${trainingCompliance.sessions_logged.length}/${numOfTotalAthletes}`,
                },
            ],
        };
    }

    _renderContent = section => {
        if(section.content.length === 0) {
            return(<View />)
        }
        return(
            <View style={{paddingTop: AppSizes.padding,}}>
                {_.map(section.content, (athlete, index) =>
                    <View key={index}>
                        <View style={[styles.complianceModalAthleteNameWrapper]}>
                            <Text
                                robotoLight
                                style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingBottom: AppSizes.padding,}}
                            >
                                {`${athlete.first_name} ${athlete.last_name}`}
                            </Text>
                        </View>
                        <Spacer size={15} />
                    </View>
                )}
            </View>
        )
    }

    _renderHeader = (section, index, isActive) => {
        if(section.content.length === 0) {
            return(<View />)
        }
        return(
            <View style={[styles.contentHeaderWrapper, styles.shadowEffect, Platform.OS === 'ios' ? {} : {elevation: 2}]}>
                <View style={{paddingRight: AppSizes.paddingMed,}}>
                    { section.leftIcon ?
                        <TabIcon
                            icon={section.leftIcon}
                            iconStyle={[{color: section.leftIconColor,}]}
                            reverse={false}
                            size={30}
                            type={section.leftIconFamily}
                        />
                        :
                        null
                    }
                </View>
                <View style={{flex: 1, paddingRight: AppSizes.paddingSml,}}>
                    <Text oswaldMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}}>{section.title}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                        <Text robotoBold style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(12),}}>
                            {section.subtitle}
                            <Text robotoRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(12),}}>{' athletes'}</Text>
                        </Text>
                        <TabIcon
                            icon={isActive ? 'chevron-up' : 'chevron-down'}
                            iconStyle={[{color: AppColors.zeplin.darkGrey,}]}
                            reverse={false}
                            size={AppFonts.scaleFont(12)}
                            type={'material-community'}
                        />
                    </View>
                </View>
            </View>
        )
    }

    _updateSections = (name, section) => {
        let newState = _.update( this.state, name, () => section);
        this.setState(newState);
    }

    _togglePage = page => {
        let newState = _.update( this.state, 'page', () => page);
        this.setState(newState);
    }

    render = () => {
        let { toggleComplianceModal, } = this.props;
        let { page, readinessSections, readinessAccordionSection, trainingAccordionSection, trainingSections, } = this.state;
        return(
            <ScrollView
                style={{paddingHorizontal: AppSizes.paddingLrg,}}
            >
                <TabIcon
                    containerStyle={[{alignSelf: 'flex-end',}]}
                    icon={'close'}
                    iconStyle={[{color: AppColors.black, paddingTop: AppSizes.padding,}]}
                    onPress={() => toggleComplianceModal()}
                    reverse={false}
                    size={30}
                    type={'material-community'}
                />
                <Text oswaldRegular style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(35),}}>
                    {'COMPLIANCE'}
                </Text>
                <Text oswaldMedium style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(15),}}>{moment().format('MM/DD/YY')}</Text>
                <Spacer size={15} />
                <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                    <TouchableHighlight
                        onPress={() => this._togglePage('readiness')}
                        style={{borderBottomColor: page === 'readiness' ? AppColors.primary.yellow.hundredPercent : AppColors.white, borderBottomWidth: 2,}}
                        underlayColor={AppColors.transparent}
                    >
                        <Text oswaldMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}}>{'READINESS'}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => this._togglePage('training')}
                        style={{borderBottomColor: page === 'training' ? AppColors.primary.yellow.hundredPercent : AppColors.white, borderBottomWidth: 2,}}
                        underlayColor={AppColors.transparent}
                    >
                        <Text oswaldMedium style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15),}}>{'TRAINING'}</Text>
                    </TouchableHighlight>
                </View>
                <Spacer size={20} />
                <Accordion
                    activeSections={page === 'readiness' ? readinessAccordionSection : trainingAccordionSection}
                    expandMultiple={true}
                    onChange={section => page === 'readiness' ? this._updateSections('readinessAccordionSection', section) : this._updateSections('trainingAccordionSection', section)}
                    renderContent={this._renderContent}
                    renderHeader={this._renderHeader}
                    sections={page === 'readiness' ? readinessSections : trainingSections}
                    underlayColor={AppColors.transparent}
                />
                <Spacer size={20} />
            </ScrollView>
        )
    }
}

AthleteComplianceModal.propTypes = {
    completedAtheltes:        PropTypes.array.isRequired,
    complianceColor:          PropTypes.string.isRequired,
    incompleteAtheltes:       PropTypes.array.isRequired,
    numOfCompletedAthletes:   PropTypes.number.isRequired,
    numOfIncompletedAthletes: PropTypes.number.isRequired,
    numOfTotalAthletes:       PropTypes.number.isRequired,
    toggleComplianceModal:    PropTypes.func.isRequired,
    trainingCompliance:       PropTypes.object.isRequired,
};

AthleteComplianceModal.defaultProps = {};

AthleteComplianceModal.componentName = 'AthleteComplianceModal';

/* Export Component ================================================================== */
export default AthleteComplianceModal;