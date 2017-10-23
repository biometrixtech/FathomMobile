/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:35:14 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:35:14 
 */

/**
 * Launch Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import AppLaunchRender from './LaunchView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
    login: UserActions.login,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLaunchRender);
