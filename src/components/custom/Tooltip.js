//  https://github.com/AndreiCalazans/rn-tooltip
// import React and base
import * as React from 'react';
import { TouchableOpacity, Modal, View, ViewPropTypes as RNViewPropTypes, } from 'react-native';
import NativeMethodsMixin from 'react-native/Libraries/Renderer/shims/NativeMethodsMixin';
import PropTypes from 'prop-types';

// import constants
import { AppColors, AppSizes, } from '../../constants';

// import tooltip helpers
import { ScreenWidth, ScreenHeight, isIOS } from './tooltip-helpers/helpers';
import Triangle from './tooltip-helpers/Triangle';
import getTooltipCoordinate from './tooltip-helpers/getTooltipCoordinate';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

const styles = {
    container: withOverlay => ({
        backgroundColor: withOverlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
        flex:            1,
    }),
};

type State = {
    elementHeight: number,
    elementWidth: number,
    isVisible: boolean,
    xOffset: number,
    yOffset: number,
};

type Props = {
    backgroundColor: string,
    containerStyle: any,
    height: number,
    highlightColor: string,
    onClose: () => void,
    onOpen: () => void,
    pointerColor: string,
    popover: React.Element,
    toggleOnPress: boolean,
    width: number,
    withOverlay: boolean,
    withPointer: boolean,
};

class Tooltip extends React.Component<Props, State> {
  state = {
      elementHeight: 0,
      elementWidth:  0,
      isVisible:     false,
      xOffset:       0,
      yOffset:       0,
  };

  renderedElement;

  toggleTooltip = () => {
      const { onClose, } = this.props;
      this.getElementPosition();
      this.setState(prevState => {
          if (prevState.isVisible && !isIOS) {
              /*eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/
              onClose && onClose();
          }
          return { isVisible: !prevState.isVisible };
      });
  };

  wrapWithPress = (toggleOnPress, children) => {
      if (toggleOnPress) {
          return (
              <TouchableOpacity onPress={this.toggleTooltip} activeOpacity={1}>
                  {children}
              </TouchableOpacity>
          );
      }
      this.getElementPosition();
      return children;
  };

  getTooltipStyle = () => {
      const { elementHeight, elementWidth, xOffset, yOffset, } = this.state;
      const {
          backgroundColor,
          containerStyle,
          height,
          width,
          withPointer,
      } = this.props;
      const { x, y } = getTooltipCoordinate(
          ScreenHeight,
          ScreenWidth,
          elementHeight,
          elementWidth,
          height,
          width,
          withPointer,
          xOffset,
          yOffset,
      );
      return {
          ...containerStyle,
          backgroundColor,
          height,
          width,
          left:           x,
          position:       'absolute',
          top:            y,
          // default styles
          alignItems:     'center',
          borderRadius:   10,
          display:        'flex',
          flex:           1,
          justifyContent: 'center',
          padding:        10,
      };
  };

  renderPointer = tooltipY => {
      const { elementHeight, elementWidth, xOffset, yOffset, } = this.state;
      const { backgroundColor, pointerColor, } = this.props;
      const pastMiddleLine = yOffset > tooltipY;
      return (
          <View
              style={{
                  left:     xOffset + elementWidth / 2 - 7.5,
                  position: 'absolute',
                  top:      pastMiddleLine ? yOffset - 13 : yOffset + elementHeight - 2,
              }}
          >
              <Triangle
                  isDown={pastMiddleLine}
                  style={{ borderBottomColor: pointerColor || backgroundColor }}
              />
          </View>
      );
  };

  renderContent = withTooltip => {
      const { highlightColor, popover, toggleOnPress, withPointer, } = this.props;
      if (!withTooltip) {
          return this.wrapWithPress(toggleOnPress, this.props.children);
      }
      const { elementHeight, elementWidth, xOffset, yOffset, } = this.state;
      const tooltipStyle = this.getTooltipStyle();
      return (
          <View>
              <View
                  style={{
                      backgroundColor: highlightColor,
                      height:          elementHeight,
                      left:            xOffset,
                      overflow:        'visible',
                      position:        'absolute',
                      top:             yOffset,
                      width:           elementWidth,
                  }}
              >
                  {this.props.children}
              </View>
              {withPointer && this.renderPointer(tooltipStyle.top)}
              <View style={tooltipStyle}>{popover}</View>
          </View>
      );
  };

  componentDidMount() {
      // wait to compute onLayout values.
      setTimeout(this.getElementPosition, 500);
  }

  getElementPosition = (event) => {
      return this.renderedElement && this.renderedElement.measure(
          (frameOffsetX, frameOffsetY, width, height, pageOffsetX, pageOffsetY) => {
              this.setState({
                  elementHeight: height,
                  elementWidth:  width,
                  xOffset:       pageOffsetX,
                  yOffset:       pageOffsetY,
              });
          }
      );
  };

  render() {
      const { isVisible } = this.state;
      const { onClose, onOpen, visible, withOverlay, } = this.props;
      return (
          <View collapsable={false} ref={e => (this.renderedElement = e)}>
              {this.renderContent(false)}
              <Modal
                  animationType={'fade'}
                  onDismiss={onClose}
                  onRequestClose={onClose}
                  onShow={onOpen}
                  transparent
                  visible={visible || isVisible}
              >
                  <TouchableOpacity
                      activeOpacity={1}
                      onPress={this.toggleTooltip}
                      style={styles.container(withOverlay)}
                  >
                      {this.renderContent(true)}
                  </TouchableOpacity>
              </Modal>
          </View>
      );
  }
}

Tooltip.propTypes = {
    backgroundColor: PropTypes.string,
    children:        PropTypes.element,
    containerStyle:  ViewPropTypes.style,
    height:          PropTypes.number,
    highlightColor:  PropTypes.string,
    onClose:         PropTypes.func,
    onOpen:          PropTypes.func,
    pointerColor:    PropTypes.string,
    popover:         PropTypes.element,
    toggleOnPress:   PropTypes.bool,
    visible:         PropTypes.bool,
    width:           PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    withOverlay:     PropTypes.bool,
    withPointer:     PropTypes.bool,
};

Tooltip.defaultProps = {
    backgroundColor: AppColors.primary.white.hundredPercent,
    containerStyle:  {},
    height:          150,
    highlightColor:  'transparent',
    onClose:         () => {},
    onOpen:          () => {},
    toggleOnPress:   false,
    visible:         false,
    width:           AppSizes.screen.widthThreeQuarters,
    withOverlay:     true,
    withPointer:     true,
};

export default Tooltip;