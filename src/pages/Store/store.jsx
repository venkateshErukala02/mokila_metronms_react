// store.js

// import { createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import {visibilityReducer,currentpieReducer,currentstationidReducer,nodeReducer} from '../Reducer/reducer';
// import visibilityReducer from '../Reducer/reducer';


// const store = createStore(visibilityReducer);
const store = configureStore({
  reducer: {
    visibility: visibilityReducer,
    piename : currentpieReducer,
    stationid : currentstationidReducer,
    node: nodeReducer,
  },
});

export default store;
