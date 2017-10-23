/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:35:38 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:35:38 
 */

/**
 * Navbar Elements
 */
import { connect } from 'react-redux';

// Actions
import * as SideMenuActions from '@redux/sidemenu/actions';

// The component we're mapping to
import NavbarMenuButtonRender from './NavbarMenuButtonView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({});

// Any actions to map to the component?
const mapDispatchToProps = {
    toggleSideMenu: SideMenuActions.toggle,
};

/* Export Component ==================================================================== */
exports.NavbarMenuButton = connect(mapStateToProps, mapDispatchToProps)(NavbarMenuButtonRender);
