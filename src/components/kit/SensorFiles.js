/**
 * SensorFiles View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Alert, BackHandler, Image, Platform, StatusBar, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { FathomModal, ListItem, Spacer, TabIcon, Text, Tooltip, } from '../custom';
import { AppUtil, SensorLogic, } from '../../lib';
import SensorBackUpTutorial from './SensorBackUpTutorial';

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
        getSensorFiles: PropTypes.func.isRequired,
        updateUser:     PropTypes.func.isRequired,
        user:           PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        const { user, } = this.props;
        this.state = {
            isTooltipOpen:       false,
            isTutorialModalOpen: !user.first_time_experience.includes('3Sensor-Onboarding-Tutorial-User-Complete'),
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

    _handleWifiClicked = sensorNetwork => {
        Alert.alert(
            '',
            `"${sensorNetwork}"\nis currently your preferred wifi.\n\nTo change your preferred network, you must be in range of the new network.`,
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

    render = () => {
        const { user, } = this.props;
        const { isTooltipOpen, isTutorialModalOpen, } = this.state;
        let sensorData = user.sensor_data;
        const {
            batteryIconProps,
            batteryTextProps,
            batteryTextString,
            lastSyncString,
            sensorNetwork,
        } = SensorLogic.handleSensorFileRenderLogic(sensorData);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
                <View>
                    <TopNavBar />
                    <Text oswaldRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{`${_.toUpper(user.personal_data.first_name)}\'S FATHOM PRO KIT`}</Text>
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
                                        <Text oswaldRegular style={{...batteryTextProps}}>{batteryTextString}</Text>
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
                                        <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(20), marginRight: AppSizes.paddingSml,}}>{sensorData && sensorData.accessory && sensorData.accessory.firmware_version ? sensorData.accessory.firmware_version : ''}</Text>
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
                        title={`WIFI: ${sensorData.sensor_networks[0] || 'NO NETWORK DEFINED'}`}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
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
                        title={'RECORDED WORKOUTS'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                    />
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
                        title={'WEAR SENSORS'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
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
                        title={'CALIBRATE & START WORKOUT'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                    />
                    <Spacer isDivider />
                    <ListItem
                        containerStyle={{paddingVertical: AppSizes.padding,}}
                        leftIcon={{
                            color:     AppColors.zeplin.splash,
                            iconStyle: { paddingLeft: AppSizes.padding, shadowColor: AppColors.zeplin.slateLight, shadowOffset: { height: 1, width: 0, }, shadowOpacity: 1, shadowRadius: 1, },
                            name:      'cloud-upload',
                            size:      ICON_SIZE,
                        }}
                        onPress={() => AppUtil.pushToScene('sensorFilesPage', { pageStep: 'end', })}
                        rightIcon={{
                            color: AppColors.zeplin.slateLight,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'END WORKOUT'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
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
                <SensorBackUpTutorial
                    handleOnClose={this._handleBackUpTutorialOnClose}
                    isVisible={isTutorialModalOpen}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SensorFiles;
