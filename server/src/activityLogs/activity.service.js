import { connecttion } from "../app/database/mysql.js"
import moment from 'moment';

/**
 * 后台获取活动日志列表
 */
export const getActivityLogs = async () => {
    const sql = `
    SELECT
        ac.id,
        user.nick_name,
        ac.action,
        ac.target_type,
        ac.target_id,
        ac.target_name,
        ac.changes,
        ac.metadata,
        ac.createdAt
    FROM
        blog_activity_logs AS ac
    LEFT JOIN
        blog_user AS user ON ac.actor_id = user.id
    ORDER BY
        ac.createdAt DESC
    `

    const [data] = await connecttion.promise().query(sql)
    return data
}

/**
 * 后台新增活动日志
 */
export const addActivityLog = async ({actor_id, action, target_type, target_id, target_name, changes, metadata}) => {
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
    const sql = `
    INSERT INTO 
        blog_activity_logs 
        (actor_id, action, target_type, target_id, target_name, changes, metadata, createdAt)
    VALUES (?,?,?,?,?,?,?,?)
    `
    const [result] = await connecttion.promise().execute(sql, [actor_id, action, target_type, target_id, target_name, changes, metadata, createdAt])
    return result
}