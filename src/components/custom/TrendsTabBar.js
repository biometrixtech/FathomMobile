import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ViewPropTypes, } from 'react-native';
import { AppFonts, AppSizes, } from '../../constants';

const styles = StyleSheet.create({
    tab: {
        alignItems:     'center',
        flex:           1,
        justifyContent: 'center',
        paddingBottom:  10,
    },
    tabs: {
        flexDirection:  'row',
        justifyContent: 'space-around',
    },
});

const TrendsTabBar = createReactClass({
    propTypes: {
        activeTab:         PropTypes.number,
        activeTextColor:   PropTypes.string,
        backgroundColor:   PropTypes.string,
        goToPage:          PropTypes.func,
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
            inactiveTextColor: 'black',
        };
    },

    renderTabOption(name, page) {},

    renderTab(name, page, isTabActive, onPressHandler) {
        const { activeTextColor, inactiveTextColor, } = this.props;
        let textStyle = {...AppFonts.robotoRegular, fontSize: AppFonts.scaleFont(isTabActive ? 18 : 14),};
        if(isTabActive) {
            textStyle = { ...textStyle, ...AppFonts.robotoBold, };
        }
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        return (
            <TouchableOpacity
                accessibilityLabel={name}
                accessibilityTraits={'button'}
                accessible={true}
                onPress={() => onPressHandler(page)}
                key={name}
                style={{flex: 1,}}
            >
                <View style={[styles.tab, this.props.tabStyle,]}>
                    <Text style={[{color: textColor, fontWeight,}, textStyle,]}>
                        {name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    },

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const wrapperPadding = AppSizes.padding;
        const underLineWidth = ((containerWidth - (AppSizes.padding * 2)) / numberOfTabs);
        const tabUnderlineStyle = {
            backgroundColor: 'navy',
            bottom:          0,
            height:          4,
            position:        'absolute',
            width:           underLineWidth,
        };
        const translateX = this.props.scrollValue.interpolate({
            inputRange:  [0, 1],
            outputRange: [0,  underLineWidth],
        });
        return (
            <View style={{paddingHorizontal: wrapperPadding,}}>
                <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor,}, this.props.style,]}>
                    {this.props.tabs.map((name, page) => {
                        const isTabActive = this.props.activeTab === page;
                        const renderTab = this.props.renderTab || this.renderTab;
                        return renderTab(name, page, isTabActive, this.props.goToPage);
                    })}
                    <Animated.View
                        style={[tabUnderlineStyle, {transform: [{ translateX },]}, this.props.underlineStyle,]}
                    />
                </View>
            </View>
        );
    },
});

module.exports = TrendsTabBar;