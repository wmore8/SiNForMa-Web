import '../../styles/MyNumberPicker.css';

export function MyNumberPicker({ opciones, value, onChange }) {
    const subirValor = () => {
        if (value < opciones.length - 1) onChange(value + 1);
    };

    const bajarValor = () => {
        if (value > 0) onChange(value - 1);
    };

    return (
        <div className="my-number-picker">
            <div className="picker-valor-box">{opciones[value] === ' ' ? '\u00A0' : opciones[value]}</div>
            <div className="picker-botones-stack">
                <button onClick={bajarValor} disabled={value === 0}>−</button>
                <button onClick={subirValor} disabled={value === opciones.length - 1}>+</button>
            </div>
        </div>
    );
}