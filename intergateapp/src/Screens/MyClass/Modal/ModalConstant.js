const TARGET_FROM_NONE      = 'none';
const TARGET_FROM_MAIN      = 'main';
const TARGET_FROM_LEC       =  'lec';
const TARGET_FROM_LEC_MEMO  =  'lec_memo';
const TARGET_FROM_LEC_KANG  = 'lec_kang';

const TARGET = {
    FROM_NONE: 'none',
    //FROM_MAIN: 'main',
    FROM_LEC: 'lec',
    FROM_LEC_MEMO: 'lec_memo',
    FROM_LEC_KANG: 'lec_kang',
    FROM_REOPEN: 're_open',
    FROM_CREATE: 'create',
}

export { TARGET };

const ARTICLE = {
    TYPE: {
        NAME: 'type_article',
        NOTICE: 'notice',
        NORMAL: 'normal',
    },
    STATE: {
        NAME: 'replyStatus',
        UNSOLVED: '답변대기',
        UNSOLVED_NAME: '답변대기',
        SOLVED: '답변완료',
        SOLVED_NAME: '답변완료',
    },
    PERM: {
        NAME: 'perm_article',
        OPEN: 'open',
        SECRET: 'secret',
    },
}

export { ARTICLE };