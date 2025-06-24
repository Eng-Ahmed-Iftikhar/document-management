// third-party
import { combineReducers } from 'redux';
import { apiReducers } from 'api/services';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  ...apiReducers,
});

export default reducers;
