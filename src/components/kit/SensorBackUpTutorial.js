/**
 * SensorBackUpTutorial View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Alert, View, } from 'react-native';

// Consts and Libs
import { AppColors, } from '../../constants';
import { CVP, Calibration, Complete, Placement, Session, } from './ConnectScreens';
import { FathomModal, } from '../custom';

// import third-party libraries
import { Pages, } from 'react-native-pages';

/* Component ==================================================================== */
class SensorBackUpTutorial extends Component {
    static propTypes = {
        handleOnClose: PropTypes.func.isRequired,
        isVisible:     PropTypes.bool.isRequired,
    }

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            isSavingUser: false,
            isVideoMuted: false,
            pageIndex:    0,
        }
        this._pages = {};
    }

    _handleAlertPress = () => {
        Alert.alert(
            '',
            'Oops! Your Sensors need to finish syncing with the Smart Charger.\n\nPlease return all of the Sensors to the Charger, firmly close the lid, & wait for the LEDs to finish breathing green.',
            [
                {
                    text:  'OK',
                    style: 'cancel',
                },
            ],
            { cancelable: false, }
        );
    }

    _renderNextPage = () => {
        let nextPageIndex = (this.state.pageIndex + 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _renderPreviousPage = (numberOfPages = 1) => {
        let nextPageIndex = (this.state.pageIndex - numberOfPages);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    render = () => {
        const { handleOnClose, isVisible, } = this.props;
        const { isSavingUser, isVideoMuted, pageIndex, } = this.state;
        return (
            <FathomModal
                isVisible={isVisible}
            >
                <View style={{flex: 1,}}>
                    <Pages
                        containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                        indicatorPosition={'none'}
                        ref={pages => { this._pages = pages; }}
                        scrollEnabled={false}
                        startPage={pageIndex}
                    >

                        {/* Welcome Screen - page 0 */}
                        <CVP
                            nextBtn={this._renderNextPage}
                            onClose={() => handleOnClose()}
                            showTopNavStep={false}
                        />

                        {/* Placement Tutorial - pages 1-7 */}
                        <Placement
                            currentPage={pageIndex === 1}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={0}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 2}
                            handleAlertPress={() => this._handleAlertPress()}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={1}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 3}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={2}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 4}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={3}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 5}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={4}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 6}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={5}
                            showTopNavStep={false}
                        />
                        <Placement
                            currentPage={pageIndex === 7}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={6}
                            showTopNavStep={false}
                        />

                        {/* Calibration - pages 8-10 */}
                        <Calibration
                            currentPage={pageIndex === 8}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={0}
                            showTopNavStep={false}
                        />
                        <Calibration
                            currentPage={pageIndex === 9}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={1}
                            showTopNavStep={false}
                        />
                        <Calibration
                            currentPage={pageIndex === 10}
                            handleUpdateVolume={() => this.setState({ isVideoMuted: !this.state.isVideoMuted, })}
                            isVideoMuted={isVideoMuted}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={2}
                            showTopNavStep={false}
                        />

                        {/* Session - pages 11-13 */}
                        <Session
                            currentPage={pageIndex === 11}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={0}
                            showTopNavStep={false}
                        />
                        <Session
                            currentPage={pageIndex === 12}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={1}
                            showTopNavStep={false}
                        />
                        <Session
                            currentPage={pageIndex === 13}
                            nextBtn={this._renderNextPage}
                            onBack={this._renderPreviousPage}
                            onClose={() => handleOnClose()}
                            page={2}
                            showTopNavStep={false}
                        />

                        {/* End - page 14 */}
                        <Complete
                            currentPage={pageIndex === 14}
                            isLoading={isSavingUser}
                            nextBtn={() => this.setState({ isSavingUser: true, }, () => handleOnClose())}
                            onBack={this._renderPreviousPage}
                            onClose={() => this.setState({ isSavingUser: true, }, () => handleOnClose())}
                            showTopNavStep={false}
                        />

                    </Pages>
                </View>
            </FathomModal>
        );
    };
}

/* Export Component ==================================================================== */
export default SensorBackUpTutorial;
