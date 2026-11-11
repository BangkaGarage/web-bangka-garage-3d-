import { stops } from './data.js'

const element = id => document.getElementById(id)
let active = 0
let scene
let guideState = 'intro'
let tourTimer
document.documentElement.classList.add('intro-open')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

const buttons = stops.map((stop, index) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = stop.name
  button.addEventListener('click', () => {
    if (guideState === 'guiding') {
      clearTimeout(tourTimer)
      guideState = 'closed'
    }
    select(index)
    document.getElementById(index ? "unit-" + index : "beranda").scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth" })
  })
  element('stops').append(button)
  return button
})

const chapters = stops.slice(1).map((stop, position) => {
  const chapter = document.createElement('section')
  chapter.className = 'chapter'
  chapter.id = 'unit-' + (position + 1)
  chapter.style.setProperty('--unit-color', '#' + stop.color.toString(16).padStart(6, '0'))
  const title = document.createElement('h2')
  title.textContent = stop.title
  const detail = document.createElement('p')
  detail.textContent = stop.dialogue
  const hours = document.createElement('p')
  hours.textContent = 'Jam buka · ' + stop.hours
  const services = document.createElement('p')
  services.textContent = stop.services
  const contact = document.createElement('a')
  contact.href = contactUrl(stop.title, stop.phone)
  contact.target = '_blank'
  contact.rel = 'noopener'
  contact.textContent = 'Hubungi via WhatsApp ↗'
  if (stop.photo) {
    const image = document.createElement('img')
    image.src = stop.photo
    image.alt = stop.title + ' di Bangka Garage'
    image.loading = 'lazy'
    image.decoding = 'async'
    image.className = 'chapter-photo'
    chapter.append(image)
  }
  chapter.append(title, detail, services, hours, contact)
  if (stop.barberPhone) {
    const barber = contact.cloneNode()
    barber.href = contactUrl('Barbertopia', stop.barberPhone)
    barber.textContent = 'WhatsApp Barbertopia ↗'
    chapter.append(barber)
  }
  element('chapters').append(chapter)
  return chapter
})

function contactUrl(title, phone = '628117113536') {
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Halo Bangka Garage, saya ingin bertanya tentang ' + title + '.')
}

const scrollStops = [element('beranda'), ...chapters]
let scrollFrame = 0
window.addEventListener('scroll', () => {
  if (scrollFrame || guideState === 'guiding') return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    if (guideState === 'guiding') return
    const midpoint = window.innerHeight / 2
    const index = scrollStops.findIndex(stop => {
      const bounds = stop.getBoundingClientRect()
      return bounds.top <= midpoint && bounds.bottom >= midpoint
    })
    if (index >= 0 && index !== active) select(index)
  })
}, { passive: true })

function select(index) {
  active = index
  const stop = stops[index]
  element('category').textContent = index ? 'POS ' + String(index).padStart(2, '0') : 'BANGKA GARAGE'
  element('title').textContent = index ? stop.title : 'Bangka Garage'
  element('details').textContent = index ? stop.dialogue : 'Jelajahi lima unit usaha Bangka Garage. Pilih tempat yang ingin kamu kunjungi.'
  renderGuide()
  element('hours').textContent = stop.hours ? 'Jam buka · ' + stop.hours : ''
  element('whatsapp').href = contactUrl(index ? stop.title : 'Bangka Garage', stop.phone)
  element('maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Bangka Garage Jl. Solihin GP No.7 Pangkal Pinang')
  buttons.forEach((button, position) => button.setAttribute('aria-current', position === index ? 'true' : 'false'))
  scene?.focus(index ? stop : null)
}

function renderGuide() {
  element('explore-link').hidden = guideState === 'intro'
  element('guide-overlay').hidden = guideState === 'intro' || guideState === 'closed'
  element('choices').hidden = guideState !== 'welcome'
  element('tour-actions').hidden = !['guiding', 'finished'].includes(guideState)
  element('next-stop').hidden = guideState !== 'guiding'
  element('next-stop').textContent = active === stops.length - 1 ? 'Selesai' : 'Lanjut'
  element('reopen').hidden = guideState !== 'closed'
  element('dialogue').textContent = guideState === 'welcome'
    ? 'Selamat datang di Bangka Garage! Apakah kamu sudah pernah ke sini? Butuh Lyla untuk memandu?'
    : guideState === 'finished'
      ? 'Kita sudah mengunjungi kelima unit usaha. Terima kasih sudah ikut tur bersama Lyla! Sekarang kamu bisa menjelajah sendiri.'
      : active ? stops[active].dialogue : 'Ayo jelajahi Bangka Garage! Pilih salah satu unit usaha di bawah untuk mulai.'
}

function closeGuide() {
  clearTimeout(tourTimer)
  guideState = 'closed'
  renderGuide()
  element('reopen').focus({ preventScroll: true })
}

function visit(index) {
  if (guideState !== 'guiding') return
  if (index >= stops.length) {
    guideState = 'finished'
    renderGuide()
    element('close-guide').focus({ preventScroll: true })
    return
  }
  select(index)
  chapters[index - 1].scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "center" })
  const words = stops[index].dialogue.trim().split(/\s+/).length
  tourTimer = setTimeout(() => visit(index + 1), Math.max(7000, words * 390 + 1300))
}

function startTour() {
  clearTimeout(tourTimer)
  guideState = 'guiding'
  visit(1)

  element('next-stop').focus({ preventScroll: true })
}

element('intro-start').addEventListener('click', () => {
  const intro = element('intro')
  intro.inert = true
  intro.classList.add('departing')
  setTimeout(() => {
    intro.hidden = true
    document.querySelector('main').inert = false
    document.documentElement.classList.remove('intro-open')
    window.scrollTo(0, 0)
    guideState = 'welcome'
    select(0)
    element('start').focus({ preventScroll: true })
  }, reducedMotion.matches ? 0 : 800)
})
element('start').addEventListener('click', startTour)
element('decline').addEventListener('click', closeGuide)
element('next-stop').addEventListener('click', () => {
  clearTimeout(tourTimer)
  visit(active + 1)
})
element('close-guide').addEventListener('click', closeGuide)
element('reopen').addEventListener('click', () => {
  clearTimeout(tourTimer)
  guideState = 'welcome'
  renderGuide()
  element('start').focus({ preventScroll: true })
})
select(0)
element('location-link').href = element('maps').href

try {
  const { createScene } = await import('./scene.js')
  scene = createScene(element('scene'), stops, element('portrait'))
  scene.focus(active ? stops[active] : null)
} catch {
  element('scene-status').textContent = 'Tampilan 3D tidak tersedia. Informasi setiap pos tetap bisa dibuka.'
}










