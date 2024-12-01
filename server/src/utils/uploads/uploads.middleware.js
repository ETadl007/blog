import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import sharp from'sharp';
import { fileURLToPath } from 'url';

const RandomFilename = (originalname) => {
    const randomBytes = crypto.randomBytes(16).toString('base64url');
    const extension = path.extname(originalname);
    return `${randomBytes}${extension}`;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images');
    },
    filename: (req, file, cb) => {
        cb(null, RandomFilename(file.originalname));
    }
});


// 文件类型和大小验证
const fileFilter = (req, file, cb) => {
    // 允许的文件类型
    const allowedMimeTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedMimeTypes.test(file.mimetype);
    
    const extname = allowedMimeTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('FILE_TYPE_NOT_SUPPORTED'));
    }
};


const uploadConfig = (req, res, next) => {
    multer({ 
      storage, 
      fileFilter, 
      limits: { fileSize: 1024 * 1024 * 5 } 
    }).single('file')(req, res, (err) => {
      if (err) {
        // 处理 multer 错误
        if (err instanceof multer.MulterError) {
          // 处理 multer 特有错误（例如文件太大）
          return next(new Error(`MULTER_ERROR: ${err.message}`));
        } else {
          // 处理其他错误（例如文件上传时的通用错误）
          return next(err);
        }
      }
      // 如果没有错误，继续执行下一个中间件
      next();
    });
  };
  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 验证是否为图片文件
const validateImage = (req, res, next) => {
    
    const filePath = path.join(__dirname, '../../../uploads/images', req.file.filename);
    sharp(filePath)
        .metadata()
        .then(info => {
            if (info.format) {
                // 图片验证通过，继续后续处理中间件
                next();
            } else {
                // 如果图片格式无效，删除文件并返回错误
                fs.unlink(filePath, (err) => {
                    if (err) console.error(err);
                    next(new Error('INVALID_PICTURE_DELETE'))
                });
            }
        })
        .catch(err => {
            // 如果出现错误，删除文件并返回错误
            fs.unlink(filePath, (err) => {
                if (err) console.error(err);
                next(new Error('INVALID_PICTURE_DELETE'))
            });
        });
};

export {uploadConfig, validateImage};