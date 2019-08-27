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
import { BodyOverlay, FathomModal, ParsedText, Spacer, Text, } from './';
import { PlanLogic, } from '../../lib';

// import third-party libraries
import { Badge, Divider, } from 'react-native-elements';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    card: {
        backgroundColor: AppColors.white,
        borderRadius:    12,
        padding:         AppSizes.padding,
    },
    circleStyle: (circleSize, isSelected) => ({
        alignItems:      'center',
        backgroundColor: isSelected ? AppColors.zeplin.splashLight : `${AppColors.zeplin.splashLight}${PlanLogic.returnHexOpacity(0.15)}`,
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
    text: {
        ...AppStyles.robotoLight,
        color:    AppColors.zeplin.slate,
        fontSize: AppFonts.scaleFont(13),
    },
});

/* Component ==================================================================== */
const InsightIcon = ({
    insightType,
    isFTE,
    isSelected,
    isVisible,
    text,
    toggleModal = () => {},
}) => (
    <TouchableOpacity
        onPress={toggleModal}
        style={{alignItems: 'center', marginBottom: AppSizes.paddingSml, marginRight: AppSizes.paddingMed, justifyContent: 'center',}}
    >
        <View
            style={[
                AppStyles.scaleButtonShadowEffect,
                styles.circleStyle(45, isSelected),
                isVisible ? {} : {backgroundColor: AppColors.zeplin.superLight,},
            ]}
        >
            { isVisible ?
                <Image
                    source={
                        insightType === 6 && isSelected ?
                            require('../../../assets/images/standard/care-selected.png')
                            : insightType === 6 && !isSelected ?
                                require('../../../assets/images/standard/care.png')
                                : insightType === 5 && isSelected ?
                                    require('../../../assets/images/standard/prevention-selected.png')
                                    : insightType === 5 && !isSelected ?
                                        require('../../../assets/images/standard/prevention.png')
                                        : insightType === 4 && isSelected ?
                                            require('../../../assets/images/standard/recovery-selected.png')
                                            :
                                            require('../../../assets/images/standard/recovery.png')
                    }
                    style={{height: 30, width: 30,}}
                />
                :
                <Image
                    source={
                        insightType === 6 ?
                            require('../../../assets/images/standard/care-empty.png')
                            : insightType === 5 ?
                                require('../../../assets/images/standard/prevention-empty.png')
                                :
                                require('../../../assets/images/standard/recovery-empty.png')
                    }
                    style={{height: 30, width: 30,}}
                />
            }
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

    _renderCard = (item, index) => {
        let parsedData = [];
        if(item && item.text) {
            _.map(item.bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold,];
                parsedData.push(newParsedData);
            });
        }
        return (
            <View key={index} style={[AppStyles.scaleButtonShadowEffect, styles.card,]}>
                <ParsedText
                    parse={parsedData}
                    style={[styles.text,]}
                >
                    {item ? item.text : ''}
                </ParsedText>
            </View>
        );
    }

    _renderContent = (selectedCategory, text) => {
        if(!selectedCategory) {
            return (<View />);
        }
        let categoryTrend = selectedCategory.trends[0];
        let categoryData = categoryTrend.trend_data && categoryTrend.trend_data.data && categoryTrend.trend_data.data[0] ? categoryTrend.trend_data.data[0] : [];
        let bodyOverlayData = _.flatten(_.map(categoryData, (category, i) => {
            let clonedCategory = _.cloneDeep(category);
            return _.map(clonedCategory, newCategory => {
                let clonedNewCategory = _.cloneDeep(newCategory);
                clonedNewCategory.color = categoryTrend && categoryTrend.trend_data && categoryTrend.trend_data.visualization_data && categoryTrend.trend_data.visualization_data.plot_legends ?
                    _.find(categoryTrend.trend_data.visualization_data.plot_legends, ['series', i]).color
                    :
                    2;
                return clonedNewCategory;
            });
        }));
        console.log('selectedCategory',selectedCategory,categoryTrend);
        return (
            <View style={{margin: AppSizes.paddingMed,}}>
                <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(20),}}>
                    { selectedCategory.insight_type === 6 ?
                        'Care For Pain & Soreness'
                        : selectedCategory.insight_type === 5 ?
                            'Injury Prevention'
                            :
                            'Personalized Recovery'
                    }
                </Text>
                <Spacer size={AppSizes.paddingXSml} />
                { selectedCategory.visible ?
                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                        { selectedCategory.insight_type === 6 ?
                            'Pain and soreness alter your neuromuscular control. "Care" helps retain mobility and minimize the effects.'
                            : selectedCategory.insight_type === 5 ?
                                'Your data indicates imbalances in muscle activation & strength which may elevate overuse injury risk.'
                                :
                                'Based on your data, we\'ve identified ways to expedite tissue recovery with targeted care for stressed areas.'
                        }
                    </Text>
                    :
                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                        { selectedCategory.insight_type === 6 ?
                            'Because pain and soreness alter your neuro-muscular control, we design "Care" to minimize the effects of pain, soreness, and projected soreness.'
                            : selectedCategory.insight_type === 5 ?
                                'We haven\'t yet found signs of imbalances in your body which elevate injury risk. If we do, "Prevention" will help correct those underlying issues.'
                                :
                                'We\'re still looking for intelligent ways to expedite your recovery by up to 30%. When we discover an optimization, we\'ll add it to your "Recovery" plan.'
                        }
                    </Text>
                }
                <Spacer size={AppSizes.paddingSml} />
                <View style={{alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'flex-start',}}>
                    <BodyOverlay
                        bodyParts={bodyOverlayData}
                        remainingWidth={(AppSizes.screen.widthHalf)}
                    />
                    <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: AppSizes.paddingSml,}}>
                        {categoryTrend && categoryTrend.trend_data && categoryTrend.trend_data.visualization_data && categoryTrend.trend_data.visualization_data.plot_legends && _.map(categoryTrend.trend_data.visualization_data.plot_legends, (plot, i) =>
                            <View
                                key={i}
                                style={{flexDirection: 'row', marginBottom: AppSizes.paddingXSml,}}
                            >
                                <View style={{backgroundColor: PlanLogic.returnBodyOverlayColorString(false, false, plot.color), borderRadius: (10 / 2), height: 10, marginRight: AppSizes.paddingXSml, width: 10,}} />
                                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{plot.text}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <Spacer size={AppSizes.paddingSml} />
                { selectedCategory.visible ?
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(16),}}>
                        {`Your ${selectedCategory.insight_type === 6 ? 'Care' : selectedCategory.insight_type === 5 ? 'Prevention' : 'Recovery'} plan will:`}
                    </Text>
                    :
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(16),}}>
                        { selectedCategory.insight_type === 6 ?
                            'No Care needs identified:'
                            : selectedCategory.insight_type === 5 ?
                                'Searching for Prevention needs:'
                                :
                                'Searching for Recovery needs:'
                        }
                    </Text>
                }

                <Spacer size={AppSizes.paddingSml} />
                <View>
                    { categoryTrend && categoryTrend.trigger_tiles && categoryTrend.trigger_tiles.length > 0 ?
                        <Carousel
                            contentContainerCustomStyle={{alignItems: 'center', paddingVertical: AppSizes.paddingSml, justifyContent: 'center',}}
                            data={categoryTrend.trigger_tiles}
                            firstItem={0}
                            initialNumToRender={categoryTrend && categoryTrend.trigger_tiles ? categoryTrend.trigger_tiles.length : 0}
                            itemWidth={(AppSizes.screen.widthThreeQuarters)}
                            layout={'default'}
                            lockScrollWhileSnapping={true}
                            maxToRenderPerBatch={3}
                            // onSnapToItem={index => this._handleOnSwiped(index)}
                            // ref={ref => {this._swiperRef = ref;}}
                            removeClippedSubviews={false}
                            renderItem={({item, index}) => this._renderCard(item, index)}
                            sliderWidth={AppSizes.screen.width}
                            windowSize={3}
                        />
                        :
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingHorizontal: AppSizes.padding,}}>
                            <Image
                                resizeMode={'contain'}
                                source={require('../../../assets/images/standard/research.png')}
                                style={{alignSelf: 'center', height: 75, marginRight: AppSizes.paddingSml, width: 75,}}
                            />
                            <Text robotoLight style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>{'We\'re still looking for insights in your data to optimize your plan.'}</Text>
                        </View>
                    }
                </View>
                <Spacer size={AppSizes.paddingSml} />
                { selectedCategory.visible &&
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                        <Image
                            source={
                                selectedCategory.insight_type === 6 ?
                                    require('../../../assets/images/standard/care.png')
                                    : selectedCategory.insight_type === 5 ?
                                        require('../../../assets/images/standard/prevention.png')
                                        :
                                        require('../../../assets/images/standard/recovery.png')
                            }
                            style={{height: 15, marginRight: AppSizes.paddingXSml, width: 15,}}
                        />
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>
                            {`Look for ${selectedCategory.insight_type === 6 ? 'Care' : selectedCategory.insight_type === 5 ? 'Prevention' : 'Recovery'} in your plan`}
                        </Text>
                    </View>
                }
            </View>
        );
    }

    _renderTopNav = (selectedCareCategory, selectedPreventionCategory, selectedRecoveryCategory) => {
        const { user, } = this.props;
        return (
            <View onLayout={ev => {this._navBarHeight = ev.nativeEvent.layout.height;}}>
                <View style={{backgroundColor: AppColors.white, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                <View style={[styles.container,]}>
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                        <InsightIcon
                            insightType={6}
                            isFTE={selectedCareCategory ? selectedCareCategory.first_time_experience : false}
                            isSelected={this.state.selectedIndex === 6 && this.state.isModalOpen}
                            isVisible={selectedCareCategory ? selectedCareCategory.visible : false}
                            text={'Care'}
                            toggleModal={user && user.id ? () => this._toggleModal(6) : null}
                        />
                        <InsightIcon
                            insightType={4}
                            isFTE={selectedPreventionCategory ? selectedPreventionCategory.first_time_experience : false}
                            isSelected={this.state.selectedIndex === 4 && this.state.isModalOpen}
                            isVisible={selectedPreventionCategory ? selectedPreventionCategory.visible : false}
                            text={'Recovery'}
                            toggleModal={user && user.id ? () => this._toggleModal(4) : null}
                        />
                        <InsightIcon
                            insightType={5}
                            isFTE={selectedRecoveryCategory ? selectedRecoveryCategory.first_time_experience : false}
                            isSelected={this.state.selectedIndex === 5 && this.state.isModalOpen}
                            isVisible={selectedRecoveryCategory ? selectedRecoveryCategory.visible : false}
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
        let selectedCategory = _.find(categories, ['insight_type', selectedIndex]);
        let selectedCareCategory = _.find(categories, ['insight_type', 6]);
        let selectedPreventionCategory = _.find(categories, ['insight_type', 4]);
        let selectedRecoveryCategory = _.find(categories, ['insight_type', 5]);
        return (
            <View style={[AppStyles.scaleButtonShadowEffect,]}>
                {this._renderTopNav(selectedCareCategory, selectedPreventionCategory, selectedRecoveryCategory)}
                <FathomModal
                    animationIn={'slideInDown'}
                    animationOut={'slideOutUp'}
                    isVisible={isModalOpen}
                    onBackdropPress={() => this._toggleModal(null)}
                    // onSwipeComplete={() => this._toggleModal(null)}
                    propagateSwipe={true}
                    style={{justifyContent: 'flex-start',}}
                    // swipeDirection={'up'}
                >
                    <View>
                        {this._renderTopNav(selectedCareCategory, selectedPreventionCategory, selectedRecoveryCategory)}
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
