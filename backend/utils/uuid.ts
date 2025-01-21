import { customAlphabet } from 'nanoid';

const OTPNumbers = '0123456789';
const capNums = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const uuid4 = customAlphabet(OTPNumbers, 4);

export const uuid6 = customAlphabet(OTPNumbers, 6);

export const uuid8 = customAlphabet(capNums, 8);

export const num10 = customAlphabet(capNums, 10);

export const uuid10 = customAlphabet(alphabet, 10);

export const uuid16 = customAlphabet(alphabet, 16);

export const uuid32 = customAlphabet(alphabet, 32);

export const uuid64 = customAlphabet(alphabet, 64);
