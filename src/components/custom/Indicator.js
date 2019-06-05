/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 15:00:54
 * @Last Modified by:   Vir Desai
 * @Last Modified time: 2018-04-23 15:00:54
 */

import PropTypes from 'prop-types';
import React, { PureComponent, } from 'react';
import { View, Animated, ViewPropTypes, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex:           1,
        justifyContent: 'center',
        margin:         4,
    },

    dot: {
        backgroundColor: 'white',
        borderRadius:    4,
        width:           8,
        height:          8,
        margin:          4,
    },
})

export default class Indicator extends PureComponent {
    static propTypes = {
        indicatorColor:    PropTypes.string.isRequired,
        indicatorOpacity:  PropTypes.number.isRequired,
        indicatorPosition: PropTypes.oneOf([
            'top',
            'right',
            'bottom',
            'left',
        ]).isRequired,
        pages:    PropTypes.number.isRequired,
        progress: PropTypes.instanceOf(Animated.Value),
        style:    ViewPropTypes.style,
    };

    static defaultProps = {
        progress: new Animated.Value(0),
    }

    render() {
        let {
            pages,
            progress,
            indicatorColor: backgroundColor,
            indicatorOpacity,
            indicatorPosition,
            style,
            ...props
        } = this.props;

        let dots = Array.from(new Array(pages), (page, index) => {
            let opacity = progress
                .interpolate({
                    inputRange: [
                        -Infinity,
                        index - 1,
                        index,
                        index + 1,
                        Infinity,
                    ],
                    outputRange: [
                        indicatorOpacity,
                        indicatorOpacity,
                        1.0,
                        indicatorOpacity,
                        indicatorOpacity,
                    ],
                });

            let animatedStyle = { opacity, backgroundColor };

            return (
                <Animated.View style={[styles.dot, animatedStyle]} key={index} />
            );
        });

        let flexDirection = /^(top|bottom)$/
            .test(indicatorPosition)?
            'row':
            'column';

        return (
            <View style={[styles.container, { flexDirection }, style]} {...props}>
                {dots}
            </View>
        );
    }
}