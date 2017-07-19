/**
 * Kit Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    BackHandler
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';
import { Roles } from '@constants/';

// Components
import { Spacer, Text, ListItem } from '@ui/';
import { Placeholder } from '@general/';

const font18 = AppFonts.scaleFont(18);
const font10 = AppFonts.scaleFont(10);

/* Component ==================================================================== */
class KitManagementView extends Component {
    static componentName = 'KitManagementView';

    static propTypes = {
        user:           PropTypes.object,
        bluetooth:      PropTypes.object,
        resetAccessory: PropTypes.func.isRequired,
        scanWiFi:       PropTypes.func.isRequired
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
                onPress={() => Actions.kitOwner()}
            />
            <ListItem
                title={'WiFi'}
                chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                onPress={() => this.props.scanWiFi(this.props.bluetooth.accessoryData.id)}
            />
            <ListItem
                title={'Reset'}
                chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                onPress={() => this.props.resetAccessory(this.props.bluetooth.accessoryData.id)}
            />
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
