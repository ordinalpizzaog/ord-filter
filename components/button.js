import styles from '../styles/button.module.sass'
import Link from 'next/link'
import Icon from './icon'

export default function Button({ text, icon, onClick, href, openTab, style }) {
  var _onClick = onClick
  var _href = href
  if (openTab) {
    _onClick = () => {
      if (onClick) {
        onClick()
      }
      window.open(href, text)
    }
    _href = null
  }
  let inner = (
    <div style={style} className={styles.button} onClick={_onClick}>
      {icon && <Icon icon={icon} style={{ width: "1.7rem", background: "white" }}/>}<p>{text}</p>
    </div>
  )
  return _href ? <Link href={_href}>{inner}</Link> : inner
}