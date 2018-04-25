/*
 * @Author: Vir Desai 
 * @Date: 2018-03-22 23:11:22 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-22 23:17:18
 */

/**
 * Support Screen Container
 */
import { connect } from 'react-redux';

// Actions
// import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import SupportRender from './SupportView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({});
};

// Any actions to map to the component?
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SupportRender);
