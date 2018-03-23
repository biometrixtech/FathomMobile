/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:35:34 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-21 13:27:06
 */

/**
 * Navbar Menu Button
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
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
        <View>
            <Icon name={'menu'} size={32} color={AppColors.primary.grey.fiftyPercent} />
        </View>
    </TouchableOpacity>
);

NavbarMenuButton.propTypes = {
    toggleSideMenu: PropTypes.func.isRequired,
};

/* Export Component ==================================================================== */
export default NavbarMenuButton;
