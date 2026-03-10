export class MiNumero {
  static losDigitos = ['ȹ', '^', 'ɛ', 'ŧ', 'ƺ', 'ɷ', 'ʔ', 'ʪ'];
  
  // Diccionarios base (simplificados para no ocupar todo el chat, 
  // pero puedes pegar aquí todos tus "na", "ro", "mes" de tu initEscritura())
  static escritura = {
    0: "na", 1: "ro", 2: "mes", 3: "cus", 4: "cleta", 5: "prio", 6: "burte", 7: "betu"
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
}