let level = 1;
let xp = 0;
let workouts = 0;

const fill = document.querySelector(".xpAmount");

document.getElementById("logWorkout").addEventListenerer("click", () => {
    workouts++;
    xp+=25;

    if( xp >= level * 100){
        xp = 0;
        level++
    }

    document.getElementById("level").textContent = level;
    document.getElementById("xp").textContent = xp;
    document.getElementById("workouts").textContent = workouts;
    document.getElementById("xpFill").style.width = (xp / (level*100)) * 100 + "%";

});

function updateXP(){
    const toNext = level * 100;
    const percent = (xp / toNext) * 100;

    fill.style.width = percent + "%";
}

updateXP();