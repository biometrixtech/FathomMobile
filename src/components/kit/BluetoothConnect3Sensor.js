/**
 * BluetoothConnect3Sensor
 *
    <BluetoothConnect3Sensor
        bluetooth={bluetooth}
        connectToAccessory={connectToAccessory}
        deviceFound={deviceFound}
        network={network}
        startConnect={startConnect}
        startScan={startScan}
        stopConnect={stopConnect}
        stopScan={stopScan}
        user={user}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { Alert, NativeEventEmitter, NativeModules, Platform, PermissionsAndroid, StyleSheet, View, } from 'react-native';
// import { Image, Keyboard, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
// import { AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { AppColors, AppFonts, AppSizes, } from '../../constants';
// import { FormInput, TabIcon, Text, } from '../../custom';
import { Button, ListItem, Spacer, ProgressBar, Text, } from '../custom';
// import { PlanLogic, } from '../../../lib';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';
import BleManager from 'react-native-ble-manager';
import Toast, { DURATION } from 'react-native-easy-toast';

// setup consts
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

/* Styles ==================================================================== */
const styles = StyleSheet.create({});

/* Component ==================================================================== */
const TopNav = ({ currentStep, title, totalSteps, }) => (
    <View style={{backgroundColor: AppColors.transparent,}}>
        <View style={{alignItems: 'center', flexDirection: 'row', height: AppSizes.navbarHeight, justifyContent: 'center', marginTop: AppSizes.statusBarHeight,}}>
            <View style={{flex: 1,}}>
                {/*<TabIcon
                    containerStyle={[{flex: 1,}]}
                    color={AppColors.zeplin.lightSlate}
                    icon={workout.deleted ? 'add' : 'close'}
                    onPress={() => handleHealthDataFormChange(!workout.deleted)}
                    reverse={false}
                    size={30}
                    type={'material'}
                />*/}
            </View>
            <View style={{flex: 8,}}>
                <Text oswaldMedium style={{color: AppColors.black, fontSize: AppFonts.scaleFont(20), textAlign: 'center',}}>{title}</Text>
            </View>
            <View style={{flex: 1,}} />
        </View>
        <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
        />
    </View>
);

class BluetoothConnect3Sensor extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSavedNetworksTab: true,
            isScrollEnabled:    true,
            pageIndex:          5,//0, // TODO: FIX ME
        };
        this._pages = {};
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
    }

    componentDidMount = () => {
        BleManager.start({ showAlert: false, });
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        // this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        // this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(result => {
                if (result) {
                    console.log('Permission is OK');
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then(res => {
                        if(res) {
                            console.log('User accept');
                        } else {
                            console.log('User refuse');
                        }
                    });
                }
            });
        }
    }

    componentWillUnmount = () => {
        this.handlerDiscover.remove();
        this.handleStopScan.remove();
        this.pages = null;
    }

    _onPageScrollEnd = currentPage => {
        console.log('currentPage',currentPage);
        if(currentPage === 2) {
            this._handleBLEPair();
        }
    }

    _handleBLEPair = () => {
        const { startScan, } = this.props;
        console.log('starting scan');
        this.setState(
            { isScrollEnabled: false, },
            () => startScan(10),
        )
    }

    handleDiscoverPeripheral = data => {
        const { deviceFound, } = this.props;
        if (data.advertising && data.advertising.kCBAdvDataLocalName) {
            data.name = data.advertising.kCBAdvDataLocalName;
        }
        return data.name && data.name === 'fathomKit' ? deviceFound(data) : null; // 3-sensor solution
        // return data.name && /fathomS[*]_/i.test(data.name) ? deviceFound(data) : null; // 1-sensor solution
    }

    handleStopScan = () => {
        const { bluetooth, stopScan, } = this.props;
        return stopScan()
            .then(() => {
                let closestDevice = _.orderBy(bluetooth.devicesFound, ['rssi'], ['desc']);
                if(closestDevice.length > 0) {
                    console.log(closestDevice[0]);
                    this._connect(closestDevice[0]);
                }
            });
    }

    _connect = data => {
        const { bluetooth, connectToAccessory, startConnect, stopConnect, stopScan, user, } = this.props;
        stopScan()
            .then(() => startConnect(data))
            .then(() => connectToAccessory(data))
            .catch(err => connectToAccessory(data))
            .catch(err => stopConnect())
            .then(() => {
                this._toggleAlertNotification(data.id, user.id);
            })
            .catch(err => {
                console.log('err in BluetoothConnect #4',err);
                if (bluetooth.accessoryData && !bluetooth.accessoryData.sensor_pid) {
                    this.refs.toast.show('Failed to PAIR to sensor', (DURATION.LENGTH_SHORT * 2));
                }
                return stopConnect();
            });
    }

    _toggleAlertNotification = (sensorId, userId) => {
        const { stopConnect, } = this.props;
        Alert.alert(
            '',
            'Did the LED turn green?',
            [
                {
                    text:    'No',
                    onPress: () => {
                        this.setState({ pageIndex: 0 });
                        this._pages.progress = 0;
                        return stopConnect();
                    },
                    style: 'cancel',
                },
                {
                    text:    'Yes',
                    onPress: () => {
                        this._renderNextPage();
                    },
                },
            ],
            { cancelable: false }
        );
    }

    _renderNextPage = () => {
        let nextPageIndex = (this.state.pageIndex + 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    render = () => {
        const { bluetooth, } = this.props;
        const { isSavedNetworksTab, isScrollEnabled, pageIndex, } = this.state;
        console.log(bluetooth.devicesFound);
        return(
            <View style={{flex: 1,}}>

                <Pages
                    containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                    indicatorPosition={'none'}
                    onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)}
                    ref={pages => { this._pages = pages; }}
                    scrollEnabled={isScrollEnabled}
                    startPage={pageIndex}
                >

                    <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.seaBlue, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Now Let\'s Pair Your Power Case!'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => this._renderNextPage()}
                            title={'Next'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                    <View style={{flex: 1,}}>
                        <TopNav
                            currentStep={1}
                            title={'PAIR YOU SENSORS'}
                            totalSteps={5}
                        />
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(30), textAlign: 'center',}}>{'Hold The Button Until The LED Turns Blue'}</Text>
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(16), textAlign: 'center',}}>
                            {'Note: Once connected, your sensors will only sync with '}
                            <Text robotoRegular style={{fontStyle: 'italic',}}>{'this user account.'}</Text>
                        </Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => this._renderNextPage()}
                            title={'Next'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                    <View style={{flex: 1,}}>
                        <TopNav
                            currentStep={2}
                            title={'PAIR YOU SENSORS'}
                            totalSteps={5}
                        />
                        <Text robotoRegular style={{color: AppColors.zeplin.mediumGrey, fontSize: AppFonts.scaleFont(30), textAlign: 'center',}}>{'Touch Your Phone To The Base to Pair'}</Text>
                        { bluetooth.devicesFound && bluetooth.devicesFound.length > 0 &&
                            _.map(bluetooth.devicesFound, (data, i) =>
                                <Text key={i} onPress={() => this._connect(data.id)}>{`${data.name} ${data.id} ${data.rssi}`}</Text>
                            )
                        }
                    </View>

                    <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.seaBlue, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Pairing successful!'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => this._renderNextPage()}
                            title={'Next'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                    <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.seaBlue, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'Now let\'s connect wifi.'}</Text>
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), textAlign: 'center',}}>{'Your sensors will need wifi to upload data after training. On the next screen add your home network and any wifi networks you typically use right after training.'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => this._renderNextPage()}
                            title={'Next'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                    <View style={{flex: 1,}}>
                        <TopNav
                            currentStep={3}
                            title={'CONFIGURE WIFI'}
                            totalSteps={5}
                        />
                        <Text robotoBold style={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20), padding: AppSizes.paddingLrg, textAlign: 'center',}}>{'Select up to 5 networks you commonly use after training.'}</Text>
                        <View style={{flexDirection: 'row', paddingBottom: AppSizes.paddingSml,}}>
                            <Text
                                onPress={() => this.setState({ isSavedNetworksTab: true, })}
                                robotoBold
                                style={{color: AppColors.zeplin.darkGrey, flex: 1, fontSize: AppFonts.scaleFont(16), opacity: isSavedNetworksTab ? 1 : 0.5, textAlign: 'center', textDecorationLine: 'none',}}
                            >
                                {'Saved Networks'}
                            </Text>
                            <Text
                                onPress={() => this.setState({ isSavedNetworksTab: false, })}
                                robotoBold
                                style={{color: AppColors.zeplin.darkGrey, flex: 1, fontSize: AppFonts.scaleFont(16), opacity: isSavedNetworksTab ? 0.5 : 1, textAlign: 'center', textDecorationLine: 'none',}}
                            >
                                {'Networks In Range'}
                            </Text>
                        </View>
                        <Spacer isDivider />
                        <View style={{}}>
                            { isSavedNetworksTab ?
                                <View>
                                    <ListItem
                                        containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                                        onPress={() => console.log('A')}
                                        title={'testA'}
                                        titleStyle={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                                    />
                                    <Spacer isDivider />
                                </View>
                                :
                                <View>
                                    <ListItem
                                        containerStyle={{paddingBottom: AppSizes.padding, paddingTop: AppSizes.padding,}}
                                        onPress={() => console.log('B')}
                                        title={'testB'}
                                        titleStyle={{color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(15), paddingLeft: AppSizes.paddingSml,}}
                                    />
                                    <Spacer isDivider />
                                </View>
                            }
                        </View>
                    </View>

                    <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.seaBlue, flex: 1, justifyContent: 'center', paddingHorizontal: AppSizes.paddingLrg,}}>
                        <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'You\'re now ready to use the system!'}</Text>
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding, width: '100%',}}
                            containerStyle={{alignItems: 'center', justifyContent: 'center', width: AppSizes.screen.widthHalf,}}
                            onPress={() => Actions.settings()}
                            title={'Done'}
                            titleStyle={{color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    </View>

                </Pages>

            </View>
        )
    }
}

BluetoothConnect3Sensor.propTypes = {
    bluetooth:          PropTypes.object.isRequired,
    connectToAccessory: PropTypes.func.isRequired,
    deviceFound:        PropTypes.func.isRequired,
    network:            PropTypes.object.isRequired,
    startConnect:       PropTypes.func.isRequired,
    startScan:          PropTypes.func.isRequired,
    stopConnect:        PropTypes.func.isRequired,
    stopScan:           PropTypes.func.isRequired,
    user:               PropTypes.object.isRequired,
};

BluetoothConnect3Sensor.defaultProps = {};

BluetoothConnect3Sensor.componentName = 'BluetoothConnect3Sensor';

/* Export Component ================================================================== */
export default BluetoothConnect3Sensor;