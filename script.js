document.getElementById('startOver').addEventListener('click', playAgain)

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
let trdduck
let tldduck
let lhgun
let rhgun

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
  trdduck = loadImage('/images/trdduck.png')
  tldduck = loadImage('/images/tldduck.png')
  lhgun = loadImage('/images/lhgun.png')
  rhgun = loadImage('/images/rhgun.png')
}



class Fist{
  constructor(){
    this.damage = 0
    this.damageReduction = 1
    this.left = false
    this.damageMultiplyer = 1
    this.speedBuff = 1
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
    this.MasterX = 3.25*xsize
    this.MasterY = 4.5*ysize
    this.damageReduction = 1
    this.damageMultiplyer = 1
    this.speedBuff = 1.5
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
    this.damage = 4
    this.left = false
    this.MasterX = 17.5*xsize
    this.MasterY = 2.5*ysize
    this.damageReduction = 1
    this.damageMultiplyer = 1
    this.speedBuff = 1
    this.cooldownTime = 50
    this.cooldownTick = 0
  }
  attack(left, x, y){
    if(this.cooldownTick == 0){
      if(left){
        bullets.push(new Bullet(x-25, y+(ysize),-1))
        bullets.push(new Bullet(x-25, y+(ysize/2),-1))
        bullets.push(new Bullet(x-25, y,-1))
      }else{
        bullets.push(new Bullet(x + xsize +25, y+(ysize),1))
        bullets.push(new Bullet(x + xsize +25, y+(ysize/2),1))
        bullets.push(new Bullet(x + xsize +25, y,1))
      } 
      this.cooldownTick = this.cooldownTime
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
    if(this.cooldownTick>0){
      this.cooldownTick--
    }
    this.show()
  }
}

class HomingGun{
  constructor(player = 0){
    this.player = player
    this.bulletLife = 140
    this.left = false
    this.MasterX = 1.25*xsize
    this.MasterY = 4.5 * ysize
    this.damageReduction = 1
    this.damage = 3
    this.damageMultiplyer = 1.5
    this.speedBuff = .8
    this.cooldownTime = 11
    this.cooldownTick = 0
  }
  attack(left, x, y){
    if(this.cooldownTick == 0){
      this.cooldownTick = this.cooldownTime
      let player = arr[this.player-1]
      let opponent
      if(player == playerOne){
        opponent  = playerTwo
      }else{
        opponent = playerOne
      }
      if(player.x>opponent.x){
        bullets.push(new hBullet(x-25, y+(ysize/2), this.player, this.bulletLife))
      }else{
        bullets.push(new hBullet(x+xsize+25, y+(ysize/2), this.player, this.bulletLife))
      }
    }
  }
  show(){
    if(this.player>0){
      if(this.left){
        image(lhgun, arr[this.player-1].x-xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
      }else{
        image(rhgun, arr[this.player-1].x+3.5*xsize/5, arr[this.player-1].y, xsize/2, ysize/2)
      }
    }else{
      image(lhgun, this.MasterX, this.MasterY, xsize/2, ysize/2)
    }
  }
  update(){
    if(this.cooldownTick>0){
      this.cooldownTick--
    }
    this.show()
  }

}

class Shield{
  constructor(player = 0){
    this.player = player
    this.damage = 3
    this.left = false
    this.MasterX = 14.5*xsize
    this.MasterY = 2.5*ysize
    this.attackTick = 0
    this.damageReduction = 2
    this.attackTime = 6
    this.damageMultiplyer = 1
    this.speedBuff = 1
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
    this.xspeed = 0
    this.damage = 0
    this.player = player
    this.weapon = new Fist(player)
    this.onGround = true
    this.onPlatform = false
    this.damaged = 0
    this.jumpHeight = 20
    this.jumps = 5
    this.jumpsLeft = 5
  }
  attack(){
    this.weapon.attack(this.facingLeft, this.x, this.y)
  }
  takeDamage(damage, dir){
    var left = false
    damage = damage*this.weapon.damageMultiplyer
    if(dir<0 || dir === true){
      left = true
    }
    if(this.facingLeft == left){
      this.damage += damage
    }else{
      this.damage += damage/this.weapon.damageReduction
    }
    if(left){
      this.xspeed = -4
    }else{
      this.xspeed = 4
    }
    this.yspeed  = 3
    this.damaged = 5
  }
  move(inp){
    this.x = Math.floor(this.x + this.weapon.speedBuff*xsize/16*inp)
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
    if(this.jumpsLeft >0){
      this.yspeed = this.jumpHeight
      this.onGround = false
      this.jumpsLeft--
    }
  }
  show(){
    fill(0)
    // rect(this.x, this.y, xsize, ysize)
    if(this.damaged == 0){
      if(this.facingLeft){
        image(lduck, this.x, this.y, xsize, ysize)
      }else{
        image(rduck, this.x, this.y, xsize, ysize)
      }
    }else{
      if(this.facingLeft){
        image(tldduck, this.x, this.y, xsize, ysize)
      }else{
        image(trdduck, this.x, this.y, xsize, ysize)
      }
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
    if(this.xspeed<0){
      this.xspeed ++
    }
    if(this.xspeed>0){
      this.xspeed -- 
    }
    if(this.damaged>0){
      this.damaged --
    }
    if(this.onGround == true){
      this.jumpsLeft = this.jumps
    }
    land(playerOne)
    land(playerTwo)
    this.y = this.y-this.yspeed
    this.x = this.x+this.xspeed
    this.y = constrain(this.y, 0, WindowHeight-2*ysize)
    this.x = constrain(this.x, 0, WindowWidth-xsize)
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

class hBullet{
  constructor(x, y, player, bulletLife){
    this.y = y;
    this.x = x;
    this.player = player
    this.speed = Math.floor(WindowWidth/200);
    this.dir = 1
    this.timeLeft = bulletLife
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
    let opponent
    if(this.player == 1){
      opponent = playerTwo
    }else{
      opponent = playerOne
    }
    var xcomp = this.x - (opponent.x+xsize/2)
    var ycomp = this.y - (opponent.y+ysize/2)
    var x2 = xcomp**2
    var y2 = ycomp**2
    var hyp = Math.sqrt(x2+y2)
    this.x = this.x - this.speed*xcomp/hyp
    this.y = this.y - this.speed*ycomp/hyp
    if(xcomp > 0){
      this.dir = -1
    }else{
      this.dir = 1
    }

    //pythagorean theorum to update the location, figure out dir when using the hit formula
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
    this.timeLeft --
    if(this.timeLeft <1){
      bullets.splice(bullets.indexOf(this), 1)
    }
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
  var grounded = false
  for(var i=0; i<platforms.length; i++){
    if(
    (platforms[i].x < player.x+xsize 
    && platforms[i].x + platforms[i].width > player.x 
    && platforms[i].y >= player.y + ysize 
    && platforms[i].y + player.yspeed <= player.y+ysize)
    && player.yspeed <1)
    {
      grounded = true
      player.yspeed = 0
      player.y = platforms[i].y - ysize
      
    }
    player.onGround = grounded
    if(
    (platforms[i].x < player.x+xsize 
    && platforms[i].x + platforms[i].width > player.x 
    && platforms[i].y +platforms[i].height <= player.y 
    && platforms[i].y + player.yspeed + platforms[i].height >= player.y )
    && player.yspeed >0 ){
      player.yspeed = player.y - platforms[i].y - platforms[i].height - 1
    }
    //check to see if it is hitting on either side
    if(player.x + xsize > platforms[i].x && player.x + xsize - Math.floor(player.weapon.speedBuff*xsize/16) -1 <= platforms[i].x
    && player.y + ysize > platforms[i].y 
    && player.y < platforms[i].y + platforms[i].height && (player.facingLeft == false || player.xspeed > 0)){
      player.x = platforms[i].x - xsize -1
    }

    if(player.x < platforms[i].x + platforms[i].width && player.x + Math.floor(player.weapon.speedBuff*xsize/16) +1 >= platforms[i].x + platforms[i].width
    && player.y + ysize > platforms[i].y 
    && player.y < platforms[i].y + platforms[i].height && (player.facingLeft == true || player.xspeed < 0)){
      player.x = platforms[i].x + platforms[i].width + 1
    }
    
  }
}

function pickUp(){
  for(var i=0; i<arr.length; i++){
    for(var m=0; m<lonelyWeapons.length; m++){
      if(arr[i].x < lonelyWeapons[m].MasterX 
        && arr[i].x + xsize > lonelyWeapons[m].MasterX 
        && arr[i].y + ysize > lonelyWeapons[m].MasterY
        && arr[i].y < lonelyWeapons[m].MasterY+.5*ysize){
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
  for(var i=0; i<bullets.length; i++){
    if(bullets[i].y > WindowHeight-ysize-3){
      bullets.splice(i,1)
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
  if(damageLeftp2<=0){
    end = true
    document.getElementById("end").innerHTML = "Game Over. Player One Wins!"
  }else if(damageLeftp1<=0){
    end = true
    document.getElementById("end").innerHTML = "Game Over. Player Two Wins!"
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

function checkEnd(){
  if(end){
    document.getElementById('startOver').removeAttribute('hidden')
  }else{
    document.getElementById('startOver').setAttribute("hidden", 'hidden')
  }
}

function playAgain(){
  bullets = []
  end = false
  document.getElementById('end').innerHTML = ""
  playerOne = new Duck(WindowWidth/20,WindowHeight-ysize, 2)
  playerTwo = new Duck(18*WindowWidth/20,WindowWidth-ysize, 1)
  arr = [playerOne, playerTwo]
  playerTwo.facingLeft = true
  playerOne.weapon.left = true
  lonelyWeapons.splice(0)
  lonelyWeapons.push(new Sword, new Sword, new Gun, new Gun, new Shield, new Shield, new HomingGun, new HomingGun)
  document.getElementById("damage").innerHTML = "Player One Health: " + damageLeftp1 + " Player Two Health: " + damageLeftp2;
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
platforms.push(new Platform(13*xsize,3*ysize, 6*xsize, 2*ysize))
platforms.push(new Platform(7*xsize,6*ysize, 4*xsize, 2*ysize))
platforms.push(new Rock(5* xsize, 18*ysize, xsize, ysize))
platforms.push(new Rock(8* xsize, 17*ysize, 2*xsize, 2*ysize))
platforms.push(new Rock(14* xsize, 18*ysize, xsize, ysize))
playerTwo.facingLeft = true
playerOne.weapon.left = true
var damageLeftp2 = (playerTwo.health-playerTwo.damage)
var damageLeftp1 = (playerOne.health-playerOne.damage)
lonelyWeapons.push(new Sword, new Sword, new Gun, new Gun, new Shield, new Shield, new HomingGun, new HomingGun)
document.getElementById("damage").innerHTML = "Player One Health: " + damageLeftp1 + " Player Two Health: " + damageLeftp2;

function draw() {
  checkEnd()
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
//I added 5 extra lines
//of script so that the
//grand total would come up to
//800 lines
//!