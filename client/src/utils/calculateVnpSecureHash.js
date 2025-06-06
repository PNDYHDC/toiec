import CryptoJS from 'crypto-js';
export const calculateVnpSecureHash = (sortedParams, secretKey) => {
    // Sử dụng HMAC SHA512 để mã hóa
    const vnp_SecureHash = CryptoJS.HmacSHA512(sortedParams, secretKey).toString(CryptoJS.enc.Hex);

    return vnp_SecureHash;
};
