import MenuEntity from '../../entities/Menu';
import BaseRepository from '../repository';
import MenuModel from '../../models/Menu';
import Menu, { MenuDoc } from '../../types/menu';
import { FilterQuery } from 'mongoose';

export default class MenuRepository extends BaseRepository<Menu, MenuDoc> {
  constructor() {
    super(MenuModel);
  }

  async delete(id: string) {
    const menu = await MenuModel.findById(id);
    if (menu) {
      menu.isActive = false;
    }
    return this.update(id, menu);
  }

  async create(Menu: Menu) {
    return MenuModel.create(Menu).then(Menu => {
      return new MenuEntity(Menu);
    });
  }

  async update(id: string, Menu: Partial<Menu>) {
    return MenuModel.findByIdAndUpdate(id, Menu).then((Menu: MenuDoc) => new MenuEntity(Menu));
  }

  async find(query: Partial<Menu>) {
    return MenuModel.find(query).then((Menus: MenuDoc[]) => Menus.map(Menu => new MenuEntity(Menu)));
  }

  async populate(name?: string) {
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
      .then((Menus: MenuDoc[]) => Menus.map(Menu => new MenuEntity(Menu)));
  }
}
