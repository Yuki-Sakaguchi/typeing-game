(function() {
    var elMainBox = {};
    var elLife = {};
    var elText = {};
    var elScore = {};
    var elHighScore = {};
    var elTimer = {};

    var life = 2;
    var score = 0;
    var highScore = 0;
    var time = 0;
    var timer;

    var checkTextList = [];
    var targetTextList = [
        'javascript',
        'function',
        'alert',
        'index.html',
        'css',
        'console.log'
    ];

    var isStop = false;
    var highScoreName = 'typing-game-score';

    /**
     * 初期化
     */
    window.addEventListener('load', init);
    function init() {
        elMainBox = document.getElementById('main-box');
        elLife = document.getElementById('life');
        elText = document.getElementById('text');
        elTimer = document.getElementById('time');
        elScore = document.getElementById('score');
        elHighScore = document.getElementById('high-score');

        elHighScore.textContent = (localStorage.getItem(highScoreName)) ? localStorage.getItem(highScoreName) : 0;
        elLife.textContent = life;

        setTimer();
        setCheckText();

        document.addEventListener('keydown', handleKeyDown);
    }

    /**
     * タイマーセット
     */
    function setTimer() {
        var startTime = new Date();
        timer = setInterval(getTime, 1000);

        function getTime() {
            var currentTime = new Date();
            time = Math.floor((currentTime - startTime) / 1000);
            elTimer.textContent = time;
        }
    }

    /**
     * ターゲットを追加
     */
    function setCheckText() {
        elText.classList.remove("is-success");
        elText.innerHTML = '';
        checkTextList = targetTextList[Math.floor(Math.random() * targetTextList.length)].split('').map(function(e, i) {
            var span = document.createElement('span');
            span.textContent = e;
            elText.appendChild(span);
            return span;
        });
    }

    /**
     * キーダウン時の処理
     */
    function handleKeyDown(e) {
        if (!checkTextList.length || isStop) {
            return false;
        }

        if (e.key === checkTextList[0].textContent) {
            // 正解
            checkTextList[0].classList.add('is-true');
            checkTextList.shift();
        } else {
            // ミス
            isStop = true;
            elLife.textContent = --life;
            elMainBox.classList.add('js-damage');

            if (life == 1) {
                elMainBox.classList.add('hinnshi');
            } else if (life == 0) {
                elMainBox.classList.add('shibou');
            }

            if (life <= 0) {
                gameover();
                return false;
            }

            setTimeout(function() {
                elMainBox.classList.remove('js-damage');
                isStop = false;
            }, 400);
        }

        if (!checkTextList.length) {
            setTimeout(function() {
                elText.classList.add("is-success");
                setTimeout(function() {
                    setCheckText();
                    score += 100;
                    elScore.textContent = score;
                }, 800);
            }, 400);
        }
    }

    /**
     * ゲームオーバー
     */
    function gameover() {
        // いろいろ初期化
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);

        // ハイスコア取得
        localStorage.setItem(highScoreName, (score > localStorage.getItem(highScoreName) ? score : localStorage.getItem(highScoreName)));

        // 画面をクリックしたらリセット
        window.addEventListener('click', reset);
    }

    /**
     * リセット
     */
    function reset() {
        elMainBox.className = 'main-box';
        time = 0;
        score = 0;
        elScore.textContent = score;
        elTimer.textContent = time;
        life = 2;
        isStop = false;
        window.removeEventListener('click', reset);
        init();
    }
})();
