/**
 * DeckCards
 *
     <DeckCards
         cards={TEMP_CARDS}
         hideDeck={() => onRight()}
         unreadNotificationsCount={_.filter(TEMP_CARDS, ['read', false]).length}
     />
 *
 */
import React, { Component, } from 'react';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import _ from 'lodash';
import Swiper from 'react-native-deck-swiper';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../constants';

// Components
import { Button, TabIcon, Text, } from '../custom';

const CONTAINER_HEIGHT = 225;
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
        color:    AppColors.zeplin.lightSlate,
        fontSize: AppFonts.scaleFont(11),
    },
    hideText: {
        color:        AppColors.zeplin.slate,
        fontSize:     AppFonts.scaleFont(12),
        paddingRight: AppSizes.paddingSml,
    },
    hideTextContainerWrapper: {
        alignItems:     'flex-end',
        justifyContent: 'flex-end',
        paddingBottom:  AppSizes.paddingSml,
        paddingRight:   AppSizes.padding,
    },
    hideTextWrapper: {
        alignItems:    'center',
        flexDirection: 'row',
    },
    text: {
        color:    AppColors.zeplin.darkSlate,
        fontSize: AppFonts.scaleFont(13),
    },
    title: {
        color:        AppColors.zeplin.darkSlate,
        fontSize:     AppFonts.scaleFont(15),
        marginBottom: AppSizes.paddingXSml,
    },
    unreadNotificationsText: {
        color:    AppColors.white,
        fontSize: AppFonts.scaleFont(13),
    },
    unreadNotificationsWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.zeplin.coachesDashError,
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
        hideDeck:                 PropTypes.func.isRequired,
        unreadNotificationsCount: PropTypes.number.isRequired,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            areAllSwiped:     false,
            currentCardIndex: 0,
        };
    }

    _handleRenderCardLogic = (card, index) => {
        const { unreadNotificationsCount, } = this.props;
        const { currentCardIndex, } = this.state;
        let daysDiff = moment().diff(card.start_date, 'days');
        let dateText = daysDiff === 0 ? 'today' : `${daysDiff} ${daysDiff === 1 ? 'day' : 'days'} ago`;
        let textRegEx = new RegExp(card.goal_targeted.join('|'), 'g');
        let textMatchedArray = card.text.match(textRegEx);
        let splitTextArray = _.split(card.text, textRegEx);
        let cardTextArray = [];
        _.map(splitTextArray, (text, key) => {
            if(text.length > 0) {
                cardTextArray.push(
                    <Text key={key} robotoLight>
                        {text}
                        <Text robotoBold>{textMatchedArray[key]}</Text>
                    </Text>
                );
            }
        });
        if(card.goal_targeted && card.goal_targeted.length === 0) {
            cardTextArray = [<Text key={0} robotoLight style={[styles.text,]}>{card.text}</Text>];
        }
        let showUnreadNotificationsBadge = currentCardIndex === index && unreadNotificationsCount > 0;
        return {
            cardTextArray,
            dateText,
            showUnreadNotificationsBadge,
        };
    }

    render = () => {
        const { cards, hideDeck, unreadNotificationsCount, } = this.props;
        const { areAllSwiped, currentCardIndex, } = this.state;
        return (
            <View>
                <View style={[styles.container,]}>
                    { areAllSwiped ?
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}>{'You\'re all caught up!'}</Text>
                            <View style={{flexDirection: 'row', marginTop: AppSizes.padding,}}>
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.zeplin.lightSplash, paddingHorizontal: AppSizes.padding,}}
                                    containerStyle={{marginRight: AppSizes.paddingSml,}}
                                    onPress={() => this.setState({ areAllSwiped: false, currentCardIndex: 0, })}
                                    title={'Repeat?'}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                                />
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.zeplin.lightSplash, paddingHorizontal: AppSizes.padding,}}
                                    onPress={hideDeck}
                                    title={'Hide'}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18),}}
                                />
                            </View>
                        </View>
                        :
                        <Swiper
                            backgroundColor={AppColors.white}
                            cardIndex={currentCardIndex}
                            cards={cards}
                            renderCard={(card, index) => {
                                const {
                                    cardTextArray,
                                    dateText,
                                    showUnreadNotificationsBadge,
                                } = this._handleRenderCardLogic(card, index);
                                return (
                                    <View style={[styles.card,]}>
                                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text robotoBold style={[styles.title,]}>{card.title}</Text>
                                            <Text robotoRegular style={[styles.date,]}>{dateText}</Text>
                                        </View>
                                        <Text style={[styles.text,]}>
                                            {cardTextArray}
                                        </Text>
                                        { showUnreadNotificationsBadge &&
                                            <View style={[styles.unreadNotificationsWrapper,]}>
                                                <Text robotoRegular style={[styles.unreadNotificationsText,]}>{unreadNotificationsCount}</Text>
                                            </View>
                                        }
                                    </View>
                                )
                            }}
                            onSwiped={index => this.setState({ currentCardIndex: (index + 1), }, () => console.log('trigger API call here?'),)}
                            onSwipedAll={() => this.setState({ areAllSwiped: true, currentCardIndex: 0, })}
                            stackSize={2}
                        />
                    }
                </View>
                <View style={[styles.hideTextContainerWrapper,]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={hideDeck}
                        style={[styles.hideTextWrapper,]}
                    >
                        <Text robotoRegular style={[styles.hideText,]}>{'hide'}</Text>
                        <TabIcon
                            icon={'chevron-up'}
                            iconStyle={[{color: AppColors.zeplin.darkSlate,}]}
                            size={20}
                            type={'material-community'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default DeckCards;
