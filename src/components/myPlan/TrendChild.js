/**
 * TrendChild
 *
    <TrendChild
        clearFTECategory={clearFTECategory}
        clearFTEView={clearFTEView}
        insightType={insightType}
        plan={plan}
        triggerType={triggerType}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { BodyOverlay, Button, FathomModal, ParsedText, Spacer, TabIcon, Text, } from '../custom';
import { AppUtil, PlanLogic, } from '../../lib';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import AppIntroSlider from 'react-native-app-intro-slider';
import Collapsible from 'react-native-collapsible';
import Video from 'react-native-video';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    card: {
        backgroundColor:  AppColors.white,
        borderRadius:     15,
        elevation:        2,
        marginHorizontal: AppSizes.padding,
        shadowColor:      'rgba(0, 0, 0, 0.16)',
        shadowOffset:     { height: 3, width: 0, },
        shadowOpacity:    1,
        shadowRadius:     6,
        padding:          AppSizes.padding,
    },
    cardText: {
        color:    AppColors.zeplin.slate,
        fontSize: AppFonts.scaleFont(13),
    },
    cardTitle: {
        color:        AppColors.zeplin.slate,
        flex:         1,
        fontSize:     AppFonts.scaleFont(16),
        marginBottom: AppSizes.paddingXSml,
    },
});

/* Component ==================================================================== */
class TrendChild extends PureComponent {
    constructor(props) {
        super(props);
        const { insightType, plan, } = this.props;
        let { trendContextState, } = PlanLogic.handleTrendChildRenderLogic(insightType, plan);
        this.state  = {
            currentCardIndex: 0,
            trendContext:     trendContextState,
        };
        this._videos = [];
    }

    componentWillUnmount = () => {
        this._videos = [];
    }

    _handleFTEClick = (insightType, visualizationType, isCategory, props, callback) => {
        const { clearFTECategory, clearFTEView, plan, } = this.props;
        let newDailyPlan = _.cloneDeep(plan.dailyPlan[0]);
        if(isCategory) {
            newDailyPlan.trends.trend_categories[0].first_time_experience = false;
            clearFTECategory(newDailyPlan, insightType);
        } else if(!isCategory && newDailyPlan.trends.trend_categories[0].trends[props.key].first_time_experience) {
            newDailyPlan.trends.trend_categories[0].trends[props.key].first_time_experience = false;
            clearFTEView(newDailyPlan, insightType, visualizationType);
        }
        if(callback) {
            callback();
        }
    }

    _toggleTrendContext = (key, value, callback) => {
        let newTrendContext = _.cloneDeep(this.state.trendContext);
        newTrendContext[key][value] = !newTrendContext[key][value];
        // if(!newTrendContext[key][value]) {
        //     this._videos[key].seek(0);
        // }
        this.setState(
            { trendContext: newTrendContext, },
            () => callback && callback(),
        );
    }

    _renderItem = (props, selectedTrendCategory, selectedTrends, dashboardTrendCategories) => {
        const { trendContext, } = this.state;
        let {
            bodyParts,
            bottomPadding,
            iconImage,
            parsedData,
            style,
            trendCategoryTitle,
            trendContextProps,
        } = PlanLogic.handleTrendChildItemRenderLogic(props, selectedTrendCategory, selectedTrends, dashboardTrendCategories, trendContext, styles);
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                bounces={false}
                contentContainerStyle={[style,]}
                nestedScrollEnabled={true}
                key={`trend-${props.key}`}
            >

                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                    <View style={{flex: 1,}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => Actions.pop()}
                        >
                            <TabIcon
                                color={AppColors.zeplin.slateLight}
                                icon={'chevron-left'}
                                size={40}
                                type={'material-community'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 8,}}>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), textAlign: 'center',}}>{trendCategoryTitle}</Text>
                    </View>
                    <View style={{flex: 1,}} />
                </View>

                <View style={{paddingHorizontal: (AppSizes.padding * 2), paddingVertical: AppSizes.paddingMed,}}>
                    <Text robotoBold style={{color: PlanLogic.returnBodyOverlayColorString(false, false, props.title_color), fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                        {props.title}
                    </Text>
                </View>

                <View style={[styles.card, {paddingBottom: AppSizes.paddingSml,}]}>
                    <View style={{alignItems: 'center', flexDirection: 'row',}}>
                        <Image
                            resizeMode={'contain'}
                            source={iconImage}
                            style={{height: 40, marginRight: AppSizes.paddingSml, width: 40,}}
                        />
                        <Text
                            numberOfLines={trendContextProps.isCollapsed ? 2 : 0}
                            robotoLight
                            style={{color: AppColors.zeplin.slate, flex: 1, fontSize: AppFonts.scaleFont(13), lineHeight: AppFonts.scaleFont(23),}}
                        >
                            {props.text[0]}
                        </Text>
                    </View>
                    <Collapsible
                        collapsed={trendContextProps.isCollapsed}
                    >
                        <View style={{marginVertical: AppSizes.paddingSml,}}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this._toggleTrendContext(props.key, 'isPaused')}
                                style={{
                                    backgroundColor: trendContextProps.isPaused ? `${AppColors.zeplin.slate}CC` : AppColors.transparent,
                                    height:          '100%',
                                    position:        'absolute',
                                    width:           '100%',
                                    zIndex:          100,
                                }}
                            >
                                { trendContextProps.isPaused &&
                                    <TabIcon
                                        color={AppColors.white}
                                        containerStyle={[{height: '100%', justifyContent: 'center',}]}
                                        icon={'play-arrow'}
                                        size={50}
                                    />
                                }
                            </TouchableOpacity>
                            <Video
                                muted={trendContextProps.isVideoMuted}
                                paused={trendContextProps.isPaused}
                                ref={ref => {this._videos[props.key] = ref;}}
                                repeat={true}
                                resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                                source={{uri: props.video_url}}
                                style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {height: AppSizes.screen.heightFifth,}]}
                            />
                        </View>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), lineHeight: AppFonts.scaleFont(23),}}>
                            {props.text[1]}
                        </Text>
                    </Collapsible>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this._handleFTEClick(
                            selectedTrendCategory.insight_type,
                            props.visualization_type,
                            false,
                            props,
                            () => this._toggleTrendContext(
                                props.key,
                                'isCollapsed',
                                () => !trendContextProps.isCollapsed && !trendContextProps.isPaused ?
                                    this._toggleTrendContext(props.key, 'isPaused')
                                    :
                                    null,
                            ),
                        )}
                        style={{alignItems: 'flex-end',}}
                    >
                        <TabIcon
                            color={AppColors.zeplin.slateLight}
                            icon={trendContextProps.isCollapsed ? 'chevron-down' : 'chevron-up'}
                            size={30}
                            type={'material-community'}
                        />
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, {marginTop: AppSizes.padding, marginBottom: AppSizes.paddingLrg,}]}>
                    <BodyOverlay
                        bodyParts={bodyParts}
                        remainingWidth={(AppSizes.screen.width - (AppSizes.padding * 4))}
                    />
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.paddingXSml,}}>
                        {props && props.trend_data && _.map(props.trend_data.visualization_data.plot_legends, (plot, i) =>
                            <View
                                key={i}
                                style={[props && props.trend_data && i !== props.trend_data.visualization_data.plot_legends.length ? {marginRight: AppSizes.paddingSml,} : {}, {flexDirection: 'row',}]}
                            >
                                <View style={{backgroundColor: PlanLogic.returnBodyOverlayColorString(false, false, plot.color), borderRadius: (10 / 2), height: 10, marginRight: AppSizes.paddingXSml, width: 10,}} />
                                <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(10),}}>{plot.text}</Text>
                            </View>
                        )}
                    </View>
                    <View style={{backgroundColor: AppColors.zeplin.superLight, height: 2, marginVertical: AppSizes.padding,}} />
                    <Text robotoLight style={[styles.cardTitle,]}>
                        {props && props.trend_data ? props.trend_data.title : ''}
                    </Text>
                    <ParsedText
                        parse={parsedData}
                        style={[AppStyles.robotoLight, styles.cardText,]}
                    >
                        {props && props.trend_data ? props.trend_data.text : ''}
                    </ParsedText>
                </View>

                <View style={{alignItems: 'center', marginBottom: AppSizes.paddingLrg, marginHorizontal: AppSizes.padding,}}>
                    <Image
                        resizeMode={'contain'}
                        source={require('../../../assets/images/standard/planupdated.png')}
                        style={{height: 75, width: 75,}}
                    />
                    <Spacer size={AppSizes.paddingMed} />
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, flexWrap: 'wrap', fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>
                        {'Your plan has been updated to help address these findings!'}
                    </Text>
                </View>

                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml,}}
                    containerStyle={{alignItems: 'center', marginBottom: bottomPadding,}}
                    onPress={() => AppUtil.pushToScene('myPlan')}
                    raised={Platform.OS === 'ios'}
                    title={'Go to your plan'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                />

            </ScrollView>
        );
    }

    render = () => {
        const { insightType, plan, } = this.props;
        let {
            dashboardTrendCategories,
            fteModalData,
            isFTECategoryModalOpen,
            selectedTrendCategory,
            selectedTrends,
        } = PlanLogic.handleTrendChildRenderLogic(insightType, plan);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1,}}>

                <View style={{backgroundColor: AppColors.white, height: AppSizes.statusBarHeight,}} />

                <AppIntroSlider
                    activeDotStyle={{backgroundColor: AppColors.zeplin.slate,}}
                    dotStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                    hidePagination={selectedTrends.length === 1 || selectedTrends.length === 0}
                    paginationStyle={[AppSizes.isIphoneX ? {paddingBottom: AppSizes.paddingSml,} : {}, {backgroundColor: AppColors.white, bottom: 0, left: 0, width: AppSizes.screen.width,}]}
                    onSlideChange={index => this.setState({ currentCardIndex: index, })}
                    renderItem={props => this._renderItem(props, selectedTrendCategory[0], selectedTrends, dashboardTrendCategories)}
                    scrollEnabled={true}
                    slides={selectedTrends}
                    showDoneButton={false}
                    showNextButton={false}
                    showPrevButton={false}
                    showSkipButton={false}
                />

                <FathomModal
                    isVisible={isFTECategoryModalOpen}
                >
                    <View style={{backgroundColor: AppColors.white, borderRadius: 12, marginHorizontal: AppSizes.padding, paddingHorizontal: AppSizes.paddingMed, paddingVertical: AppSizes.padding,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>{fteModalData.title}</Text>
                        <Spacer size={AppSizes.padding} />
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{fteModalData.body}</Text>
                        <Spacer size={AppSizes.padding} />
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                            {_.map(fteModalData.categories, (category, index) => {
                                let imageSource = false;
                                switch (category.image) {
                                case 'view1icon.png':
                                    imageSource = require('../../../assets/images/standard/view1icon.png');
                                    break;
                                case 'view3icon.png':
                                    imageSource = require('../../../assets/images/standard/view3icon.png');
                                    break;
                                default:
                                    imageSource = require('../../../assets/images/standard/view1icon.png');
                                }
                                return (
                                    <View key={index} style={[{alignItems: 'center',}, index % 2 === 0 ? {marginRight: AppSizes.paddingSml,} : {}]}>
                                        <Image
                                            resizeMode={'contain'}
                                            source={imageSource}
                                            style={{height: 50, width: 50,}}
                                        />
                                        <Spacer size={AppSizes.paddingXSml} />
                                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(11), textAlign: 'center',}}>{category.title}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <Spacer size={AppSizes.padding} />
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>{fteModalData.subtext}</Text>
                        <Spacer size={AppSizes.paddingLrg} />
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml,}}
                            containerStyle={{alignItems: 'center',}}
                            onPress={() => this._handleFTEClick(selectedTrendCategory[0].insight_type, false, true)}
                            raised={Platform.OS === 'ios'}
                            title={'Continue'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(23),}}
                        />
                    </View>
                </FathomModal>

            </View>
        );
    }
}

TrendChild.propTypes = {
    clearFTECategory: PropTypes.func.isRequired,
    clearFTEView:     PropTypes.func.isRequired,
    insightType:      PropTypes.number.isRequired,
    plan:             PropTypes.object.isRequired,
    triggerType:      PropTypes.number,
};

TrendChild.defaultProps = {
    triggerType: null,
};

TrendChild.componentName = 'TrendChild';

/* Export Component ================================================================== */
export default TrendChild;