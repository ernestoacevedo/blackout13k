//Item class.
class Item {
    constructor(name, desc, sprite, xm, dmg, hp, hunger, sanity) {
        this.name = name;
        this.desc = desc;
        this.sprite = sprite;
        this.dmg = dmg;
        this.hp = hp;
        this.hunger = hunger;
        this.sanity = sanity;
        this.xm = xm
    }

    use() {
        mainC.hp += this.hp;
        mainC.hunger += this.hunger
    }
}

class Sprite {
    constructor(x, y, w, h,) {
        this.xInSprite = x;
        this.yInSprite = y;
        this.wInSprite = w;
        this.hInSprite = h
    }

    draw(x, y, scale, mults) {
        if (mults != null) {
            ctx.drawImage(
                spriteSheet,
                this.xInSprite + this.wInSprite * mults.x,
                this.yInSprite + this.hInSprite * mults.y,
                this.wInSprite,
                this.hInSprite,
                x,
                y,
                this.wInSprite * scale,
                this.hInSprite * scale)
        } else {
            ctx.drawImage(
                spriteSheet,
                this.xInSprite,
                this.yInSprite,
                this.wInSprite,
                this.hInSprite,
                x,
                y,
                this.wInSprite * scale,
                this.hInSprite * scale)
        }
    }
}

class Floor {
    constructor() {
        this.roomMatrix = [];
        for (i = 0; i < 5; i++) {
            this.roomMatrix[i] = []
        }
        this.roomMatrix[4][2] = roomArray.hallway
    }
}

//Room class
class Room {
    constructor(name, desc, mx, customInit) {
        this.name = name;
        this.desc = desc;
        this.roomBg = spriteArray.rooms;
        this.enemy = null;
        this.mx = mx;
        this.cInit = customInit;
        this.indexes = []
    }

    init(i, j) {
        this.indexes.push([i, j]);
        if (this.cInit != null) this.cInit()
        var mm = map.mapMatrix
        var assignRooms = true
        var chance = 0.60
        while(assignRooms){
            var nextOpen = this.NextOpenAndAdjNum(i,j,mm)
            console.log(nextOpen)
            if (nextOpen.nextToAsign != null){
                mm[nextOpen.nextToAsign[0]][nextOpen.nextToAsign[1]] = "open"
            }else{
                assignRooms = false
            }
            if(nextOpen.openRooms < 3 && Math.random() < chance){
                console.log("should repeat this action")
                chance -= 25
            }else{
                assignRooms = false
            }
        }
        assignRooms = true
        while(assignRooms){
            var nextOpen = this.NextOpenAndAdjNum(i,j,mm)
            if (nextOpen.nextToAsign != null) {
                mm[nextOpen.nextToAsign[0]][nextOpen.nextToAsign[1]] = "closed"
            }else{
                assignRooms = false
            }
        }
    }

    drawRoom() {
        this.roomBg.draw(0, 160, 6, {x: this.mx, y: 0})
    }

    getCopy(){
        let name = this.name
        let desc = this.desc
        let mx   = this.mx
        let customInit = this.customInit
        return new Room(name,desc,mx,customInit)
    }

    NextOpenAndAdjNum(i,j, mm){
        console.log("this iteration's i"+i+" j"+j)
        var count = 0
        var retVect = null
        if(i - 1 >= 0){
            console.log("checking if i"+(i-1)+" j"+j+" is open")
            if (mm[i - 1][j] == null && retVect == null){
                console.log("i"+(i-1)+" j"+j+" is open")
                retVect = [i - 1,j]
            }
            if (mm[i - 1][j] != "closed"){
                count++
            }
        }if(j - 1 >= 0) {
            console.log("checking if i"+i+" j"+(j-1)+" is open")
            if (mm[i][j - 1] == null && retVect == null) {
                console.log("i"+i+" j"+(j-1)+" is open")
                retVect = [i, j - 1]
            }
            if (mm[i][j - 1] != "closed") {
                count++
            }
        }if(i + 1 <5) {
            console.log("checking if i"+(i+1)+" j"+j+" is open")
            if (mm[i + 1][j] == null && retVect == null) {
                console.log("i"+(i+1)+" j"+j+" is open")
                retVect = [i+1,j]
            }
            if (mm[i + 1][j]  != "closed") {
                count++
            }
        }if(j + 1 < 5){
            console.log("checking if i"+i+" j"+(j+1)+" is open")
            if(mm[i][j+1] == null && retVect == null){
                console.log("i"+i+" j"+(j+1)+" is open")
                retVect = [i,j+1]
            }
            if (mm[i][j+1] == "open") {
                count++
            }
        }

        return {openRooms: count, nextToAsign: retVect}
    }
}

//Character class
class Enemy {
    //Has some attributes, like the name, lvl(?), hp, etc.
    //Must decide whether to leave lvl, spec and sanity... might not be necesary.
    constructor(name, sprite, xm, actions) {
        this.name = name;
        this.sprite = sprite;
        this.hp = 10;
        this.totalHp = 10;
        this.atk = 5;
        this.def = 5;
        this.spd = 5;
        this.luck = 5;
        this.actions = actions;
        this.xm = xm
    }

    //Attack method takes into consideration luck. Luck is nice.
    atacc() {
        var dmg = this.atk;
        dmg += (this.luck * 3) / 100 > Math.random() ? Math.ceil(this.luck * 3 * this.atk / 100) : 0;
        eventQ.push(function () {
            setDialog(enemy.name + " attacks")
        });
        eventQ.push(function () {
            setDialog("you received " + mainC.protecc(dmg) + " damage.")
        });
        console.log("Enemy deals " + dmg + ". Your HP: " + mainC.hp)
    }

    performAction() {
        var rng = Math.random();
        for (i = 0; i < this.actions.length; i++) {
            if (this.actions[i].prob > rng) {
                return this.actions[i].funct
            }
        }
    }

    //Protect method takes into consideration defence. Noice
    protecc(dmg) {
        dmg -= Math.ceil(dmg * (this.def * 3 / 100));
        this.hp -= dmg;
        return dmg
    }

    performDeath() {
        var name = this.name;
        eventQ.push(function () {
            setDialog(name + " was defeated")
        });
        eventQ.push(function () {
            switchState("explore")
        })
    }

    draw() {
        this.sprite.draw(400, 250, 6, {x: xm, y: 0})
    }
}

//Option box class
class OptionBox {
    constructor(name, x, y, scale) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.w = scale == 6 ? 5.5 * name.length * scale + 20 : 6 * name.length * scale + 15;
        this.h = 5 * scale + 20
    }

    //Collision detection for mouse clicks. Calls event accordi
    in(x, y) {
        if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
            return true
        }
    }

    //Draws the bocs and the word inside.
    drawOptionBox() {
        if (standby) {
            ctx.fillStyle = "#18381e"
        } else {
            ctx.fillStyle = "black"
        }
        ctx.fillRect(this.x, this.y, this.w, this.h);
        drawWords(this.name, this.x + 10, this.y + 10, this.scale, 0);
        ctx.strokeRect(this.x, this.y, this.w, this.h)
    }
}

class OptionMenu {
    constructor(x, y, optionBoxNames, itemIndex) {
        this.optionBoxes = [];
        this.x = x;
        this.initial_y = y;
        this.w = 190;
        for (i = 0; i < optionBoxNames.length; i++) {
            y += 10;
            this.optionBoxes.push(new OptionBox(optionBoxNames[i], x + 10, y, 5));
            y += 50
        }
        this.h = y - this.initial_y + 10;
        this.itemIndex = itemIndex
    }

    drawMenu() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.initial_y, this.w, this.h);
        ctx.strokeRect(this.x, this.initial_y, this.w, this.h);
        for (i = 0; i < this.optionBoxes.length; i++) {
            this.optionBoxes[i].drawOptionBox()
        }
    }

    in(x, y) {
        if (x >= this.x && x <= this.x + this.w && y >= this.initial_y && y <= this.initial_y + this.h) {
            return true
        }
        return false
    }
}

class ItemSlot {
    constructor(item, x, y) {
        this.item = item;
        this.x = x;
        this.y = y;
        this.xw = x + 75;
        this.yh = y + 75
    }

    in(x, y) {
        if (x >= this.x && x <= this.xw && y >= this.y && y <= this.yh) {
            return true
        }
    }

    draw() {
        if (this.item != null) this.item.sprite.draw(this.x + 9, this.y + 8, 2.5, {x: this.item.xm, y: 0});
        ctx.strokeRect(this.x, this.y, 75, 75)
    }
}