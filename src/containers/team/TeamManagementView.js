/**
 * Team Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import RadialMenu from 'react-native-radial-menu';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';

/* Component ==================================================================== */
class TeamManagementView extends Component {
    static componentName = 'TeamManagementView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        regimens:       PropTypes.array,
        trainingGroups: PropTypes.array,
        addGroup:       PropTypes.func.isRequired,
        removeGroup:    PropTypes.func.isRequired,
        addRegimen:     PropTypes.func.isRequired,
        removeRegimen:  PropTypes.func.isRequired,
    }

    static defaultProps = {
        regimens:       [],
        trainingGroups: [],
    }

    /* eslint-disable max-len */
    render = () =>
        (
          <View style={[AppStyles.container, AppStyles.containerCentered]}>
            <RadialMenu menuRadius={AppStyles.windowSize.width/3} style={[AppStyles.radialMenu]} onOpen={() => {}} onClose={() => {}}>
              <Icon raised type="ionicon" name="ios-people" color="#FFFFFF" containerStyle={{ backgroundColor: AppColors.brand.primary }} style={[AppStyles.containerCentered]} size={41} />
              <Icon raised type="material-community" name="account-multiple-plus" color={AppColors.brand.primary} onSelect={() => Actions.groups({ trainingGroups: this.props.trainingGroups, removeGroup: this.props.removeGroup, addGroup: this.props.addGroup })} size={40} />
              <Icon raised type="octicon" name="graph" color={AppColors.brand.primary} onSelect={() => Actions.data({ trainingGroups: this.props.trainingGroups })} size={40} />
              <Icon raised type="material-community" name="view-list" color={AppColors.brand.primary} onSelect={() => Actions.athletes({ trainingGroups: this.props.trainingGroups, regimens: this.props.regimens })} size={40} />
              <Icon raised type="material-community" name="dumbbell" color={AppColors.brand.primary} onSelect={() => Actions.regimens({ regimens: this.props.regimens, removeRegimen: this.props.removeRegimen, addRegimen: this.props.addRegimen })} size={40} />
            </RadialMenu>
          </View>
        );
}

/* Export Component ==================================================================== */
export default TeamManagementView;
