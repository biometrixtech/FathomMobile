/**
 * Loading Screen
 *
     <Loading text={'Server is down'} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { FathomModal, Spacer, Text, } from '../custom';

/* Component ==================================================================== */
const Loading = ({ text, }) => (
    <FathomModal
        isVisible={true}
    >
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
            <ActivityIndicator
                animating
                color={AppColors.zeplin.yellow}
                size={'large'}
            />
            <Spacer size={AppSizes.padding} />
            {!!text && <Text oswaldMedium style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14),}}>{text}</Text>}
        </View>
    </FathomModal>
);

Loading.propTypes = {
    text: PropTypes.string,
};

Loading.defaultProps = {
    text: null,
};

Loading.componentName = 'Loading';

/* Export Component ==================================================================== */
export default Loading;
