Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/rating/Rating.js';

var _lodash = require('lodash.times');

var _lodash2 = babelHelpers.interopRequireDefault(_lodash);

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var STAR_IMAGE = require('./images/star.png');
var HEART_IMAGE = require('./images/heart.png');
var ROCKET_IMAGE = require('./images/rocket.png');
var BELL_IMAGE = require('./images/bell.png');

var STAR_WIDTH = 60;

var TYPES = {
  star: {
    source: STAR_IMAGE,
    color: '#f1c40f',
    backgroundColor: 'white'
  },
  heart: {
    source: HEART_IMAGE,
    color: '#e74c3c',
    backgroundColor: 'white'
  },
  rocket: {
    source: ROCKET_IMAGE,
    color: '#2ecc71',
    backgroundColor: 'white'
  },
  bell: {
    source: BELL_IMAGE,
    color: '#f39c12',
    backgroundColor: 'white'
  }
};

var Rating = function (_Component) {
  babelHelpers.inherits(Rating, _Component);

  function Rating(props) {
    babelHelpers.classCallCheck(this, Rating);

    var _this = babelHelpers.possibleConstructorReturn(this, (Rating.__proto__ || Object.getPrototypeOf(Rating)).call(this, props));

    var onFinishRating = _this.props.onFinishRating;


    var position = new _reactNative.Animated.ValueXY();
    var newValue = new _reactNative.Animated.ValueXY();
    newValue.setValue({ x: 0, y: 500 });

    var panResponder = _reactNative.PanResponder.create({
      onStartShouldSetPanResponder: function onStartShouldSetPanResponder() {
        return true;
      },
      onPanResponderMove: function onPanResponderMove(event, gesture) {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        _this.setState({ value: gesture.dx });
      },
      onPanResponderRelease: function onPanResponderRelease(event) {
        onFinishRating(_this.getCurrentRating());
      }
    });

    _this.state = { panResponder: panResponder, position: position };
    return _this;
  }

  babelHelpers.createClass(Rating, [{
    key: 'getPrimaryViewStyle',
    value: function getPrimaryViewStyle() {
      var position = this.state.position;
      var _props = this.props,
          imageSize = _props.imageSize,
          ratingCount = _props.ratingCount,
          type = _props.type;


      var color = TYPES[type].color;

      var width = position.x.interpolate({
        inputRange: [-ratingCount * (imageSize / 2), 0, ratingCount * (imageSize / 2)],
        outputRange: [0, ratingCount * imageSize / 2, ratingCount * imageSize],
        extrapolate: 'clamp'
      });

      return {
        backgroundColor: color,
        width: width,
        height: width ? imageSize : 0
      };
    }
  }, {
    key: 'getSecondaryViewStyle',
    value: function getSecondaryViewStyle() {
      var position = this.state.position;
      var _props2 = this.props,
          imageSize = _props2.imageSize,
          ratingCount = _props2.ratingCount,
          type = _props2.type;


      var backgroundColor = TYPES[type].backgroundColor;

      var width = position.x.interpolate({
        inputRange: [-ratingCount * (imageSize / 2), 0, ratingCount * (imageSize / 2)],
        outputRange: [ratingCount * imageSize, ratingCount * imageSize / 2, 0],
        extrapolate: 'clamp'
      });

      return {
        backgroundColor: backgroundColor,
        width: width,
        height: width ? imageSize : 0
      };
    }
  }, {
    key: 'renderRatings',
    value: function renderRatings() {
      var _props3 = this.props,
          imageSize = _props3.imageSize,
          ratingCount = _props3.ratingCount,
          type = _props3.type;

      var source = TYPES[type].source;

      return (0, _lodash2.default)(ratingCount, function (index) {
        return _react2.default.createElement(
          _reactNative.View,
          { key: index, style: styles.starContainer, __source: {
              fileName: _jsxFileName,
              lineNumber: 130
            }
          },
          _react2.default.createElement(_reactNative.Image, {
            source: source,
            style: { width: imageSize, height: imageSize },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 131
            }
          })
        );
      });
    }
  }, {
    key: 'getCurrentRating',
    value: function getCurrentRating() {
      var value = this.state.value;
      var _props4 = this.props,
          imageSize = _props4.imageSize,
          ratingCount = _props4.ratingCount;

      var startingValue = ratingCount / 2;
      var currentRating = 0;

      if (value > ratingCount * imageSize / 2) {
        currentRating = ratingCount;
      } else if (value > imageSize) {
        currentRating = Math.ceil(startingValue + value / imageSize);
      } else if (value < -ratingCount * imageSize / 2) {
        currentRating = 0;
      } else if (value < imageSize) {
        currentRating = Math.ceil(startingValue + value / imageSize);
      } else {
        currentRating = Math.ceil(startingValue);
      }

      return currentRating;
    }
  }, {
    key: 'displayCurrentRating',
    value: function displayCurrentRating() {
      var _props5 = this.props,
          ratingCount = _props5.ratingCount,
          type = _props5.type;


      var color = TYPES[type].color;

      return _react2.default.createElement(
        _reactNative.View,
        { style: styles.ratingView, __source: {
            fileName: _jsxFileName,
            lineNumber: 166
          }
        },
        _react2.default.createElement(
          _Text2.default,
          { style: styles.ratingText, __source: {
              fileName: _jsxFileName,
              lineNumber: 167
            }
          },
          'Rating: '
        ),
        _react2.default.createElement(
          _Text2.default,
          { style: [styles.currentRatingText, { color: color }], __source: {
              fileName: _jsxFileName,
              lineNumber: 168
            }
          },
          this.getCurrentRating()
        ),
        _react2.default.createElement(
          _Text2.default,
          { style: styles.maxRatingText, __source: {
              fileName: _jsxFileName,
              lineNumber: 171
            }
          },
          '/',
          ratingCount
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props6 = this.props,
          type = _props6.type,
          ratingImage = _props6.ratingImage,
          ratingColor = _props6.ratingColor,
          ratingBackgroundColor = _props6.ratingBackgroundColor,
          style = _props6.style,
          showRating = _props6.showRating;


      if (type === 'custom') {
        var custom = {
          source: ratingImage,
          color: ratingColor,
          backgroundColor: ratingBackgroundColor
        };
        TYPES.custom = custom;
      }

      return _react2.default.createElement(
        _reactNative.View,
        { style: style, __source: {
            fileName: _jsxFileName,
            lineNumber: 196
          }
        },
        showRating && this.displayCurrentRating(),
        _react2.default.createElement(
          _reactNative.View,
          babelHelpers.extends({
            style: styles.starsWrapper
          }, this.state.panResponder.panHandlers, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 198
            }
          }),
          _react2.default.createElement(
            _reactNative.View,
            { style: styles.starsInsideWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 202
              }
            },
            _react2.default.createElement(_reactNative.Animated.View, { style: this.getPrimaryViewStyle(), __source: {
                fileName: _jsxFileName,
                lineNumber: 203
              }
            }),
            _react2.default.createElement(_reactNative.Animated.View, { style: this.getSecondaryViewStyle(), __source: {
                fileName: _jsxFileName,
                lineNumber: 204
              }
            })
          ),
          this.renderRatings()
        )
      );
    }
  }]);
  return Rating;
}(_react.Component);

Rating.defaultProps = {
  type: 'star',
  ratingImage: require('./images/star.png'),
  ratingColor: '#f1c40f',
  ratingBackgroundColor: 'white',
  ratingCount: 5,
  imageSize: STAR_WIDTH,
  onFinishRating: function onFinishRating() {
    return console.log('Attach a function here.');
  }
};
exports.default = Rating;


var styles = _reactNative.StyleSheet.create({
  starsWrapper: {
    flexDirection: 'row'
  },
  starsInsideWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row'
  },
  ratingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5
  },
  ratingText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: _reactNative.Platform.OS === 'ios' ? 'Trebuchet MS' : null,
    color: '#34495e'
  },
  currentRatingText: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: _reactNative.Platform.OS === 'ios' ? 'Trebuchet MS' : null
  },
  maxRatingText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: _reactNative.Platform.OS === 'ios' ? 'Trebuchet MS' : null,
    color: '#34495e'
  }
});

Rating.propTypes = {
  type: _propTypes2.default.string,
  ratingImage: _reactNative.Image.propTypes.source,
  ratingColor: _propTypes2.default.string,
  ratingBackgroundColor: _propTypes2.default.string,
  ratingCount: _propTypes2.default.number,
  imageSize: _propTypes2.default.number,
  onFinishRating: _propTypes2.default.func,
  showRating: _propTypes2.default.bool,
  style: _reactNative.View.propTypes.style
};