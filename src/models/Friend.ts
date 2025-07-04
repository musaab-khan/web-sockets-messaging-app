import mongoose from 'mongoose';
const { Schema } = mongoose;

const friendSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friend_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'silenced', 'blocked'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Friends', friendSchema);
