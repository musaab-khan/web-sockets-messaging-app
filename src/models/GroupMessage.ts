import mongoose from 'mongoose';
const { Schema } = mongoose;

const groupMessageSchema = new Schema({
  sent_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  attachment: {
    type: String,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Group_Messages', groupMessageSchema);
