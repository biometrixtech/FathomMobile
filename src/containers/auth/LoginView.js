/**
 * Login Screen
 *  - Entry screen for all authentication
 *  - User can tap to login, forget password, or signUp...
 */
import React, { Component, PropTypes } from 'react';
import {
  Image,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppSizes } from '@theme/';

// Components
import { Spacer, Button, Card, Alerts, Text } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: 'transparent',
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
    logo: {
        width:      AppSizes.screen.width * 0.85,
        resizeMode: 'contain',
    },
    whiteText: {
        color: '#FFF',
    },
});

// <Spacer size={15} />
// <Text p style={[AppStyles.textCenterAligned, styles.whiteText]}>
//   - or -
// </Text>
// <Spacer size={10} />
// <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
//   <View style={[AppStyles.flex1]} />
//   <View style={[AppStyles.flex2]}>
//     <Button
//       small
//       title={'Skip'}
//       onPress={Actions.app}
//       backgroundColor={'#CB009E'}
//       raised={false}
//     />
//   </View>
//   <View style={[AppStyles.flex1]} />
// </View>
// <Spacer size={40} />


// <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
//   <View style={[AppStyles.flex1]}>
//     <Button
//       title={'Login'}
//       icon={{ name: 'lock' }}
//       onPress={Actions.login}
//     />
//   </View>
// </View>
//
// <Spacer size={10} />
//
// <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
//   <View style={[AppStyles.flex1]}>
//     <Button
//       title={'Sign up'}
//       icon={{ name: 'person-add' }}
//       onPress={Actions.signUp}
//     />
//   </View>
// </View>

/* Component ==================================================================== */
class Login extends Component {
    static componentName = 'Login';

    static propTypes = {
        login: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        // Email Validation
        const validEmail = FormValidation.refinement(
          FormValidation.String, (email) => {
              const regularExpression = /^.+@.+\..+$/i;

              return regularExpression.test(email);
          },
        );

        // Password Validation - Must be 6 chars long
        const validPassword = FormValidation.refinement(
          FormValidation.String, (password) => {
              if (password.length < 8) { return false; }
              return true;
          },
        );

        this.state = {
            resultMsg: {
                status:  '',
                success: '',
                error:   '',
            },
            form_fields: FormValidation.struct({
                Email:    validEmail,
                Password: validPassword,
            }),
            empty_form_values: {
                Email:    '',
                Password: '',
            },
            form_values: {},
            options:     {
                fields: {
                    Email: {
                        error:           'Please enter a valid email',
                        autoCapitalize:  'none',
                        clearButtonMode: 'while-editing',
                    },
                    Password: {
                        error:           'Your password must be 8 characters or more',
                        clearButtonMode: 'while-editing',
                        secureTextEntry: true,
                    },
                },
            },
        };
    }

    componentDidMount = async () => {
        // Get user data from AsyncStorage to populate fields
        const values = await AsyncStorage.getItem('api/credentials');
        const jsonValues = JSON.parse(values);

        if (values !== null) {
            this.setState({
                form_values: {
                    Email:    jsonValues.email,
                    Password: jsonValues.password,
                },
            });
        }
    }

    /**
      * Login
      */
    login = () => {
        // Get new credentials and update
        const credentials = this.form.getValue();

        // Form is valid
        if (credentials) {
            this.setState({ form_values: credentials }, () => {
                this.setState({ resultMsg: { status: 'One moment...' } });

                // Scroll to top, to show message
                if (this.scrollView) {
                    this.scrollView.scrollTo({ y: 0 });
                }

                this.props.login({
                    email:    credentials.Email,
                    password: credentials.Password,
                }, true).then(() => {
                    this.setState({
                        resultMsg: { success: 'Success, now loading your data!' },
                    }, () => {
                        setTimeout(() => {
                            Actions.app({ type: 'reset' });
                        }, 100);
                    });
                }).catch((err) => {
                    const error = AppAPI.handleError(err);
                    this.setState({ resultMsg: { error } });
                });
            });
        }
    }

    render = () => {
        const Form = FormValidation.form.Form;

        return (
          <Image
            source={require('../../images/login.jpg')}
            style={[AppStyles.containerCentered, AppStyles.container, styles.background]}
          >

            <Image
              source={require('../../images/logo.png')}
              style={[styles.logo]}
            />

            <Spacer size={10} />

            <Card>
              <Alerts
                status={this.state.resultMsg.status}
                success={this.state.resultMsg.success}
                error={this.state.resultMsg.error}
              />

              <Form
                ref={(b) => { this.form = b; }}
                type={this.state.form_fields}
                value={this.state.form_values}
                options={this.state.options}
              />

              <Button
                title={'Login'}
                onPress={this.login}
              />

              <Spacer size={10} />

              <TouchableOpacity onPress={Actions.passwordReset}>
                <Text p style={[AppStyles.textCenterAligned, AppStyles.link]}>
                  Forgot Password
                </Text>
              </TouchableOpacity>

              <Spacer size={10} />

              <Text p style={[AppStyles.textCenterAligned]}>
                - or -
              </Text>

              <Button
                title={'Sign Up'}
                onPress={Actions.signUp}
              />
            </Card>
          </Image>
        );
    }
}

/* Export Component ==================================================================== */
export default Login;
