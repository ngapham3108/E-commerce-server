import { sign, verify } from 'jsonwebtoken';
import { hash, verify as argon_verify } from 'argon2';

export const createAccessToken = (userId: string) => {
  return sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};
export const createRefreshAccessToken = (userId: string) => {
  return sign({ userId }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const generatePassword = async (password: string) => {
  return hash(password);
};

export const verifyRefreshAccessToken = async (token: string) => {
  return verify(token, process.env.REFRESH_JWT_SECRET);
};

export const verifyAccessToken = async (token: string) => {
  return verify(token, process.env.JWT_SECRET);
};

export const comparePassword = async (
  password: string,
  hashPassword: string,
) => {
  return argon_verify(hashPassword, password);
};
