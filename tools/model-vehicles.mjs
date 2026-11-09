import { box, cylinder, group, place, roundedBox, sphere, torus } from './model-kit.mjs'

function wheel(name, x, z, radius = 0.18) {
  const tire = place(
    cylinder(radius, radius, 0.13, 16, 'metal', `${name}_tire`),
    0,
    0,
    0,
    0,
    0,
    Math.PI / 2,
  )
  const rim = place(
    cylinder(radius * 0.52, radius * 0.52, 0.145, 16, 'accent', `${name}_rim`),
    0,
    0,
    0,
    0,
    0,
    Math.PI / 2,
  )
  return place(group(name, [tire, rim]), x, radius, z)
}

/** Auto compacto inspirado en el modelo de referencia, con cabina Aero y ruedas animables. */
export function carAero() {
  return group('car_aero_compact', [
    place(roundedBox(1.64, 0.3, 0.76, 0.16, 'solid', 'car_body'), 0, 0.39, 0),
    place(roundedBox(0.9, 0.34, 0.62, 0.14, 'glass', 'car_canopy'), -0.08, 0.67, 0),
    place(roundedBox(0.46, 0.06, 0.58, 0.03, 'accent', 'car_roof'), -0.08, 0.89, 0),
    wheel('wheel_front_left', 0.54, 0.39),
    wheel('wheel_front_right', 0.54, -0.39),
    wheel('wheel_rear_left', -0.54, 0.39),
    wheel('wheel_rear_right', -0.54, -0.39),
    place(roundedBox(0.08, 0.12, 0.5, 0.02, 'emissive', 'headlights'), 0.83, 0.42, 0),
    place(roundedBox(0.05, 0.08, 0.38, 0.02, 'accent', 'rear_lights'), -0.83, 0.4, 0),
  ])
}

/** Autobús panorámico compacto con seis ruedas y grandes paños de vidrio. */
export function busAero() {
  const wheels = [-0.88, 0.88].flatMap((x) => [
    wheel(`wheel_left_${x}`, x, 0.43, 0.2),
    wheel(`wheel_right_${x}`, x, -0.43, 0.2),
  ])
  const windows = [-0.55, 0, 0.55].flatMap((x) => [
    place(roundedBox(0.42, 0.38, 0.025, 0.02, 'glass', `window_left_${x}`), x, 0.88, 0.425),
    place(roundedBox(0.42, 0.38, 0.025, 0.02, 'glass', `window_right_${x}`), x, 0.88, -0.425),
  ])
  return group('bus_aero_panorama', [
    place(roundedBox(2.5, 0.78, 0.84, 0.14, 'solid', 'bus_body'), 0, 0.64, 0),
    place(roundedBox(2.28, 0.1, 0.72, 0.04, 'accent', 'bus_roof'), 0, 1.11, 0),
    ...windows,
    ...wheels,
    place(roundedBox(0.08, 0.22, 0.52, 0.02, 'emissive', 'bus_front'), 1.27, 0.63, 0),
    place(roundedBox(0.06, 0.16, 0.42, 0.02, 'accent', 'bus_rear'), -1.27, 0.62, 0),
    place(roundedBox(0.16, 0.45, 0.03, 0.02, 'glass', 'bus_door'), 0.48, 0.57, -0.435),
  ])
}

/** Lancha compacta de casco glossy, parabrisas y aro de rescate. */
export function boatAero() {
  return group('boat_aero_speed', [
    place(roundedBox(1.7, 0.28, 0.72, 0.16, 'solid', 'boat_hull'), 0, 0.25, 0),
    place(roundedBox(1.35, 0.09, 0.56, 0.05, 'accent', 'boat_deck'), -0.06, 0.43, 0),
    place(roundedBox(0.58, 0.34, 0.46, 0.08, 'glass', 'boat_windscreen'), -0.24, 0.64, 0),
    place(roundedBox(0.2, 0.08, 0.54, 0.03, 'neutral', 'boat_seat'), 0.44, 0.55, 0),
    place(cylinder(0.035, 0.045, 0.62, 8, 'metal', 'boat_flagpole'), 0.62, 0.82, 0),
    place(box(0.25, 0.16, 0.025, 'emissive', 'boat_flag'), 0.73, 1.05, 0),
    place(torus(0.13, 0.026, 8, 20, 'accent', 'lifebuoy'), -0.18, 0.55, 0.39, Math.PI / 2),
  ])
}

/** Globo aerostático de volumen acotado con canasta para los habitantes. */
export function balloonAero() {
  return group('balloon_aero', [
    place(sphere(0.74, 'accent', 'balloon_envelope'), 0, 1.82, 0),
    place(sphere(0.57, 'glass', 'balloon_glass_band'), 0, 1.72, 0),
    place(torus(0.62, 0.035, 8, 28, 'emissive', 'balloon_ring'), 0, 1.75, 0, Math.PI / 2),
    place(cylinder(0.21, 0.28, 0.3, 8, 'wood', 'balloon_basket'), 0, 0.32, 0),
    place(
      cylinder(0.025, 0.025, 0.88, 6, 'metal', 'balloon_rope_a'),
      0.29,
      0.84,
      0.29,
      0.36,
      0,
      -0.36,
    ),
    place(
      cylinder(0.025, 0.025, 0.88, 6, 'metal', 'balloon_rope_b'),
      -0.29,
      0.84,
      0.29,
      -0.36,
      0,
      0.36,
    ),
    place(
      cylinder(0.025, 0.025, 0.88, 6, 'metal', 'balloon_rope_c'),
      0.29,
      0.84,
      -0.29,
      0.36,
      0,
      0.36,
    ),
    place(
      cylinder(0.025, 0.025, 0.88, 6, 'metal', 'balloon_rope_d'),
      -0.29,
      0.84,
      -0.29,
      -0.36,
      0,
      -0.36,
    ),
    place(sphere(0.09, 'emissive', 'balloon_burner'), 0, 0.62, 0),
  ])
}
