/**
 * Active Time SlideUpPanel
 *
    <ActiveTimeSlideUpPanel
        changeSelectedActiveTime={this._changeSelectedActiveTime}
        isRecover={true}
        isSlideUpPanelOpen={this.state.isPrepareSlideUpPanelOpen}
        selectedActiveTime={this.state.recoverSelectedActiveTime}
        toggleSlideUpPanel={() => this._togglePrepareSlideUpPanel()}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import SlidingUpPanel from 'rn-sliding-up-panel';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, FathomModal, Text, WheelScrollPicker, } from '../../custom';

/* Component ==================================================================== */
class ActiveTimeSlideUpPanel extends Component {
    constructor(props) {
        super(props);
        this._panel = {};
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevProps.isSlideUpPanelOpen !== this.props.isSlideUpPanelOpen && this.props.isSlideUpPanelOpen) {
            _.delay(() => this._panel.show(), 500);
        }
    }

    render = () => {
        const { changeSelectedActiveTime, isRecover, isSlideUpPanelOpen, selectedActiveTime, toggleSlideUpPanel, } = this.props;
        /*eslint no-return-assign: 0*/
        return(
            <FathomModal
                isVisible={isSlideUpPanelOpen}
                style={{margin: 0,}}
            >
                <SlidingUpPanel
                    allowDragging={false}
                    ref={ref => this._panel = ref}
                    showBackdrop={false}
                >
                    <View style={{flex: 1, flexDirection: 'column',}}>
                        <View style={{flex: 1,}} />
                        <View style={{backgroundColor: AppColors.zeplin.superLight, paddingVertical: AppSizes.paddingSml,}}>
                            <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>{'SELECT ACTIVE TIME'}</Text>
                        </View>
                        <View style={{backgroundColor: AppColors.white, flex: 1, paddingVertical: AppSizes.padding,}}>
                            <Text robotoRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(15), textAlign: 'center', paddingHorizontal: AppSizes.paddingXLrg,}}>{`Please select how long you want your ${isRecover ? 'Active Recovery': 'Mobilize'} session to last.`}</Text>
                            <View style={{flex: 1, flexDirection: 'row', marginVertical: 0,}}>
                                <WheelScrollPicker
                                    activeItemColor={AppColors.zeplin.light}
                                    activeItemHighlight={AppColors.zeplin.seaBlue}
                                    dataSource={[' ', ' ', ' ', ' ', ' ', ' ']}
                                    highlightBorderWidth={2}
                                    highlightColor={AppColors.zeplin.seaBlue}
                                    itemColor={AppColors.zeplin.light}
                                    itemHeight={AppFonts.scaleFont(18) + AppSizes.padding}
                                    scrollEnabled={false}
                                    selectedIndex={1}
                                    onValueChange={(data, selectedIndex) => null}
                                    wrapperBackground={AppColors.transparent}
                                    wrapperFlex={2}
                                    wrapperHeight={180}
                                />
                                <WheelScrollPicker
                                    activeItemColor={AppColors.zeplin.light}
                                    activeItemHighlight={AppColors.zeplin.seaBlue}
                                    addRecommendedTextAtIndex={2}
                                    dataSource={MyPlanConstants.selectedActiveTimes().timeLabels}
                                    highlightBorderWidth={2}
                                    highlightColor={AppColors.zeplin.seaBlue}
                                    itemColor={AppColors.zeplin.light}
                                    itemHeight={AppFonts.scaleFont(18) + AppSizes.padding}
                                    scrollEnabled={true}
                                    selectedIndex={selectedActiveTime}
                                    onValueChange={(data, selectedIndex) => changeSelectedActiveTime(selectedIndex)}
                                    wrapperBackground={AppColors.transparent}
                                    wrapperFlex={6}
                                    wrapperHeight={180}
                                />
                                <WheelScrollPicker
                                    activeItemColor={AppColors.zeplin.light}
                                    activeItemHighlight={AppColors.zeplin.seaBlue}
                                    dataSource={[' ', ' ', ' ', ' ', ' ', ' ']}
                                    highlightBorderWidth={2}
                                    highlightColor={AppColors.zeplin.seaBlue}
                                    itemColor={AppColors.zeplin.light}
                                    itemHeight={AppFonts.scaleFont(18) + AppSizes.padding}
                                    scrollEnabled={false}
                                    selectedIndex={1}
                                    onValueChange={(data, selectedIndex) => null}
                                    wrapperBackground={AppColors.transparent}
                                    wrapperFlex={2}
                                    wrapperHeight={180}
                                />
                            </View>
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow,}}
                                containerStyle={{alignSelf: 'flex-end', marginRight: 10, width: '30%',}}
                                onPress={() => toggleSlideUpPanel()}
                                title={'Confirm'}
                                titleStyle={{color: AppColors.white, flex: 1, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}
                            />
                        </View>
                    </View>
                </SlidingUpPanel>
            </FathomModal>
        )
    }
}

ActiveTimeSlideUpPanel.propTypes = {
    changeSelectedActiveTime: PropTypes.func.isRequired,
    isRecover:                PropTypes.bool,
    isSlideUpPanelOpen:       PropTypes.bool.isRequired,
    selectedActiveTime:       PropTypes.number.isRequired,
    toggleSlideUpPanel:       PropTypes.func.isRequired,
};

ActiveTimeSlideUpPanel.defaultProps = {
    isRecover: false,
};

ActiveTimeSlideUpPanel.componentName = 'ActiveTimeSlideUpPanel';

/* Export Component ================================================================== */
export default ActiveTimeSlideUpPanel;