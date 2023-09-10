
//let SocialShare = from('react-native').NativeModules.SocialShare;
import { NativeModules } from 'react-native';
//const SocialShare = NativeModules.SocialShare;
const { SocialShare } = NativeModules;

module.exports = {
    shareOnTwitter: function(params, callback) {
        if (!(params['link'] || params['text'])) {
            callback("missing_link_or_text");
        } else {
            return SocialShare.shareOntweet(params, callback);
        }
    },
    shareOnFacebook: function(params, callback) {
        if (!(params['link'] || params['text'])) {
            callback("missing_link_or_text");
        } else {
            return SocialShare.shareOnFacebook(params, callback);
        }
    },
    shareOnInstagram : 
      function(params, callback) {
        if (!(params['deeplinkUrl'] || params['backgroundImage'])) {
          failureCallback("missing_deeplinkUrl_or_backgroundImage");
        } else {
            return SocialShare.shareInstaStory(params, callback);
        }
    } 

};

/*


import { NativeModules } from 'react-native';

const { RNInstagramShare } = NativeModules;

export default RNInstagramShare;

import { NativeModules } from 'react-native';
//module.exports = NativeModules.SocialShare;


module.exports = {
  shareOnTwitter: function(params, callback) {
    if (!(params['link'] || params['text'])) {
      callback("missing_link_or_text");
    } else {
      return NativeModules.SocialShare.tweet(params, callback);
    }
  },
  shareOnFacebook: function(params, callback) {
    if (!(params['link'] || params['text'])) {
      callback("missing_link_or_text");
    } else {
      return NativeModules.SocialShare.shareOnFacebook(params, callback);
    }
  }
};

*/