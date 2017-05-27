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
              <Icon raised type="ionicon" name="ios-people" color={AppColors.brand.primary} reverse size={41} />
              <Icon raised type="material-community" name="account-multiple-plus" color={AppColors.brand.primary} containerStyle={{ backgroundColor: AppColors.lightGrey }} onSelect={Actions.managerGroups} size={40} />
              <Icon raised type="octicon" name="graph" color={AppColors.brand.primary} containerStyle={{ backgroundColor: AppColors.lightGrey }} onSelect={Actions.managerData} size={40} />
              <Icon raised type="material-community" name="view-list" color={AppColors.brand.primary} containerStyle={{ backgroundColor: AppColors.lightGrey }} onSelect={Actions.managerAthletes} size={40} />
              <Icon raised type="material-community" name="dumbbell" color={AppColors.brand.primary} containerStyle={{ backgroundColor: AppColors.lightGrey }} onSelect={Actions.managerRegimens} size={40} />
            </RadialMenu>
          </View>
        );
}

/* Export Component ==================================================================== */
export default TeamManagementView;
