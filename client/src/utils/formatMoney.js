export const formatMoney = (number) => number?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
