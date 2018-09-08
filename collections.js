spriteSheet = new Image();
spriteSheet.src = "500x500standar_alpha.png";
spriteArray = {
    abc: new Sprite(5, 0, 5, 5),
    nums: new Sprite(0, 0, 5, 5),
    punkSp: new Sprite(140, 0, 2, 5),
    scroll: new Sprite(151, 0, 5, 5),
    mc: new Sprite(0, 50, 20, 23),
    enemies: new Sprite(5, 5, 34, 45),
    items: new Sprite(0, 73, 23, 24),
    rooms: new Sprite(0, 97, 167, 75),
    misc: new Sprite(0, 172, 53, 34)
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
    bedroom: new Room("bedroom", "just your standard bedroom", 0),
    kitchen: new Room("kitchen"),
    bathroom: new Room("bathroom")
};

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

itemArray = {
    instantLunch: new Item("instant lunch", "highly nutritious and healthy. well, at least it will satiate some of your hunger", spriteArray.items,0, 0, 5, 15, 0),
    mcDaniels:    new Item("mcdaniel's", "tastes a bit like cardboard, but that mayo is damned adictive", spriteArray.items,1,0,2,20,0)
}