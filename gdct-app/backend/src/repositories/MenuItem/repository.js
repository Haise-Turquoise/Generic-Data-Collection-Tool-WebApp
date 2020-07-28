import MenuItemEntity from '../../entities/MenuItem';
import BaseRepository from '../repository';
import MenuItemModel from '../../models/MenuItem';

export default class MenuRepository extends BaseRepository {
  constructor() {
    super(MenuItemModel);
  }

  async delete(id) {
    const menuItem = await MenuItemModel.findById(id);
    if (menuItem) {
      menuItem.isActive = false;
    }
    return this.update(id, menuItem);
  }

  async create(MenuItem) {
    return MenuItemModel.create(MenuItem).then(MenuItem => new MenuItemEntity(MenuItem.toObject()));
  }

  async update(id, MenuItem) {
    return MenuItemModel.findByIdAndUpdate(id, MenuItem).then(
      MenuItem => new MenuItemEntity(MenuItem.toObject()),
    );
  }

  async find(query) {
    return MenuItemModel.find(query).then(Menus =>
      Menus.map(MenuItem => new MenuItemEntity(MenuItem.toObject())),
    );
  }
}
