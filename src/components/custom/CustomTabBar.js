/**
 * CustomTabBar
 *
     <CustomTabBar />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../constants';
import { TabIcon, Text, } from './';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    bottomSpacing: {
        backgroundColor: AppColors.zeplin.superLight,
        height:          Platform.OS === 'android' ? AppSizes.paddingMed : AppSizes.iphoneXBottomBarPadding,
    },
    container: {
        backgroundColor: AppColors.zeplin.superLight,
        flexDirection:   'row',
        paddingTop:      AppSizes.paddingMed,
    },
    text: {
        color:     AppColors.zeplin.yellow,
        fontSize:  AppFonts.scaleFont(11),
        marginTop: AppSizes.paddingXSml,
        textAlign: 'center',
    },
});

/* Component ==================================================================== */
const CustomTabBar = ({ navigation, }) => {
    let currentIndex = navigation.state.index;
    let currentRouteName = navigation.state.routes[currentIndex].routeName;
    let myPlanFocused = new RegExp('myPlan', 'g').test(currentRouteName);
    let trendsFocused = new RegExp('trends', 'g').test(currentRouteName);
    let settingsFocused = new RegExp('settings', 'g').test(currentRouteName);
    return(
        <View>
            <View style={[styles.container,]}>
                <TouchableOpacity onPress={() => Actions.myPlan()} style={{flex: 1,}}>
                    <TabIcon
                        color={myPlanFocused ? AppColors.zeplin.yellow : AppColors.zeplin.slate}
                        icon={'run'}
                        iconStyle={[{opacity: myPlanFocused ? 1 : 0.8,}]}
                        size={20}
                        type={'material-community'}
                    />
                    <Text robotoRegular style={[styles.text,]}>
                        {myPlanFocused ? 'Plan' : ' '}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Actions.trends()} style={{flex: 1,}}>
                    <TabIcon
                        color={trendsFocused ? AppColors.zeplin.yellow : AppColors.zeplin.slate}
                        icon={'graph'}
                        iconStyle={[{opacity: trendsFocused ? 1 : 0.8,}]}
                        size={20}
                        type={'simple-line-icon'}
                    />
                    <Text robotoRegular style={[styles.text,]}>
                        {trendsFocused ? 'Trends' : ' '}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Actions.settings()} style={{flex: 1,}}>
                    <TabIcon
                        color={settingsFocused ? AppColors.zeplin.yellow : AppColors.zeplin.slate}
                        icon={'dehaze'}
                        iconStyle={[{opacity: settingsFocused ? 1 : 0.8,}]}
                        size={20}
                    />
                    <Text robotoRegular style={[styles.text,]}>
                        {settingsFocused ? 'Settings' : ' '}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.bottomSpacing,]} />
        </View>
    );
}

CustomTabBar.propTypes = {};

CustomTabBar.defaultProps = {};

/* Export Component ==================================================================== */
export default CustomTabBar;

