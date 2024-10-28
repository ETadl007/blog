import * as userService from './user.service.js';
import { filterSensitive } from '../utils/sensitive.js'
import { randomNickname } from '../utils/tool.js'

/**
 * 用户注册
 */

export const store = async (req, res, next) => {

    let { username, password, role=2, nick_name } = req.body;

    // 过滤敏感词
    nick_name = await filterSensitive(nick_name);

    // 随机生成昵称
    nick_name = nick_name ? nick_name : randomNickname("007的小迷弟");

    
    const params = [username, password, role, nick_name]

    try {
        const user = await userService.createUser(params);
        res.send({
            status: 0,
            message: '注册成功',
            data: user
        });
    }catch (err) {
        console.log(err);
        next(new Error('ILLEGAL_USER_NAME'))
    }
}

/**
 * 获取用户信息
 */

export const getUserInfoById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserinfo(id);
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: user
        });
        
    }catch (err) {
        console.log(err);
        next(new Error('GET_USER_INFO_FAILED'))
    }
}

/**
 * 更新当前登录用户信息
 */

export const updateOwnUserInfo = async (req, res, next) => {
    
    let { id, nick_name, avatar } = req.body
    
    // 过滤敏感词
    nick_name = await filterSensitive(nick_name);
    
    try {
        const user = await userService.updateOwnUserInfo({nick_name, avatar, id});

        res.send({
            status: 0,
            message: '修改用户成功',
            data: user
        });
    }catch (err) {
        console.log(err);
        next(new Error('UPDATE_USER_INFO_FAILED'))
    }

}

/**
 * 修改密码
 */

export const updatePassword = async (req, res, next) => {

    const { id, password } = req.username
    
    try {
        const user = await userService.updatePassword(id, password);
        res.send({
            status: 0,
            message: '修改密码成功',
            data: user
        });
    }catch (err) {
        console.log(err);
        next(new Error('UPDATE_PASSWORD_FAILED'))
    }
}