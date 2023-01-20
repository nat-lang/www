
import React, { SVGProps } from 'react';
import ChevronRight from './ChevronRight';

type Props = SVGProps<SVGSVGElement>

const ChevronDown: React.FC<Props> = (props) =>
  <ChevronRight style={{transform: 'rotate(90deg)'}} {...props}/>;

export default ChevronDown;
