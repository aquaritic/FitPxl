let level = 1;
let xp = 0;
let workouts = 0;
let streak = 0;
let currentWeight = localStorage.getItem("weight") || "N/A";
let dailyWorkouts = Number(localStorage.getItem("dailyWorkouts")) || 0;
let weeklyWorkouts = Number(localStorage.getItem("weeklyWorkouts")) || 0;
let monthlyStreak = Number(localStorage.getItem("monthlyStreak")) || 0;
let lastWorkoutDate = localStorage.getItem("lastWorkoutDate") || null;
let lastWeeklyReset = localStorage.getItem("lastWeeklyReset") || null;
let lastMonthlyReset = localStorage.getItem("lastMonthlyReset") || null;

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

    dailyWorkouts++;
    weeklyWorkouts++;
    monthlyWorkouts++;

    localStorage.setItem("dailyWorkouts", dailyWorkouts);
    localStorage.setItem("weeklyWorkouts", weeklyWorkouts);
    localStorage.setItem("monthlyStreak", monthlyStreak);

    updateStreak();
    saveData();
    update();
});

document.getElementById("logWeight").addEventListener("click", () => {
    const newWeight = prompt("Enter your bodyweight")
    if(!newWeight) return;

    currentWeight = newWeight;
    localStorage.setItem("weight", currentWeight);

    document.getElementById("weight").textContent = currentWeight;
    saveData();
});

document.getElementById("xpText").textContent = `Level ${level} • ${xp} / ${level*100} XP`;

function saveData(){
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("workouts", workouts);
    localStorage.setItem("streak", streak);
    localStorage.setItem("weight", currentWeight);
}

function loadData(){
    xp = Number(localStorage.getItem("xp") || 0);
    level = Number(localStorage.getItem("level")) || 1;
    workouts = Number(localStorage.getItem("workouts")) || 0;
    streak = Number(localStorage.getItem("streak")) || 0;
    currentWeight = localStorage.getItem("weight") || "N/A";
}

function updateStreak(){
    const currentDate = today();

    if(!lastWorkoutDate){
        lastWorkoutDate = currentDate();
        localStorage.setItem("lastWorkoutDate", currentDate);
        return;
    }

    const last = new Date(lastWorkoutDate);
    const now = new Date(currentDate);
    const diff = (now - last) / (1000 * 60 * 60 * 24);

    if(diff === 1){
        streak++;
    } else if (diff > 1){
        streak = 0;
    }

    lastWorkoutDate = currentDate;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastWorkoutDate", lastWorkoutDate);
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

function today(){
    return new Date().toISOString().split("T")[0];
}

function dailyReset(){
    const currentDate = today();

    if(lastWorkoutDate !== currentDate){
        dailyWorkouts = 0;
        localStorage.setItem("dailyWorkouts", dailyWorkouts);
    }
}

function weeklyReset(){
    const today = new Date();
    const currentDate = today();

    if(!lastWeeklyReset){
        lastWeeklyReset = currentDate;
        localStorage.setItem("lastWeeklyReset", lastWeeklyReset);
        return;
    }

    const lastReset = new Date(lastWeeklyReset);
    const newWeek = today.getDay() === 1 && lastReset.getDay() !== 1;

    if(newWeek){
        weeklyWorkouts = 0;
        lastWeeklyReset = currentDate;

        localStorage.setItem("weeklyWorkouts", weeklyWorkouts);
        localStorage.setItem("lastWeeklyReset", lastWeeklyReset);
    }
}

function monthlyReset(){
    const today = new Date();
    const currentDate = today();

    if(!lastMonthlyReset){
        lastMonthlyReset = currentDate;
        localStorage.setItem("lastMonthlyReset", lastMonthlyReset);
        return;
    }

    const lastReset = new Date(lastMonthlyReset);
    const newMonth = today.getMonth() !== lastReset.getMonth();

    if(newMonth){
        monthlyStreak = 0;
        lastMonthlyReset = currentDate;

        localStorage.setItem("monthlyStreak", monthlyStreak);
        localStorage.setItem("lastMonthlyReset", lastMonthlyReset);
    }
}

function reset(){
    dailyReset();
    weeklyReset();
    monthlyReset();
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
reset();
update();