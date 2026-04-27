export function MyNumberPicker({ valorMostrado, onSubir, onBajar, disableSubir, disableBajar }) {
    return (
        <div className="my-number-picker">
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