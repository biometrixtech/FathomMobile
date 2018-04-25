/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:30:20 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 16:56:50
 */

/**
 * Tabbar Icon
 *
    <TabIcon icon={'search'} selected={false} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

import { AppColors } from '../../../constants/';

/* Component ==================================================================== */
const TabIcon = ({ icon, selected }) => (
    <Icon
        name={icon}
        size={26}
        color={selected ? AppColors.tabbar.iconSelected : AppColors.tabbar.iconDefault}
    />
);

TabIcon.propTypes = { icon: PropTypes.string.isRequired, selected: PropTypes.bool };
TabIcon.defaultProps = { icon: 'search', selected: false };

/* Export Component ==================================================================== */
export default TabIcon;
