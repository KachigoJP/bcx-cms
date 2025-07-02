import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as crypto from 'crypto';
import { CookieOptions, Response } from 'express';
import { pick } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Source
import { UserService } from '@apps/user/user.service';
import { REDIS_PREFIX } from './auth.constant';
import { encryptPassword, isPasswordMatch } from '@utils/bcrypt';
// import { RedisService } from '@services/redis/redis.service';
import { TwoFactorService } from '@services/two-factor/2fa.service';
// import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
// import { RedisService } from '../share/services/redis/redis.service';
// import { IUserPayload } from '@share/common/app.interface';
// import { TwoFactorService } from '@share/services/two-factor/2fa.service';
import { UserEntity } from '../user/entities/user.entity';
// import {
//   EMAIL_TITLE,
//   FORGOT_PASSWORD_LINK_JWT_EXPIRATION_MINUTES,
//   HOST_NAME,
//   TWO_FACTOR_AUTHENTICATION_APP_NAME,
// } from '../configs/constant.config';
// import { TwoFaDto } from './dto/two-fa.dto';
// import { RecaptchaService } from '@share/services/recaptcha/recaptcha.service';
import { AUTH_ERROR, USER_ERROR } from '@messages/index';
import { LOGIN_EXPIRED_MINUTES, NODE_ENV, WILDCARD_DOMAIN } from '@config/constants';
// import { ForgotPasswordDto } from './dto/forgotPassword.dto';
// import { SendMailDto } from '../user/dto/send-mail.dto';
// import { EmailType } from '@share/enum/email-type.enum';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ERROR_MESSAGE, MESSAGES } from '@share/common/app.const';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    // private readonly redisService: RedisService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async login(user: UserEntity, response: Response): Promise<Partial<any>> {
    try {
      // Check recaptcha validate
      // const recaptchaService = new RecaptchaService(dto.recaptchaResponse);
      // const reVerify = await recaptchaService.verify();
      // if (!reVerify)
      //   throw new HttpException(
      //     USER_ERROR.RECAPTCHA_INVALID,
      //     HttpStatus.BAD_REQUEST,
      //   );

      // if (user.isResetPassword) {
      //   const { lastName: name, email: to } = user;
      //   const dataPendingToSend: SendMailDto = {
      //     type: 'reset-password-success',
      //     data: {
      //       name,
      //     },
      //     to,
      //     subject: EMAIL_TITLE.FORGOT_PASSWORD,
      //   };
      //   await this.userService.sendMail(dataPendingToSend);
      //   user.isResetPassword = false;
      //   await this.userRepository.save(user);
      // }

      // if (user.is2FAEnabled) {
      //   return {
      //     is2FAEnabled: user.is2FAEnabled,
      //     id: user.id,
      //   };
      // }
      const userData = pick(user, ['id', 'email']);
      const token = await this.signPayload(userData);

      const cookieOption: CookieOptions = {
        maxAge: LOGIN_EXPIRED_MINUTES * 60 * 1000,
        secure: true,
        sameSite: NODE_ENV === "production" ? "strict" : "none"
      }
      
      if (WILDCARD_DOMAIN) {
        cookieOption.domain = WILDCARD_DOMAIN
      }

      response.cookie('token', token, {
        ...cookieOption,
        httpOnly: true,
      });

      response.cookie('user', btoa(JSON.stringify(userData)), cookieOption);

      return {
        message: 'Success',
        data: user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // async signIn(dto: SignInDto) {
  //   const user = await this.userService.login(dto);
  // }

  async logout(response: Response): Promise<any> {
    try {
      response.cookie('token', '', { expires: new Date() });
      response.cookie('user', '', { expires: new Date() });

      return {
        message: 'Success',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async authenticate(email: string, password: string): Promise<any> {
    console.log("email", email)
    const user: UserEntity = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new HttpException(
        AUTH_ERROR.USER_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new HttpException(
        AUTH_ERROR.INVALID_CREDENTIAL,
        HttpStatus.BAD_REQUEST,
      );
    }

    // if (!user.isVerified) {
    //   throw new HttpException(
    //     USER_ERROR.USER_NOT_ACTIVE,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    return user;
  }

  // async checkEmailExits(email: string) {
  //   return this.userService.checkEmailExits(email);
  // }

  // async verify2FaAfterLogin(id: string, dto: TwoFaDto) {
  //   const userFound = await this.userRepository.findOne(
  //     { id },
  //     { relations: ['language'] },
  //   );
  //   if (!userFound)
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   if (!this.verifyTwoFa(userFound, dto)) {
  //     throw new HttpException(
  //       'You entered an incorrect code. Please try again.',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const token = await this.signPayload({
  //     id: userFound.id,
  //     walletAddress: userFound.walletAddress,
  //     accountLevel: userFound.accountLevel,
  //     isAgency: userFound.isAgency,
  //   });
  //   return {
  //     user: {
  //       id: userFound.id,
  //       firstName: userFound.firstName,
  //       email: userFound.email,
  //       lastName: userFound.lastName,
  //       gender: userFound.gender,
  //       dateOfBirth: userFound.dateOfBirth,
  //       applicantType: userFound.applicantType,
  //       country: userFound.country,
  //       region: userFound.region,
  //       city: userFound.city,
  //       district: userFound.district,
  //       affiliateCode: userFound.affiliateCode,
  //       accountNumber: userFound.accountNumber,
  //       accountLevel: userFound.accountLevel,
  //       walletAddress: userFound.walletAddress,
  //       is2FAEnabled: userFound.is2FAEnabled,
  //       isInformationUpdated: userFound.isInformationUpdated,
  //       address: userFound.address,
  //       streetNo: userFound.streetNo,
  //       phoneCode: userFound.phoneCode,
  //       phoneNumber: userFound.phoneNumber,
  //       language: userFound?.language?.code,
  //       apartment: userFound.apartment,
  //       postcode: userFound.postcode,
  //       isKyc: userFound.isKyc,
  //       isAgency: userFound.isAgency,
  //     },
  //     token,
  //   };
  // }

  // async signUp(signUpDto: SignUpDto) {
  //   return this.userService.createUser(signUpDto);
  // }

  async signPayload(payload: UserEntity): Promise<string> {
    try {
      const token = this.jwtService.sign(payload);
      // const decoded: any = this.jwtService.decode(token);
      // const key = `${REDIS_PREFIX}${decoded.id}`;

      // if (decoded.exp) {
      //   await this.redisService.setExpire(
      //     key,
      //     'true',
      //     'EX',
      //     Math.floor(decoded.exp - Date.now() / 1000),
      //   );
      // } else {
      //   await this.redisService.set(key, 'true');
      // }

      return token;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // async verify(id: string) {
  //   return this.userService.verify(id);
  // }

  // async getQrImageCode(user: IUserPayload) {
  //   try {
  //     const userFound = await this.userRepository.findOne({ id: user.id });
  //     if (!userFound) throw new HttpException('', HttpStatus.NOT_FOUND);
  //     if (!userFound.faSecret) {
  //       const secret = this.twoFactorService.generateSecret();
  //       await this.userRepository.save({
  //         id: userFound.id,
  //         faSecret: secret,
  //       });
  //       userFound.faSecret = secret;
  //     }
  //     const otpAuth = this.twoFactorService.generateOTPToken({
  //       username: userFound.email,
  //       serviceName: TWO_FACTOR_AUTHENTICATION_APP_NAME,
  //       secret: userFound.faSecret,
  //     });
  //     const qrCodeImage = this.twoFactorService.generateQRCode(otpAuth);
  //     return qrCodeImage;
  //   } catch (e) {
  //     throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // verifyTwoFa(user: User, dto: TwoFaDto) {
  //   try {
  //     const isValid = this.twoFactorService.verifyOTPToken({
  //       token: dto.otpToken.toString(),
  //       secret: user.faSecret,
  //     });
  //     return isValid;
  //   } catch (e) {
  //     throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async forgotPasswordRequest(dto: ForgotPasswordDto) {
  //   try {
  //     //recaptchaService
  //     const recaptchaService = new RecaptchaService(dto.recaptchaResponse);
  //     const reVerify = await recaptchaService.verify();
  //     if (!reVerify)
  //       throw new HttpException(
  //         USER_ERROR.RECAPTCHA_INVALID,
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     const email = dto.email;
  //     const user = await this.userRepository.findOne({
  //       email,
  //     });
  //     //check if user with email exist
  //     if (!user) {
  //       throw new HttpException(
  //         USER_ERROR.USER_NOT_FOUND,
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     //generate confirmationCode with 5 digits
  //     const confirmationCode = this.securityCodeGeneration();
  //     const exp = moment()
  //       .add(FORGOT_PASSWORD_LINK_JWT_EXPIRATION_MINUTES, 'minutes')
  //       .unix();
  //     //encode token to send email
  //     const emailToken = this.userService.encodeEmailToken(
  //       confirmationCode,
  //       user,
  //       EmailType.FORGOT_PASSWORD,
  //       String(exp),
  //     );
  //     //generate link to call api change password
  //     const forgotPasswordUrl = `${HOST_NAME}/auth/reset-password/?emailToken=${emailToken}`;
  //     const { lastName: name, accountNumber, email: to } = user;
  //     //pending to send email
  //     const dataPendingToSend: SendMailDto = {
  //       type: 'forgot-password',
  //       data: {
  //         link: forgotPasswordUrl,
  //         name,
  //         accountNumber,
  //         code: confirmationCode,
  //       },
  //       to,
  //       subject: EMAIL_TITLE.CHANGE_PASSWORD,
  //     };

  //     await this.userService.sendMail(dataPendingToSend);

  //     //set confirmationCode expiration according to email token corresponding
  //     await this.setConfirmationCodeExpired(emailToken);
  //     return {
  //       dataPendingToSend,
  //       emailToken,
  //     };
  //   } catch (e) {
  //     throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // securityCodeGeneration(): string {
  //   return parseInt(crypto.randomBytes(3).toString('hex'), 16)
  //     .toString()
  //     .substr(0, 5);
  // }

  // async resetPassword(emailToken: string, dto: ResetPasswordDto) {
  //   try {
  //     const decoded: any = this.userService.decodeEmailToken(emailToken);
  //     await this.checkIfConfirmationCodeExpired(decoded);
  //     const confirmationCodeFromEmail = decoded.claims.confirmationCode;
  //     //check if input confirm code match with confirmation Code From Email
  //     if (dto.confirmationCode !== confirmationCodeFromEmail)
  //       throw new HttpException(
  //         MESSAGES.MSG_002('確認コード'),
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     const { dateOfBirth, password } = dto;
  //     //check if user is valid
  //     const user = await this.userRepository
  //       .createQueryBuilder(`user`)
  //       .where(`DATE_TRUNC('day', "date_of_birth") = :date`, {
  //         date: `${dateOfBirth.toDateString()}`,
  //       })
  //       .andWhere(`user.id = :id`, {
  //         id: decoded.sub,
  //       })
  //       .getOne();

  //     if (!user)
  //       throw new HttpException(
  //         MESSAGES.MSG_002('生年月日'),
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     //check if new password and old password match
  //     const isOldPassword = await isPasswordMatch(password, user.password);
  //     if (isOldPassword)
  //       throw new HttpException(MESSAGES.MSG_044, HttpStatus.BAD_REQUEST);
  //     user.password = await encryptPassword(password);
  //     user.isVerified = true;
  //     user.resetPasswordRecently = true;
  //     await this.userRepository.save(user);
  //     //after update successfully , set confirmCodeExpired
  //     const key = `${REDIS_PREFIX}${decoded.claims.confirmationCode}`;
  //     await this.redisService.del(key);

  //     return {
  //       message: `success`,
  //     };
  //   } catch (e) {
  //     throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async setConfirmationCodeExpired(token: any) {
  //   const decoded: any = this.jwtService.decode(token);
  //   const key = `${REDIS_PREFIX}${decoded.claims.confirmationCode}`;
  //   if (decoded.exp) {
  //     await this.redisService.setExpire(
  //       key,
  //       'true',
  //       'EX',
  //       Math.floor(decoded.exp - Date.now() / 1000),
  //     );
  //   } else {
  //     await this.redisService.set(key, 'true');
  //   }
  // }

  // async checkIfConfirmationCodeExpired(decoded: any) {
  //   try {
  //     const key = `${REDIS_PREFIX}${decoded.claims.confirmationCode}`;
  //     const check = await this.redisService.get(key);
  //     if (!check) {
  //       throw new HttpException(
  //         MESSAGES.MSG_002('確認コード'),
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   } catch (e) {
  //     throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async verifyForgotPasswordURL(emailToken: string) {
  //   const decoded: any = this.userService.decodeEmailToken(emailToken);
  //   if (Date.now() >= decoded.exp * 1000) {
  //     throw new HttpException(
  //       ERROR_MESSAGE.INVALID_URL,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   return `success`;
  // }
}
