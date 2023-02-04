const mongoose = require("mongoose");



const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
        enum: [
            "latest", "world", "you might also like", "back", "front"
        ],
    },
   image:{
      type: String,
      },
    content: {
      type: String,
      required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      },
      },
  {

    timestamps: true
  }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;