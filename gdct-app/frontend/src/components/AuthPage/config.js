import MenuController from '../../controllers/Menu';
import iconMap from './iconMap';

const createUserNavigation = async () => {
  const menus = await MenuController.fetch();
  // console.log(menus)
  return menus
    .filter(e => !e.isSubMenu)
    .map(e => {
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
