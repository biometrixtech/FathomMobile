var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/tcomb-form-native/lib/templates/bootstrap/datepicker.android.js';
var React = require('react');

var _require = require('react-native'),
    View = _require.View,
    Text = _require.Text,
    DatePickerAndroid = _require.DatePickerAndroid,
    TimePickerAndroid = _require.TimePickerAndroid,
    TouchableNativeFeedback = _require.TouchableNativeFeedback;

function datepicker(locals) {
  if (locals.hidden) {
    return null;
  }

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var datepickerStyle = stylesheet.datepicker.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;
  var dateValueStyle = stylesheet.dateValue.normal;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    datepickerStyle = stylesheet.datepicker.error;
    helpBlockStyle = stylesheet.helpBlock.error;
    dateValueStyle = stylesheet.dateValue.error;
  }

  var datePickerMode = 'date';
  if (locals.mode === 'date' || locals.mode === 'time') {
    datePickerMode = locals.mode;
  }

  var formattedValue = String(locals.value);
  var background = TouchableNativeFeedback.SelectableBackground();
  if (locals.config) {
    if (locals.config.format) {
      formattedValue = locals.config.format(locals.value);
    }
    if (locals.config.background) {
      background = locals.config.background;
    }
  }

  var label = locals.label ? React.createElement(
    Text,
    { style: controlLabelStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 47
      }
    },
    locals.label
  ) : null;
  var help = locals.help ? React.createElement(
    Text,
    { style: helpBlockStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 48
      }
    },
    locals.help
  ) : null;
  var error = locals.hasError && locals.error ? React.createElement(
    Text,
    { accessibilityLiveRegion: 'polite', style: errorBlockStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 49
      }
    },
    locals.error
  ) : null;
  var value = locals.value ? React.createElement(
    Text,
    { style: dateValueStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 50
      }
    },
    formattedValue
  ) : null;

  return React.createElement(
    View,
    { style: formGroupStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 53
      }
    },
    React.createElement(
      TouchableNativeFeedback,
      {
        accessible: true,
        disabled: locals.disabled,
        ref: 'input',
        background: background,
        onPress: function onPress() {
          if (datePickerMode === 'time') {
            TimePickerAndroid.open({ is24Hour: true }).then(function (time) {
              if (time.action !== TimePickerAndroid.dismissedAction) {
                var newTime = new Date();
                newTime.setHours(time.hour);
                newTime.setMinutes(time.minute);
                locals.onChange(newTime);
              }
            });
          } else {
            var config = {
              date: locals.value || new Date()
            };
            if (locals.minimumDate) {
              config.minDate = locals.minimumDate;
            }
            if (locals.maximumDate) {
              config.maxDate = locals.maximumDate;
            }
            DatePickerAndroid.open(config).then(function (date) {
              if (date.action !== DatePickerAndroid.dismissedAction) {
                var newDate = new Date(date.year, date.month, date.day);
                locals.onChange(newDate);
              }
            });
          }
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 54
        }
      },
      React.createElement(
        View,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 89
          }
        },
        label,
        value
      )
    ),
    help,
    error
  );
}

module.exports = datepicker;