// transport_script.js

// --- 1. 경로 선택 기능 (API 호출 트리거) ---
const selectBtn = document.querySelector('.select-btn');

if (selectBtn) {
    selectBtn.addEventListener('click', async () => {
        // 입력 필드에서 값을 읽어옵니다.
        const start = document.getElementById('start-location').value;
        const end = document.getElementById('end-location').value;
        
        if (!start || !end) {
            alert("출발지와 도착지를 모두 입력해주세요.");
            return;
        }

        await fetchAndDisplayRoute(start, end);
    });
}


// --- 2. 서버에서 API 데이터를 가져오는 핵심 함수 (API 호출 복원) ---
async function fetchAndDisplayRoute(startLocation, endLocation) {
    console.log(`경로 검색 시작: ${startLocation} -> ${endLocation}`);
    
    // 로딩 상태를 표시합니다.
    document.querySelector('.route-info').textContent = '경로 검색 중...';

    try {
        // 서버의 엔드포인트에 요청을 보냅니다.
        const response = await fetch('/route-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start: startLocation,
                end: endLocation
            })
        });

        if (!response.ok) {
            // 서버에서 500 오류가 발생했거나, 다른 HTTP 오류가 발생했을 때
            const errorText = await response.text();
            throw new Error(`서버 응답 오류: ${response.status} (${response.statusText}) - ${errorText.substring(0, 50)}...`);
        }

        const data = await response.json();
        
        console.log("API 응답 데이터:", data);

        // 3. HTML 데이터 업데이트
        updateTransportData(data);

        // 4. 시각화 (막대 그래프) 함수 호출
        drawComparisonChart(data);
        
        document.querySelector('.route-info').textContent = `출발: ${startLocation} ➡️ 도착: ${endLocation}`;
        alert('경로 검색 완료!');

    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        document.querySelector('.route-info').textContent = '⚠️ 경로 검색 실패. 서버 로그 및 API 설정을 확인하세요.';
        alert(`데이터를 가져오는 중 오류 발생: ${error.message}`);
    }
}

// --- 3. HTML 요소에 API 데이터로 업데이트하는 함수 ---
function updateTransportData(data) {
    const publicData = data.public_transport;
    const privateData = data.private_car;

    // 대중교통 카드 업데이트
    document.querySelector('.public-transport .time').textContent = publicData.time;
    document.querySelector('.public-transport .cost').textContent = `₩ ${publicData.cost.toLocaleString()}`;
    document.querySelector('.public-transport .count').textContent = publicData.transferCount + '회';

    // 자가용 카드 업데이트
    document.querySelector('.private-car .time').textContent = privateData.time;
    document.querySelector('.private-car .cost').textContent = `₩ ${privateData.cost.toLocaleString()}`;
    document.querySelector('.private-car .congestion').textContent = privateData.congestion; 
}


// --- 4. 소요 시간 막대 그래프 시각화 기능 ---
function drawComparisonChart(data) {
    const chartArea = document.querySelector('.chart-placeholder');
    
    // API에서 받은 '분' 단위 데이터를 사용합니다.
    const publicMinutes = data.public_transport.timeMinutes;
    const privateMinutes = data.private_car.timeMinutes; 
    const maxMinutes = Math.max(publicMinutes, privateMinutes, 1);

    chartArea.innerHTML = '';
    
    // 막대 그래프 생성 및 추가
    const publicBar = createBar('대중교통', publicMinutes, maxMinutes, '#007bff');
    const privateBar = createBar('자가용', privateMinutes, maxMinutes, '#ff9800');

    // 차트 영역에 스타일 적용 (JS에서만 적용)
    chartArea.style.display = 'flex';
    chartArea.style.justifyContent = 'space-around';
    chartArea.style.alignItems = 'flex-end';
    
    chartArea.appendChild(publicBar);
    chartArea.appendChild(privateBar);
    
    // 차트 레이블 추가
    chartArea.style.position = 'relative'; 
    chartArea.insertAdjacentHTML('afterbegin', '<p class="chart-unit">(단위: 분)</p>');
}

// 개별 막대를 생성하는 헬퍼 함수
function createBar(label, value, maxValue, color) {
    const heightPercentage = (value / maxValue) * 100;
    
    const barContainer = document.createElement('div');
    barContainer.classList.add('chart-bar-container');

    const barValue = document.createElement('div');
    barValue.textContent = `${value}분`;
    barValue.classList.add('bar-value');
    
    const barElement = document.createElement('div');
    barElement.classList.add('chart-bar');
    barElement.style.backgroundColor = color;
    // 높이를 비율에 맞춰 설정
    barElement.style.height = `${Math.max(10, heightPercentage)}%`; 
    // 애니메이션 효과를 위해 초기 높이를 0으로 설정하고, 로드 후 높이 적용
    setTimeout(() => {
        barElement.style.height = `${Math.max(10, heightPercentage)}%`;
    }, 100);


    const barLabel = document.createElement('div');
    barLabel.textContent = label;
    barLabel.classList.add('bar-label');

    barContainer.appendChild(barValue);
    barContainer.appendChild(barElement);
    barContainer.appendChild(barLabel);
    
    return barContainer;
}

// 페이지가 로드될 때 HTML에 이미 있는 초기 데이터로 그래프를 한번 그립니다.
// 하지만, 버튼을 눌러야 실제 API 데이터가 반영됩니다.
window.addEventListener('load', () => {
    // 초기에는 빈 데이터로 그래프를 그립니다. 버튼 클릭을 유도합니다.

});