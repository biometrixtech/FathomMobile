/**
 * Capture Session Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as AccessoryActions from '@redux/user/actions';

// The component we're mapping to
import CaptureSessionView from './CaptureSessionView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user:  state.user,
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    upsertAccessory: AccessoryActions.upsertAccessory,
};

export default connect(mapStateToProps, mapDispatchToProps)(CaptureSessionView);
