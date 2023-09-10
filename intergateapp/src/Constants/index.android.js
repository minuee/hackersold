const DEFAULT_CONSTANTS = {
    appID : 'integrateapp',
    appName : '해커스ONE',
    logourl : null,
    hideTopHeight: 40,
    topHeight: 90,
    androidPackageName : 'com.hackers.integrateapp',
    iosBundleId : 'kr.co.hackers.integrateapp',
    baseColor : '#28a5ce', //RGB Theme Color

    gnbMenuReviewCourseCode : '005',
    gnbMenuReviewPassCode : '007',

    localPushIntervalTime : 600000, //60000 60s
    
    // https://github.com/moonspam/NanumSquare
    // defaultFontFamily : 'NanumSquareL',         // Light,
    // defaultFontFamilyRegular : 'NanumSquareR',  // Regular, Medium
    // defaultFontFamilyBold : 'NanumSquareEB',    // Bold, Extra Bold

    defaultFontFamily : 'NotoSansKR-Regular',         // default,
    defaultFontFamilyDemiLight : 'NotoSansKR-Thin',         // Demi Light,
    defaultFontFamilyLight : 'NotoSansKR-Light',         // Light,
    defaultFontFamilyRegular : 'NotoSansKR-Regular',  // Regular
    defaultFontFamilyMedium : 'NotoSansKR-Medium',  // Medium
    defaultFontFamilyBold : 'NotoSansKR-Bold',    // Bold

    robotoFontFamilyLight : 'Roboto-Light',         // Light,
    robotoFontFamilyRegular : 'Roboto-Regular',  // Medium
    robotoFontFamilyMedium : 'Roboto-Medium',  // Regular
    robotoFontFamilyBold : 'Roboto-Bold',    // Bold, Extra Bold

    mp3playerAppStoreId : 'com.hackers.app.hackersmp3',
    aquaPlayerAppStoreId: 'com.cdn.aquanmanager',

    androidAuqaPlayer : 'com.cdn.aquanmanager',
    iosAquaPlayer : 'com.cdn.aquanmanager',
    apiTestDomain : 'https://tchamp.hackers.com',
    apiTestDomain2 : 'https://tchina.hackers.com',
    apitestKey : '83F7E0BF28C2D9917F515694B21900BF',
    adminApiKey : '2B5A42E1BFA12821F475E4FF962E541B',
    apiMP3Domain : 'https://cdnmp3.hackers.com/mp3',
    smartFinderLectureCode : 200,
    smartFinderTextBookCode : 100,

    recentlyHistoryLimit : 30,
    //fileUploadDomain : 'https://www.hackers.co.kr/?m=cs&a=integrate_file_api',
    //fileUploadDomain : 'https://www.hackers.co.kr/?m=cs&a=cs_counsel_file_api_test',
    fileUploadDomain : 'https://www.hackers.co.kr/?m=cs&a=cs_counsel_file_api',
    imageUploadDomain : 'https://www.hackers.co.kr/?m=cs&a=cs_integrate_file_api',
    //requestToHackersDomain : 'https://www.hackers.co.kr/?m=cs&a=integrate_file_api'
    //requestToHackersDomain : 'https://www.hackers.co.kr/?m=cs&a=cs_counsel_file_api_test',
    //requestToHackersDomain : 'https://www.hackers.co.kr/?m=cs&a=cs_counsel_api'
    requestToHackersDomain : 'https://www.hackers.co.kr/?m=cs&a=cs_integrate_counsel_api',

      //통합앱api
      apiAdminDomain : 'https://qapis.hackers.com',
      apiAdminKey : '2B5A42E1BFA12821F475E4FF962E541B',

     //iamport 
     iamPortAPIDomain : 'https://api.iamport.kr',
     iamPortAPIKey : '3607954518520262',
     iamPortAPISecrentKey : 'BhkwwiVPZ1DUz4rJX0X3eDhGHXFlVyXwQi3mAYbzZOtyTViQWfUaTbQA9wW55UCVcFhMEtmEiQccLv3H'

}

export { DEFAULT_CONSTANTS }

/* 단위 sp */
const DEFAULT_TEXT = {
    head_large : 23,
    head_medium : 18,
    head_small : 15,
    body_14 : 14,
    body_13 : 13,
    body_12 : 12,
    fontSize23:23,
    fontSize22:22,
    fontSize21:21,
    fontSize20:20,
    fontSize19:19,
    fontSize18:18,
    fontSize17:17,
    fontSize16:16,
    fontSize15:15,
    fontSize14:14,
    fontSize13:13,
    fontSize12:12, 
    fontSize11:11,
    fontSize10:10,
}

export { DEFAULT_TEXT }

const DEFAULT_COLOR = {
    subject_language : '#d50032',
    subject_teacher : '#00abc7',
    lecture_base : '#28a5ce',
    lecture_sub : '#3fcfff',
    base_color_fff : '#fff',
    base_color_000 : '#000',
    base_color_222 : '#222',
    base_color_444 : '#444',
    base_color_666 : '#666',
    base_color_888:'#888',
    base_color_bbb:'#bbb',
    base_color_ccc:'#ccc',
    input_bg_color2 : '#e5e6e9',
    input_border_color2 : '#eaebee',
    input_bg_color : '#f5f7f8',    
    input_border_color : '#d8d8d8',
    myclass_base: '#0e3a48',
}

export { DEFAULT_COLOR }