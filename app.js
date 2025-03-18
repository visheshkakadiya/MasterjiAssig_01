const moodButtons = document.querySelectorAll('.mood-btn');
const submitButton = document.getElementById('submitMood');
const moodHistory = document.getElementById('moodHistory');
const dateInput = document.getElementById('moodDate');
const calendarGrid = document.getElementById('calendarGrid');
const clearStorage = document.getElementById("clearStorage");

let selectedMood = null; 
let selectedEmo = null;

// Handle mood selection
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedMood = button.getAttribute('data-mood');
        selectedEmo = button.innerText;

        // Reset all buttons
        moodButtons.forEach(btn => btn.classList.remove("selected"));
        
        button.classList.add("selected");

        console.log("Selected Mood:", selectedMood);
    });
});

// Save mood for the selected date
submitButton.addEventListener('click', () => {
    const selectedDate = dateInput.value;

    if (!selectedDate) {
        alert('Please select a date first!');
        return;
    }

    let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];

    // Check if a mood already exists for this date
    const existingMood = moodLogs.find(log => log.date === selectedDate);

    if (existingMood) {
        alert("Mood already set for this date: " + existingMood.emo);
        return;
    }

    if (selectedMood) {
        moodLogs.push({ date: selectedDate, mood: selectedMood, emo: selectedEmo });

        localStorage.setItem('moodLogs', JSON.stringify(moodLogs));

        loadMoodHistory();
        generateCalendar();
    } else {
        alert('Please select mood')
    }

    // Reset selection
    selectedMood = null;
    selectedEmo = null;
    moodButtons.forEach(btn => btn.classList.remove("selected"));
});

// Load past moods
function loadMoodHistory() {
    let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    
    moodHistory.innerHTML = ""; 

    moodLogs.forEach(log => {
        const entry = document.createElement('p');
        entry.textContent = `${log.date}: ${log.mood} ${log.emo}`;
        moodHistory.appendChild(entry);
    });
}

// Generate a simple calendar with moods
function generateCalendar() {
    calendarGrid.innerHTML = ""; 

    let moodLogs = JSON.parse(localStorage.getItem("moodLogs")) || [];

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    let calendarHTML = "<table><tr>";

    for (let i = 0; i < firstDay; i++) {
        calendarHTML += "<td></td>";
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        let moodEntry = moodLogs.find(log => log.date === dateString);

        if (moodEntry) {
            calendarHTML += `<td class="mood-set">${day} <br> ${moodEntry.emo}</td>`;
        } else {
            calendarHTML += `<td>${day}</td>`;
        }

        if ((firstDay + day) % 7 === 0) {
            calendarHTML += "</tr><tr>";
        }
    }

    calendarHTML += "</tr></table>";
    calendarGrid.innerHTML = calendarHTML;
}

// Function to clear local storage
function clearStorageData() {
    localStorage.clear();
    moodHistory.innerHTML = "";  
    generateCalendar();  
}

// Attach event listener to the clear button
clearStorage.addEventListener('click', clearStorageData);

// Load everything on page start
window.onload = () => {
    loadMoodHistory();
    generateCalendar();
};
