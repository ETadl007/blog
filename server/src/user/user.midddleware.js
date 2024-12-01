import bcrypt from 'bcryptjs';
import * as userService from './user.service.js';


/**
 * 校验用户名和密码是否合法
 */
export const userValidate = async (req, res, next) => {
    const { username, password } = req.body;

    // 验证必填数据
    if (!username) return next(new Error('NAME_IS_REQUIRED'))
    if (!password) return next(new Error('PASSWORD_IS_REQUIRED'))

    if (!/^[A-Za-z0-9]+$/.test(username)) {
        return next(new Error('NAME_CAN_ONLY_CONTAIN_LETTERS_AND_NUMBERS'))
    }

    next();
}

/**
 * 校验用户名是否已经注册过
 */
export const verifyUser = async (req, res, next) => {
    const { username } = req.body;
    try {

        if (username == 'admin') {
            console.log('admin已存在');
            return next(new Error('ADMIN_NAME_CANNOT_BE_USED'))
        }

        // 验证用户名是否存在        
        const user = await userService.getUserByName(username);
        if (user) return next(new Error('USER_ALREADY_EXISTS'))

    } catch (error) {
        return next(new Error('USER_NOT_FOUND'))
    }
    // 下一步
    next();
}

/**
 *  HASH 密码
 */
export const hashPassword = async (req, res, next) => {
    const { password } = req.body;

    // HASH 密码
    req.body.password = await bcrypt.hash(password, 10);

    next();
}

/**
 * 判断用户名和密码匹配
 */
export const verifyLogin = async (req, res, next) => {

    const { username, password } = req.body;

    try {
        if (username !== 'admin') {

            if (username === '') return next(new Error('NAME_IS_REQUIRED'))

            // 检查用户是否提供密码
            if (password === '') return next(new Error('PASSWORD_IS_REQUIRED'))

            // 调取用户数据
            const user = await userService.getUserByName(username, { password: true });

            // 验证用户是否存在
            if (!user) return next(new Error('USER_DOES_NOT_EXISTS'))

            // 验证密码是否匹配
            const matched = await bcrypt.compare(password, user.password)

            if (!matched) {
                return next(new Error('PASSWORD_DOES_NOT_MATCH'))
            }

        }

    } catch (error) {
        return next(new Error('USER_NOT_FOUND'))
    }

    // 下一步
    next();

}

/**
 * 
 */
export const verifyUpdatePassword = async (req, res, next) => {
    try {
        const { password, password1, password2 } = req.body;

        const { username } = req.username

        if (username !== 'admin') {

            if (password1 != password2 ) return next(new Error('PASSWORDS_DO_NOT_MATCH'))

            // 验证用户是否提供正确的旧密码
            const user = await userService.getUserById(id, { password: true });

            // 验证用户是否存在
            if (!user) return next(new Error('USER_DOES_NOT_EXISTS'))

            // 验证密码是否匹配
            const matched = await bcrypt.compare(password, user.password)
            if (!matched) {
                return next(new Error('PASSWORD_DOES_NOT_MATCH'))
            }
        }else {
            return next(new Error('ADMIN_CANNOT_UPDATE_PASSWORD'))
        }

    } catch (error) {
        return next(new Error('USER_NOT_FOUND'))
    }

    // 下一步
    next();

}