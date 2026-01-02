document.addEventListener("DOMContentLoaded", () => {

    function getTasks() {
        return JSON.parse(localStorage.getItem("student_tasks")) || [];
    }

    const tableBody = document.getElementById("tasksTableBody");

    function formatDateLabel(dateStr) {
        const today = new Date();
        const date = new Date(dateStr);

        const diffDays = Math.floor(
            (date - new Date(today.toDateString())) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        return dateStr;
    }

    function renderTable() {
        const tasks = getTasks();
        tableBody.innerHTML = "";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);

        // Filter only today → next 7 days
        const upcomingTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= today && taskDate <= endDate;
        });

        if (upcomingTasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="2">No tasks for today or upcoming days</td>
                </tr>
            `;
            return;
        }

        // Group by date
        const grouped = {};
        upcomingTasks.forEach(task => {
            if (!grouped[task.date]) grouped[task.date] = [];
            grouped[task.date].push(task);
        });

        // Sort dates ascending (Today → future)
        const sortedDates = Object.keys(grouped).sort(
            (a, b) => new Date(a) - new Date(b)
        );

        sortedDates.forEach(date => {
            const tr = document.createElement("tr");

            const dateTd = document.createElement("td");
            dateTd.textContent = formatDateLabel(date);

            const tasksTd = document.createElement("td");

            grouped[date].forEach(task => {
                const tag = document.createElement("span");
                tag.className = `task-tag ${task.completed ? "completed" : "pending"}`;
                tag.textContent = task.title;

                tag.onclick = () => openModal(task.title, task.notes);

                tasksTd.appendChild(tag);
            });

            tr.appendChild(dateTd);
            tr.appendChild(tasksTd);
            tableBody.appendChild(tr);
        });
    }

    renderTable();

    // Modal handlers
    window.openModal = function(title, desc) {
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalDesc").textContent =
            desc || "No description provided";
        document.getElementById("taskModal").style.display = "flex";
    };

    window.closeModal = function() {
        document.getElementById("taskModal").style.display = "none";
    };
});
