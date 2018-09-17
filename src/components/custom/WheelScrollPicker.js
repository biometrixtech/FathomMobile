/**
  * Custom Wheel Scroll Picker
  *
      <WheelScrollPicker
          activeItemColor={AppColors.zeplin.darkGrey}
          activeItemHighlight={'#EBBA2D4D'}
          dataSource={MyPlanConstants.timeOptionGroups.hours}
          highlightBorderWidth={0}
          highlightColor={''}
          itemColor={AppColors.primary.grey.fiftyPercent}
          itemHeight={AppFonts.scaleFont(18) + 10}
          selectedIndex={this.state.timeValueGroups.hours}
          onValueChange={(data, selectedIndex) => {
              this._handleScrollFormChange('timeValueGroups', 'hours', data, selectedIndex);
          }}
          wrapperBackground={AppColors.transparent}
          wrapperHeight={180}
          wrapperWidth={(AppSizes.screen.width / 8)}
      />
  *
  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    Platform,
    ScrollView,
    View,
} from 'react-native';

// import Components
import { Text, } from './';
import { AppFonts, AppStyles, } from '../../constants/';

// setup variables
const deviceWidth = Dimensions.get('window').width;

class WheelScrollPicker extends Component {

    constructor(props) {
        super(props);
        this.onMomentumScrollBegin = this.onMomentumScrollBegin.bind(this);
        this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
        this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
        this.onScrollEndDrag = this.onScrollEndDrag.bind(this);
        this.state = {
            selectedIndex: this.props.selectedIndex ? this.props.selectedIndex : 1,
        }
    }

    componentDidMount = () => {
        if (this.props.selectedIndex) {
            setTimeout(() => {
                this.scrollToIndex(this.props.selectedIndex);
            }, 0);
        }
    };

    componentWillUnmount = () => {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    };

    renderPlaceHolder = () => {
        const height = (this.props.wrapperHeight - this.props.itemHeight) / 2;
        const header = <View style={{ height, flex: 1 }}></View>;
        const footer = <View style={{ height, flex: 1 }}></View>;
        return { header, footer };
    };

    renderItem = (data, index) => {
        const isSelected = index === this.state.selectedIndex;
        const item = <Text
            style={[isSelected ? AppStyles.robotoBold : AppStyles.robotoRegular, {
                color:     isSelected ? this.props.activeItemColor : this.props.itemColor,
                fontSize:  AppFonts.scaleFont(18),
                textAlign: 'center',
            }]}
        >
            {data}
        </Text>
        return (
            <View
                key={index}
                style={{
                    alignItems:      'center',
                    backgroundColor: isSelected ? this.props.activeItemHighlight : 'transparent',
                    height:          this.props.itemHeight ? this.props.itemHeight : 30,
                    justifyContent:  'center',
                }}
            >
                {item}
            </View>
        );
    };

    scrollFix = e => {
        let verticalY = 0;
        const h = this.props.itemHeight;
        if (e.nativeEvent.contentOffset) {
            verticalY = e.nativeEvent.contentOffset.y;
        }
        const selectedIndex = Math.round(verticalY / h);
        const verticalElem = selectedIndex * h;
        if (verticalElem !== verticalY) {
            // using scrollTo in ios, onMomentumScrollEnd will be invoked
            if (Platform.OS === 'ios') {
                this.isScrollTo = true;
            }
            this.sview.scrollTo({ y: verticalElem });
        }
        if (this.state.selectedIndex === selectedIndex) {
            return;
        }
        this.setState({
            selectedIndex,
        });
        // onValueChange
        if (this.props.onValueChange) {
            const selectedValue = this.props.dataSource[selectedIndex];
            this.props.onValueChange(selectedValue, selectedIndex);
        }
    };

    onScrollBeginDrag = () => {
        this.dragStarted = true;
        if (Platform.OS === 'ios') {
            this.isScrollTo = false;
        }
        if (this.timer) {
            clearTimeout(this.timer);
        }
    };

    onScrollEndDrag = e => {
        this.props.onScrollEndDrag();
        this.dragStarted = false;
        // if not used, event will be garbaged
        const element = {
            nativeEvent: {
                contentOffset: {
                    y: e.nativeEvent.contentOffset.y,
                },
            },
        };
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(
            () => {
                if (!this.momentumStarted && !this.dragStarted) {
                    this.scrollFix(element, 'timeout');
                }
            },
            10,
        );
    };

    onMomentumScrollBegin = () => {
        this.momentumStarted = true;
        if (this.timer) {
            clearTimeout(this.timer);
        }
    };

    onMomentumScrollEnd = e => {
        this.props.onMomentumScrollEnd();
        this.momentumStarted = false;
        if (!this.isScrollTo && !this.momentumStarted && !this.dragStarted) {
            this.scrollFix(e);
        }
    };

    scrollToIndex = ind => {
        this.setState({
            selectedIndex: ind,
        });
        const y = this.props.itemHeight * ind;
        this.sview.scrollTo({ y });
    };

    render = () => {
        const { header, footer } = this.renderPlaceHolder();
        return (
            <View style={{
                alignSelf:       'center',
                backgroundColor: this.props.wrapperBackground,
                flex:            1,
                height:          this.props.wrapperHeight,
                overflow:        'hidden',
                width:           this.props.wrapperWidth,
            }}>
                <View
                    style={{
                        borderBottomColor: this.props.highlightColor,
                        borderBottomWidth: this.props.highlightBorderWidth,
                        borderTopColor:    this.props.highlightColor,
                        borderTopWidth:    this.props.highlightBorderWidth,
                        height:            this.props.itemHeight,
                        position:          'absolute',
                        top:               (this.props.wrapperHeight - this.props.itemHeight) / 2,
                        width:             this.props.highlightWidth,
                    }}
                />
                <ScrollView
                    bounces={false}
                    nestedScrollEnabled={true}
                    onTouchStart={this.props.onTouchStart}
                    onMomentumScrollBegin={this.onMomentumScrollBegin}
                    onMomentumScrollEnd={this.onMomentumScrollEnd}
                    onScrollBeginDrag={this.onScrollBeginDrag}
                    onScrollEndDrag={this.onScrollEndDrag}
                    ref={(sview) => {
                        this.sview = sview;
                    }}
                    scrollEnabled={this.props.scrollEnabled}
                    showsVerticalScrollIndicator={false}
                >
                    {header}
                    {this.props.dataSource.map(this.renderItem.bind(this))}
                    {footer}
                </ScrollView>
            </View>
        );
    };

}

WheelScrollPicker.propTypes = {
    activeItemColor:      PropTypes.string,
    activeItemHighlight:  PropTypes.string,
    dataSource:           PropTypes.array,
    highlightBorderWidth: PropTypes.number,
    highlightColor:       PropTypes.string,
    highlightWidth:       PropTypes.number,
    itemColor:            PropTypes.string,
    itemHeight:           PropTypes.number,
    onMomentumScrollEnd:  PropTypes.func,
    onScrollEndDrag:      PropTypes.func,
    onValueChange:        PropTypes.func,
    renderItem:           PropTypes.func,
    scrollEnabled:        PropTypes.bool,
    selectedIndex:        PropTypes.number,
    style:                PropTypes.object,
    wrapperBackground:    PropTypes.string,
    wrapperHeight:        PropTypes.number,
    wrapperWidth:         PropTypes.number,
};

WheelScrollPicker.defaultProps = {
    activeItemColor:      '#222121',
    dataSource:           [1, 2, 3],
    highlightColor:       '#333',
    highlightBorderWidth: 2,
    highlightWidth:       deviceWidth,
    itemColor:            '#B4B4B4',
    itemHeight:           60,
    onMomentumScrollEnd:  () => {},
    onScrollEndDrag:      () => {},
    scrollEnabled:        true,
    wrapperBackground:    '#FFFFFF',
    wrapperHeight:        180,
    wrapperWidth:         150,
};

/* Export Component ==================================================================== */
export default WheelScrollPicker;