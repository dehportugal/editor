import { fabric } from 'fabric'; // Assumindo que você está usando a biblioteca 'fabric.js'

export function createIcon({ icon, canvas }) {
  // Adiciona o ícone ao canvas
  // Você precisará adaptar isso para a biblioteca de ícones que está usando e as propriedades específicas do ícone
  const iconElement = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
  });
  canvas.add(iconElement);
  canvas.renderAll();
}

