/**
 * SensorFiles View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Alert, BackHandler, Image, Platform, ScrollView, StatusBar, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { ListItem, Spacer, TabIcon, Text, Tooltip, } from '../custom';
import { AppUtil, SensorLogic, } from '../../lib';
import { Loading, } from '../general';
// import SensorBackUpTutorial from './SensorBackUpTutorial';

const ICON_SIZE = 24;

/* Component ==================================================================== */
const TopNavBar = () => (
    <View>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{backgroundColor: AppColors.white, flexDirection: 'row', marginHorizontal: AppSizes.padding, marginTop: AppSizes.statusBarHeight, paddingBottom: AppSizes.paddingXSml, paddingTop: AppSizes.paddingSml,}}>
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

class SensorFiles extends Component {
    static componentName = 'SensorFiles';

    static propTypes = {
        assignKitIndividual: PropTypes.func.isRequired,
        getSensorFiles:      PropTypes.func.isRequired,
        updateUser:          PropTypes.func.isRequired,
        user:                PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        const { user, } = this.props;
        this.state = {
            isTooltipOpen: false,
            // isTutorialModalOpen: !user.first_time_experience.includes('3Sensor-Onboarding-Tutorial-User-Complete'),
            loading:       false,
        };
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
    }

    _handleBackUpTutorialOnClose = () => {
        const { getSensorFiles, updateUser, user, } = this.props;
        // update state to close modal
        // setup variables
        let newUserPayloadObj = {};
        newUserPayloadObj.first_time_experience = ['3Sensor-Onboarding-Tutorial-User-Complete'];
        // update user object
        updateUser(newUserPayloadObj, user.id)
            .then(res => getSensorFiles(res.user))
            .then(res => this.setState({ isTutorialModalOpen: false, }))
            .catch(err => this.setState({ isTutorialModalOpen: false, }));
    }

    _handleRemoveAccount = () => {
        const { assignKitIndividual, updateUser, user, } = this.props;
        // NOTE: THIS LOGIC HERE DOESN'T SEEM TO WORK
        let newUserPayloadObj = {};
        newUserPayloadObj['¬sensor_data'] = {};
        newUserPayloadObj['¬sensor_data'].sensor_pid = null;
        newUserPayloadObj['¬sensor_data'].mobile_udid = null;
        this.setState(
            { loading: true, },
            () => assignKitIndividual({wifiMacAddress: user.sensor_data.sensor_pid,}, {})
                .then(() => updateUser(newUserPayloadObj, user.id, false, false))
                .then(() => this.setState(
                    { loading: false, },
                    () => _.delay(() => Actions.pop(), 250),
                ))
                .catch(err => this.setState(
                    { loading: false, },
                    () => _.delay(() => this._handleRemoveAccountError(), 250),
                )),
        );
    }

    _handleRemoveAccountError = () => Alert.alert(
        '',
        'We\'re unable to remove Fathom PRO from your account.',
        [
            {
                text:  'Cancel',
                style: 'cancel',
            },
            {
                text:    'Try Again',
                onPress: () => this._handleRemoveAccount(),
            },
        ],
        { cancelable: false, }
    )

    _handleWifiClicked = sensorNetwork => {
        Alert.alert(
            '',
            sensorNetwork ?
                `"${sensorNetwork}"\nis currently your preferred wifi.\n\nTo change your preferred network, you must be in range of the new network.`
                :
                'To setup your preferred network, you must be in range of the new network.',
            [
                {
                    text:  'Cancel',
                    style: 'cancel',
                },
                {
                    text:    'Continue',
                    onPress: () => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'connect', }),
                },
            ],
            { cancelable: false, }
        );
    }

    _handleWifiDisabledClicked = () => {
        Alert.alert(
            '',
            'Hmm...we\'re having trouble changing your preferred wifi network. Please try to update your app or contact support at support@fathomai.com for assistance.',
            [
                {
                    text:  'OK',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
        );
    }

    render = () => {
        const { user, } = this.props;
        const { isTooltipOpen, isTutorialModalOpen, loading, } = this.state;
        let sensorData = user.sensor_data;
        const {
            batteryIconProps,
            batteryTextProps,
            batteryTextString,
            lastSyncString,
            sensorNetwork,
        } = SensorLogic.handleSensorFileRenderLogic(sensorData);
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                contentContainerStyle={{backgroundColor: AppColors.white, flexGrow: 1, flexDirection: 'column', justifyContent: 'space-between',}}
                style={{backgroundColor: AppColors.white,}}
            >
                <View>
                    <TopNavBar />
                    <Text robotoRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{`${user.personal_data.first_name}\'s Fathom PRO Kit`}</Text>
                    <View style={{flexDirection: 'row', paddingVertical: (AppSizes.paddingLrg + AppSizes.paddingXSml),}}>
                        <View style={{flex: 1,}} />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'battery', })}
                            style={{alignItems: 'center', flex: 4, justifyContent: 'center',}}
                        >
                            <View style={{flexDirection: 'row',}}>
                                <View>
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>{`Last sync: ${lastSyncString}`}</Text>
                                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.paddingSml,}}>
                                        <TabIcon {...batteryIconProps} />
                                        <Text robotoRegular style={{...batteryTextProps}}>{batteryTextString}</Text>
                                    </View>
                                </View>
                                <TabIcon
                                    color={AppColors.zeplin.slateLight}
                                    containerStyle={[{alignItems: 'center', justifyContent: 'center',}]}
                                    icon={'chevron-right'}
                                    size={ICON_SIZE}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => sensorData && sensorData.accessory && sensorData.accessory.firmware_up_to_date ? null : this.setState({ isTooltipOpen: true, })}
                            style={{alignItems: 'center', flex: 4, justifyContent: 'center',}}
                        >
                            <Tooltip
                                animated
                                content={
                                    <View style={{padding: AppSizes.paddingMed,}}>
                                        <Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), marginBottom: AppSizes.paddingMed,}}>{'Your firmware needs an update!'}</Text>
                                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13), lineHeight: AppFonts.scaleFont(18),}}>{'To update, plug your Kit in to charge overnight and make sure it\'s connected to wifi. The newest update will auto-install.'}</Text>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ isTooltipOpen: false, })}
                                            style={{alignSelf: 'flex-end',}}
                                        >
                                            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18),}}>{'GOT IT'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                isVisible={isTooltipOpen}
                                onClose={() => {}}
                                tooltipStyle={{left: 30, width: (AppSizes.screen.width - 60),}}
                            >
                                <View style={{backgroundColor: AppColors.white, borderRadius: 6, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingXSml,}}>
                                    <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>{'Firmware version'}</Text>
                                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.paddingSml,}}>
                                        <Image
                                            resizeMode={'contain'}
                                            source={require('../../../assets/images/sensor/sensor_slate.png')}
                                            style={{height: 20, marginRight: AppSizes.paddingXSml, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, width: 20,}}
                                        />
                                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(20), marginRight: AppSizes.paddingSml,}}>{sensorData && sensorData.accessory && sensorData.accessory.firmware_version ? sensorData.accessory.firmware_version : ''}</Text>
                                        { sensorData && sensorData.accessory && sensorData.accessory.firmware_up_to_date ?
                                            <TabIcon
                                                color={AppColors.zeplin.success}
                                                icon={'check'}
                                                size={20}
                                            />
                                            :
                                            <TabIcon
                                                color={AppColors.zeplin.error}
                                                icon={'alert-circle'}
                                                size={20}
                                                type={'material-community'}
                                            />
                                        }
                                    </View>
                                </View>
                            </Tooltip>
                        </TouchableOpacity>
                        <View style={{flex: 1,}} />
                    </View>
                    <View style={{backgroundColor: AppColors.zeplin.superLight, paddingLeft: AppSizes.padding, paddingVertical: AppSizes.paddingSml,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>{'System'}</Text>
                    </View>
                    <ListItem
                        containerStyle={{paddingVertical: AppSizes.padding,}}
                        leftIcon={{
                            color:     AppColors.zeplin.splash,
                            iconStyle: { paddingLeft: AppSizes.padding, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                            name:      'wifi',
                            size:      ICON_SIZE,
                        }}
                        onPress={() => this._handleWifiClicked(sensorNetwork)}
                        rightIcon={{
                            color: AppColors.zeplin.slateLight,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={`Wifi: ${sensorData.sensor_networks && sensorData.sensor_networks[0] ? sensorData.sensor_networks[0] : 'No network defined'}`}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                    />
                    <Spacer isDivider />
                    <ListItem
                        containerStyle={{paddingVertical: AppSizes.padding,}}
                        leftIcon={{
                            color:     AppColors.zeplin.splash,
                            iconStyle: { paddingLeft: AppSizes.padding, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                            name:      'directions-run',
                            size:      ICON_SIZE,
                        }}
                        onPress={() => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'sessions', })}
                        rightIcon={{
                            color: AppColors.zeplin.slateLight,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'Recorded workouts'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                    />
                    {/*<Spacer isDivider />
                    <ListItem
                        containerStyle={{paddingVertical: AppSizes.padding,}}
                        leftIcon={{
                            color:     AppColors.zeplin.splash,
                            iconStyle: { paddingLeft: AppSizes.padding, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                            name:      'account-remove',
                            size:      ICON_SIZE,
                            type:      'material-community',
                        }}
                        onPress={() => Alert.alert(
                            'Are you sure you want to remove the Fathom PRO Kit from your account?',
                            'Before capturing another Workout, you will need to associate a Fathom PRO Kit with your account.',
                            [
                                {
                                    text:  'Cancel',
                                    style: 'cancel',
                                },
                                {
                                    text:    'Remove',
                                    onPress: () => this._handleRemoveAccount(),
                                },
                            ],
                            { cancelable: false, }
                        )}
                        rightIcon={{
                            color: AppColors.zeplin.slateLight,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'Remove Fathom PRO'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                    />*/}
                    <View style={{backgroundColor: AppColors.zeplin.superLight, paddingLeft: AppSizes.padding, paddingVertical: AppSizes.paddingSml,}}>
                        <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>{'Tutorial'}</Text>
                    </View>
                    <ListItem
                        containerStyle={{paddingVertical: AppSizes.padding,}}
                        leftIcon={{
                            color:     AppColors.zeplin.splash,
                            iconStyle: { paddingLeft: AppSizes.padding, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                            name:      'md-body',
                            size:      ICON_SIZE,
                            type:      'ionicon',
                        }}
                        onPress={() => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'placement', })}
                        rightIcon={{
                            color: AppColors.zeplin.slateLight,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'Wear Sensors'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.padding,}}
                    />
                    <Spacer isDivider />
                    <ListItem
                        containerStyle={{paddingVertical: AppSizes.padding,}}
                        leftIcon={{
                            color:     AppColors.zeplin.splash,
                            iconStyle: { paddingLeft: AppSizes.padding, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                            name:      'compare-arrows',
                            size:      ICON_SIZE,
                        }}
                        onPress={() => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'calibrate', })}
                        rightIcon={{
                            color: AppColors.zeplin.slateLight,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'Calibrate & start workout'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.robotoRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                    />
                    <Spacer isDivider />
                </View>
                <Text
                    robotoLight
                    style={{
                        color:         AppColors.zeplin.slate,
                        fontSize:      AppFonts.scaleFont(11),
                        paddingBottom: AppSizes.isIphoneX ? (AppSizes.iphoneXBottomBarPadding + AppSizes.paddingSml) : AppSizes.paddingMed,
                        paddingTop:    AppSizes.paddingMed,
                        textAlign:     'center',
                    }}
                >
                    {`Hardware ID: ${sensorData.sensor_pid}`}
                </Text>
                {/*<SensorBackUpTutorial
                    handleOnClose={this._handleBackUpTutorialOnClose}
                    isVisible={isTutorialModalOpen}
                />*/}

                { loading ?
                    <Loading
                        text={'Removing account...'}
                    />
                    :
                    null
                }
            </ScrollView>
        );
    }
}

/* Export Component ==================================================================== */
export default SensorFiles;
