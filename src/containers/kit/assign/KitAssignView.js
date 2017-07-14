/**
 * Kit Assign Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    Image,
    ScrollView,
    View,
    Platform,
} from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';
import { Roles } from '@constants/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem } from '@ui/';
import { Placeholder } from '@general/';

const font10 = AppFonts.scaleFont(10);
const font18 = AppFonts.scaleFont(18);

/* Component ==================================================================== */
class KitAssignView extends Component {
    static componentName = 'KitAssignView';

    static propTypes = {
        user:       PropTypes.object,
        bluetooth:  PropTypes.object,
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    adminView = () => (
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => {
        let category = this.props.bluetooth.assignType === 'team' ? (this.props.bluetooth.accessoryData.team || 'TEAM') : (this.props.bluetooth.accessoryData.individual || 'INDIVIDUAL');
        return (
            <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]} >
                <View style={{ backgroundColor: '#FFFFFF', height: AppSizes.screen.heightOneThird, alignItems: 'center' }}>
                    <Image source={require('@images/kit-diagram.png')} resizeMode={'contain'} style={{ width: AppSizes.screen.widthTwoThirds }}/>
                    <Text>{this.props.bluetooth.accessoryData.name}</Text>
                    <Text style={{ fontSize: font10 }}>{this.props.bluetooth.accessoryData.id}</Text>
                    <Spacer />
                </View>
                <View>
                    <SearchBar />
                    <ListItem
                        title={category}
                        containerStyle={{ padding: 10 }}
                        rightTitle={'EDIT'}
                        rightTitleStyle={{ color: AppColors.brand.yellow }}
                    />
                    <ListItem
                        title={'Organization'}
                        titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                        hideChevron
                    />
                    <ListItem
                        title={'Team'}
                        titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                        hideChevron
                    />
                    <ListItem
                        title={'Individual'}
                        titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                        hideChevron
                    />
                    <Text style={{ paddingLeft: 20, fontSize: font10 }}>Edit your school, team, and name above.</Text>
                </View>
            </View>
        );
    }

    managerView = () => (
        <Placeholder />
    );

    researcherView = () => (
        <Placeholder />
    );

    render = () => {
        switch(this.props.user.role) {
        case Roles.admin:
            return this.adminView();
        case Roles.athlete:
            return this.athleteView();
        case Roles.biometrixAdmin:
            return this.biometrixAdminView();
        case Roles.superAdmin:
            return this.biometrixAdminView();
        case Roles.manager:
            return this.biometrixAdminView();
        case Roles.researcher:
            return this.researcherView();
        default:
            return <Placeholder />;
        }
    }
}

/* Export Component ==================================================================== */
export default KitAssignView;
