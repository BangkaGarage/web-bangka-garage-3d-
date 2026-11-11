import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export function createScene(container, stops) {
  const world = new THREE.Scene()
  world.background = new THREE.Color(0x48363d)
  world.fog = new THREE.FogExp2(0x48363d, 0.026)
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 110)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  container.append(renderer.domElement)
  world.add(new THREE.HemisphereLight(0xffdbc1, 0x626d8e, 2))
  const sun = new THREE.DirectionalLight(0xffa763, 3)
  sun.position.set(-10, 7, 1)
  world.add(sun)

  function box(width, height, depth, color, x, y, z, emission = 0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: emission, roughness: 0.76 }))
    mesh.position.set(x, y, z)
    world.add(mesh)
    return mesh
  }

  box(37, 0.5, 31, 0x303034, 0, -0.27, 0)
  box(9, 0.03, 25, 0x4e4949, 0, 0, 0)
  for (let z = -10; z <= 11; z += 2) box(0.12, 0.02, 0.8, 0xc19462, 0, 0.025, z)

  for (const [index, stop] of stops.entries()) {
    const { x, z, color } = stop
    if (index === 0) {
      for (const offset of [-2, 2]) box(0.24, 3.3, 0.3, color, x + offset, 1.65, z, 0.45)
      box(4.2, 0.2, 0.32, color, x, 3.3, z, 0.6)
    } else {
      box(5.3, 0.16, 4.7, 0x7a7070, x, 0.08, z)
      box(4.5, 2.5, 3.8, 0x333137, x, 1.4, z)
      box(4.75, 0.18, 4.02, color, x, 2.7, z)
      for (const offset of [-1.25, 0, 1.25]) box(0.95, 1.35, 0.05, color, x + offset, 1.1, z + 1.91, 0.42)
      box(4.4, 0.07, 0.08, color, x, 2.45, z + 1.93, 0.9)
    }
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 112
    const context = canvas.getContext('2d')
    context.fillStyle = '#181716'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#fff4e0'
    context.font = 'bold 43px sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(index ? stop.title : 'BANGKA GARAGE', 320, 56, 602)
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map, fog: false }))
    label.scale.set(4.3, 0.75, 1)
    label.position.set(x, index ? 3.3 : 4, z + (index ? 1.7 : 0))
    world.add(label)
  }

  const lyla = new THREE.Group()
  function part(geometry, color, y) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color }))
    mesh.position.y = y
    lyla.add(mesh)
  }
  part(new THREE.CapsuleGeometry(0.26, 0.57, 5, 12), 0x58796d, 0.64)
  part(new THREE.SphereGeometry(0.22, 18, 12), 0xcb8765, 1.33)
  part(new THREE.SphereGeometry(0.228, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.46), 0x342124, 1.37)
  lyla.position.set(1.3, 0, 6)
  world.add(lyla)
  let mixer
  new GLTFLoader().load('/models/lyla.glb', ({ scene, animations }) => {
    const bounds = new THREE.Box3().setFromObject(scene)
    const height = bounds.max.y - bounds.min.y
    if (!Number.isFinite(height) || height <= 0) return
    const scale = 1.55 / height
    const center = bounds.getCenter(new THREE.Vector3())
    const model = new THREE.Group()
    model.scale.setScalar(scale)
    model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale)
    model.add(scene)
    lyla.clear().add(model)
    const idle = animations.find(clip => /idle/i.test(clip.name))
    if (idle) {
      mixer = new THREE.AnimationMixer(scene)
      mixer.clipAction(idle).play()
    }
  }, undefined, () => {})

  const destination = new THREE.Vector3(21, 15, 23)
  const target = new THREE.Vector3(0, 0.6, -1)
  const look = target.clone()
  camera.position.copy(destination)
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const resize = new ResizeObserver(() => {
    const { clientWidth, clientHeight } = container
    if (!clientWidth || !clientHeight) return
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
  })
  resize.observe(container)
  let previous = performance.now()
  renderer.setAnimationLoop(time => {
    const blend = reduceMotion.matches ? 1 : 1 - Math.exp(-Math.max(0, time - previous) / 330)
    mixer?.update(Math.min(0.05, Math.max(0, time - previous) / 1000))
    previous = time
    camera.position.lerp(destination, blend)
    look.lerp(target, blend)
    camera.lookAt(look)
    lyla.rotation.y = Math.atan2(camera.position.x - lyla.position.x, camera.position.z - lyla.position.z)
    lyla.position.y = reduceMotion.matches ? 0 : Math.sin(time / 500) * 0.035
    renderer.render(world, camera)
  })
  return {
    focus({ x, z }) {
      destination.set(x + 5.4, 4.5, z + 7.9)
      target.set(x, 1.25, z)
    }
  }
}

