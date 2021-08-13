/*
    FEATURE:
    
    1. Render song --> OK
    2. Scroll top --> OK
    3. Play / pause / seek --> OK
    4. CD rotate --> OK
    5. Next / previous --> OK
    6. Random --> OK
    7. Next / Repeat when ended --> OK
    8. Active song --> OK
    9. Scroll active song into view --> OK
    10. Play song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// lấy ra element playist để mình chuẩn bị cho render song vào playist phía dưới
const playist = $('.playlist')

// lấy ra element CD
const cd = $('.cd')

//lấy ra các element cần cho lần load bài hát đầu tiên
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

//lấy element của nút play/pause
const playBtn = $('.btn-toggle-play')

//lấy element player để sau này add thêm class playing vào
const player = $('.player')

// lấy ra element của progress Bar
const progressBar = $('#progress')

// lấy element của button next/ prev / random / repeat
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app = {
    // dùng để lấy bài hát đầu tiên
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,


    songs: [
        {
            name: 'Người chơi hệ đẹp',
            singer: '16Typh',
            path: './song/song1.mp3',
            image: './img/img1.jpg'
        },

        {
            name: 'Gái Độc Thân',
            singer: 'Tlinh',
            path: './song/song2.mp3',
            image: './img/img2.jpg'
        },

        {
            name: 'Sang Xịn Mịn',
            singer: 'Gill',
            path: './song/song3.mp3',
            image: 'https://data.chiasenhac.com/data/cover/140/139717.jpg'
        },

        {
            name: 'Thức Giấc',
            singer: 'Dalab',
            path: './song/song4.mp3',
            image: 'https://i.scdn.co/image/ab67616d0000b273584941358113e20c6fce2175'
        },

        {
            name: 'Muộn Rồi Mà Sao Còn',
            singer: 'Sơn Tùng MTP',
            path: './song/song5.mp3',
            image: 'https://i.scdn.co/image/ab67616d0000b27329f906fe7a60df7777b02ee1'
        },

        {
            name: 'Sài Gòn đau lòng quá',
            singer: 'Hoàng Duyên, Hứa Kim Tuyền',
            path: './song/song6.mp3',
            image: 'https://i1.sndcdn.com/artworks-XgD5malRm6RMmJ0m-jiR8eA-t500x500.jpg'
        },
    ],

    render: function() {
        const htmls = this.songs.map( (song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div 
                    class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>

                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>

                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        // render songs ra giao diện
        playist.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty ( this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        } )
    },

    //phần hàm chuyên xử lý logic các listener của event
    handlEvents: function () {
        const _this = this

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg)'}
            ], {
                duration: 10000, // 10 seconds
                iterations: Infinity
            })
        cdThumbAnimate.pause()


        //lấy ra width của element CD
        const cdWidth = cd.offsetWidth
        //lắng nghe sự kiện khi chúng ta scroll từ trên xuống dưới 
        // và phóng to thu nhỏ cd-thumb
        document.onscroll = function () {
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 
            cd.style.opacity = newCdWidth / cdWidth
        }


        //Xử lý khi click play/pause
        // lắng nghe sự kiện khi click vào button play/pause
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            } 

            // khi song đang được play => xử lý trạng thái sự kiện 
            audio.onplay = function () {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            // khi song bị pause => xử lý trạng thái sự kiện 
            audio.onpause = function () {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            // khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function () {
                // tính tiến độ chạy của bài hát theo %
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                console.log(progressPercent + '%')
                progressBar.value = progressPercent
            }
        }

        //Xử lý khi tua(seek) song
        progressBar.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lý khi bấm button Next
        nextBtn.onclick = function () {
            if (_this.isRandom){
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý khi bấm button Previous
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý khi bấm button Random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lý khi bấm button Repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)

            if (_this.isRepeat) {
                audio.loop = true
            } else {
                audio.loop = false
            }
            audio.play()
        }

        //Xử lý next song khi audio ended
        audio.onended = function () {
            if (audio.ended) {
                _this.nextSong()
                audio.play()
            }
        }

        //lắng nghe hành vi click vào playist
        playist.onclick = function (e) {
            const songNode = e.target.closest ('.song:not(.active')
            //xử lý khi click vào bài hát
            if ( songNode && !e.target.closest ('.option') ) {

                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    _this.render()
                }
                audio.play()
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function () {
        this.currentIndex++
        if ( this.currentIndex >= this.songs.length ) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex
        if ( this.currentIndex-- <= 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function () {
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length)
            console.log(randomIndex)
        } // điều kiện xử lý khi bài hát bị trùng
        while (randomIndex === this.currentIndex) 
        
        this.currentIndex = randomIndex
        this.loadCurrentSong()
    },

    // 9. Scroll active song into view
    scrollToActiveSong: function () {
        const scrollView = $('.song.active')
        setTimeout ( () => {
            scrollView.scrollIntoView = ({
                behavior: "smooth", 
                block: "nearest",
            })
        }, 200)
    },

    start: function() {
        //định nghĩa các thuộc tính cho object (getter)
        this.defineProperties()

        //lắng nghe và xử lý các sự kiện DOM
        this.handlEvents()

        //load bài hát đầu tiên lên UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playist
        this.render()

    }
}

app.start()
