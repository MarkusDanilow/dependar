import { EdgeProps, getSmoothStepPath } from 'reactflow';

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
        stroke="#3B82F6"
        strokeWidth={4}
        strokeOpacity={0.2}
        strokeLinecap="round"
      />
      {/* Core line */}
      <path
        d={edgePath}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={1.5}
        strokeDasharray="5 5"
        markerEnd={markerEnd}
        className="animate-[dash_1s_linear_infinite]"
      />
    </g>
  );
}
