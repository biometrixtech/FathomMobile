/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:35:43 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-12 00:48:39
 */

/**
 * Whole App Container
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu';
import { DefaultRenderer } from 'react-native-router-flux';

// Consts and Libs
import { AppSizes } from '../../theme/';

// Containers
import Menu from './Menu/MenuContainer';

/* Redux ==================================================================== */
// Actions
import * as SideMenuActions from '../../redux/sidemenu/actions';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    sideMenuIsOpen: state.sideMenu.isOpen,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    toggleSideMenu: SideMenuActions.toggle,
    closeSideMenu:  SideMenuActions.close,
};

/* Component ==================================================================== */
class Drawer extends Component {
    static componentName = 'Drawer';

    static propTypes = {
        navigationState: PropTypes.shape({}),
        onNavigate:      PropTypes.func,
        sideMenuIsOpen:  PropTypes.bool,
        closeSideMenu:   PropTypes.func.isRequired,
        toggleSideMenu:  PropTypes.func.isRequired,
    }

    static defaultProps = {
        navigationState: null,
        onNavigate:      null,
        sideMenuIsOpen:  null,
    }


    /**
      * Toggle Side Menu
      */
    onSideMenuChange = (isOpen) => {
        if (isOpen !== this.props.sideMenuIsOpen) {
            this.props.toggleSideMenu();
        }
    }

    render() {
        const state = this.props.navigationState;
        const children = state.children;

        return (
            <SideMenu
                ref={(a) => { this.rootSidebarMenu = a; }}
                openMenuOffset={AppSizes.screen.width * 0.75}
                menu={
                    <Menu
                        closeSideMenu={this.props.closeSideMenu}
                        ref={(b) => { this.rootSidebarMenuMenu = b; }}
                    />
                }
                isOpen={this.props.sideMenuIsOpen}
                onChange={this.onSideMenuChange}
            >
                <View style={{ backgroundColor: '#000', flex: 1 }}>
                    <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
                </View>
            </SideMenu>
        );
    }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
