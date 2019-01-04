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
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, } from 'react-native';

// import third-party libraries
import Modal from 'react-native-modalbox';
import SlidingUpPanel from 'rn-sliding-up-panel';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../../../constants';
import { Button, Spacer, Text, WheelScrollPicker, } from '../../custom';

/* Component ==================================================================== */
const ActiveTimeSlideUpPanel = ({
    changeSelectedActiveTime,
    isRecover,
    isSlideUpPanelOpen,
    selectedActiveTime,
    toggleSlideUpPanel,
}) => (
    <Modal
        backdropColor={AppColors.zeplin.darkNavy}
        backdropOpacity={0.8}
        backdropPressToClose={false}
        coverScreen={true}
        isOpen={isSlideUpPanelOpen}
        style={{backgroundColor: AppColors.transparent,}}
        swipeToClose={false}
    >
        <SlidingUpPanel
            allowDragging={false}
            showBackdrop={false}
            startCollapsed={false}
            visible={isSlideUpPanelOpen}
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
                            activeItemColor={AppColors.white}
                            activeItemHighlight={AppColors.zeplin.seaBlue}
                            dataSource={[' ', ' ', ' ', ' ']}
                            highlightBorderWidth={2}
                            highlightColor={AppColors.zeplin.seaBlue}
                            itemColor={AppColors.zeplin.lightSlate}
                            itemHeight={AppFonts.scaleFont(18) + AppSizes.paddingSml}
                            scrollEnabled={false}
                            selectedIndex={1}
                            onValueChange={(data, selectedIndex) => null}
                            wrapperBackground={AppColors.transparent}
                            wrapperFlex={1}
                            wrapperHeight={180}
                        />
                        <WheelScrollPicker
                            activeItemColor={AppColors.white}
                            activeItemHighlight={AppColors.zeplin.seaBlue}
                            dataSource={MyPlanConstants.selectedActiveTimes().timeLabels}
                            highlightBorderWidth={2}
                            highlightColor={AppColors.zeplin.seaBlue}
                            itemColor={AppColors.zeplin.lightSlate}
                            itemHeight={AppFonts.scaleFont(18) + AppSizes.paddingSml}
                            scrollEnabled={true}
                            selectedIndex={selectedActiveTime}
                            onValueChange={(data, selectedIndex) => changeSelectedActiveTime(selectedIndex)}
                            wrapperBackground={AppColors.transparent}
                            wrapperFlex={4}
                            wrapperHeight={180}
                        />
                        <WheelScrollPicker
                            activeItemColor={AppColors.white}
                            activeItemFontOpacity={0.5}
                            activeItemFontSize={AppFonts.scaleFont(15)}
                            activeItemHighlight={AppColors.zeplin.seaBlue}
                            dataSource={MyPlanConstants.selectedActiveTimes().recommendedLabels}
                            highlightBorderWidth={2}
                            highlightColor={AppColors.zeplin.seaBlue}
                            itemColor={AppColors.zeplin.lightSlate}
                            itemHeight={AppFonts.scaleFont(18) + AppSizes.paddingSml}
                            scrollEnabled={false}
                            selectedIndex={selectedActiveTime}
                            onValueChange={(data, selectedIndex) => null}
                            wrapperBackground={AppColors.transparent}
                            wrapperFlex={4}
                            wrapperHeight={180}
                        />
                        <WheelScrollPicker
                            activeItemColor={AppColors.white}
                            activeItemHighlight={AppColors.zeplin.seaBlue}
                            dataSource={[' ', ' ', ' ', ' ']}
                            highlightBorderWidth={2}
                            highlightColor={AppColors.zeplin.seaBlue}
                            itemColor={AppColors.zeplin.lightSlate}
                            itemHeight={AppFonts.scaleFont(18) + AppSizes.paddingSml}
                            scrollEnabled={false}
                            selectedIndex={1}
                            onValueChange={(data, selectedIndex) => null}
                            wrapperBackground={AppColors.transparent}
                            wrapperFlex={1}
                            wrapperHeight={180}
                        />
                    </View>
                    <Button
                        backgroundColor={AppColors.zeplin.yellow}
                        color={AppColors.white}
                        containerViewStyle={{alignSelf: 'flex-end', width: '30%',}}
                        fontFamily={AppStyles.robotoMedium.fontFamily}
                        fontWeight={AppStyles.robotoMedium.fontWeight}
                        onPress={() => toggleSlideUpPanel()}
                        raised={false}
                        textStyle={{ flex: 1, fontSize: AppFonts.scaleFont(15), textAlign: 'center', }}
                        title={'Confirm'}
                    />
                </View>
                <Spacer size={Platform.OS === 'ios' ? 0 : 30} />
            </View>
        </SlidingUpPanel>
    </Modal>
);

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