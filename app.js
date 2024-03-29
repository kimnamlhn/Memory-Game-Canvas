function main() {

    //************************************KHAI BÁO CÁC BIẾN*********************************************** */
    //khai báo canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    //khoảng cách giữa các ảnh: 
    // khoảng cách chiều x = xDistanceImage - widthImage
    // khoảng cách chiều y = yDistanceImage - widthImage
    var xDistanceImage = 200;
    var yDistanceImage = 150;

    //chiều cao và độ rộng của ảnh 
    var heightImage = 130;
    var widthImage = 130;

    //biến kiểm tra số thẻ đã tìm được
    var foundCards = 0;

    //đếm các thẻ đang mở ra mà chưa có match với ảnh khác
    var openedCard = [];

    //biến lưu trữ danh sách các ảnh và thông itn
    var arr = [];

    //biến click để set chỗ nào được click hoặc không
    var click = false;


    //có phải màn hình restart
    var isWinScreen = false;

    //danh sách các âm thanh
    var musicList = [];

    //sự kiện khi click canvas
    window.addEventListener("click", onClickCanvas);

    //************************************HÀM VỀ ẢNH VÀ ÂM THANH*********************************************** */
    //load ảnh từ nguồn
    function loadImages() {
        var imgArr = ['1', '2', '3', '4', '5', '6', '7',
            '8', '9', '10', '1', '2', '3', '4', '5',
            '6', '7', '8', '9', '10'];

        // lấy các ảnh cho thẻ
        for (var col = 0; col < 5; col++) {
            arr[col] = [];
            for (var row = 0; row < 4; row++) {

                var startX = col * xDistanceImage;
                var startY = row * yDistanceImage;

                //lấy số ngẫu nhiên từ 1 đến chiều dài của mảng hình ảnh
                var randomIndex = Math.floor((Math.random() * imgArr.length - 1) + 1);

                //ảnh mặt trước và sau 
                var front = new Image();
                var back = new Image();
                var imageIndex = `${imgArr[randomIndex]}`;

                // load hình ảnh mặt trước và sau
                front.src = `./assets/images/symbol-${imageIndex}.jpg`;
                back.src = `./assets/images/backcard.png`;

                imgArr.splice(randomIndex, 1);

                arr[col][row] = {
                    name: imageIndex,
                    img: [front, back],
                    isOpened: false,
                    startPointX: startX,
                    startPointY: startY,
                };
            }
        }

        // lấy ảnh win 
        //winImage.src = `./assets/image/youarewin.jpg`;
    }

    //load nhạc từ nguồn
    function loadMusic() {
        musicList={
            backgroundAudio: document.getElementById("backgroundMusic"),
            audioWin: document.getElementById("gameWinMusic"),
            flipCardAudio: document.getElementById("flipCardMusic")        }
    }

    //mở nhạc khi mở ảnh
    function playOpenCardMusic() {
        musicList.flipCardAudio.pause();
        musicList.flipCardAudio.currentTime = 0;
        musicList.flipCardAudio.play();
    }

    //nhạc nền
    function playBackgroundMusic() {
        musicList.backgroundAudio.play();
        musicList.audioWin.pause();
        musicList.audioWin.currentTime = 0;
    }

    //nhạc chiến thắng
    function playWinAudio() {
        musicList.playWinAudio.currentTime = 0;
        musicList.audioWin.play();

    }
    //************************************CÁC HÀM VỀ GAME*********************************************** */

    //lấy vị trí chuột hiện tại
    function getPosCursor(e) {
        const offset = canvas.getBoundingClientRect();

        const x = e.clientX - offset.left;
        const y = e.clientY - offset.top;

        return [x, y];
    }

    //hàm khi click trong canvas
    function onClickCanvas(e) {
        var xPos = getPosCursor(e)[0];
        var yPos = getPosCursor(e)[1];

        var row, col;
        //nếu đang ở màn hình restart
        if (isWinScreen == true) {
            //nếu click button restart thì reload pages và chơi lại từ đầu

            location.reload();

            //nếu còn chơi và đang trong khu vực
            //xác định hàng, cột của hình ảnh đang click để mở
        } else if (click == true) {
            //col
            if (xPos < 130) {
                col = 0;
            }
            else if (xPos > 200 && xPos < 330) {
                col = 1;
            }
            else if (xPos > 400 && xPos < 530) {
                col = 2;
            }
            else if (xPos > 600 && xPos < 730) {
                col = 3;
            }
            else if (xPos > 800 && xPos < 930) {
                col = 4;
            }

            //row
            if (yPos < 130) {
                row = 0;
            }
            else if (yPos > 150 && yPos < 280) {
                row = 1;
            }
            else if (yPos > 300 && yPos < 430) {
                row = 2;
            }
            else if (yPos > 450 && yPos < 580) {
                row = 3;
            }



            //debuging
            // console.log(row);
            // console.log(col);
            // console.log(xPos);
            // console.log(yPos);
        }

        openCard(col, row);
    }


    //lật thẻ ảnh
    function openCard(col, row) {

        var obj = arr[col][row];
        if (obj.isOpened == false) {

            obj.isOpened = true;
            openedCard.push(obj);
            ctx.drawImage(obj.img[0], obj.startPointX, obj.startPointY, widthImage, heightImage);

            playOpenCardMusic();

            if (openedCard.length == 2) {
                let firstImage = openedCard[0];
                let secondImage = openedCard[1];

                if (firstImage.name == secondImage.name) {
                    foundCards += 2;

                    if (foundCards == 20) {
                        foundCards = 0;
                        setTimeout(() => gameWin(), 500);
                    }
                }
                else {
                    click = false;
                    setTimeout(() => closeCard(firstImage, secondImage), 500);
                }
                openedCard = [];
            }
        }
    }

    //đóng thẻ ảnh
    function closeCard(firstImage, secondImage) {

        ctx.drawImage(firstImage.img[1], firstImage.startPointX, firstImage.startPointY, widthImage, heightImage);
        ctx.drawImage(secondImage.img[1], secondImage.startPointX, secondImage.startPointY, widthImage, heightImage);
        firstImage.isOpened = false;
        secondImage.isOpened = false;
        click = true;
    }


    //vẽ thẻ lên canvas
    function drawCards() {
        // lấy ảnh cho card
        let cardImgArr = arr.slice(0, 5);
        // vẽ ảnh back 
        cardImgArr.forEach(row => row.forEach(obj => ctx.drawImage(obj.img[1], obj.startPointX, obj.startPointY, widthImage, heightImage)));

        //debuging
        // console.log(cardImgArr);
        // console.log(arr);
    }


    //khi game thắng
    function gameWin() {
        click = false;
        isWinScreen = true;
        ctx.clearRect(0, 0, 1000, 1000);

        ctx.font = '50px serif';
        ctx.fillText('YOU WIN! CLICK TO RESTART', 100, 500, 5000);

        var background = new Image();
        background.src = './assets/images/youarewin.jpg';
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            ctx.drawImage(background,120,0, 700, 400);   
            }
    
        musicList.backgroundAudio.pause();
        setTimeout(playWinAudio, 10);
    }


    //khởi tạo game
    function initGame() {
        isWinScreen = false;
        click = true;
        loadImages();
        loadMusic();
        // drawCards();
        // playBackgroundMusic();
        setTimeout(drawCards, 300);
        setTimeout(playBackgroundMusic, 500);
    }

    initGame();
}

main();