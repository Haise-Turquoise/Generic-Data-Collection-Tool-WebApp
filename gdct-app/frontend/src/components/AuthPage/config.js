import MenuController from '../../controllers/Menu';
import iconMap from './iconMap';

const createUserNavigation = async () => {
  const menus = await MenuController.fetch();
  return menus
    .filter(e => !e.isSubMenu)
    .map(e => {
      let children = e.items.map(item => {
        return {
          name: item.name,
          url: item.url,
          type: item.type,
          icon: iconMap[item.name],
        };
      });

      if (e.subMenus.length !== 0) {
        const extraMenus = e.subMenus.map(subMenu => {
          const subChildren = subMenu.items.map(item => {
            return {
              name: item.name,
              url: item.url,
              type: item.type,
              icon: iconMap[item.name],
            };
          });
          return {
            name: subMenu.name,
            type: subMenu.type,
            icon: iconMap[subMenu.name],
            children: subChildren,
          };
        });
        children = [...extraMenus, ...children];
      }
      return { name: e.name, type: e.type, icon: iconMap[e.name], children };
    });
};

export default createUserNavigation;
