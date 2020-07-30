import { Schema, model } from 'mongoose';

const MenuItemSchema = new Schema(
  {
    name: { type: String, unique: true },
    url: { type: String, required: true },
    // appResourceId: { type: Schema.Types.ObjectId, ref: 'AppResource' },
    description: String,
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    type: {
      type: String,
      default: 'menu',
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { minimize: false, timestamps: true },
);

MenuItemSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const MenuItem = model('MenuItem', MenuItemSchema);

export default MenuItem;
