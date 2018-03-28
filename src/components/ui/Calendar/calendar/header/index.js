import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames } from '../../dateutils';
import { AppColors, AppStyles } from '@theme/';
import { Text, Spacer } from '@ui/';

class CalendarHeader extends Component {
  static propTypes = {
      theme:             PropTypes.object,
      hideArrows:        PropTypes.bool,
      month:             PropTypes.instanceOf(XDate),
      addMonth:          PropTypes.func,
      showIndicator:     PropTypes.bool,
      firstDay:          PropTypes.number,
      hideDayNames:      PropTypes.bool,
      weekNumbers:       PropTypes.bool,
      onPressArrowLeft:  PropTypes.func,
      onPressArrowRight: PropTypes.func,
      onPressTitle:      PropTypes.func
  };

  constructor(props) {
      super(props);
      this.style = styleConstructor(props.theme);
      this.addMonth = this.addMonth.bind(this);
      this.substractMonth = this.substractMonth.bind(this);
      this.onPressLeft = this.onPressLeft.bind(this);
      this.onPressRight = this.onPressRight.bind(this);
      this.onPressHeader = this.onPressHeader.bind(this);
  }

  addMonth() {
      this.props.addMonth(1);
  }

  substractMonth() {
      this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
      if (nextProps.month.toString('yyyy MM') !== this.props.month.toString('yyyy MM')) {
          return true;
      }
      if (nextProps.showIndicator !== this.props.showIndicator) {
          return true;
      }
      if (nextProps.hideDayNames !== this.props.hideDayNames) {
          return true;
      }
      return false;
  }

  onPressLeft() {
      const {onPressArrowLeft} = this.props;
      if(typeof onPressArrowLeft === 'function') {
          return onPressArrowLeft(this.substractMonth);
      }
      return this.substractMonth();
  }

  onPressRight() {
      const {onPressArrowRight} = this.props;
      if(typeof onPressArrowRight === 'function') {
          return onPressArrowRight(this.addMonth);
      }
      return this.addMonth();
  }

  onPressHeader() {
      const {onPressTitle} = this.props;
      if(onPressTitle) {
          return onPressTitle();
      }
      return null;
  }

  render() {
      let leftArrow = <View />;
      let rightArrow = <View />;
      let weekDaysNames = weekDayNames(this.props.firstDay);
      if (!this.props.hideArrows) {
          leftArrow = (
              <Icon
                  name={'arrow-back'}
                  color={AppColors.primary.grey.fiftyPercent}
                  onPress={this.onPressLeft}
                  style={this.style.arrow}
              />
          );
          rightArrow = (
              <Icon
                  name={'arrow-forward'}
                  color={AppColors.primary.grey.fiftyPercent}
                  onPress={this.onPressRight}
                  style={this.style.arrow}
              />
          );
      }
      let indicator;
      if (this.props.showIndicator) {
          indicator = <ActivityIndicator />;
      }
      return (
          <View>
              <Spacer />
              <View style={this.style.header}>
                  {leftArrow}
                  <View style={[{ flexDirection: 'row' }, AppStyles.containerCentered, AppStyles.flex2 ]}>
                      <TouchableOpacity onPress={this.onPressHeader}>
                          <Text allowFontScaling={false} style={{ color: AppColors.primary.grey.fiftyPercent }} accessibilityTraits='header'>
                              {this.props.month.toString(this.props.monthFormat ? this.props.monthFormat : 'MMMM yyyy')}
                          </Text>
                      </TouchableOpacity>
                      {indicator}
                  </View>
                  {rightArrow}
              </View>
              {
                  !this.props.hideDayNames &&
            <View style={this.style.week}>
                {this.props.weekNumbers && <Text allowFontScaling={false} style={[this.style.dayHeader]}></Text>}
                {weekDaysNames.map((day, idx) => (
                    <Text allowFontScaling={false} key={idx} accessible={false} style={[this.style.dayHeader]} numberOfLines={1}>{day}</Text>
                ))}
            </View>
              }
          </View>
      );
  }
}

export default CalendarHeader;
