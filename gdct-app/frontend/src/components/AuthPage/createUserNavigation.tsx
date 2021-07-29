//@ts-ignore
import MenuController from '../../controllers/Menu';
//@ts-ignore
import iconMap from './iconMap';
import Menu from '../../types/menu';
const createUserNavigation = async () => {
  const menus :Menu[] = await MenuController.fetch();

  return menus
    .filter(e => !e.isSubMenu)
    .map(e => {
      if (e.url !== undefined) {
        return {
          name: e.name,
          url: e.url,
          type: e.type,
          icon: iconMap[e.name],
          orderID: e.orderId,
        };
      }
      let children = e.items.map(item => {
        return {
          name: item.name,
          url: item.url,
          type: item.type,
          icon: iconMap[item.name],
          orderId: item.orderId,
        };
      });

      if (e.subMenus.length !== 0) {
        const extraMenus = e.subMenus.map(subMenu => {
          subMenu.items.sort((a, b) => a.orderId - b.orderId);
          const subChildren = subMenu.items.map(item => {
            return {
              name: item.name,
              url: item.url,
              type: item.type,
              icon: iconMap[item.name],
              orderId: item.orderId,
            };
          });
          return {
            name: subMenu.name,
            type: subMenu.type,
            //adding a url here to prevent the typescript error, can be delete if there is no need to aviod the error.
            url:subMenu.url,
            icon: iconMap[subMenu.name],
            children: subChildren,
            orderId: subMenu.orderId,
          };
        });
        children = [...extraMenus, ...children];
        children.sort((a, b) => {
          if (a.type === b.type) {
            return a.orderId - b.orderId;
          }
          return a.type.localeCompare(b.type);
        });
      }
      return { name: e.name, type: e.type, icon: iconMap[e.name], children };
    });
};

export default createUserNavigation;
