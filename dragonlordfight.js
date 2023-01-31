//Get the data from the page
function readForms(){
    let attackPower = document.getElementById("attack-power").value
    let playerHp = document.getElementById("hp").value
    let playerMp = document.getElementById("mp").value
    let fairyWaters = document.getElementById("fairy-water").value
    let playerDefense = document.getElementById("defense").value
    let hasDeathNecklace = findDeathNecklaceChecked()
    let playerMaxHp = document.getElementById("max-hp").value
    let wins = 0;
    for(let i = 0; i < 10000; i++){
        if(fightDragonlord(attackPower, playerHp, playerMaxHp, playerMp, fairyWaters, hasDeathNecklace, playerDefense) === true) {
            wins++
        } 
    }
    let winPercent = ((wins/10000) * 100).toFixed(2)
    let maxiPower = checkForNumber(attackPower)
    let miniPower = checkForNumber(attackPower)
    if(!hasDeathNecklace){
        
        miniPower = playerMinAttack(miniPower)
       
        maxiPower = playerMaxAttack(maxiPower)
    } else {
        miniPower = playerMinAttack(miniPower + 10)
        maxiPower = polayerMaxAttack(maxiPower + 10)
    }
    setResults("Your minimum attack is " + miniPower + "\nYour maximum attack is " + maxiPower + "\nOut of 10000 tries, you won " + wins + " for a result of " + winPercent +"%")
}



function fightDragonlord(attackPower, playerHp, playerMaxHp, playerMp, fairyWaters, hasDeathNecklace, playerDefense){
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
    hasWon = false
    dlHp = randomNumber(150, 165)
    let turnCounter = 1
    if(hasDeathNecklace){
        //Having the Death Necklace on costs 25% of your max hp
        playerMaxHp -= (playerHp * .25)
    }
    if (playerHp > playerMaxHp){
        playerHp = playerMaxHp
    }
    //Run the fight
    while(playerHp > 0 && dlHp > 0){
        //Check for DL2 ambush.
        if(turnCounter === 1){
            if(randomNumber(1, 3) === 1){
                playerHp -= dragonlordTurn(dlMinAttack, dlMaxAttack) 
            } 
        }
        //Player's turn.  True represents casting HEALMORE, otherwise attack.
        if((playerDecision(playerHp, dlMaxAttack) === true) && playerMp >= 8){
            playerMp -=8  
            playerHp += castHealmore(playerMaxHp)
            if(playerHp > playerMaxHp){
                playerHp = playerMaxHp
            }
        } else {
            //If you have a fairy water, and it's doing more damage than swinging, throw it.
            if((fairyWaters > 0) && (playerMaxPower < 16)){
                fairyWaters--
                dlHp -= randomNumber(8, 16)
            } else {
                dlHp -= playerAttack(playerMinPower, playerMaxPower)
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
    return hasWon
}

function dragonlordTurn(minAttack,maxAttack){
    //Represents the breath attack.  Slightly favors the middle numbers.
    let damage = 0
    if(randomNumber(1, 2) === 1){
        let breathAttackRange = randomNumber(1, 6)
        switch(breathAttackRange){
            case 1:
                damage = 42
                break
            case 2:
            case 3:
                damage = 44
                break
            case 4:
            case 5:
                damage = 46
                break
            case 6:
                damage = 48
                break;
        }
    } else {
      //Represents a melee attack
      damage = randomNumber(minAttack, maxAttack)
    }
    return damage
}

function playerDecision(playerHp, dragonlordMaxAttack){
    //Fights cautiously, always casts HEALMORE if they have enough MP and can be taken out in one DL2 hit.
    if(playerHp < dragonlordMaxAttack || playerHp < 48){
        //Cast HEALMORE
        return true
    }
    //Otherwise attack
    return false
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
    return Math.floor((attackPower - 100) / 4)
}

function playerMaxAttack(attackPower, hasDeathNecklace){
    if(hasDeathNecklace){
        attackPower += 10
    }
    return Math.floor((attackPower - 100) / 2)
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