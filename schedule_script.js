// --- 1. 요소 가져오기 ---
const timelines = document.querySelectorAll('.timeline');
const saveBtn = document.getElementById('save-schedule-btn');
const scheduleBoard = document.querySelector('.schedule-board');
const addBtns = document.querySelectorAll('.add-item-btn');

// 팝업창 요소
const modal = document.getElementById('schedule-modal');
const cancelBtn = document.getElementById('cancel-schedule-btn');
const saveItemBtn = document.getElementById('save-item-btn');
const itemTimeInput = document.getElementById('item-time-input');
const itemTitleInput = document.getElementById('item-title-input');

let editingElement = null; // 수정 중인 <li> 항목을 저장
let targetTimeline = null; // 현재 항목을 추가할 <ul> 타임라인

// --- 2. 초기 데이터 (샘플) ---
const initialSample = {
    'day1-timeline': [
        { time: "10:00", title: "해운대 해수욕장" },
        { time: "12:30", title: "돼지국밥 점심" },
        { time: "02:00", title: "동백섬 산책" }
    ],
    'day2-timeline': [
        { time: "11:00", title: "감천 문화 마을" },
        { time: "02:00", title: "국제 시장 (점심)" }
    ]
};

// --- 3. 공통 함수 ---

// 일정 항목 HTML을 만드는 함수
function createItemHTML(item) {
    const li = document.createElement('li');
    li.className = 'timeline-item';
    li.draggable = true;
    li.innerHTML = `
        <div class="item-time">${item.time}</div>
        <div class="item-title">${item.title}</div>
        <div class="item-drag-handle">::</div>
    `;
    return li;
}

// 데이터를 브라우저 메모리에서 읽어와 화면을 그리는 함수
function loadSchedule() {
    // LocalStorage에서 데이터를 읽거나, 없으면 초기 샘플을 사용합니다.
    const savedData = JSON.parse(localStorage.getItem('mySchedule')) || initialSample;
    
    // 타임라인들을 초기화하고 새로 그립니다.
    timelines.forEach(timeline => {
        timeline.innerHTML = '';
        const id = timeline.id;
        
        if (savedData[id]) {
            savedData[id].forEach(item => {
                timeline.appendChild(createItemHTML(item));
            });
        }
    });
}

// 현재 화면의 일정을 브라우저 메모리에 저장하는 함수
function saveSchedule() {
    const dataToSave = {};
    
    timelines.forEach(timeline => {
        const id = timeline.id;
        const items = [];
        timeline.querySelectorAll('.timeline-item').forEach(item => {
            const time = item.querySelector('.item-time').textContent;
            const title = item.querySelector('.item-title').textContent;
            items.push({ time, title });
        });
        dataToSave[id] = items;
    });

    localStorage.setItem('mySchedule', JSON.stringify(dataToSave));
}

// 팝업창 열기
function openModal(item = null) {
    if (item) { // 수정 모드: 기존 항목의 내용을 채움
        itemTimeInput.value = item.querySelector('.item-time').textContent;
        itemTitleInput.value = item.querySelector('.item-title').textContent;
    } else { // 추가 모드: 입력창 비우기
        itemTimeInput.value = '';
        itemTitleInput.value = '';
    }
    modal.style.display = 'flex';
}

// 팝업창 닫기
function closeModal() {
    modal.style.display = 'none';
    editingElement = null; // 수정 상태 초기화
}


// --- 4. 이벤트 리스너 설정 ---

// 드래그 앤 드롭 기능
scheduleBoard.addEventListener('dragstart', (event) => {
    if (event.target.classList.contains('timeline-item')) {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.target.classList.add('dragging');
    }
});
scheduleBoard.addEventListener('dragend', (event) => {
    if (event.target.classList.contains('timeline-item')) {
        event.target.classList.remove('dragging');
        saveSchedule(); // 드래그가 끝나면 순서를 저장
    }
});
timelines.forEach(timeline => {
    timeline.addEventListener('dragover', (event) => {
        event.preventDefault(); 
        const draggingItem = document.querySelector('.dragging');
        if (!draggingItem) return;
        const afterElement = getDragAfterElement(timeline, event.clientY);
        if (afterElement == null) {
            timeline.appendChild(draggingItem);
        } else {
            timeline.insertBefore(draggingItem, afterElement);
        }
    });
});

function getDragAfterElement(timeline, y) {
    const draggableElements = [...timeline.querySelectorAll('.timeline-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// [일정 저장] 버튼
saveBtn.addEventListener('click', () => {
    saveSchedule();
    alert('일정이 (브라우저에) 임시 저장되었습니다! (F5를 눌러 확인 가능)');
});

// [항목 추가] 버튼 (add-item-btn)
addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        targetTimeline = document.getElementById(btn.dataset.timelineId);
        openModal(null); // 새 항목 추가 모드
    });
});

// ▼▼▼ [항목 수정] (클릭 이벤트) - 이게 핵심입니다. ▼▼▼
scheduleBoard.addEventListener('click', (event) => {
    const target = event.target;
    const item = target.closest('.timeline-item');
    if (item && !target.classList.contains('item-drag-handle')) { // 드래그 핸들 클릭은 무시
        editingElement = item;
        openModal(item); // 수정 모드
        targetTimeline = item.closest('.timeline');
    }
});

// [취소] 버튼
cancelBtn.addEventListener('click', closeModal);

// [저장] 버튼 (추가 및 수정 처리)
saveItemBtn.addEventListener('click', () => {
    const time = itemTimeInput.value;
    const title = itemTitleInput.value;

    if (!time || !title) {
        alert('시간과 장소/활동 제목은 필수 입력 항목입니다.');
        return;
    }

    if (editingElement) {
        // 수정 모드: 기존 항목의 내용만 변경
        editingElement.querySelector('.item-time').textContent = time;
        editingElement.querySelector('.item-title').textContent = title;
    } else {
        // 추가 모드: 새 항목 생성 및 타임라인에 추가
        const newItem = { time, title };
        targetTimeline.appendChild(createItemHTML(newItem));
    }
    
    // 변경 사항 저장 및 팝업 닫기
    saveSchedule();
    closeModal();
});


// --- 5. 초기 실행 ---
loadSchedule();