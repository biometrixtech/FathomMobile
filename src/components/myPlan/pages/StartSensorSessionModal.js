/**
 * StartSensorSessionModal
 *
    <StartSensorSessionModal
        createSensorSession={createSensorSession}
        isModalOpen={isStartSensorSessionModalOpen}
        onClose={() => this.setState({ isStartSensorSessionModalOpen: false, })}
        updateSensorSession={updateSensorSession}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// import third-party libraries
// import _ from 'lodash';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
// import { MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, FathomModal, TabIcon, Text, } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({

});

/* Component ==================================================================== */
class StartSensorSessionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 0,
        };
        this.timerId = null;
    }

    componentDidUpdate = prevProps => {
        if(prevProps.isModalOpen !== this.props.isModalOpen && !this.props.isMounted) {
            clearInterval(this.timerId);
            this.setState({ timer: 0, });
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.timerId);
        this.setState({ timer: 0, });
    }

    _onClose = () => {
        const { onClose, } = this.props;
        // close modal, start calculating, make getMyPlan + getSensorFiles API calls
        onClose();
    }

    _startCalibration = () => {
        this.timerId = setInterval(() => {
            let newTimerValue = parseInt((this.state.timer + 1), 10);
            this.setState({ timer: newTimerValue, });
        }, 1000);
    }

    _startOver = () => {
        const { timer, } = this.state;
        if(timer > 0 && timer < 16) {
            clearInterval(this.timerId);
            this.setState({ timer: 0, });
        } else if(timer > 16 && timer < 31) {
            // patch session_event with status as CREATE_ATTEMPT_FAILED
            // able to 'start workout' (no API call)
            // able to exit modal (no API call)
        }
    }

    render = () => {
        const { isModalOpen, } = this.props;
        const { timer, } = this.state;
        return(
            <FathomModal
                isVisible={isModalOpen}
            >
                <View style={{backgroundColor: AppColors.white, alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                    { (timer > 16) &&
                        <TabIcon
                            color={AppColors.zeplin.slateLight}
                            containerStyle={[StyleSheet.absoluteFill, {top: AppSizes.statusBarHeight > 0 ? AppSizes.statusBarHeight : AppSizes.padding, right: AppSizes.padding,}]}
                            icon={'close'}
                            onPress={() => this._onClose()}
                            size={20}
                        />
                    }
                    <Text>{`TIMER: ${this.state.timer}`}</Text>
                    <Text robotoBold style={{color: AppColors.zeplin.splashLight, fontSize: AppFonts.scaleFont(30), textAlign: 'center',}}>{'Calibrate to Start Your Workout'}</Text>
                    { (timer === 0) &&
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthTwoThirds,}}
                            containerStyle={{marginTop: AppSizes.padding, width: AppSizes.screen.widthTwoThirds,}}
                            onPress={() => this._startCalibration()}
                            raised={true}
                            title={'Start Calibration'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                        />
                    }
                    { (timer > 0 && timer < 31) &&
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.splashLight, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthThird,}}
                            containerStyle={{marginTop: AppSizes.padding, width: AppSizes.screen.widthThird,}}
                            // icon={{ color: AppColors.white, name: 'restart', size: 30, type: 'material-community', }}
                            // iconRight={true}
                            onPress={() => this._startOver()}
                            raised={true}
                            title={'Start over'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(18), width: '100%',}}
                        />
                    }
                    { (timer > 120) &&
                        <Button
                            buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingSml, width: AppSizes.screen.widthTwoThirds,}}
                            containerStyle={{marginTop: AppSizes.padding, width: AppSizes.screen.widthTwoThirds,}}
                            onPress={() => this._onClose()}
                            raised={true}
                            title={'Start Workout'}
                            titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(23), width: '100%',}}
                        />
                    }
                </View>
            </FathomModal>
        )
    }
}

StartSensorSessionModal.propTypes = {
    createSensorSession: PropTypes.func.isRequired,
    isModalOpen:         PropTypes.bool.isRequired,
    onClose:             PropTypes.func.isRequired,
    updateSensorSession: PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};

StartSensorSessionModal.defaultProps = {};

StartSensorSessionModal.componentName = 'StartSensorSessionModal';

/* Export Component ================================================================== */
export default StartSensorSessionModal;