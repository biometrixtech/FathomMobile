/**
 * Capture Session Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import Collapsible from 'react-native-collapsible';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppColors } from '@theme/';

// Components
import { Spacer, Text } from '@ui/';

const accessoryDiscoverabilityInstruction = 'hold the top and bottom buttons simultaneously until the kit lights flash red and blue';

/* Component ==================================================================== */
class CaptureSessionView extends Component {
    static componentName = 'CaptureSessionView';

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

    render = () =>
        (
            <View>
                <Spacer />
                <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                    <ModalDropdown options={this.props.user.teams.map(team => team.name)} defaultIndex={0} defaultValue={this.props.user.teams[0].name} textStyle={{ fontSize: 20 }} dropdownTextStyle={{ fontSize: 20 }} />
                    <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }}/>
                </View>
                <Spacer />
            </View>
        );
}

/* Export Component ==================================================================== */
export default CaptureSessionView;
