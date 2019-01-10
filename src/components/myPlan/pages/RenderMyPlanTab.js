/**
 * RenderMyPlanTab
 *
    <RenderMyPlanTab
        isPostSessionSurveyModalOpen={this.state.isPostSessionSurveyModalOpen}
        isReadinessSurveyModalOpen={this.state.isReadinessSurveyModalOpen}
        isTabActive={isTabActive}
        key={`${name}_${page}`}
        loading={this.state.loading}
        name={name}
        onLayoutHandler={onLayoutHandler}
        onPressHandler={onPressHandler}
        page={page}
        plan={this.props.plan}
        statePages={{
            page0: this.state.page0,
            page1: this.state.page1,
            page2: this.state.page2,
        }}
        subtitle={subtitle}
        tabView={this.tabView}
        updatePageState={(page0, page1, page2) =>
            this.setState({
                page0,
                page1,
                page2,
            })
        }
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { TabIcon, Text, } from '../../custom';

/* Component ==================================================================== */
const RenderMyPlanTab = ({
    isPostSessionSurveyModalOpen,
    isReadinessSurveyModalOpen,
    isTabActive,
    loading,
    name,
    onLayoutHandler,
    onPressHandler,
    page,
    plan,
    statePages,
    subtitle,
    tabView,
    updatePageState,
}) => {
    let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
    isTabActive = isTabActive;
    const textStyle = AppStyles.tabHeaders;
    const fontSize = isTabActive ? AppFonts.scaleFont(20) : AppFonts.scaleFont(16);
    let { page0, page1, page2 } = statePages;
    let flag = dailyPlanObj && page === dailyPlanObj.nav_bar_indicator ? true : false;
    let currentPage = tabView ? tabView.state.currentPage : 0;
    let page0Width = currentPage === 0 ? AppSizes.screen.widthThreeQuarters : currentPage === 1 ? AppSizes.screen.widthQuarter : 0;
    let page1Width = currentPage === 0 || currentPage === 2 ? AppSizes.screen.widthQuarter : AppSizes.screen.widthHalf;
    let page2Width = currentPage === 2 ? AppSizes.screen.widthThreeQuarters : currentPage === 1 ? AppSizes.screen.widthQuarter : 0;
    let page0ExtraStyles = currentPage === 0 ? {paddingLeft: AppSizes.screen.widthQuarter} : {};
    let page1ExtraStyles = {};
    let page2ExtraStyles = currentPage === 2 ? {paddingRight: AppSizes.screen.widthQuarter} : {};
    let page0Styles = [AppStyles.leftTabBar, page0ExtraStyles, {width: page0Width,}];
    let page1Styles = [AppStyles.centerTabBar, page1ExtraStyles, {width: page1Width,}];
    let page2Styles = [AppStyles.rightTabBar, page2ExtraStyles, {width: page2Width,}];
    let textBorderWidth = 4;
    let iconSize = 10;
    let iconLeftPadding = 2;
    let iconBottomPadding = textBorderWidth;
    let extraIconContainerStyle = isTabActive ?
        {
            marginBottom: iconBottomPadding,
        }
        :
        {};
    // making sure we can only drag horizontally if our modals are closed and nothing is loading
    let isScrollLocked = !isReadinessSurveyModalOpen && !isPostSessionSurveyModalOpen && !loading ? false : true;
    return(
        <TouchableWithoutFeedback
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => isScrollLocked ? null : onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={[page === 0 ? page0Styles : page === 1 ? page1Styles : page2Styles]}>
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                    <View>
                        <Text
                            oswaldMedium
                            onLayout={event =>
                                updatePageState(page === 0 ? event.nativeEvent.layout : page0, page === 1 ? event.nativeEvent.layout : page1, page === 2 ? event.nativeEvent.layout : page2)
                            }
                            style={[
                                textStyle,
                                {
                                    color: isTabActive ? AppColors.zeplin.darkNavy : AppColors.zeplin.lightSlate,
                                    fontSize,
                                }
                            ]}
                        >
                            {name}
                        </Text>
                    </View>
                    {
                        flag ?
                            <TabIcon
                                containerStyle={[AppStyles.indicatorContainerStyles, extraIconContainerStyle, {paddingLeft: iconLeftPadding,}]}
                                size={iconSize}
                                selected
                                color={AppColors.primary.yellow.hundredPercent}
                                icon={'fiber-manual-record'}
                            />
                            :
                            null
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

RenderMyPlanTab.propTypes = {
    isPostSessionSurveyModalOpen: PropTypes.bool.isRequired,
    isReadinessSurveyModalOpen:   PropTypes.bool.isRequired,
    isTabActive:                  PropTypes.bool.isRequired,
    loading:                      PropTypes.bool.isRequired,
    name:                         PropTypes.string.isRequired,
    onLayoutHandler:              PropTypes.func.isRequired,
    onPressHandler:               PropTypes.func.isRequired,
    page:                         PropTypes.number.isRequired,
    plan:                         PropTypes.object.isRequired,
    statePages:                   PropTypes.object.isRequired,
    subtitle:                     PropTypes.string,
    tabView:                      PropTypes.object,
    updatePageState:              PropTypes.func.isRequired,
};

RenderMyPlanTab.defaultProps = {
    subtitle: '',
    tabView:  null,
};

RenderMyPlanTab.componentName = 'RenderMyPlanTab';

/* Export Component ================================================================== */
export default RenderMyPlanTab;
