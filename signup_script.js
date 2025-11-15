// --- 1. 비밀번호 보기/숨기기 기능 (비밀번호 칸) ---
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

// --- 2. 비밀번호 보기/숨기기 기능 (비밀번호 확인 칸) ---
const togglePasswordConfirm = document.getElementById('toggle-password-confirm');
const passwordConfirmInput = document.getElementById('password-confirm');

if (togglePasswordConfirm && passwordConfirmInput) {
    togglePasswordConfirm.addEventListener('click', () => {
        if (passwordConfirmInput.type === 'password') {
            passwordConfirmInput.type = 'text';
            togglePasswordConfirm.textContent = '🙈';
        } else {
            passwordConfirmInput.type = 'password';
            togglePasswordConfirm.textContent = '👁️';
        }
    });
}

// --- 3. 비밀번호 보안 등급 체크 기능 ---
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const feedbackText = document.getElementById('password-feedback');

if (passwordInput && strengthBar && strengthText && feedbackText) {
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let score = 0;
        let feedback = [];

        if (password.length === 0) {
            strengthBar.className = 'strength-bar';
            strengthText.textContent = '';
            feedbackText.textContent = '';
            return;
        }

        // 1. 길이 체크
        if (password.length >= 8) score++;
        else feedback.push('8자 이상이어야 합니다.');

        // 2. 숫자 체크
        if (/\d/.test(password)) score++;
        else feedback.push('숫자를 포함해야 합니다.');

        // 3. 영문 소문자 체크
        if (/[a-z]/.test(password)) score++;
        else feedback.push('영문 소문자를 포함해야 합니다.');
        
        // 4. 영문 대문자 체크
        if (/[A-Z]/.test(password)) score++;
        else feedback.push('영문 대문자를 포함해야 합니다.');
        
        // 5. 특수문자 체크
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        else feedback.push('특수문자를 포함해야 합니다.');

        // 점수에 따라 보안 등급 및 피드백 표시
        strengthBar.className = 'strength-bar'; // 초기화
        feedbackText.textContent = feedback.join(' '); // 피드백 문구는 항상 표시

        switch (score) {
            case 0:
            case 1:
            case 2:
                strengthBar.classList.add('weak');
                strengthText.textContent = '보안 수준: 낮음';
                strengthText.style.color = '#dc3545';
                break;
            case 3:
            case 4:
                strengthBar.classList.add('medium');
                strengthText.textContent = '보안 수준: 보통';
                strengthText.style.color = '#ffc107';
                break;
            case 5:
                strengthBar.classList.add('strong');
                strengthText.textContent = '보안 수준: 높음';
                strengthText.style.color = '#28a745';
                feedbackText.textContent = '완벽한 비밀번호입니다!';
                break;
        }
    });
}