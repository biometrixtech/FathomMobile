/**
 * Team Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';

// Components
import { Text, ListItem } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    whiteText: {
        color: '#FFF',
    },
    badgeTextStyle: {
        color:      AppColors.brand.primary,
        fontWeight: 'bold',
    },
});

/* Component ==================================================================== */
class AthletesView extends Component {
    static componentName = 'AthletesView';

    static propTypes = {
        trainingGroups: PropTypes.arrayOf(PropTypes.object),
    }

    static defaultProps = {
        trainingGroups: [
            {
                title:      'Team',
                color:      AppColors.brand.primary,
                avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
            },
            {
                title:      'Injured',
                color:      '#FFFFFF',
                avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
            },
            {
                title:      'Healthy',
                color:      AppColors.brand.secondary,
                avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
            },
        ],
    }

    /* eslint-disable max-len */
    renderHeader = (section, index, isActive) => {
        const title = section.title;
        return (
          <View>
            <ListItem title={title} containerStyle={{ backgroundColor: section.color }} badge={{ value: index, badgeTextStyle: styles.badgeTextStyle }} />
          </View>
        );
    }

    renderContent = (section, index, isActive) => {
        const title = section.title;
        return (
          <View
            style={{ backgroundColor: '#31363D' }}
          >
            <Text
              style={{
                  paddingTop:    15,
                  paddingRight:  15,
                  paddingBottom: 15,
                  paddingLeft:   15,
                  color:         '#fff' }}
            >
            This content is hidden in the accordion
            </Text>
          </View>
        );
    }

    render = () =>
        (
          <View style={[AppStyles.container]}>
            <Accordion
              sections={this.props.trainingGroups}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
            />
          </View>
        );
}

/* Export Component ==================================================================== */
export default AthletesView;
