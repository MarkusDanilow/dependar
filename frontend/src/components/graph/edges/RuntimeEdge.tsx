import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

export function RuntimeEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge 
      path={edgePath} 
      markerEnd={markerEnd} 
      style={{ ...style, stroke: '#3B82F6', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
    />
  );
}
