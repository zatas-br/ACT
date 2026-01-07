document.addEventListener('DOMContentLoaded', () =>{
    const slidesEl = document.querySelector('.slides');
    const imgs = document.querySelectorAll('.slides img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const total = imgs.length;
    let index = 0;

    function updateCarrossel(){
        const offset = -index * 100;
        slidesEl.style.transform = `translateX(${offset}%)`;
    }

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + total) % total;
        updateCarrossel();
    });

    nextBtn.addEventListener('click', () => {
        index = (index + 1) % total;
        updateCarrossel();
    });

    setInterval(() => {
        index = (index + 1) % total;
        updateCarrossel();
    }, 5000);
});