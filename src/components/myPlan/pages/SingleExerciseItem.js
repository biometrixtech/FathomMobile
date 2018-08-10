/**
 * SingleExerciseItem
 *
    <SingleExerciseItem
       exercise={MyPlanConstants.cleanExercise(this.state.selectedExercise)}
       handleCompleteExercise={this._handleCompleteExercise}
       selectedExercise={this.state.selectedExercise.library_id}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, } from 'react-native';

// import third-party libraries
import Video from 'react-native-video';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles } from '../../../constants';
import { TabIcon, Text, } from '../../custom';
import { Error } from '../../general';

/* Component ==================================================================== */
const SingleExerciseItem = ({
    exercise,
    handleCompleteExercise,
    selectedExercise,
}) => (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        { exercise.videoUrl.length > 0 ?
            <View style={Platform.OS === 'ios' ? {flex: 1,} : {flex: 1, paddingLeft: AppSizes.paddingMed}}>
                <Video
                    paused={false}
                    repeat={true}
                    resizeMode={Platform.OS === 'ios' ? 'none' : 'contain'}
                    source={{uri: exercise.videoUrl}}
                    style={[Platform.OS === 'ios' ? {backgroundColor: AppColors.white,} : {}, {flex: 1, width: (AppSizes.screen.width * 0.9) - (AppSizes.padding),}]}
                />
            </View>
            :
            <Error type={'URL not defined.'} />
        }
        <Text h2 oswaldMedium style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalXSml, {color: AppColors.black, fontSize: AppFonts.scaleFont(28)}]}>
            {exercise.displayName}
        </Text>
        <Text p robotoBold style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalXSml, {color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(15)}]}>
            {exercise.dosage}
        </Text>
        <Text h6 robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalXSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15)}]} truncate={100}>
            {exercise.description}
        </Text>
        <TabIcon
            containerStyle={[{alignSelf: 'center'}]}
            icon={'check'}
            iconStyle={[{color: AppColors.primary.yellow.hundredPercent}]}
            onPress={() => handleCompleteExercise(selectedExercise)}
            reverse={false}
            size={34}
            type={'material-community'}
        />
    </View>
);

SingleExerciseItem.propTypes = {
    exercise:               PropTypes.object.isRequired,
    handleCompleteExercise: PropTypes.func.isRequired,
    selectedExercise:       PropTypes.string.isRequired,
};
SingleExerciseItem.defaultProps = {};
SingleExerciseItem.componentName = 'SingleExerciseItem';

/* Export Component ================================================================== */
export default SingleExerciseItem;