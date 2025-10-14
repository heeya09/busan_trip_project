// --- 초기 설정 ---
// ▼▼▼ 핵심 수정: 임시 저장소에서 현재 여행 정보를 가져옵니다. ▼▼▼
const currentTrip = JSON.parse(sessionStorage.getItem('currentTrip'));

const tripTitle = document.getElementById('trip-title');
const dayTabsContainer = document.getElementById('day-tabs');
const tableBody = document.getElementById('table-body');
const dailySpentOutput = document.getElementById('daily-spent');
const dailyRemainingOutput = document.getElementById('daily-remaining');
const addBtn = document.getElementById('add-btn');
const modal = document.getElementById('add-modal');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');

let currentDay = 'Day 1';
let editingIndex = null;
let allExpenses = JSON.parse(localStorage.getItem('expenses')) || {};

// --- 함수 정의 ---

// 여행 기간을 계산하고 날짜 탭을 만드는 함수
function setupTripDetails() {
    if (!currentTrip) {
        alert("여행 정보를 찾을 수 없습니다. 목록으로 돌아갑니다.");
        window.location.href = 'trip_list.html';
        return;
    }

    tripTitle.textContent = currentTrip.name;

    const startDate = new Date(currentTrip.start);
    const endDate = new Date(currentTrip.end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    dayTabsContainer.innerHTML = '';
    for (let i = 1; i <= diffDays; i++) {
        const tab = document.createElement('button');
        tab.className = 'day-tab';
        tab.dataset.day = `Day ${i}`;
        tab.textContent = `Day ${i}`;
        if (i === 1) tab.classList.add('active');
        dayTabsContainer.appendChild(tab);
    }
    
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentDay = tab.dataset.day;
            renderTable();
        });
    });
}

// 지출 내역을 저장하는 함수
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(allExpenses));
}

// 화면을 그리는 함수
function renderTable() {
    tableBody.innerHTML = '';
    let totalSpent = 0;
    const dayExpenses = allExpenses[currentTrip.id]?.[currentDay] || [];

    dayExpenses.forEach((item, index) => {
        const newRow = document.createElement('div');
        newRow.classList.add('table-row');
        newRow.innerHTML = `
            <div>${item.category}</div>
            <div>₩ ${item.spent.toLocaleString()}</div>
            <div>${item.description}</div>
            <div class="actions">
                <button class="edit-btn" data-index="${index}">✏️</button>
                <button class="delete-btn" data-index="${index}">🗑️</button>
            </div>
        `;
        tableBody.appendChild(newRow);
        totalSpent += item.spent;
    });
    updateSummary(totalSpent);
}

function updateSummary(totalSpent) {
    const budget = 100000;
    dailySpentOutput.innerText = `₩ ${totalSpent.toLocaleString()}`;
    dailyRemainingOutput.innerText = `₩ ${(budget - totalSpent).toLocaleString()}`;
}

function openModal(index = null) {
    editingIndex = index;
    const dayExpenses = allExpenses[currentTrip.id]?.[currentDay] || [];
    const categoryInput = document.getElementById('item-category');
    const spentInput = document.getElementById('item-spent');
    const descriptionInput = document.getElementById('item-description');

    if (index !== null) {
        const item = dayExpenses[index];
        categoryInput.value = item.category;
        spentInput.value = item.spent;
        descriptionInput.value = item.description;
    } else {
        categoryInput.value = '';
        spentInput.value = '';
        descriptionInput.value = '';
    }
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// --- 이벤트 리스너 ---
saveBtn.addEventListener('click', () => {
    const category = document.getElementById('item-category').value;
    const spent = parseInt(document.getElementById('item-spent').value);
    const description = document.getElementById('item-description').value;

    if (!category || isNaN(spent)) {
        alert('항목과 지출액은 필수 입력 항목입니다.');
        return;
    }
    
    const newItem = { category, spent, description };
    
    if (!allExpenses[currentTrip.id]) allExpenses[currentTrip.id] = {};
    if (!allExpenses[currentTrip.id][currentDay]) allExpenses[currentTrip.id][currentDay] = [];
    
    if (editingIndex !== null) {
        allExpenses[currentTrip.id][currentDay][editingIndex] = newItem;
    } else {
        allExpenses[currentTrip.id][currentDay].push(newItem);
    }
    
    saveExpenses();
    closeModal();
    renderTable();
});

tableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.dataset.index;
        allExpenses[currentTrip.id][currentDay].splice(index, 1);
        saveExpenses();
        renderTable();
    }
    if (event.target.classList.contains('edit-btn')) {
        const index = event.target.dataset.index;
        openModal(index);
    }
});

addBtn.addEventListener('click', () => openModal());
cancelBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

// --- 초기 실행 ---
setupTripDetails();
renderTable();