// reducer.js
import { TOGGLE_VISIBILITY,CURRENT_PIE, CURRENT_STATIONID,NODE_DATA,CLEAR_PIE } from '../Action/action';

const initialState = {
  isVisible: true,  // Initially, the element is visible
};

const initialState1 ={
  piename :'',
}

const initialState2 ={
  stationid :'',
}
const initialState3 ={
  node :'',
}




export const visibilityReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_VISIBILITY:
      return {
        ...state,
        isVisible: !state.isVisible,  // Toggle the visibility
      };
    default:
      return state;
  }
};

export const currentpieReducer =(state = initialState1,action)=>{
  switch (action.type) {
    case CURRENT_PIE:
      return {
        ...state,
        piename: action.payload,
      };
    case CLEAR_PIE:
        return {
          ...state,
          piename: '',
        };
    default:
      return state;
  }
}



export const currentstationidReducer=(state = initialState2,action)=>{
  switch(action.type){
    case CURRENT_STATIONID:
      return{
        ...state,
        stationid: action.payload,
      };
      default:
        return state;
  }
}

export const nodeReducer = (state = initialState3, action) => {
  switch (action.type) {
    case NODE_DATA:
      return {
        ...state,
        node: action.payload, // fixed from "state.payload"
      };
    default:
      return state;
  }
};
