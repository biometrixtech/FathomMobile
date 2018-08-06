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
import { Image, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles } from '../../../constants';
import { TabIcon, Text, } from '../../custom';
import { WebView } from '../../general';

/* Component ==================================================================== */
const SingleExerciseItem = ({
    exercise,
    handleCompleteExercise,
    selectedExercise,
}) => (
    <View style={{ flex: 1 }}>
        { exercise.youtubeId ?
            <WebView
                allowsInlineMediaPlayback={true}
                javaScriptEnabled={true}
                onError={e => console.log('youtube error', e)}
                scrollEnabled={false}
                style={{flex: 1, width: (AppSizes.screen.width * 0.9) - (AppSizes.paddingSml)}}
                url={exercise.youtubeId}
            />
            :
            null
        }
        <Text style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalXSml, AppStyles.textBold, AppStyles.h2]}>
            {exercise.displayName}
        </Text>
        <Text style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalXSml, AppStyles.textBold, {color: AppColors.primary.yellow.hundredPercent}]}>
            {exercise.dosage}
        </Text>
        <Text style={[AppStyles.textCenterAligned, AppStyles.paddingVerticalXSml, {color: AppColors.zeplin.darkGreyText}]} truncate={100}>
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