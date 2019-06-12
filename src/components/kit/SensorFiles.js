/**
 * SensorFiles View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, Image, Platform, StatusBar, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { ListItem, Spacer, TabIcon, Text, Tooltip, } from '../custom';
import { AppUtil, SensorLogic, } from '../../lib';

const ICON_SIZE = 24;

/* Component ==================================================================== */
const TopNavBar = () => (
    <View>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{backgroundColor: AppColors.white, flexDirection: 'row', marginHorizontal: AppSizes.padding, marginTop: AppSizes.statusBarHeight, paddingVertical: AppSizes.paddingSml,}}>
            <View style={{flex: 1, justifyContent: 'center',}}>
                <TabIcon
                    color={AppColors.zeplin.slate}
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
        user: PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            isTooltipOpen: false,
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

    render = () => {
        const { user, } = this.props;
        const { isTooltipOpen, } = this.state;
        let sensorData = user.sensor_data;
        const {
            batteryIconProps,
            batteryTextProps,
            batteryTextString,
            lastSyncString,
        } = SensorLogic.handleSensorFileRenderLogic(sensorData);
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
                <View>
                    <TopNavBar />
                    <Text oswaldRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{`${_.toUpper(user.personal_data.first_name)}\'S PRO KIT`}</Text>
                    <View style={{flexDirection: 'row', paddingVertical: AppSizes.padding,}}>
                        <View style={{flex: 1,}} />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => Actions.sensorFilesPage({ pageStep: 'battery', })}
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
                                    color={AppColors.zeplin.slate}
                                    containerStyle={[{alignItems: 'center', justifyContent: 'center',}]}
                                    icon={'chevron-right'}
                                    size={ICON_SIZE}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => sensorData.accessory.firmware_up_to_date ? null : this.setState({ isTooltipOpen: true, })}
                            style={{alignItems: 'center', flex: 4, justifyContent: 'center',}}
                        >
                            <Tooltip
                                animated
                                content={
                                    <View style={{padding: AppSizes.paddingMed,}}>
                                        <Text robotoBold style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), marginBottom: AppSizes.paddingMed,}}>{'Your firmware needs an update!'}</Text>
                                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>{'To update, make sure your kit is connected to wifi and charging overnight. The newest update will auto-install.'}</Text>
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
                                        <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(20), marginRight: AppSizes.paddingSml,}}>{sensorData.accessory.firmware_version}</Text>
                                        { sensorData.accessory.firmware_up_to_date ?
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
                        onPress={() => console.log('HI')}
                        rightIcon={{
                            color: AppColors.zeplin.slate,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={`WIFI: ${sensorData.sensor_networks[0]}`}
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
                        onPress={() => Actions.sensorFilesPage({ pageStep: 'sessions', })}
                        rightIcon={{
                            color: AppColors.zeplin.slate,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'SENSOR SESSIONS'}
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
                        onPress={() => Actions.sensorFilesPage({ pageStep: 'placement', })}
                        rightIcon={{
                            color: AppColors.zeplin.slate,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'PLACE SENSORS'}
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
                        onPress={() => Actions.sensorFilesPage({ pageStep: 'calibrate', })}
                        rightIcon={{
                            color: AppColors.zeplin.slate,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'CALIBRATE SENSORS'}
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
                        onPress={() => Actions.sensorFilesPage({ pageStep: 'end', })}
                        rightIcon={{
                            color: AppColors.zeplin.slate,
                            name:  'chevron-right',
                            size:  ICON_SIZE,
                        }}
                        title={'END TRAINING'}
                        titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                        titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                    />
                    <Spacer isDivider />
                </View>
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(11), paddingVertical: AppSizes.paddingMed, textAlign: 'center',}}>{`Hardware ID: ${sensorData.sensor_pid}`}</Text>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SensorFiles;
