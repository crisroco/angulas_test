let  KEY = "g$@p3Xnh$E";

export function Chr(codePt) {
    if (codePt > 0xFFFF) {
        codePt -= 0x10000
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF))
    }
    return String.fromCharCode(codePt);
}

export function Encrypt(clave: any, key: any) {
    var resulta = '';
    var char = '';
    var key_char = '';
    for (var i = 0; i < clave.length; i++) {
        char = clave.substr(i, 1);
        key_char = key.substr((i % key.length) - 1, 1)
        char = Chr(char.charCodeAt(0) + key_char.charCodeAt(0))
        resulta += char;
    }
    return btoa(resulta);
}

export function Decrypt(clave, key = "g$@p3Xnh$E") {
    var resulta = '';
    var clave_decode = a2b(clave);
    var char = '';
    var key_char = '';
    for (var i = 0; i < clave_decode.length; i++) {
        char = clave_decode.substr(i, 1);
        key_char = key.substr((i % key.length) - 1, 1);
        char = Chr(char.charCodeAt(0) - key_char.charCodeAt(0))
        resulta += char;
    }
    return resulta;
}

export function GetFormUrlEncoded(toConvert) {
    const formBody = [];
    for (const property in toConvert) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(toConvert[property]);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
}

export function b2a(a) {
    var c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
    if (!a) return a;
    do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e,
    f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < a.length);
    return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) : m) + "===".slice(o || 3);
}

export function a2b(a) {
    console.log(a);
    var b, c, d, e = {}, f = 0, g = 0, h = "", i = String.fromCharCode, j = a.length;
    for (b = 0; 64 > b; b++) e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
    for (c = 0; j > c; c++) for (b = e[a.charAt(c)], f = (f << 6) + b, g += 6; g >= 8;) ((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h += i(d));
    return h;
}