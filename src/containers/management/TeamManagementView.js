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
    static componentName = 'ManagerTeamManagementView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        regimens:       PropTypes.array,
        trainingGroups: PropTypes.array,
        addGroup:       PropTypes.func.isRequired,
        editGroup:      PropTypes.func.isRequired,
        removeGroup:    PropTypes.func.isRequired,
        addRegimen:     PropTypes.func.isRequired,
        editRegimen:    PropTypes.func.isRequired,
        removeRegimen:  PropTypes.func.isRequired,
        addAthlete:     PropTypes.func.isRequired,
        editAthlete:    PropTypes.func.isRequired,
        removeAthlete:  PropTypes.func.isRequired,
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
              <Icon raised type="material-community" name="account-multiple-plus" color={AppColors.brand.primary} onSelect={() => Actions.managerGroups({ trainingGroups: this.props.trainingGroups, removeGroup: this.props.removeGroup, addGroup: this.props.addGroup, editGroup: this.props.editGroup })} size={40} />
              <Icon raised type="octicon" name="graph" color={AppColors.brand.primary} onSelect={() => Actions.managerData({ trainingGroups: this.props.trainingGroups })} size={40} />
              <Icon raised type="material-community" name="view-list" color={AppColors.brand.primary} onSelect={() => Actions.managerAthletes({ trainingGroups: this.props.trainingGroups, regimens: this.props.regimens, addAthlete: this.props.addAthlete, removeAthlete: this.props.removeAthlete, editAthlete: this.props.editAthlete })} size={40} />
              <Icon raised type="material-community" name="dumbbell" color={AppColors.brand.primary} onSelect={() => Actions.managerRegimens({ regimens: this.props.regimens, removeRegimen: this.props.removeRegimen, addRegimen: this.props.addRegimen, editRegimen: this.props.editRegimen })} size={40} />
            </RadialMenu>
          </View>
        );
}

/* Export Component ==================================================================== */
export default TeamManagementView;
