import types from '../types';

export function updateStatusSelectBook(str) {
    return {
        type: types.GLOBAL_STATUS_SELECT_BOOK,
        return_selectBook : str
    };
}

export function updateStatusRemainTime(num) {
    return {
        type: types.GLOBAL_STATUS_REMAIN_TIME,
        return_remainTime : num
    };
}

export function addNumber(num) {
    console.log('addNumber num : ', num);
    return {
        type: types.INCREMENT,
        size: num
    };
}