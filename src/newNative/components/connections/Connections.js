/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 15:49:27 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 22:28:52
 */

/**
 * Connections View
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Consts and Libs
import { AppColors } from '../../../constants/';

// Components
import { View } from 'react-native';
import { ListItem } from '../custom/';


/* Component ==================================================================== */
class Connections extends Component {
    static propTypes = {
        userSelect: PropTypes.func.isRequired,
        user:       PropTypes.shape({}),
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {};
    }

    render = () => (
        <View style={{ backgroundColor: AppColors.white }} >
            {
                this.props.user.users.map((user, userIndex) =>
                    <ListItem
                        key={userIndex}
                        onPress={() => this.props.userSelect(userIndex)}
                        hideChevron
                        containerStyle={{ backgroundColor: this.props.user.userIndex === userIndex ? AppColors.primary.grey.hundredPercent : null }}
                        titleStyle={{ color: this.props.user.userIndex === userIndex ? 'white' : null }}
                        title={`${user.first_name} ${user.last_name}`}
                    />
                )
            }
        </View>
    );
}

/* Export Component ==================================================================== */
export default Connections;
