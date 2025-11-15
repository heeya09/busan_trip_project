// --- 요소 가져오기 ---
const tagInput = document.getElementById('diary-tags');
const tagList = document.getElementById('tag-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const titleInput = document.getElementById('diary-title');
const contentTextarea = document.getElementById('diary-content');

let tags = [];

// --- 함수 정의 ---

// 태그를 화면에 그려주는 함수
function renderTags() {
    tagList.innerHTML = '';
    tags.forEach((tag, index) => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag-item');
        tagElement.innerHTML = `
            #${tag}
            <button class="remove-tag" data-index="${index}">x</button>
        `;
        tagList.appendChild(tagElement);
    });
}

// --- 이벤트 리스너 설정 ---

// 태그 입력 칸에서 키를 눌렀을 때의 동작
tagInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        const newTag = tagInput.value.trim().replace('#', '');
        if (newTag && !tags.includes(newTag)) {
            tags.push(newTag);
            renderTags();
        }
        tagInput.value = '';
    }
});

// 태그 삭제 버튼 클릭 이벤트
tagList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-tag')) {
        const index = event.target.dataset.index;
        tags.splice(index, 1);
        renderTags();
    }
});

// '저장하기' 버튼 클릭 이벤트 (가짜 등록)
submitBtn.addEventListener('click', () => {
    const title = titleInput.value;
    const content = contentTextarea.value;

    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }

    // (나중에 한유지 님이 이 데이터를 서버로 전송합니다.)
    alert('✅ 개인 다이어리가 임시 저장되었습니다. (서버 미연동)');
    window.location.href = 'trip_list.html'; // 목록으로 돌아가기
});

// '취소' 버튼 클릭 이벤트
cancelBtn.addEventListener('click', () => {
    if (confirm("작성을 취소하시겠습니까?")) {
        window.location.href = 'trip_list.html';
    }
});

// --- 초기 실행 ---

// 내용 입력 칸 높이 자동 조절 기능 (우리가 이전에 구현했던 기능입니다)
contentTextarea.addEventListener('input', () => {
    contentTextarea.style.height = 'auto';
    contentTextarea.style.height = contentTextarea.scrollHeight + 'px';
});