/**
 * CustomNavBar
 *
     <CustomNavBar />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Image, Platform, StatusBar, StyleSheet, View, } from 'react-native';
import { connect } from 'react-redux';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, ErrorMessages, } from '../../constants';
import { AppUtil, } from '../../lib';
import { plan as PlanActions, } from '../../actions';
import { TabIcon, Text, } from './';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.white,
        flexDirection:   'row',
        height:          AppSizes.navbarHeight,
    },
});

/* Component ==================================================================== */
class CustomNavBar extends Component {
    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            isCoachesDashboardLoading: false,
        }
    }

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content');
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor(AppColors.primary.grey.twentyPercent);
        }
    }

    _renderLeft = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: AppSizes.paddingXSml,}}>
                { this.props.routeName === 'onboarding' && !this.props.user.id ?
                    <TabIcon
                        icon={'arrow-left'}
                        iconStyle={[{color: AppColors.black,}]}
                        onPress={Actions.currentParams.onLeft}
                        reverse={false}
                        size={26}
                        type={'simple-line-icon'}
                    />
                    : Actions.currentParams.onLeft && this.props.routeName === 'coachesDashboard' ?
                        <TabIcon
                            icon={'settings'}
                            iconStyle={[{color: AppColors.black,}]}
                            onPress={Actions.currentParams.onLeft}
                            reverse={false}
                            size={26}
                            type={'material-community'}
                        />
                        : Actions.currentParams.onLeft && this.props.routeName !== 'onboarding' ?
                            <TabIcon
                                icon={'arrow-left'}
                                iconStyle={[{color: AppColors.black,}]}
                                onPress={Actions.currentParams.onLeft}
                                reverse={false}
                                size={26}
                                type={'simple-line-icon'}
                            />
                            :
                            null
                }
            </View>
        )
    }

    _renderMiddle = () => {
        if(this.props.routeName === 'coachesDashboard') {
            return (
                <Image
                    source={require('../../../assets/images/standard/fathom-gold-and-grey.png')}
                    style={[AppStyles.navbarImageTitle, {alignSelf: 'center', flex: 8, justifyContent: 'center',}]}
                />
            )
        }
        return (
            <View style={{flex: 8, justifyContent: 'center',}}>
                <Text style={[AppStyles.h3, {color: AppColors.black, textAlign: 'center'}]}>{Actions.currentParams.title}</Text>
            </View>
        )
    }

    _renderRight = () => {
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
        if(this.props.routeName === 'coachesDashboard') {
            return(
                <Animated.View
                    style={{
                        flex:           1,
                        justifyContent: 'center',
                        paddingLeft:    AppSizes.paddingXSml,
                        transform:      this.state.isCoachesDashboardLoading ? [{rotate: spin}] : [],
                    }}
                >
                    <TabIcon
                        icon={'cached'}
                        iconStyle={[{color: AppColors.black,}]}
                        onPress={() => this._handleCoachesDashboardRefresh()}
                        reverse={false}
                        size={26}
                        type={'material-community'}
                    />
                </Animated.View>
            )
        }
        return(<View style={{flex: 1}}></View>)
    }

    _handleCoachesDashboardRefresh = () => {
        // fetch coaches dashboard data
        let userId = this.props.user.id;
        this.setState({ isCoachesDashboardLoading: true, });
        this.props.getCoachesDashboardData(userId)
            .then(res => this.setState({ isCoachesDashboardLoading: false, }))
            .catch(err => {
                this.setState({ isCoachesDashboardLoading: false, });
                AppUtil.handleAPIErrorAlert(ErrorMessages.patchFunctionalStrength);
            });
    }

    render = () => {
        return (
            <View>
                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                <View style={[styles.container, this.props.routeName === 'settings' ? {borderBottomColor: AppColors.border, borderBottomWidth: 2,} : {}]}>
                    {this._renderLeft()}
                    {this._renderMiddle()}
                    {this._renderRight()}
                </View>
            </View>
        );
    }

}

/* Export Component ==================================================================== */
const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {
    getCoachesDashboardData: PlanActions.getCoachesDashboardData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomNavBar);
