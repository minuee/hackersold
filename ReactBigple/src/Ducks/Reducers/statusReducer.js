import types from '../types';

const defaultState = {
    selectBook : {},
    remainTime : 0,
    number: 1,
}

export default StatusReducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.GLOBAL_STATUS_SELECT_BOOK:
            return {     
                ...state,
                selectBook : action.return_selectBook
            };
        case types.GLOBAL_STATUS_REMAIN_TIME:
            return {     
                ...state,
                remainTime : action.return_remainTime
            };
        case types.INCREMENT:
            return {
                ...state,
                number: state.number + action.size
            };
        default:
            return state;
    }
};
