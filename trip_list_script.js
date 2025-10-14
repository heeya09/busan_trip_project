// --- 요소 가져오기 ---
const addTripBtn = document.getElementById('add-trip-btn');
const modal = document.getElementById('add-trip-modal');
const cancelBtn = document.getElementById('cancel-trip-btn');
const saveBtn = document.getElementById('save-trip-btn');
const tripCardsContainer = document.getElementById('trip-cards');
const modalTitle = document.getElementById('modal-title');
const tripNameInput = document.getElementById('trip-name');
const startDateInput = document.getElementById('trip-start-date');
const endDateInput = document.getElementById('trip-end-date');

let editingCardId = null; // 수정 중인 카드의 고유 ID를 저장하는 변수

// --- 함수 정의 ---

// 저장된 여행 목록을 불러와 화면에 그리는 함수
function loadTrips() {
    tripCardsContainer.innerHTML = '';
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    
    trips.forEach(trip => {
        const newTripCard = document.createElement('div');
        newTripCard.classList.add('trip-card');
        newTripCard.dataset.tripId = trip.id; // 각 카드에 고유 ID를 부여합니다.

        newTripCard.innerHTML = `
            <div class="card-info">
                <h3>${trip.name}</h3>
                <p>${trip.start.replaceAll('-', '.')} ~ ${trip.end.replaceAll('-', '.')}</p>
            </div>
            <div class="card-actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
        tripCardsContainer.appendChild(newTripCard);
    });
}

// 현재 여행 목록을 브라우저에 저장하는 함수
function saveTrips(trips) {
    localStorage.setItem('trips', JSON.stringify(trips));
}

// 팝업창 열기/닫기
function openModal() { modal.style.display = 'flex'; }
function closeModal() {
    modal.style.display = 'none';
    editingCardId = null;
    tripNameInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
}

// 클릭 이벤트 처리 함수
function handleCardActions(event) {
    const target = event.target;
    const card = target.closest('.trip-card');
    if (!card) return; // 카드 바깥을 클릭했으면 무시
    
    const tripId = card.dataset.tripId;

    // --- 수정 기능 ---
    if (target.classList.contains('edit-btn')) {
        let trips = JSON.parse(localStorage.getItem('trips')) || [];
        const tripToEdit = trips.find(trip => trip.id == tripId);
        
        editingCardId = tripId;
        modalTitle.textContent = "여행 기록 수정";
        tripNameInput.value = tripToEdit.name;
        startDateInput.value = tripToEdit.start;
        endDateInput.value = tripToEdit.end;
        openModal();
    
    // --- 삭제 기능 ---
    } else if (target.classList.contains('delete-btn')) {
        if (confirm("정말로 이 여행 기록을 삭제하시겠습니까?")) {
            let trips = JSON.parse(localStorage.getItem('trips')) || [];
            const updatedTrips = trips.filter(trip => trip.id != tripId);
            saveTrips(updatedTrips);
            loadTrips(); // 화면 새로고침
        }

    // --- 상세 페이지로 이동 기능 ---
    } else if (target.closest('.card-info')) {
        let trips = JSON.parse(localStorage.getItem('trips')) || [];
        const clickedTrip = trips.find(trip => trip.id == tripId);
        sessionStorage.setItem('currentTrip', JSON.stringify(clickedTrip));
        window.location.href = `expense_calculator.html`;
    }
}

// --- 이벤트 리스너 설정 ---

// 새 여행 추가 버튼
addTripBtn.addEventListener('click', () => {
    modalTitle.textContent = "새 여행 기록";
    openModal();
});

// 팝업창 버튼들
cancelBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

// 팝업창 저장 버튼
saveBtn.addEventListener('click', () => {
    const tripName = tripNameInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!tripName || !startDate || !endDate) {
        alert('모든 항목을 입력해주세요.');
        return;
    }

    let trips = JSON.parse(localStorage.getItem('trips')) || [];

    if (editingCardId) { // 수정 모드
        const tripIndex = trips.findIndex(trip => trip.id == editingCardId);
        trips[tripIndex] = { ...trips[tripIndex], name: tripName, start: startDate, end: endDate };
    } else { // 추가 모드
        const newTrip = { id: Date.now(), name: tripName, start: startDate, end: endDate };
        trips.push(newTrip);
    }
    
    saveTrips(trips);
    loadTrips();
    closeModal();
});

// 모든 카드에 대한 클릭 이벤트를 한번에 관리 (이벤트 위임)
tripCardsContainer.addEventListener('click', handleCardActions);

// --- 페이지 첫 로드 시 실행 ---
loadTrips(); // 페이지가 열릴 때 저장된 여행 목록을 불러옵니다.