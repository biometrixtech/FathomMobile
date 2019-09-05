/**
 * CustomTabBar
 *
     <CustomTabBar />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
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
        fontSize:  AppFonts.scaleFont(11),
        marginTop: AppSizes.paddingXSml,
        textAlign: 'center',
    },
});

/* Component ==================================================================== */
const CustomTabBar = ({ navigation, plan, user, }) => {
    let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
    // making sure we don't do any any logic here while loading
    if(dailyPlanObj && !dailyPlanObj.daily_readiness_survey_completed) {
        return (null);
    }
    let currentIndex = navigation.state.index;
    let currentRouteName = navigation.state.routes[currentIndex].routeName;
    let myPlanFocused = new RegExp('myPlan', 'g').test(currentRouteName);
    let trendsFocused = new RegExp('trends', 'g').test(currentRouteName);
    let settingsFocused = new RegExp('settings', 'g').test(currentRouteName);
    return (
        <View>
            <View style={[styles.container,]}>
                <TouchableOpacity onPress={user.loading ? () => {} : () => Actions.myPlan()} style={{flex: 1,}}>
                    <TabIcon
                        color={myPlanFocused ? AppColors.zeplin.yellow : AppColors.zeplin.slateLight}
                        icon={'clipboard-text'}
                        iconStyle={[{opacity: myPlanFocused ? 1 : 0.8,}]}
                        size={20}
                        type={'material-community'}
                    />
                    { myPlanFocused ?
                        <Text robotoBold style={[styles.text, {color: AppColors.zeplin.yellow,}]}>{'Plan'}</Text>
                        :
                        <Text robotoRegular style={[styles.text, {color: AppColors.zeplin.slateLight,}]}>{'Plan'}</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={user.loading ? () => {} : () => Actions.trends()} style={{flex: 1,}}>
                    <TabIcon
                        color={trendsFocused ? AppColors.zeplin.yellow : AppColors.zeplin.slateLight}
                        icon={'graph'}
                        iconStyle={[{opacity: trendsFocused ? 1 : 0.8,}]}
                        size={20}
                        type={'simple-line-icon'}
                    />
                    { trendsFocused ?
                        <Text robotoBold style={[styles.text, {color: AppColors.zeplin.yellow,}]}>{'Trends'}</Text>
                        :
                        <Text robotoRegular style={[styles.text, {color: AppColors.zeplin.slateLight,}]}>{'Trends'}</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={user.loading ? () => {} : () => Actions.settings()} style={{flex: 1,}}>
                    <TabIcon
                        color={settingsFocused ? AppColors.zeplin.yellow : AppColors.zeplin.slateLight}
                        icon={'dehaze'}
                        iconStyle={[{opacity: settingsFocused ? 1 : 0.8,}]}
                        size={20}
                    />
                    { settingsFocused ?
                        <Text robotoBold style={[styles.text, {color: AppColors.zeplin.yellow,}]}>{'Settings'}</Text>
                        :
                        <Text robotoRegular style={[styles.text, {color: AppColors.zeplin.slateLight,}]}>{'Settings'}</Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={[styles.bottomSpacing,]} />
        </View>
    );
}

CustomTabBar.propTypes = {};

CustomTabBar.defaultProps = {};

/* Export Component ==================================================================== */
const mapStateToProps = state => ({
    plan: state.plan,
    user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTabBar);
