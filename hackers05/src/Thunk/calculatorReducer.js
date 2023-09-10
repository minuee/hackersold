import types from './types';

const defaultState = {
    cal_result : 0,
    cal_sumInfo: {
        cal_first : 0,
        cal_second : 0,
    },
}

export default calculator = (state = defaultState, action) => {
    // For Debugger
    // console.log('payload:' + action.payload);

    switch (action.type) {
        case types.CALCULATOR_UPDATE_SUM_FIRST:
            return {
                // ...state,
                cal_result : action.payload + state.cal_sumInfo.cal_second,
                cal_sumInfo: {
                    cal_first:action.payload,
                    cal_second:state.cal_sumInfo.second
                }
            };
        case types.CALCULATOR_UPDATE_SUM_SECOND:
            return {
                // ...state,
                cal_result : action.payload + state.cal_sumInfo.cal_first,
                cal_sumInfo: {
                    cal_first:state.cal_sumInfo.cal_first,
                    cal_second:action.payload
                }
            };
        default:
            return state;
    }
};
