import { EdgeProps, getSmoothStepPath } from 'reactflow';

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
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      {/* Glow effect */}
      <path
        d={edgePath}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth={5}
        strokeOpacity={0.2}
        strokeLinecap="round"
      />
      {/* Core line */}
      <path
        d={edgePath}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth={2}
        markerEnd={markerEnd}
      />
    </g>
  );
}
