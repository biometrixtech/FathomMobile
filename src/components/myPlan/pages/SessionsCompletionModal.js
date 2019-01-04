/**
 * SessionsCompletionModal
 *
    <SessionsCompletionModal
        isModalOpen={this.state.isModalOpen}
        sessions={[]}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modalbox';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, ProgressCircle, Spacer, TabIcon, Text, } from '../../custom';

const modalText = MyPlanConstants.randomizeSessionsCompletionModalText();
const modalWidth = (AppSizes.screen.width * 0.9);
const sessionIconWidth = (modalWidth / 3);

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    linearGradientStyle: {
        alignItems:        'center',
        alignSelf:         'stretch',
        flex:              1,
        overflow:          'visible',
        paddingHorizontal: 50,
        paddingVertical:   50,
    },
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  { width: 0, height: 10 },
        shadowRadius:  15,
        shadowOpacity: 1,
    },
});

/* Component ==================================================================== */
const SessionsCompletionModal = ({
    isModalOpen,
    sessions,
}) => {
    // let progressCounter = 0;
    // _.delay(() => {
    //     for (let i = 0; i <= 1; i = i + 0.1) {
    //         // console.log(i, parseFloat(i.toFixed(1)));
    //         progressCounter = parseFloat(i.toFixed(1));
    //         console.log('progressCounter',progressCounter);
    //     }
    // }, 3000);
    return(
        <Modal
            backdropColor={AppColors.zeplin.darkNavy}
            backdropOpacity={0.8}
            backdropPressToClose={false}
            coverScreen={true}
            isOpen={isModalOpen}
            position={'top'}
            style={[AppStyles.containerCentered, { backgroundColor: AppColors.transparent, }]}
            swipeToClose={false}
        >
            <View style={[AppStyles.containerCentered, AppStyles.paddingVerticalSml, {backgroundColor: AppColors.transparent, flex: 1, width: modalWidth,}]}>
                <LinearGradient
                    colors={[AppColors.zeplin.lightNavy, AppColors.zeplin.darkBlue, AppColors.zeplin.darkNavy, AppColors.black]}
                    start={{x: 0.0, y: 0.0}}
                    end={{x: 1, y: 1}}
                    style={[styles.linearGradientStyle]}
                >
                    <View style={{flex: 1,}}>
                        <Spacer size={AppSizes.paddingXLrg} />
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: AppSizes.paddingLrg,}}>
                            {_.map(sessions, (session, i) => {
                                let selectedSession = session.sport_name || session.sport_name === 0 ?
                                    _.filter(MyPlanConstants.teamSports, ['index', session.sport_name])[0]
                                    :
                                    _.filter(MyPlanConstants.strengthConditioningTypes, ['index', session.strength_and_conditioning_type])[0];
                                return(
                                    <View key={i} style={{alignItems: 'center', width: sessionIconWidth,}}>
                                        <ProgressCircle
                                            animated={true}
                                            borderWidth={0}
                                            children={
                                                <TabIcon
                                                    color={AppColors.zeplin.yellow}
                                                    icon={selectedSession.icon}
                                                    size={AppFonts.scaleFont(60)}
                                                    type={selectedSession.iconType}
                                                />
                                            }
                                            color={AppColors.zeplin.seaBlue}
                                            indeterminate={false}
                                            progress={0.5}
                                            showsText={false}
                                            size={(sessionIconWidth - AppSizes.paddingSml)}
                                            strokeCap={'round'}
                                            textStyle={{...AppStyles.oswaldMedium, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(40),}}
                                            thickness={5}
                                            unfilledColor={AppColors.zeplin.slate}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                        <Text oswaldMedium style={{color: AppColors.white, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>{modalText.header}</Text>
                        <Text robotoRegular style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{modalText.subtext}</Text>
                        <Spacer size={AppSizes.paddingXLrg} />
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    )
};

SessionsCompletionModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    sessions:    PropTypes.array.isRequired,
};

SessionsCompletionModal.defaultProps = {};

SessionsCompletionModal.componentName = 'SessionsCompletionModal';

/* Export Component ================================================================== */
export default SessionsCompletionModal;