const pictureContainer = document.querySelector('.picture-container');
let width;
const getWidth = () => {
    width = window.innerWidth;
}
getWidth();
// window.onresize = getWidth;

class Polaroids {
    constructor(picturePosition, className, randZIndex, index) {
        this.left = picturePosition;
        this.rotation = Math.floor(Math.random() * 360) + 1;
        this.splicePoint = Math.floor(Math.random() * images.length);
        this.yAxis = Math.floor(Math.random() * 60) - 30;
        this.polaroid = document.createElement('div');
        this.picture = document.createElement('div');
        this.pictureOverlay = document.createElement('div');

        const polaroid = this.polaroid;
        polaroid.classList.add('polaroid', `polaroid-${className}`);
        polaroid.style.left = this.left + 'px';
        polaroid.style.zIndex = randZIndex;
        polaroid.style.transform = `rotate(${this.rotation}deg) translateY(${this.yAxis}px)`;
        polaroid.setAttribute('draggable', false);
        polaroid.setAttribute('id', `picture${index}`)
        const picture = this.picture;
        picture.classList.add('picture');

        picture.style.backgroundImage = `url(images/${images.splice(this.splicePoint, 1)})`;
        const pictureOverlay = this.pictureOverlay;
        pictureOverlay.classList.add('picture-overlay');
        picture.appendChild(pictureOverlay);
        polaroid.appendChild(picture);
        pictureContainer.appendChild(polaroid);
    }
}

const images = ['branson-300.webp', 'boarding_pass-300.webp', 'brooklyn_bridge-300.webp', 'engine_pic-300.webp', 'departure_board-300.webp', 'flica-300.webp', 'flica2-300.webp', 'flight_deck-300.webp', 'full_side-300.webp', 'lincoln_memorial-300.webp', 'maui_coastline-300.webp', 'my_profile_picture-300.webp', 'on_the_plane-300.webp', 'philly_love-300.webp', 'side_of_plane-300.webp', 'cloudgate-300.webp', 'the_bridge_filtered-300.webp', 'the_kiss-300.webp', 'view_from_terminal-300.webp', 'wing_shot-300.webp']

let picturePosition = 0;

function makePictures(pictureWidth, className) {
    for (let i = 0; i < (width - 100) / pictureWidth; i++) {
        const randZIndex = Math.floor(Math.random() * 20) + 1;
        new Polaroids(picturePosition, className, randZIndex, i);
        picturePosition += 80;
    }
}

function transformPolaroids(picture) {
    picture.style.transform = 'rotate(0deg)';
    picture.style.top = '0';
    const pictureOverlay = picture.querySelector('.picture-overlay');
    pictureOverlay.style.transition = 'background 3s';
    pictureOverlay.style.backgroundColor = 'transparent';
}

const sm = 100, med = 150;

if (width <= 480) makePictures(sm, 'small');
else makePictures(med, 'medium');
// else makePictures(lg, 'large');

let pictureZIndex = 22, totalShakes = 0;
pictureContainer.addEventListener('click', function (e) {
    const picture = e.target.closest('.polaroid');
    if (!picture) return;
    let counter = 0;
    if (picture.getAttribute('draggable') === 'false') {
        if (totalShakes < 3) {
            const shake = setInterval(() => {
                if (picture) {
                    let randomDegree = Math.floor(Math.random() * 50) + 25;
                    let yAxis = Math.floor(Math.random() * 60) - 30;
                    let xAxis = Math.floor(Math.random() * 60) - 30;
                    if (counter % 2 === 0) randomDegree = -randomDegree;
                    picture.style.transform = `rotate(${randomDegree}deg) translateY(${yAxis}px) rotateX(${xAxis}deg)`;
                    if (counter === 6) {
                        clearInterval(shake);
                        transformPolaroids(picture)
                    }
                    counter++;
                }
            }, 200);
            totalShakes++;
        } else {
            transformPolaroids(picture)
        }
        console.log(picture.clientWidth)
        picture.style.width = `${window.innerWidth > 1440 ? '30%' : '40%'}`;
        const padAll = picture.offsetWidth;
        picture.style.padding = `${padAll * 0.07}px ${padAll * 0.07}px ${padAll * 0.24}px ${padAll * 0.07}px`
        picture.style.zIndex = pictureZIndex;
        pictureZIndex++;
        picture.setAttribute('draggable', true)
        picture.setAttribute('data-width', picture.offsetWidth * .75);
        picture.firstMove = true;
        // movePictures(picture);
    }
})


pictureContainer.addEventListener('dragstart', drag)
pictureContainer.addEventListener('dragover', allowDrop)
pictureContainer.addEventListener('drop', drop);

let prevTop, prevLeft, shiftY, shiftX, prevPageX, prevPageY;

function drag(e) {
    const item = e.target.closest('.polaroid');
    const container = e.target.closest('.picture-container');
    shiftX = e.clientX - item.getBoundingClientRect().left;
    shiftY = e.clientY - item.getBoundingClientRect().top;
    e.dataTransfer.setData("text", item.id);
    prevTop = item.style.top;
    prevLeft = item.style.left;
    prevPageX = e.pageX;
    prevPageY = e.pageY;

}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text');
    const item = document.getElementById(itemId);
    const itemWidth = item.dataset.width;
    item.style.width = `${itemWidth * 0.6}px`;
    const newWidth = itemWidth * 0.6;
    item.style.padding = `${newWidth * 0.07}px ${newWidth * 0.07}px ${newWidth * 0.24}px ${newWidth * 0.07}px`;
    if (item.firstMove === true) {
        item.style.top = `${parseInt(prevTop) + (e.pageY - prevPageY) + (shiftY * 0.55)}px`;
        item.style.left = `${parseInt(prevLeft) + (e.pageX - prevPageX) + (shiftX * 0.55)}px`
    } else {
        item.style.top = `${parseInt(prevTop) + (e.pageY - prevPageY)}px`;
        item.style.left = `${parseInt(prevLeft) + (e.pageX - prevPageX)}px`;
    }
    item.style.zIndex = pictureZIndex;
    pictureZIndex++;
    item.firstMove = false;
}
