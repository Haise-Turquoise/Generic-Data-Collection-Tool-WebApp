import Container from 'typedi';
import MenuRepository from '../../repositories/Menu';
import MenuItemRepository from '../../repositories/MenuItem';
import ErrorGDCT from '../../utils/errorGDCT';

export default class MenuService {
  constructor() {
    this.MenuRepository = Container.get(MenuRepository);
    this.MenuItemRepository = Container.get(MenuItemRepository);
  }

  async createMenu(Menu) {
    return this.MenuRepository.create(Menu);
  }

  async deleteMenu(id) {
    if (!(await this.canDelete(id))) {
      throw ErrorGDCT('Cannot be deleted', 400);
    }
    return this.MenuRepository.delete(id);
  }

  async updateMenu(id, Menu) {
    return this.MenuRepository.update(id, Menu);
  }

  async findMenu(id) {
    return this.MenuRepository.populate(id);
  }

  async findAllMenu() {
    return this.MenuRepository.findAll();
  }

  async canDelete(id) {
    const menu = await this.MenuRepository.findById(id);
    return menu.items.length === 0;
  }
}
