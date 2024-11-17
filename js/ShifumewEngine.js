import MersenneTwister  from 'mersenne-twister';

// return the score change for each options
export class ShifumewEngine {
    history = []
    scores = [0,0]
    #random = new MersenneTwister()
    seed

    constructor(seed = Math.ceil(Math.random()*10_000_000_000)) {
        this.seed = seed
        this.#random.init_seed(seed)
    }

    /**
     * run a single round, update the score and returns if you won this round
     * @param {0|1|2} move rock, paper, scissors as int
     * @return {{result:(-1|0|1), enemyMove:(0|1|2)}} 0 = equality, 1 = won, -1 = loose
     */
    play(move) {
        let computeMove = this.computeChoose()
        const results = ShifumewEngine.check(move, computeMove)
        this.history.push({options: [move,computeMove],  results})
        this.scores[0] += Math.max(results[0], 0)
        this.scores[1] += Math.max(results[1], 0)
        return {result: results[0], enemyMove: computeMove}
    }

    // simply run a random for Ai 
    computeChoose() {
        return Math.ceil(this.#random.random()*3)-1
    }

    /**
     * @static
     * @param {0|1|2} option1 rock, paper, scissors as int
     * @param {0|1|2} option2 rock, paper, scissors as int
     * @return {[(-1|0|1),(-1|0|1)]}  it is a win or a loose for each options
     */
    static check(option1, option2) {
        console.log(option1,option2)
        return [
            ShifumewEngine.resultMatrix[option1][option2],
            ShifumewEngine.resultMatrix[option2][option1]
        ]
    }


    toJSON() {
        return {seed:this.seed, scores:this.scores, history:this.history}
    }
    static unserializeObject (object) {
        const engine = new ShifumewEngine(object.seed)
        engine.scores = object.scores
        engine.history = object.history
        // restore state of seeded random
        for (const _ in engine.history) engine.#random.random()
        return engine
    }

    /**
     * @return {?("rock"|"equality"|"win")} return the name of the option (rock, paper, scissors) or undefined if not found
     */
    static optionToString(int) {
        return Object.entries(ShifumewEngine.optionsEnum)
            .find(x=>x[1]===int)?.[0]
    }
    /**
     * @param {"rock"|"paper"|"scissors"} string
     * @return {?(0|1|2)} return the number representation of the result or undefined if not found
     */
    static optionFromString(string) {
        return Object.entries(ShifumewEngine.optionsEnum)
            .find(x=>x[0]===string)?.[1]
    }
    /**
     * @param {-1|0|1} int
     * @return {?("loose"|"equality"|"win")} return the name of the option () or undefined if not found
     */
    static resultToString(int) {
        return Object.entries(ShifumewEngine.resultEnum)
            .find(x=>x[1]===int)?.[0]
    }
    /**
     * @param {"loose"|"equality"|"win"} string
     * @return {?(-1|0|1)} return the number representation of the result or undefined if not found
     */
    static resultFromString(string) {
        return Object.entries(ShifumewEngine.resultEnum)
            .find(x=>x[0]===string)?.[1]
    }
}
ShifumewEngine.optionsEnum = {
    rock: 0,
    paper: 1,
    scissors: 2,
};
ShifumewEngine.resultEnum = {
    loose: -1,
    equality: 0,
    win: 1,
} 
ShifumewEngine.resultMatrix = [
    [0, -1, 1], //rock
    [1, 0, -1], //paper
    [-1, 1, 0], //scissors
];

export default ShifumewEngine;