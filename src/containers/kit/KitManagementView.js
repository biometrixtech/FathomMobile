/**
 * Kit Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import RadialMenu from 'react-native-radial-menu';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    whiteText: {
        color: '#FFF',
    },
});

/* Component ==================================================================== */
class KitManagementView extends Component {
    static componentName = 'KitManagementView';

    static propTypes = {
        role: PropTypes.string,
    }

    static defaultProps = {
        role: null,
    }

    constructor() {
        super();
        this.state = {
            open: false,
        };
    }

    /* eslint-disable max-len */
    render = () =>
        (
          <View style={[AppStyles.container, AppStyles.containerCentered]}>
            <RadialMenu menuRadius={AppStyles.windowSize.width/3} style={[AppStyles.radialMenu]} onOpen={() => (this.setState({ open: true }))} onClose={() => (this.setState({ open: false }))}>
              <Icon raised type="octicon" name="settings" color="#FFFFFF" containerStyle={{ backgroundColor: AppColors.brand.primary }} style={[AppStyles.centerAligned]} size={40} />
              <Icon raised type="entypo" name="tools" color={AppColors.brand.primary} size={40} />
              <Icon raised type="material-community" name="account-switch" color={AppColors.brand.primary} size={40} />
              <Icon raised type="material-community" name="replay" color={AppColors.brand.primary} size={40} />
            </RadialMenu>
          </View>
        );
}

/* Export Component ==================================================================== */
export default KitManagementView;
