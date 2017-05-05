Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Text = require('../text/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _Icon = require('../icons/Icon');

var _Icon2 = babelHelpers.interopRequireDefault(_Icon);

var FeaturedTile = function FeaturedTile(_ref) {
  var title = _ref.title,
      icon = _ref.icon,
      caption = _ref.caption,
      imageSrc = _ref.imageSrc,
      onPress = _ref.onPress,
      activeOpacity = _ref.activeOpacity,
      containerStyle = _ref.containerStyle,
      imageContainerStyle = _ref.imageContainerStyle,
      overlayContainerStyle = _ref.overlayContainerStyle,
      iconContainerStyle = _ref.iconContainerStyle,
      titleStyle = _ref.titleStyle,
      captionStyle = _ref.captionStyle,
      width = _ref.width,
      height = _ref.height;

  if (!width) {
    width = _reactNative.Dimensions.get('window').width;
  }
  if (!height) {
    height = width * 0.8;
  }

  var styles = _reactNative.StyleSheet.create({
    container: {
      width: width,
      height: height
    },
    imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      resizeMode: 'cover',
      backgroundColor: '#ffffff',
      width: width,
      height: height
    },
    overlayContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
      alignSelf: 'stretch',
      justifyContent: 'center',
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 45,
      paddingBottom: 40,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    text: {
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0)',
      marginBottom: 15,
      textAlign: 'center'
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    }
  });

  return _react2.default.createElement(
    _reactNative.TouchableOpacity,
    {
      onPress: onPress,
      activeOpacity: activeOpacity,
      style: [styles.container, containerStyle && containerStyle]
    },
    _react2.default.createElement(
      _reactNative.Image,
      {
        source: imageSrc,
        style: [styles.imageContainer, imageContainerStyle && imageContainerStyle]
      },
      _react2.default.createElement(
        _reactNative.View,
        {
          style: [styles.overlayContainer, overlayContainerStyle && overlayContainerStyle]
        },
        _react2.default.createElement(
          _reactNative.View,
          {
            style: [styles.iconContainer, iconContainerStyle && iconContainerStyle]
          },
          icon && _react2.default.createElement(_Icon2.default, icon)
        ),
        _react2.default.createElement(
          _Text2.default,
          {
            h4: true,
            style: [styles.text, titleStyle && titleStyle]
          },
          title
        ),
        _react2.default.createElement(
          _Text2.default,
          {
            style: [styles.text, captionStyle && captionStyle]
          },
          caption
        )
      )
    )
  );
};

FeaturedTile.propTypes = {
  title: _react.PropTypes.string,
  icon: _react.PropTypes.object,
  caption: _react.PropTypes.string,
  imageSrc: _react.PropTypes.object.isRequired,
  onPress: _react.PropTypes.func,
  activeOpacity: _react.PropTypes.number,
  containerStyle: _react.PropTypes.any,
  iconContainerStyle: _react.PropTypes.any,
  imageContainerStyle: _react.PropTypes.any,
  overlayContainerStyle: _react.PropTypes.any,
  titleStyle: _react.PropTypes.any,
  captionStyle: _react.PropTypes.any,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number
};

exports.default = FeaturedTile;