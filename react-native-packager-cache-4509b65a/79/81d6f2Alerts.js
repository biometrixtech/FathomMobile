Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _ui = require('@ui/');

var styles = _reactNative.StyleSheet.create({
  alerts: {
    left: 0,
    right: 0
  },

  msg: {
    right: 0,
    left: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderLeftWidth: 3,
    borderColor: '#1C854C',
    backgroundColor: '#59DC9A'
  },
  msg_text: {
    textAlign: 'center',
    color: '#16693c',
    fontWeight: '500'
  },

  msgError: {
    borderColor: '#C02827',
    backgroundColor: '#FB6567'
  },
  msgError_text: {
    color: '#7f1a1a'
  },

  msgStatus: {
    borderColor: '#408491',
    backgroundColor: '#8EDBE5'
  },
  msgStatus_text: {
    color: '#2f606a'
  }
});

var Alerts = function Alerts(_ref) {
  var status = _ref.status,
      success = _ref.success,
      error = _ref.error;
  return _react2.default.createElement(
    _reactNative.View,
    { style: styles.alerts },
    !!success && _react2.default.createElement(
      _reactNative.View,
      null,
      _react2.default.createElement(
        _reactNative.View,
        { style: [styles.msg] },
        _react2.default.createElement(
          _ui.Text,
          { style: [styles.msg_text] },
          success
        )
      ),
      _react2.default.createElement(_ui.Spacer, { size: 20 })
    ),
    !!status && _react2.default.createElement(
      _reactNative.View,
      null,
      _react2.default.createElement(
        _reactNative.View,
        { style: [styles.msg, styles.msgStatus] },
        _react2.default.createElement(
          _ui.Text,
          { style: [styles.msg_text, styles.msgStatus_text] },
          status
        )
      ),
      _react2.default.createElement(_ui.Spacer, { size: 20 })
    ),
    !!error && _react2.default.createElement(
      _reactNative.View,
      null,
      _react2.default.createElement(
        _reactNative.View,
        { style: [styles.msg, styles.msgError] },
        _react2.default.createElement(
          _ui.Text,
          {
            style: [styles.msg_text, styles.msgError_text]
          },
          error
        )
      ),
      _react2.default.createElement(_ui.Spacer, { size: 20 })
    )
  );
};

Alerts.propTypes = {
  status: _react.PropTypes.string,
  success: _react.PropTypes.string,
  error: _react.PropTypes.string
};

Alerts.defaultProps = {
  status: '',
  success: '',
  error: ''
};

Alerts.componentName = 'Alerts';

exports.default = Alerts;