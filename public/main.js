const query = new URLSearchParams(window.location.search)
const symbols = query.get('symbols')?.split(',')
const randomInt = (min, max) => Math.floor(min + Math.random() * (max + 1 - min))
const matrixContainer = document.querySelector('.matrix-container')

/**
 * fullscreen
 */
document.addEventListener('keydown', event => {
  if (event.code === 'F11') {
    event.preventDefault()

    if (matrixContainer.requestFullscreen) {
      matrixContainer.requestFullscreen()
    } else if (matrixContainer.webkitRequestFullscreen) {
      matrixContainer.webkitRequestFullscreen()
    }
  }
})

/**
 * canvas-matrix2d
 */
const matrixConfig = {
  // symbols: () => ['0', '1'],
  // symbols: () => ['m', 'x', 't'],
  // symbols: () => ['ඞ'],
  symbols: () => symbols,
  font: {
    family: 'Matrix',
    file: 'matrix.regular.ttf',
    size: 12
  }
}

const { splash, entity } = matrixConfig
const matrix = new Matrix(matrixContainer, matrixConfig)
console.log(matrix)
matrix.start()

/**
 * stats.js
 */
let count_fireworks = document.querySelector('.matrix-counters'),
  update,
  stats

stats = new Stats
stats.setMode(0)
stats.domElement.style.position = 'fixed'
stats.domElement.style.left = '5px'
stats.domElement.style.top = '5px'
stats.domElement.id = 'stats'
document.body.appendChild(stats.domElement)

update = () => {
  stats.begin()
  stats.end()
  requestAnimationFrame(update)
}

requestAnimationFrame(update)