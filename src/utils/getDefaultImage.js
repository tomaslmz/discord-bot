module.exports = ({ discriminator, id }) => {
  if (discriminator > '5') {
    return parseInt(discriminator) % 5;
  }

  return (BigInt(parseInt(id)) >> 22n) % 6n;
}
