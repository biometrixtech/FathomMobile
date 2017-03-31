/**
 * Recipe Tabs Container
 */
import { connect } from 'react-redux';

// Actions
import * as RecipeActions from '@redux/recipes/actions';

// The component we're mapping to
import RecipeTabsRender from './BrowseView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  meals: state.recipe.meals,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  getMeals: RecipeActions.getMeals,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeTabsRender);
