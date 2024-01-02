import classNames from 'classnames';
import './Nav.scss';
import React, { useEffect } from 'react';
import { useStores } from 'hooks';
import { RowRendererProps, Tree } from 'react-arborist';
import { observer } from 'mobx-react-lite';
import NavItem, { NavItemData } from './NavItem';
import { useNavigate } from 'react-router-dom';
import { docRoutes, exampleRoutes } from 'routes';
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
  }, [ms]);

  const children = (id: number, prefix: string, routes: string[]) => routes.map(
    (path, idx) => ({
      id: parseFloat(`${id}${idx + 1}`),
      name: capitalize(path),
      slug: `${prefix}/${path}`
    })
  );

  return (
    <div className={classNames("nav", className)} {...props}>
      <Tree<NavItemData>
        renderRow={Row}
        width={"100%"}
        indent={10}
        height={1000}
        data={[
          { id: 1, name: "Home", slug: "/" },
          {
            id: 2,
            name: "Guide",
            children: [
              {
                id: 2.1,
                name: "Documentation",
                children: children(2.1, 'docs', docRoutes)
              },
              {
                id: 2.2,
                name: "Standard Library",
                // children: children(2.2, 'stdlib', stdlibRoutes)
              },
              {
                id: 2.3,
                name: "Examples",
                children: children(2.3, 'exx', exampleRoutes)

              },
            ]
          },
          {
            name: "Library",
            id: 3,
            children: ms.moduleList.map(({ slug, title, id }) => ({
              id,
              name: title,
              slug: `lib/${slug}`,
            }))
          },
          { id: 4, name: "Contributing", slug: "contributing" },
        ]}
      >
        {NavItem}
      </Tree>

    </div>
  );
};

export default observer(Nav)