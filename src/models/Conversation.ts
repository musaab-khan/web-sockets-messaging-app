import mongoose from 'mongoose';
const { Schema } = mongoose;

const conversationSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Conversations', conversationSchema);
