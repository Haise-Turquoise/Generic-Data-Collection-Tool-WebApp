import MenuEntity from '../../entities/Menu';
import BaseRepository from '../repository';
import MenuModel from '../../models/Menu';

export default class MenuRepository extends BaseRepository {
  constructor() {
    super(MenuModel);
  }

  async delete(id) {
    const menu = await MenuModel.findById(id);
    if (menu) {
      menu.isActive = false;
    }
    return this.update(id, menu);
  }

  async create(Menu) {
    return MenuModel.create(Menu).then(Menu => {
      console.log('Menu:', Menu);
      return new MenuEntity(Menu.toObject());
    });
  }

  async update(id, Menu) {
    return MenuModel.findByIdAndUpdate(id, Menu).then(Menu => new MenuEntity(Menu.toObject()));
  }

  async find(query) {
    return MenuModel.find(query).then(Menus => Menus.map(Menu => new MenuEntity(Menu.toObject())));
  }

  async populate(name) {
    const key = typeof name === 'string' ? 'name' : 'unknown';
    const value = typeof name === 'string' ? name : undefined;
    return MenuModel.find({ [key]: value })
      .populate([
        {
          path: 'items',
        },
        {
          path: 'subMenus',
          populate: {
            path: 'items',
          },
        },
      ])
      .then(Menus => Menus.map(Menu => new MenuEntity(Menu.toObject())));
  }
}
