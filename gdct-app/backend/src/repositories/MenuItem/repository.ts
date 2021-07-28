import MenuItemEntity from '../../entities/MenuItem';
import BaseRepository from '../repository';
import MenuItemModel from '../../models/MenuItem';
import MenuItem, { MenuItemDoc } from '../../types/menuitem';
import AppError from '../../utils/AppError';

export default class MenuRepository extends BaseRepository<MenuItem, MenuItemDoc> {
  constructor() {
    super(MenuItemModel);
  }

  async delete(id: string) {
    const menuItem = await MenuItemModel.findById(id);
    if (menuItem) {
      menuItem.isActive = false;
    }else{
      throw new AppError(`Delete failed, Item not found for MenuItem item with ID: ${id}`);
    }
    return this.update(id, menuItem);
  }

  async create(MenuItem: MenuItem) {
    return MenuItemModel.create(MenuItem).then(MenuItem => new MenuItemEntity(MenuItem));
  }

  async update(id: string, MenuItem: Partial<MenuItem>) {
    return MenuItemModel.findByIdAndUpdate(id, MenuItem)
    .then((MenuItem: MenuItemDoc|null) => {
      if (!MenuItem) throw new AppError(`Update failed, Item not found for MenuItem item with ID: ${id}`);
      return new MenuItemEntity(MenuItem)
    });
  }

  async find(query: Partial<MenuItem>) {
    return MenuItemModel.find(query).then((Menus: MenuItemDoc[]) =>
      Menus.map(MenuItem => new MenuItemEntity(MenuItem)),
    );
  }
}
