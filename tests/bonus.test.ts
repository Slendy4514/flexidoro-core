import { Flexidoro } from "../src/flexidoro";
import {describe, expect, it} from "vitest"

//Session
describe.each([
    {interval : 15, reward : 5}, //default
    {interval : 3, reward : 1},
    {interval : 30, reward : 10},
    {interval : 10, reward : 20},
    {interval : 1, reward : 1},
])(`Session - Incremento normal $interval-$reward`, ({interval, reward}) => {
    const flex = new Flexidoro({reward, intervals : {session : interval}})
    it("Al iniciar", () => expect(flex.getBonus()).toBe(0))
    it("Pasado 1 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval)).toBe(reward))
    it("Pasados 2 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval * 2)).toBe(reward * 2))
    it("Pasados 5 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval * 5)).toBe(reward * 5))
    it("Pasados 10 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval * 10)).toBe(reward * 10))
    it("Pasado 1/2 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval/2)).toBe(0))
    it("Pasados 1 y 1/2 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval + interval/2)).toBe(reward))
    it("Pasados 2 y 1/3 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval * 2 + interval/3)).toBe(reward * 2))
    it("Pasados 5 y 1/4 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval * 5 + interval/4)).toBe(reward * 5))
    it("Pasados 10 y 1/2 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval * 10 + interval/2)).toBe(reward * 10))
})


describe.each([
    {interval : 15, reward : 5}, //default
    {interval : 3, reward : 1},
    {interval : 30, reward : 10}, //errores
    {interval : 10, reward : 20}, //errores
    {interval : 1, reward : 1},
])(`Sesión - Cruzando el breakpoint con penalización $interval-$reward`, ({interval, reward}) => {
    const flex = new Flexidoro({mode: "break", intervals : {session : interval}, reward})
    flex.setMode("session", Date.now() + 1000 * 60 * 5)
    const breakpoint = 35
    it(`Breakpoint`, () => expect(flex.getBonus(Date.now() + 1000 * 60 * breakpoint)).toBe(0))
    it(`Breakpoint + 1 intervalo`, () => expect(flex.getBonus(Date.now() + 1000 * 60 * (breakpoint + interval))).toBe(reward))
    it(`Breakpoint + 2 intervalos`, () => expect(flex.getBonus(Date.now() + 1000 * 60 * (breakpoint + interval * 2))).toBe(reward * 2))
    it(`Breakpoint + 5 intervalos`, () => expect(flex.getBonus(Date.now() + 1000 * 60 * (breakpoint + interval * 5))).toBe(reward * 5))
    it(`Breakpoint + 1/2 intervalo`, () => expect(flex.getBonus(Date.now() + 1000 * 60 * (breakpoint + interval/2))).toBe(0))
    it(`Breakpoint + 1 y 1/2 intervalos`, () => expect(flex.getBonus(Date.now() + 1000 * 60 * (breakpoint + interval + interval/2))).toBe(reward))
    it(`Breakpoint + 2 y 1/3 intervalos`, () => expect(flex.getBonus(Date.now() + 1000 * 60 * (breakpoint + interval * 2 + interval/3))).toBe(reward * 2))
    it(`Breakpoint + 5 y 1/4 intervalos`, () => expect(flex.getBonus(Date.now() + 1000 * 60 * (breakpoint + interval * 5 + interval/4))).toBe(reward * 5))
})

//Break
describe.each([
    {penalty : 15, interval : 5}, //default
    {penalty : 3, interval : 1},
    {penalty : 30, interval : 10},
    {penalty : 10, interval : 20},
    {penalty : 1, interval : 1},
])(`Break - cruzando el breakpoint sin bonus $interval-$penalty`, ({interval, penalty}) => {
    const flex = new Flexidoro({penalty: {break : penalty}, intervals : {break : interval}})
    flex.setMode("break")
    it("Penalización instantanea", () => expect(flex.getBonus()).toBe(-penalty))
    it("Pasado 1/2 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval/2)).toBe(-penalty))
    it("Pasado 1 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval)).toBe(-penalty * 2))
    it("Pasado 1 y 1/2 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval + interval/2)).toBe(-penalty * 2))
    it("Pasados 2 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * interval * 2)).toBe(-penalty * 3))
})

describe.each([
    {penalty : 15, interval : 5}, //default
    // {penalty : 3, interval : 1},
    // {penalty : 30, interval : 10},
    // {penalty : 10, interval : 20},
    // {penalty : 1, interval : 1},
])(`Break - cruzando el breakpoint con bonus $interval-$penalty`, ({interval, penalty}) => {
    const flex = new Flexidoro({intervals : {break : interval}, penalty : {break : penalty}})
    flex.setMode("break", Date.now() + 1000 * 60 * 35) //10 min de bonus
    it("Break despues de cambio", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 35)).toBe(9))
    it("Break despues de cambio y 5 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (35 + 5))).toBe(4))
    it("Break despues de cambio y 9 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (35 + 9))).toBe(0))
    it("Break despues de cambio y 10 min", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (35 + 10))).toBe(-penalty))
    it("Break despues de cambio y medio intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (35 + 10 + interval/2))).toBe(-penalty))
    it("Break despues de cambio + 1 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (35 + 10 + interval))).toBe(-penalty*2))
    it("Break despues de cambio + 2 intervalos", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (35 + 10 + interval * 2))).toBe(-penalty*3))
})

//LongBreak
describe("LongBreak - modo pausa", () => {
    const flex = new Flexidoro()
    flex.setMode("longbreak", Date.now() + 1000 * 60 * 35)
    it("Activar el Longbreak - Costo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 35)).toBe(-5))
    it("Comprobar desactivado", () => expect(flex.getActive()).toBe(false))
})

describe.each([
    {penalty : 10, interval : 20, lgcost : 10},
    {penalty : 30, interval : 30, lgcost : 0},
    {penalty : 10, interval : 20, lgcost : 20},
    {penalty : 20, interval : 40, lgcost : 1},
    {penalty : 5, interval : 10, lgcost : 0},
])(`LongBreak - con costo $interval-$penalty-$lgcost`, ({interval, penalty, lgcost}) => {
    const flex = new Flexidoro({intervals : {longbreak : interval}, penalty : {longbreak : penalty}, longbreakCost : lgcost})
    flex.setMode("longbreak", Date.now() + 1000 * 60 * 90) //30 min de bonus
    it("Activar el Longbreak - Costo inicial", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 90)).toBe(30-lgcost))
    it("Activar el Longbreak - 1/2 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (90 + interval/2))).toBe(30-lgcost))
    it("Activar el Longbreak - 1 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (90 + interval))).toBe(30-lgcost-penalty))
    it("Activar el Longbreak - 2 intervalo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * (90 + interval*2))).toBe(30-lgcost-penalty*2))
})

//Bonus despues de desactivado
describe("LongBreak - modo pausa", () => {
    const flex = new Flexidoro()
    flex.setActive(false, Date.now() + 1000 * 60 * 30) //Bonus = 10
    flex.setActive(true, Date.now() + 1000 * 60 * 60)
    it("La bonus se mantiene en el tiempo", () => expect(flex.getBonus(Date.now() + 1000 * 60 * 60)).toBe(10))
})
