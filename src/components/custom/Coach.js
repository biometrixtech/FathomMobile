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
 import { Image, StyleSheet, View } from 'react-native';

// import third-parties libraries
import LinearGradient from 'react-native-linear-gradient';

// Consts
import { AppColors, AppFonts, AppStyles, } from '../../constants';
import { Text, } from './';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    coachText: {
        color:    AppColors.white,
        flex:     1,
        flexWrap: 'wrap',
        fontSize: AppFonts.scaleFont(16),
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
const Coach = ({ text }) => {
    text = Array.isArray(text) && text.length > 0 ? text.join('\n') : text;
    return(
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
            <Text robotoRegular style={[styles.coachText]}>{text}</Text>
        </LinearGradient>
    )
}

Coach.propTypes = {
    text: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]).isRequired,
};
Coach.defaultProps = {};

/* Export Component ==================================================================== */
export default Coach;
