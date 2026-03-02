document.addEventListener("DOMContentLoaded", () => {
    const year = document.getElementById("year");
    const month = document.getElementById("month");
    const datesElement = document.getElementById("dates");
    const today_button = document.getElementById("today_button");
    const prev_month_button = document.getElementById("prev_month_button");
    const next_month_button = document.getElementById("next_month_button");
    const seasonTextElement = document.getElementById("season");
    const tiltTextElement = document.getElementById("tilt");

    let latitude = 48;
    let current_date = new Date();
    let search_date = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate());

    const updateCalendar = () => {
        const current_year = current_date.getFullYear();
        const current_month = current_date.getMonth();

        const seasons = {
            spring: new Date(current_year, 2, 20), // March 20
            summer: new Date(current_year, 5, 21), // June 21
            autumn: new Date(current_year, 8, 22), // September 22
            winter: new Date(current_year, 11, 21), // December 21
        };

        const firstDay = new Date(current_year, current_month, 0);
        const lastDay = new Date(current_year, current_month + 1, 0);
        const totalDays = lastDay.getDate();
        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();

        year.textContent = current_date.toLocaleString("default", { year: "numeric" });
        month.textContent = current_date.toLocaleString("default", { month: "long" });

        let datesHTML = "";

        for (let i = firstDayIndex; i > 0; i--) {
            const prevDate = new Date(current_year, current_month, 0 - i + 1);
            datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
        }

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(current_year, current_month, i);
            let activeClass = "";

            if (date.toDateString() === search_date.toDateString()) {
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
            const nextDate = new Date(current_year, current_month + 1, i);
            datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
        }

        let season = "";

        if (search_date >= seasons.winter || search_date < seasons.spring) {
            season = "Winter";
        } else if (search_date >= seasons.spring && search_date < seasons.summer) {
            season = "Spring";
        } else if (search_date >= seasons.summer && search_date < seasons.autumn) {
            season = "Summer";
        } else if (search_date >= seasons.autumn && search_date < seasons.winter) {
            season = "Autumn";
        }

        const n = Math.round((search_date - new Date(current_year, 0, 1)) / (1000 * 60 ** 2 * 24));
        const tilt = latitude - 23.45 * Math.sin((360 * (n - 81) * Math.PI) / (365 * 180));

        seasonTextElement.innerHTML = season;
        tiltTextElement.innerHTML = `${tilt.toFixed(1)}°`;

        datesElement.innerHTML = datesHTML;

        let allDates = document.querySelectorAll(".date");
        for (var i = 0; i < allDates.length; i++) {
            allDates[i].addEventListener("click", (e) => {
                if (e.target.classList.contains("inactive")) {
                    if (parseInt(e.target.innerHTML) >= 20) {
                        search_date = new Date(current_year, current_month - 1, e.target.innerHTML);
                        current_date.setMonth(current_date.getMonth() - 1);
                        updateCalendar();
                    } else {
                        search_date = new Date(current_year, current_month + 1, e.target.innerHTML);
                        current_date.setMonth(current_date.getMonth() + 1);
                        updateCalendar();
                    }
                } else {
                    search_date = new Date(current_year, current_month, parseInt(e.target.innerHTML));
                    updateCalendar();
                }
            });
        }
    };

    today_button.addEventListener("click", () => {
        current_date = new Date();
        search_date = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate());
        updateCalendar();
    });

    prev_month_button.addEventListener("click", () => {
        current_date.setMonth(current_date.getMonth() - 1);
        updateCalendar();
    });

    next_month_button.addEventListener("click", () => {
        current_date.setMonth(current_date.getMonth() + 1);
        updateCalendar();
    });

    updateCalendar();
});
