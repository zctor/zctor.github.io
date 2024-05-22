let nolock = document.getElementById("no-lock")
let lock = document.getElementById("lock")

let bin = document.getElementById("in")
let bun = document.getElementById("un")
let cls = document.getElementById("clear-info")

let alphas = "zqaswxcdefvrbgthnymjukiolp"
let numbers = "6417390258"

function inlock() {
    let doc = ""
    let data = btoa(encodeURI(nolock.value))
    for (let i=0; i < data.length; i++) {
        let word = data[i]
        let ascii = word.charCodeAt()
        if (ascii >=48 && ascii <= 57) {
            let index = numbers.indexOf(word)  // 获取在列表中的索引
            let code = String.fromCharCode(index+48)  // 加上偏移量
            doc +=code
        } else if (ascii >= 65 && ascii <= 90) {
            let index = alphas.indexOf(word.toLowerCase())  // 大写转为小写
            let code = String.fromCharCode(index+65)
            doc +=code
        } else if (ascii >=97 && ascii <= 122) {
            let index = alphas.indexOf(word)
            let code = String.fromCharCode(index+97)
            doc +=code
        } else {
            doc +=word
        }
    }

    lock.value = doc
}

function unlock() {
    let doc = ""
    let data = lock.value
    for (let i in data) {
        let word = data[i]
        let ascii = word.charCodeAt()
        if (ascii >=48 && ascii <= 57) {
            let index = ascii - 48
            doc +=numbers[index]
        } else if (ascii >=65 && ascii <= 90) {
            let index = ascii - 65
            doc +=alphas[index].toUpperCase()
        } else if (ascii >=97 && ascii <= 122) {
            let index = ascii - 97
            doc +=alphas[index]
        } else {
            doc +=word
        }
    }
    
    nolock.value = decodeURI(atob(doc))
}


// 注册事件
bin.addEventListener("click", inlock)
bun.addEventListener("click", unlock)
cls.addEventListener("click", function () {
    lock.value = ""
    nolock.value = ""
})