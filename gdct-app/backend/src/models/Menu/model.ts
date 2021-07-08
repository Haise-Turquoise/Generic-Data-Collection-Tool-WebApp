import { Schema, model, Model, CallbackError } from 'mongoose';
import { MenuDoc } from '../../types/menu';

const { ObjectId } = Schema.Types;

const MenuSchema = new Schema<MenuDoc>(
  {
    name: { type: String, unique: true },
    items: [{ type: ObjectId, ref: 'MenuItem' }],
    isSubMenu: {
      type: Boolean,
      default: false,
    },
    subMenus: [{ type: ObjectId, ref: 'Menu' }],
    type: {
      type: String,
      default: 'drawer',
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    orderId: Number,
    url: { type: String }
  },
  { minimize: false, timestamps: true },
);

MenuSchema.pre(/^find/, function (this: Model<MenuDoc>, next: (err: CallbackError) => void) {
  this.find({ isActive: { $ne: false } });
  next(null);
});

const MenuModel = model<MenuDoc>('Menu', MenuSchema);

export default MenuModel;
