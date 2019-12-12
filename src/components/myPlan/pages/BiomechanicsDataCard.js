/**
 * BiomechanicsDataCard
 *
    <BiomechanicsDataCard
        card={card}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { AnimatedCircularProgress, ParsedText, TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

// import third-party libraries
import _ from 'lodash';

const cardSummaryTextLengthCatch = 80;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    dataCard: {
        backgroundColor: AppColors.white,
        borderRadius:    12,
        elevation:       4,
        flexDirection:   'row',
        justifyContent:  'space-between',
        marginTop:       AppSizes.paddingMed,
        padding:         AppSizes.paddingMed,
        shadowColor:     'rgba(0, 0, 0, 0.08)',
        shadowOffset:    { height: 4, width: 0, },
        shadowOpacity:   1,
        shadowRadius:    10,
    },
});

/* Component ==================================================================== */
class BiomechanicsDataCard extends PureComponent {
    constructor(props) {
        super(props);
        const { card, } = this.props;
        const trimText = (
            card.summary_text &&
            (
                card.summary_text.text.length > cardSummaryTextLengthCatch &&
                card.summary_text.text_items.length > 0
            ) ||
            (
                card.summary_text.text.length < cardSummaryTextLengthCatch &&
                card.summary_text.text_items.length > 1
            )

        ) ?
            true
            :
            false;
        this.state = {
            initialTrimText: trimText,
            isCardExpanded:  false,
            trimText,
        };
        this._animatedValue = new Animated.Value(0);
    }

    _toggleText = () => this.setState(
        { isCardExpanded: !this.state.isCardExpanded, trimText: !this.state.trimText, },
        () => {
            Animated.timing(this._animatedValue, {
                duration: 300,
                toValue:  this.state.isCardExpanded ? 1 : 0,
            }).start();
        }
    )

    render = () => {
        const { card, } = this.props;
        const { initialTrimText, trimText, } = this.state;
        let parsedCardSummaryTextTextData = [];
        if(card.summary_text.active) {
            parsedCardSummaryTextTextData = _.map(card.summary_text.bold_text, prop => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold];
                return newParsedData;
            });
        }
        let imageSource = false;
        if(card.type === 2 && card.icon) {
            switch (card.icon) {
            case 0:
                imageSource = require('../../../../assets/images/standard/thumbs_up.png');
                break;
            case 1:
                imageSource = require('../../../../assets/images/standard/thumbs_down.png');
                break;
            case 2:
                imageSource = require('../../../../assets/images/standard/fatigued_yes.png');
                break;
            case 3:
                imageSource = require('../../../../assets/images/standard/fatigued_no.png');
                break;
            case 4:
                imageSource = require('../../../../assets/images/standard/trending_up.png');
                break;
            case 5:
                imageSource = require('../../../../assets/images/standard/trending_down.png');
                break;
            default:
                imageSource = false;
            }
        }
        let range = card.type === 0 && card.max_value ? _.range(0, card.max_value) : false;
        let asymmetryBars = [];
        if(range) {
            _.each(range, value => {
                let height = ((value + 1) === 1) || (value + 1) > 0 && (value + 1) < card.max_value ?
                    ((AppSizes.screen.widthQuarter - AppSizes.paddingMed) * ((0.5 * (value / card.max_value) + 0.5)))
                    :
                    (AppSizes.screen.widthQuarter - AppSizes.paddingMed);
                asymmetryBars.push(
                    <View
                        key={value}
                        style={{
                            backgroundColor: (value + 1) <= card.value ? PlanLogic.returnInsightColorString(card.color) : AppColors.zeplin.superLight,
                            borderRadius:    100,
                            height,
                            marginRight:     AppSizes.paddingXSml,
                            width:           ((AppSizes.screen.widthQuarter - AppSizes.paddingMed) / card.max_value),
                        }}
                    />
                );
            });
        }
        const interpolateRotation = this._animatedValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '180deg'],
        });
        const animatedStyle = {transform: [{rotate: interpolateRotation,}]};
        const ending = '...';
        const cleanedCardText = trimText ?
            (card.summary_text.text.substring(0, cardSummaryTextLengthCatch - ending.length) + ending)
            :
            card.summary_text.text;
        return (
            <TouchableOpacity
                onPress={() => this._toggleText()}
                style={[styles.dataCard,]}
            >
                <View style={{flexDirection: 'row',}}>
                    { card.type === 0 ?
                        <View style={{alignItems: 'flex-end', flexDirection: 'row', marginRight: AppSizes.paddingMed,}}>
                            {asymmetryBars}
                        </View>
                        : card.type === 1 ?
                            <AnimatedCircularProgress
                                arcSweepAngle={320}
                                backgroundColor={AppColors.zeplin.superLight}
                                childrenContainerStyle={{marginLeft: 5, marginTop: AppSizes.paddingXSml,}}
                                fill={card.value}
                                lineCap={'round'}
                                rotation={200}
                                size={AppSizes.screen.widthQuarter}
                                style={{marginRight: AppSizes.paddingSml, paddingHorizontal: AppSizes.paddingXSml, paddingVertical: AppSizes.paddingXSml,}}
                                tintColor={PlanLogic.returnInsightColorString(card.color)}
                                width={15}
                            >
                                {
                                    (fill) => (
                                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(card.color), fontSize: AppFonts.scaleFont(18),}}>
                                            {`${card.value}%`}
                                        </Text>
                                    )
                                }
                            </AnimatedCircularProgress>
                            :
                            <View style={{marginLeft: AppSizes.paddingMed, marginRight: AppSizes.paddingMed,}}>
                                {imageSource &&
                                    <Image
                                        resizeMode={'contain'}
                                        source={imageSource}
                                        style={{
                                            height:    (AppSizes.screen.widthQuarter - AppSizes.paddingMed),
                                            tintColor: PlanLogic.returnInsightColorString(card.color),
                                            width:     (AppSizes.screen.widthQuarter - AppSizes.paddingMed),
                                        }}
                                    />
                                }
                            </View>
                    }
                    <View style={{flexShrink: 1, justifyContent: 'center', marginLeft: AppSizes.paddingMed,}}>
                        <Text robotoRegular style={{color: PlanLogic.returnInsightColorString(card.color), fontSize: AppFonts.scaleFont(18),}}>
                            {card.title_text}
                        </Text>
                        {(card && card.summary_text.active && card.summary_text.text.length > 0) &&
                            <ParsedText
                                parse={parsedCardSummaryTextTextData || []}
                                style={{...AppStyles.robotoRegular, color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18), marginTop: AppSizes.paddingSml,}}
                            >
                                {cleanedCardText}
                            </ParsedText>
                        }
                        {!trimText && _.map(card.summary_text.text_items, (text, i) => {
                            let parsedTextItemsData = _.map(card.summary_text.text_items.bold_text, prop => {
                                let newParsedData = {};
                                newParsedData.pattern = new RegExp(prop.text, 'i');
                                newParsedData.style = [AppStyles.robotoBold];
                                return newParsedData;
                            });
                            return (
                                <View key={i} style={{flexShrink: 1, flexDirection: 'row',}}>
                                    <ParsedText
                                        parse={parsedTextItemsData || []}
                                        style={{...AppStyles.robotoLight, color: AppColors.zeplin.slate, flexShrink: 1, flexWrap: 'wrap', fontSize: AppFonts.scaleFont(12), lineHeight: AppFonts.scaleFont(18),}}
                                    >
                                        {`\u2022 ${text.text}`}
                                    </ParsedText>
                                </View>
                            );
                        })}
                    </View>
                </View>
                <View style={{justifyContent: 'flex-end',}}>
                    { initialTrimText &&
                        <Animated.View style={[animatedStyle,]}>
                            <TabIcon
                                color={AppColors.zeplin.slateXLight}
                                icon={'keyboard-arrow-down'}
                                size={20}
                            />
                        </Animated.View>
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

BiomechanicsDataCard.propTypes = {
    card: PropTypes.object.isRequired,
};

BiomechanicsDataCard.defaultProps = {};

BiomechanicsDataCard.componentName = 'BiomechanicsDataCard';

/* Export Component ================================================================== */
export default BiomechanicsDataCard;