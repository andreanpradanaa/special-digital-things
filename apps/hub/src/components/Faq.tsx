import s from './Faq.module.css'

type Props = { items: { q: string; a: string }[] }

export function Faq({ items }: Props) {
  return (
    <div className={s.list}>
      {items.map((item, i) => (
        <details key={item.q} className={s.item} open={i === 0}>
          <summary className={s.summary}>
            <span>{item.q}</span>
            <span className={s.icon} aria-hidden="true" />
          </summary>
          <p className={s.answer}>{item.a}</p>
        </details>
      ))}
    </div>
  )
}
