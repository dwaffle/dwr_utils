

function readForms(){
    let bridgeEncounterTiles = document.getElementById("bridgeEncounterTiles").value
    let lowEncounterTiles = document.getElementById("lowEncounterTiles").value
    let medEncounterTiles = document.getElementById("mediumEncounterTiles").value
    let highEncounterTiles = document.getElementById("highEncounterTiles").value
    bridgeEncounterTiles = checkForNumber(bridgeEncounterTiles)
    lowEncounterTiles = checkForNumber(lowEncounterTiles)
    medEncounterTiles = checkForNumber(medEncounterTiles)
    highEncounterTiles = checkForNumber(highEncounterTiles)
    calculate(bridgeEncounterTiles, lowEncounterTiles, medEncounterTiles, highEncounterTiles)
}

//Async to not block main thread.  May need to put in a cap
//Noticible pause at a hundred thousand.
async function calculate(bridgeEncounterTiles, lowEncounterTiles, medEncounterTiles, highEncounterTiles){
    let totalEnemiesEncountered = 0
    let totalEncounterRate = 0
    let totalTiles = Number(bridgeEncounterTiles) + Number(lowEncounterTiles) + Number(medEncounterTiles) + Number(highEncounterTiles)
        for(let j = 0; j < 1000; j++){
            for(let i = 0; i < bridgeEncounterTiles; i++){
                if(randomNumber(1, 48) === 1){
                    totalEnemiesEncountered++
                }
            }
            for(let i = 0; i < lowEncounterTiles; i++){
                if(randomNumber(1,213) <= 10){
                    totalEnemiesEncountered++
                }
            }
            for(let i = 0; i < medEncounterTiles; i++){
                if(randomNumber(1,16) === 1){
                    totalEnemiesEncountered++
                }
            }
            for(let i = 0; i < highEncounterTiles; i++){
                if(randomNumber(1,8) === 1){
                    totalEnemiesEncountered++
                }
            }
        }
    totalEncounterRate = ((totalEnemiesEncountered/(totalTiles * 1000)) * 100).toFixed(2)
    if(isNaN(totalEncounterRate) || totalEncounterRate === 0 || totalTiles <= 0){
        setResults("You must walk at least one tile to encounter an enemy.")
    } else {
        setResults("Your total encounter rate is " + totalEncounterRate + "%  \nTotal enemies encountered in 1000 trials: " + totalEnemiesEncountered + " \nTotal tiles traveled: " + totalTiles * 1000)
    }
}

//returns a random number between min and max.
function randomNumber(min, max){
    //min is inclusive, max is now inclusive too.
    return Math.floor(Math.random() *(max - min + 1) + min)
}

function checkForNumber(number){
    if(isNaN(number)){
        return null
    }
    if(number <= 0){
        return 0
    }
    
    return Math.floor(number);
}
function setResults(results){
    let q = document.getElementById("result")
    q.textContent = results
}