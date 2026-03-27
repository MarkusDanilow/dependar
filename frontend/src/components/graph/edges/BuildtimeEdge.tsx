import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

export function BuildtimeEdge({
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
      style={{ ...style, stroke: '#8B5CF6', strokeWidth: 1.5 }} 
    />
  );
}
