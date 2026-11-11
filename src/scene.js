import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export function createScene(container, stops, portrait) {
  const world = new THREE.Scene()
  world.background = new THREE.Color(0x765954)
  world.fog = new THREE.FogExp2(0x765954, 0.026)
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 110)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  container.append(renderer.domElement)
  world.add(new THREE.HemisphereLight(0xffdbc1, 0x626d8e, 2))
  const sun = new THREE.DirectionalLight(0xffa763, 3)
  sun.position.set(-10, 7, 1)
  world.add(sun)
  const rim = new THREE.DirectionalLight(0xffa763, 2.4)
  rim.position.set(4, 3, -4)
  world.add(rim)
  const looks = [
    { background: 0x402522, light: 0xffa763, view: [6, 5, 9] },
    { background: 0x213945, light: 0x8fe8ff, view: [-4, 4.9, 9] },
    { background: 0x28372e, light: 0xffbb72, view: [5, 5.7, 8.7] },
    { background: 0x492b33, light: 0xfdaebb, view: [-3.3, 3.8, 8.8] },
    { background: 0x332d40, light: 0xa3a8ff, view: [3.4, 3.7, 9] },
    { background: 0x203b42, light: 0x8fe4ff, view: [-4.7, 5, 8.6] }
  ]
  const veil = document.createElement('div')
  veil.className = 'scene-transition'
  veil.setAttribute('aria-hidden', 'true')
  container.append(veil)

  const stages = stops.map(() => new THREE.Group())
  const signs = new Map()
  const animations = []
  function prop(stage, geometry, color, x, y, z, glow = 0) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: glow, roughness: 0.42
    }))
    mesh.position.set(x, y, z)
    stage.add(mesh)
    return mesh
  }
  const box = (stage, w, h, d, color, x, y, z, glow) =>
    prop(stage, new THREE.BoxGeometry(w, h, d), color, x, y, z, glow)
  const ball = (stage, radius, color, x, y, z, glow) =>
    prop(stage, new THREE.SphereGeometry(radius, 20, 12), color, x, y, z, glow)
  function car(stage, color) {
    box(stage, 2.2, 0.55, 4, color, 0, 0.67, 0)
    box(stage, 1.75, 0.5, 1.85, 0x283945, 0, 1.1, -0.25)
    for (const x of [-1.04, 1.04]) {
      for (const z of [-1.24, 1.24]) {
        const tire = prop(stage, new THREE.CylinderGeometry(0.39, 0.39, 0.24, 20), 0x18191b, x, 0.4, z)
        tire.rotation.z = Math.PI / 2
      }
      box(stage, 0.47, 0.13, 0.04, 0xffe2b3, x * 0.7, 0.77, 2.02, 1.2)
    }
  }

  stages.forEach((stage, index) => {
    world.add(stage)
    stage.visible = index === 0
    box(stage, 8, 0.22, 7, 0x29282c, 0, -0.12, 0)
    if (index === 0) {
      car(stage, 0xb65631)
      box(stage, 6, 0.09, 0.2, 0xffb471, 0, 3.1, -2.5, 2)
    }
    if (index === 1) {
      car(stage, 0xd8dedc)
      const washer = new THREE.Group()
      stage.add(washer)
      for (const x of [-1.55, 1.55]) box(washer, 0.22, 2.3, 0.32, 0xeb8b24, x, 1.15, 0)
      box(washer, 3.3, 0.25, 0.32, 0xeb8b24, 0, 2.3, 0)
      for (let i = -5; i <= 5; i++) box(washer, 0.025, 0.53, 0.025, 0x79dffa, i * 0.23, 1.94, 0, 1)
      animations[index] = time => { washer.position.z = Math.sin(time * 0.0015) * 1.5 }
    }
    if (index === 2) {
      box(stage, 4.9, 0.28, 2.85, 0x693f29, 0, 1.14, 0)
      box(stage, 4.55, 0.05, 2.5, 0x246b56, 0, 1.3, 0)
      for (const x of [-1.8, 1.8]) for (const z of [-0.95, 0.95]) box(stage, 0.32, 1.15, 0.32, 0x553322, x, 0.58, z)
      for (let i = 0; i < 4; i++) ball(stage, 0.11, [0xffbc33, 0xcc4b39, 0x429dca, 0x232129][i], 0.65 + i * 0.23, 1.43, 0.25)
      const cue = ball(stage, 0.12, 0xffecd7, -1.65, 1.43, 0.25)
      animations[index] = time => { cue.position.x = -1.65 + (1 - Math.cos(time * 0.002)) * 0.95 }
    }
    if (index === 3) {
      box(stage, 1.4, 0.17, 1.35, 0x676168, -1.2, 0.12, 0)
      box(stage, 0.38, 0.85, 0.38, 0x9e9690, -1.2, 0.54, 0)
      box(stage, 1.3, 0.27, 1.08, 0x963f4b, -1.2, 1, 0)
      box(stage, 1.3, 1.04, 0.27, 0x963f4b, -1.2, 1.5, -0.49)
      box(stage, 2.2, 1, 1.5, 0x734d32, 1.45, 0.5, 0)
      prop(stage, new THREE.CylinderGeometry(0.29, 0.21, 0.4, 24), 0xffe5bf, 1.45, 1.2, 0)
      const steam = ball(stage, 0.11, 0xe2cbbd, 1.45, 1.55, 0)
      animations[index] = time => { steam.position.y = 1.5 + (time % 1700) / 2800 }
    }
    if (index === 4) {
      for (const x of [-1.3, 1.3]) prop(stage, new THREE.TorusGeometry(0.55, 0.115, 12, 30), 0x17191e, x, 0.68, 0)
      box(stage, 2.4, 0.19, 0.22, 0x7e4940, 0, 0.89, 0)
      box(stage, 0.67, 0.61, 0.48, 0x9a9fa4, 0, 0.95, 0)
      const tank = ball(stage, 0.53, 0xca6d37, 0.41, 1.48, 0)
      tank.scale.set(1.2, 0.5, 0.53)
      box(stage, 0.88, 0.19, 0.49, 0x272629, -0.62, 1.36, 0)
      box(stage, 0.14, 1.12, 0.13, 0xa6adb5, 1.11, 1.18, 0).rotation.z = 0.26
      box(stage, 0.15, 0.14, 0.95, 0xa6adb5, 0.98, 1.78, 0)
      const spoke = box(stage, 0.08, 0.94, 0.06, 0xb8a18a, 1.3, 0.68, 0.14)
      animations[index] = time => { spoke.rotation.z = time * 0.003 }
    }
    if (index === 5) {
      car(stage, 0x307b87)
      const pad = new THREE.Group()
      stage.add(pad)
      prop(pad, new THREE.CylinderGeometry(0.34, 0.34, 0.13, 24), 0xe4c9a2, 0, 0, 0)
      box(pad, 0.42, 0.19, 0.15, 0x302d37, 0.2, 0.15, 0)
      pad.position.set(0, 1.03, 1.36)
      animations[index] = time => {
        pad.position.x = Math.sin(time * 0.0018) * 0.65
        pad.rotation.y = time * 0.006
      }
    }
    if (!index) return
    const label = document.createElement('span')
    label.className = 'scene-sign'
    label.textContent = stops[index].title
    label.hidden = true
    container.append(label)
    signs.set(stops[index], { label, anchor: new THREE.Vector3(0, 3.08, 0) })
  })

  const portraitWorld = new THREE.Scene()
  portraitWorld.add(new THREE.HemisphereLight(0xfff3de, 0x7c92a4, 2.8))
  const key = new THREE.DirectionalLight(0xffdcac, 3)
  key.position.set(-2, 3, 4)
  portraitWorld.add(key)
  const portraitCamera = new THREE.PerspectiveCamera(27, 0.8, 0.1, 10)
  portraitCamera.position.set(0.11, 1.23, 1.75)
  portraitCamera.lookAt(0, 1.13, 0)
  let portraitRenderer
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
    portraitRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    portraitRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    portraitRenderer.setSize(160, 200, false)
    portraitRenderer.toneMapping = THREE.ACESFilmicToneMapping
    portrait.append(portraitRenderer.domElement)
    portraitWorld.add(model)
    const idle = animations.find(clip => /idle/i.test(clip.name))
    if (idle) {
      mixer = new THREE.AnimationMixer(scene)
      mixer.clipAction(idle).play()
    }
  }, undefined, () => {})

  const motes = new Float32Array(180)
  for (let i = 0; i < motes.length; i += 3) {
    motes[i] = (Math.random() - 0.5) * 30
    motes[i + 1] = Math.random() * 4 + 0.4
    motes[i + 2] = (Math.random() - 0.5) * 24
  }
  const dust = new THREE.BufferGeometry()
  dust.setAttribute('position', new THREE.BufferAttribute(motes, 3))
  const particles = new THREE.Points(dust, new THREE.PointsMaterial({
    color: 0xffce8a, size: 0.065, transparent: true, opacity: 0.52, depthWrite: false
  }))
  world.add(particles)

  const destination = new THREE.Vector3(6, 5, 9)
  const target = new THREE.Vector3(0, 1.15, 0)
  const look = target.clone()
  const projected = new THREE.Vector3()
  let focused
  let activeStage = 0
  let requestedStage = 0
  let transition
  let swapTimer
  camera.position.copy(destination)
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const resize = new ResizeObserver(() => {
    const { clientWidth, clientHeight } = container
    if (!clientWidth || !clientHeight) return
    camera.aspect = clientWidth / clientHeight
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(22)) / Math.min(1, camera.aspect)))
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
  })
  resize.observe(container)
  let previous = performance.now()
  renderer.setAnimationLoop(time => {
    const blend = reduceMotion.matches ? 1 : 1 - Math.exp(-Math.max(0, time - previous) / 330)
    if (!reduceMotion.matches) mixer?.update(Math.min(0.05, Math.max(0, time - previous) / 1000))
    previous = time
    camera.position.lerp(destination, blend)
    look.lerp(target, blend)
    camera.lookAt(look)
    particles.rotation.y = reduceMotion.matches ? 0 : time / 70000
    if (!reduceMotion.matches) animations[activeStage]?.(time)
    renderer.render(world, camera)
    const width = container.clientWidth
    const height = container.clientHeight
    for (const [stop, { label, anchor }] of signs) {
      label.hidden = stop !== focused
      if (label.hidden) continue
      projected.copy(anchor).project(camera)
      const halfWidth = label.offsetWidth / 2
      const halfHeight = label.offsetHeight / 2
      const x = THREE.MathUtils.clamp((projected.x + 1) * width / 2, halfWidth + 12, width - halfWidth - 12)
      const y = THREE.MathUtils.clamp((1 - projected.y) * height / 2, halfHeight + 12, height - halfHeight - 12)
      label.style.transform = `translate(${x - halfWidth}px, ${y - halfHeight}px)`
    }
    if (portraitRenderer && !portrait.closest('[hidden]')) {
      portraitWorld.rotation.y = reduceMotion.matches ? 0 : Math.sin(time / 1450) * 0.08
      portraitRenderer.render(portraitWorld, portraitCamera)
    }
  })
  function showStage(index, stop) {
    stages[activeStage].visible = false
    activeStage = index
    stages[index].visible = true
    focused = stop
    const look = looks[index]
    world.background.setHex(look.background)
    world.fog.color.copy(world.background)
    rim.color.setHex(look.light)
    destination.set(...look.view)
    target.set(0, 1.15, 0)
  }

  showStage(0, null)
  return {
    focus(stop) {
      const index = stop ? stops.indexOf(stop) : 0
      if (index < 0 || index === requestedStage) return
      requestedStage = index
      clearTimeout(swapTimer)
      transition?.cancel()
      if (reduceMotion.matches || !veil.animate) {
        showStage(index, stop)
        return
      }
      veil.style.setProperty('--scene-light', '#' + looks[index].light.toString(16))
      transition = veil.animate(
        [{ opacity: 0 }, { opacity: 1, offset: 0.42 }, { opacity: 0 }],
        { duration: 560, easing: 'ease-in-out' }
      )
      swapTimer = setTimeout(() => showStage(index, stop), 235)
    }
  }
}
