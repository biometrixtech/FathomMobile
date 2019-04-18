/**
 * Priority SlideUpPanel
 *
    <PrioritySlideUpPanel
        changeSelectedPriority={this._changeSelectedPriority}
        isRecover={true}
        isSlideUpPanelOpen={this.state.isPrioritySlideUpPanelOpen}
        selectedPriority={this.state.recoverSelectedPriority}
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
class PrioritySlideUpPanel extends Component {
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
        const { changeSelectedPriority, isRecover, isSlideUpPanelOpen, selectedPriority, toggleSlideUpPanel, } = this.props;
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
                            <Text oswaldMedium style={{color: AppColors.zeplin.darkBlue, fontSize: AppFonts.scaleFont(25), textAlign: 'center',}}>{'SELECT EXERCISE PRIORITY'}</Text>
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
                                    dataSource={MyPlanConstants.selectedPriorities()}
                                    highlightBorderWidth={2}
                                    highlightColor={AppColors.zeplin.seaBlue}
                                    itemColor={AppColors.zeplin.light}
                                    itemHeight={AppFonts.scaleFont(18) + AppSizes.padding}
                                    scrollEnabled={true}
                                    selectedIndex={(selectedPriority - 1)}
                                    onValueChange={(data, selectedIndex) => changeSelectedPriority(selectedIndex)}
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

PrioritySlideUpPanel.propTypes = {
    changeSelectedPriority: PropTypes.func.isRequired,
    isRecover:              PropTypes.bool,
    isSlideUpPanelOpen:     PropTypes.bool.isRequired,
    selectedPriority:       PropTypes.number.isRequired,
    toggleSlideUpPanel:     PropTypes.func.isRequired,
};

PrioritySlideUpPanel.defaultProps = {
    isRecover: false,
};

PrioritySlideUpPanel.componentName = 'PrioritySlideUpPanel';

/* Export Component ================================================================== */
export default PrioritySlideUpPanel;