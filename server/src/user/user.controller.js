import * as userService from './user.service.js';
import { filterSensitive } from '../utils/sensitive.js'
import { randomNickname } from '../utils/tool.js'
import { PAGE_SIZE, PRIVATE_KEY, ADMIN_PASSWORD } from '../app/app.config.js'
import { signToken } from "../auth/auth.service.js";
import jwt from 'jsonwebtoken';

import { connecttion } from '../app/database/mysql.js';

/**
 * 用户登录
 */

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (username == "admin") {
            if (password == ADMIN_PASSWORD) {
                res.send({
                    status: 0,
                    message: "超级管理员登录成功",
                    data: {
                        id: 1314520,
                        username: "超级管理员",
                        role: 1,
                        avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                        nick_name: "超级管理员",
                        token: jwt.sign({ id: 1314520, nick_name: "超级管理员", role: 1, username: "admin" }, PRIVATE_KEY, { algorithm: "RS256", expiresIn: '1h' })
                    }
                })
            } else {
                return res.status(500).send({
                    status: 1,
                    message: "密码错误"
                })
            }
        } else {
            const user = await userService.getUserByName(username);

            const payload = { id: user.id, username: user.username, role: user.role, nick_name: user.nick_name, avatar: user.avatar };

            res.send({
                status: 0,
                message: "用户登录成功",
                data: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    avatar: user.avatar,
                    nick_name: user.nick_name,
                    token: signToken({ payload })
                }
            })
        }

    } catch (err) {
        console.log(err);
        next(new Error("LOGIN_FAILED"))
    }

}

/**
 * 用户注册
 */

export const store = async (req, res, next) => {

    let { username, password, role = 2, nick_name } = req.body;

    // 过滤敏感词
    nick_name = await filterSensitive(nick_name);

    // 随机生成昵称
    nick_name = nick_name ? nick_name : randomNickname("007的小迷弟");

    try {
        const user = await userService.createUser({ username, password, role, nick_name });
        res.send({
            status: 0,
            message: '注册成功',
            data: user
        });
    } catch (err) {
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
        if (id === 'undefined') {
            return next(new Error('GET_USER_INFO_FAILED'))
        }

        if (id == 1314520) {
            return res.send({
                status: 0,
                message: '获取用户信息成功',
                data: {
                    id: 1314520,
                    username: "超级管理员",
                    role: 1,
                    avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                    nick_name: "超级管理员",
                    qq: "123456",
                    ipAddress: "火星"
                }
            })
        } else {
            const user = await userService.getUserinfo(id);
            res.send({
                status: 0,
                message: '获取用户信息成功',
                data: user
            });
        }
    } catch (err) {
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
        const user = await userService.updateOwnUserInfo({ nick_name, avatar, id });

        res.send({
            status: 0,
            message: '修改用户成功',
            data: user
        });
    } catch (err) {
        console.log(err);
        next(new Error('UPDATE_USER_INFO_FAILED'))
    }

}

/**
 * 修改密码
 */

export const updatePassword = async (req, res, next) => {

    try {
        const { id, password } = req.username
        const user = await userService.updatePassword(id, password);
        res.send({
            status: 0,
            message: '修改密码成功',
            data: user
        });
    } catch (err) {
        console.log(err);
        next(new Error('UPDATE_PASSWORD_FAILED'))
    }
}

/**
 * 分页获取用户列表
 */
export const getUserList = async (req, res, next) => {

    try {

        const { current, size, nick_name, role } = req.body;

        // 每页内容数量
        const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

        // 偏移量
        const offset = (current - 1) * limit;

        const result = await userService.getUserList({ nick_name, role, limit, offset });

        res.send({
            status: 0,
            message: '获取用户列表成功',
            data: {
                current,
                size,
                list: result,
                total: result.length
            }
        });
    } catch (err) {
        console.log(err);
        next(new Error('GET_USER_LIST_FAILED'))
    }
}


/**
 * 修改角色
 */
export const updateRole = async (req, res, next) => {

    try {
        const { id, role } = req.params;
        const user = await userService.updateRole(id, role);
        res.send({
            status: 0,
            message: '修改角色成功',
            data: user
        });
    } catch (err) {
        console.log(err);
        next(new Error('UPDATE_ROLE_FAILED'))
    }
}

/**
 * 管理员根据用户id修改用户的信息
 */
export const adminUpdateUserInfo = async (req, res, next) => {

    // 用于管理事务的连接
    let connection;
    try {
        // 从连接池获取连接
        connection = await connecttion.promise().getConnection();
        // 开启事务 方便回滚
        await connection.beginTransaction();

        const { id, avatar } = req.body;

        const one = await userService.getUserinfo(id);

        // 删除服务器原来的头像
        if (one.avatar && one.avatar != avatar) {
            await userService.deleteOnlineImgs([one.avatar])
        }

        const result = await userService.adminUpdateUserInfo(req.body);
        res.send({
            status: 0,
            message: '管理员修改用户信息成功',
            data: result
        });

        // 提交事务
        await connection.commit();
    } catch (err) {
        // 回滚事务
        await connection.rollback();
        console.log(err);
        next(new Error('ADMIN_UPDATE_USER_INFO_FAILED'))
    }
}