/**
 * DeckCards
 *
     <DeckCards
         cards={TEMP_CARDS}
         categories={categories}
         handleReadInsight={index => handleReadInsight(index)}
         hideDeck={() => onRight()}
         infinite={true}
         isVisible={expandNotifications}
         shrinkNumberOfLines={true}
         shouldNavigate={false}
         showDate={false}
         startIndex={currentCardIndex}
         unreadNotificationsCount={_.filter(cards, ['read', false]).length}
     />
 *
 */
import React, { Component, } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppUtil, } from '../../lib';

// Components
import { Button, ParsedText, TabIcon, Text, } from '../custom';

const CONTAINER_HEIGHT = 150;
const UNREAD_NOTIFICATIONS_HEIGHT_WIDTH = (AppFonts.scaleFont(15) + (AppSizes.paddingXSml * 2));

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    card: {
        backgroundColor:   AppColors.white,
        borderRadius:      10,
        shadowColor:       'rgba(0, 0, 0, 0.16)',
        shadowOffset:      { height: 3, width: 0, },
        shadowOpacity:     1,
        shadowRadius:      6,
        paddingHorizontal: AppSizes.paddingMed,
        paddingVertical:   AppSizes.paddingMed,
    },
    container: {
        height: CONTAINER_HEIGHT,
    },
    date: {
        color:    AppColors.zeplin.slateXLight,
        fontSize: AppFonts.scaleFont(11),
    },
    hideText: {
        color:        AppColors.zeplin.slate,
        fontSize:     AppFonts.scaleFont(12),
        paddingRight: AppSizes.paddingSml,
    },
    hideTextContainerWrapper: {
        alignItems:     'flex-end',
        justifyContent: 'center',
        paddingBottom:  AppSizes.paddingSml,
        paddingRight:   AppSizes.padding,
    },
    hideTextWrapper: {
        alignItems:     'center',
        flexDirection:  'row',
        justifyContent: 'center',
    },
    text: {
        ...AppStyles.robotoLight,
        color:    AppColors.zeplin.slate,
        fontSize: AppFonts.scaleFont(13),
    },
    title: {
        color:        AppColors.zeplin.slate,
        flex:         1,
        fontSize:     AppFonts.scaleFont(15),
        marginBottom: AppSizes.paddingXSml,
    },
    unreadNotificationsText: {
        color:    AppColors.white,
        fontSize: AppFonts.scaleFont(13),
    },
    unreadNotificationsWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.zeplin.error,
        borderRadius:    (UNREAD_NOTIFICATIONS_HEIGHT_WIDTH / 2),
        height:          UNREAD_NOTIFICATIONS_HEIGHT_WIDTH,
        justifyContent:  'center',
        position:        'absolute',
        right:           -(UNREAD_NOTIFICATIONS_HEIGHT_WIDTH / 2),
        top:             -(UNREAD_NOTIFICATIONS_HEIGHT_WIDTH / 2),
        width:           UNREAD_NOTIFICATIONS_HEIGHT_WIDTH,
    },
});

/* Component ==================================================================== */
class DeckCards extends Component {
    static propTypes = {
        cards:                    PropTypes.array.isRequired,
        categories:               PropTypes.array.isRequired,
        handleReadInsight:        PropTypes.func.isRequired,
        hideDeck:                 PropTypes.func,
        infinite:                 PropTypes.bool,
        isVisible:                PropTypes.bool.isRequired,
        shouldNavigate:           PropTypes.bool,
        showDate:                 PropTypes.bool,
        showHide:                 PropTypes.bool,
        shrinkNumberOfLines:      PropTypes.bool,
        startIndex:               PropTypes.number,
        unreadNotificationsCount: PropTypes.number,
    };

    static defaultProps = {
        hideDeck:                 () => {},
        infinite:                 false,
        shouldNavigate:           true,
        showDate:                 true,
        showHide:                 true,
        shrinkNumberOfLines:      false,
        startIndex:               0,
        unreadNotificationsCount: 0,
    };

    constructor(props) {
        super(props);
        this.state = {
            areAllSwiped:     false,
            containerStyle:   styles.container,
            currentCardIndex: props.startIndex,
        };
        this._swiperRef = {};
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { cards, isVisible, } = this.props;
        if(!isVisible && prevProps.isVisible !== isVisible) {
            this.setState({ areAllSwiped: false, currentCardIndex: 0, }, () => cards.length > 0 ? this._swiperRef.snapToItem(0) : {});
        } else if(cards.length > 0 && (prevProps.startIndex + 1) === this.props.cards.length && this.props.startIndex === 0) {
            this._swiperRef.snapToItem(0);
        }
    }

    _handleOnSwiped = index => {
        const { cards, handleReadInsight, } = this.props;
        const options = {
            enableVibrateFallback:       false,
            ignoreAndroidSystemSettings: false,
        };
        let insightType = cards[(index - 1)] && cards[(index - 1)].category ? cards[(index - 1)].category : 0;
        this.setState(
            { currentCardIndex: index, },
            () => {
                let hapticFeedbackMethod = index === cards.length ? 'notificationWarning' : 'impactMedium';
                ReactNativeHapticFeedback.trigger(hapticFeedbackMethod, options);
                handleReadInsight(insightType);
                if(this.state.currentCardIndex === index && (!cards[index].title || cards[index].title === '')) {
                    this.setState({ areAllSwiped: true, });
                }
            },
        );
    }

    _handleRenderCardLogic = (card, index) => {
        const { unreadNotificationsCount, } = this.props;
        const { currentCardIndex, } = this.state;
        let insightType = card && card.category ? card.category : 0;
        let triggerType = card && card.trigger_type ? card.trigger_type : 0;
        let daysDiff = card && card.start_date_time ? moment().diff(card.start_date_time, 'days') : 0;
        let dateText = daysDiff === 0 ? 'today' : `${daysDiff} ${daysDiff === 1 ? 'day' : 'days'} ago`;
        let parsedData = [];
        if(card && card.text) {
            _.map(card.bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold,];
                parsedData.push(newParsedData);
            });
        }
        let showUnreadNotificationsBadge = currentCardIndex === index && unreadNotificationsCount > 0;
        let allowNavigation = triggerType !== 25 && triggerType < 200;
        return {
            allowNavigation,
            dateText,
            insightType,
            parsedData,
            showUnreadNotificationsBadge,
            triggerType,
        };
    }

    _onLayoutOfCard = (height, index) => {
        let newHeight = (height + (AppSizes.padding * 2));
        if(newHeight > this.state.containerStyle.height) {
            this.setState({ containerStyle: { height: newHeight, }, });
        }
    }

    _renderCard = (card, index) => {
        const { cards, handleReadInsight, shouldNavigate, showDate, shrinkNumberOfLines, } = this.props;
        const { currentCardIndex, } = this.state;
        const {
            allowNavigation,
            dateText,
            insightType,
            parsedData,
            // showUnreadNotificationsBadge,
            triggerType,
        } = this._handleRenderCardLogic(card, index);
        if ((!card.title || card.title === '') && currentCardIndex !== index) { // not to show view above when still scrolling
            return (null);
        }
        let extraStyles = {};
        if(Platform.OS === 'android') {
            extraStyles = {borderColor: AppColors.zeplin.slateXLight, borderWidth: 1, elevation: (cards.length - index), zIndex: (cards.length - index),};
        }
        return (
            <TouchableOpacity
                activeOpacity={1}
                onLayout={ev => this._onLayoutOfCard(ev.nativeEvent.layout.height, index)}
                onPress={shouldNavigate && allowNavigation ? () => {
                    AppUtil.pushToScene('trendChild', { insightType: insightType, triggerType: triggerType, });
                    handleReadInsight(insightType);
                } : () => {}}
                style={[styles.card, extraStyles,]}
            >
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'row',}}>
                        { card && card.styling === 1 &&
                            <TabIcon
                                color={AppColors.zeplin.error}
                                containerStyle={[{marginRight: AppSizes.paddingSml,}]}
                                icon={'alert-circle-outline'}
                                size={20}
                                type={'material-community'}
                            />
                        }
                        <Text robotoBold style={[styles.title, card && card.styling === 1 ? {color: AppColors.zeplin.error,} : {}]}>
                            {card && card.title ? card.title : ''}
                        </Text>
                    </View>
                    { showDate &&
                        <Text robotoRegular style={[styles.date,]}>{dateText}</Text>
                    }
                </View>
                <ParsedText
                    childrenProps={{numberOfLines: shrinkNumberOfLines ? 3 : 10,}}
                    parse={parsedData}
                    style={[AppStyles.robotoLight, styles.text,]}
                >
                    {card ? card.text : ''}
                </ParsedText>
                {/* showUnreadNotificationsBadge &&
                    <View style={[styles.unreadNotificationsWrapper,]}>
                        <Text robotoRegular style={[styles.unreadNotificationsText,]}>{unreadNotificationsCount}</Text>
                    </View>
                */}
            </TouchableOpacity>
        );
    }

    render = () => {
        const { cards, categories, hideDeck, infinite, showHide, } = this.props;
        const { areAllSwiped, containerStyle, currentCardIndex, } = this.state;
        return (
            <View>
                <View style={[areAllSwiped && !infinite && showHide ? containerStyle : {}]}>
                    { (areAllSwiped && !infinite && showHide) || (!infinite && showHide && categories.length > 0 && cards.length === 0) ?
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingXLrg,}}>
                            <Image
                                resizeMode={'contain'}
                                source={require('../../../assets/images/standard/allcaughtup.png')}
                                style={{height: 50, marginBottom: AppSizes.paddingSml, width: 50,}}
                            />
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>
                                {'You\'re up to date for now! You can view your ongoing insights on your Trends Dashboard.'}
                            </Text>
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, marginTop: AppSizes.padding, paddingHorizontal: AppSizes.padding,}}
                                containerStyle={{marginRight: AppSizes.paddingSml,}}
                                onPress={() => AppUtil.pushToScene('trends')}
                                title={'Go to Dashboard'}
                                titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                            />
                        </View>
                        : cards.length > 0 ?
                            <Carousel
                                {...this.props}
                                contentContainerCustomStyle={{alignItems: 'center', paddingVertical: AppSizes.padding, justifyContent: 'center',}}
                                data={cards}
                                firstItem={currentCardIndex}
                                initialNumToRender={cards.length}
                                itemWidth={(AppSizes.screen.width * 0.85)}
                                lockScrollWhileSnapping={true}
                                maxToRenderPerBatch={3}
                                onSnapToItem={index => this._handleOnSwiped(index)}
                                ref={ref => {this._swiperRef = ref;}}
                                removeClippedSubviews={false}
                                renderItem={({item, index}) => this._renderCard(item, index)}
                                sliderWidth={AppSizes.screen.width}
                                windowSize={3}
                            />
                            :
                            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingXLrg,}}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/standard/research.png')}
                                    style={{height: 50, marginBottom: AppSizes.paddingSml, width: 50,}}
                                />
                                <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), textAlign: 'center',}}>
                                    {'We\'re looking for meaningful insights in your body & training data!'}
                                </Text>
                            </View>
                    }
                </View>
                { showHide &&
                    <View style={[styles.hideTextContainerWrapper,]}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={hideDeck}
                            style={[styles.hideTextWrapper,]}
                        >
                            <Text robotoRegular style={[styles.hideText,]}>{'hide'}</Text>
                            <TabIcon
                                icon={'chevron-up'}
                                iconStyle={[{color: AppColors.zeplin.slate,}]}
                                size={20}
                                type={'material-community'}
                            />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default DeckCards;
