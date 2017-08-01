/**
 * Capture Session Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    ScrollView,
    View,
    BackHandler,
    RefreshControl
} from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';
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
        selectTrainingGroup: PropTypes.func.isRequired,
        getAccessories:      PropTypes.func.isRequired,
        getTeams:            PropTypes.func.isRequired
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
            trainingGroup: { name: '', user_ids: {}, tier: 'secondary', team_id: this.props.user.teams[this.props.user.teamIndex].id },
            refreshing:    false,
        };
    }

    componentWillMount = () => {
        BackHandler.addEventListener('backPress', () => Actions.pop());
        return this.props.getTeams()
            .then(() => this.props.getAccessories());
    };

    componentWillUnmount = () => {
        BackHandler.removeEventListener('backPress');
    };

    _onRefresh() {
        this.setState({refreshing: true});
        return this.props.getTeams()
            .catch(e => console.log(e))
            .then(() => this.props.getAccessories())
            .catch(e => console.log(e))
            .then(() => {
                this.setState({refreshing: false});
            });
    }

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    addGroup = () => {
        return this.props.createTrainingGroup(this.state.trainingGroup)
            .then(() => Actions.refresh({ isModalVisible: false }))
            .then(() => this.props.getTeams());
    }

    editGroup = () => {
        return this.props.patchTrainingGroup(this.state.trainingGroup)
            .then(() => Actions.refresh({ isModalVisible: false }))
            .then(() => this.props.getTeams());
    }

    removeGroup = (id) => {
        return this.props.removeTrainingGroup(id)
            .then(() => Actions.refresh());
    }

    rightButton = (data) => {
        data.user_ids = this.props.user.teams[this.props.user.teamIndex].users_with_training_groups.reduce((returnObj, currentObj) => {
            returnObj[currentObj.id] = currentObj.training_groups.some(currentUserTrainingGroup => currentUserTrainingGroup.id === data.id);
            return returnObj;
        }, {})
        return (
            <View style={[{ alignItems: 'flex-start', paddingLeft: 25 }, AppStyles.editButton]}>
                <Icon name="pencil" onPress={() => { this.setState({ trainingGroup: data }); return Actions.refresh({ isModalVisible: true }); }} type="material-community" color="#FFFFFF" />
            </View>
        );
    };

    leftButton = (id) => (
        <View style={[{ alignItems: 'flex-end', paddingRight: 25 }, AppStyles.deleteButton]}>
            <Icon name="delete" onPress={() => this.removeGroup(id)} type="material-community" color="#FFFFFF" />
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
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
            >
                <View style={{ justifyContent: 'center', backgroundColor: '#FFFFFF', paddingTop: 15, paddingBottom: 15 }} >
                    {
                        this.props.user.teams.length > 1 ?
                            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                <ModalDropdown
                                    options={this.props.user.teams.map(team => team.name)}
                                    defaultIndex={this.props.user.teamIndex}
                                    defaultValue={this.props.user.teams[this.props.user.teamIndex].name}
                                    textStyle={AppStyles.h3}
                                    dropdownTextStyle={AppStyles.h3}
                                    onSelect={index => {
                                        return Promise.resolve(this.props.teamSelect(index))
                                            .then(() => this.setState({
                                                trainingGroup: {
                                                    ...this.state.trainingGroup,
                                                    team_id: this.props.user.teams[this.props.user.teamIndex].id
                                                }
                                            }));
                                    }}
                                />
                                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }} color={AppColors.brand.blue}/>
                            </View>
                            :
                            <Text style={AppStyles.h3}>{this.props.user.teams[this.props.user.teamIndex].name || 'No teams'}</Text>

                    }
                </View>
                <ScrollView>
                    {/* Section for primary training groups */}
                    <ListItem title={'PRIMARY TRAINING GROUPS'} containerStyle={{ backgroundColor: AppColors.brand.light }} hideChevron/>
                    {
                        this.props.user.teams[this.props.user.teamIndex].training_groups.filter(trainingGroup => trainingGroup.tier !== 'secondary' && trainingGroup.tier !== null).map(trainingGroup =>
                            <ListItem key={trainingGroup.id} title={trainingGroup.name} onPress={() => Promise.resolve(this.props.selectTrainingGroup(trainingGroup)).then(() => Actions.groupCaptureSession())} hideChevron/>
                        )
                    }
                    {/*Section for secondary training groups */}
                    <ListItem
                        title={'SECONDARY TRAINING GROUPS'}
                        containerStyle={{ backgroundColor: AppColors.brand.light }}
                        rightIcon={{ name: 'plus-circle', type: 'material-community', color: AppColors.brand.yellow }}
                        onPressRightIcon={() => Actions.refresh({ isModalVisible: true })}
                    />
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
            </ScrollView>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.props.isModalVisible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => { this.setState({ trainingGroup: { name: '', user_ids: {}, tier: 'secondary', team_id: this.props.user.teams[this.props.user.teamIndex].id } }); return Actions.refresh({ isModalVisible: false }); }}
            >
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
                    <Card title={`${this.state.trainingGroup.id ? 'Edit' : 'Add'} Training Group`}>

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Name</FormLabel>
                        <FormInput containerStyle={{ borderWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.trainingGroup.name} onChangeText={name => this.setState({
                            trainingGroup: {
                                ...this.state.trainingGroup,
                                name
                            }
                        })} />

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Athletes</FormLabel>
                        <Spacer size={5} />
                        <ScrollView style={{ borderWidth: 1, borderColor: AppColors.border, height: AppSizes.screen.heightOneThird }}>
                            {
                                this.props.user.teams[this.props.user.teamIndex].users_with_training_groups.map(user => {
                                    return (
                                        <CheckBox
                                            key={user.id}
                                            title={`${user.first_name} ${user.last_name}`}
                                            checked={this.state.trainingGroup.user_ids[user.id]}
                                            onPress={() => {
                                                this.state.trainingGroup.user_ids[user.id] = !this.state.trainingGroup.user_ids[user.id];
                                                return this.setState({
                                                    trainingGroup: {
                                                        ...this.state.trainingGroup
                                                    }
                                                });
                                            }}
                                        />
                                    );
                                })
                            }
                        </ScrollView>

                        <Spacer />

                        <Button
                            title={'Save'}
                            onPress={() => {
                                if (!this.state.trainingGroup.id && this.state.trainingGroup.name === '') {
                                    return Actions.refresh({ isModalVisible: false });
                                }
                                return this.state.trainingGroup.id ? this.editGroup() : this.addGroup();
                            }}
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
