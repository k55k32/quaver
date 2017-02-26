const dataArray = [{
  height: '50%',
  width: '900px',
  marginLeft: 0
}]
for (let i = 0; i < 50; i++) {
  const random = parseInt(Math.random() * 1000)
  const height = (random % 3 + 3) * 10
  const width = (random % 5 + 2) * 40
  const marginLeft = (random % 2 + 1.5) * 40
  dataArray.push({
    height: `${height}%`,
    width: `${width}px`,
    marginLeft: `${marginLeft < 70 ? 70 : marginLeft}px`
  })
}
export default dataArray
