import ChevronDown from "components/icons/ChevronDown";
import ChevronRight from "components/icons/ChevronRight";
import { NodeApi, NodeRendererProps } from "react-arborist";
import "./NavItem.scss";

export type NavItemData = {
  id: number | string;
  name: string;
  slug?: string;
  children?: NavItemData[];
};

const NavIcon = <T,>({ node }: {node: NodeApi<T>}) => {
  const { children } = node;
  return children && children.length > 0
    ? node.isOpen
      ? <ChevronDown/>
      : <ChevronRight/>
    : node.level === 0
      ? <div className="nav-item-icon-filler"/>
      : <></>
};

const NavItem = <T extends NavItemData >({ node, style, dragHandle }: NodeRendererProps<T>) => {
  return (
    <div style={style} ref={dragHandle} className="nav-item" >
      <NavIcon node={node}/>
      {node.data.name}
    </div>
  );
};

export default NavItem