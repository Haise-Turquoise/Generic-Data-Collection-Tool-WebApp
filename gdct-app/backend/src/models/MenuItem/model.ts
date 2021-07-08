import { Schema, model } from 'mongoose';
import { MenuItemDoc } from '../../types/menuitem';

const MenuItemSchema = new Schema<MenuItemDoc>(
  {
    name: { type: String, unique: true },
    url: { type: String, required: true },
    // appResourceId: { type: Schema.Types.ObjectId, ref: 'AppResource' },
    description: String,
    role: {
      type: [String],
      required: true,
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
    orderId: Number,
  },
  { minimize: false, timestamps: true },
);

MenuItemSchema.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const MenuItem = model<MenuItemDoc>('MenuItem', MenuItemSchema);

export default MenuItem;
