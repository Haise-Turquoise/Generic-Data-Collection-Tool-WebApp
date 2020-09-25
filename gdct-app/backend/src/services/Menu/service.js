import Container from "typedi";
import MenuRepository from "../../repositories/Menu";
import MenuItemRepository from "../../repositories/MenuItem";
import ErrorGDCT from "../../utils/errorGDCT";

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
      throw ErrorGDCT("Cannot be deleted", 400);
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

  getAuthroizedMenus(roles) {
    return this.findMenu({}).then((menus) => {
      const filteredMenus = [];
      // console.log(
      //   'main menu:',
      //   menus.filter(e => e.isSubMenu === false),
      // );
      for (const menu of menus) {
        const menuItems = menu.items;
        menu.items = new Set();
        for (const menuItem of menuItems) {
          for (const role of menuItem.role) {
            const myRole = role.split("-")[1].toLowerCase();
            if (roles.find((e) => e.toLowerCase() === myRole)) {
              menu.items.add(menuItem);
            }
          }
        }
        menu.items = [...menu.items];
        if (menu.items.length > 0) {
          filteredMenus.push(menu);
        }
      }
      // console.log('filtered:', filteredMenus);
      return filteredMenus;
    });
  }
}
