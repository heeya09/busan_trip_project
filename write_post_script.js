// --- 요소 가져오기 ---
const tagInput = document.getElementById('post-tags');
const tagList = document.getElementById('tag-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

let tags = []; // 입력된 태그들을 저장할 배열

// --- 함수 정의 ---

// 태그를 화면에 그려주는 함수
function renderTags() {
    tagList.innerHTML = ''; // 기존 태그들을 지웁니다.
    tags.forEach((tag, index) => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `
            ${tag}
            <button class="remove-tag-btn" data-index="${index}">x</button>
        `;
        tagList.appendChild(tagElement);
    });
}

// --- 이벤트 리스너 설정 ---

// 태그 입력 칸에서 키를 눌렀을 때의 동작
tagInput.addEventListener('keyup', (event) => {
    // 'Enter' 키나 '스페이스바'를 눌렀을 때
    if (event.key === 'Enter' || event.key === ' ') {
        const newTag = tagInput.value.trim().replace('#', ''); // 입력값 정리
        if (newTag && !tags.includes(newTag)) { // 태그가 비어있지 않고, 중복되지 않으면
            tags.push(newTag); // 태그 배열에 추가
            renderTags(); // 화면에 다시 그리기
        }
        tagInput.value = ''; // 입력 칸 비우기
    }
});

// 태그 삭제 버튼 클릭 이벤트 (이벤트 위임)
tagList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-tag-btn')) {
        const index = event.target.dataset.index;
        tags.splice(index, 1); // 배열에서 해당 태그 삭제
        renderTags(); // 화면에 다시 그리기
    }
});

// '등록하기' 버튼 클릭 이벤트
submitBtn.addEventListener('click', () => {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }

    // 나중에는 이 데이터를 서버로 전송하게 됩니다.
    alert('🎉 여행기가 성공적으로 등록되었습니다!');
    window.location.href = 'community.html'; // 등록 후 게시판 목록으로 이동
});

// '취소' 버튼 클릭 이벤트
cancelBtn.addEventListener('click', () => {
    if (confirm("작성을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
        window.location.href = 'community.html'; // 게시판 목록으로 이동
    }
});
// ===== ▼ 자동으로 늘어나는 글상자 기능 코드 ▼ =====

// 내용 입력 칸(textarea) 요소를 가져옵니다.
const contentTextarea = document.getElementById('post-content');

// 글상자에 무언가 입력될 때마다 이 함수가 실행됩니다.
contentTextarea.addEventListener('input', () => {
    // 높이를 잠시 초기화해서, 현재 내용에 필요한 실제 높이를 계산할 준비를 합니다.
    contentTextarea.style.height = 'auto';
    // 스크롤을 포함한 실제 내용의 높이를 계산해서, 그 높이를 글상자의 새 높이로 지정합니다.
    contentTextarea.style.height = contentTextarea.scrollHeight + 'px';
});