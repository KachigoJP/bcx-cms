import { config } from 'dotenv';

config();
export const NODE_ENV = process.env.NODE_ENV
export const WILDCARD_DOMAIN = process.env.WILDCARD_DOMAIN
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 35;
export const LIMIT_PAGE = 25;
export const LOGIN_EXPIRED_MINUTES = 10;
export const BCRYPT_HASH_ROUND = 12;
export const GMT_8_TIMEZONE = 'Asia/Hong_Kong';
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRED_IN,
};

export const RECAPTCHA_CONFIG = {
  SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
  IS_DISABLED: process.env.RECAPTCHA_DISABLED === 'true' ? true : false,
};

export const REDIS_CONFIG = {
  uri: process.env.REDIS_URI,
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
};

// import { MESSAGES } from '@share/common/app.const';

// export const USER_ERROR = {
//   DUPLICATE_EMAIL: 'This mail address already exists',
//   RECAPTCHA_INVALID: 'Please perform man-machine certification.',
//   USER_INVALID: MESSAGES.MSG_043('Eメールあるいはパスワード'),
//   USER_NOT_FOUND: 'User not found',
//   URL_INVALID: 'Url invalid',
//   LANGUAGE_NOT_FOUND: 'Language not found',
//   EMAIL_EXIST: 'email already existed',
//   OLD_PASSWORD: 'Input new Password same Old Password. Please try again!',
//   WRONG_PASSWORD: MESSAGES.MSG_043('現在パスワード'),
//   ROLE_NOT_FOUND: 'Role not found',
// };
// export const EXPIRED_TIME = 10;
// export const MS_OF_DAY = 86400000;
// export const PASSWORD_REG =
//   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// export const REQUEST_CHANGE_EMAIL_SUCCESS = `Change Email
// A notification has been sent to your new email address.
// Please click the verification URL to completely change your email address.
// ※Please note that the URL is valid for one hour. If it expires, please redo the process in order to get a new verification URL.`;
// export const USER_UPDATED_SUCCESSFULLY = `Your profile has been updated.`;
// export const USER_CREATED_SUCCESSFULLY = `Account has been created.`;
// export const PASSWORD_UPDATED = `Password has been changed`;
