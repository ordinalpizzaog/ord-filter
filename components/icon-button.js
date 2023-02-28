import styles from '../styles/button.module.sass'
import Icon from './icon'

export default function IconButton({ icon, onClick, href, openTab, ariaLabel, style }) {
  var buttonOnClick = onClick

  if(href) {
    buttonOnClick = () => {
      if (onClick) 
        onClick()
      if (openTab) {
        window.open(href, icon)
      } else {
        location.href = href
      }
    }
  }

  return (
    <button className={styles.iconButton}
            onClick={buttonOnClick}
            aria-label={ariaLabel}
            style={style ? style : {width: "3.4rem"}}>
      <Icon icon={icon} style={{ margin: "5%", background: "black" }}/>
    </button>
  )
}