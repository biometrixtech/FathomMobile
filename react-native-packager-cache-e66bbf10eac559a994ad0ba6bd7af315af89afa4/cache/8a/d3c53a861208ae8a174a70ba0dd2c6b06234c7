var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/tcomb-form-native/lib/templates/bootstrap/checkbox.js';
var React = require('react');

var _require = require('react-native'),
    View = _require.View,
    Text = _require.Text,
    Switch = _require.Switch;

function checkbox(locals) {
  if (locals.hidden) {
    return null;
  }

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var checkboxStyle = stylesheet.checkbox.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    checkboxStyle = stylesheet.checkbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  var label = locals.label ? React.createElement(
    Text,
    { style: controlLabelStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 23
      }
    },
    locals.label
  ) : null;
  var help = locals.help ? React.createElement(
    Text,
    { style: helpBlockStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 24
      }
    },
    locals.help
  ) : null;
  var error = locals.hasError && locals.error ? React.createElement(
    Text,
    { accessibilityLiveRegion: 'polite', style: errorBlockStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 25
      }
    },
    locals.error
  ) : null;

  return React.createElement(
    View,
    { style: formGroupStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 28
      }
    },
    label,
    React.createElement(Switch, {
      accessibilityLabel: locals.label,
      ref: 'input',
      disabled: locals.disabled,
      onTintColor: locals.onTintColor,
      thumbTintColor: locals.thumbTintColor,
      tintColor: locals.tintColor,
      style: checkboxStyle,
      onValueChange: function onValueChange(value) {
        return locals.onChange(value);
      },
      value: locals.value,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 30
      }
    }),
    help,
    error
  );
}

module.exports = checkbox;