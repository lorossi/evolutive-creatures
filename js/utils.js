const random = (a, b) => {
  if (a == undefined && b == undefined) return random(0, 1);
  else if (b == undefined) return random(0, a);
  else if (a != undefined && b != undefined) return Math.random() * (b - a) + a;
};

const random_int = (a, b) => {
  if (a == undefined && b == undefined) return random_int(0, 1);
  else if (b == undefined) return random_int(0, a);
  else if (a != undefined && b != undefined) return Math.floor(Math.random() * (b - a) + a);
};

const random_interval = (average, interval) => {
  average = average || 0.5;
  interval = interval || 0.5;
  return random(average - interval, average + interval);
};

const random_from_array = (arr) => {
  return arr[random_int(arr.length)];
};

const dist = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const constrain = (x, min_val = 0, max_val = 1) => {
  if (x < min_val) x = min_val;
  else if (x > max_val) x = max_val;

  return x;
};
