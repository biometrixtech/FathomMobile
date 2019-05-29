/**
 * Tabbar Icon
 *
    <TabIcon
        icon={'search'}
        onPress={this._openLink}
        selected={false}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

import { AppColors } from '../../constants';

/* Component ==================================================================== */
const TabIcon = ({
    color,
    containerStyle,
    icon,
    iconStyle,
    onPress,
    raised,
    reverse,
    selected,
    size,
    type,
    underlayColor,
}) => (
    <Icon
        color={color ? color : selected ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLightSlate}
        containerStyle={containerStyle ? containerStyle : {}}
        iconStyle={iconStyle ? iconStyle : {}}
        name={icon}
        onPress={onPress}
        raised={raised}
        reverse={reverse}
        size={size}
        type={type}
        underlayColor={underlayColor}
    />
);

TabIcon.propTypes = {
    color:          PropTypes.string,
    containerStyle: PropTypes.array,
    icon:           PropTypes.string.isRequired,
    iconStyle:      PropTypes.array,
    onPress:        PropTypes.func,
    raised:         PropTypes.bool,
    reverse:        PropTypes.bool,
    selected:       PropTypes.bool,
    size:           PropTypes.number,
    type:           PropTypes.string,
    underlayColor:  PropTypes.string,
};
TabIcon.defaultProps = {
    color:          null,
    containerStyle: null,
    icon:           'search',
    iconStyle:      null,
    onPress:        null,
    raised:         false,
    reverse:        false,
    selected:       false,
    size:           26,
    type:           'material',
    underlayColor:  'transparent',
};

/* Export Component ==================================================================== */
export default TabIcon;
