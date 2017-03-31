/**
 * Forgot Password Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import ForgotPasswordRender from './ForgotPasswordView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    forgotPassword: UserActions.forgotPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordRender);
