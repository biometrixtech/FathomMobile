/**
 * Team Management Screen Container
 */
import { connect } from 'react-redux';

// The component we're mapping to
import TeamManagementRender from './TeamManagementView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamManagementRender);
