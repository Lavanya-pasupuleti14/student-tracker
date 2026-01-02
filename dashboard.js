document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       SHOW TODAY DATE
    =============================== */
    const dateEl = document.getElementById("todayDate");
    if (dateEl) {
        dateEl.textContent = new Date().toDateString();
    }

    /* ===============================
       TASK DATABASE
    =============================== */
    function getTasks() {
        return JSON.parse(localStorage.getItem("student_tasks")) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem("student_tasks", JSON.stringify(tasks));
    }

    /* ===============================
       DASHBOARD TASKS (TODAY)
    =============================== */
    const todayTasksDiv = document.getElementById("todayTasks");
    const totalEl = document.getElementById("totalTasks");
    const completedEl = document.getElementById("completedTasks");
    const pendingEl = document.getElementById("pendingTasks");
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    function renderDashboardTasks() {
        if (!todayTasksDiv) return;

        const today = new Date().toISOString().split("T")[0];
        const allTasks = getTasks();
        const tasks = allTasks.filter(t => t.date === today);

        todayTasksDiv.innerHTML = "";
        let completedCount = 0;

        if (tasks.length === 0) {
            todayTasksDiv.innerHTML = "<p class='muted-text'>No tasks for today</p>";
        }

        tasks.forEach(task => {
            if (task.completed) completedCount++;

            const div = document.createElement("div");
            div.className = "task-item";

            div.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span>${task.title}</span>
            `;

            const checkbox = div.querySelector("input");
            checkbox.addEventListener("change", () => {
                const idx = allTasks.findIndex(t => t.id === task.id);
                if (idx !== -1) {
                    allTasks[idx].completed = checkbox.checked;
                    saveTasks(allTasks);
                    renderDashboardTasks();
                }
            });

            todayTasksDiv.appendChild(div);
        });

        totalEl.textContent = tasks.length;
        completedEl.textContent = completedCount;
        pendingEl.textContent = tasks.length - completedCount;

        const percent = tasks.length === 0
            ? 0
            : Math.round((completedCount / tasks.length) * 100);

        progressFill.style.width = percent + "%";
        progressText.textContent = `${percent}% Completed`;
    }

    renderDashboardTasks();

    /* ===============================
       SLEEP DATABASE
    =============================== */
    function getSleepData() {
        return JSON.parse(localStorage.getItem("student_sleep")) || {};
    }

    function saveSleepData(data) {
        localStorage.setItem("student_sleep", JSON.stringify(data));
    }

    /* ===============================
       SAVE SLEEP TIME
    =============================== */
    const sleepInput = document.getElementById("sleepTime");
    const saveSleepBtn = document.getElementById("saveSleep");

    if (saveSleepBtn && sleepInput) {
        saveSleepBtn.addEventListener("click", () => {
            if (!sleepInput.value) {
                alert("Please select sleep time");
                return;
            }

            const today = new Date().toISOString().split("T")[0];
            const data = getSleepData();
            data[today] = sleepInput.value;
            saveSleepData(data);

            renderSleep();
        });
    }

    /* ===============================
       SLEEP LINE GRAPH (7 DAYS)
    =============================== */
    function renderSleep() {
        const svg = document.getElementById("sleepLineGraph");
        if (!svg) return;

        svg.innerHTML = "";

        const sleepData = getSleepData();
        const today = new Date();

        const container = svg.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("preserveAspectRatio", "none");

        const padding = 30;
        const maxHours = 12;
        const stepX = (width - padding * 2) / 6;

        let path = "";

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split("T")[0];

            let hours = 0;
            if (sleepData[key]) {
                const [h, m] = sleepData[key].split(":").map(Number);
                hours = Math.min(h + m / 60, maxHours);
            }

            const x = padding + (6 - i) * stepX;
            const y = height - padding - (hours / maxHours) * (height - padding * 2);

            path += path ? ` L ${x} ${y}` : `M ${x} ${y}`;

            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("cx", x);
            dot.setAttribute("cy", y);
            dot.setAttribute("r", 5);
            dot.setAttribute("fill", "#6b5cff");
            svg.appendChild(dot);
        }

        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEl.setAttribute("d", path);
        pathEl.setAttribute("stroke", "#cdb4db");
        pathEl.setAttribute("stroke-width", "3");
        pathEl.setAttribute("fill", "none");

        svg.appendChild(pathEl);
    }

    renderSleep();
    window.addEventListener("resize", renderSleep);
});
