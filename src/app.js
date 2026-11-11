import { stops } from './data.js'

const element = id => document.getElementById(id)
const audio = new Audio()
let active = 0
let scene
let narration = 0
let playing = false

const buttons = stops.map((stop, index) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = stop.name
  button.addEventListener('click', () => { select(index); speak() })
  element('stops').append(button)
  return button
})

function stopVoice() {
  narration += 1
  audio.pause()
  window.speechSynthesis?.cancel()
  playing = false
  element('voice').textContent = 'Putar narasi'
}

async function speak() {
  stopVoice()
  const ticket = narration
  const stop = stops[active]
  playing = true
  element('voice').textContent = 'Hentikan narasi'
  const finished = () => { if (ticket === narration) stopVoice() }
  audio.onended = finished
  audio.src = '/audio/' + stop.audio + '.mp3'
  try {
    await audio.play()
  } catch {
    if (ticket !== narration) return
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      finished()
      return
    }
    const utterance = new SpeechSynthesisUtterance(stop.dialogue)
    utterance.lang = 'id-ID'
    utterance.onend = finished
    utterance.onerror = finished
    window.speechSynthesis.speak(utterance)
  }
}

function select(index, enter = true) {
  stopVoice()
  active = index
  if (enter) element('hero').hidden = true
  const stop = stops[index]
  element('category').textContent = index ? 'POS ' + String(index).padStart(2, '0') : 'GERBANG MASUK'
  element('title').textContent = stop.title
  element('dialogue').textContent = stop.dialogue
  element('hours').textContent = stop.hours ? 'Jam buka · ' + stop.hours : ''
  element('whatsapp').href = 'https://wa.me/628117113536?text=' + encodeURIComponent('Halo Bangka Garage, saya ingin bertanya tentang ' + (index ? stop.title : 'Bangka Garage') + '.')
  element('maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Bangka Garage Jl. Solihin GP No.7 Pangkal Pinang')
  buttons.forEach((button, position) => button.setAttribute('aria-current', position === index ? 'true' : 'false'))
  if (enter) scene?.focus(stop)
}

element('start').addEventListener('click', () => {
  select(0)
  buttons[0].focus()
  speak()
})
element('voice').addEventListener('click', () => playing ? stopVoice() : speak())
select(0, false)

try {
  const { createScene } = await import('./scene.js')
  scene = createScene(element('scene'), stops)
  if (element('hero').hidden) scene.focus(stops[active])
} catch {
  element('scene-status').textContent = 'Tampilan 3D tidak tersedia. Tur dan informasi tetap bisa dibuka.'
}

