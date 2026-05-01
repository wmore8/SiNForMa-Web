import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MiNumero } from '../shared/utils/MiNumero';

describe('MiNumero - Refactor Polimórfico', () => {

    // Limpiamos mocks y variables de entorno antes de cada test
    beforeEach(() => {
        vi.stubGlobal('__DEBUG_BASE__', undefined);
    });

    describe('Entorno y Configuración', () => {
        it('debe leer la base 8 por defecto si no hay variable', () => {
            expect(MiNumero.baseActual).toBe(8);
        });

        it('debe priorizar window.__DEBUG_BASE__ si está definido', () => {
            vi.stubGlobal('__DEBUG_BASE__', 10);
            expect(MiNumero.baseActual).toBe(10);
        });
    });

    describe('Modo Base 8 (Romesco)', () => {
        beforeEach(() => {
            vi.stubGlobal('__DEBUG_BASE__', 8);
        });

        it('debe inicializarse guardando el valor real en decimal (this.elNumero)', () => {
            // El numero 12 en octal es 10 en decimal
            const num = new MiNumero(12, 8);
            expect(num.elNumero).toBe(10); 
            
            // Si pasamos un decimal directamente
            const numDec = new MiNumero(10, 10);
            expect(numDec.elNumero).toBe(10);
        });

        it('debe generar el string en símbolos Romesco correctamente (toString)', () => {
            // 10 en decimal es 12 en octal, que corresponde a los símbolos '^ɛ' (memo)
            const num = new MiNumero(10, 10);
            expect(num.toString()).toBe('^ɛ');

            const cero = new MiNumero(0, 10);
            expect(cero.toString()).toBe('ȹ');
        });

        it('debe traducir a texto largo correctamente en Romesco (toLongString)', () => {
            const num = new MiNumero(10, 10); // 12 octal -> "memo"
            expect(num.toLongString()).toBe('memo');
            
            const num2 = new MiNumero(16, 10); // 20 octal -> "retene"
            expect(num2.toLongString()).toBe('retene');
        });

        it('debe poder sumar, restar y multiplicar limpiamente', () => {
            const a = new MiNumero(10, 8); // 8 decimal
            const b = new MiNumero(2, 8);  // 2 decimal
            
            expect(a.sumar(b).elNumero).toBe(10); // 8 + 2 = 10 decimal
            expect(a.sumar(b).toString()).toBe('^ɛ'); // 10 decimal -> 12 octal -> ^ɛ (memo)

            expect(a.restar(b).elNumero).toBe(6);
            expect(a.restar(b).toString()).toBe('ʔ'); //(burte)

            expect(a.multiplicar(b).elNumero).toBe(16);
            expect(a.multiplicar(b).toString()).toBe('ɛȹ'); // 16 dec -> 20 octal -> ɛȹ (retene)
        });
    });

    describe('Modo Base 10 (Español)', () => {
        beforeEach(() => {
            vi.stubGlobal('__DEBUG_BASE__', 10);
        });

        it('debe inicializarse guardando el valor real en decimal', () => {
            const num = new MiNumero(123, 10);
            expect(num.elNumero).toBe(123);
        });

        it('debe generar el string estándar numérico (toString)', () => {
            const num = new MiNumero(123, 10);
            expect(num.toString()).toBe('123');
        });

        it('debe traducir a texto largo correctamente en Español (toLongString)', () => {
            expect(new MiNumero(0, 10).toLongString()).toBe('cero');
            expect(new MiNumero(15, 10).toLongString()).toBe('quince');
            expect(new MiNumero(24, 10).toLongString()).toBe('veinticuatro');
            expect(new MiNumero(31, 10).toLongString()).toBe('treinta y uno');
            expect(new MiNumero(145, 10).toLongString()).toBe('ciento cuarenta y cinco');
            expect(new MiNumero(1000, 10).toLongString()).toBe('mil');
        });

        it('debe poder hacer operaciones algebraicas correctamente', () => {
            const a = new MiNumero(15, 10);
            const b = new MiNumero(5, 10);
            
            expect(a.sumar(b).toString()).toBe('20');
            expect(a.restar(b).toString()).toBe('10');
            expect(a.multiplicar(b).toString()).toBe('75');
        });
    });
});
