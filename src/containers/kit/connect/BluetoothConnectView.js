/**
 * Bluetooth Connect Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    Image,
    ScrollView,
    View,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Icon } from 'react-native-elements'
import Carousel from 'react-native-looped-carousel';
import Collapsible from 'react-native-collapsible';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { Roles, BLEConfig } from '@constants/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem } from '@ui/';
import { Placeholder } from '@general/';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const accessoryDiscoverabilityInstruction = 'press & hold buttons simultaneously until the lights flash red and blue';
const successfullyConnected = ['Your kit is connected!', 'Return to main menu to assign this kit to an athlete and their specific team.'];

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    indicator: {
        position: 'absolute',
        left:     0,
        right:    0,
        bottom:   0,
        top:      0,
    }
});

/* Component ==================================================================== */
class BluetoothConnectView extends Component {
    static componentName = 'BluetoothConnectView';

    static propTypes = {
        user:               PropTypes.object,
        bluetooth:          PropTypes.object,
        connectToAccessory: PropTypes.func.isRequired,
        checkState:         PropTypes.func.isRequired,
        changeState:        PropTypes.func.isRequired,
        startBluetooth:     PropTypes.func.isRequired,
        enableBluetooth:    PropTypes.func.isRequired,
        startScan:          PropTypes.func.isRequired,
        stopScan:           PropTypes.func.isRequired,
        deviceFound:        PropTypes.func.isRequired,
        startConnect:       PropTypes.func.isRequired,
        stopConnect:        PropTypes.func.isRequired,
        setKitState:        PropTypes.func.isRequired,
        disconnect:         PropTypes.func.isRequired,
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            index:       0,
            isCollapsed: true,
            size:        {},
            data:        null,
        };

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.props.stopScan.bind(this);
        this.handleBleStateChange = this.handleBleStateChange.bind(this);
    }

    componentDidMount = () => {
        this.props.checkState();

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handlerState = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleBleStateChange );

        if (this.props.bluetooth.accessoryData.id) {
            return Promise.resolve(this.props.disconnect(this.props.bluetooth.accessoryData.id))
                .then(result => {
                    this.setState({ index: 0 });
                    this.refs.carousel.animateToPage(0);
                });
        }
        return null;
    }

    componentWillUnmount = () => {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerState.remove();
    }

    startBluetooth = () => {
        return this.props.startBluetooth()
            .then(() => {
                this.props.checkState();
                if (Platform.OS === 'android' && Platform.Version >= 23) {
                    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
                        .then(result => {
                            if (!result) {
                                return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
                                    .then(res => {
                                        if (res === 'denied') {
                                            throw new Error('Bluetooth inactive');
                                        }
                                        return null;
                                    });
                            }
                            return null;
                        })
                        .then(() => this.props.enableBluetooth())
                }
                return null;
            })
            .catch(error => {
                this.setState({ index: 1 });
                this.refs.carousel.animateToPage(1);
            });
    }

    handleScan = () => {
        return this.props.startScan();
    }

    toggleScanning = (bool) => {
        return bool ? this.props.startScan() : this.props.stopScan();
    }

    handleDiscoverPeripheral = (data) => {
        return data.name && /Fathom_kit_/i.test(data.name) ? this.props.deviceFound(data) : null;
    }

    handleBleStateChange = (data) => {
        if (data.state === 'off') {
            if (this.refs.carousel && this.refs.carousel.getCurrentPage() > 1) {
                this.setState({ index: 1 });
                this.refs.carousel.animateToPage(1);
            } else if (!this.refs.carousel) {
                return Promise.resolve(this.props.changeState(data.state))
                    .then(() => Actions.kitManagement());
            }
        } else if (this.refs.carousel && this.refs.carousel.getCurrentPage() === 1) {
            this.startBluetooth();
            this.setState({ index: 2 });
            this.refs.carousel.animateToPage(2);
        }
        return this.props.changeState(data.state);
    }

    connect = (data) => {
        return this.props.stopScan()
            .then(() => this.props.connectToAccessory(data))
            .then(() => {
                this.setState({ index: 3 });
                this.refs.carousel.animateToPage(3);
                return this.props.stopConnect();
            })
            .catch((err) => {
                console.log(err);
                return this.props.stopConnect();
            });
    }

    _onLayoutDidChange = (e) => {
        const layout = e.nativeEvent.layout;
        this.setState({ size: { width: layout.width, height: layout.height } });
    }

    adminView = () => (
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => (
        <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
            <View style={{ alignItems: 'center', backgroundColor: AppColors.brand.light }}>
                <Spacer size={25}/>
                <Text h1>
                    {
                        this.state.index === 0 ? 'Activate Kit' : this.state.index === 1 ? 'Turn on Bluetooth' : this.state.index === 2 ? 'Scan for Kit' : 'Connected'
                    }
                </Text>
                <Spacer size={50}/>
            </View>
            <Carousel
                ref={'carousel'}
                autoplay={false}
                currentPage={this.state.index}
                swipe={false}
                style={{
                    position:        'absolute',
                    elevation:       10,
                    bottom:          15,
                    backgroundColor: '#FFFFFF',
                    alignSelf:       'center',
                    shadowOffset:    { width: 1, height: 3 },
                    shadowOpacity:   0.7,
                    shadowRadius:    2,
                    width:           AppSizes.screen.widthEightTenths,
                    height:          AppSizes.screen.heightThreeQuarters
                }}
                bullets
                bulletStyle={{ borderColor: AppColors.brand.blue }}
                chosenBulletStyle={{ backgroundColor: AppColors.brand.blue }}
            >
                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <View style={{ flex: 1 }} />
                    <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                        <Image style={{resizeMode: 'contain', width: 400, height: 400}} source={require('@images/kit_activation.png')}/>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormLabel labelStyle={[AppStyles.h4]} >
                            { accessoryDiscoverabilityInstruction }
                        </FormLabel>
                        <Spacer />
                        <Button
                            title={'Next'}
                            onPress={() => {
                                this.setState({ index: 1 });
                                this.refs.carousel.animateToPage(1);
                                return this.props.checkState();
                            }}
                            raised
                        />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>


                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1 }} >
                        <Icon name="bluetooth" containerStyle={{ alignSelf: 'center' }} size={30} color={AppColors.brand.primary} reverse onPress={() => this.startBluetooth()} raised />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>


                <View style={{ flex: 1 }}>
                    { this.props.bluetooth.indicator ? 
                        <View style={[styles.indicator, { justifyContent: 'center', alignItems: 'center'}]}>
                            <ActivityIndicator
                                animating={true}
                                size={'large'}
                                color={'#C1C5C8'}
                            />
                        </View> : null
                    }
                    <View style={[AppStyles.containerCentered, { flex: 3 }]}>
                        <Button
                            title={this.props.bluetooth.scanning ? 'Stop Scan' : 'Start Scan'}
                            icon={{ name: `${this.props.bluetooth.scanning ? 'stop' : 'play-arrow'}` }}
                            buttonStyle={{ backgroundColor: `${this.props.bluetooth.scanning ? AppColors.brand.red : AppColors.brand.primary}` }}
                            onPress={() => this.toggleScanning(!this.props.bluetooth.scanning)}
                            raised
                        />
                        <Spacer size={5}/>
                        <Text style={{ color: AppColors.brand.yellow }} onPress={() => this.setState({ isCollapsed: !this.state.isCollapsed })}>{'Can\'t find your device?'}</Text>
                        <Spacer size={5}/>
                        <Text>{`Fathom pin: '${BLEConfig.pin}'`}</Text>
                        <Collapsible collapsed={this.state.isCollapsed} >
                            <FormLabel labelStyle={[AppStyles.h4]} >
                                { `${accessoryDiscoverabilityInstruction}. Then rescan.` }
                            </FormLabel>
                        </Collapsible>
                    </View>
                    <Spacer />
                    <View style={{ flex: 4 }}>
                        <ScrollView>
                            {
                                this.props.bluetooth.devicesFound.map(device => {
                                    return <ListItem
                                        key={device.id}
                                        title={device.name}
                                        onPress={() => this.props.startConnect(device).then(() => this.connect(device))}
                                        titleContainerStyle={{ alignSelf: 'center' }}
                                        hideChevron
                                    />
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1 }}/>
                </View>

                <View style={[AppStyles.containerCentered, { flex: 1 }]}>
                    <View style={{ flex: 1 }}/>
                    <View style={{ flex: 1 }}>
                        <Text h2>{successfullyConnected[0]}</Text>
                    </View>
                    <Icon containerStyle={{ flex: 1 }} name={'checkbox-marked-circle'} type={'material-community'} color={AppColors.brand.yellow} size={100}/>
                    <View style={[AppStyles.containerCentered, { flex: 1, paddingLeft: 25, paddingRight: 25 }]}>
                        <Text>{successfullyConnected[1]}</Text>
                    </View>
                    <View style={{ flex: 1 }}/>
                </View>
            </Carousel>
        </View>
    );

    managerView = () => (
        <Placeholder />
    );

    researcherView = () => (
        <Placeholder />
    );

    render = () => {
        switch(this.props.user.role) {
        case Roles.admin:
            return this.adminView();
        case Roles.athlete:
            return this.athleteView();
        case Roles.biometrixAdmin:
            return this.biometrixAdminView();
        case Roles.superAdmin:
            return this.biometrixAdminView();
        case Roles.manager:
            return this.biometrixAdminView();
        case Roles.researcher:
            return this.researcherView();
        default:
            return <Placeholder />;
        }
    }
}

/* Export Component ==================================================================== */
export default BluetoothConnectView;
