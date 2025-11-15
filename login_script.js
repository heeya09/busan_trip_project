// --- 1. 비밀번호 보기/숨기기 기능 ---
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePassword.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            togglePassword.textContent = '👁️';
        }
    });
}

// --- 2. '가짜' 로그인 기능 (테스트용) ---
const loginBtn = document.getElementById('login-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        // (나중에 여기에 한유지 님이 만든 '진짜' 서버 로그인 코드가 들어갑니다)

        // ▼▼▼ 이 부분이 수정되었습니다! ▼▼▼
        alert('로그인 성공! (테스트용)\n이제 여행 성향 설문조사를 시작합니다.');
        // 홈(index.html) 대신 설문조사(survey.html)로 바로 이동시킵니다.
        window.location.href = 'survey.html';
        // ▲▲▲ 여기까지 ▲▲▲
    });
}