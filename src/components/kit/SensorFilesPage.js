/**
 * SensorFilesPage View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import { WebView, } from 'react-native-webview';
import _ from 'lodash';
import moment from 'moment';
import LottieView from 'lottie-react-native';

// Consts and Libs
import { Actions as DispatchActions, AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppAPI, AppUtil, SensorLogic, } from '../../lib';
import { Battery, Calibration, Connect, Placement, Session, TopNav, } from './ConnectScreens';
import { Button, ListItem, Spacer, TabIcon, Text, } from '../custom';
import { store, } from '../../store';

/* Component ==================================================================== */
const TopNavBar = () => (
    <View>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{backgroundColor: AppColors.white, flexDirection: 'row', marginHorizontal: AppSizes.padding, marginTop: AppSizes.statusBarHeight, paddingVertical: AppSizes.paddingSml,}}>
            <View style={{flex: 1, justifyContent: 'center',}}>
                <TabIcon
                    color={AppColors.zeplin.slateLight}
                    icon={'chevron-left'}
                    onPress={() => Actions.pop()}
                    size={40}
                />
            </View>
            <View style={{flex: 8, justifyContent: 'center',}} />
            <View style={{flex: 1, justifyContent: 'center',}} />
        </View>
    </View>
);

class SensorFilesPage extends Component {
    static componentName = 'SensorFilesPage';

    static propTypes = {
        pageStep:   PropTypes.string.isRequired,
        startPage:  PropTypes.number,
        updateUser: PropTypes.func.isRequired,
        user:       PropTypes.shape({}).isRequired,
    }

    static defaultProps = {
        startPage: 0,
    }

    constructor(props) {
        super(props);
        this.state = {
            currentAccessoryData:   {},
            currentTime:            null,
            isDelaying:             false,
            isConnectionBtnActive:  false,
            isConnectionBtnLoading: false,
            isConnectionSuccessful: true,
            isVideoPaused:          false,
            pageIndex:              props.startPage,
        };
        this.defaultState = {
            currentAccessoryData:   {},
            currentTime:            null,
            isDelaying:             false,
            isConnectionBtnActive:  false,
            isConnectionBtnLoading: false,
            isConnectionSuccessful: true,
            isVideoPaused:          false,
            pageIndex:              props.startPage,
        };
        this._pages = {};
        this._secondaryTimer = null;
        this._thirdTimer = null;
        this._timer = null;
        this._webview = {};
        this.lottieAnimation1 = {};
        this.lottieAnimation2 = {};
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }

    componentWillUnmount = () => {
        clearInterval(this._secondaryTimer);
        clearInterval(this._thirdTimer);
        clearInterval(this._timer);
        this._pages = {};
        this._webview = {};
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
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
        const { updateUser, user, } = this.props;
        // dont define owner here
        if(currentAccessoryData.macAddress !== user.sensor_data.sensor_pid) {
            // if user is updating wifi for a different access point - just auto progress
            return this._renderNextPage(numberOfPages);
        }
        // if user is updating wifi for THEIR access point
        clearInterval(this._timer);
        let newUserObj = _.cloneDeep(user);
        newUserObj.sensor_data.sensor_networks = currentAccessoryData.ssid ? [currentAccessoryData.ssid] : [];
        store.dispatch({
            type: DispatchActions.USER_REPLACE,
            data: newUserObj,
        });
        let newUserNetworksPayloadObj = {};
        newUserNetworksPayloadObj['@sensor_data'] = {};
        newUserNetworksPayloadObj['@sensor_data'].sensor_networks = currentAccessoryData.ssid ? [currentAccessoryData.ssid] : [];
        return updateUser(newUserNetworksPayloadObj, user.id) // 1. PATCH user specific endpoint - handles network names
            .then(() => this._renderNextPage(numberOfPages));
    }

    _handleNotInRange = () => {
        Alert.alert(
            '',
            'You may be out of range of your preferred network. If you have data on your Kit pending upload, bring your Kit into range of your preferred network.\n\nIf you do not have any recent workouts to upload, you do not need to be in range of your preferred network.',
            [
                {
                    text:  'OK',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
        );
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
        const { currentAccessoryData, } = this.state;
        const { pageStep, updateUser, user, } = this.props;
        let lottieAnimation1Page = 3;
        let lottieAnimation2Page = 4;
        if(currentPage === lottieAnimation1Page && pageStep === 'connect' && this.lottieAnimation1 && this.lottieAnimation1.play) {
            this.lottieAnimation1.play();
        } else if(currentPage === lottieAnimation2Page && pageStep === 'connect' && this.lottieAnimation2 && this.lottieAnimation2.play) {
            this.lottieAnimation2.play();
        }
        if(
            currentPage === lottieAnimation1Page &&
            currentAccessoryData.macAddress === user.sensor_data.sensor_pid
        ) {
            // clear user ssid
            let newUserNetworksPayloadObj = {};
            newUserNetworksPayloadObj['@sensor_data'] = {};
            newUserNetworksPayloadObj['@sensor_data'].sensor_networks = [];
            let newUserObj = _.cloneDeep(user);
            newUserObj.sensor_data.sensor_networks = [];
            store.dispatch({
                type: DispatchActions.USER_REPLACE,
                data: newUserObj,
            });
            updateUser(newUserNetworksPayloadObj, user.id);
        }
    }

    _renderNextPage = (numberOfPages = 1, callback) => {
        let nextPageIndex = (this.state.pageIndex + numberOfPages);
        this._pages.scrollToPage(nextPageIndex);
        this.setState(
            { pageIndex: nextPageIndex, },
            () => callback && callback(),
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

    render = () => {
        const { pageStep, user, } = this.props;
        const { currentAccessoryData, isDelaying, isConnectionBtnActive, isConnectionBtnLoading, isConnectionSuccessful, isVideoPaused, pageIndex, } = this.state;
        if(pageStep !== 'sessions') {
            return(
                <View style={{backgroundColor: AppColors.white, flex: 1,}}>
                    { pageStep === 'connect' ?
                        <Pages
                            containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                            indicatorPosition={'none'}
                            onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)}
                            ref={pages => { this._pages = pages; }}
                            scrollEnabled={false}
                            startPage={pageIndex}
                        >
                            <Connect
                                currentPage={pageIndex === 0}
                                isLoading={isDelaying}
                                nextBtn={() => this._delayAndContinue(2000)}
                                page={1}
                                showTopNavStep={false}
                            />
                            <Connect
                                currentPage={pageIndex === 1}
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
                                    <View style={{flex: 1, justifyContent: 'center', paddingLeft: AppSizes.paddingSml,}} />
                                    <View style={{flex: 8, justifyContent: 'center',}} />
                                    <View style={{flex: 1, justifyContent: 'center', paddingRight: AppSizes.paddingSml,}}>
                                        <TabIcon
                                            color={AppColors.zeplin.slateLight}
                                            icon={'close'}
                                            onPress={() => Actions.pop()}
                                            reverse={false}
                                            size={30}
                                        />
                                    </View>
                                </View>
                                { pageIndex === 2 &&
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
                                                        text:  'OK',
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
                                                            text:  'OK',
                                                            style: 'cancel',
                                                        },
                                                    ],
                                                    { cancelable: true, }
                                                ));
                                            }
                                            this._timer = _.delay(() => this._handleTestConnection(true), 70000);
                                            this._secondaryTimer = _.delay(() => this.setState(
                                                { isConnectionBtnActive: true, },
                                            ), 10000);
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
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: (AppSizes.paddingXLrg + AppSizes.paddingMed),}}>
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
                                                    {'This may be due to a wrong password, or weak wifi strength because the Kit is too far from the router.'}
                                                </Text>
                                            }
                                        </View>
                                    </View>
                                    <View style={{alignItems: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                                        <Button
                                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                            containerStyle={{alignItems: 'center', alignSelf: 'center', marginTop: AppSizes.paddingSml, justifyContent: 'center', width: isConnectionSuccessful ? '45%' : '75%',}}
                                            onPress={isConnectionSuccessful ?
                                                () => Actions.pop()
                                                :
                                                () => {
                                                    let newState = _.cloneDeep(this.defaultState);
                                                    newState.pageIndex = 4;
                                                    this.setState(
                                                        { ...newState, },
                                                        () => this._renderPreviousPage(4),
                                                    );
                                                }
                                            }
                                            raised={true}
                                            title={isConnectionSuccessful ? 'Done' : 'Try Again'}
                                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Pages>
                        : pageStep === 'calibrate' ?
                            <Pages
                                containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                indicatorPosition={'none'}
                                ref={pages => { this._pages = pages; }}
                                scrollEnabled={false}
                                startPage={pageIndex}
                            >
                                <Calibration
                                    currentPage={pageIndex === 0}
                                    handleUpdatePauseState={() => this.setState({ isVideoPaused: !this.state.isVideoPaused, })}
                                    isVideoPaused={isVideoPaused}
                                    nextBtn={() => this._renderNextPage()}
                                    page={2}
                                    showTopNavStep={false}
                                />
                                <Calibration
                                    currentPage={pageIndex === 1}
                                    nextBtn={() => Actions.pop()}
                                    onBack={() => this._renderPreviousPage()}
                                    page={3}
                                    showTopNavStep={false}
                                />
                            </Pages>
                            : pageStep === 'placement' ?
                                <Pages
                                    containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                    indicatorPosition={'none'}
                                    ref={pages => { this._pages = pages; }}
                                    scrollEnabled={false}
                                    startPage={pageIndex}
                                >
                                    <Placement
                                        currentPage={pageIndex === 0}
                                        nextBtn={this._renderNextPage}
                                        page={4}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 1}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={5}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 2}
                                        nextBtn={this._renderNextPage}
                                        onBack={this._renderPreviousPage}
                                        page={6}
                                        showTopNavStep={false}
                                    />
                                    <Placement
                                        currentPage={pageIndex === 3}
                                        nextBtn={() => Actions.pop()}
                                        onBack={this._renderPreviousPage}
                                        page={7}
                                        showTopNavStep={false}
                                    />
                                </Pages>
                                : pageStep === 'end' ?
                                    <Pages
                                        containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                        indicatorPosition={'none'}
                                        ref={pages => { this._pages = pages; }}
                                        scrollEnabled={false}
                                        startPage={pageIndex}
                                    >
                                        <Session
                                            currentPage={pageIndex === 0}
                                            nextBtn={this._renderNextPage}
                                            page={1}
                                            showTopNavStep={false}
                                        />
                                        <Session
                                            currentPage={pageIndex === 1}
                                            nextBtn={this._renderNextPage}
                                            onBack={this._renderPreviousPage}
                                            page={2}
                                            showTopNavStep={false}
                                        />
                                        <Connect
                                            currentPage={pageIndex === 2}
                                            handleNotInRange={() => this._handleNotInRange()}
                                            nextBtn={() => Actions.pop()}
                                            onBack={this._renderPreviousPage}
                                            page={5}
                                            showTopNavStep={false}
                                        />
                                    </Pages>
                                    : pageStep === 'battery' ?
                                        <Battery
                                            currentPage={true}
                                            showTopNavStep={false}
                                        />
                                        : pageStep === 'session' ?
                                            <Connect
                                                currentPage={true}
                                                handleNotInRange={() => this._handleNotInRange()}
                                                page={5}
                                                showTopNavStep={false}
                                            />
                                            :
                                            <View />
                    }
                </View>
            );
        }
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
                <TopNavBar />
                <View style={{flex: 1,}}>
                    <Text oswaldRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{'RECORDED WORKOUTS'}</Text>
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginHorizontal: AppSizes.padding, marginVertical: AppSizes.padding, textAlign: 'center',}}>{'Here you\'ll find the upload & processing status of all workouts tracked with the Fathom PRO Kit!\n\nIf you don\'t see a workout, make sure your system is charged & in a paired wifi network to start upload.'}</Text>
                    <Spacer isDivider />
                    { user && user.sensor_data && user.sensor_data.sessions && user.sensor_data.sessions.length > 0 ?
                        <ScrollView contentContainerStyle={{flexGrow: 1,}}>
                            {_.map(user.sensor_data.sessions, (session, key) => {
                                const {
                                    iconName,
                                    iconType,
                                    leftIconString,
                                    subtitle,
                                    title,
                                } = SensorLogic.handleSessionRenderLogic(session);
                                return (
                                    <View key={key}>
                                        <ListItem
                                            containerStyle={{paddingVertical: AppSizes.padding,}}
                                            leftIcon={
                                                <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.superLight, borderRadius: (40 / 2), height: 40, justifyContent: 'center', width: 40,}}>
                                                    <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{leftIconString}</Text>
                                                </View>
                                            }
                                            subtitle={
                                                <View style={{alignItems: 'center', flexDirection: 'row', paddingLeft: AppSizes.paddingMed,}}>
                                                    { iconName &&
                                                        <TabIcon
                                                            color={AppColors.zeplin.slateXLight}
                                                            containerStyle={[{marginRight: AppSizes.paddingXSml,}]}
                                                            icon={iconName}
                                                            size={AppFonts.scaleFont(15)}
                                                            type={iconType}
                                                        />
                                                    }
                                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12),}}>{subtitle}</Text>
                                                </View>
                                            }
                                            title={title}
                                            titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                                            titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                                        />
                                        <Spacer isDivider />
                                    </View>
                                )
                            })}
                        </ScrollView>
                        :
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                            <Text oswaldRegular style={{color: AppColors.zeplin.slateXLight, fontSize: AppFonts.scaleFont(33), textAlign: 'center',}}>{'NO WORKOUTS YET!'}</Text>
                        </View>
                    }
                </View>
                <TouchableOpacity
                    onPress={() => Actions.sensorFilesPage({ pageStep: 'session', })}
                    style={{paddingVertical: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}
                >
                    <Text
                        robotoMedium
                        style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), textAlign: 'center', textDecorationLine: 'underline',}}
                    >
                        {'Remind me how to update data'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SensorFilesPage;
