import types from '../types';

const defaultState = {
    isNetworking : true,
    selectBook : {},
    nowScrollY : 0,
    topFavoriteMenu : true,
    mypageSelectedTabsLnb : true,
    showBottomBar : false,
    myTopFilter : {},
    reviewSelectDataCourse : {},
    reviewFilterDataCourse : {},
    reviewSelectDataPass : {},
    reviewFilterDataPass : {},
    recommFilterData : {},
    recommSelectData : {},
    textbookFilterData : {},
    textbookSelectData : {},
    userToken: {},
    textBookFocusHeight : 0,
    myClassProductFilter: {},
    myClassApplyClassFilter: {},
    myClassClassList: [],
    myClassServiceID: '',
    myClassModifyModeTarget: 'qna',
    myClassMemoModifyMode: false,
    myClassQnaModifyMode: false,
    isMyClassOwnMP3Empty: true,
    myInterestCodeOne : [],
    myInterestCodeMulti : {},
    myInterestCodeNotice : {},
    newsUnreadCount : 0,
    newsData : {},
    isDrawerOpen : false,
    globalGnbMenu : '',
}

export default StatusReducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.GLOBAL_STATUS_SELECT_BOOK:
            return {     
                ...state,
                selectBook : action.return_selectBook
        };
        case types.GLOBAL_IS_DRAWER_OPEN:
            return {     
                ...state,
                isDrawerOpen : action.return_isDrawerOpen
        };
        case types.GLOBAL_NEWS_UNREAD_COUNT:
            return {     
                ...state,
                newsUnreadCount : action.return_newsUnreadCount
        };
        case types.GLOBAL_NEWS_DATA:
            return {     
                ...state,
                newsData : action.return_newsData
        };
        case types.MYPAGE_SELECTED_TABS_LNB:
            return {     
                ...state,
                mypageSelectedTabsLnb : action.return_mypageSelectedTabsLnb
        };
        case types.GLOBAL_MYINTEREST_CODE_ONE:
            return {     
                ...state,
                myInterestCodeOne : action.return_myInterestCodeOne
        };
        case types.GLOBAL_MYINTEREST_CODE_MULTI:
            return {     
                ...state,
                myInterestCodeMulti : action.return_myInterestCodeMulti
        };
        case types.GLOBAL_MYINTEREST_CODE_NOTICE:
            return {     
                ...state,
                myInterestCodeNotice : action.return_myInterestCodeNotice
        };
        case types.GLOBAL_STATUS_NETWORKING:
            return {     
                ...state,
                isNetworking : action.return_isnetworking
        };
        case types.GLOBAL_STATUS_TOP_FAVORITE_MENU:
            return {     
                ...state,
                topFavoriteMenu : action.return_topfavoritemenu
        };
        case types.GLOBAL_STATUS_NOW_SCROLLY:
            return {     
                ...state,
                nowScrollY : action.return_nowscrolly
        };
        case types.GLOBAL_STATUS_SHOW_BOTTOM_BAR:
        return {     
            ...state,
            showBottomBar : action.return_showbottombar
        };
        case types.GLOBAL_STATUS_USER_TOKEN:
            return {     
            ...state,
            userToken : action.return_usertoken
        };
        case types.GLOBAL_STATUS_TEXTBOOK_FOUCS_HEIGHT : 
            return {
                ...state,
                textBookFocusHeight : action.return_textBookFocusHeight
        }
        case types.REVIEW_SELECT_DATA_COURSE : 
            return {
                ...state,
                reviewSelectDataCourse : action.return_reviewSelectDataCourse
        }
        case types.REVIEW_FILTER_DATA_COURSE : 
            return {
                ...state,
                reviewFilterDataCourse : action.return_reviewFilterDataCourse
        }
        case types.REVIEW_SELECT_DATA_PASS : 
            return {
                ...state,
                reviewSelectDataPass : action.return_reviewSelectDataPass
        }
        case types.REVIEW_FILTER_DATA_PASS : 
            return {
                ...state,
                reviewFilterDataPass : action.return_reviewFilterDataPass
        }

        case types.RECOMM_FILTER_DATA : 
            return {
                ...state,
                recommFilterData : action.return_recommFilterData
        }
        case types.RECOMM_SELECT_DATA : 
            return {
                ...state,
                recommSelectData : action.return_recommSelectData
        }

        case types.TEXTBOOK_FILTER_DATA : 
            return {
                ...state,
                textbookFilterData : action.return_textbookFilterData
        }
        case types.TEXTBOOK_SELECT_DATA : 
            return {
                ...state,
                textbookSelectData : action.return_textbookSelectData
        }
        case types.GLOBAL_STATUS_MY_TOP_FILTER : 
            return {
                ...state,
                myTopFilter : action.return_myTopFilter
            }
        case types.MYCLASS_PROPDUCT_FILTER : 
            return {
                ...state,
                myClassProductFilter : action.myClassProductFilter
            }
        case types.MYCLASS_APPLYCLASS_FILTER : 
            return {
                ...state,
                myClassApplyClassFilter : action.myClassApplyClassFilter
            }
        case types.MYCLASS_SERVICE_ID : 
            return {
                ...state,
                myClassServiceID : action.myClassServiceID
            }
        case types.MYCLASS_CLASS_LIST : 
            return {
                ...state,
                myClassClassList : action.myClassClassList
            }
        case types.MYCLASS_MODIFY_MODE_TARGET :
            return {
                ...state,
                myClassModifyModeTarget : action.myClassModifyModeTarget
            }
        case types.MYCLASS_MEMO_MODIFY_MODE :
            return {
                ...state,
                myClassMemoModifyMode : action.myClassMemoModifyMode
            }
        case types.MYCLASS_QNA_MODIFY_MODE :
            return {
                ...state,
                myClassQnaModifyMode : action.myClassQnaModifyMode
            }
        case types.IS_MYCLASS_OWN_MP3_EMPTY :
            return {
                ...state,
                isMyClassOwnMP3Empty : action.isMyClassOwnMP3Empty
            }
        case types.GLOBAL_GNB_MENU :
            return {
                ...state,
                globalGnbMenu : action.globalGnbMenu
            }
        default:
            return state;
    }
};
