
import { useDraggable } from '@dnd-kit/core';
import { PropsWithChildren } from 'react';

type DraggableProps = PropsWithChildren<{
  id: string;
  className: string;
}>

const Draggable: React.FC<DraggableProps> = ({ id, className, children }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div className={className} ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
export default Draggable;