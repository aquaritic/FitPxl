//note for later: get the pixel font (google fonts), revamp the ui with hovering, pixelated background, glow, player stats, custom pixel icons

let level = 1;
let xp = 0;
let workouts = 0;
let streak = 0;
let currentWeight = localStorage.getItem("weight") || "N/A";

const fill = document.querySelector(".xpAmount");

document.getElementById("logWorkout").addEventListener("click", () => {
    workouts++;
    xp+=25;

    const xpNeeded = level * 100;

    if( xp >= xpNeeded){
        xp -= xpNeeded;
        level++
        alert("LVLED UP TO " + level +"!");
    }

    streak++;
    saveData();
    update();
});

document.getElementById("logWeight").addEventListener("click", () => {
    const newWeight = prompt("Enter your bodyweight")
    if(!newWeight) return;

    currentWeight = newWeight;
    localStorage.setItem("weight", currentWeight);

    document.getElementById("weight").textContent = currentWeight;
});

document.getElementById("xpText").textContent = `Level ${level} • ${xp} / ${level*100} XP`;

function saveData(){
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("workouts", workouts);
    localStorage.setItem("streak", streak);
}

function loadData(){
    xp = Number(localStorage.getItem("xp") || 0);
    level = Number(localStorage.getItem("level")) || 1;
    workouts = Number(localStorage.getItem("workouts")) || 0;
    streak = Number(localStorage.getItem("streak")) || 0;
    currentWeight = localStorage.getItem("weight") || "N/A";
}

function updateAchievements(){
    const achievements = [];

    if(workouts >= 1){
        achievements.push("LVL1");
    }
    if(workouts >= 10){
        achievements.push("Next Level")
    }
    if(workouts >= 25){
        achievements.push("Fanatic")
    }

    document.getElementById("achievements").innerHTML = achievements.join("<br>");
}

function updateDailyQuest(){
    if(workouts > 0){
        document.getElementById("dailyQuest").innerHTML = "Quest Completed"
    }
}

function updateWeeklyQuest(){
    if(workouts > 3){
        document.getElementById("weeklyQuest").innerHTML = "Quest Completed"
    }
}

function updateMonthlyQuest(){
    if(streak > 21){
        document.getElementById("monthlyQuest").innerHTML = "Quest Completed"
    }
}

function updateXP(){
    const toNext = level * 100;
    const percent = (xp / toNext) * 100;

    fill.style.width = percent + "%";
}

function update(){
    const xpNeeded = level * 100;

    document.getElementById("level").textContent = level;
    document.getElementById("xp").textContent = xp;
    document.getElementById("workouts").textContent = workouts;
    document.getElementById("streak").textContent = streak +" Days";
    document.getElementById("xpText").textContent = `Level ${level} • ${xp} / ${xpNeeded} XP`;
    document.getElementById("xpAmount").style.width = (xp/xpNeeded) * 100 + "%";
    document.getElementById("weight").textContent = currentWeight;
    document.getElementById("xpText").textContent = `Level ${level} [${xp} / ${xpNeeded} XP]`;
    document.getElementById("xpAmount").style.width = (xp / xpNeeded) * 100 + "%";

    updateXP();
    updateAchievements();
    updateDailyQuest();
    updateWeeklyQuest();
    updateMonthlyQuest();
}

loadData();
update();