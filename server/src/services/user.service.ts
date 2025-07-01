import UnauthorizedException from '../errors/unauthorized.exception';
import { generateToken } from '../helpers/jwt';
import prisma from '../helpers/prisma';
import Validation from '../validations/validate';
import UserValidation, { UserLogin } from './../validations/user.validation';

import { hash, compare } from 'bcryptjs';

export default class UserService{

    static async search (userId :string, search: string){ {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
            },
            where: {
                NOT: {
                    id: userId,
                },
                email: {
                    contains: search,
                    mode: 'insensitive', // Case-insensitive search
                },
            },
        });
        return users;
    }
 }

    static async register (dto: UserLogin){

        const validData = Validation.validate(UserValidation.LOGIN, dto);

        const { email, password } = validData;

        const isuserExist = await prisma.user.findUnique({
            where: {
                email   
            }
        });

        if(isuserExist){
            throw new UnauthorizedException("Email already exists");
        }

        const hashPassord = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password:hashPassord
            },
            select:{
                id: true,
                email: true,
            }
        });

        return user
    }

    static async login (dto: UserLogin){

        const validData = Validation.validate(UserValidation.LOGIN, dto);

        const { email, password } = validData;
        
        const isuserExist = await prisma.user.findUnique({
            where: {
                email   
            }
        });

        if(!isuserExist){
            throw new UnauthorizedException("Email or password is incorrect");
        }

        const isPasswordMatch = await compare(password, isuserExist.password);

        if(!isPasswordMatch){
            throw new UnauthorizedException("Email or password is incorrect");
        }

        return {
            token : generateToken(isuserExist.id),
        }
    }
}