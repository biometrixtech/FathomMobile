/**
 * Loading Screen
 *
     <Loading text={'Server is down'} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Modal, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { Spacer, Text, } from '../custom';

/* Component ==================================================================== */
const Loading = ({ text, }) => (
    <Modal
        animationType={'slide'}
        transparent={true}
        visible={true}
    >
        <View
            style={{
                alignItems:      'center',
                backgroundColor: AppColors.zeplin.superLight,
                flex:            1,
                justifyContent:  'center',
                opacity:         0.8,
            }}
        >
            <ActivityIndicator
                animating
                color={AppColors.zeplin.yellow}
                size={'large'}
            />
            <Spacer size={AppSizes.padding} />
            {!!text && <Text oswaldMedium style={{color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14),}}>{text}</Text>}
        </View>
    </Modal>
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
