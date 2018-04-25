/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:30:36 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-12 00:59:11
 */

/**
 * Text
 *
     <Text h1>Hello World</Text>
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

// Consts and Libs
import { AppStyles } from '../../theme/';

/* Component ==================================================================== */
class CustomText extends Component {
    static propTypes = {
        h0:      PropTypes.bool,
        h1:      PropTypes.bool,
        h2:      PropTypes.bool,
        h3:      PropTypes.bool,
        h4:      PropTypes.bool,
        h5:      PropTypes.bool,
        h6:      PropTypes.bool,
        h7:      PropTypes.bool,
        p:       PropTypes.bool,
        onPress: PropTypes.func,
        style:   PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        children: PropTypes.node,
    }

    static defaultProps = {
        h0:       false,
        h1:       false,
        h2:       false,
        h3:       false,
        h4:       false,
        h5:       false,
        h6:       false,
        h7:       false,
        p:        false,
        onPress:  null,
        style:    null,
        children: null,
    }

    textProps = () => {
        // Defaults
        const props = {
            ...this.props,
            style: [AppStyles.baseText],
        };

        if (this.props.p)  { props.style = [AppStyles.p];  }
        if (this.props.h0) { props.style = [AppStyles.h0]; }
        if (this.props.h1) { props.style = [AppStyles.h1]; }
        if (this.props.h2) { props.style = [AppStyles.h2]; }
        if (this.props.h3) { props.style = [AppStyles.h3]; }
        if (this.props.h4) { props.style = [AppStyles.h4]; }
        if (this.props.h5) { props.style = [AppStyles.h5]; }
        if (this.props.h6) { props.style = [AppStyles.h6]; }
        if (this.props.h7) { props.style = [AppStyles.h7]; }
        if (this.props.onPress) { props.style.push(AppStyles.link); }

        if (this.props.style) {
            props.style.push(this.props.style);
        }

        return props;
    }

    render = () => <Text {...this.textProps()}>{this.props.children}</Text>;
}

/* Export Component ==================================================================== */
export default CustomText;
