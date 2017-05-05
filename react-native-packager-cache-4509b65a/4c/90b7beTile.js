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

var _FeaturedTile = require('./FeaturedTile');

var _FeaturedTile2 = babelHelpers.interopRequireDefault(_FeaturedTile);

var Tile = function Tile(_ref) {
  var width = _ref.width,
      height = _ref.height,
      featured = _ref.featured,
      onPress = _ref.onPress,
      imageSrc = _ref.imageSrc,
      icon = _ref.icon,
      title = _ref.title,
      children = _ref.children,
      caption = _ref.caption,
      activeOpacity = _ref.activeOpacity,
      titleStyle = _ref.titleStyle,
      overlayContainerStyle = _ref.overlayContainerStyle,
      captionStyle = _ref.captionStyle,
      iconContainerStyle = _ref.iconContainerStyle,
      imageContainerStyle = _ref.imageContainerStyle,
      containerStyle = _ref.containerStyle,
      contentContainerStyle = _ref.contentContainerStyle;

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
      flex: 2
    },
    text: {
      backgroundColor: 'rgba(0,0,0,0)',
      marginBottom: 5
    },
    contentContainer: {
      paddingTop: 15,
      paddingBottom: 5,
      paddingLeft: 15,
      paddingRight: 15
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    }
  });

  if (featured) {
    var featuredProps = {
      title: title,
      icon: icon,
      caption: caption,
      imageSrc: imageSrc,
      onPress: onPress,
      activeOpacity: activeOpacity,
      containerStyle: containerStyle,
      imageContainerStyle: imageContainerStyle,
      overlayContainerStyle: overlayContainerStyle,
      titleStyle: titleStyle,
      captionStyle: captionStyle,
      width: width,
      height: height
    };
    return _react2.default.createElement(_FeaturedTile2.default, featuredProps);
  }

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
          style: [styles.iconContainer, iconContainerStyle && iconContainerStyle]
        },
        icon && _react2.default.createElement(_Icon2.default, icon)
      )
    ),
    _react2.default.createElement(
      _reactNative.View,
      {
        style: [styles.contentContainer, contentContainerStyle && contentContainerStyle]
      },
      _react2.default.createElement(
        _Text2.default,
        {
          h4: true,
          style: [styles.text, titleStyle && titleStyle]
        },
        title
      ),
      children
    )
  );
};

Tile.propTypes = {
  title: _react.PropTypes.string,
  icon: _react.PropTypes.object,
  caption: _react.PropTypes.string,
  imageSrc: _react.PropTypes.object.isRequired,
  onPress: _react.PropTypes.func,
  activeOpacity: _react.PropTypes.number,
  containerStyle: _react.PropTypes.any,
  imageContainerStyle: _react.PropTypes.any,
  iconContainerStyle: _react.PropTypes.any,
  overlayContainerStyle: _react.PropTypes.any,
  titleStyle: _react.PropTypes.any,
  captionStyle: _react.PropTypes.any,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number
};

exports.default = Tile;