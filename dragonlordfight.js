
let doublesOverAllFights = 0


//Get the data from the page

function readForms(){
    let attackPower = document.getElementById("attack-power").value
    let playerHp = document.getElementById("hp").value
    let playerMp = document.getElementById("mp").value
    let fairyWaters = document.getElementById("fairy-water").value
    let playerDefense = document.getElementById("defense").value
    let hasDeathNecklace = findDeathNecklaceChecked()
    let playerMaxHp = document.getElementById("max-hp").value
    let swingOption = getSwingOption()
    let forceBackAttack = getBackAttackOption();
    let wins = 0
    let dlFight = {}
    let totalDoubles = 0
    let attacks = 0
    for(let i = 0; i < 10000; i++){
        dlFight = fightDragonlord(attackPower, playerHp, playerMaxHp, playerMp, fairyWaters, hasDeathNecklace, playerDefense, swingOption, forceBackAttack)
        if(dlFight.hasWon === true) {
            wins++
        } 
        totalDoubles += dlFight.currentDoubles
        attacks += dlFight.totalAttacks
    }
    let winPercent = ((wins/10000) * 100).toFixed(2)
    let doublePercent = ((wins/attacks) * 100).toFixed(2)
    let maxiPower = checkForNumber(attackPower)
    let miniPower = checkForNumber(attackPower)
    if(!hasDeathNecklace){
        
        miniPower = playerMinAttack(miniPower)
       
        maxiPower = playerMaxAttack(maxiPower)
    } else {
        miniPower = playerMinAttack(miniPower + 10)
        maxiPower = playerMaxAttack(maxiPower + 10)
    }
    setResults("Your minimum attack is " + miniPower + "\nYour maximum attack is " + maxiPower + "\nYou scored " + totalDoubles + " multiple attacks, attacking again " + doublePercent + "% of the time in " + attacks + " attacks" + "\nOut of 10000 tries, you won " + wins + " for a result of " + winPercent +"%")
}



function fightDragonlord(attackPower, playerHp, playerMaxHp, playerMp, fairyWaters, hasDeathNecklace, playerDefense, swingOption, forceBackAttack){
    //Set up the fight.
    attackPower = checkForNumber(attackPower)
    playerHp = checkForNumber(playerHp)
    playerMp = checkForNumber(playerMp)
    playerMaxHp = checkForNumber(playerMaxHp)
    fairyWaters = checkForNumber(fairyWaters)
    dlMinAttack = dragonlordMinAttack(playerDefense)
    dlMaxAttack = dragonlordMaxAttack(playerDefense)
    let playerMinPower = playerMinAttack(attackPower, hasDeathNecklace)
    let playerMaxPower = playerMaxAttack(attackPower, hasDeathNecklace)
    let canDouble = false;
    let currentDoubles = 0
    let totalAttacks = 0
    hasWon = false
    dlHp = randomNumber(150, 165)
    let turnCounter = 1
    if(hasDeathNecklace){
        //Having the Death Necklace on costs 25% of your max hp
        playerMaxHp -= (playerMaxHp * .25)
    }
    if (playerHp > playerMaxHp){
        playerHp = playerMaxHp
    }
    //Run the fight
    while(playerHp > 0 && dlHp > 0){
        //Check for DL2 ambush.
        if(turnCounter === 1){
            //Allow the player to force a back attack, randomize, or force the Dragonlord to attack first.
            if(forceBackAttack != "Player"){
                if(randomNumber(1, 3) === 1 || forceBackAttack === "Dragonlord"){
                    playerHp -= dragonlordTurn(dlMinAttack, dlMaxAttack) 
                }
            } 
        }
        //Player's turn.  True represents casting HEALMORE, otherwise attack.
        if((playerDecision(playerHp, dlMaxAttack, swingOption) === true) && playerMp >= 8){
            playerMp -=8  
            playerHp += castHealmore(playerMaxHp)
            if(playerHp > playerMaxHp){
                playerHp = playerMaxHp
            }
            //Didn't double attack.
            canDouble = false
        } else {
            totalAttacks++
            //If you have a fairy water, and it's doing more damage (or the same.  Minimum swing with 16 max is 8 fairy water min is 9) than swinging, throw it.
            if((fairyWaters > 0) && (playerMaxPower <= 16)){
                fairyWaters--
                dlHp -= randomNumber(9, 16)
            } else {
                dlHp -= playerAttack(playerMinPower, playerMaxPower)
            }
            //Track double attack times.
            if(canDouble === true){
                currentDoubles++
            } else {
                canDouble = true
            }
        }
        //Dragonlord's turn
        playerHp -= dragonlordTurn(dlMinAttack, dlMaxAttack)
        turnCounter++
    }
    //Who won?
    if(playerHp <= 0){
        hasWon = false
    } else {
        hasWon = true
    }
    return {hasWon, currentDoubles, totalAttacks}
}

function dragonlordTurn(minAttack,maxAttack){
    //Represents the breath attack.  Slightly favors the middle numbers.
    let damage = 0
    if(randomNumber(1, 2) === 1){
        let breathAttackRange = randomNumber(1, 8)
        switch(breathAttackRange){
            case 1:
                damage = 42
                break
            case 2:
            case 3:
            case 4:
                damage = 44
                break
            case 5:
            case 6:
            case 7:
                damage = 46
                break
            case 8:
                damage = 48
                break;
        }
    } else {
      //Represents a melee attack
      damage = randomNumber(minAttack, maxAttack)
    }
    return damage
}

function playerDecision(playerHp, dragonlordMaxAttack, swingOption){
    
    switch(swingOption){
        case "Cautiously":
        if(playerHp < dragonlordMaxAttack || playerHp < 48){
            //Cast HEALMORE
            return true
        }
            //Otherwise attack
            return false
        //Attack on 48 hp
        case "48":
            if(playerHp < 47){
                return true
            }
            return false
        //Attack on 47 hp
        case "47":
            if(playerHp < 46){
                return true
            }
            return false
        default:
            console.error("Out of range error")
            setResults("Out of range error.  Let EMP know at the email below.")
    }
}

function castHealmore(playerMaxHp){
    let healmoreAmount = randomNumber(Math.min(85, playerMaxHp), Math.min(100, playerMaxHp))
    return healmoreAmount
}

function playerAttack(playerMinAttack, playerMaxAttack){
    return randomNumber(playerMinAttack, playerMaxAttack)
}

function playerMinAttack(attackPower, hasDeathNecklace){
    if(hasDeathNecklace){
        attackPower += 10
    }
    return Math.max(0, (Math.floor((attackPower - 100) / 4)))
}

function playerMaxAttack(attackPower, hasDeathNecklace){
    if(hasDeathNecklace){
        attackPower += 10
    }
    return Math.max(1, (Math.floor((attackPower - 100) / 2)))
}

function dragonlordMinAttack(playerDefense){
    if(playerDefense === null || playerDefense === 0){
        playerDefense = 75
    }
    return Math.floor((140 - playerDefense / 2) / 4)
}

function dragonlordMaxAttack(playerDefense){
    if(playerDefense === null || playerDefense === 0){
        playerDefense = 75
    }
    return Math.floor((140 - playerDefense / 2) / 2)
}

function findDeathNecklaceChecked(){
    let selectedValue = document.querySelector('input[name="dn"]:checked')
    return selectedValue.value === "Yes"
}

function getSwingOption(){
    let selectedValue = document.querySelector('input[name="swing-options"]:checked').value
    return selectedValue
}

function getBackAttackOption(){
    let selectedValue = document.querySelector('input[name="back-attack-options"]:checked').value
    return selectedValue
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