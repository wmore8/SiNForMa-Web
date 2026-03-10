import { Icon } from './Icon';
import { MiNumero } from '../utils/MiNumero';
import '../../styles/SpinnerCustom.css';

export function SpinnerCustom({ value, onChange }) {
  const inc = () => onChange(value < 7 ? value + 1 : 0);
  const dec = () => onChange(value > 0 ? value - 1 : 7);

  return (
    <div className="spinner-guiri">
      <div className="spinner-display">
        {MiNumero.getSimbolo(value)}
      </div>
      <div className="spinner-controls">
        <button onClick={inc} style={{color: 'var(--text-color)'}}><Icon name="icon-spinner-up" /></button>
        <button onClick={dec} style={{color: 'var(--text-color)'}}><Icon name="icon-spinner-down" /></button>
      </div>
    </div>
  );
}