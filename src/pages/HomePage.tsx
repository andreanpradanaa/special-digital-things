import { motion, useReducedMotion } from 'motion/react'
import { homeRoute } from '../app/themeRegistry.ts'
import { HeartRepairPreview } from './gallery/HeartRepairPreview.tsx'
import { LostAndFoundPreview } from './gallery/LostAndFoundPreview.tsx'
import { MidnightRadioPreview } from './gallery/MidnightRadioPreview.tsx'
import styles from './HomePage.module.css'

export function HomePage() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className={styles.page} aria-labelledby="home-title">
      <div className={styles.hero}>
        <motion.div
          className={styles.heroCopy}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
        >
          <p className={styles.eyebrow}>
            A small collection of big feelings
          </p>
          <h1 id="home-title">{homeRoute.title}</h1>
          <p className={styles.intro}>
            Tiga pengalaman interaktif untuk menyampaikan hal-hal yang terkadang
            sulit diucapkan.
          </p>
        </motion.div>

        <motion.aside
          className={styles.giftNote}
          aria-label="Hadiah dari Ari untuk Nara"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.12 }}
        >
          <span>Dari Ari</span>
          <span className={styles.noteLine} aria-hidden="true" />
          <span>Untuk Nara</span>
          <svg viewBox="0 0 36 30" aria-hidden="true" focusable="false">
            <path d="M18 27C13 21 4 16 4 9.5 4 5.8 6.7 3 10.5 3c2.6 0 5 1.5 7.5 4.5C20.5 4.5 22.9 3 25.5 3 29.3 3 32 5.8 32 9.5 32 16 23 21 18 27Z" />
          </svg>
        </motion.aside>
      </div>

      <nav className={styles.gallery} aria-labelledby="theme-navigation-title">
        <h2 className="visually-hidden" id="theme-navigation-title">
          Pilih pengalaman hadiah digital
        </h2>
        <ul className={styles.shelf}>
          <motion.li
            className={`${styles.item} ${styles.heartItem}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.16, ease: 'easeOut' }}
          >
            <HeartRepairPreview />
          </motion.li>
          <motion.li
            className={`${styles.item} ${styles.lostItem}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.23, ease: 'easeOut' }}
          >
            <LostAndFoundPreview />
          </motion.li>
          <motion.li
            className={`${styles.item} ${styles.radioItem}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.3, ease: 'easeOut' }}
          >
            <MidnightRadioPreview />
          </motion.li>
        </ul>
      </nav>
    </section>
  )
}
