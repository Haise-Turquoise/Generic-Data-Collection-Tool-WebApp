import Container from 'typedi';
import MenuItemRepository from '../../repositories/MenuItem';
import { MenuItemDoc } from '../../types/menuitem';

export default class MenuItemService {
  private MenuItemRepository: MenuItemRepository;

  constructor() {
    this.MenuItemRepository = Container.get(MenuItemRepository);
  }

  async createMenuItem(MenuItem: MenuItemDoc) {
    return this.MenuItemRepository.create(MenuItem);
  }

  async deleteMenuItem(id: string) {
    return this.MenuItemRepository.delete(id);
  }

  async updateMenuItem(id: string, MenuItem: MenuItemDoc) {
    return this.MenuItemRepository.update(id, MenuItem);
  }

  async findMenuItem(MenuItem: MenuItemDoc) {
    return this.MenuItemRepository.find(MenuItem.toObject());
  }

  async findAllMenuItem() {
    return this.MenuItemRepository.findAll();
  }
}
