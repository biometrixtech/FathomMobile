/**
 * BluetoothConnect
 *
    <BluetoothConnect
        assignKitIndividual={assignKitIndividual}
        getSensorFiles={getSensorFiles}
        updateUser={updateUser}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Alert, Image, Platform, View, } from 'react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, } from '../../constants';
import { AppAPI, AppUtil, } from '../../lib';
import { CVP, Connect, TopNav, Train, } from './ConnectScreens';
import { Button, TabIcon, Text, } from '../custom';
import { store, } from '../../store';
import { WebViewPageModal, } from '../general';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import { WebView, } from 'react-native-webview';
import _ from 'lodash';
import Egg from 'react-native-egg';
import LottieView from 'lottie-react-native';
import moment from 'moment';

// setup consts
const FIRST_TIME_EXPERIENCE_PREFIX = '3Sensor-Onboarding-';

/* Component ==================================================================== */
class BluetoothConnect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAccessoryData:   {},
            currentTime:            null,
            isDelaying:             false,
            isConnectionBtnActive:  false,
            isConnectionBtnLoading: false,
            isConnectionSuccessful: true,
            isNeedHelpModalOpen:    false,
            pageIndex:              0,
        };
        this.defaultState = {
            currentAccessoryData:   {},
            currentTime:            null,
            isDelaying:             false,
            isConnectionBtnActive:  false,
            isConnectionBtnLoading: false,
            isConnectionSuccessful: true,
            isNeedHelpModalOpen:    false,
            pageIndex:              0,
        };
        this._pages = {};
        this._scrollTimer = null;
        this._secondaryTimer = null;
        this._thirdTimer = null;
        this._timer = null;
        this._webview = {};
        this.lottieAnimation1 = {};
        this.lottieAnimation2 = {};
    }

    componentWillUnmount = () => {
        clearInterval(this._scrollTimer);
        clearInterval(this._secondaryTimer);
        clearInterval(this._thirdTimer);
        clearInterval(this._timer);
        this._pages = {};
        this._webview = {};
    }

    _delayAndContinue = (delayTime = 5000, callback) => this.setState(
        { isDelaying: true, },
        () => {
            this._timer = _.delay(
                () => this.setState(
                    { isDelaying: false, },
                    () => _.delay(() => this._renderNextPage(1, callback), 250),
                )
                , delayTime)
        },
    )

    _handleFinalSetup = (numberOfPages = 1) => {
        const { currentAccessoryData, } = this.state;
        const { assignKitIndividual, getSensorFiles, updateUser, user, } = this.props;
        clearInterval(this._timer);
        let newUserPayloadObj = {};
        newUserPayloadObj.sensor_data = {};
        newUserPayloadObj.sensor_data.sensor_pid = currentAccessoryData.macAddress;
        newUserPayloadObj.sensor_data.mobile_udid = AppUtil.getDeviceUUID();
        newUserPayloadObj.sensor_data.system_type = '3-sensor';
        let newUserNetworksPayloadObj = {};
        newUserNetworksPayloadObj['@sensor_data'] = {};
        newUserNetworksPayloadObj['@sensor_data'].sensor_networks = currentAccessoryData.ssid ? [currentAccessoryData.ssid] : [];
        let newUserObj = _.cloneDeep(user);
        newUserObj.sensor_data.sensor_pid = currentAccessoryData.macAddress;
        newUserObj.sensor_data.mobile_udid = AppUtil.getDeviceUUID();
        newUserObj.sensor_data.sensor_networks = [currentAccessoryData.ssid];
        newUserObj.sensor_data.system_type = '3-sensor';
        return assignKitIndividual({wifiMacAddress: currentAccessoryData.macAddress,}, user) // 1. assign kit to individual
            .then(() => updateUser(newUserPayloadObj, user.id)) // 2a. PATCH user specific endpoint - handles everything except for network name
            .then(() => updateUser(newUserNetworksPayloadObj, user.id)) // 2b. PATCH user specific endpoint - handles network names
            .then(() => getSensorFiles(newUserObj)) // 3. grab sensor files as they may have changed
            .then(() => this._renderNextPage(numberOfPages));
    }

    _handleTestConnection = isFinalChance => {
        const { currentAccessoryData, currentTime, } = this.state;
        let payload = {
            seconds_elapsed: moment().diff(currentTime, 'seconds'),
        };
        this.setState(
            { isConnectionBtnLoading: true, },
            () => AppAPI.hardware.check_sync.post({ wifiMacAddress: currentAccessoryData.macAddress, }, payload)
                .then(response => this.setState(
                    { isConnectionBtnLoading: ((isFinalChance && response.sync_found) || (!isFinalChance && response.sync_found)) ? true : false, },
                    () => {
                        if(
                            (isFinalChance && response.sync_found) ||
                            (!isFinalChance && response.sync_found)
                        ) {
                            return this._handleFinalSetup();
                        } else if(isFinalChance && !response.sync_found) {
                            return this.setState({ isConnectionSuccessful: false, }, () => this._renderNextPage());
                        }
                        return this._handleTestConnectionAlert();
                    }
                ))
                .catch(err => isFinalChance ?
                    this.setState({ isConnectionSuccessful: false, }, () => this._renderNextPage())
                    :
                    this._handleTestConnectionAlert()
                )
        );
    }

    _handleTestConnectionAlert = () => Alert.alert(
        'Connection test not yet complete',
        'Test is completed when LED on your PRO Kit turns green.',
        [
            {
                style: 'cancel',
                text:  'Continue Test',
            },
        ],
        { cancelable: true, }
    )

    _onPageScrollEnd = currentPage => {
        let lottieAnimation1Page = 7;
        let lottieAnimation2Page = 8;
        if(currentPage === lottieAnimation1Page && this.lottieAnimation1 && this.lottieAnimation1.play) {
            this.lottieAnimation1.play();
        } else if(currentPage === lottieAnimation2Page && this.lottieAnimation2 && this.lottieAnimation2.play) {
            this.lottieAnimation2.play();
        }
        if(
            (currentPage === 8 && this.state.isConnectionSuccessful) ||
            currentPage === 10
        ) { // we're on a checkpoint page, update user obj
            this._updateUserCheckpoint(currentPage);
        }
    }

    _renderNextPage = (numberOfPages = 1, callback) => {
        let nextPageIndex = (this.state.pageIndex + numberOfPages);
        this._pages.scrollToPage(nextPageIndex);
        this.setState(
            { pageIndex: nextPageIndex, },
            () => { this._scrollTimer = _.delay(() => callback && callback(), 750); }
        );
    }

    _renderPreviousPage = (numberOfPages = 1, callback) => {
        let nextPageIndex = (this.state.pageIndex - numberOfPages);
        this._pages.scrollToPage(nextPageIndex);
        this.setState(
            { pageIndex: nextPageIndex, },
            () => callback && callback(),
        );
    }

    _updateUserCheckpoint = page => {
        const { updateUser, user, } = this.props;
        // setup variables
        let value = `${FIRST_TIME_EXPERIENCE_PREFIX}${page}`;
        if(!this.props.user.first_time_experience.includes(value)) {
            let newUserPayloadObj = {};
            newUserPayloadObj.first_time_experience = [value];
            let newUserObj = _.cloneDeep(user);
            newUserObj.first_time_experience.push(value);
            // update reducer as API might take too long to return a value
            store.dispatch({
                type: DispatchActions.USER_REPLACE,
                data: newUserObj
            });
            // update user object
            updateUser(newUserPayloadObj, user.id, false);
        }
    }

    render = () => {
        const {
            currentAccessoryData,
            isDelaying,
            isConnectionBtnActive,
            isConnectionBtnLoading,
            isConnectionSuccessful,
            isNeedHelpModalOpen,
            pageIndex,
        } = this.state;
        return(
            <View style={{flex: 1,}}>

                <Pages
                    containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                    indicatorPosition={'none'}
                    onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)}
                    ref={pages => { this._pages = pages; }}
                    scrollEnabled={false}
                    startPage={pageIndex}
                >

                    {/* Welcome Screen - page 0 */}
                    <CVP
                        currentPage={pageIndex === 0}
                        nextBtn={this._renderNextPage}
                        toggleLearnMore={() => this.setState({ isNeedHelpModalOpen: !isNeedHelpModalOpen, })}
                    />

                    {/* Connect - pages 1 - 8 */}
                    <Connect
                        currentPage={pageIndex === 1}
                        nextBtn={this._renderNextPage}
                        page={0}
                        showTopNavStep={false}
                        toggleLearnMore={() => this.setState({ isNeedHelpModalOpen: !isNeedHelpModalOpen, })}
                    />
                    <Connect
                        currentPage={pageIndex === 2}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={7}
                        showTopNavStep={false}
                    />
                    <Connect
                        currentPage={pageIndex === 3}
                        nextBtn={this._renderNextPage}
                        onBack={this._renderPreviousPage}
                        page={8}
                        showTopNavStep={false}
                    />
                    <Connect
                        currentPage={pageIndex === 4}
                        isLoading={isDelaying}
                        nextBtn={() => this._delayAndContinue(2000)}
                        page={1}
                        showTopNavStep={false}
                    />
                    <Connect
                        currentPage={pageIndex === 5}
                        isLoading={isDelaying}
                        nextBtn={this._delayAndContinue}
                        onBack={isDelaying ? () => {} : () => this._renderPreviousPage()}
                        page={6}
                        showTopNavStep={false}
                    />
                    <View
                        style={{
                            flex:   1,
                            height: (AppSizes.screen.height * 0.75),
                            width:  (AppSizes.screen.width),
                        }}
                    >
                        <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                        <View style={{backgroundColor: AppColors.white, flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center',}}>
                            <View style={{flex: 3, justifyContent: 'center', paddingLeft: AppSizes.paddingSml,}}>
                                <Egg
                                    onCatch={() => Alert.alert(
                                        'Add user to this PRO Kit',
                                        `You\'re about to add this account as a user to Fathom PRO kit (${currentAccessoryData.macAddress}).\n\nTo do so:\n1. Open your phone's wifi settings\n2. Disconnect from "FathomPRO" network\n3. Come back & tap "continue"\n4. Wait ~10s for the success screen`,
                                        [
                                            {
                                                style: 'cancel',
                                                text:  'Cancel',
                                            },
                                            {
                                                onPress: () => this._handleFinalSetup(2),
                                                text:    'Continue',
                                            }
                                        ],
                                        { cancelable: true, }
                                    )}
                                    setps={'TTTTT'}
                                    style={{alignItems: 'flex-start', flex: 1, justifyContent: 'center', paddingLeft: AppSizes.paddingSml,}}
                                >
                                    <TabIcon
                                        color={AppColors.zeplin.slateXLight}
                                        icon={'clipboard-account-outline'}
                                        reverse={false}
                                        size={30}
                                        type={'material-community'}
                                    />
                                </Egg>
                            </View>
                            <View style={{flex: 4, justifyContent: 'center',}} />
                            <View style={{alignItems: 'flex-end', flex: 3, justifyContent: 'center', paddingRight: AppSizes.paddingSml,}}>
                                <TabIcon
                                    color={AppColors.zeplin.slateLight}
                                    icon={'close'}
                                    onPress={() => Actions.pop()}
                                    reverse={false}
                                    size={30}
                                />
                            </View>
                        </View>
                        { pageIndex === 6 &&
                            <WebView
                                cacheEnabled={false}
                                cacheMode={'LOAD_NO_CACHE'}
                                onError={syntheticEvent => {
                                    const { nativeEvent, } = syntheticEvent;
                                    if(nativeEvent.code && (nativeEvent.code === -1001 || nativeEvent.code === '-1001')) {
                                        return this._renderPreviousPage(
                                            1,
                                            () => Alert.alert(
                                                'We were not able to communicate with your Kit.',
                                                'Ensure you are connected to the FathomPRO network to continue setup. You may need to confirm the connection through a notification from your OS.',
                                                [
                                                    {
                                                        style: 'cancel',
                                                        text:  'OK',
                                                    },
                                                ],
                                                { cancelable: true, }
                                            )
                                        );
                                    }
                                    return this._renderPreviousPage(1, () => Alert.alert(
                                        'Your phone is not connected to FathomPRO network.',
                                        'The LED on your PRO Kit must be solid blue and your phone must be connected to the Fathom PRO wifi network. If you see a notification saying "Wi-Fi has no Internet access." Tap it and select "Yes".',
                                        [
                                            {
                                                style: 'cancel',
                                                text:  'Try Again',
                                            },
                                        ],
                                        { cancelable: true, }
                                    ))
                                }}
                                onMessage={event => {
                                    let data = JSON.parse(event.nativeEvent.data);
                                    if(
                                        data.error ||
                                        (
                                            !data.error &&
                                            (
                                                !data.macAddress ||
                                                data.macAddress.length === 0 ||
                                                !data.ssid ||
                                                data.ssid.length === 0
                                            )
                                        )
                                    ) {
                                        if(data.macAddress && !data.ssid) {
                                            return this.setState({
                                                currentAccessoryData: {
                                                    macAddress: data.macAddress.toUpperCase(),
                                                    ssid:       null,
                                                }
                                            });
                                        }
                                        return this._renderPreviousPage(2, () => Alert.alert(
                                            'Lost connection with FathomPRO network.',
                                            'Keep your PRO Kit near your phone while completing wifi setup. Make sure all of the sensors are inside the PRO Kit with the lid firmly closed.',
                                            [
                                                {
                                                    style: 'cancel',
                                                    text:  'Try Again',
                                                },
                                            ],
                                            { cancelable: true, }
                                        ));
                                    }
                                    this._timer = _.delay(() => this._handleTestConnection(true), 70000);
                                    this._secondaryTimer = _.delay(() => this.setState({ isConnectionBtnActive: true, }), 10000);
                                    return this._renderNextPage(1, () => {
                                        this._thirdTimer = _.delay(() =>
                                            this.setState(
                                                {
                                                    currentAccessoryData: {
                                                        macAddress: data.macAddress.toUpperCase(),
                                                        ssid:       data.ssid,
                                                    },
                                                    currentTime: moment(),
                                                }
                                            )
                                        , 250);
                                    });
                                }}
                                originWhitelist={['*']}
                                ref={ref => {this._webview = ref;}}
                                renderLoading={() =>
                                    <View style={{alignItems: 'center', bottom: 0, flex: 1, justifyContent: 'center', left: 0, paddingHorizontal: AppSizes.padding, position: 'absolute', right: 0, top: 0,}}>
                                        <ActivityIndicator
                                            animating
                                            color={AppColors.zeplin.yellow}
                                            size={'large'}
                                        />
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginTop: AppSizes.padding, textAlign: 'center',}}>
                                            {'Searching for a connection to the FathomPRO network'}
                                        </Text>
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), marginTop: AppSizes.padding, textAlign: 'center',}}>
                                            {'If your phone\'s not connect to the '}
                                            <Text robotoBold>{'FathomPRO'}</Text>
                                            {' wifi network. tap "Try Again" to go back.'}
                                        </Text>
                                        <Button
                                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                            containerStyle={{alignItems: 'center', marginTop: AppSizes.paddingLrg, justifyContent: 'center', width: '45%',}}
                                            onPress={() => {
                                                clearInterval(this._timer);
                                                if(this._webview && this._webview.stopLoading) {
                                                    this._webview.stopLoading();
                                                }
                                                return this._renderPreviousPage();
                                            }}
                                            raised={true}
                                            title={'Try Again'}
                                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                                        />
                                    </View>
                                }
                                source={{uri: 'http://192.168.240.1/gsprov.html'}}
                                startInLoadingState={true}
                                style={{flex: 1,}}
                            />
                        }
                    </View>
                    <View style={{flex: 1,}}>
                        <TopNav darkColor={true} onBack={null} showClose={false} showTopNavStep={false} />
                        <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                            <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>
                                {'Testing Connection'}
                            </Text>
                        </View>
                        <View style={{flex: 1, justifyContent: 'space-between',}}>
                            <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: (AppSizes.paddingXLrg + AppSizes.paddingMed),}}>
                                <View style={{alignItems: 'center',}}>
                                    <LottieView
                                        ref={animation => {this.lottieAnimation1 = animation;}}
                                        source={require('../../../assets/animation/wifi-loading.json')}
                                        style={{height: AppSizes.screen.widthHalf, width: AppSizes.screen.widthHalf,}}
                                    />
                                </View>
                                <View>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), lineHeight: AppFonts.scaleFont(24), textAlign: 'center',}}>
                                        {'We are checking for a strong wifi connection.\n\n'}
                                        <Text robotoBold>{'The LED on your Fathom PRO Kit will turn green'}</Text>
                                        {' when connection is a success!'}
                                    </Text>
                                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), lineHeight: AppFonts.scaleFont(18), marginTop: AppSizes.padding, textAlign: 'center',}}>
                                        {'(This may take up to 2 minutes, keep Kit closed)'}
                                    </Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.zeplin.green, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                    containerStyle={{alignItems: 'center', alignSelf: 'center', marginTop: AppSizes.paddingSml, justifyContent: 'center', width: '75%',}}
                                    loading={isConnectionBtnLoading}
                                    loadingProps={{color: AppColors.white,}}
                                    loadingStyle={{alignItems: 'center', justifyContent: 'center', width: '100%',}}
                                    onPress={() => isConnectionBtnActive ? this._handleTestConnection() : this._handleTestConnectionAlert()}
                                    raised={true}
                                    title={'My Kit LED is Green'}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1,}}>
                        <TopNav darkColor={true} onBack={null} showClose={!isConnectionSuccessful} showTopNavStep={false} />
                        <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                            <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>
                                {isConnectionSuccessful ? 'Success!' : 'Connection Failed'}
                            </Text>
                        </View>
                        <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.padding,}}>
                            <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: Platform.OS === 'ios' ? AppSizes.paddingLrg : AppSizes.padding, paddingVertical: (AppSizes.paddingXLrg + AppSizes.paddingMed),}}>
                                <View style={{alignItems: 'center',}}>
                                    {isConnectionSuccessful ?
                                        <LottieView
                                            loop={false}
                                            ref={animation => {this.lottieAnimation2 = animation;}}
                                            source={require('../../../assets/animation/bluetoothloading.json')}
                                            style={{height: AppSizes.screen.widthHalf, width: AppSizes.screen.widthHalf,}}
                                        />
                                        :
                                        <Image
                                            resizeMode={'contain'}
                                            source={require('../../../assets/images/standard/wifi-error.png')}
                                            style={{alignSelf: 'center', height: AppSizes.screen.widthHalf, width: AppSizes.screen.widthHalf,}}
                                        />
                                    }
                                    {isConnectionSuccessful ?
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), lineHeight: AppFonts.scaleFont(24), marginTop: AppSizes.paddingLrg, textAlign: 'center',}}>
                                            {'Bring PRO Kit in range of '}
                                            <Text robotoBold>{currentAccessoryData && currentAccessoryData.ssid || ''}</Text>
                                            {' after every workout to upload your training data and update your Recovery Plan!'}
                                        </Text>
                                        :
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), lineHeight: AppFonts.scaleFont(24), marginTop: AppSizes.paddingLrg, textAlign: 'center',}}>
                                            {'You may have entered the wrong password, your phone lost connection with you PRO Kit, or your Kit is no longer in range of the wifi network.'}
                                        </Text>
                                    }
                                </View>
                            </View>
                            <View style={{alignItems: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                                <Button
                                    buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                    containerStyle={{alignItems: 'center', alignSelf: 'center', marginTop: AppSizes.paddingSml, justifyContent: 'center', width: isConnectionSuccessful ? '45%' : '75%',}}
                                    onPress={isConnectionSuccessful ?
                                        () => this._renderNextPage()
                                        :
                                        () => {
                                            let newState = _.cloneDeep(this.defaultState);
                                            newState.pageIndex = 6;
                                            this.setState(
                                                { ...newState, },
                                                () => this._renderPreviousPage(2),
                                            );
                                        }
                                    }
                                    raised={true}
                                    title={isConnectionSuccessful ? 'Next' : 'Try Again'}
                                    titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Train - pages 9 - 10 */}
                    <Train
                        currentPage={pageIndex === 9}
                        nextBtn={this._renderNextPage}
                        page={0}
                        showTopNavStep={false}
                    />
                    <Train
                        currentPage={pageIndex === 10}
                        nextBtn={() => AppUtil.pushToScene('myPlan')}
                        onBack={this._renderPreviousPage}
                        page={1}
                        showTopNavStep={false}
                    />

                </Pages>

                <WebViewPageModal
                    handleModalToggle={() => this.setState({ isNeedHelpModalOpen: !isNeedHelpModalOpen, })}
                    isModalOpen={isNeedHelpModalOpen}
                    webViewPageSource={'https://intercom.help/fathomai/'}
                />

            </View>
        )
    }
}

BluetoothConnect.propTypes = {
    assignKitIndividual: PropTypes.func.isRequired,
    getSensorFiles:      PropTypes.func.isRequired,
    updateUser:          PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};

BluetoothConnect.defaultProps = {};

BluetoothConnect.componentName = 'BluetoothConnect';

/* Export Component ================================================================== */
export default BluetoothConnect;