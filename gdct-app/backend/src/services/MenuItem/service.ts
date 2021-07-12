import Container from 'typedi';
import MenuItemRepository from '../../repositories/MenuItem';
import MenuItem from '../../types/menuitem';

export default class MenuItemService {
  private MenuItemRepository: MenuItemRepository;

  constructor() {
    this.MenuItemRepository = Container.get(MenuItemRepository);
  }

  async createMenuItem(MenuItem: MenuItem) {
    return this.MenuItemRepository.create(MenuItem);
  }

  async deleteMenuItem(id: string) {
    return this.MenuItemRepository.delete(id);
  }

  async updateMenuItem(id: string, MenuItem: Partial<MenuItem>) {
    return this.MenuItemRepository.update(id, MenuItem);
  }

  async findMenuItem(MenuItem: Partial<MenuItem>) {
    return this.MenuItemRepository.find(MenuItem);
  }

  async findAllMenuItem() {
    return this.MenuItemRepository.findAll();
  }
}
