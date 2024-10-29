import mysql from 'mysql2';
import { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } from '../app.config.js';

/**
 * 创建数据库连接
 */
const connecttion = mysql.createConnection({
    host: MYSQL_HOST,
    port: parseInt(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    charset: 'utf8mb4'
});

/**
 * 测试连接数据库
 */
connecttion.connect((err) => {
    if (err) {
        console.log("数据库连接失败", err.message);
        return;
    }
    console.log("数据库连接成功！");
});

export { connecttion };
