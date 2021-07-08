import MenuItemEntity from '../../entities/MenuItem';
import BaseRepository from '../repository';
import MenuItemModel from '../../models/MenuItem';
import { MenuItemDoc } from '../../types/menuitem';
import { FilterQuery } from 'mongoose';

export default class MenuRepository extends BaseRepository<MenuItemDoc> {
  constructor() {
    super(MenuItemModel);
  }

  async delete(id: string) {
    const menuItem = await MenuItemModel.findById(id);
    if (menuItem) {
      menuItem.isActive = false;
    }
    return this.update(id, menuItem);
  }

  async create(MenuItem: MenuItemDoc) {
    return MenuItemModel.create(MenuItem).then(MenuItem => new MenuItemEntity(MenuItem));
  }

  async update(id: string, MenuItem: MenuItemDoc) {
    return MenuItemModel.findByIdAndUpdate(id, MenuItem).then(
      (MenuItem: MenuItemDoc) => new MenuItemEntity(MenuItem),
    );
  }

  async find(query: FilterQuery<MenuItemDoc>) {
    return MenuItemModel.find(query).then((Menus: MenuItemDoc[]) =>
      Menus.map(MenuItem => new MenuItemEntity(MenuItem)),
    );
  }
}
