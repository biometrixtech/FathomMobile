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
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NetworkInfo } from 'react-native-network-info';
import Carousel from 'react-native-looped-carousel';
import Collapsible from 'react-native-collapsible';
import Prompt from 'react-native-prompt';
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

/* Component ==================================================================== */
class BluetoothConnectView extends Component {
    static componentName = 'BluetoothConnectView';

    static propTypes = {
        user:               PropTypes.object,
        devicesFound:       PropTypes.array,
        scanning:           PropTypes.bool,
        connectToAccessory: PropTypes.func.isRequired,
        checkState:         PropTypes.func.isRequired,
        changeState:        PropTypes.func.isRequired,
        startBluetooth:     PropTypes.func.isRequired,
        enableBluetooth:    PropTypes.func.isRequired,
        startScan:          PropTypes.func.isRequired,
        stopScan:           PropTypes.func.isRequired,
        deviceFound:        PropTypes.func.isRequired,
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
                this.refs.animateToPage(1);
            });
    }

    handleScan = () => {
        return this.props.startScan();
    }

    toggleScanning = (bool) => {
        return bool ? this.props.startScan() : this.props.stopScan();
    }

    handleDiscoverPeripheral = (data) => {
        return data.name && /fathom/i.test(data.name) ? this.props.deviceFound(data) : null;
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

    setSSID = (ssid) => {
        let dataArray = new Array(20);
        dataArray[0] = parseInt('0x04', 16);
        dataArray[1] = ssid.length;
        for (let i = 2; i < 20 && i-2 < ssid.length; i+=1) {
            dataArray[i] = ssid.charCodeAt(i-2);
        }
        for (let i = ssid.length + 2; i < 20; i+=1) {
            dataArray[i] = parseInt('0x00', 16);
        }
        console.log('SSID Data Array: ', dataArray);
        return this.props.BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
            .then(() => {
                if (ssid.length <= 18) {
                    return null;
                }
                dataArray = new Array(20);
                dataArray[0] = parseInt('0x05', 16);
                dataArray[1] = ssid.length - 18;
                for (let i = 2; i - 2 < ssid.length - 18; i+=1) {
                    dataArray[i] = ssid.charCodeAt(i+16);
                }
                for (let i = ssid.length - 16; i < 20; i+=1) {
                    dataArray[i] = parseInt('0x00', 16);
                }
                console.log('SSID Data Array 2: ', dataArray);
                return this.props.BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray);
            });
    }

    setWiFiPassword = (passwordAttempt) => {
        let dataArray = new Array(20);
        dataArray[0] = parseInt('0x06', 16);
        dataArray[1] = passwordAttempt.length;
        for (let i = 2; i < 20 && i-2 < passwordAttempt.length; i+=1) {
            dataArray[i] = passwordAttempt.charCodeAt(i-2);
        }
        for (let i = passwordAttempt.length + 2; i < 20; i+=1) {
            dataArray[i] = parseInt('0x00', 16);
        }
        console.log('Password Data Array: ', dataArray);
        return this.props.BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
            .then(() => {
                if (passwordAttempt.length <= 18) {
                    return null;
                }
                dataArray = new Array(20);
                dataArray[0] = parseInt('0x07', 16);
                dataArray[1] = passwordAttempt.length - 18;
                for (let i = 2; i - 2 < passwordAttempt.length - 18; i+=1) {
                    dataArray[i] = passwordAttempt.charCodeAt(i+16);
                }
                for (let i = passwordAttempt.length - 16; i < 20; i+=1) {
                    dataArray[i] = parseInt('0x00', 16);
                }
                console.log('Password Data Array 2: ', dataArray);
                return this.props.BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray);
            });
    }

    setupWiFi = (ssid, password) => {
        return this.setSSID(ssid)
            .then(() => this.setWiFiPassword(password))
            .then(() => {
                let dataArray = new Array(20);
                dataArray[0] = parseInt('0x08', 16);
                dataArray[1] = parseInt('0x00', 16);
                for (let i = 2; i < 20; i+=1) {
                    dataArray[i] = parseInt('0x00', 16);
                }
                return this.props.BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
            })
            .then(() => setTimeout(() => this.props.upsertAccessory(this.state.data.id, {
                name:    this.state.data.name,
                team_id: this.props.user.teams[0].id,
            }), 3000))
            .catch(err => console.log(err));
    }

    connect = (data) => {
        return this.props.stopScan()
            .then(() => this.props.connectToAccessory(data, { role: this.props.user.role, id: this.props.user.id })
                .then(() => {
                    this.setState({ index: 3 });
                    return this.refs.carousel.animateToPage(3);
                })
                .catch((err) => {
                    console.log(err);
                    return err;
                }));
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
                    <View style={[AppStyles.containerCentered, { flex: 3 }]}>
                        <Button
                            title={this.props.scanning ? 'Stop Scan' : 'Start Scan'}
                            icon={{ name: `${this.props.scanning ? 'stop' : 'play-arrow'}` }}
                            buttonStyle={{ backgroundColor: `${this.props.scanning ? AppColors.brand.red : AppColors.brand.primary}` }}
                            onPress={() => this.toggleScanning(!this.props.scanning)}
                            raised
                        />
                        <Spacer size={5}/>
                        <Text style={{ color: AppColors.brand.yellow }} onPress={() => this.setState({ isCollapsed: !this.state.isCollapsed })}>{'Can\'t find your device?'}</Text>
                        <Spacer size={5}/>
                        <Text>{`Fathom pin: '${BLEConfig.pin}'`}</Text>
                        <Spacer size={5}/>
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
                                this.props.devicesFound.map(device => {
                                    return <ListItem key={device.id} title={device.name} onPress={() => this.connect(device)} titleContainerStyle={{ alignSelf: 'center' }} hideChevron/>
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
