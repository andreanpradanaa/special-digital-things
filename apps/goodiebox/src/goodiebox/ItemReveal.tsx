import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowUpRight, Pause, Play, X } from '@phosphor-icons/react'
import { availableItems } from './itemCatalog'
import { getItemPalette } from './boxAppearance'
import type { GiftItemData, LetterGiftItem } from './types'

type Props = {
  item: GiftItemData
  boxColor: string
  senderName?: string
  recipientName?: string
  onClose: () => void
}

function spotifyEmbedUrl(url: string) {
  const match = url.match(/open\.spotify\.com\/(playlist|track|album|episode)\/([A-Za-z0-9]+)/)
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null
}

function videoSource(url: string): { kind: 'youtube' | 'vimeo' | 'file' | 'link'; src?: string } {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/)
  if (youtube) return { kind: 'youtube', src: `https://www.youtube.com/embed/${youtube[1]}?rel=0` }
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return { kind: 'vimeo', src: `https://player.vimeo.com/video/${vimeo[1]}` }
  if (/\.(mp4|webm)(\?.*)?$/.test(url)) return { kind: 'file', src: url }
  return { kind: 'link' }
}

// — Surat: segel ditekan, tutup amplop terbuka, kertas muncul —
function LetterScene({ item, recipientName }: { item: LetterGiftItem; recipientName?: string }) {
  const [opened, setOpened] = useState(false)
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div className={`letter-scene${opened ? ' letter-scene--open' : ''}`}>
      <button type="button" className="letter-envelope" onClick={() => setOpened(true)} tabIndex={opened ? -1 : 0} aria-label="Pecahkan segel dan buka amplop">
        <span className="letter-envelope__flap" aria-hidden="true">
          <span className="letter-envelope__seal" />
        </span>
        <span className="letter-envelope__to" aria-hidden="true">{recipientName ? `Untuk ${recipientName}` : 'Untukmu'}</span>
      </button>
      {!opened && <span className="letter-scene__hint" aria-hidden="true">pecahkan segelnya…</span>}
      <article className="letter-paper" aria-hidden={!opened}>
        <span className="letter-paper__date">{today}</span>
        {recipientName && <p className="letter-paper__to">Untuk {recipientName},</p>}
        <p className="letter-paper__message">{item.message || 'Masih kosong — pesan belum ditulis.'}</p>
        {item.signature && <p className="letter-paper__signature">{item.signature}</p>}
      </article>
    </div>
  )
}

const VOICE_BARS = [0.35, 0.6, 0.45, 0.8, 0.55, 0.7, 0.4, 0.65, 0.5, 0.75, 0.45, 0.6, 0.38, 0.55, 0.7, 0.42]

// — Voice note: bubble messenger dengan pemutar sungguhan —
function VoiceBubble({ src, duration, sender }: { src: string; duration: string; sender?: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (playing) el.pause()
    else el.play()
  }
  return (
    <div className={`voice-bubble${playing ? ' voice-bubble--playing' : ''}`}>
      <span className="voice-bubble__avatar" aria-hidden="true">{(sender || '?').trim().charAt(0).toUpperCase()}</span>
      <div className="voice-bubble__body">
        <div className="voice-bubble__row">
          <button type="button" className="voice-bubble__button" onClick={toggle} aria-label={playing ? 'Jeda pesan suara' : 'Putar pesan suara'}>
            {playing ? <Pause size={14} weight="fill" aria-hidden="true" /> : <Play size={14} weight="fill" aria-hidden="true" />}
          </button>
          <span className="voice-bubble__wave" aria-hidden="true">
            {VOICE_BARS.map((height, index) => (
              <span
                key={index}
                style={{
                  height: `${height * 100}%`,
                  ...(progress > 0 && index / VOICE_BARS.length <= progress ? { opacity: 1 } : {}),
                }}
              />
            ))}
          </span>
          {duration && <span className="voice-bubble__time">{duration}</span>}
        </div>
        {sender && <span className="voice-bubble__sender">{sender}</span>}
      </div>
      <audio
        ref={audio}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0) }}
        onTimeUpdate={(event) => setProgress(event.currentTarget.duration ? event.currentTarget.currentTime / event.currentTarget.duration : 0)}
      />
    </div>
  )
}

// Focused reveal: the box dims behind while the chosen item takes the stage —
// each one styled and behaving like the real thing.
export function ItemReveal({ item, boxColor, senderName, recipientName, onClose }: Props) {
  const closeButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeButton.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  const palette = getItemPalette(boxColor)
  const label = availableItems.find((entry) => entry.type === item.type)?.label ?? item.type
  const accents = {
    '--reveal-accent': palette.accent,
    '--reveal-accent-soft': palette.accentSoft,
    '--reveal-accent-deep': palette.accentDeep,
  } as CSSProperties

  let body = null
  switch (item.type) {
    case 'letter':
      body = <LetterScene item={item} recipientName={recipientName} />
      break
    case 'photo':
      body = <figure className="photo-frame">
        <span className="photo-frame__mat">
          {item.imageUrl
            ? <img src={item.imageUrl} alt={item.title || 'Kenangan'} />
            : <span className="photo-frame__empty" aria-hidden="true">▣</span>}
          <span className="photo-frame__glass" aria-hidden="true" />
          {item.title && <figcaption className="photo-frame__caption">{item.title}</figcaption>}
        </span>
      </figure>
      break
    case 'music': {
      const embed = item.url ? spotifyEmbedUrl(item.url) : null
      body = embed
        ? <div className="spotify-frame">
          <iframe
            title={item.title || 'Playlist'}
            src={embed}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
        : <div className="spotify-card">
          <span className="spotify-card__art" aria-hidden="true">♪</span>
          <h2 className="spotify-card__title">{item.title || 'Playlist untukmu'}</h2>
          <p className="spotify-card__desc">{[item.subtitle, senderName && `Dibuat oleh ${senderName}`].filter(Boolean).join(' · ')}</p>
          {item.url && <a className="spotify-card__play" href={item.url} target="_blank" rel="noreferrer" aria-label="Dengarkan playlist"><Play size={22} weight="fill" aria-hidden="true" /></a>}
          <span className="spotify-card__bar" aria-hidden="true"><span /></span>
        </div>
      break
    }
    case 'voucher':
      body = <div className="voucher-ticket">
        <span className="voucher-ticket__foil" aria-hidden="true" />
        <div className="voucher-ticket__main">
          <span className="voucher-ticket__brand">Gift Voucher</span>
          <h2>{item.title || 'Voucher'}</h2>
          {item.description && <p>{item.description}</p>}
          <span className="voucher-ticket__fine">Berlaku selamanya · dari {senderName || 'seseorang yang sayang'}</span>
        </div>
        {item.code && <div className="voucher-ticket__stub">
          <span className="voucher-ticket__code">{item.code}</span>
          <span className="voucher-ticket__barcode" aria-hidden="true" />
        </div>}
      </div>
      break
    case 'audio':
      body = <>
        <h2 className="item-reveal__title">{item.title || 'Pesan suara untukmu'}</h2>
        {item.audioUrl
          ? <VoiceBubble src={item.audioUrl} duration={item.duration} sender={senderName} />
          : item.duration && <p className="item-reveal__subtitle">{`Durasi ${item.duration}`}</p>}
      </>
      break
    case 'video': {
      // File unggahan (sudah lolos batas 30 detik di builder) menang atas link.
      const source = item.videoUrl
        ? { kind: 'file' as const, src: item.videoUrl }
        : item.url ? videoSource(item.url) : { kind: 'link' as const }
      body = <div className="video-card">
        {source.kind === 'file'
          ? <video className="video-card__native" controls src={source.src} />
          : source.src
            ? <iframe className="video-card__frame" src={source.src} title={item.title || 'Video kenangan'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            : <>
              <div className="video-card__thumb" aria-hidden="true"><span className="video-card__playbtn"><Play size={20} weight="fill" /></span></div>
              {item.url && <a className="video-card__link" href={item.url} target="_blank" rel="noreferrer"><ArrowUpRight size={14} weight="bold" aria-hidden="true" />Tonton video</a>}
            </>}
      </div>
      break
    }
  }

  return <div className="item-reveal-backdrop" onClick={onClose}>
    <div
      className={`item-reveal item-reveal--${item.type}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      style={accents}
      onClick={(event) => event.stopPropagation()}
    >
      <button ref={closeButton} type="button" className="item-reveal__close" onClick={onClose} aria-label="Tutup">
        <X size={15} weight="bold" aria-hidden="true" />
      </button>
      <span className="item-reveal__kind">{label}</span>
      {body}
    </div>
  </div>
}
