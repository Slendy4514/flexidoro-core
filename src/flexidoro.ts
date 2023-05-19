type Mode = "session" | "break" | "longbreak"

interface flexidoroData{
    active : boolean,
    execution : number
    mode : Mode,
    start : number,
    lastInterval : number,
    intervals : ModeValues,
    penalty : PartialModeValues
    reward : number,
    longbreakCost : number
    bonus : number
}

interface PartialModeValues{
    break : number,
    longbreak : number,
}

interface ModeValues extends PartialModeValues{
    session : number
}

const defaultFlexidoro : flexidoroData = {
        active : true,
        execution : 0,
        mode : "session",
        start : Date.now(),
        lastInterval : Date.now(),
        intervals : {
            session : 15,
            break : 5,
            longbreak : 0
        },
        penalty : {
            break : 15,
            longbreak : 0
        },
        reward : 5,
        longbreakCost : 15,
        bonus : 0,
    }

    // {
    //     mode = "session", 
    //     start = Date.now(),
    //     lastInterval = Date.now(),
    //     bonus = 0,
    //     intervals = {
    //         session : 15,
    //         break : 5,
    //         longbreak : 0
    //     },
    //     penalty = {
    //         break : 15,
    //         longbreak : 0
    //     },
    //     reward = 5,
    //     active = false,
    //     longbreakCost = 15,
    //     execution = 0}

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
    constructor( {active, mode, start, lastInterval, intervals, penalty, bonus, reward, longbreakCost, execution} : flexidoroData = defaultFlexidoro){
        this.active = active
        this.mode = mode
        this.start = start
        this.lastInterval = lastInterval
        this.interval = intervals.session
        this.intervals = {break : intervals.break, longbreak : intervals.longbreak}
        this.penalty = penalty
        this.bonus = bonus
        this.reward = reward
        this.longbreakCost = longbreakCost
        this.execution = execution
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
        this.bonus = this.getBonus(at)
        this.lastInterval = at
        this.mode = mode
        //Longbreak
        if(mode !== "longbreak") return
        this.intervals.longbreak || this.setActive(false)
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