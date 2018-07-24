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

// import third-parties libraries
import LinearGradient from 'react-native-linear-gradient';

// Consts
import { AppColors, AppStyles } from '../../constants';

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
        marginRight: 10,
        width:       20,
    }
});

/* Component ==================================================================== */
const Coach = ({ text }) => (
    // Diagonal gradient from bottom left to top right
    <LinearGradient
        colors={[AppColors.gradient.blue.gradientStart, AppColors.gradient.blue.gradientEnd]}
        end={{x: 1, y: 0}}
        start={{x: 0, y: 1}}
        style={[AppStyles.containerCentered, styles.coachWrapper]}
    >
        <Image
            maintainAspectRatio={true}
            resizeMode={'contain'}
            source={require('../../../assets/images/standard/coach-avatar.png')}
            style={[styles.imageStyle]}
        />
        <Text p style={[styles.coachText]}>{text}</Text>
    </LinearGradient>
);

Coach.propTypes = {
    text: PropTypes.string.isRequired,
};
Coach.defaultProps = {};

/* Export Component ==================================================================== */
export default Coach;
