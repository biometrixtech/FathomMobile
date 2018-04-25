/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:33:03 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-12 00:56:07
 */

/**
 * Forgot Password Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '../../../redux/user/actions';

// The component we're mapping to
import SignUpRender from './SignUpView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    signUp: UserActions.signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpRender);
