import * as THREE from 'three'

import type { City, PlacedInstance } from '@/building/City'

interface ClipState {
  readonly mixer: THREE.AnimationMixer
  readonly action: THREE.AnimationAction
  open: boolean
}

/** Ejecuta los clips de puertas y ventanas incorporados en los GLB interactivos. */
export class InteractiveModelSystem {
  private readonly raycaster = new THREE.Raycaster()
  private readonly pointer = new THREE.Vector2()
  private readonly clips = new Map<string, ClipState>()

  constructor(
    private readonly city: City,
    private readonly camera: THREE.Camera,
    private readonly domElement: HTMLElement,
  ) {
    domElement.addEventListener('pointerdown', this.handlePointerDown, { capture: true })
  }

  update(dt: number): void {
    for (const state of this.clips.values()) state.mixer.update(dt)
  }

  dispose(): void {
    this.domElement.removeEventListener('pointerdown', this.handlePointerDown, { capture: true })
    this.clips.clear()
  }

  /** Abre la entrada principal o puerta de vehículo de una instancia. */
  openEntry(instance: PlacedInstance): void {
    const clip =
      instance.item.category === 'vehicle' ? 'Open_Vehicle_Door_Pivot' : 'Open_Door_Main_Pivot'
    this.play(instance, clip, true)
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return
    const rect = this.domElement.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const hit = this.raycaster
      .intersectObjects(this.city.instancesObject.children, true)
      .find((candidate) => this.clipForObject(candidate.object))
    if (!hit) return
    const instance = this.city.instanceFromObject(hit.object)
    const clip = this.clipForObject(hit.object)
    if (!instance || !clip) return

    event.preventDefault()
    event.stopImmediatePropagation()
    this.toggle(instance, clip)
  }

  private clipForObject(object: THREE.Object3D): string | null {
    let current: THREE.Object3D | null = object
    while (current) {
      const name = current.name
      if (name === 'Vehicle_Door_Pivot') return 'Open_Vehicle_Door_Pivot'
      if (name === 'Door_Main_Pivot') return 'Open_Door_Main_Pivot'
      if (name === 'Window_Left_Pivot') return 'Open_Window_Left_Pivot'
      if (name === 'Window_Right_Pivot') return 'Open_Window_Right_Pivot'
      current = current.parent
    }
    return null
  }

  private toggle(instance: PlacedInstance, clipName: string): void {
    const current = this.clips.get(`${instance.id}:${clipName}`)
    this.play(instance, clipName, !(current?.open ?? false))
  }

  private play(instance: PlacedInstance, clipName: string, open: boolean): void {
    const key = `${instance.id}:${clipName}`
    const root = instance.modelHolder.children.find((child) => child.userData.animationClips)
    const clips = root?.userData.animationClips as readonly THREE.AnimationClip[] | undefined
    const clip = clips?.find((candidate) => candidate.name === clipName)
    if (!root || !clip) return

    let state = this.clips.get(key)
    if (!state) {
      const mixer = new THREE.AnimationMixer(root)
      const action = mixer.clipAction(clip)
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
      state = { mixer, action, open: false }
      this.clips.set(key, state)
    }

    state.action.enabled = true
    state.action.paused = false
    state.action.timeScale = open ? 1 : -1
    state.action.time = open ? 0 : clip.duration
    state.action.play()
    state.open = open
  }
}
