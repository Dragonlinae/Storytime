var book = `<a class="book"> <div class="book-back book-inner"> </div> <div class="book-pages book-inner"> </div> <div class="book-pages book-inner"> </div> <div class="book-pages book-inner"> </div> <div class="book-pages book-inner"> </div> <div class="book-cover book-inner"> <svg viewBox="0 0 420 600" class="book-image"> <rect fill="#FE3A3C" x="0" y="0" width="420" height="600" /> </svg> </div> </a>`;
var table = `<div class="tabletop" data-rotatestart="80" data-rotateend="94"> <img src="https://www.hamiltondraws.com/images/desktop.jpg" class="tabletexture"> <img src="https://www.hamiltondraws.com/images/desktop.jpg" class="tabletextureside"> </div>`;
var bookCount = 0;

tablemovement = e => {
    // time the scroll event
    const top = e.target.scrollingElement.scrollTop;
    document.querySelectorAll(".tabletop").forEach(o => {
        const scrollstart = o.getBoundingClientRect().top + top - window.innerHeight;
        const scrollend = scrollstart + o.offsetHeight + window.innerHeight;
        if (top > scrollstart && top < scrollend) {
            const rotatestart = +o.dataset.rotatestart;
            const rotateend = +o.dataset.rotateend;
            const rotatedistance = rotateend - rotatestart;

            const distance = (top - scrollstart) / (scrollend - scrollstart);
            const desktopdistance = distance * rotatedistance + rotatestart;
            o.querySelectorAll(".tabletexture").forEach(te => {
                te.style.transform = `rotate3d(1,0,0,${desktopdistance}deg)`;
            });
        }
    });
}

function changeTables() {
    var tables = document.getElementById("tables");
    // get the number of grid rows css in div with the id shelf
    var shelf = document.getElementById("shelf");
    var gridrows = window.getComputedStyle(shelf).gridTemplateRows.split(" ").length;
    // set up html for tables
    //     <div class="tabletop" data-rotatestart="60" data-rotateend="94">
    //     <img src="https://www.hamiltondraws.com/images/desktop.jpg" class="tabletexture">
    //     <img src="https://www.hamiltondraws.com/images/desktop.jpg" class="tabletextureside">
    // </div>
    // set up html for tables
    // check if number of tables is equal to number of grid rows
    // if not, add or remove tables
    if (tables.childElementCount != gridrows) {
        for (var i = tables.childElementCount; i < gridrows; i++) {
            tables.innerHTML += table;
            tables.lastElementChild.style.zIndex = -i;
        }
        for (var i = tables.childElementCount; i > gridrows; i--) {
            tables.removeChild(tables.lastElementChild);
        }
    }
}

function addBook() {
    // <div class="book">
    //     <div class="book-back book-inner"></div>
    //     <div class="book-pages book-inner"></div>
    //     <div class="book-pages book-inner"></div>
    //     <div class="book-pages book-inner"></div>
    //     <div class="book-pages book-inner"></div>
    //     <div class="book-cover book-inner">
    //         <svg viewBox="0 0 420 600" class="book-image">
    //             <rect fill="#FE3A3C" x="0" y="0" width="420" height="600" />
    //         </svg>
    //     </div>
    // </div>
    var shelf = document.getElementById("shelf");
    var targetbook;
    // Add book as second child of shelf, not the first
    shelf.insertBefore(document.createElement("div"), shelf.children[1]);
    shelf.children[1].outerHTML = book;
    targetbook = shelf.children[1];
    targetbook.style.top = "-20vh";
    setTimeout(() => {
        targetbook.style.transition = "all 0.1s ease-in-out";
        targetbook.style.top = "0";
        setTimeout(() => {
            targetbook.style.transition = "none";
        }, 100);
    }, 10);
    // get the book just added
    // change color of book
    targetbook.querySelector(".book-image rect").style.fill = "#" + Math.floor(Math.random() * 16777215).toString(16);
    // change back cover of book to match front cover
    targetbook.querySelector(".book-back").style.backgroundColor = targetbook.querySelector(".book-image rect").style.fill;
    // Now entering cursed code zone
    targetbook.onclick = e => {
        var openbook = document.getElementById("openbook");
        if (!openbook.classList.contains("open")) {
            console.log("clicked " + targetbook.id);
            targetbook.classList.toggle("open");
            if (targetbook.classList.contains("open")) {
                // zoom in on book
                console.log("zoom in");
                // move openbook to targetbook
                openbook.style.transition = "none";
                openbook.querySelector(".book-back").style.backgroundColor = targetbook.querySelector(".book-back").style.backgroundColor;
                openbook.querySelector(".book-image rect").style.fill = targetbook.querySelector(".book-image rect").style.fill;
                openbook.style.position = "fixed";
                openbook.style.top = targetbook.getBoundingClientRect().top + "px";
                openbook.style.left = targetbook.getBoundingClientRect().left + "px";
                openbook.style.width = targetbook.getBoundingClientRect().width + "px";
                openbook.style.height = targetbook.getBoundingClientRect().height + "px";
                openbook.style.zIndex = 100;
                openbook.style.transform = "none";
                openbook.classList.add("open");
                openbook.style.transition = "all 0.5s ease-in-out";
                openbook.style.visibility = "visible";
                // wait 0.01 seconds for transition to take effect
                setTimeout(() => {
                    targetbook.style.visibility = "hidden";
                }, 10);
                // move to center of screen and fill screen
                openbook.style.top = "50vh";
                openbook.style.left = "65vw";
                openbook.style.width = "30vw";
                // maintain aspect ratio
                openbook.style.height = "calc(30vw * 214/150)";
                openbook.style.transform = "translate(-50%, -50%)";
                openbook.focus();
                // end click event propagation
                e.stopPropagation();
                openbook.onclick = e => {
                    // determine if left or right side of book was clicked
                    var x = e.clientX - openbook.getBoundingClientRect().left;
                    if (x < 0) {
                        // left side of book
                        console.log("left side of book clicked");
                    } else {
                        // right side of book
                        console.log("right side of book clicked");
                    }
                    e.stopPropagation();
                };
                document.onclick = e => {
                    console.log("zoom out");
                    openbook.style.transition = "all 0.5s ease-in-out";
                    // move back to targetbook position
                    openbook.style.top = targetbook.getBoundingClientRect().top + "px";
                    openbook.style.left = targetbook.getBoundingClientRect().left + "px";
                    openbook.style.width = targetbook.getBoundingClientRect().width + "px";
                    openbook.style.height = targetbook.getBoundingClientRect().height + "px";
                    openbook.classList.remove("open");
                    openbook.style.transform = "none";
                    openbook.style.visibility = "hidden";
                    targetbook.classList.remove("open");
                    // wait for 0.5s for animation to finish
                    setTimeout(() => {
                        targetbook.style.visibility = "visible";
                    }, 500);
                    document.onclick = null;
                };
            }
        }
    };
    targetbook.id = "book" + bookCount;
    bookCount++;
    changeTables();
}

document.addEventListener('scroll', tablemovement);
window.addEventListener('resize', changeTables);

function addBookAnimated() {
    if (!document.getElementById("openbook").classList.contains("open")) {
        flip(document.getElementById("shelf").children, addBook);
    }
}

function flip(elements, changeFunc, vars) {
    elements = gsap.utils.toArray(elements);
    vars = vars || {};
    let tl = gsap.timeline({ onComplete: vars.onComplete, delay: vars.delay || 0 }),
        bounds = elements.map(el => el.getBoundingClientRect()),
        copy = {},
        p;
    elements.forEach(el => {
        el._flip && el._flip.progress(1);
        el._flip = tl;
    })
    changeFunc();
    tl.to({}, 0.1, {})
    for (p in vars) {
        p !== "onComplete" && p !== "delay" && (copy[p] = vars[p]);
    }
    copy.x = (i, element) => "+=" + (bounds[i].left - element.getBoundingClientRect().left);
    copy.y = (i, element) => "+=" + (bounds[i].top - element.getBoundingClientRect().top);
    return tl.from(elements, copy);
}

changeTables();
document.getElementById("addbook").onclick = addBookAnimated;

for (var i = 0; i < 0; i++) {
    addBookAnimated();
}