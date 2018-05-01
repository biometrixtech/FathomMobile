/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:20:04 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:20:04 
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
    Nav,
    Navbar,
    Collapse,
    DropdownMenu,
    DropdownItem,
    NavbarToggler,
    DropdownToggle,
    UncontrolledDropdown,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { AppConfig } from '../../constants/';
import { SidebarNavItems } from './Sidebar';

class Header extends React.Component {
    static propTypes = {
        first_name: PropTypes.string,
        last_name:  PropTypes.string,
        logout:     PropTypes.func.isRequired,
        history:    PropTypes.shape({
            push: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        first_name: '',
        last_name:  '',
    }

    constructor(props) {
        super(props);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.state = { isOpen: false };
    }

    onLogout = () => this.props.logout().then(() => this.props.history.push('/login'));

    toggleDropDown = () => this.setState({ isOpen: !this.state.isOpen });

    render() {
        const { first_name, last_name } = this.props;

        return (
            <header>
                <Navbar dark color='primary' expand='sm' className='fixed-top'>
                    <Link to='/' className='navbar-brand' style={{ color: '#FFF' }}>
                        {AppConfig.appName}
                    </Link>
                    <NavbarToggler onClick={this.toggleDropDown} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className='ml-auto' navbar>
                            <div className='d-block d-sm-none'>
                                {SidebarNavItems()}
                            </div>
                            <UncontrolledDropdown nav>
                                <DropdownToggle nav caret>
                                    {`Hi, ${first_name} ${last_name}`}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {/* {!loggedIn &&
                                        <div>
                                            <DropdownItem>
                                                <Link to='/login'>Login</Link>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <Link to='/sign-up'>Sign Up</Link>
                                            </DropdownItem>
                                        </div>
                                    }
                                    {loggedIn && */}
                                    <div>
                                        <DropdownItem>
                                            Update Profile
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>
                                            <a onClick={this.onLogout}>Logout</a>
                                        </DropdownItem>
                                    </div>
                                    {/* } */}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}

export default withRouter(Header);
