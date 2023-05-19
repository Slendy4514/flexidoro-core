import { Flexidoro } from "../src/flexidoro";
import {describe, expect, it, beforeEach} from "vitest"

describe("getTime - Intervalo default - 15 min)", () => {
    const flex = new Flexidoro()
    it("Al iniciar", () => expect(flex.getTime()).toBe("14:59"))
    it("Pasado un minuto", () => expect(flex.getTime(Date.now() + 1000 * 60)).toBe("13:59"))
    it("Pasados 10 minutos", () => expect(flex.getTime(Date.now() + 1000 * 60 * 10)).toBe("04:59"))
    it("Pasados 10 segundos", () => expect(flex.getTime(Date.now() + 1000 * 10)).toBe("14:49"))
    it("Pasados minuto y medio", () => expect(flex.getTime(Date.now() + 1000 * 90)).toBe("13:29"))
    it("Pasado 1 intervalo", () => expect(flex.getTime(Date.now() + 1000 * 60 * 15)).toBe("14:59"))
    it("Pasado 1 intervalo y 10 min", () => expect(flex.getTime(Date.now() + 1000 * 60 * 25)).toBe("04:59"))
    it("Pasado 2 intervalos", () => expect(flex.getTime(Date.now() + 1000 * 60 * 15 * 2)).toBe("14:59"))
})


describe("getTime - al detenerse el reloj", () => {
    const flex = new Flexidoro()
    flex.setMode("longbreak")
    it("Al pausar", () => expect(flex.getTime()).toBe("00:00"))
})
