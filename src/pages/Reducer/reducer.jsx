import { TOGGLE_VISIBILITY,CURRENT_PIE, CURRENT_STATIONID,NODE_DATA,CLEAR_PIE,LOGIN_DATA, SELECTED_NODE_DATA, CLEAR_STATIONID, CURRENT_TREEVIEW, CURRENT_TREEVIEW_SELECTED } from '../Action/action';

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

const initialState5 ={
  prevnode :'',
}

const initialState6 ={
  treeviewselected :'',
}

const initialState7 ={
  treeview :'',
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
      case CLEAR_STATIONID:
      return {
        ...state,
        stationid: null,
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

export const selectedPrevNodeReducer = (state = initialState5, action) => {
  switch (action.type) {
    case SELECTED_NODE_DATA:
      return {
        ...state,
        node: action.payload,
      };
    default:
      return state;
  }
};

export const selectedTreeviewReducer = (state = initialState6, action) => {
  switch (action.type) {
    case CURRENT_TREEVIEW_SELECTED:
      return {
        ...state,
        node: action.payload,
      };
    default:
      return state;
  }
};

export const treeviewReducer = (state = initialState7, action) => {
  switch (action.type) {
    case CURRENT_TREEVIEW:
      return {
        ...state,
        node: action.payload,
      };
    default:
      return state;
  }
};
