// actions.js
export const TOGGLE_VISIBILITY = 'TOGGLE_VISIBILITY';
export const CURRENT_PIE= 'CURRENT_PIE';
export const CURRENT_STATIONID = 'CURRENT_STATIONID';
export const NODE_DATA = 'NODE_DATA';
export const CLEAR_PIE = 'CLEAR_PIE';


export const toggleVisibility = () => {
  return {
    type: TOGGLE_VISIBILITY,
  };
};

export const handleCurrentPie = (payload)=>({
      type: CURRENT_PIE,
      payload,
});

export const handleStationCircleId =(payload)=>({
  type: CURRENT_STATIONID,
  payload,
});


export const handleNodeData = (payload) => ({
  type: NODE_DATA,
  payload,
});

export const clearPiename = (payload)=>({
  type: CLEAR_PIE,
  payload,
})
