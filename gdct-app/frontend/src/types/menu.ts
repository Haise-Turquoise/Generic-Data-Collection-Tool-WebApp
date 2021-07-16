export interface Menu {
  items: string[],
  isSubMenu: boolean,
  subMenus: string[]
  createdAt: string,
  updatedAt: string,
  type: string,
  isActive: boolean,
  name: string,
  orderId: number,
}