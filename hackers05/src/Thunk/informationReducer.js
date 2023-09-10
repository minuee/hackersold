import types from './types';

const defaultState = {
    user_name : null,
    user_birthday : null,
}

export default informationReducer = (state = defaultState, action) => {
    // For Debugger
    // console.log('payload:' + action.payload);

    switch (action.type) {
        case types.INFORMATION_UPDATE_USER_NAME:
            return {
                // ...state,
                user_name : action.return_name

            };
        case types.INFORMATION_UPDATE_USER_BIRTHDAY:
            return {
                // ...state,
                user_birthday : action.return_birthday,
            };
        default:
            return state;
    }
};
