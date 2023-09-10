import types from '../types';

export function updateStatusSelectBook(str) {
    return {
        type: types.GLOBAL_STATUS_SELECT_BOOK,
        return_selectBook : str
    };
}

export function updateGlobalNewsUnReadCount(num) {
    return {
        type: types.GLOBAL_NEWS_UNREAD_COUNT,
        return_newsUnreadCount : num
    };
}

export function updateGlobalNewsData(str) {
    return {
        type: types.GLOBAL_NEWS_DATA,
        return_newsData : str
    };
}

export function updateDrawerOpen(bool) {
    return {
        type: types.GLOBAL_IS_DRAWER_OPEN,
        return_isDrawerOpen : bool
    };
}

export function updateMypageSelectedTabsLnb(str) {
    return {
        type: types.MYPAGE_SELECTED_TABS_LNB,
        return_mypageSelectedTabsLnb : str
    };
}

export function updateMyInterestOneCode(str) {
    return {
        type: types.GLOBAL_MYINTEREST_CODE_ONE,
        return_myInterestCodeOne : str
    };
}

export function updateMyInterestMultiCode(str) {
    return {
        type: types.GLOBAL_MYINTEREST_CODE_MULTI,
        return_myInterestCodeMulti : str
    };
}

export function updateMyInterestNoticeCode(str) {
    return {
        type: types.GLOBAL_MYINTEREST_CODE_NOTICE,
        return_myInterestCodeNotice : str
    };
}

export function updateStatusNowScroll(num) {
    return {
        type: types.GLOBAL_STATUS_TOP_FAVORITE_MENU,
        return_topfavoritemenu : num
    };
}

export function updateStatusNowScrollY(num) {
    return {
        type: types.GLOBAL_STATUS_NOW_SCROLLY,
        return_nowscrolly : num
    };
}

export function updateStatusShowBottomBar(bool) {
    return {
        type: types.GLOBAL_STATUS_SHOW_BOTTOM_BAR,
        return_showbottombar : bool
    };
}

export function updateStatusNetworking(bool) {
    return {
        type: types.GLOBAL_STATUS_NETWORKING,
        return_isnetworking : bool
    };
}

export function updateTextBookFocusHeight(num) {
    return {
        type: types.GLOBAL_STATUS_TEXTBOOK_FOUCS_HEIGHT,
        return_textBookFocusHeight : num
    };
}

export function updatemyTopFilter(str) {
    return {
        type: types.GLOBAL_STATUS_MY_TOP_FILTER,
        return_myTopFilter : str,
    };
}

export function updatereviewFilterDataCourse(str) {
    return {
        type: types.REVIEW_FILTER_DATA_COURSE,
        return_reviewFilterDataCourse : str,
    };
}
export function updatereviewFilterDataPass(str) {
    return {
        type: types.REVIEW_FILTER_DATA_PASS,
        return_reviewFilterDataPass : str,
    };
}
export function updatereviewSelectDataCourse(str) {
    return {
        type: types.REVIEW_SELECT_DATA_COURSE,
        return_reviewSelectDataCourse : str,
    };
}
export function updatereviewSelectDataPass(str) {
    return {
        type: types.REVIEW_SELECT_DATA_PASS,
        return_reviewSelectDataPass : str,
    };
}

export function updaterecommFilterData(str) {    
    return {
        type: types.RECOMM_FILTER_DATA,
        return_recommFilterData : str,
    };
}
export function updaterecommSelectData(str) {
    return {
        type: types.RECOMM_SELECT_DATA,
        return_recommSelectData : str,
    };
}

export function updatetextbookFilterData(str) {
    return {
        type: types.TEXTBOOK_FILTER_DATA,
        return_textbookFilterData : str,
    };
}
export function updatetextbookSelectData(str) {
    return {
        type: types.TEXTBOOK_SELECT_DATA,
        return_textbookSelectData : str,
    };
}

export function saveUserToken(token) {
    return {
        type: types.GLOBAL_STATUS_USER_TOKEN,
        return_usertoken : token,
    };
}

export function updateMyClassProdcutFilter(obj) {
    return {
        type: types.MYCLASS_PROPDUCT_FILTER,
        myClassProductFilter: obj,
    };
}

export function updateMyClassApplyClassFilter(obj) {
    return {
        type: types.MYCLASS_APPLYCLASS_FILTER,
        myClassApplyClassFilter: obj,
    };
}

export function updateMyClassServiceID(str) {
    return {
        type: types.MYCLASS_SERVICE_ID,
        myClassServiceID: str,
    };
}

export function updateMyClassClassList(obj) {
    return {
        type: types.MYCLASS_CLASS_LIST,
        myClassClassList: obj,
    };
}

export function updateMyClassMemoModifyMode(bool) {
    return {
        type: types.MYCLASS_MEMO_MODIFY_MODE,
        myClassMemoModifyMode: bool,
    };
}

export function updateMyClassQnaModifyMode(bool) {
    return {
        type: types.MYCLASS_QNA_MODIFY_MODE,
        myClassQnaModifyMode: bool,
    };
}

export function updateMyClassModifyModeTarget(str) {
    return {
        type: types.MYCLASS_MODIFY_MODE_TARGET,
        myClassModifyModeTarget: str,
    };
}

export function updateIsMyClassOwnMP3Empty(bool) {
    return {
        type: types.IS_MYCLASS_OWN_MP3_EMPTY,
        isMyClassOwnMP3Empty: bool,
    };
}

export function updateGlobalGnbMenu(str) {
    return {
        type: types.GLOBAL_GNB_MENU,
        globalGnbMenu: str,
    };
}
