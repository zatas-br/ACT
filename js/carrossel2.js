document.addEventListener('DOMContentLoaded', () =>{
    const slidesEl = document.querySelector('.slides2');
    const imgs = document.querySelectorAll('.slides2 img');
    const total = imgs.length;
    let index = 0;

    function updateCarrossel(){
        const offset = -index * 100;
        slidesEl.style.transform = `translateX(${offset}%)`;
    }

    // autoplay with reset on manual navigation
    let interval = setInterval(() => {
        index = (index + 1) % total;
        updateCarrossel();
    }, 5000);

    const prevBtn = document.querySelector('.carrossel2 .prev2');
    const nextBtn = document.querySelector('.carrossel2 .next2');

    function goPrev(){
        index = (index - 1 + total) % total;
        updateCarrossel();
        resetInterval();
    }

    function goNext(){
        index = (index + 1) % total;
        updateCarrossel();
        resetInterval();
    }

    function resetInterval(){
        clearInterval(interval);
        interval = setInterval(() => {
            index = (index + 1) % total;
            updateCarrossel();
        }, 5000);
    }

    if(prevBtn) prevBtn.addEventListener('click', goPrev);
    if(nextBtn) nextBtn.addEventListener('click', goNext);
});