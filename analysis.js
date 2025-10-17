// --- 0. 추천 경로 데이터베이스 (DB) ---
// 각 여행 경로에 어떤 성향(type)이 어울리는지 태그를 달아줍니다.
const recommendationDB = [
    {
        type: "healing",
        image: "https://images.unsplash.com/photo-1590428543922-1f95342a7891?q=80&w=2070&auto=format&fit=crop",
        tags: ["#힐링여행", "#오션뷰"],
        title: "오션뷰 힐링, 부산 완전 정복 코스",
        cost: "약 45만원",
        duration: "2박 3일"
    },
    {
        type: "photo",
        image: "https://images.unsplash.com/photo-1582234252648-c22f1d91a998?q=80&w=1939&auto=format&fit=crop",
        tags: ["#사진맛집", "#골목투어"],
        title: "인생샷 보장! 감성 골목 투어 코스",
        cost: "약 25만원",
        duration: "1박 2일"
    },
    {
        type: "food",
        image: "https://images.unsplash.com/photo-1552599623-a7c85ff30310?q=80&w=1974&auto=format&fit=crop",
        tags: ["#식도락", "#시장투어"],
        title: "부산의 맛! 시장 먹거리 탐방 코스",
        cost: "약 20만원",
        duration: "1박 2일"
    },
    {
        type: "activity",
        image: "https://images.unsplash.com/photo-1618892408829-548624d603a2?q=80&w=2070&auto=format&fit=crop",
        tags: ["#액티비티", "#해양스포츠"],
        title: "짜릿함 가득! 해양 스포츠 체험 코스",
        cost: "약 50만원",
        duration: "2박 3일"
    }
    // TODO: 여기에 더 많은 추천 경로 데이터를 추가할 수 있습니다.
];


// --- 1. 데이터 분석 로직 (성향 점수 계산) ---

// 페이지가 로드되자마자 실행되는 메인 함수
document.addEventListener('DOMContentLoaded', () => {
    // 로컬 스토리지에서 사용자의 설문 답변을 가져옴
    const userAnswers = JSON.parse(localStorage.getItem('surveyResults'));

    // 만약 답변이 없으면, 설문 페이지로 돌려보냄 (예외 처리)
    if (!userAnswers) {
        alert("분석할 설문 결과가 없습니다. 설문조사를 먼저 진행해주세요.");
        window.location.href = 'survey.html';
        return;
    }

    // 각 성향별 점수를 저장할 객체
    const scores = {
        healing: 0,      // 휴식, 힐링
        activity: 0,     // 활동, 액티비티
        photo: 0,        // 사진, 감성
        food: 0,         // 식도락, 맛집
        culture: 0,      // 역사, 문화
        shopping: 0      // 쇼핑, 트렌드
    };

    // 각 질문의 답변에 따라 성향 점수를 부여하는 규칙
    // (질문 1: 분위기)
    if (userAnswers[0].includes("조용하고 여유로운")) scores.healing += 10;
    if (userAnswers[0].includes("활기차고 신나는")) scores.activity += 10;
    if (userAnswers[0].includes("예쁜 사진")) scores.photo += 10;
    if (userAnswers[0].includes("맛집을 탐방")) scores.food += 10;
    
    // (질문 8: 테마)
    if (userAnswers[7].includes("역사/문화")) scores.culture += 10;
    if (userAnswers[7].includes("자연 속 힐링")) scores.healing += 10;
    if (userAnswers[7].includes("쇼핑과 카페")) scores.shopping += 10;
    if (userAnswers[7].includes("예술/전시")) scores.culture += 5;
    if (userAnswers[7].includes("야경 감상")) scores.photo += 5;

    // (질문 10: 맛집)
    if (userAnswers[9].includes("로컬 맛집")) scores.food += 10;
    if (userAnswers[9].includes("감성 맛집")) { scores.food += 5; scores.photo += 5; }
    if (userAnswers[9].includes("가성비")) scores.food += 5;

    // 최종 분석 결과를 바탕으로 화면에 리포트를 생성
    generateReport(scores);
});


// --- 2. 분석 결과를 화면에 그려주는 함수들 ---

function generateReport(scores) {
    // 가장 높은 점수를 받은 성향 찾기
    let highestScore = 0;
    let primaryType = '';
    for (const type in scores) {
        if (scores[type] > highestScore) {
            highestScore = scores[type];
            primaryType = type;
        }
    }

    // 성향 타입에 따른 제목과 설명 정의
    const typeDetails = {
        healing: { title: "여유로운 힐링 여행가", description: "당신은 복잡한 일상에서 벗어나 조용한 곳에서 재충전하는 것을 즐기는군요. 아름다운 자연 풍경 속에서 느긋하게 시간을 보내는 것을 추천합니다." },
        activity: { title: "에너제틱한 액티비티 전문가", description: "당신은 정적인 휴식보다는 직접 몸으로 부딪히며 새로운 것을 경험하는 데서 큰 즐거움을 느끼는군요. 당신의 심장을 뛰게 할 활기찬 활동들을 추천합니다." },
        photo: { title: "순간을 기록하는 감성 사진가", description: "당신에게 여행은 곧 '인생샷'이군요. 아름다운 배경과 독특한 분위기가 있는 곳이라면 어디든 달려갈 준비가 되어있습니다. 당신의 갤러리를 채워줄 명소들을 추천합니다." },
        food: { title: "미식의 즐거움을 아는 식도락가", description: "당신에게 여행의 가장 큰 즐거움은 바로 '음식'이군요. 현지인만 아는 로컬 맛집부터 분위기 좋은 레스토랑까지, 당신의 입을 즐겁게 해줄 코스를 추천합니다." },
        culture: { title: "지적인 탐험을 즐기는 문화 탐방가", description: "당신은 도시의 역사와 문화를 깊이 이해하는 여행을 선호하는군요. 박물관, 유적지, 예술 공간을 둘러보며 지적인 만족감을 채울 수 있는 코스를 추천합니다." },
        shopping: { title: "트렌드를 놓치지 않는 쇼핑 마스터", description: "당신은 최신 유행과 개성 있는 아이템을 찾아내는 데에서 여행의 즐거움을 느끼는군요. 당신의 쇼핑 욕구를 충족시켜줄 핫한 장소들을 추천합니다." },
        default: { title: "균형잡힌 멀티플레이어", description: "당신은 다양한 스타일의 여행을 모두 즐길 줄 아는군요! 어느 한쪽에 치우치지 않아 어떤 여행이든 만족할 준비가 되어있습니다."}
    };

    // 결과에 맞는 제목과 설명 선택
    const resultDetails = typeDetails[primaryType] || typeDetails.default;

    // HTML 요소에 결과 표시
    document.getElementById('user-type-title').textContent = `당신은 「${resultDetails.title}」 타입!`;
    document.getElementById('report-text').textContent = resultDetails.description;
    
    // 차트 생성
    drawChart(scores);

    // ▼▼▼ 여기가 수정/추가된 부분입니다 ▼▼▼
    // 분석된 성향에 맞는 추천 경로를 화면에 표시
    displayRecommendations(primaryType);
}

// 간단한 막대 차트를 그리는 함수
function drawChart(scores) {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = ''; // 기존 차트 내용 삭제
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    // 점수가 0이면 차트를 그리지 않음
    if (totalScore === 0) {
        chartContainer.innerHTML = '<p>분석된 활동 데이터가 없습니다.</p>';
        return;
    }

    // 점수가 높은 순으로 정렬
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    sortedScores.forEach(([type, score]) => {
        if (score > 0) {
            const percentage = (score / totalScore) * 100;
            const barWrapper = document.createElement('div');
            barWrapper.className = 'chart-bar-wrapper';
            
            const typeName = { healing: '휴식', activity: '활동', photo: '사진', food: '맛집', culture: '문화', shopping: '쇼핑' }[type];

            barWrapper.innerHTML = `
                <div class="bar-label">${typeName}</div>
                <div class="bar">
                    <div class="bar-inner" style="width: ${percentage}%;"></div>
                </div>
                <div class="bar-percentage">${Math.round(percentage)}%</div>
            `;
            chartContainer.appendChild(barWrapper);
        }
    });
}

// ▼▼▼ 새로 추가된 함수입니다 ▼▼▼
// 추천 경로 카드를 생성하고 화면에 표시하는 함수
function displayRecommendations(userType) {
    const cardContainer = document.getElementById('recommend-cards');
    cardContainer.innerHTML = ''; // 기존 카드 내용 삭제

    // DB에서 사용자의 성향(type)과 일치하는 경로들을 모두 찾음
    const matchedCourses = recommendationDB.filter(course => course.type === userType);

    // 일치하는 경로가 없으면 기본 추천을 보여줌 (예외 처리)
    if (matchedCourses.length === 0) {
        matchedCourses.push(recommendationDB[0]); // 첫 번째 경로를 기본값으로 보여줌
    }

    // 찾은 경로들을 화면에 카드 형태로 그려줌
    matchedCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <div class="card-content">
                <div class="tags">
                    ${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <h3>${course.title}</h3>
                <div class="info">
                    <span>💰 예상 경비: ${course.cost}</span>
                    <span>🗓️ 추천 기간: ${course.duration}</span>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}