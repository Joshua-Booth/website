export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export interface Spring {
  value: number;
  velocity: number;
}

export function stepSpring(
  spring: Spring,
  target: number,
  seconds: number,
  stiffness = 14,
  damping = 1
) {
  if (!seconds) {
    spring.value = target;
    spring.velocity = 0;

    return;
  }

  const friction = 2 * damping * Math.sqrt(stiffness);

  const force =
    stiffness * (target - spring.value) - friction * spring.velocity;

  spring.velocity += force * seconds;
  spring.value += spring.velocity * seconds;
}
