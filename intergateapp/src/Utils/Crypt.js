class Crypt {
    static keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    static CHAMP_KEY = 'gP7qls2sla@dl(wks0ekd!!'

    // hackersingang/_core/class/hackers_crypt.php 컨버팅
    /*
    public static function encrypt($string, $key) {
        $result = '';
        for($i=0; $i<strlen($string); $i++) {
            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % strlen($key))-1, 1);
            $char = chr(ord($char)+ord($keychar));
            $result .= $char;
        }
        return urlencode(base64_encode($result));
    }
    */

    static encrypt(string, key = Crypt.CHAMP_KEY): string {
        //console.log('encrypt', 'string = ' + string)
        let result = '';
        for(let i = 0; i < string.length; i++) {
            let char = string.substr(i, 1);
            let keychar = key.substr((i % key.length)-1, 1);
            char = String.fromCharCode(char.charCodeAt(0)+keychar.charCodeAt(0));
            result = result + '' + char;
        }

        return encodeURI(Crypt.base64Encode(result));
    }

    // 출처 https://github.com/eranbo/react-native-base64/blob/master/base64.js
    static base64Encode(input): string {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                Crypt.keyStr.charAt(enc1) +
                Crypt.keyStr.charAt(enc2) +
                Crypt.keyStr.charAt(enc3) +
                Crypt.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    }
}

module.exports = Crypt;