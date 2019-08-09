/**
 * BiomechanicsSummary
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, View, } from 'react-native';
// import { Platform, StyleSheet, TouchableOpacity, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../constants';
import { Spacer, TabIcon, Text, } from '../custom';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';

/*
  NOTE:
  types:
    1- Pie Chart
    2- Rich Data
    3- Effects of Asymmetry
    4- Searching for Insights
*/

/* Component ==================================================================== */
const BiomechanicsSummary = ({ title, type, }) => (
    <View style={{backgroundColor: AppColors.white, flex: 1,}}>

        <View style={{backgroundColor: AppColors.white, height: AppSizes.statusBarHeight,}} />

        <View>
            <TabIcon
                color={AppColors.zeplin.slateLight}
                containerStyle={[{alignSelf: 'flex-start',}]}
                icon={'chevron-left'}
                onPress={() => Actions.pop()}
                size={40}
                type={'material-community'}
            />
            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(22), textAlign: 'center',}}>{title}</Text>
            <Spacer size={AppSizes.padding} />
            { type === 4 &&
                <Image
                    resizeMode={'contain'}
                    source={require('../../../assets/images/standard/research.png')}
                    style={{alignSelf: 'center', height: 75, width: 75,}}
                />
            }
            <Spacer size={AppSizes.padding} />
        </View>

        <ScrollView
            style={{backgroundColor: AppColors.zeplin.superLight, flex: 1, paddingHorizontal: AppSizes.paddingLrg, paddingVertical: AppSizes.padding,}}
        >
            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                {'What this means:'}
            </Text>
            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                {'Patterns asymmetry in your pelvic tilt  rang of motion may hint at left-right imbalances in muscle strength and tightness along the posterior (or back) muscle chain. A single instance of pelvic asymmetry alone may not be significant, so we look for patterns over time and relationships with other movement factors, soreness, pain, and more to identify the potential root causes.\n\nYou can learn more and see the effects of asymmetry on your muscles and other tissues by tapping the "Effects of Asymmetry" card in the biomechanics section.'}
            </Text>
            <Spacer size={AppSizes.padding} />
            <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                {'How It\'s Measured:'}
            </Text>
            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>
                {'We dynamically measure the change in your anterior pelvic tilt angle from the point when your foot hits the ground through the point of toe-off. We then compare the range of motion you experience during left foot strikes to right root strikes to quantify the assymetry.'}
            </Text>
        </ScrollView>

    </View>
);

BiomechanicsSummary.propTypes = {
    title: PropTypes.string.isRequired,
    type:  PropTypes.number.isRequired,
};

BiomechanicsSummary.defaultProps = {};

BiomechanicsSummary.componentName = 'BiomechanicsSummary';

/* Export Component ================================================================== */
export default BiomechanicsSummary;