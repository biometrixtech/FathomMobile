/**
 * Team Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import { DoubleCircleLoader } from 'react-native-indicator';
import ProgressBarClassic from 'react-native-progress-bar-classic';
import ModalPicker from 'react-native-modal-picker';

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
class AthletesView extends Component {
    static componentName = 'AthletesView';

    /* eslint-disable react/forbid-prop-types, react/no-unused-prop-types */
    static propTypes = {
        regimens:       PropTypes.array,
        trainingGroups: PropTypes.array,
        isModalVisible: PropTypes.bool,
    };

    static defaultProps = {
        regimens:       [],
        trainingGroups: [],
        isModalVisible: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            trainingGroups: this.props.trainingGroups,
            isModalVisible: this.props.isModalVisible,
        };
    }

    status = {
        ready:    '#00FF00',
        error:    '#FF0000',
        notReady: '#0000FF',
    };

    // function call to start or stop a group training session
    /* eslint-disable react/no-string-refs */
    toggleGroupSession = (group) => {
    }

    // function call to start or stop a player's training session
    /* eslint-disable react/no-string-refs */
    toggleAthleteSession = (athlete) => {
    }

    // function call to add a new player to a training group
    addAthlete = () => {
    }

    /* eslint-disable react/no-string-refs */
    renderModal = (
      <ModalPicker
        ref="modal"
        initValue="Pick a regimen to start"
        data={this.props.regimens.map(regimen => ({
            key:   regimen.id,
            label: regimen.name,
        }))}
      />
    )

    /* eslint-disable max-len */
    renderHeader = (section, index, isActive) => {
        const title = section.title;
        const numberOfAthletes = section.athletes.length;
        return (
          <View>
            <ListItem title={title} /* containerStyle={{ backgroundColor: section.color }} */ badge={{ value: numberOfAthletes, badgeTextStyle: styles.badgeTextStyle }} />
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
              <Button style={[AppStyles.flex2]} raised onPress={() => { if (section.trainingActive) { this.toggleGroupSession(); } this.refs.modal.open(); }} icon={{ name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }} title={`${section.trainingActive ? 'Stop' : 'Start'} Group Session`} backgroundColor={section.trainingActive ? AppColors.brand.red : AppColors.brand.primary} />
              <View style={[AppStyles.flex1, AppStyles.containerCentered]}>
                {section.title !== 'Team' ? <Icon name="account-remove" type="material-community" /> : null}
              </View>
            </View>
            <View style={[styles.cardView]} >
              {
                section.athletes.map(athlete =>
                  (
                    <View key={athlete.id}>
                      <Card title={athlete.name}>
                        {
                            section.title === 'Team' ?
                            (
                              <View>
                                <Button style={[AppStyles.containerCentered]} raised onPress={() => { if (section.trainingActive) { this.toggleAthleteSession(); } this.refs.modal.open(); }} icon={{ name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }} title={`${section.trainingActive ? 'Stop' : 'Start'} Athlete Session`} backgroundColor={section.trainingActive ? AppColors.brand.red : AppColors.brand.primary} />
                                <Spacer size={5} />
                              </View>
                            ) : null
                        }
                        <View style={[{ flexDirection: 'row',  width: AppSizes.screen.width }, AppStyles.containerCentered]}>
                          <Text>
                            Kit Status:
                          </Text>
                          <DoubleCircleLoader color={this.status.ready} />
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
          <View style={[AppStyles.container]}>
            <ScrollView>
              <Accordion
                sections={this.props.trainingGroups}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
              />
              <ModalPicker
                ref="modal"
                initValue=""
                selectStyle={{ borderWidth: 0 }}
                selectTextStyle={{ fontSize: 0 }}
                data={[{ label: 'Select regimen to start',  key: 0, section: true }].concat(this.props.regimens.map(regimen => ({
                    key:   regimen.id,
                    label: regimen.name,
                })))}
              />
            </ScrollView>
          </View>
        );
}

/* Export Component ==================================================================== */
export default AthletesView;
