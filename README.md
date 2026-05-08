# SiNForMa-Web
### Sistema Interactivo de un Nuevo Sistema Numérico

**SiNForMa-Web** es una plataforma educativa interactiva diseñada para la enseñanza y práctica del sistema de numeración en **Base 8 (Romescus)**. El proyecto busca facilitar la transición cognitiva hacia bases no decimales mediante actividades visuales, algorítmicas y lúdicas.

---

## ✏️ Estado del Proyecto
- **Fase Actual** `v0.8.6-beta`: [https://lustrous-creponne-95eb1a.netlify.app](https://lustrous-creponne-95eb1a.netlify.app)  (Lista para pruebas de usuario y revisión pedagógica).
- **Prototipo Inicial**: [https://cool-marshmallow-512ba5.netlify.app](https://cool-marshmallow-512ba5.netlify.app/)

## 🎯 Objetivos Logrados
- [x] **Arquitectura Modular**: Implementación de un `ActividadLayout` centralizado que gestiona Header, Controles, Modales de Información y Feedback.
- [x] **Diccionario de Constantes**: Centralización de todos los textos de la app en `textos.js` para facilitar el mantenimiento.
- [x] **Multi-dispositivo**: Interfaz adaptada para ratón y pantallas táctiles mediante componentes como `SwipePicker` y `TecladoBase`.
- [x] **Modo Claro/Oscuro**: Soporte nativo para temas visuales con persistencia en `localStorage`.
- [x] **Navegación Robusta**: Sistema de rutas jerárquico y página de error 404 personalizada.
- [x] **Tamaño de letra personalizado** : Tres tamaños de texto seleccionables que mejoran la experiencia de usuario
- [x] **Accesibilidad** : control total por teclado (Focus/Tab navigation).
- [x] **Colores accesibles** : Implementación de una paleta que aborde los distintos problemas de visión que pueda tener el usuario.
- [x] **Sistemas Decimal**: Conversor dinámico entre Romescus y Decimal.
- [x] Implementación del **diseño de los iconos**
- [x] QA: Pruebas funcionales.


## 🧩 Actividades Disponibles
La plataforma organiza las actividades en bloques progresivos:

1.  **Fundamentos**:
    * **Lapiceros**: Conteo y agrupación visual de unidades, estuches y cajas.
    * **Secuencias**: Práctica de progresión numérica tanto en formato numérico como en palabras.
2.  **Tableros Lógicos**:
    * **Tablas de Adivinar**: Deducción de posiciones en cuadrículas de 8x8.
    * **Tablas de Multiplicar**: Refuerzo de productos básicos en Base 8.
3.  **Operaciones Aritméticas**:
    * **Suma, Resta y División**: Operaciones con validación en tiempo real y gestión de signos.
    * **Multiplicación Avanzada**: Metodologías de Producto Clásico, Celosía y Recortados.

## 📋 Próximos Pasos (ToDo)
- [ ] Nueva feature: Actividad de conteo mediante gestos táctiles (swipe sobre objetos).

## 🛠️ Tecnologías
- **Core**: React + Vite.
- **Routing**: React Router DOM.
- **Estilos**: CSS nativo con variables dinámicas para tematización.
- **Iconografía**: Sistema de iconos SVG modularizado.

