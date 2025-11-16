// server.js (Node.js 서버 파일)
const express = require('express');
const https = require('axios'); 
const path = require('path');
const app = express();
const port = 3000;


const client_id = ''; /*공식 ID*/  
const client_secret = ''; /*공식 Secret*/

// 미들웨어 설정
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '.'))); 

// === API 호출 엔드포인트 ===
app.post('/route-data', async (req, res) => {
    const { start, end } = req.body;
    
    // 1. 주소 -> 좌표 변환 (Geocoding API 호출)
    const geocodeUrl = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(start)}&query=${encodeURIComponent(end)}`;
    
    try {
        // HTTP/HTTPS 요청 함수 (재사용 가능하도록 정의)
        const fetchNaverApi = (url) => {
            return new Promise((resolve, reject) => {
                const req = https.get(url, {
                    headers: {
                        'X-NCP-APIGW-API-KEY-ID': client_id,
                        'X-NCP-APIGW-API-KEY': client_secret
                    }
                }, (response) => {
                    let data = '';

                    // 응답 데이터 수신
                    response.on('data', (chunk) => {
                        data += chunk;
                    });

                    // 응답 완료
                    response.on('end', () => {
                        if (response.statusCode === 200) {
                            try {
                                resolve(JSON.parse(data));
                            } catch (e) {
                                reject(new Error('네이버 API 응답 파싱 오류'));
                            }
                        } else {
                            // 401 오류를 여기서 정확히 포착합니다.
                            reject(new Error(`API 통신 오류: 상태 코드 ${response.statusCode}, 응답: ${data}`));
                        }
                    });
                });

                req.on('error', (e) => {
                    reject(new Error(`서버 통신 오류: ${e.message}`));
                });

                req.end();
            });
        };

        // 1단계: Geocoding 호출 및 좌표 추출
        const geocodeData = await fetchNaverApi(geocodeUrl);

        if (!geocodeData.addresses || geocodeData.addresses.length < 2) {
             throw new Error("경로의 출발지 또는 도착지 좌표를 찾을 수 없습니다.");
        }
        
        const startCoords = geocodeData.addresses[0];
        const endCoords = geocodeData.addresses[1];
        const startX = startCoords.x;
        const startY = startCoords.y;
        const endX = endCoords.x;
        const endY = endCoords.y;
        
        // 2단계: Directions 호출 (자가용 길찾기)
        const privateCarUrl = `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${startX},${startY}&goal=${endX},${endY}&option=trafast`;
        
        const privateCarData = await fetchNaverApi(privateCarUrl);

        // 3단계: 데이터 파싱 및 가공 (기존 로직 유지)
        
        function msToTime(ms) {
            const totalMinutes = Math.floor(ms / (1000 * 60));
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            if (hours > 0) {
                return `${hours}시간 ${minutes}분`;
            }
            return `${minutes}분`;
        }
        
        const privateRoute = privateCarData.route.trafast[0].summary;
        const privateDurationMs = privateRoute.duration; 
        const privateTollFee = privateRoute.tollFee; 
        const publicDurationMs = Math.floor(privateDurationMs * 1.5); 
        const publicCost = Math.floor(privateTollFee / 3) + 1500; 

        const finalResult = {
            public_transport: {
                time: msToTime(publicDurationMs), cost: publicCost, transferCount: 1, timeMinutes: Math.floor(publicDurationMs / (1000 * 60))
            },
            private_car: {
                time: msToTime(privateDurationMs), cost: privateTollFee, congestion: "보통", timeMinutes: Math.floor(privateDurationMs / (1000 * 60))
            }
        };

        res.json(finalResult); 

    } catch (error) {
        // 401 오류가 발생하면, 이 로그에 정확한 응답 메시지가 출력될 것입니다.
        console.error('API 처리 중 치명적인 오류 발생:', error.message);
        res.status(500).json({ error: '경로 데이터를 가져오는 데 실패했습니다. 서버 로그를 확인하세요.' });
    }
});


app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});