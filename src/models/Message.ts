import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
  sent_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sent_to: {
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

export default mongoose.model('Messages', messageSchema);
