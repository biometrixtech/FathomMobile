/**
 * Capture Session Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppColors } from '@theme/';

// Components
import { Spacer, Text } from '@ui/';
import { Placeholder } from '@general/';
import { Roles } from '@constants/';

/* Component ==================================================================== */
class GroupCaptureSessionView extends Component {
    static componentName = 'GroupCaptureSessionView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        user: PropTypes.object,
    }

    static defaultProps = {
        user:  {},
    }

    constructor(props) {
        super(props);
    }

    adminView = (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    athleteView = (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    biometrixAdminView = (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    managerView = (
        <View>
            <Spacer />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
            </View>
            <Spacer />
        </View>
    );

    researcherView = (
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
                return this.adminView;
            case Roles.athlete:
                return this.athleteView;
            case Roles.biometrixAdmin:
                return this.biometrixAdminView;
            case Roles.manager:
                return this.managerView;
            case Roles.researcher:
                return this.researcherView;
            default:
                return <Placeholder />;
        }
    }
}

/* Export Component ==================================================================== */
export default GroupCaptureSessionView;
