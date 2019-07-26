/**
 * TrendChild
 *
    <TrendChild
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
import { BodyOverlay, Button, FathomModal, InViewPort, ParsedText, TabIcon, Text, } from '../custom';
import { AppUtil, PlanLogic, } from '../../lib';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import AppIntroSlider from 'react-native-app-intro-slider';
import Collapsible from 'react-native-collapsible';
import LottieView from 'lottie-react-native';

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
        fontSize:     AppFonts.scaleFont(15),
        marginBottom: AppSizes.paddingSml,
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
            isLottieVisible:  [],
            trendContext:     trendContextState,
        };
    }

    _checkLottieVisibility = (index, isVisible) => {
        let newIsLottieVisible = _.cloneDeep(this.state.isLottieVisible);
        if(isVisible) {
            if(!this.state.isLottieVisible[index]) {
                newIsLottieVisible[index] = true;
                this.setState({ isLottieVisible: newIsLottieVisible, });
            }
        } else {
            if(this.state.isLottieVisible[index]) {
                newIsLottieVisible[index] = false;
                this.setState({ isLottieVisible: newIsLottieVisible, });
            }
        }
    }

    _toggleTrendContext = key => {
        let newTrendContext = _.cloneDeep(this.state.trendContext);
        newTrendContext[key] = !newTrendContext[key];
        this.setState({ trendContext: newTrendContext, });
    }

    _renderItem = (props, selectedTrendCategory, selectedTrends) => {
        const { isLottieVisible, trendContext, } = this.state;
        let {
            bodyParts,
            bottomPadding,
            iconImage,
            parsedData,
            style,
            trendContextProps,
        } = PlanLogic.handleTrendChildItemRenderLogic(props, selectedTrendCategory, selectedTrends, trendContext, styles);
        // TODO: ADD FIRST TIME EXPERIENCE HERE
        // render item
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
                    <View style={{flex: 8,}} />
                    <View style={{flex: 1,}} />
                </View>

                <View style={{paddingHorizontal: (AppSizes.padding * 2), paddingVertical: AppSizes.paddingMed,}}>
                    <Text robotoBold style={{color: PlanLogic.returnBodyOverlayColorString(false, false, props.title_color), fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>
                        {props.title}
                    </Text>
                </View>

                <View style={[styles.card, {paddingBottom: AppSizes.paddingSml,}]}>
                    <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingSml,}}>
                        <Image
                            resizeMode={'contain'}
                            source={iconImage}
                            style={{height: 40, marginRight: AppSizes.paddingSml, width: 40,}}
                        />
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), lineHeight: AppFonts.scaleFont(23),}}>
                            {props.text[0]}
                        </Text>
                    </View>
                    <Collapsible
                        collapsed={!trendContextProps.isCollapsed}
                    >
                        {/* TODO: ADD VIDEO HERE */}
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), lineHeight: AppFonts.scaleFont(23),}}>
                            {props.text[1]}
                        </Text>
                    </Collapsible>
                    <View style={{alignItems: 'flex-end', paddingTop: AppSizes.paddingSml,}}>
                        <Animated.View style={[trendContextProps.animatedStyle,]}>
                            <TabIcon
                                color={AppColors.zeplin.slateLight}
                                icon={'chevron-down'}
                                onPress={() => this._toggleTrendContext(props.key)}
                                size={30}
                                type={'material-community'}
                            />
                        </Animated.View>
                    </View>
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
                    <Text robotoBold style={[styles.cardTitle, {color: PlanLogic.returnBodyOverlayColorString(false, false, props && props.trend_data ? props.trend_data.title_color : 0),}]}>
                        {props && props.trend_data ? props.trend_data.title : ''}
                    </Text>
                    <ParsedText
                        parse={parsedData}
                        style={[AppStyles.robotoLight, styles.cardText,]}
                    >
                        {props && props.trend_data ? props.trend_data.text : ''}
                    </ParsedText>
                </View>

                <InViewPort
                    onChange={isVisible => this._checkLottieVisibility(props.key, isVisible)}
                    style={{alignItems: 'center', flexDirection: 'row', marginBottom: AppSizes.paddingLrg, marginHorizontal: AppSizes.padding,}}
                >
                    <LottieView
                        autoPlay={isLottieVisible[props.key]}
                        loop={false}
                        progress={isLottieVisible[props.key] ? 1 : 0}
                        source={require('../../../assets/animation/trends-child-cta.json')}
                        style={{height: 40, width: 40,}}
                    />
                    <View style={{width: AppSizes.paddingMed,}} />
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, flex: 1, flexWrap: 'wrap', fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>
                        {'Your plan has been updated to help address these findings!'}
                    </Text>
                </InViewPort>

                <Button
                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.paddingSml,}}
                    containerStyle={{alignItems: 'center', marginBottom: bottomPadding,}}
                    onPress={() => AppUtil.pushToScene('myPlan')}
                    raised={true}
                    title={'Go to your plan'}
                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                />

                <FathomModal
                    isVisible={false}
                >
                    <View />
                </FathomModal>

            </ScrollView>
        );
    }

    render = () => {
        const { insightType, plan, } = this.props;
        let {
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
                    paginationStyle={{backgroundColor: AppColors.white, bottom: 0, left: 0, width: AppSizes.screen.width,}}
                    onSlideChange={index => this.setState({ currentCardIndex: index, })}
                    renderItem={props => this._renderItem(props, selectedTrendCategory[0], selectedTrends)}
                    scrollEnabled={true}
                    slides={selectedTrends}
                    showDoneButton={false}
                    showNextButton={false}
                    showPrevButton={false}
                    showSkipButton={false}
                />

            </View>
        );
    }
}

TrendChild.propTypes = {
    insightType: PropTypes.number.isRequired,
    plan:        PropTypes.object.isRequired,
    triggerType: PropTypes.number,
};

TrendChild.defaultProps = {
    triggerType: null,
};

TrendChild.componentName = 'TrendChild';

/* Export Component ================================================================== */
export default TrendChild;