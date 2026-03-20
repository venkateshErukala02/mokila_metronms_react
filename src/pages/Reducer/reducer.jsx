import { TOGGLE_VISIBILITY,CURRENT_PIE, CURRENT_STATIONID,NODE_DATA,CLEAR_PIE,LOGIN_DATA } from '../Action/action';

const initialState = {
  isVisible: true,
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

const initialState4 ={
  loginuser :'',
}




export const visibilityReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_VISIBILITY:
      return {
        ...state,
        isVisible: !state.isVisible,
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
        node: action.payload,
      };
    default:
      return state;
  }
};


export const loginReducer = (state = initialState4, action) => {
  switch (action.type) {
    case LOGIN_DATA:
      return {
        ...state,
        node: action.payload,
      };
    default:
      return state;
  }
};
