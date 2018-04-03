/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:35:34 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-02 23:09:40
 */

/**
 * Navbar Menu Button
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

// Consts and Libs
import { AppColors } from '@theme/';

/* Component ==================================================================== */
const NavbarMenuButton = ({ toggleSideMenu }) => (
    <TouchableOpacity
        onPress={toggleSideMenu}
        activeOpacity={0.7}
        style={{ height: 28 }}
    >
        <Icon
            name={'menu'}
            size={32}
            onPress={toggleSideMenu}
            color={AppColors.primary.grey.fiftyPercent}
        />
    </TouchableOpacity>
);

NavbarMenuButton.propTypes = {
    toggleSideMenu: PropTypes.func.isRequired,
};

/* Export Component ==================================================================== */
export default NavbarMenuButton;
