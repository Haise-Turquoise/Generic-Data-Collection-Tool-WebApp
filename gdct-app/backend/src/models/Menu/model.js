import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const MenuSchema = new Schema(
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
  },
  { minimize: false, timestamps: true },
);

MenuSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const MenuModel = model('Menu', MenuSchema);

export default MenuModel;
