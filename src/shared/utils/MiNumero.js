export class MiNumero {
  static losDigitos = ['ȹ', '^', 'ɛ', 'ŧ', 'ƺ', 'ɷ', 'ʔ', 'ʪ'];
  
  static escritura = {
    0: "na", 1: "ro", 2: "mes", 3: "cus", 4: "cleta", 5: "prio", 6: "burte", 7: "betu",
    10: "moel", 11: "romo", 12: "memo", 13: "cumo", 14: "moelcleta", 15: "moelprio", 16: "moelburte", 17: "moelbetu",
    20: "retene", 21: "retenero", 22: "retenemes", 23: "retenecus", 24: "retenecleta", 25: "reteneprio", 26: "reteneburte", 27: "retenebetu",
    30: "cutana", 40: "cletana", 50: "pritana", 60: "burtana", 70: "betuana", 100: "molen", 1000: "lime"
  };

  constructor(elNumero, radix = 8) {
    this.elNumero = MiNumero.deBaseaBase(elNumero, radix, 8);
  }

  static aBase10(num) {
    return parseInt(num.toString(), 8);
  }

  static aBase8(num) {
    return parseInt(num.toString(8), 10);
  }

  static deBaseaBase(num, baseInicial, baseFinal) {
    const numBase10 = parseInt(num.toString(), baseInicial);
    return parseInt(numBase10.toString(baseFinal), 10);
  }

  toString() {
    let strElNumero = Math.abs(this.elNumero).toString();
    let strNumeroRepresentado = '';
    
    if (this.elNumero < 0) {
      strNumeroRepresentado += '-';
    }

    for (let i = 0; i < strElNumero.length; i++) {
      let digito = parseInt(strElNumero[i]);
      strNumeroRepresentado += MiNumero.losDigitos[digito];
    }
    return strNumeroRepresentado;
  }

  static getSimbolo(indice) {
    return MiNumero.losDigitos[indice];
  }

  toLongString() {
      let absNum = Math.abs(this.elNumero);
      let prefix = this.elNumero < 0 ? "menos " : "";
      
      if (MiNumero.escritura[absNum]) {
          return prefix + MiNumero.escritura[absNum];
      }
  
      if (absNum > 20 && absNum < 100) {
          let decena = Math.floor(absNum / 10) * 10;
          let unidad = absNum % 10;
          return prefix + MiNumero.escritura[decena] + " " + MiNumero.escritura[unidad];
      }
  
      if (absNum > 100 && absNum < 1000) {
          let centenas = Math.floor(absNum / 100);
          let resto = absNum % 100;
          let str = "";
          if (centenas !== 1) str += new MiNumero(MiNumero.aBase10(centenas), 10).toLongString() + " ";
          str += "molen";
          if (resto !== 0) str += " " + new MiNumero(MiNumero.aBase10(resto), 10).toLongString();
          return prefix + str;
      }
  
      if (absNum > 1000) {
          let millares = Math.floor(absNum / 1000);
          let resto = absNum % 1000;
          let str = "";
          if (millares !== 1) str += new MiNumero(MiNumero.aBase10(millares), 10).toLongString() + " ";
          str += "lime";
          if (resto !== 0) str += " " + new MiNumero(MiNumero.aBase10(resto), 10).toLongString();
          return prefix + str;
      }
  
      return "?";
    }
}