/**
 * Kit Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    Image,
    ScrollView,
    View,
    NativeAppEventEmitter,
    Platform,
    PermissionsAndroid,
    BackHandler
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NetworkInfo } from 'react-native-network-info';
import BleManager from 'react-native-ble-manager';
import Carousel from 'react-native-looped-carousel';
import Collapsible from 'react-native-collapsible';
import Prompt from 'react-native-prompt';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';
import { Roles, BLEConfig } from '@constants/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem } from '@ui/';
import { Placeholder } from '@general/';

const font18 = AppFonts.scaleFont(18);
const font10 = AppFonts.scaleFont(10);

/* Component ==================================================================== */
class KitManagementView extends Component {
    static componentName = 'KitManagementView';

    static propTypes = {
        user:        PropTypes.object,
        bluetooth:   PropTypes.object
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            SSID: null,
        };
    }

    componentWillMount = () => { BackHandler.addEventListener('backPress', () => Actions.pop()); };

    componentWillUnmount = () => { BackHandler.removeEventListener('backPress') };

    adminView = () => (
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => (
        <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]} >
            <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>SETTINGS</Text>
            <ListItem
                title={'Connect Kit'}
                onPress={() => Actions.bluetoothConnect()}
            />
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>Connect your Fathom Kit to WiFi</Text>
            <Spacer />
            <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>MANAGE KIT</Text>
            <ListItem
                title={'Owner'}
                chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                onPress={() => this.props.bluetooth.accessoryData.accessoryConnected ? Actions.kitOwner() : null}
            />
            <ListItem
                title={'WiFi'}
                chevronColor={ AppColors.lightGrey}
                titleStyle={{ color: AppColors.lightGrey}}
            />
            <ListItem
                title={'Reset'}
                chevronColor={ AppColors.lightGrey}
                titleStyle={{ color: AppColors.lightGrey}}
            />
            {/* <ListItem
                title={'WiFi'}
                chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
            />
            <ListItem
                title={'Reset'}
                chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
            /> */}
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>Assign owner to the kit, change wifi network, or factory reset</Text>
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
export default KitManagementView;
