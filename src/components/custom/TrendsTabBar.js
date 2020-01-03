import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, View, } from 'react-native';

import { AppColors, AppFonts, AppSizes, } from '../../constants';
import { Text, } from './';

const TrendsTabBar = ({ name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle, tabView, }) => {
    const numberOfTabs = tabView && tabView.props ? tabView.props.children.length : 0;
    const fontSize = isTabActive ? AppFonts.scaleFont(22) : AppFonts.scaleFont(15);
    const textColor = isTabActive ? AppColors.zeplin.slateLight : AppColors.zeplin.slateXLight;
    let currentPage = tabView && tabView.state ? tabView.state.currentPage : 0;
    let currentPageStyles = (currentPage === page && currentPage === 0) ?
        {marginLeft: AppSizes.screen.widthQuarter, width: AppSizes.screen.widthHalf,}
        : (currentPage === page && (currentPage + 1) === numberOfTabs) ?
            {marginRight: AppSizes.screen.widthQuarter, width: AppSizes.screen.widthHalf,}
            : currentPage === page ?
                {width: AppSizes.screen.widthHalf,}
                :
                {width: 0,};
    let currentPageExtraStyles = {};
    if(currentPage === page && (currentPage === 0 || (currentPage + 1) === numberOfTabs)) {
        currentPageExtraStyles = {};
    } else {
        if((currentPage + 1) === page || (currentPage - 1) === page) {
            currentPageExtraStyles = {width: AppSizes.screen.widthQuarter,};
        }
    }
    const wrapperStyles = [currentPageStyles, currentPageExtraStyles,];
    return (
        <TouchableWithoutFeedback
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            key={`${name}_${page}`}
            onLayout={onLayoutHandler}
            onPress={() => onPressHandler(page)}
        >
            <View style={[wrapperStyles,]}>
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                    <Text
                        robotoBold={isTabActive}
                        robotoRegular={!isTabActive}
                        style={[{color: textColor, fontSize,},]}
                    >
                        {name}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

TrendsTabBar.propTypes = {
    name:            PropTypes.string.isRequired,
    page:            PropTypes.number.isRequired,
    isTabActive:     PropTypes.bool.isRequired,
    onPressHandler:  PropTypes.func.isRequired,
    onLayoutHandler: PropTypes.func, // NOTE: NOT REQUIRED FOR DefaultTabBar
    subtitle:        PropTypes.string,
    tabView:         PropTypes.object.isRequired,
};

TrendsTabBar.defaultProps = {
    onLayoutHandler: () => {}, // NOTE: NOT REQUIRED FOR DefaultTabBar
    subtitle:        '',
};

TrendsTabBar.componentName = 'TrendsTabBar';

/* Export Component ==================================================================== */
export default TrendsTabBar;
