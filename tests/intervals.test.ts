import { Flexidoro } from "../src/flexidoro";
import {describe, expect, it} from "vitest"


describe("Session", () => {
    const flex = new Flexidoro()
    it("Al iniciar", () => expect(flex.getIntervals()).toBe(0))
    it("Luego de 1 intervalo", () => expect(flex.getIntervals(Date.now() + 1000 * 60 * 15)).toBe(1))
    it("Luego de 2 intervalos", () => expect(flex.getIntervals(Date.now() + 1000 * 60 * 15 * 2)).toBe(2))
    it("Luego de 5 intervalos", () => expect(flex.getIntervals(Date.now() + 1000 * 60 * 15 * 5)).toBe(5))
})

describe("break", () => {
    const flex = new Flexidoro()
    it("Al iniciar", () => expect(flex.getIntervals()).toBe(0))
    it("Luego de 1 intervalo", () => expect(flex.getIntervals(Date.now() + 1000 * 60 * 15)).toBe(1))
    it("Luego de 2 intervalos", () => expect(flex.getIntervals(Date.now() + 1000 * 60 * 15 * 2)).toBe(2))
    it("Luego de 5 intervalos", () => expect(flex.getIntervals(Date.now() + 1000 * 60 * 15 * 5)).toBe(5))
})