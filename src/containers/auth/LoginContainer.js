/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:32:53 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-14 03:24:42
 */

/**
 * Login Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import LoginRender from './LoginView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
    login: UserActions.login,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginRender);
