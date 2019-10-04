import Vector from '../maths/Vector';

export const polarOffset = (
  center: Vector,
  radius: number,
  angleInRadians: number,
): Vector =>
  new Vector(Math.cos(angleInRadians), Math.sin(angleInRadians))
    .multiply(radius)
    .add(center);

// Magic mostly stolen from stack overflow. Uses the SVG path arc command (A)
export function arcPath(
  center: Vector,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarOffset(center, radius, endAngle);
  const end = polarOffset(center, radius, startAngle);

  const largeArc = endAngle - startAngle <= Math.PI ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}
