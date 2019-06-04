/**
 * DeckCards
 *
     <DeckCards
         cards={TEMP_CARDS}
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
import { Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Swiper from 'react-native-deck-swiper';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../constants';

// Components
import { Button, TabIcon, Text, } from '../custom';

const CONTAINER_HEIGHT = 150;
const UNREAD_NOTIFICATIONS_HEIGHT_WIDTH = (AppFonts.scaleFont(15) + (AppSizes.paddingXSml * 2));

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    card: {
        backgroundColor:   AppColors.white,
        borderRadius:      10,
        elevation:         2,
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
        handleReadInsight:        PropTypes.func.isRequired,
        hideDeck:                 PropTypes.func,
        infinite:                 PropTypes.bool,
        isVisible:                PropTypes.bool.isRequired,
        shouldNavigate:           PropTypes.bool,
        showDate:                 PropTypes.bool,
        shrinkNumberOfLines:      PropTypes.bool,
        startIndex:               PropTypes.number,
        unreadNotificationsCount: PropTypes.number,
    };

    static defaultProps = {
        hideDeck:                 () => {},
        infinite:                 false,
        shouldNavigate:           true,
        showDate:                 true,
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
        const { isVisible, } = this.props;
        if(!isVisible && prevProps.isVisible !== isVisible) {
            this.setState({ areAllSwiped: false, currentCardIndex: 0, }, () => this._swiperRef.jumpToCardIndex(0));
        }
    }

    _handleOnSwiped = index => {
        const { cards, handleReadInsight, } = this.props;
        const options = {
            enableVibrateFallback:       false,
            ignoreAndroidSystemSettings: false,
        };
        this.setState(
            { currentCardIndex: (index + 1), },
            () => {
                let hapticFeedbackMethod = (index + 1) === cards.length ? 'notificationWarning' : 'impactMedium';
                ReactNativeHapticFeedback.trigger(hapticFeedbackMethod, options);
                handleReadInsight(index);
            },
        );
    }

    _handleRenderCardLogic = (card, index) => {
        const { unreadNotificationsCount, } = this.props;
        const { currentCardIndex, } = this.state;
        let insightType = card && card.insight_type ? card.insight_type : 0;
        let triggerType = card && card.trigger_type ? card.trigger_type : 0;
        let daysDiff = card && card.start_date_time ? moment().diff(card.start_date_time, 'days') : 0;
        let dateText = daysDiff === 0 ? 'today' : `${daysDiff} ${daysDiff === 1 ? 'day' : 'days'} ago`;
        let textRegEx = card && card.goal_targeted ? new RegExp(card.goal_targeted.join('|'), 'g') : new RegExp('', 'g');
        let textMatchedArray = card && card.text ? card.text.match(textRegEx) : [];
        let splitTextArray = card && card.text ? _.split(card.text, textRegEx) : [];
        let cardTextArray = [];
        if(textMatchedArray) {
            _.map(splitTextArray, (text, key) => {
                if(text && text.length > 0) {
                    cardTextArray.push(
                        <Text key={key} robotoLight>
                            {text}
                            <Text robotoBold>{textMatchedArray[key]}</Text>
                        </Text>
                    );
                }
            });
        } else {
            cardTextArray = [<Text key={0} robotoLight style={[styles.text,]}>{card.text}</Text>];
        }
        if(card && card.goal_targeted && card.goal_targeted.length === 0) {
            cardTextArray = [<Text key={0} robotoLight style={[styles.text,]}>{card.text}</Text>];
        }
        let showUnreadNotificationsBadge = currentCardIndex === index && unreadNotificationsCount > 0;
        return {
            cardTextArray,
            dateText,
            insightType,
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
        const { shouldNavigate, showDate, shrinkNumberOfLines, } = this.props;
        const {
            cardTextArray,
            dateText,
            insightType,
            // showUnreadNotificationsBadge,
            triggerType,
        } = this._handleRenderCardLogic(card, index);
        return (
            <TouchableOpacity
                activeOpacity={1}
                onLayout={ev => this._onLayoutOfCard(ev.nativeEvent.layout.height, index)}
                onPress={shouldNavigate ? () => Actions.trendChild({ insightType: insightType, triggerType: triggerType, }) : () => {}}
                style={[styles.card,]}
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
                <Text
                    numberOfLines={shrinkNumberOfLines ? 3 : 10}
                    style={[styles.text,]}
                >
                    {cardTextArray}
                </Text>
                {/* showUnreadNotificationsBadge &&
                    <View style={[styles.unreadNotificationsWrapper,]}>
                        <Text robotoRegular style={[styles.unreadNotificationsText,]}>{unreadNotificationsCount}</Text>
                    </View>
                */}
            </TouchableOpacity>
        );
    }

    render = () => {
        const { cards, hideDeck, infinite, } = this.props;
        const { areAllSwiped, containerStyle, currentCardIndex, } = this.state;
        return (
            <View>
                <View style={[containerStyle,]}>
                    { areAllSwiped && !infinite ?
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingSml,}}>
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{'You\'re up to date for now! We\'ll generate more insights as we learn about your body.'}</Text>
                            <View style={{flexDirection: 'row', marginTop: AppSizes.padding,}}>
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.zeplin.splash, paddingHorizontal: AppSizes.padding,}}
                                    containerStyle={{marginRight: AppSizes.paddingSml,}}
                                    onPress={() => this.setState({ areAllSwiped: false, currentCardIndex: 0, })}
                                    title={'Repeat?'}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                                />
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.zeplin.splash, paddingHorizontal: AppSizes.padding,}}
                                    onPress={hideDeck}
                                    title={'Hide'}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                                />
                            </View>
                        </View>
                        :
                        <Swiper
                            {...this.props}
                            backgroundColor={AppColors.transparent}
                            cardHorizontalMargin={AppSizes.padding}
                            cardIndex={currentCardIndex}
                            cardVerticalMargin={AppSizes.padding}
                            cards={cards}
                            infinite={infinite}
                            onSwiped={index => this._handleOnSwiped(index)}
                            onSwipedAll={() => this.setState({ areAllSwiped: true, currentCardIndex: 0, })}
                            ref={ref => {this._swiperRef = ref;}}
                            renderCard={(card, index) => this._renderCard(card, index)}
                            stackScale={10}
                            stackSeparation={-10}
                            stackSize={cards.length === 1 && infinite ? 1 : 2}
                            useViewOverflow={Platform.OS === 'ios'}
                        />
                    }
                </View>
                { !infinite &&
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