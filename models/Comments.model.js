const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema(
  {
    newsId :{
        type: mongoose.Types.ObjectId,
        ref: 'News'
      },
      userId : {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      },
      content: {
        type: String,
        required: true
      },
  },
  {
         timestamps: true
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;