// ========================================= FRAMEWORK VARIABLES ARE SET ===============================================
//Initialize Canvas
ctx = main.getContext("2d");
//Set all smoothing effects off
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
//Set some drawing variables
ctx.strokeStyle = 'green';
ctx.fillStyle = 'green';
ctx.lineWidth = 5;
//Load Sprite Sheet and create some sprites
spriteSheet = new Image();
spriteSheet.src = "500x500standar_alpha.png";
spriteArray = {
    abc: new Sprite(5, 0, 5, 5),
    nums: new Sprite(0, 0, 5, 5),
    punkSp: new Sprite(140, 0, 2, 5),
    scroll: new Sprite(151, 0, 5, 5),
    mc: new Sprite(0, 50, 20, 23),
    enemies: new Sprite(5, 5, 34, 45),
    items: new Sprite(0, 73, 21, 24),
    rooms: new Sprite(0, 97, 167, 75),
    misc: new Sprite(0, 142, 106, 34)
};
enemyArray = {
    youtuber: new Enemy("youtuber", spriteArray.enemies, 0, [
        {
            prob: 0.3, funct: function () {
                eventQ.push(function () {
                    setDialog("youtuber tried to upload a video...")
                });
                eventQ.push(function () {
                    setDialog("... but there is no internet")
                })
            }
        },
        {
            prob: 1.0, funct: function () {
                Enemy.prototype.atacc()
            }
        }]),
    ratboy: new Enemy("rat boy", spriteArray.enemies, 1, [
        {
            prob: 0.3, funct: function () {
                eventQ.push(function () {
                    setDialog("rat boy hit you with his pixaxe")
                });
                eventQ.push(function () {
                    setDialog("... but it's cardboard")
                })
            }
        },
        {
            prob: 1.0, funct: function () {
                Enemy.prototype.atacc()
            }
        }]),
    instagrammer: new Enemy("instagrammer", spriteArray.enemies, 3, [
        {
            prob: 0.3, funct: function () {
                eventQ.push(function () {
                    setDialog("instagrammer took a selfie...")
                });
                eventQ.push(function () {
                    setDialog("... but instagram is offline and nobody saw it.")
                })
            }
        },
        {
            prob: 1.0, funct: function () {
                Enemy.prototype.atacc()
            }
        }]),
    rager: new Enemy("rager", spriteArray.enemies, 4, [
        {
            prob: 0.3, funct: function () {
                eventQ.push(function () {
                    setDialog("rager bursts into flames")
                });
                this.atk + 10
            }
        },
        {
            prob: 1.0, funct: function () {
                Enemy.prototype.atacc()
            }
        }])

};
roomArray = {
    bedroom: new Room("bedroom", "standard", 0),
    hallway: new Room("hallway", "standard", 1, function () {
        if (this.indexes.length < 2) {
            var assigned = false;
            while (!assigned) {
                var rand = Math.random();
                var lastIndexes = this.indexes[this.indexes.length - 1];
                var newI = lastIndexes[0];
                var newJ = lastIndexes[1];
                if (rand > 0.75) {
                    newJ -= 1
                }
                if (rand <= 0.75 && rand > 0.5) {
                    newJ++
                }
                if (rand <= 0.5 && rand > 0.25) {
                    newI -= 1
                }
                if (rand <= 0.25) {
                    newI++
                }
                if (newJ >= 0 && newI >= 0 && map.mapMatrix[newI][newJ] == null) {
                    map.insert(newI, newJ, this);
                    assigned = true
                }
            }
        }
    }),
    kitchen: new Room("kitchen", function () {
    }),
    bathroom: new Room("bathroom", function () {
    })
};

//jsons that contain the numbers that correspond to each letter, so that the specific tile is cropped from the image.
// TODO: THIS MUST BE REVIEWED
abc = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11,
    m: 12,
    n: 13,
    o: 14,
    p: 15,
    q: 16,
    r: 17,
    s: 18,
    t: 19,
    u: 20,
    v: 21,
    w: 22,
    x: 23,
    y: 24,
    z: 25,
    ask: 26
};
punks = JSON.parse('{".":0,"\,":1,"\:":2,"/":3,"\'":4,"!":5}');
game = null;
optionMenu = null;
mapMenuActive = false;
anim = null
window.setTimeout(function () {
    standby = true;
    game = "mainMenu";
    refreshGlobalDraw()
    // ac = new AudioContext()
    // when = ac.currentTime,
    // seq1= new TinyMusic.Sequence(ac,60,[
    //     'C1 w',
    //     'F1 h'
    // ])
    // notes = []
    // for(i = 0;i<263;i++){
    //     notes[i] = new TinyMusic.Note('C 0.0125')
    //     notes[i].frequency = 523 - i
    // }
    // seq2= new TinyMusic.Sequence(ac,260,notes)
    // seq1.gain.gain.value = seq2.gain.gain.value = 0.2
    // seq2.smoothing = 1
    // seq2.loop = false
    // seq2.constructor.play = function(time){
    //     console.log("hi")
    // }
    // seq1.play(when)
    // seq2.play(when + (60/120)*2)

}, 1000);
// ======================================================== END ========================================================


// ======================================== THIS SECTION DEALS WITH INPUT ==============================================
main.addEventListener('click', function (event) {
    if (anim == null) {
        if (standby) {
            coords = getMouseCoords(event);
            if (optionMenu == null) {
                oBoxes.forEach(function (optB) {
                    if (optB.in(coords.x, coords.y)) {
                        if (optB.name == "new game" || optB.name == "try again?") {
                            initNewGame();
                            switchState("explore");
                            globalCounter()
                        }
                        if (optB.name == "move") {
                            standby = false;
                            mapMenuActive = true;
                            refreshGlobalDraw()
                            // setDialog("you moved to a new room")
                            // currentRoom = new Room("new room", currentRoom)
                            // eventQ.push(function () {
                            //     if (currentRoom.enemy == null) {
                            //         switchState("explore")
                            //     } else {
                            //         switchState("fight")
                            //     }
                            // })
                        }
                        if (optB.name == "attack") {
                            enemy_action = currentRoom.enemy.performAction();
                            order = mainC.spd >= enemy.spd ? [mainC, enemy] : [enemy, mainC];
                            order[0].performAction("attack")();
                            if (order[1].hp < 1) {
                                order[1].performDeath()
                            } else {
                                order[1].performAction()();
                                if (order[0].hp < 1) {
                                    order[0].performDeath()
                                } else {
                                    eventQ.push(function () {
                                        setDialog("you are fighting " + enemy.name)
                                    })
                                }
                            }
                            eventQ.shift()()
                        }
                        if (optB.name == "defend") {

                        }
                        if (optB.name == "look") {

                        }
                        if (optB.name == "items") {
                            switchState("items")
                        }
                        if (optB.name == "menu") {
                            optionMenu = new OptionMenu(coords.x, coords.y, ["use", "drop"], itemIndex);
                            standby = true
                        }
                        if (optB.name == "action") {

                        }
                        if (optB.name == "run") {

                        }
                        if (optB.name == "back") {
                            switchState("explore")
                        }
                    }
                })
            } else if (optionMenu != null) {
                optionMenu.optionBoxes.forEach(function (optB) {
                    if (optB.in(coords.x, coords.y)) {
                        if (optB.name == "use") {
                            setDialog("you used an item");
                            eventQ.push(function () {
                                refreshGlobalDraw();
                                standby = true
                            });
                            itemSlots[optionMenu.itemIndex].item.use();
                            itemSlots[optionMenu.itemIndex].item = null;
                            optionMenu = null
                        }
                        if (optB.name == "drop") {
                            setDialog("you dropped item");
                            eventQ.push(function () {
                                refreshGlobalDraw();
                                standby = true
                            });
                            itemSlots[optionMenu.itemIndex].item = null;
                            optionMenu = null
                        }
                    }
                });
                if (!optionMenu.in(coords.x, coords.y)) {
                    optionMenu = null;
                    refreshGlobalDraw()
                }
            }
            if (globalItemIndex != null) {
                optionMenu = new OptionMenu(coords.x, coords.y, ["use", "drop"], globalItemIndex);
                refreshGlobalDraw()
            }
            //TODO: Must review if this code should be implemented.
        } else if (mapMenuActive) {
            coords = getMouseCoords(event);
            if (coords.x < 200 || coords.x > 800 || coords.y < 200 || coords.y > 800) {
                mapMenuActive = false;
                standby = true;
                roomOpt = []
                refreshGlobalDraw()
            } else {
                //console.log("pressed map menu")
                //console.log("optionRoom length: "+roomOpt.length)
                for(i = 0; i<roomOpt.length;i++) {
                    //console.log("Mouse coords: "+coords+" Room Option: "+ro)
                    if (roomOpt[i].in(coords.x, coords.y)) {
                        if (map.mapMatrix[roomOpt[i].indI][roomOpt[i].indJ] == "open") {
                            map.insert(roomOpt[i].indI, roomOpt[i].indJ, roomArray.bedroom.getCopy());
                        }
                        currentRoom = map.mapMatrix[roomOpt[i].indI][roomOpt[i].indJ]
                        //console.log("hit Room with index: ["+ro.indI+","+ro.indJ+"]")

                        anim = {
                            top_y: 0, bot_y: 1000, status: "coming", play: function () {
                                ctx.fillStyle = "black"
                                ctx.fillRect(0, 0, 1000, this.top_y)
                                ctx.fillRect(0, this.bot_y, 1000, 500)
                                if (this.status == "coming") {
                                    this.top_y += 50
                                    this.bot_y -= 50
                                } else {
                                    this.top_y -= 50
                                    this.bot_y += 50
                                    if (this.top_y <= 0) {
                                        finishAnim("you moved to a new room","explore")
                                    }
                                }
                                if (this.top_y >= 500) {
                                    this.status = "going"
                                    dialog = null

                                }
                            }
                        }
                        mapMenuActive = false;
                        roomOpt = []
                        return
                    }

                }
            }
        } else if (waitForScroll) {
            waitForScroll = false;
            ctx.clearRect(895, 895, 50, 50);
            eventQ.shift()()
        }
    }
}, false);

main.addEventListener('mousemove', function (event) {
    if (game == 'items' && standby) {
        coords = getMouseCoords(event);
        for (i = 0; i < itemSlots.length; i++) {
            if (itemSlots[i].item != null && itemSlots[i].in(coords.x, coords.y)) {
                globalItemIndex = i;
                refreshGlobalDraw();
                return
            }
        }
        globalItemIndex = null;
        refreshGlobalDraw()
    }
}, false);

function getMouseCoords(event) {
    bounds = main.getBoundingClientRect();
    x = 1000 * (event.pageX - bounds.left) / bounds.width;
    y = 1000 * (event.pageY - bounds.top) / bounds.height;

    return {x: x, y: y}
}

// ======================================================== END ========================================================

// ========================================== THIS SECTION DEALS WITH State Switching0 =================================
function switchState(name) {
    game = name;
    if (name == "explore") {
        setDialog("you are in " + currentRoom.name)
    }
    if (name == "items") {
        dialog = null;
        refreshGlobalDraw()
    }
    if (name == "fight") {
        setDialog("you encounter " + currentRoom.enemy.name)
    }
    if (name == "gameover") {
        dialog = null;
        refreshGlobalDraw()
    }
}

// ======================================================== END ========================================================

// ===================================== IN THIS SECTION WE DECIDE DRAWING THINGS ======================================

function refreshGlobalDraw() {
    ctx.clearRect(0, 0, main.width, main.height);
    if (game == "mainMenu") {
        drawWords("blackout.", 125, 400, 16, 0);
        oBoxes = [new OptionBox("new game", 340, 550, 6)]
    }
    if (game == "explore" || game == "fight") {
        if (game == "explore") {
            //Draw Room Background
            oBoxes = [new OptionBox("move", 40, 640, 5), new OptionBox("look", 235, 640, 5), new OptionBox("items", 640, 640, 5), new OptionBox("menu", 825, 640, 5)];
            currentRoom.drawRoom()
        } else {
            oBoxes = [new OptionBox("attack", 40, 640, 4), new OptionBox("action", 235, 640, 4), new OptionBox("defend", 615, 640, 4), new OptionBox("escape", 803, 640, 4)];
            currentRoom.enemy.draw()
        }
        //Draws Lower boxes and player face
        ctx.strokeRect(25, 625, 950, 350);
        ctx.strokeRect(40, 705, 920, 255);
        ctx.fillStyle = "black";
        ctx.fillRect(448, 580, 119, 125);
        ctx.strokeRect(448, 580, 119, 125);
        spriteArray.mc.draw(457, 585, 5, {x: 0, y: 0});

        //Draws hunger box
        ctx.strokeRect(25, 25, 307, 110);
        drawWords("hunger:", 45, 45, 5, 0);
        ctx.strokeRect(49, 77, 258, 35);
        ctx.fillStyle = "green";
        ctx.fillRect(55, 83, 247 * (mainC.hunger / 100), 23);

        //Draws health box
        ctx.strokeRect(342, 25, 307, 110);
        drawWords("health:", 362, 45, 5, 0);
        ctx.strokeRect(366, 77, 258, 35);
        ctx.fillRect(372, 83, 247 * (mainC.hp / mainC.totalHp), 23);

        //Draws Mood
        ctx.strokeRect(659, 25, 307, 110);
        drawWords("mood:", 679, 45, 5, 0);
        state = "";
        if (mainC.sanity >= 80)
            state = "cool";
        if (mainC.sanity < 80 && mainC.sanity >= 50) {
            state = "anxious";
            color = {r: 255, g: 255, b: 0}
        }
        if (mainC.sanity < 50 && mainC.sanity >= 20) {
            state = "paranoid";
            color = {r: 255, g: 150, b: 0}
        }
        if (mainC.sanity < 20) {
            state = "psychotic";
            color = {r: 255, g: 0, b: 0}
        }
        drawWords(state, 685, 82, 5, 0);
        coloredMood = ctx.getImageData(685, 82, 265, 35);
        if (state != "cool") {
            d = coloredMood.data;
            for (i = 0; i < d.length; i += 4) {
                if (!(d[i] == 0 && d[i + 1] == 0 && d[i + 2] == 0)) {
                    d[i] = color.r;     // red
                    d[i + 1] = color.g;      // green
                    d[i + 2] = color.b // blue
                }
            }
        }
        ctx.putImageData(coloredMood, 685, 82)
    }
    if (game == "items") {
        oBoxes = [new OptionBox("back", 450, 900, 5)];
        ctx.strokeRect(25, 25, 950, 950);
        drawLine(500, 25, 500, 705);
        drawWords("items", 200, 50, 5, 0);
        drawWords("status", 675, 50, 5, 0);
        ctx.strokeRect(40, 705, 920, 255);
        drawWords("health: " + mainC.hp + "/" + mainC.totalHp, 515, 150, 5, 0);
        drawWords("hunger: " + mainC.hunger + "/100", 515, 200, 5, 0);

        itemSlots.forEach(function (it) {
            it.draw()
        });
        if (globalItemIndex != null) {
            item = itemSlots[globalItemIndex].item;
            drawWords(item.name, 325, 725, 5, 0);
            drawLine(325, 755, 325 + 29 * item.name.length - 2, 755);
            drawWords(item.desc, 60, 775, 5, 0)
        } else {
            ctx.clearRect(60, 725, 850, 150)
        }
    }
    if (game == "gameover") {
        drawWords("game over.", 125, 400, 16, 0);
        oBoxes = [new OptionBox("try again?", 340, 550, 6)]
    }
    oBoxes.forEach(function (e) {
        e.drawOptionBox()
    });
    if (game != "mainMenu" && optionMenu != null) optionMenu.drawMenu();

    if (mapMenuActive) {
        ctx.fillStyle = "black";
        ctx.fillRect(200, 200, 600, 600);
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.strokeRect(200, 200, 600, 600);
        var skip = [];
        for (i = 0; i < map.mapMatrix.length; i++) {
            for (j = 0; j < map.mapMatrix[i].length; j++) {
                if (map.mapMatrix[i][j] == "closed") {
                    ctx.strokeStyle = "red";
                    ctx.strokeRect(115 * i + 220, 115 * j + 220, 95, 95)
                }
                else if (!skip.includes(JSON.stringify([i, j])) && map.mapMatrix[i][j] != null) {
                    l = 95;
                    w = 95;
                    if (map.mapMatrix[i][j] == "open") {
                        ctx.strokeStyle = "yellow"
                        ctx.strokeRect(115 * i + 220, 115 * j + 220, l, w)
                    } else {
                        ind = map.mapMatrix[i][j].indexes;
                        if (ind.length > 1) {
                            console.log("index length = "+ind.length)
                            for (k = 0; k < ind.length; k++) {
                                if (JSON.stringify([i, j]) != JSON.stringify([ind[k][0], ind[k][1]])) {
                                    ind[k][0] > i ? w += (w + 20) : l += (l + 20);
                                    skip.push(JSON.stringify([ind[k][0], ind[k][1]]))
                                }
                            }
                        }
                        ctx.strokeStyle = "white";
                        if (currentRoom == map.mapMatrix[i][j]) {
                            ctx.fillRect(115 * i + 220, 115 * j + 220, w, l)
                        } else {
                            ctx.strokeRect(115 * i + 220, 115 * j + 220, w, l)
                        }
                    }
                    //console.log("checking adjacent room for space at: ["+i+","+j+"]")
                    if (map.mapMatrix[i][j] != currentRoom && adjacentRoom(i, j)) {
                        //console.log("creating room option")
                        roomOpt.push({
                            indI: i,
                            indJ: j,
                            x: 115 * i + 220,
                            y: 115 * j + 220,
                            w: w,
                            h: l,
                            in: function (x, y) {
                                if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
                                    return true
                                }
                            }
                        })
                    }
                }
            }
        }
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 5
    }
    if(anim != null) anim.play()
}

function drawWords(str, x_on_canvas, y_on_canvas, scale, dontDraw) {
    str = str.substring(0, str.length - dontDraw);
    words = str.split(' ');
    lines = [];
    line = "";
    while (words.length > 0) {
        if (line.length + words[0].length > 31) {
            lines.push(line);
            line = ""
        } else {
            line += words.shift() + " "
        }
    }
    if (line.length > 0) lines.push(line);
    lines.forEach(function (li) {
        var x_for_this_render = x_on_canvas;
        lets = li.split('');
        lets.forEach(function (lt) {
            numb = parseInt(lt);
            if (!isNaN(numb)) {
                spriteArray.nums.draw(x_for_this_render, y_on_canvas, scale, {x: 0, y: numb})
            } else if (['.', ',', ':', '/', '\''].includes(lt)) {
                spriteArray.punkSp.draw(x_for_this_render, y_on_canvas, scale, {x: punks[lt], y: 0})
            } else {
                spriteArray.abc.draw(x_for_this_render, y_on_canvas, scale, {x: abc[lt], y: 0})
            }
            x_for_this_render += lt == ' ' ? 3 * scale : 6 * scale
        });
        y_on_canvas += 5 * scale + 20

    })
}

function drawLine(xFrom, yFrom, xTo, yTo) {
    ctx.beginPath();
    ctx.moveTo(xFrom, yFrom);
    ctx.lineTo(xTo, yTo);
    ctx.stroke()
}

// ======================================================== END ========================================================

// ===================================== UPDATER AND THINGS THAT HAPPEN ON FRAME COUNTS ================================
function globalCounter() {
    setTimeout(function () {
        if (global_frame_counter < 999999) {
            global_frame_counter++
        } else {
            global_frame_counter = 0
        }
        if (global_frame_counter % 2 == 0 && dontDraw >= 0) {
            ctx.clearRect(60, 725, 850, 150);
            drawWords(dialog, 60, 725, 5, dontDraw--)
        }
        if (dontDraw == 0 && !waitForScroll) {
            if (eventQ.length > 0) {
                waitForScroll = true;
                drawScrollArrow = true
            } else {
                standby = true;
                oBoxes.forEach(function (e) {
                    e.drawOptionBox()
                })
            }
        }
        if (waitForScroll && global_frame_counter % 40 == 0) {
            if (drawScrollArrow) {
                spriteArray.scroll.draw(900, 890, 5);
                drawScrollArrow = false
            } else {
                ctx.clearRect(900, 890, 50, 50);
                drawScrollArrow = true
            }
        }
        if (anim != null) {
            refreshGlobalDraw()
        }
        globalCounter()
    }, 17)
}

// ======================================================== END ========================================================

function setDialog(diag) {
    standby = false;
    dialog = diag;
    dontDraw = dialog.length;
    refreshGlobalDraw()
}

function initNewGame() {

    //Initializes main character
    mainC = {
        name: "You",
        hp: 25,
        totalHp: 25,
        atk: 8,
        def: 5,
        spd: 5,
        luck: 5,
        hunger: 100,
        sanity: 74,
        attac: function () {
            var dmg = mc.atk;
            dmg += (mc.luck * 3) / 100 > Math.random() ? Math.ceil(mc.luck * 3 * mc.atk / 100) : 0;
            eventQ.push(function () {
                setDialog("you attack")
            });
            mc.hunger -= 5;
            eventQ.push(function () {
                setDialog(enemy.name + " received " + enemy.protecc(dmg) + " damage.")
            });
            console.log("You deal " + dmg + ". enemy HP: " + enemy.hp)
        },
        protecc: function (dmg) {
            dmg -= Math.ceil(dmg * (mc.def * 3 / 100));
            mc.hp -= dmg;
            return dmg
        },
        performAction: function (decision) {
            if (decision == "attack") {
                return this.attac
            }
        },
        performDeath: function () {
            eventQ.push(function () {
                setDialog("you were killed...")
            });
            eventQ.push(function () {
                switchState("gameover")
            })
        }
    };
    //Room enemy is null
    enemy = null;
    //Chest doesn't exists
    matrix = [];
    for (i = 0; i < 5; i++) {
        matrix[i] = new Array(5)
    }

    map = {
        mapMatrix: matrix,
        insert: function (i, j, room) {
            this.mapMatrix[i][j] = room;
            this.mapMatrix[i][j].init(i, j)
        }
    };
    //currentFloor[3][3] = new Room("your room","this is my room",1)
    map.insert(1, 1, roomArray.bedroom.getCopy());
    console.log(map.mapMatrix[1][1])
    chest = {exists: false, open: 0};
    //There is no item name selected
    itemName = null;
    //Item Slots is initiated.
    itemSlots = [];
    y_pos = 150;
    x_pos = 75;
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 4; j++) {
            itemSlots.push(new ItemSlot(null, x_pos, y_pos));
            x_pos += 100
        }
        y_pos += 100;
        x_pos = 75
    }
    //Event Queue starts empty
    eventQ = [];

    mBoxes = [];

    roomOpt = []
    //New Room is created
    currentRoom = map.mapMatrix[1][1];
    //New Mood flag is set so that the mood is determined
    setMoodState = true;
    //Counter for next hunger check is reset.
    hunger_counter = 0;
    //You are not waiting for scroll or drawing scroll arrow
    waitForScroll = drawScrollArrow = false;
    //Global Frame Counter is set to 0 and so is dont Draw
    global_frame_counter = dontDraw = 0;
    //Option menu is set to null
    globalItemIndex = null;
    //You are on standby
    //Item is set.
    addItem(new Item("instant lunch", "yummy stuff", spriteArray.instantLunch, 0, 5, 15, 0))
    //New Box is defined
}

function addItem(item) {
    for (i = 0; i < itemSlots.length; i++) {
        if (itemSlots[i].item == null) {
            itemSlots[i].item = item;
            return
        }
    }
}

function adjacentRoom(i, j) {
    var inds = currentRoom.indexes
    for (k = 0; k < inds.length; k++) {
        //console.log("checking adjacent room for Current Room: ["+inds[k][0]+","+inds[k][1]+"] and indexes: i"+i+" j"+j)
        if ((inds[k][1] == j && (i == (inds[k][0] + 1) || i == (inds[k][0] - 1))) || (inds[k][0] == i && (j == (inds[k][1] + 1) || j == (inds[k][1] - 1)))) {
            return true
        }
    }
    return false
}

function finishAnim(diag,state){
    anim = null
    setDialog(diag)
    eventQ.push(function(){switchState(state)})
}