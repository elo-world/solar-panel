const monthYearElement = document.getElementById("monthYear");
const datesElement = document.getElementById("dates");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seasonTextElement = document.getElementById("season");
const tiltTextElement = document.getElementById("tilt");

let currentDate = new Date();
let searchDate = new Date();

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const seasons = {
        spring: new Date(currentYear, 2, 20), // March 20
        summer: new Date(currentYear, 5, 21), // June 21
        autumn: new Date(currentYear, 8, 22), // September 22
        winter: new Date(currentYear, 11, 21), // December 21
    };

    const firstDay = new Date(currentYear, currentMonth, 0);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthYearString = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });
    monthYearElement.textContent = monthYearString;

    let datesHTML = "";

    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
        datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
    }

    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        let activeClass = "";

        if (date.toDateString() === searchDate.toDateString()) {
            activeClass = "active";
        } else {
            for (const season in seasons) {
                if (date.toDateString() === new Date(seasons[season]).toDateString()) {
                    activeClass = "season";
                }
            }
        }

        datesHTML += `<div class="date ${activeClass}">${i}</div>`;
    }

    for (let i = 1; i <= 7 - lastDayIndex; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    let season = getSeasonTitl(seasons, searchDate);

    seasonTextElement.innerHTML = season.season;
    tiltTextElement.innerHTML = `${season.tilt}°`;

    datesElement.innerHTML = datesHTML;

    let allDates = document.querySelectorAll(".date");
    for (var i = 0; i < allDates.length; i++) {
        allDates[i].addEventListener("click", (e) => {
            if (e.target.classList.contains("inactive")) {
                if (parseInt(e.target.innerHTML) >= 20) {
                    searchDate = new Date(currentYear, currentMonth - 1, e.target.innerHTML);
                    updateCalendar();
                } else {
                    searchDate = new Date(currentYear, currentMonth + 1, e.target.innerHTML);
                    updateCalendar();
                }
            } else {
                searchDate = new Date(currentYear, currentMonth, parseInt(e.target.innerHTML));
                updateCalendar();
            }
        });
    }
    console.log(searchDate);
};

const getSeasonTitl = (seasons, date) => {
    let season = "";
    let tilt = 0;

    if (date >= seasons.winter || date < seasons.spring) {
        season = "Winter";
    } else if (date >= seasons.spring && date < seasons.summer) {
        season = "Spring";
    } else if (date >= seasons.summer && date < seasons.autumn) {
        season = "Summer";
    } else if (date >= seasons.autumn && date < seasons.winter) {
        season = "Autumn";
    }

    const n = Math.round((date - new Date(date.getFullYear(), 0, 1)) / (1000 * 60 ** 2 * 24));
    tilt = 48 - 23.45 * Math.sin((360 * (n - 81) * Math.PI) / (365 * 180));

    return { season: season, tilt: tilt.toFixed(1) };
};

prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

updateCalendar();
