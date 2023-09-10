const COMMON_STATES = {
    logourl : null,
    baseColor : '#008895', //RGB Theme Color
    baseTitleColor : '#222',
    baseSubTitleColor : '#666',
    grayFontColor:'#888',
    lectureStaturbarColor : '#28a5ce',
    baseFontSize : 15,
    baseMiddleFontSize : 18,
    baseTitleFontSize : 20,
    topHeight: 80,
    androidPackageName : 'com.hackers.integrateapp',
    iosBundleId : 'kr.co.hackers.integrateapp'
  };

const API_KEY = {
  champ: '83F7E0BF28C2D9917F515694B21900BF',
  teacher: 'DDC8F8205CA24F6BD4A541C097593EEE',
};
export const SERVICES = {
  '3090': {name: '해커스인강', domain: 'https://mchamp.hackers.com', apiDomain: 'https://qchamp.hackers.com', apiKey: API_KEY.champ},
  '3050': {name: '해커스톡', domain: 'https://mtalk.hackers.com', apiDomain: 'https://qtalk.hackers.com', apiKey: API_KEY.champ},
  '3070': {name: '해커스중국어', domain: 'https://mchina.hackers.com', apiDomain: 'https://qchina.hackers.com', apiKey: API_KEY.champ},
  '3095': {name: '해커스 프렙', domain: 'https://mprep.hackers.com', apiDomain: 'https://qprep.hackers.com', apiKey: API_KEY.champ},
  // '3045': {name: '해커스임용', domain: 'https://mteacher.hackers.com', apiDomain: 'https://qteacher.hackers.com', apiKey: API_KEY.teacher},
  // TODO:: mqtescher -> mteacher
  '3045': {name: '해커스임용', domain: 'https://mqteacher.hackers.com', apiDomain: 'https://qteacher.hackers.com', apiKey: API_KEY.teacher},
  '3040': {name: '해커스공무원', domain: 'https://mgosi.hackers.com', apiDomain: 'https://gosi.hackers.com', apiKey: API_KEY.teacher},
  '3030': {name: '해커스경찰', domain: 'https://mpolice.hackers.com', apiDomain: 'https://police.hackers.com', apiKey: API_KEY.teacher},
  '3230': {name: '해커스소방', domain: 'https://mfire.hackers.com', apiDomain: 'https://fire.hackers.com', apiKey: API_KEY.teacher},
  '3075': {name: '해커스일본어', domain: 'https://mjapan.hackers.com', apiDomain: 'https://japan.hackers.com', apiKey: API_KEY.champ},
  '3080': {name: '해커스 취업아카데미 평생교육원', domain: 'https://mjob.hackers.com', apiDomain: 'https://job.hackers.com', apiKey: ''},
  '3060': {name: '해커스 공인중개사', domain: 'https://mland.hackers.com', apiDomain: 'https://land.hackers.com', apiKey: ''},
  '3310': {name: '해커스자격증', domain: 'https://pass.hackers.com', apiDomain: 'https://pass.hackers.com', apiKey: ''},
  '3150': {name: '해커스금융', domain: 'https://mfn.hackers.com', apiDomain: 'https://fn.hackers.com', apiKey: ''},
};

  //export type CommonState = $Keys<typeof COMMON_STATES>;
  export default COMMON_STATES;

  /*
  custom Font
  /asset/Fonts
  NanumSquareEB
  NanumSquareB
  NanumSquareL
  NanumSquareR
  이상 네이버 폰트

  GodoB
  GodoM
  이상 고도체
  */
 