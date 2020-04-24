var fft;
var mic;
var button;

var w;
var bands;
var curr;
var ignored;
var micIsOn = false;
var finalSpectrum;
var gapFromTop;

function setup() {
  // put setup code here
  createCanvas(600 ,200); //this would usually be WindowWidth,height
  getAudioContext().suspend();
  console.log(getAudioContext().state);
  bands = 64; //64 worked best, 128 is too many bands to plot plus we dont care for the information on pitch
  gapFromTop = 20; //In Pixels
  fft = new p5.FFT(0.80,bands); //smoothing the values to 0.8 thus getting a cleaner plot
  button = createButton("Start Mic");
  button.mousePressed(micOn);
  ignored = 10;
  w = Math.floor((width) / (2*(bands-ignored)));
  console.log("ignored = " + ignored);
  console.log("bandwidth = " + w);
}


function micOn() { // button toggle
  console.log(getAudioContext().state);
  if(getAudioContext().state == 'running'){
    getAudioContext().suspend();
    micIsOn = false;
    mic.stop();
    button.html("Start Mic");
  }
  else {
    getAudioContext().resume();
    mic = new p5.AudioIn();
    fft.setInput(mic);
    micIsOn = true;
    mic.start();
    button.html("Stop Mic");
  }
}

function draw() {
  background(0)
  stroke(64,64,64);
  line(0,height/2,width,height/2)
  var spectrum = fft.analyze();
  var maxVal = Math.max(spectrum);
  var arrAvg = spectrum => spectrum.reduce((a,b) => a + b, 0) / spectrum.length
  if(micIsOn) {
    if(mic.getLevel() < 0.0005){
      spectrum = spectrum.map(function(x) { return Math.floor(random(10,15)); });
    }
    noStroke();
    //color -  #D2EDD4 ---- prog - '#46B54D'
    for (let i = ignored; i < spectrum.length - ignored; i++){
      var amp = spectrum[i]*0.75;
      if(mic.getLevel() > 0.005){
        if(i > ignored + 15){
          amp += Math.random(maxVal*0.7,maxVal);
        }
      }
      if(amp < 0)
          amp = maxVal*0.75;
      var x = map(i, ignored, spectrum.length - ignored - 1, gapFromTop, (width/2))
      var y;
      y = map(amp, 0, 256, 0, height/2 - gapFromTop);
      var gre = map(i,ignored,64 - ignored,150,255);
      var blu = map(i,ignored,64 - ignored,50,160);
      fill(255,gre,blu);
      rect(x, height/2, w - 1, -y);
      rect((width - x), height/2, w - 1, -y);
    }
  }
}