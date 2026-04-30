import { usePickerKeyboard } from '../hooks/usePickerKeyboard';

export function MyNumberPicker({ valorMostrado, onSubir, onBajar, disableSubir, disableBajar }) {
    
    // Aplicamos el hook respetando si los botones estan deshabilitados
    const onKeyDown = usePickerKeyboard(
        disableSubir ? null : onSubir,
        disableBajar ? null : onBajar
    );

    return (
        <div className="my-number-picker" tabIndex={0} onKeyDown={onKeyDown}>
            <div className="picker-valor-box">
                {valorMostrado === ' ' ? '\u00A0' : valorMostrado}
            </div>
            <div className="picker-botones-stack">
                <button onClick={onBajar} disabled={disableBajar}>−</button>
                <button onClick={onSubir} disabled={disableSubir}>+</button>
            </div>
        </div>
    );
}