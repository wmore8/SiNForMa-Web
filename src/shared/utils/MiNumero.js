export class MiNumero {
  static diccionarios = {
    8: { 
      digitos: ['ȹ', '^', 'ɛ', 'ŧ', 'ƺ', 'ɷ', 'ʔ', 'ʪ'], 
      escritura: {
        0: "na", 1: "ro", 2: "mes", 3: "cus", 4: "cleta", 5: "prio", 6: "burte", 7: "betu",
        10: "moel", 11: "romo", 12: "memo", 13: "cumo", 14: "moelcleta", 15: "moelprio", 16: "moelburte", 17: "moelbetu",
        20: "retene", 21: "retenero", 22: "retenemes", 23: "retenecus", 24: "retenecleta", 25: "reteneprio", 26: "reteneburte", 27: "retenebetu",
        30: "cutana", 40: "cletana", 50: "pritana", 60: "burtana", 70: "betuana", 100: "molen", 1000: "lime"
      } 
    },
    10: { 
      digitos: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 
      escritura: {
        0: "cero", 1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco", 6: "seis", 7: "siete", 8: "ocho", 9: "nueve",
        10: "diez", 11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince", 16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve",
        20: "veinte", 21: "veintiuno", 22: "veintidós", 23: "veintitrés", 24: "veinticuatro", 25: "veinticinco", 26: "veintiséis", 27: "veintisiete", 28: "veintiocho", 29: "veintinueve",
        30: "treinta", 40: "cuarenta", 50: "cincuenta", 60: "sesenta", 70: "setenta", 80: "ochenta", 90: "noventa",
        100: "cien", 1000: "mil"
      }
    }
  };

  static get baseActual() {
    // Si estamos en modo debug, permitimos sobreescribir la base desde localStorage
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.SINFORMA_MODO_DEBUG === 'true') {
        const localBase = localStorage.getItem('debugBase');
        if (localBase) return parseInt(localBase, 10);
    }
    
    if (typeof globalThis !== 'undefined' && globalThis.__DEBUG_BASE__) {
      return globalThis.__DEBUG_BASE__;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.SINFORMA_APP_SISTEMA_NUMERACION) {
      return parseInt(import.meta.env.SINFORMA_APP_SISTEMA_NUMERACION, 10);
    }
    return 8; // Default fallback
  }

  static get losDigitos() {
    return MiNumero.diccionarios[MiNumero.baseActual].digitos;
  }

  constructor(elNumero, radix = MiNumero.baseActual) {
    // Internamente, SIEMPRE guardamos el valor matemático en Decimal (Base 10) real.
    // Ej: new MiNumero(12, 8) -> 12 octal es 10 en decimal, guardamos 10.
    this.elNumero = parseInt(elNumero.toString(), radix);
  }

  // Operaciones algebraicas nativas
  sumar(otroMiNumero) {
    return new MiNumero(this.elNumero + otroMiNumero.elNumero, 10);
  }

  restar(otroMiNumero) {
    return new MiNumero(this.elNumero - otroMiNumero.elNumero, 10);
  }

  multiplicar(otroMiNumero) {
    return new MiNumero(this.elNumero * otroMiNumero.elNumero, 10);
  }

  dividir(otroMiNumero) {
    return new MiNumero(Math.floor(this.elNumero / otroMiNumero.elNumero), 10);
  }

  static aBase10(num) {
    return parseInt(num.toString(), MiNumero.baseActual);
  }

  static aBase8(num) {
    return parseInt(num.toString(8), 10);
  }

  static deBaseaBase(num, baseInicial, baseFinal) {
    const numBase10 = parseInt(num.toString(), baseInicial);
    return parseInt(numBase10.toString(baseFinal), 10);
  }

  toString() {
    let base = MiNumero.baseActual;
    let strBaseX = Math.abs(this.elNumero).toString(base);
    let strNumeroRepresentado = '';
    // en el caso de que sea negativo le añadimos '−'
    if (this.elNumero < 0) {
      strNumeroRepresentado += '−';
    }

    if (base === 10) {
      return strNumeroRepresentado + strBaseX;
    }

    for (let i = 0; i < strBaseX.length; i++) {
      let digito = parseInt(strBaseX[i], 10);
      strNumeroRepresentado += MiNumero.diccionarios[base].digitos[digito];
    }
    return strNumeroRepresentado;
  }

  static getSimbolo(indice) {
    return MiNumero.diccionarios[MiNumero.baseActual].digitos[indice];
  }

  toLongString() {
    let base = MiNumero.baseActual;
    let absNum = Math.abs(this.elNumero);
    let prefix = this.elNumero < 0 ? "menos " : "";
    
    if (base === 10) {
      return prefix + this._toLongStringBase10(absNum);
    } else {
      return prefix + this._toLongStringBase8(absNum);
    }
  }

  _toLongStringBase10(num) {
    const esc = MiNumero.diccionarios[10].escritura;
    
    if (num <= 29) return esc[num];
    if (num < 100) {
      let decena = Math.floor(num / 10) * 10;
      let unidad = num % 10;
      if (unidad === 0) return esc[decena];
      return esc[decena] + " y " + esc[unidad];
    }
    if (num < 1000) {
      if (num === 100) return esc[100];
      let centena = Math.floor(num / 100);
      let resto = num % 100;
      let strCentena = centena === 1 ? "ciento" : (centena === 5 ? "quinientos" : (centena === 7 ? "setecientos" : (centena === 9 ? "novecientos" : esc[centena] + "cientos")));
      if (resto === 0) return strCentena;
      return strCentena + " " + this._toLongStringBase10(resto);
    }
    if (num === 1000) return esc[1000];
    
    if (num > 1000 && num < 2000) {
       return "mil " + this._toLongStringBase10(num % 1000);
    }

    return "?";
  }

  _toLongStringBase8(numDecimal) {
    let octalKey = parseInt(numDecimal.toString(8), 10); 
    const esc = MiNumero.diccionarios[8].escritura;

    if (esc[octalKey]) {
        return esc[octalKey];
    }

    if (octalKey > 20 && octalKey < 100) {
        let decena = Math.floor(octalKey / 10) * 10;
        let unidad = octalKey % 10;
        return esc[decena] + " " + esc[unidad];
    }

    if (octalKey > 100 && octalKey < 1000) {
        let centenas = Math.floor(octalKey / 100);
        let resto = octalKey % 100;
        let str = "";
        if (centenas !== 1) str += new MiNumero(centenas, 8).toLongString() + " ";
        str += "molen";
        if (resto !== 0) str += " " + new MiNumero(resto, 8).toLongString();
        return str;
    }

    if (octalKey > 1000) {
        let millares = Math.floor(octalKey / 1000);
        let resto = octalKey % 1000;
        let str = "";
        if (millares !== 1) str += new MiNumero(millares, 8).toLongString() + " ";
        str += "lime";
        if (resto !== 0) str += " " + new MiNumero(resto, 8).toLongString();
        return str;
    }

    return "?";
  }
}