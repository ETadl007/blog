import jwt from 'jsonwebtoken';
import { signToken } from "./auth.service.js";
import { PRIVATE_KEY, ADMIN_PASSWORD } from '../app/app.config.js'

/**
 * 用户登录
 */

export const login = async (req, res, next) => {
    try {
        const { username: { id, username, role, nick_name, avatar, password } } = req.body;

        const payload = { id, username, role, nick_name, avatar, password };

        if (username == "admin") {
            if (password == ADMIN_PASSWORD) {
                res.send({
                    status: 0,
                    message: "超级管理员登录成功",
                    data: {
                        id: 1314520,
                        username: "超级管理员",
                        role: 1,
                        token: jwt.sign({ id: 1314520, nick_name: "超级管理员", role: 1, username: "admin" }, PRIVATE_KEY, { expiresIn: '1h' })
                    }
                })
            }
        } else {

            // 普通用户签发令牌
            const token = signToken({ payload });

            res.send({
                status: 0,
                message: "用户登录成功",
                data: {
                    id,
                    username,
                    role,
                    token
                }
            })
        }

    } catch (err) {
        console.log(err);
        next(new Error("LOGIN_FAILED"))
    }

}

/**
 *  验证登录
 */

export const validate = async (req, res, next) => {

    res.send({
        status: 0,
        message: "验证成功"
    });

}