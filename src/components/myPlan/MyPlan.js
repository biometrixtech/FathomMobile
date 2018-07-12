/**
 * MyPlan Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// import third-party libraries
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';

// Consts, Libs, and Utils
import { AppColors, AppStyles, AppSizes, } from '../../constants';

// Components
import { CalendarStrip, Card, Text, } from '../custom/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.primary.white.hundredPercent,
        flex:            1,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
    },
});

/* Component ==================================================================== */
class MyPlan extends Component {
    static componentName = 'MyPlan';

    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props);

        this.state = {
            // datesWhitelist: [
            //     {
            //         end:   moment().add(3, 'days'),  // total 4 days enabled
            //         start: moment(),
            //     }
            // ]
        };
    }

    componentDidMount = () => {
        SplashScreen.hide();
    }

    _onDateSelected = (date) => {
        const selectedDate = moment(date);
        console.log(`${selectedDate.calendar()} selected`);
    }

    render = () => {
        return (
            <View style={[styles.background]}>
                <Text>MY PLAN</Text>
                <CalendarStrip
                    onDateSelected={this._onDateSelected}
                />
                <ScrollView>
                    <Card>
                        <Text>{'STRENGTH & CONDITIONING'}</Text>
                        <Text>{'Stretch and Mobilize'}</Text>
                    </Card>
                    <Card>
                        <Text>{'PRACTICE'}</Text>
                        <Text>{'Soccer Practice'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                    <Card>
                        <Text>{'RECOVER'}</Text>
                        <Text>{'Time to reduce the injury risk'}</Text>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default MyPlan;