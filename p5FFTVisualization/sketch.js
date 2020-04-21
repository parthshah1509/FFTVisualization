var fft;
var mic;
var button;

var w;
var bands;

function setup() {
  // put setup code here
  createCanvas(600 ,400)
  bands = 64;
  mic = new p5.AudioIn();
  colorMode(HSB)
  button = createButton("Start Mic");
  button.mousePressed(micOn);
  fft = new p5.FFT(0.85,bands);
  fft.setInput(mic);
  w = (width / bands)/2;
  console.log(" Bandwidth = " + w);
  // mic.start();
}


function micOn() {
  if(mic.getLevel()){
    mic.stop();
    button.html("Start Mic");
  }
  else {
    mic.start();
    button.html("Stop Mic");
  }
}

function draw() {
  background(0)
  var spectrum = fft.analyze();
  var spectrumRev = spectrum.slice().reverse();
  var finalSpectrum = spectrumRev.concat(spectrum);
  // console.log(finalSpectrum);
  // noStroke();
  //color -  #D2EDD4 ---- prog - '#46B54D'
  stroke(255)
  for (let i = 0; i < finalSpectrum.length; i++){
    var amp = finalSpectrum[i]*0.75;
    if(i > 50 || i < 80){
      amp *= 0.5;
    }
    fill((i*2)%255,255,255);
    var x = map(i, 0, finalSpectrum.length, 0, width - w);
    var y = map(amp, 0, 256, 0, height/1.5)
    rect(i*w, (height - y)/2, w, y)
  }

  // Using shapes with vertex doesnt really work
  // beginShape();
  // for (i = 0; i < finalSpectrum.length; i++) {
  //   vertex(i, map(finalSpectrum[i], 0, 255, height, 0));
  // }
  // endShape();
}