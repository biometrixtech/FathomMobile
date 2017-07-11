/**
 * Kit Owner Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    Image,
    ScrollView,
    View,
    Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem } from '@ui/';

const font10 = AppFonts.scaleFont(10);
const font18 = AppFonts.scaleFont(18);

/* Component ==================================================================== */
class KitOwnerView extends Component {
    static componentName = 'KitOwnerView';

    static propTypes = {
        user:      PropTypes.object,
        bluetooth: PropTypes.object,
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render = () =>
        (
        <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]} >
            <View style={{ backgroundColor: '#FFFFFF', alignItems: 'center' }}>
                <Image source={require('@images/kit-diagram.png')} resizeMode={'contain'} style={{ width: AppSizes.screen.widthTwoThirds }}/>
                <Text>{this.props.bluetooth.accessoryData.name}</Text>
                <Text style={{ fontSize: font10 }}>{this.props.bluetooth.accessoryData.id}</Text>
                <Spacer />
            </View>
            <View>
                <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>OWNER</Text>
                <ListItem
                    title={'Organization'}
                    rightTitle={this.props.user.organization.name}
                    rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    hideChevron
                />
                <ListItem
                    title={'Team'}
                    rightTitle={this.props.user.organization.name}
                    rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                    titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                />
                <ListItem
                    title={'Individual'}
                    rightTitle={`${this.props.user.first_name} ${this.props.user.last_name}`}
                    rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                    titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                />
                <Text style={{ paddingLeft: 20, fontSize: font10 }}>Edit your school, team, and name above.</Text>
            </View>
        </View>
        );
}

/* Export Component ==================================================================== */
export default KitOwnerView;
