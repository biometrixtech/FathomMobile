// https://github.com/taskrabbit/react-native-parsed-text
import React from 'react';
import { Text, } from 'react-native';
import PropTypes from 'prop-types';

import { TextExtraction, } from './helpers';
import { Text as FathomText, } from './';

export const PATTERNS = {
    email: /\S+@\S+\.\S+/,
    phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
    url:   /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*[-a-zA-Z0-9@:%_\+~#?&\/=])*/i,
};

const defaultParseShape = PropTypes.shape({
    ...Text.propTypes,
    type: PropTypes.oneOf(Object.keys(PATTERNS)).isRequired,
});

const customParseShape = PropTypes.shape({
    ...Text.propTypes,
    pattern: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]).isRequired,
});

class ParsedText extends React.Component {

  static displayName = 'ParsedText';

  static propTypes = {
      ...Text.propTypes,
      childrenProps: PropTypes.shape(Text.propTypes),
      parse:         PropTypes.arrayOf(
          PropTypes.oneOfType([defaultParseShape, customParseShape]),
      ),
  };

  static defaultProps = {
      childrenProps: {},
      parse:         null,
  };

  setNativeProps = nativeProps => {
      this._root.setNativeProps(nativeProps);
  }

  getPatterns = () => {
      return this.props.parse.map((option) => {
          const {type, ...patternOption} = option;
          if (type) {
              if (!PATTERNS[type]) {
                  throw new Error(`${option.type} is not a supported type`);
              }
              patternOption.pattern = PATTERNS[type];
          }

          return patternOption;
      });
  }

  getParsedText = () => {
      if (!this.props.parse)                       { return this.props.children; }
      if (typeof this.props.children !== 'string') { return this.props.children; }

      const textExtraction = new TextExtraction(this.props.children, this.getPatterns());

      return textExtraction.parse().map((props, index) => {
          const { style: parentStyle, } = this.props;
          const { style, ...remainder } = props;
          return (
              <FathomText
                  key={`parsedText-${index}`}
                  style={[parentStyle, style]}
                  {...this.props.childrenProps}
                  {...remainder}
              />
          );
      });
  }

  render = () => {
      // Discard custom props before passing remainder to ReactNative.Text
      const { childrenProps, parse, ...remainder } = { ...this.props };

      return (
          <FathomText ref={ref => (this._root = ref)} {...remainder}>
              {this.getParsedText()}
          </FathomText>
      );
  }
}

export default ParsedText;