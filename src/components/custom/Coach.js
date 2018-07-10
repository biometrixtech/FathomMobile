/**
 * Coach
 *
    <Coach
        text={section.subtitle}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';

// Consts
import { AppColors, AppStyles } from '../../constants/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    coachText: {
        color:    AppColors.white,
        flex:     1,
        flexWrap: 'wrap'
    },
    coachWrapper: {
        backgroundColor: AppColors.primary.grey.thirtyPercent,
        borderRadius:    5,
        flexDirection:   'row',
        marginBottom:    5,
        padding:         20,
    },
    imageStyle: {
        height:      70,
        marginRight: 10,
        width:       40,
    }
});

/* Component ==================================================================== */
const Coach = ({ text }) => (
    <View style={[AppStyles.containerCentered, styles.coachWrapper]}>
        <Image
            source={require('../../constants/assets/images/coach-avatar.png')}
            style={[styles.imageStyle]}
        />
        <Text style={[styles.coachText]}>{text}</Text>
    </View>
);

Coach.propTypes = {
    text: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]).isRequired,
};
Coach.defaultProps = {};

/* Export Component ==================================================================== */
export default Coach;
