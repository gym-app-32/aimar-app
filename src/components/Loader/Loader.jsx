import styles from './Loader.module.scss'
import LogoHypnotiq from '../UI/LogoHypnotiq/LogoHypnotiq'

export default function Loader({ texto = 'Cargando...' }) {
  return (
    <div className={styles.wrapper}>
      <LogoHypnotiq />
      <span className={styles.texto}>{texto}</span>
    </div>
  )
}