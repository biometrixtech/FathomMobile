/**
 * SensorFilesPage View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
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
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppAPI, AppUtil, SensorLogic, } from '../../lib';
import { Battery, Calibration, Connect, Placement, Session, TopNav, } from './ConnectScreens';
import { Button, ListItem, Spacer, TabIcon, Text, } from '../custom';

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
        assignKitIndividual: PropTypes.func.isRequired,
        getSensorFiles:      PropTypes.func.isRequired,
        pageStep:            PropTypes.string.isRequired,
        updateUser:          PropTypes.func.isRequired,
        user:                PropTypes.shape({}).isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            currentAccessoryData:   {},
            currentUTCTime:         null,
            isDelaying:             false,
            isConnectionBtnActive:  false,
            isConnectionBtnLoading: false,
            isConnectionSuccessful: true,
            isVideoPaused:          false,
            pageIndex:              0,
        };
        this.defaultState = {
            currentAccessoryData:   {},
            currentUTCTime:         null,
            isDelaying:             false,
            isConnectionBtnActive:  false,
            isConnectionBtnLoading: false,
            isConnectionSuccessful: true,
            isVideoPaused:          false,
            pageIndex:              0,
        };
        this._pages = {};
        this._secondaryTimer = null;
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
        clearInterval(this._timer);
        clearInterval(this._secondaryTimer);
        this._pages = {};
        this._webview = {};
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
    }

    _delayAndContinue = callback => this.setState(
        { isDelaying: true, },
        () => {
            this._timer = _.delay(
                () => this.setState(
                    { isDelaying: false, },
                    () => this._renderNextPage(1, callback),
                )
                , 5000)
        },
    )

    _handleNotInRange = () => {
        Alert.alert(
            '',
            'You may be out of range of your preferred network. If you have data on your kit pending upload, bring your kit into range of your preferred network.\n\nIf you do not have any recent workouts to upload, you do not need to be in range of your preferred network.',
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
        const { currentAccessoryData, currentUTCTime, } = this.state;
        const { assignKitIndividual, getSensorFiles, updateUser, user, } = this.props;
        let payload = {
            start_date_time: currentUTCTime,
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
                            clearInterval(this._timer);
                            let newUserPayloadObj = {};
                            newUserPayloadObj.sensor_data = {};
                            newUserPayloadObj.sensor_data.sensor_pid = currentAccessoryData.macAddress;
                            newUserPayloadObj.sensor_data.mobile_udid = AppUtil.getDeviceUUID();
                            newUserPayloadObj.sensor_data.system_type = '3-sensor';
                            let newUserNetworksPayloadObj = {};
                            newUserNetworksPayloadObj['@sensor_data'] = {};
                            newUserNetworksPayloadObj['@sensor_data'].sensor_networks = [currentAccessoryData.ssid];
                            let newUserObj = _.cloneDeep(user);
                            newUserObj.sensor_data.sensor_pid = currentAccessoryData.macAddress;
                            newUserObj.sensor_data.mobile_udid = AppUtil.getDeviceUUID();
                            newUserObj.sensor_data.sensor_networks = [currentAccessoryData.ssid];
                            newUserObj.sensor_data.system_type = '3-sensor';
                            return assignKitIndividual({wifiMacAddress: currentAccessoryData.macAddress,}, user) // 1. assign kit to individual
                                .then(() => updateUser(newUserPayloadObj, user.id)) // 2a. PATCH user specific endpoint - handles everything except for network name
                                .then(() => updateUser(newUserNetworksPayloadObj, user.id)) // 2b. PATCH user specific endpoint - handles network names
                                .then(() => getSensorFiles(newUserObj)) // 3. grab sensor files as they may have changed
                                .then(() => this._renderNextPage());
                        } else if(isFinalChance && !response.sync_found) {
                            return this.setState({ isConnectionSuccessful: false, }, () => this._renderNextPage());
                        }
                        return Alert.alert(
                            'Connection test not yet complete',
                            'Test is completed when LED on your PRO Kit turns green.',
                            [
                                {
                                    style: 'cancel',
                                    text:  'Continue Test',
                                },
                            ],
                            { cancelable: true, }
                        );
                    }
                ))
                .catch(err => this.setState({ isConnectionSuccessful: false, }, () => this._renderNextPage()))
        );
    }

    _handleWebViewLoadTime = () => {
        this._timer = _.delay(() => {
            if(this._webview && this._webview.stopLoading) {
                this._webview.stopLoading();
            }
            return this._renderPreviousPage(
                1,
                () => Alert.alert(
                    'We were not able to communicate with your kit.',
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
        }, 30000);
    }

    _onPageScrollEnd = currentPage => {
        const { pageStep, } = this.props;
        let lottieAnimation1Page = 3;
        let lottieAnimation2Page = 4;
        if(currentPage === lottieAnimation1Page && pageStep === 'connect' && this.lottieAnimation1 && this.lottieAnimation1.play) {
            this.lottieAnimation1.play();
        } else if(currentPage === lottieAnimation2Page && pageStep === 'connect' && this.lottieAnimation2 && this.lottieAnimation2.play) {
            this.lottieAnimation2.play();
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
        const { isDelaying, isConnectionBtnActive, isConnectionBtnLoading, isConnectionSuccessful, isVideoPaused, pageIndex, } = this.state;
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
                                nextBtn={this._delayAndContinue}
                                page={1}
                            />
                            <Connect
                                currentPage={pageIndex === 1}
                                isLoading={isDelaying}
                                nextBtn={() => this._delayAndContinue(() => this._handleWebViewLoadTime())}
                                page={6}
                            />
                            <View
                                style={{
                                    flex:   1,
                                    height: (AppSizes.screen.height * 0.75),
                                    width:  (AppSizes.screen.width),
                                }}
                            >
                                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, color: AppColors.black, height: AppSizes.statusBarHeight,}} />
                                { pageIndex === 2 &&
                                    <WebView
                                        cacheEnabled={false}
                                        cacheMode={'LOAD_NO_CACHE'}
                                        onError={syntheticEvent => {
                                            const { nativeEvent, } = syntheticEvent;
                                            return this._renderPreviousPage(1, () => Alert.alert(
                                                'WEBVIEW ONERROR - ERROR2',
                                                `canGoBack: ${nativeEvent.canGoBack}, canGoForward: ${nativeEvent.canGoForward}, code: ${nativeEvent.code}, description: ${nativeEvent.description}, didFailProvisionalNavigation: ${nativeEvent.didFailProvisionalNavigation}, domain: ${nativeEvent.domain}, loading: ${nativeEvent.loading}, target: ${nativeEvent.target}, title: ${nativeEvent.title}, url: ${nativeEvent.url}`,
                                                [
                                                    {
                                                        style: 'cancel',
                                                        text:  'OK',
                                                    },
                                                ],
                                                { cancelable: true, }
                                            ));
                                        }}
                                        onLoad={syntheticEvent => clearInterval(this._timer)}
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
                                                return this._renderPreviousPage(1, () => Alert.alert(
                                                    'MESSAGE FROM WEBAPP RECEIVED - ERROR',
                                                    `error: ${data.error}, errorCode: ${data.errorCode}`,
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
                                                let macAddress = data.macAddress.toUpperCase();
                                                let ssid = data.ssid;
                                                let currentAccessoryData = {
                                                    macAddress,
                                                    ssid,
                                                };
                                                return AppAPI.hardware.get_utc_time.get()
                                                    .then(async response => {
                                                        let responseDate = response.current_date;
                                                        let currentUTCTime = moment(responseDate, 'YYYY-MM-DDTHH:mm:ssZ').utc();
                                                        this.setState({ currentAccessoryData: currentAccessoryData, currentUTCTime: currentUTCTime, });
                                                    })
                                                    .catch(err => this.setState({ isConnectionSuccessful: false, }, () => this._renderNextPage(2)));
                                            });
                                        }}
                                        originWhitelist={['*']}
                                        ref={ref => {this._webview = ref;}}
                                        renderLoading={() =>
                                            <View style={{alignItems: 'center', bottom: 0, flex: 1, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0,}}>
                                                <ActivityIndicator
                                                    animating
                                                    color={AppColors.zeplin.yellow}
                                                    size={'large'}
                                                />
                                                <Text robotoRegular style={{color: AppColors.zeplin.slate, marginTop: AppSizes.padding, textAlign: 'center',}}>{'Searching for a connection to the FathomPRO network'}</Text>
                                                <Text robotoRegular style={{color: AppColors.zeplin.slate, marginTop: AppSizes.padding, textAlign: 'center',}}>{'If you have not yet gone to setting to connect to the FathomPRO wifi network...need to exit and try again'}</Text>
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
                                                    title={'Exit'}
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
                                <TopNav darkColor={true} onBack={null} showClose={false} step={1} />
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
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), textAlign: 'center',}}>
                                                {'We are checking for a strong wifi connection.\n\n'}
                                                <Text robotoBold>{'LED on your Fathom PRO Kit will turn green'}</Text>
                                                {' when connection is a success!'}
                                            </Text>
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), marginTop: AppSizes.padding, textAlign: 'center',}}>
                                                {'(This may take up to 2 minutes, keep Kit closed)'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{alignItems: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                                        <Button
                                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                            containerStyle={{alignItems: 'center', alignSelf: 'center', marginTop: AppSizes.paddingSml, justifyContent: 'center', width: '75%',}}
                                            disabled={!isConnectionBtnActive}
                                            disabledStyle={{backgroundColor: AppColors.zeplin.slateXLight,}}
                                            disabledTitleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                                            loading={isConnectionBtnLoading}
                                            loadingProps={{color: AppColors.white,}}
                                            loadingStyle={{alignItems: 'center', justifyContent: 'center', width: '100%',}}
                                            onPress={() => this._handleTestConnection()}
                                            raised={true}
                                            title={'Tap when LED turns green'}
                                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{flex: 1,}}>
                                <TopNav darkColor={true} onBack={null} showClose={false} step={1} />
                                <View style={{paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg,}}>
                                    <Text robotoMedium style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>
                                        {isConnectionSuccessful ? 'Success!' : 'Connection Failed'}
                                    </Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'space-between', paddingHorizontal: AppSizes.padding,}}>
                                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg, paddingVertical: (AppSizes.paddingXLrg + AppSizes.paddingMed),}}>
                                        <View style={{alignItems: 'center',}}>
                                            <LottieView
                                                loop={false}
                                                ref={animation => {this.lottieAnimation2 = animation;}}
                                                source={isConnectionSuccessful ?
                                                    require('../../../assets/animation/bluetoothloading.json')
                                                    :
                                                    require('../../../assets/animation/wifi-error.json')
                                                }
                                                style={{height: AppSizes.screen.widthHalf, width: AppSizes.screen.widthHalf,}}
                                            />
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginTop: AppSizes.paddingLrg, textAlign: 'center',}}>
                                                {'This may be due to a wrong password, or weak wifi strength because the kit is too far from the router. '}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{alignItems: 'center', paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.padding,}}>
                                        <Button
                                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                            containerStyle={{alignItems: 'center', alignSelf: 'center', marginTop: AppSizes.paddingSml, justifyContent: 'center', width: isConnectionSuccessful ? '45%' : '75%',}}
                                            onPress={() => isConnectionSuccessful ? Actions.pop() : this.setState( { ...this.defaultState, }, () => this._renderPreviousPage(4))}
                                            raised={true}
                                            title={isConnectionSuccessful ? 'Next' : 'Try Again'}
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
                                    nextBtn={() => Actions.pop()}
                                    page={2}
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
