export function getRandColorBySeed(seed) {
  // _debug("===>>>",seed)
  var randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values
  function seedrand(seed) {
    for (let i = 0; i < randseed.length; i++) {
      randseed[i] = 0;
    }
    for (var i = 0; i < seed.length; i++) {
      randseed[i % 4] = ((randseed[i % 4] << 5) - randseed[i % 4]) + (seed.charCodeAt(i));
    }
  }

  function rand() {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    var t = randseed[0] ^ (randseed[0] << 11);

    randseed[0] = randseed[1];
    randseed[1] = randseed[2];
    randseed[2] = randseed[3];
    randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8));

    return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
  }

  function createColor() {
    //saturation is the whole color spectrum
    var h = Math.floor(rand() * 360);
    //saturation goes from 40 to 100, it avoids greyish colors
    var s = ((rand() * 60) + 40) + '%';
    //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    var l = ((rand() + rand() + rand() + rand()) * 25) + '%';
    return 'hsl(' + h + ',' + s + ',' + l + ')';
  }

  seedrand(seed)
  return createColor()
}

export function randomColor(seed) {
  let color;
  if (seed) {
    color = getRandColorBySeed(seed);
  } else {
    color = "rgba(";
    for (let i = 0; i < 3; i++) {
      color += parseInt(Math.random() * 256) + ",";
    }
    color += 1 + ")";
  }

  return color;
}
