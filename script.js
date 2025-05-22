//npx http-server -p 8080
///workspaces/Game (main) $ python -m http.server

//initialization

var WindowWidth = 20*Math.floor((window.innerWidth-40)/20);
var WindowHeight = 20*Math.floor((window.innerHeight-40)/20);
var ysize = WindowHeight/20
var xsize = WindowWidth/20
var bullets = []
var end = false

function preload(){
  // duck = loadImage('/images/duck.jpeg')
}

class Weapon{
  constructor(damage, range){
    this.damage = damage
    this.range = range
  }
}

class Fist extends Weapon{
  constructor(){
    super(2,25)
  }
}

class Gun{
  constructor(){
    this.damage = 1
  }
  attack(left, x, y){
    if(left){
      bullets.push(new Bullet(x-25, y+(ysize/2),-1))
    }else{
      bullets.push(new Bullet(x+xsize+25, y+(ysize/2),1))
    }
    
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
    this.weapon = new Gun
  }
  attack(){
    this.weapon.attack(this.facingLeft, this.x, this.y)
  }
  takeDamage(damage){
    this.damage += damage
  }
  move(inp){
    this.x = Math.floor(this.x + xsize/16*inp)
    this.x = constrain(this.x, 0, WindowWidth-xsize)
    if(inp<0){
      this.facingLeft = true
    }else{
      this.facingLeft = false
    }
  }
  jump(){
    this.yspeed = 15
  }
  show(){
    fill(0)
    rect(this.x, this.y, xsize, ysize)
    // image(this.duck, this.x, this.y, xsize, ysize)
  }
  update(){
    if(this.y < WindowHeight-ysize){
      this.yspeed = this.yspeed-1
    }
    if(this.y>= WindowHeight-ysize){
      this.y = WindowHeight-ysize
    }
    this.y = this.y-this.yspeed
    this.y = constrain(this.y, 0, WindowHeight-ysize)
    this.show()
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

function hit(){
  var bul = -4;
  var p = 0
  for(var b=0; b<bullets.length; b++){
    if (((bullets[b].x - playerOne.x) > -3) && ((bullets[b].x - playerOne.x) < xsize + 3) && playerOne.y < bullets[b].y && playerOne.y + ysize >bullets[b].y){
      bul = b;
      p = 1
    }
    if (((bullets[b].x - playerTwo.x) > -3) && ((bullets[b].x - playerTwo.x) < xsize + 3) && playerTwo.y < bullets[b].y && playerTwo.y + ysize >bullets[b].y){
      bul = b;
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
      playerOne.takeDamage(playerTwo.weapon.damage)
    }
    if(p==2){
      playerTwo.takeDamage(playerOne.weapon.damage)
    }
    var damageLeftp2 = (playerTwo.health-playerTwo.damage)
    var damageLeftp1 = (playerOne.health-playerOne.damage)
    document.getElementById("damage").innerHTML = "Player One Health: " + damageLeftp1 + "      Player Two Health: " + damageLeftp2;
    if(damageLeftp2<1 || damageLeftp1<1){
      end = true
      document.getElementById("end").innerHTML = "Game Over"
    }
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


var playerTwo = new Duck(WindowWidth/20,WindowHeight-ysize, 1)
var playerOne = new Duck(18*WindowWidth/20,WindowWidth-ysize, 2)

var damageLeftp2 = (playerTwo.health-playerTwo.damage)
var damageLeftp1 = (playerOne.health-playerOne.damage)
document.getElementById("damage").innerHTML = "Player One Health: " + damageLeftp1 + " Player Two Health: " + damageLeftp2;

function draw() {
  if(!end){

    fill(106,202,95)
    rect(0,0,WindowWidth,WindowHeight)
    if(keyIsDown(LEFT_ARROW)){
      playerOne.move(-1)
    }
    if(keyIsDown(RIGHT_ARROW)){
      playerOne.move(1)
    }
    if(keyIsDown(65)){
      playerTwo.move(-1)
    }
    if(keyIsDown(68)){
      playerTwo.move(1)
    }
    playerOne.update()
    playerTwo.update()
    for (var i = 0; i < bullets.length; i++) {
        if(bullets[i] != ""){
          bullets[i].update()
        }

    }
    hit()
  }
}


function keyPressed(){
  if(keyCode == UP_ARROW){
    playerOne.jump()
  }
  if(keyCode == DOWN_ARROW){
    playerOne.attack()
  }
  if(key === 'w'){
    playerTwo.jump()
  }
  if(key === 's'){
    playerTwo.attack()
  }
  
}