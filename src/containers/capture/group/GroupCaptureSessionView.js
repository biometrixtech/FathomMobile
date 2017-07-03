/**
 * Capture Session Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { Icon, Tab, Tabs } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppSizes, AppStyles, AppColors } from '@theme/';

// Components
import { Button, ListItem, Spacer, Text, Card, FormLabel, FormInput } from '@ui/';
import { Placeholder } from '@general/';
import { Roles } from '@constants/';

/* Component ==================================================================== */
class GroupCaptureSessionView extends Component {
    static componentName = 'GroupCaptureSessionView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        user:           PropTypes.object,
        isModalVisible: PropTypes.bool,
        team:           PropTypes.object.isRequired,
        trainingGroup:  PropTypes.object.isRequired
    }

    static defaultProps = {
        user:           {},
        isModalVisible: false
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0,
            height:        0,
            active:        false,
            trainingGroup: props.trainingGroup,
            modalStyle:    {}
        };
    }

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    adminView = () => (
        <View>
            <Spacer />
            <ListItem containerStyle={{ alignSelf: 'center' }} title={this.props.team.name} subtitle={this.props.trainingGroup.name} />
            <Spacer />
        </View>
    );

    athleteView = () => (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    biometrixAdminView = () => (
        <View style={[AppStyles.container]}>
            <View>
                <ListItem onLayout={(ev) => this.setState({ height: ev.nativeEvent.layout.height })} 
                    containerStyle={{ borderBottomWidth: 0 }}
                    titleContainerStyle={{ alignSelf: 'center', marginLeft: this.state.active ? 52 : 0 }}
                    title={this.props.team.name}
                    subtitleContainerStyle={{ alignSelf: 'center', marginLeft: this.state.active ? 51 : 0 }}
                    subtitle={this.props.trainingGroup.name}
                    fontFamily={AppStyles.baseText.fontFamily}
                    leftIcon={{ name: this.state.active ? null : 'chevron-left', color: AppColors.brand.blue, type: 'material-community' }}
                    leftIconOnPress={() => Actions.biometrixAdminTeamCaptureSession()}
                    rightIcon={{ name: 'pencil-circle', color: AppColors.brand.yellow, type: 'material-community'}}
                    onPressRightIcon={() => Actions.refresh({ isModalVisible: true, team: this.props.team, trainingGroup: this.props.trainingGroup })}
                />
                <Spacer size={this.state.height}/>
                <Tabs sceneStyle={{ backgroundColor: AppColors.brand.light, height: AppSizes.screen.height - AppSizes.navbarHeight - (2*this.state.height) + 15 }}
                    tabBarStyle={{ backgroundColor: '#FFFFFF', borderBottomWidth: 2, borderColor: AppColors.shadowColor }}
                    tabBarShadowStyle={{ height: 0 }}
                >
                    <Tab titleStyle={{ paddingBottom: 10, marginTop: 10, ...AppStyles.baseText, color: AppColors.lightGrey  }}
                        selectedTitleStyle={{ borderBottomWidth: 2, borderColor: AppColors.brand.yellow, color: AppColors.brand.blue }}
                        title={'CAPTURING'}
                        renderBadge={() => (<Text style={{ color: this.state.selectedIndex === 0 ? AppColors.brand.blue : AppColors.lightGrey}}>5</Text>)}
                        allowFontScaling
                        selected={this.state.selectedIndex === 0}
                        onPress={() => this.setState({ selectedIndex: 0 })}
                    >
                        <View style={{ flex: 1, paddingTop: 2 }}>
                            <ScrollView>
                                {
                                    this.props.team.users_with_training_groups.filter(user => user.training_groups.some(group => group.id === this.props.trainingGroup.id)).map(user => {
                                        return (
                                            <Swipeable key={user.id+'0'} style={{padding: 2}}>
                                                <ListItem avatar={{uri: user.avatar_url }} title={`${user.first_name} ${user.last_name}`} hideChevron/>
                                            </Swipeable>
                                        );
                                    })
                                }
                            </ScrollView>
                            <Button
                                containerViewStyle={{ bottom: 0 , height: 30, width: AppSizes.screen.width, alignSelf: 'center', paddingTop: 2 }}
                                buttonStyle={{ borderRadius: 0 }}
                                backgroundColor={AppColors.brand.yellow}
                                onPress={() => this.setState({ active: !this.state.active })}
                                color={'#FFFFFF'}
                                title={`${this.state.active ? 'STOP' : 'START'} GROUP SESSION`}
                                icon={{ name: this.state.active ? 'stop' : 'play', type: 'font-awesome', color: '#FFFFFF' }}
                            />
                        </View>
                    </Tab>
                    <Tab titleStyle={{ paddingBottom: 10, marginTop: 10, ...AppStyles.baseText, color: AppColors.lightGrey  }}
                        selectedTitleStyle={{ borderBottomWidth: 2, borderColor: AppColors.brand.yellow, color: AppColors.brand.blue }}
                        title={'READY'}
                        renderBadge={() => (<Text style={{ color: this.state.selectedIndex === 1 ? AppColors.brand.blue : AppColors.lightGrey}}>3</Text>)}
                        allowFontScaling
                        selected={this.state.selectedIndex === 1}
                        onPress={() => this.setState({ selectedIndex: 1 })}
                    >
                        <View style={{ flex: 1, paddingTop: 2 }}>
                            <ScrollView>
                                {
                                    this.props.team.users_with_training_groups.filter(user => user.training_groups.some(group => group.id === this.props.trainingGroup.id)).map(user => {
                                        return (
                                            <Swipeable key={user.id+'0'} style={{padding: 2}}>
                                                <ListItem avatar={{uri: user.avatar_url }} title={`${user.first_name} ${user.last_name}`} hideChevron/>
                                            </Swipeable>
                                        );
                                    })
                                }
                            </ScrollView>
                            <Button
                                containerViewStyle={{ bottom: 0 , height: 30, width: AppSizes.screen.width, alignSelf: 'center', paddingTop: 2 }}
                                buttonStyle={{ borderRadius: 0 }}
                                backgroundColor={AppColors.brand.yellow}
                                onPress={() => this.setState({ active: !this.state.active })}
                                color={'#FFFFFF'}
                                title={`${this.state.active ? 'STOP' : 'START'} GROUP SESSION`}
                                icon={{ name: this.state.active ? 'stop' : 'play', type: 'font-awesome', color: '#FFFFFF' }}
                            />
                        </View>
                    </Tab>
                    <Tab titleStyle={{ paddingBottom: 10, marginTop: 10, ...AppStyles.baseText, color: AppColors.lightGrey  }}
                        selectedTitleStyle={{ borderBottomWidth: 2, borderColor: AppColors.brand.yellow, color: AppColors.brand.blue }}
                        title={'NOT READY'}
                        renderBadge={() => (<Text style={{ color: this.state.selectedIndex === 2 ? AppColors.brand.blue : AppColors.lightGrey}}>2</Text>)}
                        allowFontScaling
                        selected={this.state.selectedIndex === 2}
                        onPress={() => this.setState({ selectedIndex: 2 })}
                    >
                        <View style={{ flex: 1, paddingTop: 2 }}>
                            <ScrollView>
                                {
                                    this.props.team.users_with_training_groups.filter(user => user.training_groups.some(group => group.id === this.props.trainingGroup.id)).map(user => {
                                        return (
                                            <Swipeable key={user.id+'0'} style={{padding: 2}}>
                                                <ListItem avatar={{uri: user.avatar_url }} title={`${user.first_name} ${user.last_name}`} hideChevron/>
                                            </Swipeable>
                                        );
                                    })
                                }
                            </ScrollView>
                            <Button
                                containerViewStyle={{ bottom: 0 , height: 30, width: AppSizes.screen.width, alignSelf: 'center', paddingTop: 2 }}
                                buttonStyle={{ borderRadius: 0 }}
                                backgroundColor={AppColors.brand.yellow}
                                onPress={() => this.setState({ active: !this.state.active })}
                                color={'#FFFFFF'}
                                title={`${this.state.active ? 'STOP' : 'START'} GROUP SESSION`}
                                icon={{ name: this.state.active ? 'stop' : 'play', type: 'font-awesome', color: '#FFFFFF' }}
                            />
                        </View>
                    </Tab>
                </Tabs>
            </View>
            <Modal position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.props.isModalVisible}
                backButtonClose swipeToClose={false}
                onClosed={() => {
                    Actions.refresh({ isModalVisible: false, team: this.props.team, trainingGroup: this.state.trainingGroup }); 
                }}
            >
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
                    <Card title={'Edit Training Group'}>

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]}>Name</FormLabel>
                        <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }}
                            inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                            value={this.state.trainingGroup.name}
                            onChangeText={name => this.setState({ trainingGroup: (this.state.trainingGroup.name = name) })}
                        />

                        <Spacer />

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]}>Description</FormLabel>
                        <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }}
                            inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                            value={this.state.trainingGroup.description}
                            onChangeText={description => this.setState({ trainingGroup: (this.state.trainingGroup.description = description) })}
                        />

                        <Spacer />

                        <Button
                            title={'Save'}
                            onPress={() => Actions.refresh({ isModalVisible: false, team: this.props.team, trainingGroup: this.state.trainingGroup })}
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
                <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    researcherView = () => (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
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
export default GroupCaptureSessionView;
