let xp = 0;
let level = 1;

const fill = document.querySelector(".xpAmount");

function updateXP(){
    const toNext = level * 100;
    const percent = (xp / toNext) * 100;

    fill.style.width = percent + "%";
}

updateXP();