/**
 * LoadingState
 *
    <LoadingState
        apiIndex={this.state.apiIndex}
        isModalOpen={isPageCalculating}
        onClose={() => this.setState({ isPageCalculating: false, })}
    />
 *
 */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// Components
import { AnimatedProgressBar, FathomModal, Text, } from '../../custom';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { PlanLogic, } from '../../../lib';

// import third-party libraries
import _ from 'lodash';
import LottieView from 'lottie-react-native';

/* Data ==================================================================== */
const rsData = [
    { progress: 0, text: 'Updating your history', time: 300, },
    { progress: 33, text: 'Updating your history', time: 1000, },
    { progress: 33, text: 'Estimating your recovery needs', time: 1300, },
    { progress: 66, text: 'Estimating your recovery needs', time: 2000, },
    { progress: 66, text: 'Creating your plan', time: 2100, },
    { isFinalStep: true, progress: 100, text: 'Your Plan is ready!', time: null, },
];
const pssData = [
    { progress: 0, text: 'Updating your history', time: 300, },
    { progress: 25, text: 'Updating your history', time: 1000, },
    { progress: 25, text: 'Calculating your training load', time: 1300, },
    { progress: 50, text: 'Calculating your training load', time: 2000, },
    { progress: 50, text: 'Estimating your recovery needs', time: 2300, },
    { progress: 75, text: 'Estimating your recovery needs', time: 3000, },
    { progress: 75, text: 'Creating your plan', time: 3100, },
    { isFinalStep: true, progress: 100, text: 'All done!', time: null, },
];
const sensorData = [
    { progress: 0, text: 'Updating your movement profile', time: 300, },
    { progress: 25, text: 'Updating your movement profile', time: 1000, },
    { progress: 25, text: 'Analyzing your prevention needs', time: 1300, },
    { progress: 50, text: 'Analyzing your prevention needs', time: 2000, },
    { progress: 50, text: 'Projecting your recovery timeline', time: 2300, },
    { progress: 75, text: 'Projecting your recovery timeline', time: 3000, },
    { progress: 75, text: 'Creating your plan', time: 3100, },
    { isFinalStep: true, progress: 100, text: 'Your Plan is ready!', time: null, },
];

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    animationWrapper: {
        alignSelf:      'center',
        height:         250,
        justifyContent: 'center',
        width:          250,
    },
    progressBarWrapper: {
        alignItems:     'center',
        justifyContent: 'center',
        marginTop:      AppSizes.paddingLrg,
    },
    text: {
        color:     AppColors.zeplin.slateLight,
        fontSize:  AppFonts.scaleFont(30),
        textAlign: 'center',
    },
    textWrapper: {
        alignItems:     'center',
        height:         AppFonts.scaleFont(75),
        justifyContent: 'center',
        marginTop:      AppSizes.paddingLrg,
    },
    wrapper: {
        alignItems:        'center',
        backgroundColor:   `${AppColors.white}${PlanLogic.returnHexOpacity(0.95)}`,
        flex:              1,
        justifyContent:    'center',
        paddingHorizontal: AppSizes.paddingXLrg,
    },
});

/* Component ==================================================================== */
class LoadingState extends PureComponent {
    constructor(props) {
        super(props);
        let data = props.apiIndex === 0 ? rsData : props.apiIndex === 1 ?  pssData : sensorData;
        this.state = {
            isModalOpen: false,
            progress:    0,
            text:        data[0].text,
            timer:       0,
        };
        this.timerId = null;
    }

    componentDidUpdate = prevProps => {
        let data = this.props.apiIndex === 0 ? rsData : this.props.apiIndex === 1 ?  pssData : sensorData;
        if(
            (prevProps.isModalOpen !== this.props.isModalOpen && this.props.isModalOpen) ||
            (prevProps.apiIndex !== this.props.apiIndex && this.props.apiIndex && this.props.apiIndex >= 0)
        ) {
            this.timerId = _.delay(() => this.setState(
                { isModalOpen: true, progress: 0, text: data[0].text, timer: 0, },
                () => {
                    this.timerId = _.delay(() => this._triggerStartTimer(), 500);
                }
            ), 800);
        } else if((prevProps.isModalOpen !== this.props.isModalOpen && !this.props.isModalOpen)) {
            let filteredData = _.find(data, d => d.isFinalStep);
            let newProgressValue = filteredData ? parseInt(filteredData.progress, 10) : false;
            clearInterval(this.timerId);
            this.setState(
                {
                    progress: newProgressValue || this.state.progress,
                    text:     filteredData ? filteredData.text : this.state.text,
                },
                () => {
                    this.timerId = _.delay(() => this.setState({ isModalOpen: false, }, () => this.props.onClose()), 1100);
                }
            );
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.timerId);
    }

    _triggerStartTimer = () => {
        this.timerId = setInterval(() => {
            if(this.state.progress < 100) {
                let newTimerValue = parseInt((this.state.timer + 100), 10);
                let data = this.props.apiIndex === 0 ? rsData : this.props.apiIndex === 1 ?  pssData : sensorData;
                let filteredData = _.find(data, d => d.time && d.time === newTimerValue);
                let newProgressValue = filteredData ? parseInt(filteredData.progress, 10) : false;
                this.setState({
                    progress: newProgressValue || this.state.progress,
                    text:     filteredData ? filteredData.text : this.state.text,
                    timer:    newTimerValue,
                });
            } else {
                clearInterval(this.timerId);
            }
        }, 100);
    }

    render = () => {
        const { isModalOpen, progress, text, } = this.state;
        return (
            <FathomModal
                hasBackdrop={false}
                isVisible={isModalOpen}
            >
                <View style={[styles.wrapper,]}>
                    <LottieView
                        autoPlay={true}
                        loop={true}
                        progress={1}
                        source={require('../../../../assets/animation/running-man.json')}
                        style={[styles.animationWrapper,]}
                    />
                    <View style={[styles.textWrapper,]}>
                        <Text
                            robotoRegular
                            style={[styles.text,]}
                        >
                            {text}
                        </Text>
                    </View>
                    <View style={[styles.progressBarWrapper,]}>
                        <AnimatedProgressBar
                            backgroundColor={AppColors.zeplin.splashLight}
                            barAnimationDuration={1000}
                            borderColor={AppColors.zeplin.superLight}
                            borderRadius={100}
                            maxValue={100}
                            value={progress}
                            width={AppSizes.screen.widthTwoThirds}
                            wrapperBackgroundColor={AppColors.zeplin.superLight}
                        />
                    </View>
                </View>
            </FathomModal>
        );
    }

}

LoadingState.propTypes = {
    apiIndex:    PropTypes.number,
    isModalOpen: PropTypes.bool.isRequired,
    onClose:     PropTypes.func.isRequired,
};

LoadingState.defaultProps = {
    apiIndex: 0,
};

LoadingState.componentName = 'LoadingState';

/* Export Component ================================================================== */
export default LoadingState;
