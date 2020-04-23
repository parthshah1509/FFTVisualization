var fft;
var mic;
var button;

var w; //width of the bands
var bands; //number of bands for the FFT variable
var curr;
// var ignored; //was using to ignore a few pitches but found a different way to do so
var micIsOn = false; //boolean to check if the mic is on
// var gap;

function setup() {
  // put setup code here
  createCanvas(600 ,200) //this would usually be WindowWidth,height
  bands = 64; //64 worked best, 128 is too many bands to plot plus we dont care for the information on pitch
  mic = new p5.AudioIn();
  // colorMode(HSB)
  button = createButton("Start Mic");
  button.mousePressed(micOn);
  fft = new p5.FFT(0.80,bands); //smoothing the values to 0.8 thus getting a cleaner plot
  fft.setInput(mic);
  // ignored = Math.floor(bands/8);
  // w = Math.floor((width) / (2*bands));
  w = (width) / (2*bands) // calculate width of bands
  // gap = width/10;
  // console.log("ignored = " + ignored);
  console.log(" Bandwidth = " + w);
}


function micOn() { // button toggle
  if(mic.getLevel()){
    micIsOn = false;
    mic.stop();
    button.html("Start Mic");
  }
  else {
    micIsOn = true;
    mic.start();
    button.html("Stop Mic");
  }
}

function draw() {
  background(0); //balck background
  stroke(64,64,64); // middle line
  line(0,height/2,width,height/2)
  var spectrum = fft.analyze(); // list of FFT values
  if(micIsOn && mic.getLevel() < 0.0005){
    spectrum = spectrum.map(function(x) { return Math.floor(random(10,15)); });  //random for when mic is on but nothing is being said
  }
  noStroke();
  //color -  #D2EDD4 ---- prog - '#46B54D'
  var amp;
  for (let i = 0; i < spectrum.length; i++){
    amp = spectrum[bands - i - 1];
    // dampen some pitches?
    if(bands - i - 1 < 35){
      amp *= 0.85
    }
    var x = i*w;
    // var x = map(i*w,0,(bands-1)*w,gap,width-gap);
    var y = map(amp, 0, 256, 0, height/2);
    var gre = map(i,0,32,150,240);
    var blu = map(i,0,32,50,150);
    fill(255,gre,blu);
    rect(x, height/2, w - 1, -y);
    rect((width - x), height/2, w - 1, -y);
  }
  rect(bands*w,height/2, w-1, -spectrum[0]*0.5) //central band
}