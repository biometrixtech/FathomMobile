import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, Text, View, ViewPropTypes, } from 'react-native';
import PropTypes from 'prop-types';
const createReactClass = require('create-react-class');
import { Button, FathomPicker, Text as FathomText, } from './';

import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants/';
import { TabIcon, } from './';

const styles = StyleSheet.create({
    pickerSelectAndroid: {
        color: AppColors.zeplin.darkGrey,
    },
    pickerSelectIOS: {
        ...AppFonts.oswaldRegular,
        color:    AppColors.zeplin.darkGrey,
        fontSize: AppFonts.scaleFont(20),
    },
    tab: {
        alignItems:     'center',
        flex:           1,
        justifyContent: 'center',
        paddingBottom:  10,
    },
    tabs: {
        borderColor:      '#ccc',
        borderLeftWidth:  0,
        borderRightWidth: 0,
        borderTopWidth:   0,
        borderWidth:      1,
        flexDirection:    'row',
        height:           50,
        justifyContent:   'space-around',
    },
});

const CoachesDashboardTabBar = createReactClass({
    propTypes: {
        activeTab:         PropTypes.number,
        activeTextColor:   PropTypes.string,
        backgroundColor:   PropTypes.string,
        goToPage:          PropTypes.func,
        headerItems:       PropTypes.object,
        inactiveTextColor: PropTypes.string,
        renderTab:         PropTypes.func,
        tabStyle:          ViewPropTypes.style,
        tabs:              PropTypes.array,
        textStyle:         Text.propTypes.style,
        underlineStyle:    ViewPropTypes.style,
    },

    getDefaultProps() {
        return {
            activeTextColor:   'navy',
            backgroundColor:   null,
            headerItems:       null,
            inactiveTextColor: 'black',
        };
    },

    renderTabOption(name, page) {},

    renderTab(name, page, isTabActive, onPressHandler) {
        const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        return <Button
            style={{flex: 1, }}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits={'button'}
            onPress={() => onPressHandler(page)}
        >
            <View style={[styles.tab, this.props.tabStyle, ]}>
                <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
                    {name}
                </Text>
            </View>
        </Button>;
    },

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            backgroundColor: 'navy',
            bottom:          0,
            height:          4,
            position:        'absolute',
            width:           containerWidth / numberOfTabs,
        };
        const translateX = this.props.scrollValue.interpolate({
            inputRange:  [0, 1],
            outputRange: [0,  containerWidth / numberOfTabs],
        });
        // set animated values
        const spinValue = new Animated.Value(0);
        // First set up animation
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    duration:        3000,
                    easing:          Easing.linear,
                    toValue:         1,
                    useNativeDriver: true,
                }
            )
        ).start();
        // Second interpolate beginning and end values (in this case 0 and 1)
        const spin = spinValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        return (
            <View>
                { this.props.headerItems ?
                    <View style={[AppStyles.containerCentered, {backgroundColor: AppColors.white, flexDirection: 'row', justifyContent: 'center', marginHorizontal: AppSizes.paddingSml, paddingBottom: AppSizes.paddingSml,}]}>
                        <View style={{flex: 1,}} />
                        <View style={{flex: 8,}}>
                            { this.props.headerItems.coachesTeams.length === 0 ?
                                <View style={{alignSelf: 'center', backgroundColor: AppColors.zeplin.darkWhite, borderRadius: 5, height: 38, width: AppSizes.screen.widthHalf,}} />
                                : this.props.headerItems.coachesTeams.length === 1 ?
                                    <FathomText oswaldRegular style={{alignSelf: 'center', color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(30),}}>
                                        {this.props.headerItems.selectedTeam.label.toUpperCase()}
                                    </FathomText>
                                    :
                                    <FathomPicker
                                        hideIcon={false}
                                        items={this.props.headerItems.coachesTeams}
                                        itemStyle={{color: 'blue', fontSize: 100,}}
                                        onValueChange={value => this.props.headerItems.updateState(value ? value : 0)}
                                        placeholder={{
                                            label: 'SELECT A TEAM',
                                            value: null,
                                        }}
                                        style={{
                                            headlessAndroidContainer: [{alignItems: 'center', justifyContent: 'center',}],
                                            inputAndroid:             [styles.pickerSelectIOS, {textAlignVertical: 'center',}],
                                            inputIOS:                 [styles.pickerSelectIOS],
                                            placeholderColor:         AppColors.zeplin.darkGrey,
                                            underline:                {borderTopColor: AppColors.white, borderTopWidth: 0,},
                                            viewContainer:            [{alignSelf: 'center',}],
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        value={this.props.headerItems.selectedTeamIndex}
                                    />
                            }
                        </View>
                        <View
                            style={{
                                alignItems:     'flex-end',
                                flex:           1,
                                justifyContent: 'center',
                            }}
                        >
                            <TabIcon
                                icon={'cached'}
                                iconStyle={[{color: AppColors.black,}]}
                                onPress={() => this.props.headerItems.onRefresh()}
                                reverse={false}
                                size={26}
                                type={'material-community'}
                            />
                        </View>
                    </View>
                    :
                    null
                }
                <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
                    {this.props.tabs.map((name, page) => {
                        const isTabActive = this.props.activeTab === page;
                        const renderTab = this.props.renderTab || this.renderTab;
                        return renderTab(name, page, isTabActive, this.props.goToPage);
                    })}
                    <Animated.View
                        style={[
                            tabUnderlineStyle,
                            {
                                transform: [
                                    { translateX },
                                ]
                            },
                            this.props.underlineStyle,
                        ]}
                    />
                </View>
            </View>
        );
    },
});

module.exports = CoachesDashboardTabBar;