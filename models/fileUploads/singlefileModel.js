const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const singleFileSchema = new Schema({
    fileName: {
        type: String,
       
    },
    filePath: {
        type: String,
       
    },
    fileType: {
        type: String,
        
    },
    fileSize: {
        type: String,
       
    }
}, {timestamps: true});

module.exports = mongoose.model('SingleFile', singleFileSchema);