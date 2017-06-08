var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/tcomb-form-native/lib/templates/bootstrap/list.js';
var React = require('react');

var _require = require('react-native'),
    View = _require.View,
    Text = _require.Text,
    TouchableHighlight = _require.TouchableHighlight;

function renderRowWithoutButtons(item) {
  return React.createElement(
    View,
    { key: item.key, __source: {
        fileName: _jsxFileName,
        lineNumber: 5
      }
    },
    item.input
  );
}

function renderRowButton(button, stylesheet, style) {
  return React.createElement(
    TouchableHighlight,
    { key: button.type, style: [stylesheet.button, style], onPress: button.click, __source: {
        fileName: _jsxFileName,
        lineNumber: 10
      }
    },
    React.createElement(
      Text,
      { style: stylesheet.buttonText, __source: {
          fileName: _jsxFileName,
          lineNumber: 11
        }
      },
      button.label
    )
  );
}

function renderButtonGroup(buttons, stylesheet) {
  return React.createElement(
    View,
    { style: { flexDirection: 'row' }, __source: {
        fileName: _jsxFileName,
        lineNumber: 18
      }
    },
    buttons.map(function (button) {
      return renderRowButton(button, stylesheet, { width: 50 });
    })
  );
}

function renderRow(item, stylesheet) {
  return React.createElement(
    View,
    { key: item.key, style: { flexDirection: 'row' }, __source: {
        fileName: _jsxFileName,
        lineNumber: 26
      }
    },
    React.createElement(
      View,
      { style: { flex: 1 }, __source: {
          fileName: _jsxFileName,
          lineNumber: 27
        }
      },
      item.input
    ),
    React.createElement(
      View,
      { style: { flex: 1 }, __source: {
          fileName: _jsxFileName,
          lineNumber: 30
        }
      },
      renderButtonGroup(item.buttons, stylesheet)
    )
  );
}

function list(locals) {
  if (locals.hidden) {
    return null;
  }

  var stylesheet = locals.stylesheet;
  var fieldsetStyle = stylesheet.fieldset;
  var controlLabelStyle = stylesheet.controlLabel.normal;

  if (locals.hasError) {
    controlLabelStyle = stylesheet.controlLabel.error;
  }

  var label = locals.label ? React.createElement(
    Text,
    { style: controlLabelStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 50
      }
    },
    locals.label
  ) : null;
  var error = locals.hasError && locals.error ? React.createElement(
    Text,
    { accessibilityLiveRegion: 'polite', style: stylesheet.errorBlock, __source: {
        fileName: _jsxFileName,
        lineNumber: 51
      }
    },
    locals.error
  ) : null;

  var rows = locals.items.map(function (item) {
    return item.buttons.length === 0 ? renderRowWithoutButtons(item) : renderRow(item, stylesheet);
  });

  var addButton = locals.add ? renderRowButton(locals.add, stylesheet) : null;

  return React.createElement(
    View,
    { style: fieldsetStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 64
      }
    },
    label,
    error,
    rows,
    addButton
  );
}

module.exports = list;