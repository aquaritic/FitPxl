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

const fill = document.querySelector("#xpAmount");
const workoutWindow = document.getElementById("workoutWindow");
const exerciseList = document.getElementById("exerciseList");

document.getElementById("logWorkoutBtn").addEventListener("click", () => {
    workoutWindow.classList.remove("hiddenWindow");
    exerciseList.innerHTML = "";
    exerciseList.appendChild(createExerciseEntry());
});

document.getElementById("cancelWorkout").addEventListener("click", () => {
    workoutWindow.classList.add("hiddenWindow");
});

document.getElementById("addExercise").addEventListener("click", () => {
    exerciseList.appendChild(createExerciseEntry());
});

document.getElementById("saveWorkout").addEventListener("click", () => {
    const exercises = [];

    document.querySelectorAll(".exerciseEntry").forEach(entry => {
        const name = entry.querySelector(".eName").value.trim();
        const sets = Number(entry.querySelector(".eSets").value);
        const reps = Number(entry.querySelector(".eReps").value);
        const weight = Number(entry.querySelector(".eWeight").value);
        const other = entry.querySelector(".eOther").value.trim();

        if(!name || !sets || !reps) return;

        exercises.push({name, sets, reps, weight, other});
    });

    if(exercises.length === 0) return;

    const workout = {
        date: today(),
        exercises: exercises
    };

    const history = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
    history.push(workout);
    localStorage.setItem("workoutHistory", JSON.stringify(history));

    dailyWorkouts++;
    weeklyWorkouts++;
    monthlyStreak++;

    localStorage.setItem("dailyWorkouts", dailyWorkouts);
    localStorage.setItem("weeklyWorkouts", weeklyWorkouts);
    localStorage.setItem("monthlyStreak", monthlyStreak);

    updateStreak();
    workoutWindow.classList.add("hiddenWindow");
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

function createExerciseEntry(){
    const div = document.createElement("div");
    div.classList.add("exerciseEntry")

    div.innerHTML = `
        <input type="text" placeholder="Exercise Name" class = "eName">
        <input type="number" placeholder="Sets" class = "eSets">
        <input type="number" placeholder="Reps" class = "eReps">
        <input type="number" placeholder="Weight" class = "eWeight">
        <input type="text" placeholder="Other (RIR, etc.)" class = "eOther">
        <button class="removeExercise">X</button>
        `;

    div.querySelector(".removeExercise").addEventListener("click", () => {
        div.remove();
    });
    return div;
}

function updateStreak(){
    const currentDate = today();

    if(!lastWorkoutDate){
        lastWorkoutDate = currentDate;
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

function updateRecentWorkouts(){
    const container = document.getElementById("recentWorkouts");
    const history = JSON.parse(localStorage.getItem("workoutHistory") || "[]");

    container.innerHTML = "";

    if(history.length === 0){
        container.innerHTML = "<p>No workouts logged</p>";
        return;
    }

    const recent = history.slice(-5).reverse();

    recent.forEach(workout => {
        const div = document.createElement("div");
        div.classList.add("recentWorkoutItem");

        let html = `<h3>${workout.date}</h3>`;

        workout.exercises.forEach(ex => {
            html += `<p>
                <strong>${ex.name}</strong> -
                ${ex.sets}×${ex.reps}
                ${ex.weight ? `@ ${ex.weight} lbs` : ""}
                ${ex.other ? `(${ex.other})` : ""}
            </p>`;
        });
        div.innerHTML = html;
        container.appendChild(div);
    });
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
    const now = new Date();
    const currentDate = today();

    if(!lastWeeklyReset){
        lastWeeklyReset = currentDate;
        localStorage.setItem("lastWeeklyReset", lastWeeklyReset);
        return;
    }

    const lastReset = new Date(lastWeeklyReset);
    const newWeek = now.getDay() === 1 && lastReset.getDay() !== 1;

    if(newWeek){
        weeklyWorkouts = 0;
        lastWeeklyReset = currentDate;

        localStorage.setItem("weeklyWorkouts", weeklyWorkouts);
        localStorage.setItem("lastWeeklyReset", lastWeeklyReset);
    }
}

function monthlyReset(){
    const now = new Date();
    const currentDate = today();

    if(!lastMonthlyReset){
        lastMonthlyReset = currentDate;
        localStorage.setItem("lastMonthlyReset", lastMonthlyReset);
        return;
    }

    const lastReset = new Date(lastMonthlyReset);
    const newMonth = now.getMonth() !== lastReset.getMonth();

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
    document.getElementById("xpAmount").style.width = (xp/xpNeeded) * 100 + "%";
    document.getElementById("weight").textContent = currentWeight;

    updateXP();
    updateAchievements();
    updateDailyQuest();
    updateWeeklyQuest();
    updateMonthlyQuest();
    updateRecentWorkouts();
}

loadData();
reset();
update();