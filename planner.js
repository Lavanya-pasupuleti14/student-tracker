document.addEventListener("DOMContentLoaded", () => {

    function getTasks() {
        return JSON.parse(localStorage.getItem("student_tasks")) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem("student_tasks", JSON.stringify(tasks));
    }

    const dateInput = document.querySelector(".date-input");
    const titleInput = document.querySelector("input[type='text']");
    const notesInput = document.querySelector("textarea");
    const addBtn = document.querySelector(".primary-btn");

    // Set today by default
    dateInput.valueAsDate = new Date();

    addBtn.addEventListener("click", () => {
        if (!titleInput.value.trim()) {
            alert("Enter task title");
            return;
        }

        const tasks = getTasks();

        tasks.push({
            id: Date.now(),
            title: titleInput.value,
            notes: notesInput.value,
            date: dateInput.value,
            completed: false
        });

        saveTasks(tasks);

        // Clear inputs
        titleInput.value = "";
        notesInput.value = "";

        alert("Task added successfully");
    });
});
