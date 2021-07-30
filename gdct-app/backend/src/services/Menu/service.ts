import Container from 'typedi';
//@ts-ignore
import i18n from 'i18n';
import MenuRepository from '../../repositories/Menu';
import MenuItemRepository from '../../repositories/MenuItem';
import AppError from '../../utils/AppError';
import Menu from '../../types/menu';
import { QueryOptions } from 'mongoose';
import MenuItem from '../../types/menuitem';

interface PopulatedMenu extends Omit<Menu, 'items'> {
  items: MenuItem[];
}

export default class MenuService {
  private MenuRepository: MenuRepository;
  private MenuItemRepository: MenuItemRepository;

  constructor() {
    this.MenuRepository = Container.get(MenuRepository);
    this.MenuItemRepository = Container.get(MenuItemRepository);
  }

  async createMenu(Menu: Menu) {
    return this.MenuRepository.create(Menu);
  }

  async deleteMenu(id: string) {
    if (!(await this.canDelete(id))) {
      throw new AppError(i18n.__('Menu.service.deleteMenu.CanNotDelete'), 400);
    }
    return this.MenuRepository.delete(id);
  }

  async updateMenu(id: string, Menu: Partial<Menu>) {
    return this.MenuRepository.update(id, Menu);
  }

  async findMenu(id?: string) {
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
    // @ts-ignore
    return this.findMenu().then((menus: PopulatedMenu[]) => {
      const filteredMenus = [];
      for (const menu of menus) {
        const menuItems = new Set<MenuItem>();
        for (const menuItem of menu.items) {
          for (const itemRole of menuItem.role) {
            const myRole = itemRole.split('-')[1].toLowerCase();
            if (role.toLowerCase() === myRole) {
              menuItems.add(menuItem);
            }
          }
        }
        menu.items = [...menuItems];
        if (menu.items.length > 0) {
          filteredMenus.push(menu);
        }
      }
      return filteredMenus;
    });
  }
}
