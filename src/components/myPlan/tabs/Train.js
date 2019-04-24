/**
 * Train
 *
    <Train

    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, RefreshControl, ScrollView, StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LottieView from 'lottie-react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, ErrorMessages, MyPlan as MyPlanConstants, } from '../../../constants';
import { AppUtil, PlanLogic, } from '../../../lib';
import { store } from '../../../store';
import { FathomModal, ListItem, Spacer, TabIcon, Text, } from '../../custom';
import {
    ActiveRecoveryBlocks,
    ActiveTimeSlideUpPanel,
    DefaultListGap,
    Exercises,
    ExerciseCompletionModal,
    PrioritySlideUpPanel,
    ReadinessSurvey,
    SessionsCompletionModal,
} from '../pages';

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
});

/* Component ==================================================================== */
const Train = ({
}) => (
    <View></View>
);

Train.propTypes = {
};

Train.defaultProps = {};

Train.componentName = 'Train';

/* Export Component ================================================================== */
export default Train;