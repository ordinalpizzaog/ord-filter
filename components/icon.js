import styles from '../styles/button.module.sass'

export default function Icon({ icon, style, onClick, className }) {
  let defaultStyle = {
    mask: `url(/images/${icon}.svg) center/100% no-repeat`,
    WebkitMask: `url(/images/${icon}.svg) center/100% no-repeat`,
    aspectRatio: "1",
    WebkitTapHighlightColor: "transparent",
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    KhtmlUserSelect: "none",
    MozUserSelect: "none",
    MsUserSelect: "none",
    userSelect: "none"
  }
  return <div style={style ? {...defaultStyle, ...style} : defaultStyle} className={className} onClick={onClick}/>
}