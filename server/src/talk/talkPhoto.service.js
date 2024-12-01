import { connecttion } from "../app/database/mysql.js";

export const publishTalkPhoto = async (imgList) => {
    const values = imgList.map(({ talk_id, url }) => [talk_id, url]);
    const sql = 'INSERT INTO blog_talk_photo (talk_id, url) VALUES ?';
    await connecttion.promise().query(sql, [values]);
}

export const deleteTalkPhoto = async (talk_id) => {
    try {
        const sql = 'DELETE FROM blog_talk_photo WHERE talk_id = ?';
        await connecttion.promise().query(sql, [talk_id])
    } catch (err) {
        console.log(err);
        throw err;
    }
;
}