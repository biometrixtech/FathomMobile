/**
 * Kit Owner Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    Image,
    ScrollView,
    View,
    RefreshControl
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';
import { Roles } from '@constants/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem, Card, FormInput } from '@ui/';
import { Placeholder } from '@general/';

const font10 = AppFonts.scaleFont(10);
const font18 = AppFonts.scaleFont(18);

/* Component ==================================================================== */
class KitOwnerView extends Component {
    static componentName = 'KitOwnerView';

    static propTypes = {
        user:                 PropTypes.object,
        bluetooth:            PropTypes.object,
        assignType:           PropTypes.func.isRequired,
        getOwnerOrganization: PropTypes.func.isRequired,
        getOwnerTeam:         PropTypes.func.isRequired,
        getOwnerUser:         PropTypes.func.isRequired,
        getKitName:           PropTypes.func.isRequired,
        assignKitName:        PropTypes.func.isRequired,
        storeParams:          PropTypes.func.isRequired,
        loginToAccessory:     PropTypes.func.isRequired,
        setKitTime:           PropTypes.func.isRequired,
    }

    static defaultProps = {
        user:           {},
        isModalVisible: false,
    }

    constructor(props) {
        super(props);

        this.state = {
            modalStyle: {},
            refreshing: false,
            name:       '',
        };
    }

    componentWillMount = () => {
        return this.props.getKitName(this.props.bluetooth.accessoryData.id)
            .catch(e => console.log(e))
            .then(() => this.props.getOwnerOrganization(this.props.bluetooth.accessoryData.id, this.props.user))
            .catch(e => console.log(e))
            .then(() => this.props.getOwnerTeam(this.props.bluetooth.accessoryData.id, this.props.user))
            .catch(e => console.log(e))
            .then(() => this.props.getOwnerUser(this.props.bluetooth.accessoryData.id, this.props.user))
            .catch(e => console.log(e));
    };

    _onRefresh() {
        this.setState({refreshing: true});
        return this.props.getKitName(this.props.bluetooth.accessoryData.id)
            .catch(e => console.log(e))
            .then(() => this.props.getOwnerOrganization(this.props.bluetooth.accessoryData.id, this.props.user))
            .catch(e => console.log(e))
            .then(() => this.props.getOwnerTeam(this.props.bluetooth.accessoryData.id, this.props.user))
            .catch(e => console.log(e))
            .then(() => this.props.getOwnerUser(this.props.bluetooth.accessoryData.id, this.props.user))
            .catch(e => console.log(e))
            .then(() => {
                this.setState({refreshing: false});
            });
    }

    componentWillUnmount = () => {
        return this.props.bluetooth.accessoryData.id ? this.props.storeParams(this.props.bluetooth.accessoryData)
            .then(() => this.props.loginToAccessory(this.props.bluetooth.accessoryData, this.props.user))
            .then(() => this.props.setKitTime(this.props.bluetooth.accessoryData.id)) : null;
    };

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
        <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
            >
                <View style={{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', height: AppSizes.screen.heightOneThird }}>
                    <Image source={require('@images/kit-diagram.png')} resizeMode={'contain'} style={{ width: AppSizes.screen.widthTwoThirds, height: AppSizes.screen.widthTwoThirds * 268/509 }}/>
                    <Spacer size={5}/>
                    <Text>{this.props.bluetooth.accessoryData.name || ''}</Text>
                    <Text style={{ fontSize: font10 }}>{this.props.bluetooth.accessoryData.id || ''}</Text>
                </View>
                <View>
                    <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>OWNER</Text>
                    <ListItem
                        title={'Kit Name'}
                        rightTitle={this.props.bluetooth.accessoryData.name ? this.props.bluetooth.accessoryData.name : null}
                        rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                        chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                        titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                        onPress={() => Actions.refresh({ isModalVisible: true })}
                    />
                    <ListItem
                        title={'Organization'}
                        rightTitle={this.props.bluetooth.accessoryData.organization ? this.props.bluetooth.accessoryData.organization.name : null}
                        rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                        chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                        titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                        onPress={() => { this.props.assignType('organization'); return Actions.kitAssign(); }}
                    />
                    {
                        this.props.bluetooth.accessoryData.organization ?
                            <ListItem
                                title={'Team'}
                                rightTitle={this.props.bluetooth.accessoryData.team ? this.props.bluetooth.accessoryData.team.name : null}
                                rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                                chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                                titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                                onPress={() => { this.props.assignType('team'); return Actions.kitAssign(); }}
                            />
                            :
                            <ListItem
                                title={'Team'}
                                chevronColor={AppColors.lightGrey}
                                titleStyle={{ color: AppColors.lightGrey}}
                            />
                    }
                    {
                        this.props.bluetooth.accessoryData.organization && this.props.bluetooth.accessoryData.team ?
                            <ListItem
                                title={'Individual'}
                                rightTitle={this.props.bluetooth.accessoryData.individual ? `${this.props.bluetooth.accessoryData.individual.first_name} ${this.props.bluetooth.accessoryData.individual.last_name}` : null}
                                rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                                chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                                titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                                onPress={() => { this.props.assignType('individual'); return Actions.kitAssign(); }}
                            />
                            :
                            <ListItem
                                title={'Individual'}
                                chevronColor={AppColors.lightGrey}
                                titleStyle={{ color: AppColors.lightGrey}}
                            />
                    }
                    <Text style={{ paddingLeft: 20, fontSize: font10 }}>Edit your school, team, and name above.</Text>
                </View>
            </ScrollView>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.props.isModalVisible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => { this.setState({ name: '' }); return Actions.refresh({ isModalVisible: false }); }}
            >
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
                    <Card title={'Set Kit Name'}>

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Enter name: Fathom_kit_(name)</FormLabel>
                        <FormInput
                            containerStyle={{ borderWidth: 1, borderColor: AppColors.border }}
                            inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })}
                        />

                        <Spacer />

                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                title={'Cancel'}
                                containerViewStyle={{ flex: 1 }}
                                backgroundColor={AppColors.brand.fogGrey}
                                onPress={() => Actions.refresh({ isModalVisible: false })}
                            />
                            <Button
                                title={'Save'}
                                containerViewStyle={{ flex: 1 }}
                                onPress={() => {
                                    return this.props.assignKitName(this.props.bluetooth.accessoryData.id, this.state.name).then(() => Actions.refresh({ isModalVisible: false }));
                                }}
                            />
                        </View>
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
export default KitOwnerView;
