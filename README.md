# SiNForMa-Web
### Sistema Interactivo de un Nuevo Sistema Numérico

**SiNForMa-Web** es una plataforma educativa interactiva diseñada para la enseñanza y práctica del sistema de numeración en **Base 8 (Romes)** y su relación con el sistema decimal. El proyecto busca facilitar la transición cognitiva hacia bases no decimales mediante actividades visuales, algorítmicas y lúdicas orientadas a futuros docentes y estudiantes.

---

## ✏️ Estado del Proyecto
- **Fase Actual** `v1.0.0`: [https://sinforma-debug.netlify.app](https://sinforma-debug.netlify.app) (Lista para pruebas de usuario).
- **Prototipo Inicial**: [https://sinforma-proto.netlify.app](https://sinforma-proto.netlify.app)

## 🎯 Objetivos Logrados
- [x] **Arquitectura Modular**: Implementación de un `ActividadLayout` centralizado que gestiona Header, Controles, Modales de Información y Feedback.
- [x] **PWA & Funcionamiento Offline**: Integración de Progressive Web App mediante `vite-plugin-pwa` con precaché completo de activos (incluyendo fuentes `Quicksand` y SVG sprites) para funcionamiento sin conexión a internet.
- [x] **Centro de Control de Instalación (Estado de la App)**: Modal de Opciones con gestión de estado PWA, permitiendo instalar la app o actualizar la versión silenciosamente desde cualquier dispositivo compatible.
- [x] **Auditorías de Calidad (Google Lighthouse & WAVE)**: Calificaciones máximas de **100/100 en Accesibilidad, Buenas Prácticas y SEO**, junto con 0 errores de accesibilidad semántica en auditorías WCAG.
- [x] **División Euclídea Bidimensional**: Rediseño completo de la actividad de división con celdas independientes para cociente y resto, navegación espacial por teclado y tolerancia a cero.
- [x] **Modo de Entrada Dual e Híbrido**: Alternancia fluida entre ruletas táctiles (`SwipePicker`) y teclado numérico en pantalla (`TecladoBase`) en las operaciones aritméticas.
- [x] **Diccionario de Constantes**: Centralización de todos los textos de la app en `textos.js` para facilitar el mantenimiento e internacionalización.
- [x] **Accesibilidad Universal (A11y)**: Control total por teclado (flechas bidimensionales y `:focus-visible` de alto contraste), traps de foco en modales e indicadores semánticos ARIA.
- [x] **Paletas Cromáticas Adaptadas**: Modos de visión para discromatopsias (Protanopía, Deuteranopía, Tritanopía y Monocromático/Acromatopsia) diseñados bajo estándares Okabe e Ito.
- [x] **Sistemas Numéricos Dinámicos**: Conversor y ejecutor dinámico entre Romes (Base 8) y Decimal (Base 10).

---

## 🧩 Actividades Disponibles
La plataforma organiza las actividades en bloques progresivos:

1.  **Fundamentos y Construcción del Número**:
    * **Lapiceros**: Conteo y representación del valor posicional mediante unidades, estuches y cajas.
    * **Secuencias (Números y Palabras)**: Práctica de progresión numérica tanto en notación simbólica como en escritura lingüística.
    * **Agrupación (Palillos)**: Manipulación y transformación manual de cantidades mediante mecánica *Select & Move*.
2.  **Tableros Lógicos**:
    * **Tablas de Adivinar**: Deducción de posiciones numéricas en cuadrículas interactivas.
    * **Tablas de Multiplicar**: Refuerzo de productos básicos en Base 8.
3.  **Operaciones Aritméticas**:
    * **Suma y Resta**: Operaciones verticales con validación celda a celda y gestión explícita de signos.
    * **División**: Cálculo simultáneo de cociente y resto mediante teclado interactivo.
    * **Multiplicación Avanzada**: Metodologías de Producto Clásico, Celosía (diagonal) y Recortados (descomposición factorial).

---

## 🛠️ Tecnologías
- **Core**: React 19 + Vite 7.
- **PWA Engine**: `vite-plugin-pwa` + Workbox.
- **Routing**: React Router DOM 7.
- **Estilos**: Vanilla CSS nativo sin librerías externas, con variables dinámicas de diseño.
- **Iconografía**: Sistema modularizado de Sprites SVG.
