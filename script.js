// 질문 목록 데이터 (장기 여행 및 1일 예산 기준 최종 반영!)
const questions = [
    {
        question: "선호하는 여행 분위기는?",
        options: ["🚶‍♀️ 조용하고 여유로운 휴식", "🎉 활기차고 신나는 액티비티", "📸 예쁜 사진을 남길 수 있는 명소", "🍔 현지 맛집을 탐방하는 식도락"]
    },
    {
        question: "누구와 함께 떠나시나요?",
        options: ["🙋‍♀️ 혼자", "🧑‍🤝‍🧑 친구와", "💕 연인과", "👨‍👩‍👧 가족과 함께 (아이 미포함)", "👨‍👩‍👧‍👦 가족과 함께 (아이 포함)"]
    },
    {
        question: "여행 인원은 몇 명인가요?",
        options: ["1️⃣ 1명", "2️⃣ 2명", "4️⃣ 3~4명", "👨‍👩‍👧‍👦 5명 이상"]
    },
    {
        question: "여행 기간은 얼마나 되나요?",
        options: ["☀️ 당일치기", "🌙 1박 2일", "🗓️ 2박 3일", "🧳 일주일 (4~7일)", "✈️ 2주일 (8~14일)", "🗺️ 3주일 (15~21일)", "🏝️ 한 달 이상"]
    },
    {
        question: "하루에 사용하실 1인 예산은 어느 정도인가요? (숙박비 제외)",
        options: ["💵 3만원 이하 (알뜰 식사/교통)", "💰 3만원 ~ 5만원 (기본 식사 + 카페)", "💸 5만원 ~ 10만원 (맛집 탐방 + 약간의 쇼핑)", "💎 10만원 ~ 20만원 (고급 레스토랑 + 체험/액티비티)", "💳 20만원 이상 (하고 싶은 거 다 하는 플렉스)"]
    },
    {
        question: "주요 교통수단은 무엇인가요?",
        options: ["🚌 대중교통 (버스/지하철)", "🚗 자가용", "🚕 택시 / 렌터카", "👟 도보 위주"]
    },
    {
        question: "특별히 피하고 싶은 요소가 있나요?",
        options: ["👨‍👩‍👧‍👦 사람이 너무 많은 곳", "🥵 많이 걸어야 하는 곳", "💳 비용이 비싼 곳", "🕒 웨이팅이 긴 맛집"]
    },
    {
        question: "이번 여행에서 가장 기대하는 '테마'는 무엇인가요?",
        options: ["🏛️ 역사/문화 유적 탐방", "🌳 자연 속 힐링", "🛍️ 트렌디한 쇼핑과 카페 투어", "🎨 예술/전시 경험", "🌙 아름다운 야경 감상"]
    },
    {
        question: "선호하는 여행 '템포'는 어떤 스타일인가요?",
        options: ["😌 느긋하게 한두 곳을 깊이 즐기는 타입", "🏃‍♂️ 알차게 여러 곳을 최대한 많이 둘러보는 타입"]
    },
    {
        question: "어떤 '맛집'을 선호하세요?",
        options: ["👍 현지인만 아는 로컬 맛집", "✨ 분위기 좋은 감성 맛집", "💰 가성비 좋은 맛집"]
    }
];

// --- ▼▼▼ 여기가 수정/추가된 부분입니다 ▼▼▼ ---

// 필요한 HTML 요소들을 가져오기
const progressText = document.getElementById('progress-text');
const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null); // 사용자의 답변을 저장할 배열

// 특정 질문을 화면에 보여주는 함수
function showQuestion(index) {
    const currentQuestion = questions[index];
    progressText.innerText = `질문 ${index + 1}/${questions.length}`;
    questionTitle.innerText = currentQuestion.question;
    optionsContainer.innerHTML = ''; // 이전 선택지 삭제

    // 새로운 선택지 버튼 생성
    currentQuestion.options.forEach(optionText => {
        const button = document.createElement('button');
        button.innerText = optionText;
        button.classList.add('option-btn');
        
        // 이전에 선택한 답변이 있다면 'selected' 스타일을 적용
        if (userAnswers[index] === optionText) {
            button.classList.add('selected');
        }

        button.addEventListener('click', (event) => {
            document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
            // 클릭 즉시 답변을 배열에 저장
            userAnswers[index] = event.target.innerText;
        });
        optionsContainer.appendChild(button);
    });

    // 버튼 상태 관리
    prevBtn.style.display = (index === 0) ? 'none' : 'block';
    nextBtn.innerText = (index === questions.length - 1) ? '결과 보기' : '다음';
}

// '다음' 버튼 클릭 이벤트
nextBtn.addEventListener('click', () => {
    // 현재 질문에 대한 답변을 선택했는지 확인
    if (userAnswers[currentQuestionIndex] === null) {
        alert('답변을 선택해주세요!');
        return; // 답변을 선택하지 않았으면 넘어가지 않음
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        // 마지막 질문에서 '결과 보기'를 누르면
        // 로컬 스토리지에 최종 답변 배열을 저장
        localStorage.setItem('surveyResults', JSON.stringify(userAnswers));
        // 결과 페이지로 이동
        window.location.href = 'result.html';
    }
});

// '이전' 버튼 클릭 이벤트
prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
});

// 첫 번째 질문 보여주며 시작
showQuestion(currentQuestionIndex);
