/**
 * ReturnSensorsModal
 *
    <ReturnSensorsModal
        handleModalToggle={this._toggleReturnSensorsModal}
        isModalOpen={isReturnSensorsModalOpen}
        updateUser={updateUser}
        user={user}
    />
 *
 */
/* global fetch console */
import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';

// Compoenents
import { ReturnSensors, } from '../../kit/ConnectScreens';

// Consts and Libs
import { Actions as DispatchActions, AppColors, } from '../../../constants';
import { FathomModal, } from '../../custom';
import { store, } from '../../../store';

// import third-party libraries
import { Pages, } from 'react-native-pages';
import _ from 'lodash';

/* Component ==================================================================== */
class ReturnSensorsModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 0,
        };
        this._pages = {};
    }

    _onPageScrollEnd = currentPage => {
        const checkpointPages = [1];
        if(checkpointPages.includes(currentPage)) { // we're on a checkpoint page, update user obj
            this._updateUserCheckpoint();
        }
    }

    _renderNextPage = (numberOfPages = 1, callback) => {
        let nextPageIndex = (this.state.pageIndex + numberOfPages);
        this._pages.scrollToPage(nextPageIndex);
        this.setState(
            { pageIndex: nextPageIndex, },
            () => callback && callback()
        );
    }

    _renderPreviousPage = (numberOfPages = 1, callback, animate = true) => {
        let nextPageIndex = (this.state.pageIndex - numberOfPages);
        this._pages.scrollToPage(nextPageIndex, animate);
        this.setState(
            { pageIndex: nextPageIndex, },
            () => callback && callback(),
        );
    }

    _updateUserCheckpoint = () => {
        const { updateUser, user, } = this.props;
        let value = 'RETURN_SENSORS_MODAL';
        if(!user.first_time_experience.includes(value)) {
            let newUserPayloadObj = {};
            newUserPayloadObj.first_time_experience = [value];
            let newUserObj = _.cloneDeep(user);
            newUserObj.first_time_experience.push(value);
            // update reducer as API might take too long to return a value
            store.dispatch({
                type: DispatchActions.USER_REPLACE,
                data: newUserObj
            });
            // update user object
            updateUser(newUserPayloadObj, user.id, false);
        }
    }

    render = () => {
        const { handleModalToggle, isModalOpen, } = this.props;
        const { pageIndex, } = this.state;
        return (
            <FathomModal
                isVisible={isModalOpen}
            >

                <Pages
                    containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                    indicatorPosition={'none'}
                    onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)}
                    ref={pages => { this._pages = pages; }}
                    scrollEnabled={false}
                    startPage={pageIndex}
                >

                    <ReturnSensors
                        currentPage={pageIndex === 0}
                        onClose={handleModalToggle}
                        nextBtn={this._renderNextPage}
                        page={0}
                    />

                    <ReturnSensors
                        currentPage={pageIndex === 1}
                        onBack={this._renderPreviousPage}
                        onClose={handleModalToggle}
                        nextBtn={this._renderNextPage}
                        page={1}
                    />

                    <ReturnSensors
                        currentPage={pageIndex === 2}
                        onBack={this._renderPreviousPage}
                        onClose={handleModalToggle}
                        nextBtn={this._renderNextPage}
                        page={2}
                    />

                    <ReturnSensors
                        currentPage={pageIndex === 3}
                        onBack={this._renderPreviousPage}
                        onClose={handleModalToggle}
                        nextBtn={this._renderNextPage}
                        page={3}
                    />

                </Pages>

            </FathomModal>
        );
    }
}

ReturnSensorsModal.propTypes = {
    handleModalToggle: PropTypes.func.isRequired,
    isModalOpen:       PropTypes.bool.isRequired,
    updateUser:        PropTypes.func.isRequired,
    user:              PropTypes.object.isRequired,
};

ReturnSensorsModal.defaultProps = {};

ReturnSensorsModal.componentName = 'ReturnSensorsModal';

/* Export Component ================================================================== */
export default ReturnSensorsModal;