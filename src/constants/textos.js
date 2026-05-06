export const TEXTOS = {
    // Textos Globales y Botones
    global: {
        aceptar: "Aceptar",
        cancelar: "Cancelar",
        corregir: "Corregir",
        reiniciar: "Reiniciar",
        volver: "Volver",
        resultado: "Resultado:",
        siguiente: "Siguiente",
        completado: "¡Completado!"
    },
    
    // Títulos de Paginas / Cabeceras / Tarjetas
    titulos: {
        tablas: "Actividad Tablas",
        lapiceros: "Actividad Lapiceros",
        palabras: "Actividad Palabras",
        numeros: "Actividad Números",
        operaciones: "Actividad operaciones",
        suma: "Suma",
        resta: "Resta",
        divisiones: "Divisiones",
        multiplicaciones: "Multiplicaciones",
        tablasMultiplicar: "Tablas de multiplicar",
        celosia: "Celosía",
        recortados: "Recortados",
        productoClasico: "Producto clásico",
        error404: "Página no encontrada"
    },

    // Textos de Informacion de las Actividades (Para el ModalInfo)
    infoActividades: {
        tablas: "Adivina los números ocultos en la tabla. Selecciona el número correcto en las ruletas y toca la casilla con el '?'.",
        tablasMultiplicar: "Resuelve las multiplicaciones. Elige el número en la ruleta y toca la casilla con el '?'.",
        lapiceros: "Cuenta los lapiceros, estuches y cajas para alcanzar el objetivo. Usa los botones + y -.",
        secuenciasNum: "Introduce el siguiente número de la secuencia usando las ruletas.",
        secuenciasPal: "Escribe la palabra que corresponde al siguiente número de la secuencia.",
        suma: "Realiza la suma seleccionando los números correctos en las ruletas.",
        resta: "Realiza la resta seleccionando los números y el signo correctos.",
        divisiones: "Realiza la división seleccionando los números correctos en las ruletas.",
        productoClasicoFacil: "Usa las ruletas para seleccionar el resultado de la multiplicación.",
        productoClasicoDificil: "Toca las casillas vacías y usa el teclado numérico de abajo para rellenar los pasos intermedios y el resultado final.",
        celosia: "Multiplica cada cifra y suma las diagonales para obtener el resultado final. Recuerda que las decenas van arriba y las unidades abajo.",
        recortados: "Multiplica el número de la izquierda por la descomposición de los de arriba y pon el resultado en las casillas. Suma las filas para el total parcial.",
    },

    // Mensajes de Feedback (Para el ModalFeedback)
    feedback: {
        // Genericos (Suma, Resta, Divisiones, Producto clasico fácil)
        exitoGenerico: "¡Perfecto! Has acertado.",
        errorGenerico: "Ups, prueba otra vez.",
        
        // Especificos por actividad
        exitoCelosia: "¡Impresionante! Has resuelto la Celosía perfecta.",
        errorCelosia: "Hay casillas rojas. Revisa las multiplicaciones y las sumas.",
        
        exitoRecortados: "¡Impresionante! Has dominado los Recortados.",
        errorRecortados: "Hay casillas rojas. Fíjate bien en la tabla de multiplicar.",
        
        exitoMultiplicacionDif: "¡Magnífico! Has completado la multiplicación.",
        errorMultiplicacionDif: "Hay algunas casillas rojas. Revísalas.",
        
        exitoTablas: "¡Perfecto! Todo está correcto.",
        errorTablas: "¡Vaya! Revisa las casillas rojas.",
        incompletoTablas: "Aún quedan interrogantes por resolver.",
        
        exitoTablasMult: "¡Perfecto! Has completado la tabla.",
        errorTablasMult: "Prueba otra vez, hay resultados incorrectos.",
        incompletoTablasMult: "Aún quedan interrogantes por resolver.",

        exitoSecuenciaFin: "¡Secuencia Completada! :D",
        exitoSecuenciaNum: "¡Correcto! Introduce el siguiente número.",
        exitoSecuenciaPal: "¡Correcto! Escribe el siguiente número.",
        errorSecuencia: "Prueba otra vez :(",

        exitoLapiceros: "¡Perfecto! :D",
        errorLapiceros: "Prueba otra vez :("
    },

    // Textos específicos dentro de la UI de las actividades
    ui: {
        notFound: {
            subtitulo: "¡Vaya! Te has salido de la cuadrícula.",
            mensaje: "Parece que la página que buscas se ha perdido en otra base numérica o ha dejado de existir.",
            botonHome: "Volver al inicio"
        },opciones: {
            tituloNavBar:"Barra de navegación",
            plano:"Plano",
            relleno: "Relleno",
            tituloFuente: "Tamaño de fuente",
            pequeno: "Pequeño",
            medio: "Medio",
            grande: "Grande",
            tituloTema: "Tema de la aplicación",
            claro: "Claro",
            oscuro: "Oscuro",
            tituloAccesibilidad : "Accesibilidad Visual",
            acromatopsia:"Acromatopsia",
            protanopia:"Protanopía",
            deuteranopia:"Deuteranopía",
            tritanopia:"Tritanopía",
        },
        lapiceros: {
            lapiz: "Lápiz",
            estuche: "Estuche",
            caja: "Caja",
            objetivo: "lapiceros"
        },
        secuencias: {
            numerosDesde: "Números desde",
            palabrasDesde: "Escribe las palabras desde",
            hasta: "hasta",
            ultimoNumero: "Último número:",
            ultimaPalabra: "Última palabra:",
            placeholderPalabra: "Escribe la palabra..."
        }
    }
};