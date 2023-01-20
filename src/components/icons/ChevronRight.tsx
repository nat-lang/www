
import React, { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>

const ChevronRight: React.FC<Props> = ({ height = 15, width = 15, fill = "grey", ...props}) => (
<svg width={width} height={height}  fill={fill} {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_429_11254)">
<path d="M10 17L15 12" stroke="#292929" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15 12L10 7" stroke="#292929" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_429_11254">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
)

export default ChevronRight;
