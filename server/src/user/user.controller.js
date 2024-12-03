import * as userService from './user.service.js';
import { filterSensitive } from '../utils/sensitive.js'
import { randomNickname } from '../utils/tool.js'
import { PAGE_SIZE, PRIVATE_KEY, ADMIN_PASSWORD } from '../app/app.config.js'
import { signToken } from "../auth/auth.service.js";
import jwt from 'jsonwebtoken';

import { connecttion } from '../app/database/mysql.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.USER;

/**
 * 用户登录
 */

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (username == "admin") {
            if (password == ADMIN_PASSWORD) {
                res.send(result("超级管理员", {
                    id: 1314520,
                    username: "超级管理员",
                    role: 1,
                    avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                    nick_name: "超级管理员",
                    token: signToken({ payload: { id: 1314520, nick_name: "超级管理员", role: 1, username: "admin" } })
                }))
            } else {
                return next(errorResult(errorCode, "密码错误", 500))
            }
        } else {
            const user = await userService.getUserByName(username);

            const payload = { id: user.id, username: user.username, role: user.role, nick_name: user.nick_name, avatar: user.avatar };

            const token = signToken({ payload });

            res.send(result("用户登录成功", {
                id: user.id,
                username: user.username,
                role: user.role,
                avatar: user.avatar,
                nick_name: user.nick_name,
                token: token
            }))
        }

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "用户登录失败", 500))
    }

}

/**
 * 用户注册
 */

export const store = async (req, res, next) => {

    try {
        let { username, password, role = 2, nick_name } = req.body;

        let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
        ip = ip.split(":").pop()

        // 过滤敏感词
        nick_name = await filterSensitive(nick_name);

        // 随机生成昵称
        nick_name = nick_name ? nick_name : randomNickname("007的小迷弟");

        const avatar = "http://mrzym.top/online/9bb507f4bd065759a3d093d04.webp";

        const user = await userService.createUser({ username, password, role, nick_name, avatar });

        // 修改用户ip地址
        await userService.updateIp(user.id, ip);

        res.send(result("用户注册成功", {id: user.id, username: user,username}))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "用户注册成功", 500))
    }
}

/**
 * 获取用户信息
 */

export const getUserInfoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (id === 'undefined') {
            return next(errorResult(errorCode, "参数错误", 500))
        }

        if (id == 1314520) {
            res.send(result("超级管理员", {
                id: 1314520,
                username: "超级管理员",
                role: 1,
                avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                nick_name: "超级管理员",
                qq: "123456",
                ipAddress: "火星"
            }))
        } else {
            const user = await userService.getUserinfo(id);
            res.send(result("获取用户信息成功", user))
        }
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取用户信息失败", 500))
    }
}

/**
 * 更新当前登录用户信息
 */

export const updateOwnUserInfo = async (req, res, next) => {

    try {
        let { id, nick_name, avatar } = req.body

        // 过滤敏感词
        nick_name = await filterSensitive(nick_name);
        const user = await userService.updateOwnUserInfo({ nick_name, avatar, id });

        res.send(result("修改用户成功", user))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "修改用户失败", 500))
    }

}

/**
 * 修改密码
 */

export const updatePassword = async (req, res, next) => {

    try {
        const { password1 } = req.body;
        const { id } = req.user
        
        const user = await userService.updatePassword(id, password1);

        res.send(result("修改密码成功", user))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "修改密码失败", 500))
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

        const data = await userService.getUserList({ nick_name, role, limit, offset });

        res.send(result("获取用户列表成功", { current, size, list: data, total: data.length }))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取用户列表失败", 500))
    }
}


/**
 * 修改角色
 */
export const updateRole = async (req, res, next) => {

    try {
        const { id, role } = req.params;
        const user = await userService.updateRole(id, role);

        res.send(result("修改角色成功", user))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "修改角色失败", 500))
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

        const data = await userService.adminUpdateUserInfo(req.body);

        res.send(result("管理员修改用户信息成功", data))

        // 提交事务
        await connection.commit();
    } catch (err) {
        // 回滚事务
        await connection.rollback();
        console.log(err);
        return next(errorResult(errorCode, "管理员修改用户信息失败", 500))
    }
}