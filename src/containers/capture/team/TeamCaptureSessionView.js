/**
 * Capture Session Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    ScrollView,
    View,
    BackHandler
} from 'react-native';
import { Icon } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppColors, AppSizes, AppFonts } from '@theme/';
import { Roles } from '@constants/';

// Components
import { ListItem, Spacer, Text, Card, FormLabel, FormInput, Button } from '@ui/';
import { Placeholder } from '@general/';

const font20 = AppFonts.scaleFont(20);

/* Component ==================================================================== */
class TeamCaptureSessionView extends Component {
    static componentName = 'TeamCaptureSessionView';

    static propTypes = {
        user:                PropTypes.object,
        isModalVisible:      PropTypes.bool,
        createTrainingGroup: PropTypes.func.isRequired,
        patchTrainingGroup:  PropTypes.func.isRequired,
        removeTrainingGroup: PropTypes.func.isRequired,
        teamSelect:          PropTypes.func.isRequired,
        selectTrainingGroup: PropTypes.func.isRequired
    }

    static defaultProps = {
        user: {
            teamIndex: 0
        },
        isModalVisible: false,
    }

    constructor(props) {
        super(props);

        this.state = {
            modalStyle:    {},
            trainingGroup: { name: '', description: '' },
        };
    }

    componentWillMount = () => { BackHandler.addEventListener('backPress', () => Actions.pop()); };

    componentWillUnmount = () => { BackHandler.removeEventListener('backPress') };

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    addGroup = () => {
        this.state.trainingGroup.athletes = [];
        this.props.createTrainingGroup(this.state.trainingGroup)
            .then(() => Actions.refresh({ isModalVisible: false }));
    }

    editGroup = () => {
        return this.props.patchTrainingGroup(this.state.trainingGroup)
            .then(() => Actions.refresh({ isModalVisible: false }));
    }

    removeGroup = (id) => {
        return this.props.removeTrainingGroup(id)
            .then(() => Actions.refresh());
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
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => (
        <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]}>
            <View style={{ justifyContent: 'center', flexDirection: 'row', backgroundColor: '#FFFFFF', paddingTop: 15, paddingBottom: 15 }} >
                <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={this.props.user.teamIndex} defaultValue={this.props.user.teams[this.props.user.teamIndex].name} textStyle={AppStyles.baseText} dropdownTextStyle={AppStyles.baseText} onSelect={index => this.props.teamSelect(index)} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }} color={AppColors.brand.blue}/>
            </View>
            <ScrollView>
                {/* Section for primary training groups */}
                <ListItem title={'PRIMARY TRAINING GROUPS'} containerStyle={{ backgroundColor: AppColors.brand.light }} hideChevron/>
                {
                    this.props.user.teams[this.props.user.teamIndex].training_groups.filter(trainingGroup => trainingGroup.tier !== 'secondary' && trainingGroup.tier !== null).map(trainingGroup => {
                        return <ListItem key={trainingGroup.id} title={trainingGroup.name} onPress={() => Promise.resolve(this.props.selectTrainingGroup(trainingGroup)).then(() => Actions.groupCaptureSession())} hideChevron/>;
                    })
                }
                {/*Section for secondary training groups */}
                <ListItem title={'SECONDARY TRAINING GROUPS'} containerStyle={{ backgroundColor: AppColors.brand.light }} rightIcon={{ name: 'plus-circle', type: 'material-community', color: AppColors.brand.yellow }} onPressRightIcon={() => Actions.refresh({ isModalVisible: true })}/>
                {
                    this.props.user.teams[this.props.user.teamIndex].training_groups.filter(trainingGroup => trainingGroup.tier === 'secondary' || trainingGroup.tier === null).map(trainingGroup => {
                        return (
                            <Swipeable key={trainingGroup.id} leftButtons={[this.leftButton(trainingGroup.id)]} rightButtons={[this.rightButton(trainingGroup)]} >
                                <ListItem title={trainingGroup.name} onPress={() => Promise.resolve(this.props.selectTrainingGroup(trainingGroup)).then(() => Actions.groupCaptureSession())} hideChevron/>
                            </Swipeable>
                        );
                    })
                }
            </ScrollView>
            <Modal position={'center'} style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]} isOpen={this.props.isModalVisible} backButtonClose swipeToClose={false} onClosed={() => { this.setState({ trainingGroup: { name: '', description: '' } }); Actions.refresh({ isModalVisible: false }); }}>
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
                    <Card title={`${this.state.trainingGroup.id ? 'Edit' : 'Add'} Training Group`}>

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Name</FormLabel>
                        <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.trainingGroup.name} onChangeText={name => this.setState({
                            trainingGroup: {
                                description: this.state.trainingGroup.description,
                                id:          this.state.trainingGroup.id,
                                name
                            }
                        })} />

                        <Spacer />

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Description</FormLabel>
                        <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.trainingGroup.description} onChangeText={description => this.setState({
                            trainingGroup: {
                                description,
                                id:   this.state.trainingGroup.id,
                                name: this.state.trainingGroup.name
                            }
                        })} />

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
export default TeamCaptureSessionView;
