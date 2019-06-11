/**
 * SensorFiles View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, Platform, StatusBar, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
// import { Actions as DispatchActions, UserAccount, } from '../../constants';
// import { bleUtils, } from '../../constants/utils';
import { ListItem, Spacer, TabIcon, Text, } from '../custom';
import { AppUtil, } from '../../lib';

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
        let sensorData = user.sensor_data;
        let lastSyncDate = moment(sensorData.accessory.last_sync_date).format('YYYY-DD-MM');
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1}}>
                <TopNavBar />
                <Text oswaldRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{`${_.toUpper(user.personal_data.first_name)}\'S PRO KIT`}</Text>
                <View style={{flexDirection: 'row', paddingVertical: AppSizes.padding,}}>
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>{`Last sync: ${lastSyncDate}`}</Text>
                    </View>
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(13),}}>{'Firmware version'}</Text>
                    </View>
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
                    onPress={() => console.log('HI')}
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
                    onPress={() => console.log('HI')}
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
                    onPress={() => console.log('HI')}
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
                    onPress={() => console.log('HI')}
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
                <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(11), paddingVertical: AppSizes.paddingMed, textAlign: 'center',}}>{`Hardware ID: ${sensorData.sensor_pid}`}</Text>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SensorFiles;
