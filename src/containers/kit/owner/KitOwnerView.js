/**
 * Kit Owner Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    Image,
    ScrollView,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements';
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
class KitOwnerView extends Component {
    static componentName = 'KitOwnerView';

    static propTypes = {
        user:                 PropTypes.object,
        bluetooth:            PropTypes.object,
        assignType:           PropTypes.func.isRequired,
        getOwnerOrganization: PropTypes.func.isRequired,
        getOwnerTeam:         PropTypes.func.isRequired,
        getOwnerUser:         PropTypes.func.isRequired,
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    // componentWillMount = () => {
    //     this.props.getOwnerOrganization(this.props.bluetooth.accessoryData.id);
    //     this.props.getOwnerTeam(this.props.bluetooth.accessoryData.id);
    //     this.props.getOwnerUser(this.props.bluetooth.accessoryData.id);
    // };

    adminView = () => (
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => (
        <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]} >
            <View style={{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', height: AppSizes.screen.heightOneThird }}>
                <Image source={require('@images/kit-diagram.png')} resizeMode={'contain'} style={{ width: AppSizes.screen.widthTwoThirds, height: AppSizes.screen.widthTwoThirds * 268/509 }}/>
                <Spacer size={5}/>
                <Text>{this.props.bluetooth.accessoryData.name || ''}</Text>
                <Text style={{ fontSize: font10 }}>{this.props.bluetooth.accessoryData.id || ''}</Text>
            </View>
            <View>
                <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>OWNER</Text>
                <ListItem
                    title={'Organization'}
                    rightTitle={this.props.bluetooth.accessoryData.organization ? this.props.bluetooth.accessoryData.organization.name : null}
                    rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                    titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    onPress={() => { this.props.assignType('organization'); return Actions.kitAssign(); }}
                />
                <ListItem
                    title={'Team'}
                    rightTitle={this.props.bluetooth.accessoryData.team ? this.props.bluetooth.accessoryData.team.name : null}
                    rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                    titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    onPress={() => { this.props.assignType('team'); return Actions.kitAssign(); }}
                />
                <ListItem
                    title={'Individual'}
                    rightTitle={this.props.bluetooth.accessoryData.individual ? this.props.bluetooth.accessoryData.individual.name : null}
                    rightTitleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    chevronColor={this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}
                    titleStyle={{ color: this.props.bluetooth.accessoryData.accessoryConnected ? AppColors.brand.blue : AppColors.lightGrey}}
                    onPress={() => { this.props.assignType('individual'); return Actions.kitAssign(); }}
                />
                <Text style={{ paddingLeft: 20, fontSize: font10 }}>Edit your school, team, and name above.</Text>
            </View>
        </View>
    );

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
export default KitOwnerView;
