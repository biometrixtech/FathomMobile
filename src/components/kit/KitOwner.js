/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:45 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-10 04:25:25
 */

/**
 * Kit Owner Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { Roles, BLEConfig, AppColors, AppStyles, AppSizes, AppFonts } from '../../constants/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem, Card, FormInput } from '../custom/';

const font10 = AppFonts.scaleFont(10);
const font14 = AppFonts.scaleFont(14);

// const configuration = BLEConfig.configuration;
// const bleConfiguredState = [configuration.DONE, configuration.UPSERT_PENDING, configuration.UPSERT_TO_SAVE, configuration.UPSERT_DONE];

/* Component ==================================================================== */
class KitOwnerView extends Component {
    static componentName = 'KitOwnerView';

    static propTypes = {
        bluetooth:     PropTypes.shape({}),
        user:          PropTypes.shape({}),
        assignKitName: PropTypes.func.isRequired,
        assignType:    PropTypes.func.isRequired,
        getKitName:    PropTypes.func.isRequired,
        getOwnerFlag:  PropTypes.func.isRequired,
        setKitTime:    PropTypes.func.isRequired,
        setOwnerFlag:  PropTypes.func.isRequired,
        startConnect:  PropTypes.func.isRequired,
        stopConnect:   PropTypes.func.isRequired,
        storeParams:   PropTypes.func.isRequired,
    }

    static defaultProps = {
        bluetooth:           {},
        user:                {},
        isModalVisible:      false,
        isResetModalVisible: false,
    }

    constructor(props) {
        super(props);

        this.state = {
            modalStyle: {},
            name:       '',
            refreshing: false,
        };
    }

    componentWillMount = () => {
        return this.props.getKitName(this.props.bluetooth.accessoryData.id)
            .catch(e => console.log(e))
            .then(() => this.props.bluetooth.accessoryData.name ? Promise.resolve() : this.props.getKitName(this.props.bluetooth.accessoryData.id))
            .catch(e => console.log(e))
            .then(() => this.props.getOwnerFlag(this.props.bluetooth.accessoryData.id))
            .catch(e => console.log(e))
            .then(() => typeof(this.props.bluetooth.accessoryData.ownerFlag) === typeof(true) ? Promise.resolve() : this.props.getOwnerFlag(this.props.bluetooth.accessoryData.id))
            .catch(e => console.log(e))
    };

    _onRefresh() {
        this.setState({refreshing: true});
        return this.props.getKitName(this.props.bluetooth.accessoryData.id)
            .catch(e => console.log(e))
            .then(() => this.props.bluetooth.accessoryData.name ? Promise.resolve() : this.props.getKitName(this.props.bluetooth.accessoryData.id))
            .catch(e => console.log(e))
            .then(() => this.props.getOwnerFlag(this.props.bluetooth.accessoryData.id))
            .catch(e => console.log(e))
            .then(() => typeof(this.props.bluetooth.accessoryData.ownerFlag) === typeof(true) ? Promise.resolve() : this.props.getOwnerFlag(this.props.bluetooth.accessoryData.id))
            .catch(e => console.log(e))
            .then(() => {
                this.setState({refreshing: false});
            });
    }

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    render = () => {
        let configured = this.props.bluetooth.accessoryData.ownerFlag;
        let saveable = this.props.bluetooth.accessoryData.name && this.props.bluetooth.accessoryData.individual && this.props.bluetooth.accessoryData.individual.first_name
            && this.props.bluetooth.accessoryData.individual.last_name && !this.props.bluetooth.accessoryData.ownerFlag;
        return (
            <View style={[AppStyles.container, { backgroundColor: AppColors.secondary.light_blue.fiftyPercent }]}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    <View style={{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', height: AppSizes.screen.heightOneThird }}>
                        <Image source={require('../../../assets/images/standard/kit-diagram.png')} resizeMode={'contain'} style={{ width: AppSizes.screen.widthTwoThirds, height: AppSizes.screen.widthTwoThirds * 268/509 }}/>
                        <Spacer size={5}/>
                        <Text>{this.props.bluetooth.accessoryData.name || ''}</Text>
                        <Text style={{ fontSize: font10 }}>{this.props.bluetooth.accessoryData.wifiMacAddress || ''}</Text>
                    </View>
                    <View>
                        {
                            configured ?
                                <ListItem
                                    title={'OWNER'}
                                    containerStyle={{ padding: 10, backgroundColor: AppColors.secondary.light_blue.fiftyPercent }}
                                    rightTitle={'Erase Owner'}
                                    rightTitleStyle={[AppStyles.baseText, AppStyles.oswaldBold, { color: AppColors.zeplin.yellow, }]}
                                    onPress={() => Actions.refresh({ isResetModalVisible: true })}
                                    hideChevron
                                />
                                :
                                saveable ?
                                    <ListItem
                                        title={'OWNER'}
                                        containerStyle={{ padding: 10, backgroundColor: AppColors.secondary.light_blue.fiftyPercent }}
                                        rightTitle={'Save'}
                                        rightTitleStyle={[AppStyles.baseText, AppStyles.oswaldBold, { color: AppColors.zeplin.yellow, }]}
                                        onPress={() => this.props.startConnect()
                                            .then(() => this.props.assignKitName(this.props.bluetooth.accessoryData.id, this.props.bluetooth.accessoryData.name.slice(11)))
                                            .then(() => this.props.setOwnerFlag(this.props.bluetooth.accessoryData.id, true))
                                            .then(() => this.props.storeParams(this.props.bluetooth.accessoryData))
                                            .then(() => this.props.setKitTime(this.props.bluetooth.accessoryData.id))
                                            .then(() => this.props.storeParams(this.props.bluetooth.accessoryData))
                                            .then(() => this.props.getOwnerFlag(this.props.bluetooth.accessoryData.id))
                                            .then(() => this.props.stopConnect())
                                            .catch(err => { console.log(err); return this.props.stopConnect(); })
                                        }
                                        hideChevron
                                    />
                                    :
                                    <ListItem
                                        title={'OWNER'}
                                        containerStyle={{ padding: 10, backgroundColor: AppColors.secondary.light_blue.fiftyPercent }}
                                        hideChevron
                                    />
                        }
                        {
                            configured ?
                                <ListItem
                                    title={'Kit Name'}
                                    rightTitle={this.props.bluetooth.accessoryData.name ? this.props.bluetooth.accessoryData.name : null}
                                    rightTitleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                    chevronColor={AppColors.primary.grey.thirtyPercent}
                                    titleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                />
                                :
                                <ListItem
                                    title={'Kit Name'}
                                    rightTitle={this.props.bluetooth.accessoryData.name ? this.props.bluetooth.accessoryData.name : null}
                                    rightTitleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                                    chevronColor={this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}
                                    titleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                                    onPress={() => Actions.refresh({ isModalVisible: true })}
                                />
                        }
                        {
                            configured ?
                                <ListItem
                                    title={'Organization'}
                                    rightTitle={this.props.bluetooth.accessoryData.organization ? this.props.bluetooth.accessoryData.organization.name : null}
                                    rightTitleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                    chevronColor={AppColors.primary.grey.thirtyPercent}
                                    titleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                />
                                :
                                <ListItem
                                    title={'Organization'}
                                    rightTitle={this.props.bluetooth.accessoryData.organization ? this.props.bluetooth.accessoryData.organization.name : null}
                                    rightTitleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                                    chevronColor={this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}
                                    titleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                                    onPress={() => { this.props.assignType('organization'); return Actions.kitAssign(); }}
                                />
                        }
                        {
                            this.props.bluetooth.accessoryData.organization ?
                                configured ?
                                    <ListItem
                                        title={'Team'}
                                        rightTitle={this.props.bluetooth.accessoryData.team ? this.props.bluetooth.accessoryData.team.name : null}
                                        rightTitleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                        chevronColor={AppColors.primary.grey.thirtyPercent}
                                        titleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                    />
                                    :
                                    <ListItem
                                        title={'Team'}
                                        rightTitle={this.props.bluetooth.accessoryData.team ? this.props.bluetooth.accessoryData.team.name : null}
                                        rightTitleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                                        chevronColor={this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}
                                        titleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                                        onPress={() => { this.props.assignType('team'); return Actions.kitAssign(); }}
                                    />
                                :
                                <ListItem
                                    title={'Team'}
                                    chevronColor={AppColors.primary.grey.thirtyPercent}
                                    titleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                />
                        }
                        {
                            this.props.bluetooth.accessoryData.organization && this.props.bluetooth.accessoryData.team ?
                                configured ?
                                    <ListItem
                                        title={'Individual'}
                                        rightTitle={this.props.bluetooth.accessoryData.individual ? `${this.props.bluetooth.accessoryData.individual.first_name} ${this.props.bluetooth.accessoryData.individual.last_name}` : null}
                                        rightTitleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                        chevronColor={AppColors.primary.grey.thirtyPercent}
                                        titleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                    />
                                    :
                                    <ListItem
                                        title={'Individual'}
                                        rightTitle={this.props.bluetooth.accessoryData.individual ? `${this.props.bluetooth.accessoryData.individual.first_name} ${this.props.bluetooth.accessoryData.individual.last_name}` : null}
                                        rightTitleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                                        chevronColor={this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}
                                        titleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                                        onPress={() => { this.props.assignType('individual'); return Actions.kitAssign(); }}
                                    />
                                :
                                <ListItem
                                    title={'Individual'}
                                    chevronColor={AppColors.primary.grey.thirtyPercent}
                                    titleStyle={{ color: AppColors.primary.grey.thirtyPercent}}
                                />
                        }
                        {
                            configured ?
                                <Text style={{ paddingLeft: 20, fontSize: configured ? font14 : font10, fontWeight: configured ? 'bold' : 'normal' }}>Optional: Reset kit assignment to edit selections or press back to go to the main menu</Text>
                                :
                                <View>
                                    <Text style={{
                                        paddingLeft: 20,
                                        fontSize:    !this.props.bluetooth.accessoryData.organization && !this.props.bluetooth.accessoryData.team && !this.props.bluetooth.accessoryData.individual ? font14 : font10,
                                        fontWeight:  !this.props.bluetooth.accessoryData.organization && !this.props.bluetooth.accessoryData.team && !this.props.bluetooth.accessoryData.individual ? 'bold' : 'normal'
                                    }}>Step 1: Select organization</Text>
                                    <Text style={{
                                        paddingLeft: 20,
                                        fontSize:    this.props.bluetooth.accessoryData.organization && !this.props.bluetooth.accessoryData.team && !this.props.bluetooth.accessoryData.individual ? font14 : font10,
                                        fontWeight:  this.props.bluetooth.accessoryData.organization && !this.props.bluetooth.accessoryData.team && !this.props.bluetooth.accessoryData.individual ? 'bold' : 'normal'
                                    }}>Step 2: Select team</Text>
                                    <Text style={{
                                        paddingLeft: 20,
                                        fontSize:    this.props.bluetooth.accessoryData.organization && this.props.bluetooth.accessoryData.team && !this.props.bluetooth.accessoryData.individual ? font14 : font10,
                                        fontWeight:  this.props.bluetooth.accessoryData.organization && this.props.bluetooth.accessoryData.team && !this.props.bluetooth.accessoryData.individual ? 'bold' : 'normal'
                                    }}>Step 3: Assign kit individual</Text>
                                    <Text style={{ paddingLeft: 20, fontSize: font10 }}>Optional: Assign a different kit name</Text>
                                    <Text style={{
                                        paddingLeft: 20,
                                        fontSize:    this.props.bluetooth.accessoryData.organization && this.props.bluetooth.accessoryData.team && this.props.bluetooth.accessoryData.individual ? font14 : font10,
                                        fontWeight:  this.props.bluetooth.accessoryData.organization && this.props.bluetooth.accessoryData.team && this.props.bluetooth.accessoryData.individual ? 'bold' : 'normal'
                                    }}>Step 4: Press Save</Text>
                                </View>
                        }
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
                                maxLength={6}
                                keyboardType={'name-phone-pad'}
                                onChangeText={name => this.setState({ name: name.replace(/\W/g, '') })}
                            />

                            <Spacer />

                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    title={'Cancel'}
                                    containerViewStyle={{ flex: 1 }}
                                    backgroundColor={AppColors.primary.grey.fiftyPercent}
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
                <Modal
                    position={'center'}
                    style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                    isOpen={this.props.isResetModalVisible}
                    backButtonClose
                    swipeToClose={false}
                    onClosed={() => Actions.refresh({ isResetModalVisible: false })}
                >
                    <View onLayout={(ev) => { this.resizeModal(ev); }}>
                        <Card title={'Erase Owner'}>

                            <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >This will remove the kit owner data. Are you sure you want to erase?</FormLabel>

                            <Spacer />

                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    title={'No'}
                                    containerViewStyle={{ flex: 1 }}
                                    backgroundColor={AppColors.primary.grey.fiftyPercent}
                                    onPress={() => Actions.refresh({ isResetModalVisible: false })}
                                />
                                <Button
                                    title={'Yes'}
                                    containerViewStyle={{ flex: 1 }}
                                    onPress={() => this.props.startConnect()
                                        .then(() => this.props.setOwnerFlag(this.props.bluetooth.accessoryData.id, false))
                                        .then(() => this.props.storeParams(this.props.bluetooth.accessoryData))
                                        .then(() => this._onRefresh())
                                        .catch(err => console.log(err))
                                        .then(() => this.props.stopConnect())
                                        .then(() => Actions.refresh({ isResetModalVisible: false }))
                                    }
                                />
                            </View>
                        </Card>
                    </View>
                </Modal>
                { this.props.bluetooth.indicator ? 
                    <ActivityIndicator
                        style={[AppStyles.activityIndicator]}
                        size={'large'}
                        color={'#C1C5C8'}
                    /> : null
                }
            </View>
        );
    };
}

/* Export Component ==================================================================== */
export default KitOwnerView;
