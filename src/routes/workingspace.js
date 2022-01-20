import express from 'express';
import multer from 'multer';
import path from 'path';

import controllers from '../app/controllers/WorkingspaceController.js';


const router = express.Router();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "src/public/uploads/img");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})

const maxSize = 1 * 1000 * 1000 * 1000 * 1000 * 1000;
var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize},
    fileFilter: function(req, file, cb) {
        var filetypes = /jpeg|jpg|png|gif/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }
})



router.get('/list', controllers.index);
router.get('/create', controllers.create);
router.get('/:slug', controllers.show);
router.post('/save', 
upload.single('avatar'),
    controllers.save,
);
router.get('/edit/:id', controllers.edit);
router.post('/check-valid-date', controllers.checkExpirationDate);
router.patch('/:id', controllers.update);
router.delete('/:id', controllers.softDelete);
router.delete('/:id/force', controllers.deepDelete);
router.patch('/:id/restore', controllers.restore);

export default router;