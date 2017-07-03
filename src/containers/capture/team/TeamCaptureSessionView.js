/**
 * Capture Session Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppColors, AppSizes } from '@theme/';

// Components
import { ListItem, Spacer, Text, Card, FormLabel, FormInput, Button } from '@ui/';
import { Placeholder } from '@general/';
import { Roles } from '@constants/';

/* Component ==================================================================== */
class TeamCaptureSessionView extends Component {
    static componentName = 'TeamCaptureSessionView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        user:                PropTypes.object,
        isModalVisible:      PropTypes.bool,
        createTrainingGroup: PropTypes.func.isRequired,
        patchTrainingGroup:  PropTypes.func.isRequired,
        removeTrainingGroup: PropTypes.func.isRequired,
    }

    static defaultProps = {
        user:           {},
        isModalVisible: false,
    }

    constructor(props) {
        super(props);

        this.state = {
            teamIndex:      0,
            teams:          this.props.user.teams,
            modalStyle:     {},
            trainingGroup:  { name: '', description: '' },
            trainingGroups: this.props.user.teams[0].training_groups,
        };
    }

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    addGroup = () => {
        this.state.trainingGroup.id             = this.state.training_groups.length + 1;
        this.state.trainingGroup.athletes       = [];
        this.props.createTrainingGroup(this.state.trainingGroup);
        this.setState({ trainingGroups: this.state.trainingGroups.concat([this.state.trainingGroup]), trainingGroup: { name: '', description: '' } });
        Actions.refresh({ isModalVisible: false });
    }

    editGroup = () => {
        const index = this.state.trainingGroups.findIndex(trainingGroup => trainingGroup.id === this.state.trainingGroup.id);
        if (index > -1) {
            this.state.trainingGroups[index] = this.state.trainingGroup;
            this.props.patchTrainingGroup(this.state.trainingGroup);
            this.setState({ trainingGroups: this.state.trainingGroups, trainingGroup: { name: '', description: '' } });
        }
        Actions.refresh({ isModalVisible: false });
    }

    removeGroup = (id) => {
        this.props.removeTrainingGroup(id);
        this.setState({ trainingGroups: this.state.trainingGroups.filter(trainingGroup => trainingGroup.id !== id) });
    }

    rightButton = (data) => (
        <View style={[{ alignItems: 'flex-start', paddingLeft: 25 }, AppStyles.editButton]}>
            <Icon name="pencil" onPress={() => { this.setState({ trainingGroup: data }); Actions.refresh({ isModalVisible: true }); }} type="material-community" color="#FFFFFF" />
        </View>
    );

    leftButton = (id) => (
        <View style={[{ alignItems: 'flex-end', paddingRight: 25 }, AppStyles.deleteButton]}>
            <Icon name="delete" onPress={() => { this.removeGroup(id); }} type="material-community" color="#FFFFFF" />
        </View>
    );

    adminView = () => (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.state.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.state.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    athleteView = () => (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.state.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    biometrixAdminView = () => (
        <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]}>
            <View style={{ justifyContent: 'center', flexDirection: 'row', backgroundColor: '#FFFFFF', paddingTop: 15, paddingBottom: 15 }} >
                <ModalDropdown options={this.state.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.state.teams[0].name} textStyle={AppStyles.baseText} dropdownTextStyle={AppStyles.baseText} onSelect={index => { this.setState({teamIndex: index}); }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }} color={AppColors.brand.blue}/>
            </View>
            <ScrollView>
                {/* Section for primary training groups */}
                <ListItem title={'PRIMARY TRAINING GROUPS'} containerStyle={{ backgroundColor: AppColors.brand.light }} hideChevron/>
                {
                    this.state.teams[this.state.teamIndex].training_groups.filter(trainingGroup => trainingGroup.description.match(/primary/i)).map(trainingGroup => {
                        /* avatar={{uri: this.props.user.avatar_url }} */
                        return <ListItem key={trainingGroup.id} title={trainingGroup.name} onPress={() => Actions.biometrixAdminGroupCaptureSession({ team: this.state.teams[this.state.teamIndex], trainingGroup })} hideChevron/>;
                    })
                }
                {/*Section for secondary training groups */}
                <ListItem title={'SECONDARY TRAINING GROUPS'} containerStyle={{ backgroundColor: AppColors.brand.light }} rightIcon={{ name: 'plus-circle', type: 'material-community', color: AppColors.brand.yellow }} onPressRightIcon={() => Actions.refresh({ isModalVisible: true })}/>
                {
                    this.state.teams[this.state.teamIndex].training_groups.filter(trainingGroup => trainingGroup.description.match(/secondary/i)).map(trainingGroup => {
                        return (
                            <Swipeable key={trainingGroup.id} leftButtons={[this.leftButton(trainingGroup.id)]} rightButtons={[this.rightButton(trainingGroup)]} >
                                <ListItem title={trainingGroup.name} onPress={() => Actions.biometrixAdminGroupCaptureSession({ team: this.state.teams[this.state.teamIndex], trainingGroup })} hideChevron/>
                            </Swipeable>
                        );
                    })
                }
            </ScrollView>
            <Modal position={'center'} style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]} isOpen={this.props.isModalVisible} backButtonClose swipeToClose={false} onClosed={() => { this.setState({ trainingGroup: { name: '', description: '' } }); Actions.refresh({ isModalVisible: false }); }}>
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
                    <Card title={`${this.state.trainingGroup.id ? 'Edit' : 'Add'} Training Group`}>

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Name</FormLabel>
                        <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.trainingGroup.name} onChangeText={name => this.setState({ trainingGroup: (this.state.trainingGroup.name = name) })} />

                        <Spacer />

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Description</FormLabel>
                        <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.trainingGroup.description} onChangeText={description => this.setState({ trainingGroup: (this.state.trainingGroup.description = description) })} />

                        <Spacer />

                        <Button
                            title={'Save'}
                            onPress={() => { if (this.state.trainingGroup.id) { this.editGroup(); } else { this.addGroup(); } }}
                        />
                    </Card>
                </View>
            </Modal>
        </View>
    );

    managerView = () => (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.state.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.state.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    researcherView = () => (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.state.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.state.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    render = () => {
        switch(this.props.user.role) {
        case Roles.admin:
            return this.adminView();
        case Roles.athlete:
            return this.athleteView();
        case Roles.biometrixAdmin:
            return this.biometrixAdminView();
        case Roles.manager:
            return this.managerView();
        case Roles.researcher:
            return this.researcherView();
        default:
            return <Placeholder />;
        }
    }
}

/* Export Component ==================================================================== */
export default TeamCaptureSessionView;
