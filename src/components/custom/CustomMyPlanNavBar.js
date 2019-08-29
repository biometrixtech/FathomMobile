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
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { BodyOverlay, FathomModal, ParsedText, Spacer, TabIcon, Text, } from './';
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
        padding:         AppSizes.paddingSml,
    },
    circleStyle: circleSize => ({
        ...AppStyles.scaleButtonShadowEffect,
        alignItems:     'center',
        borderRadius:   (circleSize / 2),
        height:         circleSize,
        justifyContent: 'center',
        marginBottom:   AppSizes.paddingXSml,
        width:          circleSize,
    }),
    container: {
        alignItems:        'center',
        backgroundColor:   AppColors.white,
        flexDirection:     'row',
        justifyContent:    'center',
        paddingHorizontal: AppSizes.paddingMed,
        paddingVertical:   AppSizes.paddingSml,
    },
    divider: {
        alignSelf:       'center',
        backgroundColor: AppColors.zeplin.slateLight,
        borderRadius:    10,
        height:          3,
        marginBottom:    AppSizes.paddingMed,
        width:           AppSizes.screen.widthThird,
    },
    notVisibleCircleStyle: isSelected => ({
        backgroundColor: isSelected ? AppColors.zeplin.slateLight : AppColors.zeplin.superLight,
    }),
    text: {
        ...AppStyles.robotoLight,
        color:    AppColors.zeplin.slate,
        fontSize: AppFonts.scaleFont(13),
    },
    visibleCircleStyle: isSelected => ({
        backgroundColor: isSelected ? AppColors.zeplin.splashLight : AppColors.zeplin.splashXXLight,
    }),
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
        style={{alignItems: 'center', justifyContent: 'center',}}
    >
        <View
            style={[
                styles.circleStyle(45),
                isVisible ?
                    styles.visibleCircleStyle(isSelected)
                    :
                    styles.notVisibleCircleStyle(isSelected),
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
        {/*<Text
            style={[
                isVisible && isSelected ?
                    { ...AppStyles.robotoBold, color: AppColors.zeplin.splashLight, }
                    : !isVisible && isSelected ?
                        { ...AppStyles.robotoBold, color: AppColors.zeplin.slateLight, }
                        :
                        { ...AppStyles.robotoRegular, color: AppColors.zeplin.slateLight, },
                { fontSize: AppFonts.scaleFont(10), textAlign: 'center', }
            ]}
        >
            {text}
        </Text>*/}
        { (isFTE && isVisible) &&
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
            isModalOpen:        false,
            modalContentHeight: 0,
            selectedIndex:      0,
        };
        this._navBarHeight = 0;
        this._swiperRef = {};
    }

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content');
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor(AppColors.white);
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this._swiperRef && this._swiperRef.snapToItem && this.state.isModalOpen && prevState.selectedIndex !== this.state.selectedIndex) {
            _.delay(() => this._swiperRef.snapToItem(0), 250);
        }
    }

    _renderCard = (item, index) => {
        let parsedData = [];
        if(item && item.text) {
            _.map(item.bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold, {color: PlanLogic.returnInsightColorString(prop.color),}];
                parsedData.push(newParsedData);
            });
        }
        let imageSource = null;
        let iconSource = null;
        if([11, 12, 13, 14, 15, 23, 24].includes(item.trigger_type)) {
            iconSource = { icon: 'md-body', type: 'ionicon', };
        } else if([16, 19].includes(item.trigger_type)) {
            iconSource = { icon: 'timeline', type: 'material', };
        } else if([110, 111].includes(item.trigger_type)) {
            imageSource = require('../../../assets/images/standard/apt.png');
        } else {
            switch (item.trigger_type) {
            case 0:
                let filteredSportName = _.filter(MyPlanConstants.teamSports, s => s.index === item.sport_name);
                imageSource = filteredSportName && filteredSportName[0] && filteredSportName[0].imagePath ? filteredSportName[0].imagePath : null;
                break;
            default:
                iconSource = null;
                imageSource = null;
            }
        }
        let statisticText1 = (item.statistic_text && item.statistic_text.length > 0) ?
            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18),}}>
                {item.bold_statistic_text[0] ? item.bold_statistic_text[0].text : ''}
            </Text>
            :
            null;
        let statisticText2 = (item.statistic_text && item.statistic_text.length > 0) ?
            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(10),}}>
                {item.statistic_text.replace(`${item.bold_statistic_text[0] ? item.bold_statistic_text[0].text : ''} `, '')}
            </Text>
            :
            null;
        return (
            <View key={index} style={[AppStyles.scaleButtonShadowEffect, styles.card,]}>
                <View
                    style={{
                        backgroundColor: `${PlanLogic.returnInsightColorString(item.bold_text[0].color)}${PlanLogic.returnHexOpacity(0.15)}`,
                        borderRadius:    10,
                        height:          ((AppSizes.paddingSml * 2) + (AppFonts.scaleFont(15) * 2)),
                        justifyContent:  'center',
                        padding:         AppSizes.paddingSml,
                    }}
                >
                    <ParsedText
                        parse={parsedData}
                        style={[styles.text, {lineHeight: AppFonts.scaleFont(15),}]}
                    >
                        {item ? item.text : ''}
                    </ParsedText>
                </View>
                <Spacer size={AppSizes.paddingSml} />
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingSml,}}>
                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(10), width: '40%',}}>{item.description}</Text>
                    <View style={{width: '7%'}} />
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', width: '10%',}}>
                        <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.superLight, borderRadius: (28 / 2), height: 28, justifyContent: 'center', width: 28,}}>
                            { imageSource ?
                                <Image
                                    source={imageSource}
                                    style={{height: 22, tintColor: AppColors.zeplin.slateLight, width: 22,}}
                                />
                                : iconSource ?
                                    <TabIcon
                                        color={AppColors.zeplin.slateLight}
                                        icon={iconSource.icon}
                                        size={22}
                                        type={iconSource.type}
                                    />
                                    :
                                    null
                            }
                        </View>
                    </View>
                    <View style={{width: '3%'}} />
                    <View style={{alignSelf: 'flex-end', flex: 1, width: '40%',}}>
                        {statisticText1}
                        {statisticText2}
                    </View>
                </View>
            </View>
        );
    }

    _renderContent = (selectedCategory, text) => {
        if(!selectedCategory) {
            return (<View />);
        }
        const { modalContentHeight, } = this.state;
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
        let bodyOverlayHeightMultiplier = (modalContentHeight && modalContentHeight > 0 && (AppSizes.screen.height - modalContentHeight) <= (AppSizes.paddingXLrg) ? 0.8 : 1);
        let remainingBodyOverlayWidth = (AppSizes.screen.widthTwoThirds * bodyOverlayHeightMultiplier);
        return (
            <View style={{marginBottom: AppSizes.padding, marginTop: AppSizes.paddingMed,}}>
                <View style={{marginHorizontal: AppSizes.paddingMed,}}>
                    { selectedCategory.visible ?
                        <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(20),}}>
                            { selectedCategory.insight_type === 6 ?
                                'Care For Pain & Soreness'
                                : selectedCategory.insight_type === 5 ?
                                    'Injury Prevention'
                                    :
                                    'Personalized Recovery'
                            }
                        </Text>
                        :
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(20),}}>
                            { selectedCategory.insight_type === 6 ?
                                'Searching for Care Insights'
                                : selectedCategory.insight_type === 5 ?
                                    'Searching for Prevention Insights'
                                    :
                                    'Searching for Recovery Insights'
                            }
                        </Text>
                    }
                    <Spacer size={AppSizes.paddingXSml} />
                    { selectedCategory.visible ?
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                            { selectedCategory.insight_type === 6 ?
                                'Pain & soreness change the way you move and distribute force. "Care" improves mobility & reduces those effects.'
                                : selectedCategory.insight_type === 5 ?
                                    'Your data indicates imbalances in muscle activation & strength which may elevate overuse injury risk.'
                                    :
                                    'Based on your data, we\'ve identified ways to expedite tissue recovery with targeted care for stressed areas.'
                            }
                        </Text>
                        :
                        <View style={{alignItems: 'center', justifyContent: 'center',}}>
                            <Image
                                source={
                                    selectedCategory.insight_type === 6 ?
                                        require('../../../assets/images/standard/care-not-visible.png')
                                        : selectedCategory.insight_type === 5 ?
                                            require('../../../assets/images/standard/prevention-not-visible.png')
                                            :
                                            require('../../../assets/images/standard/recovery-not-visible.png')
                                }
                                style={{height: 100, marginVertical: AppSizes.paddingLrg, width: 100,}}
                            />
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}>
                                { selectedCategory.insight_type === 6 ?
                                    'We use a research-validated approach to help heal areas of pain and soreness and keep symptoms from worsening.'
                                    : selectedCategory.insight_type === 5 ?
                                        'Keep using your sensors and logging your workouts, pain and soreness to help our AI find underlying injury risk factors.'
                                        :
                                        'Keep using your sensors and logging your workouts. Our AI searches for daily optimizations for your tissue recovery.'
                                }
                            </Text>
                            <Spacer size={AppSizes.paddingMed} />
                            { selectedCategory.insight_type === 6 ?
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                    <Image
                                        source={require('../../../assets/images/standard/sorepain.png')}
                                        style={{height: 40, width: 40,}}
                                    />
                                </View>
                                : selectedCategory.insight_type === 5 ?
                                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                        <Image
                                            source={require('../../../assets/images/standard/load.png')}
                                            style={{height: 40, marginRight: AppSizes.padding, width: 40,}}
                                        />
                                        <Image
                                            source={require('../../../assets/images/standard/trend.png')}
                                            style={{height: 40, marginRight: AppSizes.padding, width: 40,}}
                                        />
                                        <Image
                                            source={require('../../../assets/images/standard/sorepain.png')}
                                            style={{height: 40, marginRight: AppSizes.padding, width: 40,}}
                                        />
                                        <Image
                                            source={require('../../../assets/images/standard/sensorsession.png')}
                                            style={{height: 40, width: 40,}}
                                        />
                                    </View>
                                    :
                                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                        <Image
                                            source={require('../../../assets/images/standard/load.png')}
                                            style={{height: 40, marginRight: AppSizes.padding, width: 40,}}
                                        />
                                        <Image
                                            source={require('../../../assets/images/standard/trend.png')}
                                            style={{height: 40, marginRight: AppSizes.padding, width: 40,}}
                                        />
                                        <Image
                                            source={require('../../../assets/images/standard/sensorsession.png')}
                                            style={{height: 40, width: 40,}}
                                        />
                                    </View>
                            }
                            <Spacer size={AppSizes.paddingMed} />
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}>
                                { selectedCategory.insight_type === 6 ?
                                    'Your unique combination of daily pain & soreness informs your Care activities.'
                                    : selectedCategory.insight_type === 5 ?
                                        'These factors are used to design your personalized Injury Prevention activities.'
                                        :
                                        'These factors are used to design your optimal Personalized Recovery activities.'
                                }
                            </Text>
                        </View>
                    }
                    { selectedCategory.visible &&
                        <View>
                            <Spacer size={AppSizes.padding} />
                            <View style={{alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'flex-start',}}>
                                <BodyOverlay
                                    bodyParts={bodyOverlayData}
                                    remainingWidth={remainingBodyOverlayWidth}
                                />
                                <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: AppSizes.padding,}}>
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
                            <Spacer size={AppSizes.padding} />
                            <View style={{alignItems: 'center', flexDirection: 'row',}}>
                                <Image
                                    source={
                                        selectedCategory.visible ?
                                            selectedCategory.insight_type === 6 ?
                                                require('../../../assets/images/standard/care.png')
                                                : selectedCategory.insight_type === 5 ?
                                                    require('../../../assets/images/standard/prevention.png')
                                                    :
                                                    require('../../../assets/images/standard/recovery.png')
                                            :
                                            selectedCategory.insight_type === 6 ?
                                                require('../../../assets/images/standard/care-empty.png')
                                                : selectedCategory.insight_type === 5 ?
                                                    require('../../../assets/images/standard/prevention-empty.png')
                                                    :
                                                    require('../../../assets/images/standard/recovery-empty.png')
                                    }
                                    style={{height: 15, marginRight: AppSizes.paddingXSml, width: 15,}}
                                />
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
                            </View>
                            <Spacer size={AppSizes.paddingSml} />
                        </View>
                    }
                </View>
                { selectedCategory.visible &&
                    <View>
                        { categoryTrend && categoryTrend.trigger_tiles && categoryTrend.trigger_tiles.length > 0 ?
                            <Carousel
                                activeSlideAlignment={'start'}
                                contentContainerCustomStyle={{alignItems: 'center', paddingLeft: AppSizes.paddingMed, paddingVertical: AppSizes.paddingSml, justifyContent: 'center',}}
                                data={categoryTrend.trigger_tiles}
                                firstItem={0}
                                initialNumToRender={categoryTrend && categoryTrend.trigger_tiles ? categoryTrend.trigger_tiles.length : 0}
                                itemWidth={(AppSizes.screen.widthThreeQuarters)}
                                layout={'default'}
                                lockScrollWhileSnapping={true}
                                maxToRenderPerBatch={3}
                                ref={ref => {this._swiperRef = ref;}}
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
                    <View style={{alignItems: 'flex-start', flex: 6, flexDirection: 'row', justifyContent: 'space-between', marginRight: AppSizes.padding,}}>
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
                        style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 4, justifyContent: 'center',}]}
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
                    onSwipeComplete={() => this._toggleModal(null)}
                    style={{justifyContent: 'flex-start',}}
                >
                    <View onLayout={ev => this.setState({ modalContentHeight: ev.nativeEvent.layout.height, })}>
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
