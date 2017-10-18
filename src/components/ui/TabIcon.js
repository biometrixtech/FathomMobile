/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:30:20 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-17 20:14:15
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

import { AppColors } from '@theme/';

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
