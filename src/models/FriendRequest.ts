import mongoose from 'mongoose';
const { Schema } = mongoose;

const friendRequestSchema = new Schema({
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
}, { timestamps: true });

export default mongoose.model('Friend_Resquest', friendRequestSchema);