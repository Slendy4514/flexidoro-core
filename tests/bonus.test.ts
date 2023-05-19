import { Flexidoro } from "../src/flexidoro";
import {describe, expect, it} from "vitest"

//Session
describe("Sessión", () => {
    const flex = new Flexidoro()
    it("Al iniciar", () => expect(flex.getBonus()).toBe(0))
    it("Pasado 1 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 15)).toBe(5))
    it("Pasados 2 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 15 * 2)).toBe(10))
    it("Pasados 5 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 15 * 5)).toBe(25))
})

describe("Sesión - cruzando el breakpoint con penalización", () => {
    const flex = new Flexidoro()
    flex.setMode("break")
    flex.setMode("session", Date.now() + 1000 * 60 * 5)
    it("Session despues de cambio", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 5)).toBe(-30))
    it("Session despues de cambio + 10 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (5 + 10))).toBe(-20))
    it("Session despues de cambio + 15 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (5 + 15))).toBe(-15))
    it("Session despues de cambio + 30 min (breakpoint)", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (5 + 30))).toBe(0))
    it("Session despues de cruzar el breakpoint + 1", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (5 + 30 + 1))).toBe(0))
    it("Session despues de cruzar el breakpoint + 5", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (5 + 30 + 5))).toBe(0))
    it("Session despues de cruzar el breakpoint + 15", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (5 + 30 + 15))).toBe(5))
    it("Session despues de cruzar el breakpoint + 30", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (5 + 30 + 30))).toBe(10))
})

//Break
describe("Break - cruzando el breakpoint sin bonus", () => {
    const flex = new Flexidoro()
    flex.setMode("break")
    it("Cambiar de modo sin tener bonus", () => expect(flex.getBonus()).toBe(-15))
    it("Cambiar de modo sin tener bonus", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 5)).toBe(-30))
    it("Cambiar de modo sin tener bonus", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 10)).toBe(-45))
})

describe("Break - cruzando el breakpoint con bonus", () => {
    const flex = new Flexidoro()
    flex.setMode("break", Date.now() + 1000 * 60 * 35)
    it("Break despues de cambio", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 35)).toBe(9))
    it("Break despues de cambio y 5 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 40)).toBe(4))
    it("Break despues de cambio y 9 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 44)).toBe(0))
    it("Break despues de cambio y 10 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 45)).toBe(-15))
    it("Break despues de cambio y 10 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 47)).toBe(-15))
    it("Break despues de cambio y 10 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 50)).toBe(-30))
})

//LongBreak
describe("LongBreak - modo pausa", () => {
    const flex = new Flexidoro()
    flex.setMode("longbreak", Date.now() + 1000 * 60 * 35)
    it("Activar el Longbreak", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 35)).toBe(-5))
    it("Comprobar desactivado", () => expect(flex.getActive()).toBe(false))
})

//Bonus despues de desactivado
describe("LongBreak - modo pausa", () => {
    const flex = new Flexidoro()
    flex.setActive(false, Date.now() + 1000 * 60 * 30)
    flex.setActive(true, Date.now() + 1000 * 60 * 60)
    it("La bonus se mantiene en el tiempo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 60)).toBe(10))
})
