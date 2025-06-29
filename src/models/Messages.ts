import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  conversation_id: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  attachment: {
    type: String,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Messages', messageSchema);
