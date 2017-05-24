/**
 * Data Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import ProgressBarClassic from 'react-native-progress-bar-classic';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';

// Components
import { Text, ListItem, Card, Spacer, Button } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    whiteText: {
        color: '#FFF',
    },
    start: {
        color: AppColors.brand.primary,
    },
    stop: {
        color: AppColors.brand.red,
    },
    badgeTextStyle: {
        fontWeight: 'bold',
    },
    cardView: {
        backgroundColor: '#31363D',
        alignItems:      'center',
    },
});

/* Component ==================================================================== */
class DataView extends Component {
    static componentName = 'DataView';

    static propTypes = {
        user: PropTypes.object,
    }

    static defaultProps = {
        user: {},
    }

    status = {
        ready:    '#00FF00',
        error:    '#FF0000',
        notReady: '#0000FF',
    };

    // function call to start or stop a group training session
    toggleGroupSession = (trainingGroup) => {

    }

    // function call to start or stop a player's training session
    togglePlayerSession = (athlete) => {

    }

    /* eslint-disable max-len */
    renderHeader = (section, index, isActive) => {
        const title = section.title;
        const numberOfAthletes = section.athletes.length;
        return (
          <View>
            <ListItem title={title} containerStyle={{ backgroundColor: section.color }} badge={{ value: numberOfAthletes, badgeTextStyle: styles.badgeTextStyle }} />
          </View>
        );
    }

    renderContent = (section, index, isActive) =>
        (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: AppSizes.screen.width, height: 40 }}>
              <View style={[AppStyles.flex1, AppStyles.containerCentered]}>
                {section.title !== 'Team' ? <Icon name="account-plus" type="material-community" /> : null}
              </View>
              <Button style={[AppStyles.flex2]} raised onPress={() => this.toggleGroupSession} icon={{ name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }} title={`${section.trainingActive ? 'Stop' : 'Start'} Group Session`} backgroundColor={section.trainingActive ? AppColors.brand.red : AppColors.brand.primary} />
              <View style={[AppStyles.flex1, AppStyles.containerCentered]}>
                {section.title !== 'Team' ? <Icon name="account-remove" type="material-community" /> : null}
              </View>
            </View>
            <View style={[styles.cardView]} >
              {
                section.athletes.map(athlete =>
                  (
                    <View>
                      <Card title={athlete.name}>
                        {
                            section.title === 'Team' ?
                            (
                              <View>
                                <Button style={[AppStyles.containerCentered]} raised onPress={() => this.togglePlayerSession} icon={{ name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }} title={`${section.trainingActive ? 'Stop' : 'Start'} Athlete Session`} backgroundColor={section.trainingActive ? AppColors.brand.red : AppColors.brand.primary} />
                                <Spacer size={5} />
                              </View>
                            ) : null
                        }
                        <View style={[{ flexDirection: 'row',  width: AppSizes.screen.width }, AppStyles.containerCentered]}>
                          <Text>
                            Kit Status:
                          </Text>
                        </View>
                        <Spacer size={5} />
                        <Text>Kit Memory:</Text>
                        <Spacer size={2} />
                        <ProgressBarClassic progress={50} label={'1028/2048'} />
                        <Spacer size={5} />
                        <Text>Kit Battery:</Text>
                        <Spacer size={2} />
                        <ProgressBarClassic progress={75} />
                      </Card>
                      <Spacer size={10} />
                    </View>
                  ),
                )
              }
            </View>
          </View>
        );

    render = () =>
        (
          <ScrollView style={[AppStyles.container]}>
            <Accordion
              sections={this.props.user.trainingGroups}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
            />
          </ScrollView>
        );
}

/* Export Component ==================================================================== */
export default DataView;
