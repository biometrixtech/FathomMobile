/**
 * CustomMyPlanNavBar
 *
    <CustomMyPlanNavBar
        categories={trendCategories}
        handleReadInsight={insightType => handleReadInsight(insightType, user.id)}
        user={isReadinessSurveyCompleted && !isPageCalculating ? user : false}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { FathomModal, Spacer, Text, } from './';
import { PlanLogic, } from '../../lib';

// import third-party libraries
import { Badge, Divider, } from 'react-native-elements';
import _ from 'lodash';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    circleStyle: (circleSize, isSelected) => ({
        alignItems:      'center',
        backgroundColor: isSelected ? AppColors.zeplin.slateLight : AppColors.zeplin.slateXLight,
        borderRadius:    (circleSize / 2),
        height:          circleSize,
        justifyContent:  'center',
        marginBottom:    AppSizes.paddingXSml,
        width:           circleSize,
    }),
    container: {
        alignItems:        'center',
        backgroundColor:   AppColors.white,
        flexDirection:     'row',
        justifyContent:    'center',
        paddingHorizontal: AppSizes.paddingMed,
    },
    divider: {
        alignSelf:       'center',
        backgroundColor: AppColors.zeplin.slateLight,
        borderRadius:    10,
        height:          3,
        marginVertical:  AppSizes.paddingMed,
        width:           AppSizes.screen.widthThird,
    },
});

/* Component ==================================================================== */
const InsightIcon = ({
    isFTE,
    isSelected,
    text,
    toggleModal = () => {},
}) => (
    <TouchableOpacity
        onPress={toggleModal}
        style={{alignItems: 'center', marginBottom: AppSizes.paddingSml, marginRight: AppSizes.paddingMed, justifyContent: 'center',}}
    >
        <View style={[AppStyles.scaleButtonShadowEffect, styles.circleStyle(40, isSelected),]}>
            {/* TODO: IMAGE HERE*/}
        </View>
        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10), textAlign: 'center',}}>
            {text}
        </Text>
        { isFTE &&
            <Badge
                containerStyle={{
                    elevation: 5,
                    position:  'absolute',
                    right:     0,
                    top:       0,
                }}
                badgeStyle={{
                    backgroundColor: PlanLogic.returnInsightColorString(2),
                    minWidth:        14,
                    height:          14,
                    borderRadius:    (14 / 2),
                }}
                status={'success'}
            />
        }
    </TouchableOpacity>
);

class CustomMyPlanNavBar extends Component {
    static propTypes = {
        categories:        PropTypes.array,
        handleReadInsight: PropTypes.func.isRequired,
        user:              PropTypes.object.isRequired,
    };

    static defaultProps = {
        categories: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            isModalOpen:   false,
        };
        this._navBarHeight = 0;
    }

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content');
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor(AppColors.white);
        }
    }

    _renderContent = (selectedCategory, text) => {
        if(!selectedCategory) {
            return (<View />);
        }
        return (
            <View style={{margin: AppSizes.paddingSml,}}>
                <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(20),}}>{selectedCategory.title}</Text>
                <Spacer size={AppSizes.paddingXSml} />
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>{'HELLO'}</Text>
                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(16),}}>{'In your data, we\'ve identified'}</Text>
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{`Look for XYZ in your plan`}</Text>
            </View>
        );
    }

    _renderTopNav = () => {
        const { categories, user, } = this.props;
        let selectedCareCategory = _.find(categories, ['insight_type', 6]);
        let selectedPreventionCategory = _.find(categories, ['insight_type', 4]);
        let selectedRecoveryCategory = _.find(categories, ['insight_type', 5]);
        return (
            <View onLayout={ev => {this._navBarHeight = ev.nativeEvent.layout.height;}}>
                <View style={{backgroundColor: AppColors.white, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                <View style={[styles.container,]}>
                    <View style={{alignItems: 'center', flexDirection: 'row',}}>
                        <InsightIcon
                            isFTE={selectedCareCategory ? selectedCareCategory.first_time_experience : false}
                            isSelected={this.state.selectedIndex === 6 && this.state.isModalOpen}
                            text={'Care'}
                            toggleModal={user && user.id ? () => this._toggleModal(6) : null}
                        />
                        <InsightIcon
                            isFTE={selectedPreventionCategory ? selectedPreventionCategory.first_time_experience : false}
                            isSelected={this.state.selectedIndex === 4 && this.state.isModalOpen}
                            text={'Recovery'}
                            toggleModal={user && user.id ? () => this._toggleModal(4) : null}
                        />
                        <InsightIcon
                            isFTE={selectedRecoveryCategory ? selectedRecoveryCategory.first_time_experience : false}
                            isSelected={this.state.selectedIndex === 5 && this.state.isModalOpen}
                            text={'Prevention'}
                            toggleModal={user && user.id ? () => this._toggleModal(5) : null}
                        />
                    </View>
                    <Image
                        source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                        style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 1, justifyContent: 'center',}]}
                    />
                </View>
            </View>
        );
    };

    _toggleModal = index => {
        const { categories, handleReadInsight, } = this.props;
        let newModalState = index === null ? false : (index !== this.state.selectedIndex || !this.state.isModalOpen);
        this.setState(
            { isModalOpen: newModalState, selectedIndex: index, },
            () => {
                if(
                    index &&
                    _.find(categories, ['insight_type', index]) &&
                    _.find(categories, ['insight_type', index]).first_time_experience
                ) {
                    handleReadInsight(index);
                }
            }
        );
    }

    render = () => {
        const { categories, } = this.props;
        const { selectedIndex, isModalOpen, } = this.state;
        console.log('categories',categories);
        let selectedCategory = _.find(categories, ['insight_type', selectedIndex]);
        console.log('selectedCategory',selectedCategory);
        return (
            <View style={[AppStyles.scaleButtonShadowEffect,]}>
                {this._renderTopNav()}
                <FathomModal
                    animationIn={'slideInDown'}
                    animationOut={'slideOutUp'}
                    isVisible={isModalOpen}
                    onBackdropPress={() => this._toggleModal(null)}
                    onSwipeComplete={() => this._toggleModal(null)}
                    style={{justifyContent: 'flex-start',}}
                    swipeDirection={'up'}
                >
                    <View>
                        {this._renderTopNav()}
                        <View style={{backgroundColor: AppColors.white, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,}}>
                            {this._renderContent(selectedCategory)}
                            <TouchableWithoutFeedback onPress={() => this._toggleModal(null)}>
                                <View>
                                    <Divider style={[styles.divider,]} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </FathomModal>
            </View>
        );
    }

}

/* Export Component ==================================================================== */
export default CustomMyPlanNavBar;
