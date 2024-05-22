let data_list = [
    {
        "link": "html/lock.html",
        "title": "加密文件",
        "info": "互联网时代，信息变得不在安全，时时有泄漏的风险，加密孕育而生，给隐私上把锁，这样即使信息泄漏也无法使用。",
        "date": "2022-08-28",
        "img": { "src": "img/index/lock.png", "alt": "Lock" }
    },
    {
        "link": "html/planeWars.html",
        "title": "Pygame-飞机大战",
        "info": "本文旨在帮助新手朋友了解游戏制作的基础内容，如何从零开始一步步搭建属于自己的虚拟世界，在游戏方面来提高自己对程序的理解动手能力。",
        "date": "2024-05-21",
        "img": { "src": "img/index/planeWars.png", "alt": "planeWars" }
    },
    {
        "link": "javascript:void(0);",
        "title": "失败测试",
        "info": "测试失败文本",
        "date": "2024-05-22",
        "img": { "src": "", "alt": "Error" }
    },
];

// 页码数
let page_num = !(data_list.length % 4) ? Math.floor(data_list.length / 4) : Math.floor(data_list.length / 4) + 1;

// 页码按钮组元素
let page_button = document.querySelector(".page ul");
// 生成换页按钮
(function initPageButton() {
    // 首页标签
    let start_page = document.createElement("li");
    start_page.innerHTML = '<a onclick="moveStart()">&lt;&lt;</a>';
    page_button.appendChild(start_page);
    // 左移标签
    let left = document.createElement("li");
    left.innerHTML = '<a onclick="moveLeft()">&lt;</a>';
    page_button.appendChild(left);

    // 页数多于显示
    if (page_num > 5) {
        // 起始标签
        let li_first = document.createElement("li");
        li_first.innerHTML = '<a class="page-number first" onclick="pageClickEvent(this)" data-index="1">1</a>';
        page_button.appendChild(li_first);

        // 列表标签
        for (let i = 2; i <= 4; i++) {
            let li = document.createElement("li");
            li.innerHTML = `<a class="page-number" onclick="pageClickEvent(this)" data-index="${i}">${i}</a>`
            page_button.appendChild(li);
        }

        // 结尾标签
        let li_last = document.createElement("li");
        li_last.innerHTML = `<a class="page-number last" onclick="pageClickEvent(this)" data-index="5">...</a>`;
        page_button.appendChild(li_last);
    }
    // 页数少于显示
    else {
        for (let i = 1; i <= page_num; i++) {
            let li = document.createElement("li");
            li.innerHTML = `<a class="page-number" onclick="pageClickEvent(this)" data-index="${i}">${i}</a>`
            page_button.appendChild(li);
        }
    }

    // 右移标签
    let right = document.createElement("li");
    right.innerHTML = '<a onclick="moveRight()">&gt;</a>';
    page_button.appendChild(right);
    // 尾部标签
    let end_page = document.createElement("li");
    end_page.innerHTML = '<a onclick="moveEnd()">&gt;&gt;</a>';
    page_button.appendChild(end_page);
})()

// 数字按钮换页事件
function pageClickEvent(own) {
    // 清空数据
    let show_list = document.querySelector(".content ul");
    let page_list = document.querySelectorAll(".page ul li .page-number");
    show_list.innerHTML = "";
    let index = Number(own.dataset.index)

    // 更新页面位置
    for (let i = 0; i < page_list.length; i++) {
        if (page_list[i].classList.contains("now")) {
            page_list[i].classList.remove("now");
        }
    }
    own.classList.add("now");


    // 添加数据
    let show_data = data_list.slice((index - 1) * 4, (index - 1) * 4 + 4);
    for (let i = 0; i < show_data.length; i++) {
        let li_info = document.createElement("li");
        li_info.innerHTML = `
        <a href="${show_data[i].link}">
            <div class="img-li"><img src="${show_data[i].img["src"]}" alt="${show_data[i].img["alt"]}"></div>
            <div class="info">
                <h3>${show_data[i].title}</h3>
                <p>${show_data[i].info}</p>
                <span><i class="fa-regular fa-calendar"></i>&nbsp;${show_data[i].date}</span>
            </div>
        </a>`;
        show_list.appendChild(li_info);
    }

    // 最后键位更新方法
    if (own.classList.contains("last") && index < page_num) {
        // 修改前四个按钮值
        for (let i = 0; i < page_list.length - 1; i++) {
            let pn = Number(page_list[i].dataset.index) + 1;
            page_list[i].innerHTML = pn;
            page_list[i].setAttribute("data-index", `${pn}`);
        }
        // 检查是否到边界
        if (index + 1 == page_num) {
            page_list[4].innerHTML = page_num;
            page_list[4].setAttribute("data-index", `${page_num}`);
        } else {
            page_list[4].setAttribute("data-index", `${index + 1}`);
        }

        // 当前状态右移修改
        page_list[4].classList.remove("now");
        page_list[3].classList.add("now");
    }

    if (own.classList.contains("first") && index > 1) {
        // 修改前四个按钮值
        for (let i = 0; i < page_list.length - 1; i++) {
            let pn = Number(page_list[i].dataset.index) - 1;
            page_list[i].innerHTML = pn;
            page_list[i].setAttribute("data-index", `${pn}`);
        }
        // 修改最后按钮
        page_list[4].innerHTML = "...";
        page_list[4].setAttribute("data-index", `${index + 4 - 1}`);

        // 当前状态左移修改
        page_list[0].classList.remove("now");
        page_list[1].classList.add("now");
    }
}

// 向左换页
function moveLeft() {
    let now = document.querySelector(".now");
    let pre_index = Number(now.dataset.index) - 1;
    if (pre_index < 1) { return; }
    let own = document.querySelector(`.page-number[data-index="${pre_index}"]`);
    pageClickEvent(own);
}

// 向右换页
function moveRight() {
    let now = document.querySelector(".now");
    let next_index = Number(now.dataset.index) + 1;
    if (next_index > page_num) { return; }
    let own = document.querySelector(`.page-number[data-index="${next_index}"]`);
    pageClickEvent(own);
}

// 回到首页
function moveStart() {
    let page_list = document.querySelectorAll(".page ul li .page-number");
    if (page_num > 5) {
        for (let i = 0; i < 4; i++) {
            page_list[i].setAttribute("data-index", i + 1);
            page_list[i].innerText = i + 1;
        }
        page_list[4].setAttribute("data-index", 5);
        page_list[4].innerText = "...";
    }
    else {
        for (let i = 0; i < page_list.length; i++) {
            page_list[i].setAttribute("data-index", i + 1);
            page_list[i].innerText = i + 1;
        }
    }
    pageClickEvent(page_list[0]);
}

// 转到尾部
function moveEnd() {
    let page_list = document.querySelectorAll(".page ul li .page-number");
    for (let i = page_list.length - 1, n = page_num; i >= 0; i--, n--) {
        page_list[i].setAttribute("data-index", n);
        page_list[i].innerText = n;
    }
    pageClickEvent(page_list[page_list.length - 1]);
}

// 生成首页
document.querySelector(".page .page-number").click();