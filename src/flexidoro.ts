type Mode = "session" | "break" | "longbreak"

export interface flexidoroData{
    active? : boolean,
    execution? : ModeValuesData
    mode? : Mode,
    start? : number,
    lastInterval? : number,
    intervals? : ModeValuesData,
    penalty? : ModeValuesData,
    reward? : number,
    longbreakCost? : number
    bonus? : number
}

export interface ModeValuesData{
    session? : number,
    break? : number,
    longbreak? : number,
}

export interface PartialModeValues{
    break : number,
    longbreak : number,
}

export interface ModeValues extends PartialModeValues{
    session : number
}

export class Flexidoro{
    private mode : Mode
    private active : boolean
    private start : number
    private lastInterval : number
    private interval : number
    private intervals : PartialModeValues
    private penalty : PartialModeValues
    private bonus : number
    private reward : number
    private longbreakCost : number
    private execution : number
    private executionMode : ModeValues
    constructor( {
            mode = "session", 
            start = Date.now(),
            lastInterval = Date.now(),
            bonus = 0,
            intervals : { session : intervalSession = 15, break : intervalBreak = 5, longbreak : intervalLongbreak = 0 } = {},
            penalty : {break : penaltyBreak = 15, longbreak : penaltyLongbreak = 0} = {},
            reward = 5,
            active = true,
            longbreakCost = 15,
            execution : { session : execSession = 0, break : execBreak = 0, longbreak : execLongbreak = 0 } = {}} : flexidoroData = {}){
        this.active = active
        this.mode = mode
        this.start = start
        this.lastInterval = lastInterval
        this.interval = intervalSession
        this.intervals = {break : intervalBreak, longbreak : intervalLongbreak}
        this.penalty = {break : penaltyBreak, longbreak : penaltyLongbreak}
        this.bonus = bonus
        this.reward = reward
        this.longbreakCost = longbreakCost
        this.execution = execSession + execBreak + execLongbreak
        this.executionMode = {session : execSession, break : penaltyBreak, longbreak : penaltyLongbreak}
    }

    //Calculo de tiempo
    public getTime(at : number = Date.now()){
        return `${this.getMinutes(at).toString().padStart(2, "0")}:${this.getSeconds(at).toString().padStart(2,"0")}`
    }

    public getMinutes(at : number = Date.now()) : number{
        const currentInterval = this.getCurrentInterval()
        return (this.active) ? currentInterval - 1 - (this.passedMin(at) - currentInterval * this.getIntervals(at)) : 0
    }

    public getSeconds(at : number = Date.now()) : number{
        const time = at - this.lastInterval
        const sec = Math.ceil(time / 1000)
        return (this.active) ? 60 - sec % 60 : 0
    }

    private passedMin(at : number = Date.now()) : number{
        return Math.floor((at - this.lastInterval) / 1000 / 60)
    }

    public getStart(){
        return this.start
    }

    public getExecutionTime(at : number = Date.now()){
        if(this.active) return this.execution + at - this.start
        return this.execution
    }

    public getModeExecution(mode : Mode, at : number = Date.now()){
        if(mode === this.mode) return this.executionMode[mode] + at - this.start
        return this.executionMode[mode]
    }

    private getCurrentInterval(at : number = Date.now()){
        const currentInterval : ModeValues = {
            "session" : this.interval,
            "break" : (this.passedMin(at) < this.bonus) ? this.bonus : this.intervals.break,
            "longbreak" : this.intervals.longbreak
        }
        return currentInterval[this.mode]
    }

    public getIntervals(at : number = Date.now()) : number{
        return Math.floor((at - this.lastInterval) / 1000 / 60 / this.getCurrentInterval(at))
    }

    //Modos de funcionamiento
    public getActive(){
        return this.active
    }

    public getMode() : Mode{
        return this.mode
    }

    public setActive(active : boolean, at : number = Date.now()){
        this.active = active
        if(active){
            this.start = at
            this.lastInterval = at
        }
        if(!active){
            this.execution += at - this.start
            this.bonus = this.getBonus(at)
        }
    }

    public setMode(mode : Mode, at : number = Date.now()){
        if(mode === this.mode) return
        this.bonus = this.getBonus(at)
        this.lastInterval = at
        if(this.active) this.executionMode[this.mode] += at - this.start
        this.mode = mode
        //Longbreak
        if(mode !== "longbreak") return
        this.intervals.longbreak || this.setActive(false, at)
        if(this.longbreakCost) this.bonus -= this.longbreakCost
    }

    //Sistema de Bonus
    private sessionBonus = (at : number = Date.now()) : number => {
        if(this.bonus >= 0) return this.bonus + this.reward*this.getIntervals(at)
        if(this.passedMin(at) < Math.abs(this.bonus)) return this.bonus + this.passedMin(at)
        return this.reward * (this.getIntervals(at) + Math.floor(this.bonus / this.interval))
    }

    private breakBonus = (at : number = Date.now()) : number => {
        if(this.passedMin(at) < this.bonus) return this.getMinutes(at)
        return - this.penalty.break * (this.getIntervals(at) + 1 - Math.ceil(this.bonus / this.intervals.break))
    }

    private longBreakBonus = (at : number = Date.now()) : number => {
        return this.bonus - this.penalty.longbreak * this.getIntervals(at)
    }
    
    public getBonus(at : number = Date.now()) : number{
        const bonus : ModeValues = {
            "session" : this.sessionBonus(at),
            "break" : this.breakBonus(at),
            "longbreak" : (this.active) ? this.longBreakBonus(at) : this.bonus,
        }
        return bonus[this.mode]
    }

}