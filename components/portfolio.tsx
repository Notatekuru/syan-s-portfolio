'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, AudioLines, BookOpen, Brain, Camera, Code2, Heart, History, Mail, Music2, PenLine, Play, Sparkles, Square } from 'lucide-react'

const moods = [
  { name: 'Happy', icon: '☀', color: 'sun', line: 'Biarkan rasa senangmu menari.', rec: 'Pop cerah, funk ringan, atau lagu yang bikin ingin ikut bernyanyi.' },
  { name: 'Calm', icon: '☁', color: 'lavender', line: 'Pelan-pelan juga tetap sampai.', rec: 'Lo-fi, akustik, atau instrumental yang memberi ruang untuk bernapas.' },
  { name: 'Sad', icon: '☂', color: 'blue', line: 'Nggak apa-apa merasa semuanya.', rec: 'Melodi piano dan lagu pelan yang membuatmu merasa dimengerti.' },
  { name: 'Stressed', icon: '〰', color: 'peach', line: 'Kita cari jeda kecil, ya.', rec: 'Ambient lembut atau suara alam; mulai dari satu napas panjang.' },
  { name: 'Motivated', icon: '✳', color: 'yellow', line: 'Energi ini punya tujuan.', rec: 'Beat energik, pop upbeat, atau lagu yang terasa seperti opening scene.' },
  { name: 'Curious', icon: '✦', color: 'green', line: 'Pertanyaanmu adalah awal yang bagus.', rec: 'Coba genre baru—jazz, folk, atau playlist yang belum pernah kamu buka.' },
]
const interests = [
  { title: 'Psychology', icon: Brain, note: 'Mencoba memahami cerita di balik perilaku dan perasaan.' },
  { title: 'Music', icon: Music2, note: 'Ruang kecil tempat emosi bisa punya suara.' },
  { title: 'Research', icon: Sparkles, note: 'Mengubah rasa penasaran menjadi pertanyaan yang bisa diuji.' },
  { title: 'History', icon: History, note: 'Melihat bagaimana manusia dan ide berubah dari waktu ke waktu.' },
  { title: 'Coding', icon: Code2, note: 'Membangun hal kecil yang membuat ide terasa nyata.' },
  { title: 'Writing', icon: PenLine, note: 'Menyimpan pikiran sebelum ia keburu lewat.' },
]
const ideas = [
  { title: 'Does music affect mood?', text: 'Sebuah eksperimen kecil: dengarkan beberapa jenis musik, lalu amati perubahan suasana hati. Apa yang berubah—energi, ketenangan, atau cara kita memaknai hari?' },
  { title: 'Can singing help regulate emotions?', text: 'Mungkin suara kita sendiri bisa menjadi jangkar. Aku ingin tahu bagaimana bernyanyi memengaruhi napas, ketegangan, dan rasa lega.' },
  { title: 'What does your favorite genre say about you?', text: 'Bukan untuk memberi label—lebih seperti membuka percakapan tentang kenangan, identitas, dan alasan sebuah lagu terasa dekat.' },
]

export function Portfolio() {
  const [mood, setMood] = useState<(typeof moods)[number] | null>(null)
  const [moodOrder, setMoodOrder] = useState(moods)
  const [draggingMood, setDraggingMood] = useState<string | null>(null)
  const [idea, setIdea] = useState<number | null>(null)
  const [score, setScore] = useState(52)
  const [chapterOpen, setChapterOpen] = useState(false)
  const projectsTrackRef = useRef<HTMLDivElement>(null)
  const moodRailRef = useRef<HTMLDivElement>(null)
  const projectDragRef = useRef({ pointerId: -1, startX: 0, startY: 0, startScroll: 0, lastX: 0, lastTime: 0, velocity: 0, dragging: false, chapter: false })
  const moodDragRef = useRef<{ name: string; pointerId: number; startX: number; startY: number; dragging: boolean } | null>(null)
  const suppressProjectClickRef = useRef(false)
  const suppressMoodClickRef = useRef(false)
  const inertiaFrameRef = useRef(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioTime, setAudioTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const syncDuration = () => {
      if (Number.isFinite(audio.duration)) setAudioDuration(audio.duration)
    }
    audio.addEventListener('loadedmetadata', syncDuration)
    audio.addEventListener('durationchange', syncDuration)
    syncDuration()
    return () => {
      audio.removeEventListener('loadedmetadata', syncDuration)
      audio.removeEventListener('durationchange', syncDuration)
    }
  }, [])

  useEffect(() => {
    const move = (event: MouseEvent) => {
      const cursor = cursorRef.current
      if (!cursor) return
      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`
    }
    const over = (event: MouseEvent) => {
      const target = event.target
      const nextHovering = target instanceof Element && Boolean(target.closest('a, button, input, textarea, [role="button"]'))
      setHovering(current => current === nextHovering ? current : nextHovering)
    }
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over)
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: 0.13 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    let frame = 0
    const updateScrollStory = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const hero = document.querySelector<HTMLElement>('.hero')
        const heroArt = document.querySelector<HTMLElement>('.hero-art')
        if (hero && heroArt) {
          const shift = Math.min(0, Math.max(-38, hero.getBoundingClientRect().top * 0.045))
          heroArt.style.setProperty('--scroll-shift', `${shift}px`)
        }
        const timeline = document.querySelector<HTMLElement>('.timeline')
        if (timeline) {
          const rect = timeline.getBoundingClientRect()
          const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)))
          timeline.style.setProperty('--timeline-progress', `${progress}`)
        }
      })
    }
    window.addEventListener('scroll', updateScrollStory, { passive: true })
    updateScrollStory()
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('scroll', updateScrollStory)
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  const onProjectsPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    window.cancelAnimationFrame(inertiaFrameRef.current)
    projectDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: event.currentTarget.scrollLeft,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      dragging: false,
      chapter: Boolean((event.target as HTMLElement).closest('.chapter-card')),
    }
  }
  const onProjectsPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = projectDragRef.current
    if (event.pointerId !== drag.pointerId) return
    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (!drag.dragging && Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.classList.add('is-dragging')
      suppressProjectClickRef.current = true
    }
    if (!drag.dragging) return
    const now = performance.now()
    drag.velocity = (drag.lastX - event.clientX) / Math.max(1, now - drag.lastTime) * 16
    drag.lastX = event.clientX
    drag.lastTime = now
    event.currentTarget.scrollLeft = drag.startScroll + drag.startX - event.clientX
  }
  const onProjectsPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = projectDragRef.current
    if (event.pointerId !== drag.pointerId) return
    const deltaX = event.clientX - drag.startX
    if (drag.dragging) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
      event.currentTarget.classList.remove('is-dragging')
      if (drag.chapter && Math.abs(deltaX) > 55) setChapterOpen(true)
      let velocity = drag.velocity
      const coast = () => {
        const track = projectsTrackRef.current
        if (!track || Math.abs(velocity) < 0.35) return
        track.scrollLeft += velocity
        velocity *= 0.92
        inertiaFrameRef.current = window.requestAnimationFrame(coast)
      }
      inertiaFrameRef.current = window.requestAnimationFrame(coast)
      window.setTimeout(() => { suppressProjectClickRef.current = false }, 0)
    }
    drag.pointerId = -1
    drag.dragging = false
  }
  const onProjectsPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = projectDragRef.current
    if (event.pointerId !== drag.pointerId) return
    event.currentTarget.classList.remove('is-dragging')
    drag.pointerId = -1
    drag.dragging = false
    suppressProjectClickRef.current = false
  }
  const onProjectsClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressProjectClickRef.current) return
    event.preventDefault()
    event.stopPropagation()
    suppressProjectClickRef.current = false
  }
  const onMoodPointerDown = (event: React.PointerEvent<HTMLButtonElement>, name: string) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    moodDragRef.current = { name, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, dragging: false }
  }
  const reorderMoodAt = (name: string, x: number, y: number) => {
    const buttons = Array.from(moodRailRef.current?.querySelectorAll<HTMLButtonElement>('[data-mood]') ?? [])
    const targetIndex = buttons.reduce((nearest, button, index) => {
      const rect = button.getBoundingClientRect()
      const distance = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2))
      return distance < nearest.distance ? { index, distance } : nearest
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index
    setMoodOrder(current => {
      const from = current.findIndex(item => item.name === name)
      if (from === targetIndex) return current
      const next = [...current]
      const [item] = next.splice(from, 1)
      next.splice(targetIndex, 0, item)
      return next
    })
  }
  const onMoodPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = moodDragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (!drag.dragging && Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setDraggingMood(drag.name)
      suppressMoodClickRef.current = true
    }
    if (!drag.dragging) return
    reorderMoodAt(drag.name, event.clientX, event.clientY)
  }
  const onMoodPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = moodDragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (!drag.dragging && Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.dragging = true
      suppressMoodClickRef.current = true
      setDraggingMood(drag.name)
    }
    if (drag.dragging) {
      reorderMoodAt(drag.name, event.clientX, event.clientY)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
      setDraggingMood(null)
      window.setTimeout(() => {
        suppressMoodClickRef.current = false
        moodDragRef.current = null
      }, 0)
    } else {
      moodDragRef.current = null
    }
  }
  const onMoodPointerCancel = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (moodDragRef.current?.pointerId !== event.pointerId) return
    moodDragRef.current = null
    suppressMoodClickRef.current = false
    setDraggingMood(null)
  }
  const onMoodClick = (event: React.MouseEvent<HTMLButtonElement>, item: (typeof moods)[number]) => {
    if (suppressMoodClickRef.current) {
      event.preventDefault()
      event.stopPropagation()
      suppressMoodClickRef.current = false
      moodDragRef.current = null
      return
    }
    setMood(item)
  }

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (Number.isFinite(audio.duration)) setAudioDuration(audio.duration)
    if (isPlaying) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
      return
    }
    void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }
  const seekAudio = (time: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    const nextTime = Math.min(audio.duration, Math.max(0, time))
    audio.currentTime = nextTime
    setAudioTime(nextTime)
  }
  const seekAudioFromPointer = (event: React.PointerEvent<HTMLInputElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (bounds.width === 0 || !audioDuration) return
    seekAudio(((event.clientX - bounds.left) / bounds.width) * audioDuration)
  }
  const formatAudioTime = (time: number) => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`

  const response = score < 30 ? 'Musik mungkin jadi teman sesekali—dan itu juga valid.' : score < 70 ? 'Musik punya tempat kecil yang berarti di harimu.' : 'Musik jelas menjadi bagian dari dunia emosimu.'
  return (
    <main>
      <div ref={cursorRef} className={`cursor-dot${hovering ? ' cursor-dot--large' : ''}`} aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Syan, ke beranda"><span className="brand-mark"><img src="/syan-portrait.jpg" alt=""/></span><span>syal</span></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navigasi utama" onClick={() => setMenuOpen(false)}>
          <a href="#about">Tentang</a><a href="#mood">Mood music</a><a href="#projects">Proyek</a><a href="#research">Riset</a><a className="nav-contact" href="#contact">Say hello <ArrowUpRight size={14}/></a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-grain" aria-hidden="true"/><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
        <div className="hero-content">
          <p className="eyebrow"><span className="eyebrow-dot"/> A curious mind in progress</p>
          <h1>Mind<br/><em>Melody</em><span className="hero-spark">✳</span></h1>
          <p className="hero-subtitle">Mengenal manusia lewat<br/><span>psikologi, musik, dan riset.</span></p>
          <p className="hero-note">catatan kecil dari pikiran yang terus bertanya ↗</p>
          <div className="hero-actions"><a className="button button-dark" href="#about">Jelajahi pikiranku <ArrowDown size={16}/></a><a className="button button-text" href="#projects">Lihat proyek <ArrowUpRight size={16}/></a></div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi piringan vinyl">
          <button type="button" className={`art-disc${isPlaying ? ' is-spinning' : ''}`} onClick={togglePlayback} aria-label={isPlaying ? 'Hentikan lagu' : 'Putar lagu'}>
            <span className="disc-inner disc-inner--image"><img src="/placeholder.jpg" alt="Ikon not musik"/></span>
            <span className="disc-label">SIDE A · SYAN</span>
          </button>
          <div className="vinyl-controls">
            <div className="vinyl-control-row">
              <button type="button" className="vinyl-play" onClick={togglePlayback} aria-label={isPlaying ? 'Hentikan lagu' : 'Putar lagu'}>
                {isPlaying ? <Square size={13}/> : <Play size={13}/>}
                <span>{isPlaying ? 'Stop' : 'Play'}</span>
              </button>
              <span className="vinyl-track-title">Sempurna - English Ver.</span>
            </div>
            <div className="vinyl-timeline">
              <span>{formatAudioTime(audioTime)}</span>
              <input
                className="vinyl-seek"
                type="range"
                min="0"
                max={audioDuration || 0}
                step="0.1"
                value={Math.min(audioTime, audioDuration || 0)}
                aria-label="Posisi lagu"
                disabled={!audioDuration}
                style={{ '--audio-progress': `${audioDuration ? (audioTime / audioDuration) * 100 : 0}%` } as React.CSSProperties}
                onChange={event => seekAudio(Number(event.currentTarget.value))}
                onPointerDown={event => {
                  event.currentTarget.setPointerCapture(event.pointerId)
                  seekAudioFromPointer(event)
                }}
                onPointerMove={event => {
                  if (event.buttons === 1) seekAudioFromPointer(event)
                }}
              />
              <span>{formatAudioTime(audioDuration)}</span>
            </div>
          </div>
          <audio
            ref={audioRef}
            src="/sempurna-english-ver.mp3"
            preload="metadata"
            onLoadedMetadata={event => setAudioDuration(event.currentTarget.duration)}
            onDurationChange={event => setAudioDuration(event.currentTarget.duration)}
            onTimeUpdate={event => setAudioTime(event.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
          />
          <div className="wave-lines"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          <span className="floating-note note-a">♪</span><span className="floating-note note-b">♫</span><span className="art-caption">a mind in many frequencies</span>
        </div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="hero-bottom-line"/><span>01 / 06</span></div>
      </section>

      <section className="intro section-wrap reveal" id="about">
        <div className="section-index">01 <span>— ABOUT</span></div>
        <div className="intro-copy"><p className="handwritten">halo, aku Syan <span>♡</span></p><h2>Di antara rasa,<br/>nada, dan <em>rasa ingin tahu.</em></h2><p className="intro-text">Hi, aku Syan—singkatan dari Isyana Arlisya. Aku penasaran dengan manusia, cerita, emosi, musik, dan bagaimana momen-momen kecil bisa membentuk perasaan kita.</p><p className="intro-text">Saat ini aku sedang menapaki jalan menuju S1 Psikologi. Suatu hari, aku ingin meneliti hubungan musik, emosi, dan kesejahteraan—dengan rasa ingin tahu dan empati sebagai kompas.</p><a className="text-link" href="#journey">sedikit tentang perjalananku <ArrowUpRight size={15}/></a></div>
        <div className="intro-stamp"><span>PSYCHOLOGY</span><span className="stamp-star">✳</span><span>IN THE MAKING</span></div>
      </section>

      <section className="mood-section" id="mood"><div className="section-wrap mood-inner reveal"><div className="section-index">02 <span>— A LITTLE EXPERIMENT</span></div><div className="mood-heading"><div><p className="handwritten">check in with yourself</p><h2>How are you<br/><em>feeling today?</em></h2></div><p className="mood-intro">Nggak ada jawaban benar. Pilih yang paling mendekati—kita cari soundtrack kecil untuk momenmu.</p></div><div className="mood-rail-wrap"><div className="mood-buttons" ref={moodRailRef} role="group" aria-label="Pilih suasana hati; seret kartu untuk mengatur ulang">{moodOrder.map(item => <button key={item.name} data-mood={item.name} className={`mood-chip ${item.color}${mood?.name === item.name ? ' selected' : ''}${draggingMood === item.name ? ' mood-chip-dragging' : ''}`} onPointerDown={event => onMoodPointerDown(event, item.name)} onPointerMove={onMoodPointerMove} onPointerUp={onMoodPointerUp} onPointerCancel={onMoodPointerCancel} onClick={event => onMoodClick(event, item)} aria-pressed={mood?.name === item.name} aria-label={`${item.name}; drag to reorder`}><span>{item.icon}</span>{item.name}</button>)}</div><span className="mood-drag-note">drag to rearrange your notes ↗</span></div><div className={`mood-result${mood ? ' mood-result-visible' : ''}`} aria-live="polite">{mood ? <><div className={`mood-result-icon ${mood.color}`}><AudioLines size={23}/></div><div className="mood-result-copy"><span className="result-kicker">A NOTE FOR YOUR {mood.name.toUpperCase()} MOMENT</span><h3>{mood.line}</h3><p>{mood.rec}</p></div><div className="mini-eq" aria-hidden="true">{[14,25,19,32,16,28,12,22,30,16,26].map((height, i) => <i key={i} style={{ '--bar-height': `${height}px`, '--bar-delay': `${i * 70}ms` } as React.CSSProperties}/>)}</div></> : <div className="mood-empty"><span>♫</span><p>Pilih mood-mu untuk membuka<br/>rekomendasi musik kecil.</p></div>}</div><p className="mood-footnote">* Musik bukan obat—hanya satu cara lembut untuk menemani perasaan.</p></div></section>

      <section className="interests section-wrap reveal"><div className="section-index">03 <span>— THINGS I CARRY</span></div><div className="interests-head"><div><p className="handwritten">many tabs open, always</p><h2>Inside Syan&apos;s <em>mind.</em></h2></div><p>Beberapa hal yang sering tinggal di kepala—dan mungkin suatu hari bertemu dalam satu pertanyaan riset.</p></div><div className="interest-grid">{interests.map((item, i) => <article className={`interest-card interest-${i + 1}`} key={item.title} tabIndex={0}><span className="interest-number">0{i + 1}</span><item.icon className="interest-icon" strokeWidth={1.5}/><h3>{item.title}</h3><p>{item.note}</p><span className="interest-arrow">↗</span></article>)}</div><span className="margin-note">little pieces of a bigger picture ↗</span></section>

      <section className="projects-section" id="projects"><div className="section-wrap projects-inner reveal"><div className="section-index">04 <span>— THINGS I&apos;VE MADE</span></div><div className="projects-heading"><div><p className="handwritten">from thought to thing</p><h2>Little worlds,<br/><em>big feelings.</em></h2></div><p>Eksperimen kreatif, catatan riset, dan ide-ide yang sedang menunggu waktunya.</p></div><p className="project-drag-note">DRAG TO EXPLORE <span aria-hidden="true">—</span> SWIPE ON MOBILE</p><div className="project-track" ref={projectsTrackRef} role="region" aria-label="Project cards. Drag horizontally or use arrow keys" tabIndex={0} onPointerDown={onProjectsPointerDown} onPointerMove={onProjectsPointerMove} onPointerUp={onProjectsPointerUp} onPointerCancel={onProjectsPointerCancel} onClickCapture={onProjectsClickCapture} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.currentTarget.scrollBy({ left: event.key === 'ArrowRight' ? 340 : -340, behavior: 'smooth' }) } }}><a className={`project-card chapter-card${chapterOpen ? ' chapter-open' : ' chapter-closed'}`} href="https://v0-chapter-18.vercel.app/" target="_blank" rel="noreferrer" aria-label={chapterOpen ? 'Open Chapter 18 in a new tab' : 'Reveal Chapter 18, then open it'} aria-expanded={chapterOpen} onClick={event => { if (!chapterOpen) { event.preventDefault(); setChapterOpen(true) } }}><div className="chapter-art"><span className="chapter-sun"/><span className="chapter-moon">✳</span><div className="chapter-orbit"><span>18</span></div><span className="chapter-side-note">a quiet little universe</span><span className="chapter-doodle">✦</span></div><div className="project-content"><div className="project-label"><span>01 / INTERACTIVE EXPERIENCE</span><ArrowUpRight size={18}/></div><h3>Chapter 18</h3><p>A small digital world made with intention, warmth, and a little bit of mystery.</p><div className="tag-row"><span>Interactive Web</span><span>Creative Coding</span><span>Digital Experience</span></div><span className="project-cta">Enter Chapter 18 <ArrowUpRight size={15}/></span></div><span className={`chapter-envelope${chapterOpen ? ' chapter-envelope-open' : ''}`} aria-hidden="true"><span className="envelope-stamp">18</span><span className="envelope-title">A little mystery<br/>is waiting inside.</span><span className="envelope-instruction">{chapterOpen ? 'TAP AGAIN TO ENTER ↗' : 'TAP OR DRAG TO UNSEAL'}</span><span className="envelope-flap"/></span></a><article className="project-card coming-card"><div className="coming-art"><span className="coming-wave wave-left">〰</span><span className="coming-disc"><Music2 size={27}/></span><span className="coming-wave wave-right">〰</span><span className="coming-label">IN THE WORKS</span></div><div className="project-content"><div className="project-label"><span>02 / EARLY NOTES</span><span className="coming-soon">COMING SOON</span></div><h3>MoodMusic</h3><p>Music and Emotion Analysis</p><div className="tag-row"><span>Music psychology</span><span>Data</span></div></div></article><article className="project-card coming-card coming-card-two"><div className="coming-art"><span className="coming-star">✳</span><span className="coming-path"/><span className="coming-label">A QUESTION, GROWING</span></div><div className="project-content"><div className="project-label"><span>03 / EARLY NOTES</span><span className="coming-soon">COMING SOON</span></div><h3>Psychology of Music</h3><p>Exploring Emotions Through Data</p><div className="tag-row"><span>Research</span><span>Emotion</span></div></div></article></div></div></section>

      <section className="research section-wrap reveal" id="research"><div className="section-index">05 <span>— QUESTIONS I KEEP</span></div><div className="research-head"><div><p className="handwritten">the fun part is asking</p><h2>Research<br/><em>playground.</em></h2></div><p>Belum semua punya jawaban. Justru itu yang bikin seru—klik satu pertanyaan untuk melihat ke mana pikiranku berjalan.</p></div><div className="idea-list">{ideas.map((item, i) => <button key={item.title} className={`idea-row${idea === i ? ' idea-open' : ''}`} onClick={() => setIdea(idea === i ? null : i)} aria-expanded={idea === i}><span className="idea-num">0{i + 1}</span><span className="idea-body"><span className="idea-title">{item.title}</span>{idea === i && <span className="idea-detail">{item.text}<span className="idea-visual" aria-hidden="true">{i === 0 ? '♫ 〰 ♬' : i === 1 ? '♪ ♡ ♪' : '✦ ♫ ✦'}</span></span>}</span><span className="idea-toggle">{idea === i ? '−' : '+'}</span></button>)}</div><div className="poll-card"><div className="poll-top"><span className="poll-icon"><Heart size={19}/></span><div><span className="poll-kicker">NO. 01 · A VERY UNOFFICIAL POLL</span><h3>Seberapa besar musik<br/>memengaruhi mood-mu?</h3></div></div><div className="slider-row"><span>sedikit</span><input type="range" min="0" max="100" value={score} onChange={e => setScore(Number(e.target.value))} aria-label="Seberapa besar musik memengaruhi mood" aria-valuetext={`${score} dari 100. ${response}`} style={{ '--range-progress': `${score}%` } as React.CSSProperties}/><span>banget</span></div><div className="poll-response"><span className="poll-score">{score}<small>/100</small></span><p aria-live="polite">{response}</p><span className="poll-spark">✳</span></div></div></section>

      <section className="journey-section" id="journey"><div className="section-wrap journey-inner reveal"><div className="section-index">06 <span>— STILL BECOMING</span></div><div className="journey-heading"><div><p className="handwritten">one step, then another</p><h2>My <em>journey.</em></h2></div><span className="journey-aside">Nggak harus sudah sampai.<br/>Yang penting terus bertanya.</span></div><div className="timeline"><article className="timeline-item"><span className="timeline-dot dot-blue"/><span className="timeline-label">THE BIG QUESTION</span><h3>Memilih Psikologi<br/>sebagai arah masa depan.</h3><p>Sebuah keputusan yang dimulai dari rasa ingin tahu tentang manusia.</p><span className="timeline-date">01 — A START</span></article><article className="timeline-item"><span className="timeline-dot dot-lilac"/><span className="timeline-label">MAKING THINGS</span><h3>Mulai belajar coding<br/>dan membuat pengalaman digital.</h3><p>Dari ide kecil ke ruang interaktif yang bisa dijelajahi.</p><span className="timeline-date">02 — IN PROGRESS</span></article><article className="timeline-item"><span className="timeline-dot dot-yellow"/><span className="timeline-label">CONNECTING DOTS</span><h3>Belajar analisis data<br/>dan psikologi musik.</h3><p>Mencari cara agar rasa penasaran punya bentuk dan arah.</p><span className="timeline-date">03 — NEXT CHAPTER</span></article><article className="timeline-item timeline-future"><span className="timeline-dot dot-peach"/><span className="timeline-label">THE LONG NOTE</span><h3>Menjadi peneliti<br/>psikologi musik.</h3><p>Mengeksplorasi hubungan musik, emosi, dan kesejahteraan.</p><span className="timeline-date">04 — A DREAM</span></article></div></div></section>

      <section className="contact-section" id="contact">
        <div className="contact-decoration" aria-hidden="true">♫</div>
        <div className="section-wrap contact-inner reveal">
          <div className="section-index">07 <span>— YOUR TURN</span></div>
          <div className="contact-grid">
            <div className="contact-copy">
              <p className="handwritten">pintu selalu terbuka</p>
              <h2>Let&apos;s create<br/>something <em>meaningful.</em></h2>
              <p>Punya cerita, ide, playlist, atau pertanyaan? Aku senang mendengarnya.</p>
              <div className="social-links" aria-label="Connect with Syan">
                <a href="mailto:isyanaarlisya315@gmail.com" aria-label="Email Syan"><Mail size={17}/><span>Email</span><span className="social-caption">Let&apos;s talk about ideas, music, and psychology.</span></a>
                <a href="https://www.instagram.com/purflyan_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)"><Camera size={17}/><span>Instagram</span><ArrowUpRight size={13}/><span className="social-caption">Come say hi on Instagram.</span></a>
                <a href="https://github.com/isyanaarlisya315-source" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)"><Code2 size={17}/><span>GitHub</span><ArrowUpRight size={13}/><span className="social-caption">See what I&apos;m building.</span></a>
              </div>
            </div>
            <form className="contact-form" onSubmit={event => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              const name = String(formData.get('name') ?? '')
              const email = String(formData.get('email') ?? '')
              const message = String(formData.get('message') ?? '')
              const params = new URLSearchParams({
                subject: `Pesan dari ${name}`,
                body: `Nama: ${name}\nEmail: ${email}\n\n${message}`,
              })
              window.location.href = `mailto:isyanaarlisya315@gmail.com?${params}`
            }}>
              <label>Namamu<input name="name" placeholder="Siapa namamu?" required/></label>
              <label>Email kamu<input name="email" type="email" placeholder="you@example.com" required/></label>
              <label>Ceritakan sedikit<textarea name="message" rows={3} placeholder="Apa yang sedang kamu pikirkan?" required/></label>
              <button className="button button-dark" type="submit">Buka email <ArrowUpRight size={15}/></button>
              <span className="form-note" aria-live="polite">Draf pesan akan dibuka di aplikasi email Anda.</span>
            </form>
          </div>
          <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">s.</span><span>syal</span></a><span>Made with curiosity & a little melody.</span><a href="#home" className="back-top">BACK TO TOP ↑</a><span className="full-name">Isyana Arlisya · © 2026</span></footer>
        </div>
      </section>
    </main>
  )
}
