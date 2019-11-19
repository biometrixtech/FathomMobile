/**
 * CustomMyPlanNavBar
 *
    <CustomMyPlanNavBar
        categories={trendCategories}
        handleReadInsight={insightType => handleReadInsight(insightType, user.id)}
        toggleLogSymptomsModal={() => this.setState({ isLogSymptomsModalOpen: true, })}
        user={isReadinessSurveyCompleted && !isPageCalculating ? user : false}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, Platform, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import resolveAssetSource from 'resolveAssetSource';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../constants';
import { BodyOverlay, Button, FathomModal, ParsedText, Spacer, TabIcon, Text, } from './';
import { PlanLogic, } from '../../lib';

// import third-party libraries
import { Badge, Divider, } from 'react-native-elements';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    card: {
        backgroundColor:   AppColors.white,
        borderRadius:      12,
        paddingHorizontal: AppSizes.padding,
        paddingVertical:   AppSizes.paddingSml,
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
    pillText: (color, isSelected) => ({
        color:    isSelected ? AppColors.white : PlanLogic.returnInsightColorString(color),
        fontSize: AppFonts.scaleFont(14),
    }),
    pillWrapper: (color, isLast, isSelected) => ({
        alignItems:        'center',
        backgroundColor:   `${PlanLogic.returnInsightColorString(color)}${PlanLogic.returnHexOpacity(isSelected ? 1 : 0.15)}`,
        borderRadius:      100,
        justifyContent:    'center',
        marginRight:       AppSizes.paddingMed,
        paddingHorizontal: AppSizes.paddingMed,
        paddingVertical:   AppSizes.paddingXSml,
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

class CustomMyPlanNavBar extends PureComponent {
    static propTypes = {
        categories:             PropTypes.array,
        handleReadInsight:      PropTypes.func.isRequired,
        toggleLogSymptomsModal: PropTypes.func.isRequired,
        user:                   PropTypes.object.isRequired,
    };

    static defaultProps = {
        categories: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen:           false,
            modalContentHeight:    0,
            selectedCategoryIndex: null,
            selectedIndex:         0,
            slideIndex:            0,
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

    _renderCard = (item, index, selectedCategoryData, dataLength) => {
        let parsedData = [];
        if(selectedCategoryData.active && item && item.title) {
            parsedData = _.map(item.bold_title, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold, {color: PlanLogic.returnInsightColorString(prop.color),}];
                return newParsedData;
            });
        }
        let titleColorEnum = parsedData.length > 0 ? item.bold_title[0].color : selectedCategoryData.color;
        let titleColor = selectedCategoryData.active ? PlanLogic.returnInsightColorString(titleColorEnum) : AppColors.zeplin.slateLight;
        return (
            <View key={index} style={[AppStyles.scaleButtonShadowEffect, styles.card,]}>
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                    { selectedCategoryData.active ?
                        <ParsedText
                            parse={parsedData || []}
                            style={{...AppStyles.robotoBold, color: titleColor, fontSize: AppFonts.scaleFont(13),}}
                        >
                            {item.title}
                        </ParsedText>
                        :
                        <Text robotoBold style={{color: titleColor, fontSize: AppFonts.scaleFont(13),}}>
                            {item.title}
                        </Text>
                    }
                    { (selectedCategoryData && selectedCategoryData.active) &&
                        <Text robotoRegular style={{color: AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(12),}}>
                            {`${(index + 1)}/${dataLength}`}
                        </Text>
                    }
                </View>
                <Spacer size={AppSizes.paddingSml} />
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{item.text}</Text>
            </View>
        );
    }

    _renderContent = (selectedCategory, text) => {
        if(!selectedCategory) {
            return (<View />);
        }
        const { toggleLogSymptomsModal, user, } = this.props;
        const { selectedCategoryIndex, slideIndex, } = this.state;
        const has3SensorConnected = user && user.sensor_data && user.sensor_data.system_type === '3-sensor' && user.sensor_data.mobile_udid && user.sensor_data.sensor_pid;
        if(!selectedCategory.active) {
            let emptyStateImage =  require('../../../assets/images/standard/insights-empty.png');
            let emptyStateImageSource = resolveAssetSource(emptyStateImage);
            let emptyStateImageWidth = (AppSizes.screen.width - (AppSizes.padding * 2));
            let emptyStateImageHeight = emptyStateImageSource.height * (emptyStateImageWidth / emptyStateImageSource.width);
            return (
                <View style={{marginBottom: AppSizes.padding, marginHorizontal: AppSizes.padding, marginTop: AppSizes.paddingMed,}}>
                    <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(20), textAlign: 'left',}}>
                        {selectedCategory.empty_state_header}
                    </Text>
                    <ImageBackground
                        resizeMode={'contain'}
                        source={require('../../../assets/images/standard/insights-empty.png')}
                        style={{alignItems: 'center', height: emptyStateImageHeight, justifyContent: 'center', width: emptyStateImageWidth,}}
                    >
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}>
                            {has3SensorConnected ? selectedCategory.empty_context_sensors_enabled : selectedCategory.empty_context_sensors_not_enabled}
                        </Text>
                        { (selectedCategory.empty_state_cta !== '' || (selectedCategory.empty_state_cta && selectedCategory.empty_state_cta && selectedCategory.empty_state_cta.length > 0)) ?
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: '60%',}}
                                onPress={() => this._toggleModal(null, () => _.delay(() => toggleLogSymptomsModal(), 200))}
                                raised={true}
                                title={selectedCategory.empty_state_cta}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                            />
                            :
                            null
                        }
                    </ImageBackground>
                </View>
            );
        }
        const { modalContentHeight, } = this.state;
        let categoryTrendData = selectedCategory.trend_data;
        let bodyOverlayHeightMultiplier = (modalContentHeight && modalContentHeight > 0 && (AppSizes.screen.height - modalContentHeight) <= (AppSizes.paddingXLrg) ? 0.8 : 1);
        let remainingBodyOverlayWidth = (AppSizes.screen.widthTwoThirds * bodyOverlayHeightMultiplier);
        let parsedData = [];
        if(selectedCategory.context_text) {
            _.map(selectedCategory.context_bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold, {color: AppColors.zeplin.slate,}];
                parsedData.push(newParsedData);
            });
        }
        let selectedCategoryData = categoryTrendData.data[selectedCategoryIndex];
        let triggerTiles = selectedCategoryData ? selectedCategoryData.trigger_tiles : false;
        let bodyOverlayData = categoryTrendData.body_parts;
        if(selectedCategoryData) {
            bodyOverlayData = _.map(bodyOverlayData, (bodyPart, i) => {
                let bodyPartsToFilter = selectedCategoryData.trigger_tiles && selectedCategoryData.trigger_tiles[slideIndex] ? selectedCategoryData.trigger_tiles[slideIndex].body_parts : selectedCategoryData.body_parts;
                let isSelected = _.filter(bodyPartsToFilter, { body_part_location: bodyPart.body_part_location, color: bodyPart.color, side: bodyPart.side, });
                let newBodyPart = _.cloneDeep(bodyPart);
                newBodyPart.customOpacity = isSelected && isSelected.length > 0 ? 1 : 0.15;
                return newBodyPart;
            });
        }
        return (
            <View style={{marginBottom: AppSizes.padding, marginHorizontal: AppSizes.padding, marginTop: AppSizes.paddingMed,}}>
                <Text robotoRegular style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(20), textAlign: 'left',}}>
                    {selectedCategory.header}
                </Text>
                <View style={{alignItems: 'center', justifyContent: 'center', marginBottom: AppSizes.padding, marginTop: AppSizes.paddingMed,}}>
                    <BodyOverlay
                        bodyParts={bodyOverlayData}
                        remainingWidth={remainingBodyOverlayWidth}
                    />
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: AppSizes.padding,}}>
                        {_.map(categoryTrendData.data, (pill, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => this.setState({ selectedCategoryIndex: this.state.selectedCategoryIndex === index ? null : index, })}
                                style={[
                                    styles.pillWrapper(
                                        pill.active ? pill.color : 11,
                                        (index + 1) === categoryTrendData.length,
                                        (selectedCategoryIndex === index)
                                    )
                                ]}
                            >
                                <Text robotoRegular style={[styles.pillText(pill.active ? pill.color : 11, (selectedCategoryIndex === index)),]}>
                                    {pill.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center',}}>
                    {triggerTiles ?
                        <Carousel
                            activeSlideAlignment={'start'}
                            contentContainerCustomStyle={{alignItems: 'center', paddingLeft: AppSizes.paddingMed, paddingVertical: AppSizes.paddingSml, justifyContent: 'center',}}
                            data={triggerTiles}
                            firstItem={0}
                            initialNumToRender={triggerTiles ? triggerTiles.length : 0}
                            itemWidth={(AppSizes.screen.widthThreeQuarters)}
                            layout={'default'}
                            lockScrollWhileSnapping={true}
                            maxToRenderPerBatch={3}
                            onBeforeSnapToItem={newSlideIndex => this.setState({ slideIndex: newSlideIndex, })}
                            onLayout={event => this.setState({ slideIndex: 0, })}
                            ref={ref => {this._swiperRef = ref;}}
                            removeClippedSubviews={false}
                            renderItem={({item, index}) => this._renderCard(item, index, selectedCategoryData, triggerTiles.length)}
                            sliderWidth={AppSizes.screen.width}
                            windowSize={3}
                        />
                        :
                        <ParsedText
                            parse={parsedData}
                            style={{...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}
                        >
                            {selectedCategory.context_text}
                        </ParsedText>
                    }
                </View>
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
                            isVisible={selectedCareCategory ? selectedCareCategory.active : false}
                            text={'Care'}
                            toggleModal={user && user.id ? () => this._toggleModal(6) : null}
                        />
                        <InsightIcon
                            insightType={4}
                            isFTE={selectedRecoveryCategory ? selectedRecoveryCategory.first_time_experience : false}
                            isSelected={this.state.selectedIndex === 4 && this.state.isModalOpen}
                            isVisible={selectedRecoveryCategory ? selectedRecoveryCategory.active : false}
                            text={'Recovery'}
                            toggleModal={user && user.id ? () => this._toggleModal(4) : null}
                        />
                        <InsightIcon
                            insightType={5}
                            isFTE={selectedPreventionCategory ? selectedPreventionCategory.first_time_experience : false}
                            isSelected={this.state.selectedIndex === 5 && this.state.isModalOpen}
                            isVisible={selectedPreventionCategory ? selectedPreventionCategory.active : false}
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

    _toggleModal = (index, callback) => {
        const { categories, handleReadInsight, } = this.props;
        let newModalState = index === null ? false : (index !== this.state.selectedIndex || !this.state.isModalOpen);
        this.setState(
            { isModalOpen: newModalState, selectedCategoryIndex: null, selectedIndex: index, },
            () => {
                if(
                    index &&
                    _.find(categories, ['insight_type', index]) &&
                    _.find(categories, ['insight_type', index]).first_time_experience
                ) {
                    handleReadInsight(index);
                }
                return callback && callback();
            }
        );
    }

    render = () => {
        const { categories, } = this.props;
        const { selectedIndex, isModalOpen, } = this.state;
        let selectedCategory = _.find(categories, ['insight_type', selectedIndex]);
        let selectedCareCategory = _.find(categories, ['insight_type', 6]);
        let selectedPreventionCategory = _.find(categories, ['insight_type', 5]);
        let selectedRecoveryCategory = _.find(categories, ['insight_type', 4]);
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
                    <View onLayout={ev => this.state.modalContentHeight === 0 ? this.setState({ modalContentHeight: ev.nativeEvent.layout.height, }) : null}>
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
