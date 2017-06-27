/**
 * Navbar Menu Button
 */
import React, { PropTypes } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

// Consts and Libs
import { AppColors } from '@theme/';

/* Component ==================================================================== */
const NavbarMenuButton = ({ toggleSideMenu }) => (
  <TouchableOpacity
    onPress={toggleSideMenu}
    activeOpacity={0.7}
    style={{ top: 2 }}
    hitSlop={{ top: 7, right: 7, bottom: 7, left: 7 }}
  >
    <Icon name={'menu'} size={32} color={AppColors.brand.primary} />
  </TouchableOpacity>
);

NavbarMenuButton.propTypes = {
    toggleSideMenu: PropTypes.func.isRequired,
};

/* Export Component ==================================================================== */
export default NavbarMenuButton;
