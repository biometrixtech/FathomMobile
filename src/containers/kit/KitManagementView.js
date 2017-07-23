/**
 * Kit Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    BackHandler
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Prompt from 'react-native-prompt';
import Modal from 'react-native-modalbox';

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
        user:             PropTypes.object,
        bluetooth:        PropTypes.object,
        resetAccessory:   PropTypes.func.isRequired,
        scanWiFi:         PropTypes.func.isRequired,
        loginToAccessory: PropTypes.func.isRequired,
        setWiFiSSID:      PropTypes.func.isRequired,
        setWiFiPassword:  PropTypes.func.isRequired,
        connectWiFi:      PropTypes.func.isRequired
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            modalStyle: {},
            SSID:       null
        };
    }

    componentWillMount = () => { BackHandler.addEventListener('backPress', () => Actions.pop()); };

    componentWillUnmount = () => { BackHandler.removeEventListener('backPress') };

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

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
                onPress={() => this.props.loginToAccessory(this.props.bluetooth.accessoryData, this.props.user).then(() => this.props.scanWiFi(this.props.bluetooth.accessoryData.id))}
            />
            <ListItem
                title={'Reset'}
                chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                onPress={() => this.props.resetAccessory(this.props.bluetooth.accessoryData.id)}
            />
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>Assign owner to the kit, change wifi network, or factory reset</Text>
            <Prompt
                title={`${this.state.SSID} Password (if needed):`}
                placeholder={'Password'}
                visible={this.state.promptVisible}
                onCancel={() => this.setState({
                    promptVisible: false
                })}
                onSubmit={value => this.props.setWiFiSSID(this.props.bluetooth.accessoryData.id, this.state.SSID).then(() => this.props.setWiFiPassword(this.props.bluetooth.accessoryData.id, value)).then(() => this.props.connectWiFi(this.props.bluetooth.accessoryData.id)).then(() => this.setState({ promptVisible: false }))}
            />
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.state.isModalVisible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ trainingGroup: { name: '', user_ids: [] }, isModalVisible: false })}
            >
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
                    <Card title={'Connect to WiFi'}>
                        <Spacer size={5} />
                        <ScrollView style={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border, height: AppSizes.screen.heightTwoThirds }}>
                            {
                                this.props.bluetooth.nertworks.map(network => (
                                    <ListItem
                                        key={network.index}
                                        title={network.label}
                                        onPress={() => this.setState({ promptVisible: true })}
                                    />
                                ))
                            }
                        </ScrollView>
                    </Card>
                </View>
            </Modal>
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
