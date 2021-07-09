import Container from 'typedi';
import i18n from 'i18n';
import MenuRepository from '../../repositories/Menu';
import MenuItemRepository from '../../repositories/MenuItem';
import AppError from '../../utils/AppError';
import { MenuDoc } from '../../types/menu';

export default class MenuService {
  private MenuRepository: MenuRepository;
  private MenuItemRepository: MenuItemRepository;

  constructor() {
    this.MenuRepository = Container.get(MenuRepository);
    this.MenuItemRepository = Container.get(MenuItemRepository);
  }

  async createMenu(Menu: MenuDoc) {
    return this.MenuRepository.create(Menu);
  }

  async deleteMenu(id: string) {
    if (!(await this.canDelete(id))) {
      throw new AppError(i18n.__('Menu.service.deleteMenu.CanNotDelete'), 400);
    }
    return this.MenuRepository.delete(id);
  }

  async updateMenu(id: string, Menu: MenuDoc) {
    return this.MenuRepository.update(id, Menu);
  }

  async findMenu(id: string) {
    return this.MenuRepository.populate(id);
  }

  async findAllMenu() {
    return this.MenuRepository.findAll();
  }

  async canDelete(id: string) {
    const menu = await this.MenuRepository.findById(id);
    return menu.items.length === 0;
  }

  getAuthroizedMenus(role: string) {
    if (!role) {
      throw new AppError(i18n.__('Auth.service.profile.NotAuthenticated'), 400);
    }
    //TODO changed logic double check this
    return this.findAllMenu().then(menus => {
      const filteredMenus = [];
      for (const menu of menus) {
        const menuItems = menu.items;
        menu.items = new Set();
        for (const menuItem of menuItems) {
          for (const itemRole of menuItem.role) {
            const myRole = itemRole.split('-')[1].toLowerCase();
            if (role.toLowerCase() === myRole) {
              menu.items.add(menuItem);
            }
          }
        }
        menu.items = [...menu.items];
        if (menu.items.length > 0) {
          filteredMenus.push(menu);
        }
      }
      return filteredMenus;
    });
  }
}
