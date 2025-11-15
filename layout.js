// 1. 필요한 HTML 요소들을 가져옵니다.
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileNav = document.querySelector('.mobile-nav');

// 2. 햄버거 버튼을 클릭했을 때의 동작을 정의합니다.
if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
        // mobile-nav 요소에 'is-active' 클래스를 붙였다 뗐다 합니다.
        mobileNav.classList.toggle('is-active');
    });
}