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

describe("Executed Time", () => {
    const close = 1 / 100000
    const flex = new Flexidoro()
    const inicio = flex.getExecutionTime() * close
    it("Al iniciar", () => expect(inicio).toBeCloseTo(close))
    const min10 = flex.getExecutionTime(Date.now() + 1000 * 60 * 10) * close
    it("A los 10 min", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("longbreak", Date.now() + 1000 * 60 * 10)
    it("Al pausar", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    const pausa30 = flex.getExecutionTime(Date.now() + 1000 * 60 * (10 + 30)) * close
    it("Pausa + 30 min", () => expect(pausa30).toBeCloseTo(1000 * 60 * 10  * close))
    flex.setActive(true, Date.now() + 1000 * 60 * (10 + 30))
    const inactive = 10 + 30
    const min10_30 = flex.getExecutionTime(Date.now() + 1000 * 60 * (inactive)) * close
    it("Al Reanudar", () => expect(min10_30).toBeCloseTo(1000 * 60 * 10 * close))
    const reanuda10 = flex.getExecutionTime(Date.now() + 1000 * 60 * (inactive + 10)) * close
    it("Pasados 10 min", () => expect(reanuda10).toBeCloseTo(1000 * 60 * 20 * close))
    flex.setMode("longbreak", Date.now() + 1000 * 60 * (inactive + 20))
    const reanuda20 = flex.getExecutionTime(Date.now() + 1000 * 60 * (inactive + 20)) * close
    it("Pasados 20 min y pausa", () => expect(reanuda20).toBeCloseTo(1000 * 60 * 30 * close))
})

describe("Executed Modes - Session", () => {
    const close = 1 / 100000
    const flex = new Flexidoro()
    const inicio = flex.getModeExecution("session") * close
    it("Al iniciar", () => expect(inicio).toBeCloseTo(close))
    const min10 = flex.getModeExecution("session", Date.now() + 1000 * 60 * 10) * close
    it("A los 10 min", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("break", Date.now() + 1000 * 60 * 10)
    it("Al cambiar de modo", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    const break30  = flex.getModeExecution("session", Date.now() + 1000 * 60 * (10 + 30)) * close
    it("Break + 30 min", () => expect(break30).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("session", Date.now() + 1000 * 60 * (10 + 30))
})

describe("Executed Modes - Session con pausa", () => {
    const close = 1 / 100000
    const flex = new Flexidoro()
    const inicio = flex.getModeExecution("session") * close
    it("Al iniciar", () => expect(inicio).toBeCloseTo(close))
    const min10 = flex.getModeExecution("session", Date.now() + 1000 * 60 * 10) * close
    it("A los 10 min", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("longbreak", Date.now() + 1000 * 60 * 10)
    it("Al cambiar de modo", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    const break30  = flex.getModeExecution("session", Date.now() + 1000 * 60 * (10 + 30)) * close
    it("Break + 30 min", () => expect(break30).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("session", Date.now() + 1000 * 60 * (10 + 30))
})

describe("Executed Modes - Break", () => {
    const close = 1 / 100000
    const flex = new Flexidoro({mode : "break"})
    const inicio = flex.getModeExecution("break") * close
    it("Al iniciar", () => expect(inicio).toBeCloseTo(close))
    const min10 = flex.getModeExecution("break", Date.now() + 1000 * 60 * 10) * close
    it("A los 10 min", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("session", Date.now() + 1000 * 60 * 10)
    it("Al cambiar de modo", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    const break30  = flex.getModeExecution("break", Date.now() + 1000 * 60 * (10 + 30)) * close
    it("Break + 30 min", () => expect(break30).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("break", Date.now() + 1000 * 60 * (10 + 30))
})

describe("Executed Modes - LongBreak", () => {
    const close = 1 / 100000
    const flex = new Flexidoro({intervals : {longbreak : 15}, mode : "longbreak"})
    const inicio = flex.getModeExecution("longbreak") * close
    it("Al iniciar", () => expect(inicio).toBeCloseTo(close))
    const min10 = flex.getModeExecution("longbreak", Date.now() + 1000 * 60 * 10) * close
    it("A los 10 min", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("session", Date.now() + 1000 * 60 * 10)
    it("Al cambiar de modo", () => expect(min10).toBeCloseTo(1000 * 60 * 10 * close))
    const break30  = flex.getModeExecution("longbreak", Date.now() + 1000 * 60 * (10 + 30)) * close
    it("Break + 30 min", () => expect(break30).toBeCloseTo(1000 * 60 * 10 * close))
    flex.setMode("longbreak", Date.now() + 1000 * 60 * (10 + 30))
})
