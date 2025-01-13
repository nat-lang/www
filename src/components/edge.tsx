import React from 'react';
import { HierarchyLink } from 'd3-hierarchy';
import { CompilationNode } from '../service/nat/client';

type EdgeProps = {
  link: HierarchyLink<CompilationNode>
}

const Edge: React.FC<EdgeProps> = ({ link }) => {
  const { source, target } = link;

  return (
    <line
      className="edge"
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke="black"
    />
  )
};

export default Edge