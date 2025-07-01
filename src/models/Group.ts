import mongoose from 'mongoose';
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: {
    type: String,
    trim: true,
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

export default mongoose.model('Groups', groupSchema);
