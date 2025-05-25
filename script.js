//npx http-server -p 8080
///workspaces/Game (main) $ python -m http.server

//initialization

var WindowWidth = 20*Math.floor((window.innerWidth-40)/20);
var WindowHeight = 20*Math.floor((window.innerHeight-40)/20);
var ysize = WindowHeight/20
var xsize = WindowWidth/20
var bullets = []
var lonelyWeapons = []
var spawenedWeapons
var tick = 0
var tickReset = 500
var end = false
let lduck
let cloud
let rduck
let grass
let platform
let rgun
let lgun
let lsword
let rsword
let arsword
let alsword
let lshield
let rshield
let alshield
let arshield
let rock

var platforms = []
function preload(){
  platform = loadImage('/images/platform.png')
  grass = loadImage('/images/grass.jpg')
  lduck = loadImage('/images/tlduck.png')
  rduck = loadImage('/images/trduck.png')
  cloud = loadImage('/images/tcloud.png')
  rgun = loadImage('/images/rgun.png')
  lgun = loadImage('/images/lgun.png')
  lsword = loadImage('/images/lsword.png')
  rsword = loadImage('/images/rsword.png')
  alsword = loadImage('/images/alsword.png')
  arsword = loadImage('/images/arsword.png')
  lshield = loadImage('/images/lshield.png')
  rshield = loadImage('/images/rshield.png')
  alshield = loadImage('/images/alshield.png')
  arshield = loadImage('/images/arshield.png')
  rock = loadImage('/images/rock.png')
}



class Fist{
  constructor(){
    this.damage = 0
    this.damageReduction = 1
    this.left = false
  }
  update(){}
  attack(){}
}

class Sword{
  constructor(player = 0){
    this.player = player
    this.damage = 5
    this.left = false
    this.attackTime = 6
    this.attackTick = 0
    this.MasterX = 2.25*xsize
    this.MasterY = 4.5*ysize
    this.damageReduction = 1
  }
  attack(left, x, y){
    var player = arr[this.player-1]
    let otherPlayer
    if(player == playerOne){
      otherPlayer = playerTwo
    }else{
      otherPlayer = playerOne
    }
    if(left){
      if(player.x-otherPlayer.x < 3*xsize && player.x - otherPlayer.x > -5 && Math.abs(player.y - otherPlayer.y) <= ysize){
        otherPlayer.takeDamage(this.damage, this.left)
      } 
    }else{
      if(player.x-otherPlayer.x >-3*xsize && player.x - otherPlayer.x <5 && Math.abs(player.y - otherPlayer.y) <= ysize){
        otherPlayer.takeDamage(this.damage, this.left)
      } 
    }
    this.attackTick = this.attackTime
  }
  show(){
    if(this.player>0){
      if(this.left){
        if(this.attackTick>0){
          image(alsword, arr[this.player-1].x-xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
        }else{
          image(lsword, arr[this.player-1].x-xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
        }
      }else{
        if(this.attackTick>0){
          image(arsword, arr[this.player-1].x+3.5*xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
        }else{
          image(rsword, arr[this.player-1].x+3.5*xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
        }
      }
    }else{
      image(lsword, this.MasterX, this.MasterY, xsize/2, ysize/2)
    }
  }

  update(){
    this.show()
    if(this.attackTick>0){
      this.attackTick--
    }
  }
}

class Gun{
  constructor(player = 0){
    this.player = player
    this.damage = 2
    this.left = false
    this.MasterX = 17.5*xsize
    this.MasterY = 2.5*ysize
    this.damageReduction = 1
  }
  attack(left, x, y){
    if(left){
      bullets.push(new Bullet(x-25, y+(ysize/2),-1))
    }else{
      bullets.push(new Bullet(x+xsize+25, y+(ysize/2),1))
    }
    
  }
  show(){
    if(this.player>0){
      if(this.left){
        image(lgun, arr[this.player-1].x-xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
      }else{
        image(rgun, arr[this.player-1].x+3.5*xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
      }
    }else{
      image(lgun, this.MasterX, this.MasterY, xsize/2, ysize/2)
    }
  }
  update(){
    this.show()
  }
}

class Shield{
  constructor(player = 0){
    this.player = player
    this.damage = 2
    this.left = false
    this.MasterX = 13.5*xsize
    this.MasterY = 2.5*ysize
    this.attackTick = 0
    this.damageReduction = 2
    this.attackTime = 6
  }
  attack(left){
    var player = arr[this.player-1]
    let otherPlayer
    if(player == playerOne){
      otherPlayer = playerTwo
    }else{
      otherPlayer = playerOne
    }
    if(left){
      if(player.x-otherPlayer.x < 3*xsize && player.x - otherPlayer.x > -5 && Math.abs(player.y - otherPlayer.y) <= ysize){
        otherPlayer.takeDamage(this.damage, this.left)
      } 
    }else{
      if(player.x-otherPlayer.x >-3*xsize && player.x - otherPlayer.x <5 && Math.abs(player.y - otherPlayer.y) <= ysize){
        otherPlayer.takeDamage(this.damage, this.left)
      } 
    }
    this.attackTick = this.attackTime
  }

  show(){
    if(this.player>0){
      if(this.left){
        if(this.attackTick>0){
          image(alshield, arr[this.player-1].x-xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
        }else{
          image(lshield, arr[this.player-1].x-xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
        }
      }else{
        if(this.attackTick>0){
          image(arshield, arr[this.player-1].x+3.5*xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
        }else{
          image(rshield, arr[this.player-1].x+3.5*xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
        }
      }
    }else{
      image(lshield, this.MasterX, this.MasterY, xsize/2, ysize/2)
    }
  }

  update(){
    this.show()
    if(this.attackTick>0){
      this.attackTick--
    }
  }
}

class Grenade{
  constructor(){
    this.damage = 5
  }
  attack(left, x, y){
    
  } 
}

class Duck{
  constructor(x,y, player){
    this.y = y
    this.x = x
    this.health = 100
    this.facingLeft = false
    this.yspeed = 0
    this.damage = 0
    this.player = player
    this.weapon = new Fist(player)
    this.onGround = true
    this.onPlatform = false
  }
  attack(){
    this.weapon.attack(this.facingLeft, this.x, this.y)
  }
  takeDamage(damage, dir){
    var left = false
    if(dir<0){
      left = true
    }
    if(this.facingLeft == left){
      this.damage += damage
    }else{
      this.damage += damage/this.weapon.damageReduction
    }
  }
  move(inp){
    this.x = Math.floor(this.x + xsize/16*inp)
    if(inp>0){
      this.x = this.x+1
    }
    this.x = constrain(this.x, 0, WindowWidth-xsize)
    if(inp<0){
      this.facingLeft = true
      this.weapon.left = true
    }else{
      this.facingLeft = false
      this.weapon.left = false
    }
  }
  jump(){
    this.yspeed = 15
    this.onGround = false
  }
  show(){
    fill(0)
    // rect(this.x, this.y, xsize, ysize)
    if(this.facingLeft){
      image(lduck, this.x, this.y, xsize, ysize)
    }else{
      image(rduck, this.x, this.y, xsize, ysize)
    }
    
  }
  update(){
    if(this.y>= WindowHeight-2*ysize){
      this.y = WindowHeight-2*ysize
      this.onGround = true
    }
    if(this.onGround == false){
      this.yspeed = this.yspeed-1
    }
    land(playerOne)
    land(playerTwo)
    this.y = this.y-this.yspeed
    this.y = constrain(this.y, 0, WindowHeight-2*ysize)
    this.show()
    this.weapon.update()
  }
}

class Bullet {
  constructor(x, y, dir){
    this.y = y;
    this.x = x;
    this.dir = dir
    this.xspeed = Math.floor(WindowWidth/40);
    if(Math.floor(WindowWidth/500)>0){
      this.xWidth = Math.floor(WindowWidth/155);
    }else{
      this.xWidth = 1;
    }
    if(Math.floor(WindowHeight/155)>0){
      this.yWidth = Math.floor(WindowHeight/500);
    }else{
      this.yWidth = 1;
    }
    
  }

  location() {
    this.x = this.x + this.xspeed*this.dir;
  }

  fill(){
    fill(0,0,0);
    rect(this.x-2, this.y-2, this.xWidth+4, this.yWidth+4);
  }

  show() {
    
    fill(255);
    rect(this.x, this.y, this.xWidth, this.yWidth);

  }
  update() {
    this.fill();
    this.location();
    this.show();

  }

}

class Platform{
  constructor(x1, y1, width, height){
    this.x = x1,
    this.y = y1, 
    this.width = width
    this.height = height
  }
  show(){
    image(platform, this.x, this.y, this.width, this.height)
  }
}

class Rock extends Platform{
  constructor(x1,y1,width,height){
    super(x1,y1,width,height)
  }
  show(){
    image(rock, this.x, this.y, this.width, this.height)
  }
}

function land(player){
  for(var i=0; i<platforms.length; i++){
    if(
    (platforms[i].x < player.x+xsize 
    && platforms[i].x + platforms[i].width > player.x 
    && platforms[i].y >= player.y + ysize 
    && platforms[i].y + player.yspeed <= player.y+ysize)
    && player.yspeed <1)
    {
      player.onGround = true
      player.yspeed = 0
      player.y = platforms[i].y - ysize
      
    }else{
      player.onGround = false
      
    }
    if(
    (platforms[i].x < player.x+xsize 
    && platforms[i].x + platforms[i].width > player.x 
    && platforms[i].y +platforms[i].height <= player.y 
    && platforms[i].y + player.yspeed + platforms[i].height >= player.y )
    && player.yspeed >0 ){
      player.yspeed = player.y - platforms[i].y - platforms[i].height - 1
    }
    //check to see if it is hitting on either side
    if(player.x + xsize > platforms[i].x && player.x + xsize - Math.floor(xsize/16) -1 <= platforms[i].x
    && player.y + ysize > platforms[i].y 
    && player.y < platforms[i].y + platforms[i].height && player.facingLeft == false){
      player.x = platforms[i].x - xsize -1
    }

    if(player.x < platforms[i].x + platforms[i].width && player.x + Math.floor(xsize) +1 >= platforms[i].x + platforms[i].width
    && player.y + ysize > platforms[i].y 
    && player.y < platforms[i].y + platforms[i].height && player.facingLeft == true){
      player.x = platforms[i].x + platforms[i].width + 1
    }
    
  }

}

function pickUp(){
  for(var i=0; i<arr.length; i++){
    for(var m=0; m<lonelyWeapons.length; m++){
      if(arr[i].x < lonelyWeapons[m].MasterX 
        && arr[i].x + xsize > lonelyWeapons[m].MasterX 
        && Math.floor(arr[i].y - lonelyWeapons[m].MasterY)<=ysize){
          if(arr[i].weapon.damage>0){
            arr[i].weapon.player = 0
            temp = arr[i].weapon
            arr[i].weapon = lonelyWeapons.splice(m, 1)[0]
            lonelyWeapons.push(temp)
            arr[i].weapon.player = i+1
          }else{
            arr[i].weapon = lonelyWeapons.splice(m, 1)[0]
            arr[i].weapon.player = i+1
          }
        }
    }
  }
}

function hit(){
  var bul = -4;
  var p = 0
  var left = false
  for(var b=0; b<bullets.length; b++){
    if (((bullets[b].x - playerOne.x) > -3) && ((bullets[b].x - playerOne.x) < xsize + 3) && playerOne.y < bullets[b].y && playerOne.y + ysize >bullets[b].y){
      bul = b;
      left = bullets[b].dir
      p = 1
    }
    if (((bullets[b].x - playerTwo.x) > -3) && ((bullets[b].x - playerTwo.x) < xsize + 3) && playerTwo.y < bullets[b].y && playerTwo.y + ysize >bullets[b].y){
      bul = b;
      left = bullets[b].dir
      p = 2
    }
      
    }

  if(bul != -4){
    bullets[bul].fill();
    if(bul == 0){
      bullets.shift();
    }else{
       bullets.splice(bul, 1);
    }
    if(p==1){
      playerOne.takeDamage(playerTwo.weapon.damage, left)
    }
    if(p==2){
      playerTwo.takeDamage(playerOne.weapon.damage, left)
    }
    
  }
}

function hitObstacle(){
  var bul = -4;
  for(var i=0; i<platforms.length; i++){
    for(var b=0; b<bullets.length; b++){
      if (((bullets[b].x - platforms[i].x) > -3) 
      && ((bullets[b].x - platforms[i].x) < platforms[i].width + 3) 
      && platforms[i].y < bullets[b].y 
      && platforms[i].y + platforms[i].height >bullets[b].y){
        bul = b;
      } 
    }
  }

  if(bul != -4){
    bullets[bul].fill();
    if(bul == 0){
      bullets.shift();
    }else{
       bullets.splice(bul, 1);
    }
  }
}

function header(){
  var damageLeftp2 = (playerTwo.health-playerTwo.damage)
  var damageLeftp1 = (playerOne.health-playerOne.damage)
  document.getElementById("damage").innerHTML = "Player One Health: " + damageLeftp1 + "      Player Two Health: " + damageLeftp2;
  if(damageLeftp2<=0 || damageLeftp1<=0){
    end = true
    document.getElementById("end").innerHTML = "Game Over"
  }
}

function keys(){
  if(keyIsDown(LEFT_ARROW)){
    playerTwo.move(-1)
  }
  if(keyIsDown(RIGHT_ARROW)){
    playerTwo.move(1)
  }
  if(keyIsDown(65)){
    playerOne.move(-1)
  }
  if(keyIsDown(68)){
    playerOne.move(1)
    }
}

function updates(){
  playerOne.update()
  playerTwo.update()
  for (var i = 0; i < bullets.length; i++) {
    if(bullets[i] != ""){
      bullets[i].update()
    }

  }
  for(var i=0; i<lonelyWeapons.length; i++){
    lonelyWeapons[i].update()
  } 
}

function images(){
  fill(106,202,95)
  image(grass,0,WindowHeight-ysize,WindowWidth,ysize)
  fill(230,250,255)
  rect(0,0,WindowWidth,WindowHeight-ysize)
  image(cloud, xsize, ysize, 5*xsize, 3*ysize)
  image(cloud, 14*xsize, 6*ysize, 6*xsize, 4*ysize)
  for(var i=0; i<platforms.length; i++){
      platforms[i].show()
  }
}

function playAgain(){
  bullets = []
  end = false
  playerOne.damage = 0
  playerTwo.damage = 0
}

function setup() {
  createCanvas(WindowWidth,WindowHeight)
  noStroke()
  fill(106,202,95)
  rect(0,0,WindowWidth,WindowHeight)
}




var playerOne = new Duck(WindowWidth/20,WindowHeight-ysize, 2)
var playerTwo = new Duck(18*WindowWidth/20,WindowWidth-ysize, 1)
var arr = [playerOne, playerTwo]
platforms.push(new Platform(1*xsize,5*ysize, 3*xsize, ysize))
platforms.push(new Platform(12*xsize,3*ysize, 7*xsize, 3*ysize))
platforms.push(new Platform(7*xsize,6*ysize, 4*xsize, 2*ysize))
platforms.push(new Rock(5* xsize, 18*ysize, xsize, ysize))
platforms.push(new Rock(8* xsize, 17*ysize, 2*xsize, 2*ysize))
platforms.push(new Rock(14* xsize, 18*ysize, xsize, ysize))
playerOne.facingLeft = true
playerOne.weapon.left = true
var damageLeftp2 = (playerTwo.health-playerTwo.damage)
var damageLeftp1 = (playerOne.health-playerOne.damage)
lonelyWeapons.push(new Sword, new Sword, new Gun, new Gun, new Shield, new Shield)
document.getElementById("damage").innerHTML = "Player One Health: " + damageLeftp1 + " Player Two Health: " + damageLeftp2;

function draw() {
  if(!end){
    images()
    keys()
    updates()
    hit()
    hitObstacle()
    header()
    pickUp()
  }
}


function keyPressed(){
  if(keyCode == UP_ARROW){
    playerTwo.jump()
  }
  if(keyCode == DOWN_ARROW){
    playerTwo.attack()
  }
  if(key === 'w'){
    playerOne.jump()
  }
  if(key === 's'){
    playerOne.attack()
  }
  
}
