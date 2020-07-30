import Container from 'typedi';
import MenuItemRepository from '../../repositories/MenuItem';

export default class MenuItemService {
  constructor() {
    this.MenuItemRepository = Container.get(MenuItemRepository);
  }

  async createMenuItem(MenuItem) {
    return this.MenuItemRepository.create(MenuItem);
  }

  async deleteMenuItem(id) {
    return this.MenuItemRepository.delete(id);
  }

  async updateMenuItem(id, MenuItem) {
    return this.MenuItemRepository.update(id, MenuItem);
  }

  async findMenuItem(MenuItem) {
    return this.MenuItemRepository.find(MenuItem);
  }

  async findAllMenuItem() {
    return this.MenuItemRepository.findAll();
  }
}
