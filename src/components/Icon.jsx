export function Icon({ name, className = "" }) {
  return (
    <svg className={`svg-icon ${className}`} aria-hidden="true">
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}