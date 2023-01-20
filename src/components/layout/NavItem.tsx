import ChevronDown from "components/icons/ChevronDown";
import ChevronRight from "components/icons/ChevronRight";
import { NodeRendererProps } from "react-arborist";
import { ID, Slug } from "types";
import "./NavItem.scss";

export type NavItemData = {
  id: ID;
  name: string;
  slug?: Slug
  children?: NavItemData[]
};

const NavItem = <T extends NavItemData >({ node, style, dragHandle }: NodeRendererProps<T>) => {
  return (
    <div style={style} ref={dragHandle} className="nav-item" >
      {node.level === 0
        ? node.isOpen
          ? <ChevronDown/>
          : <ChevronRight/>
        : ''
      }
      {node.data.name}
    </div>
  );
};

export default NavItem