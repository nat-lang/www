import classNames from 'classnames';
import './Nav.scss';
import React, { useEffect } from 'react';
import { useStores } from 'hooks';
import { RowRendererProps, Tree } from 'react-arborist';
import { observer } from 'mobx-react-lite';
import NavItem, { NavItemData } from './NavItem';
import { useNavigate } from 'react-router-dom';
import { docRoutes } from 'routes';
import { capitalize } from 'lodash';

type NavProps = React.HTMLAttributes<HTMLDivElement> & {
}

const Row = ({
  node,
  attrs,
  innerRef,
  children,
}: RowRendererProps<NavItemData>) => {
  const navigate = useNavigate();
  const toggle = () => node.isOpen ? node.close() : node.open();

  const handleClick = () => {
    if (node.data.slug) navigate(`/${node.data.slug}`);
    else toggle();
  };

  return (
    <div
      {...attrs}
      ref={innerRef}
      onFocus={(e) => e.stopPropagation()}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

const Nav: React.FC<NavProps> = ({ className = '', children: center, ...props }) => {
  const { moduleStore: ms } = useStores();

  useEffect(() => {
    ms.fetchModules();
  }, []);

  return (
    <div className={classNames("nav", className)} {...props}>
      <Tree<NavItemData>
        renderRow={Row}
        data={[
          { id: 1, name: "Home", slug: "home" },
          {
            id: 2,
            name: "Documentation",
            children: docRoutes.map(
              (path, idx) => ({
                id: parseFloat(`2.${idx + 1}`),
                name: capitalize(path),
                slug: `docs/${path}`
              })
            )
          },
          {
            name: "Library",
            id: 3,
            children: ms.moduleList.map(({ module: { slug, title, id } }) => ({
              id,
              name: `${title}(${id})`,
              slug: `lib/${slug}`,
            }))
          }
        ]}
      >
        {NavItem}
      </Tree>

    </div>
  );
};

export default observer(Nav)