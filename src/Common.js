// valueToBTC :: number -> string
function valueToBTC(value) {
  if (value < 0) {
    return ('-' + satsToBTC(Math.abs(value).toString()));
  } else {
    return satsToBTC(value.toString());
  }
}

// satsToBTC :: string -> string
function satsToBTC(sats) {
  const split = sats.length - 8; // bitcoin has 8 decimal places
  if (split > 0) {
    const whole = parseInt(sats.slice(0, split));
    return whole.toLocaleString() + '.' +
      sats.slice(split, sats.length) + ' BTC';
  }
  return '0.' + '0'.repeat(Math.abs(split)) + sats + ' BTC';
}

export {valueToBTC, satsToBTC};
