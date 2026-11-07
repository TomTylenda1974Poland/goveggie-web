const form = document.querySelector('#worksheet');
form.addEventListener('submit', event => event.preventDefault());
const fields = name => form.elements.namedItem(name);
const output = document.querySelector('#calc');
const feedback = document.querySelector('#feedback');
const formatter = new Intl.NumberFormat('es-DO', {maximumFractionDigits:2});
const keys = ['lot','shift','formula','chef','allergens','pack','status','initial','left','waste','portions','next'];
const defaults = {status:'Pendiente de revisión'};
function display(name) { return fields(name).value.trim() || defaults[name] || ''; }
function update() {
  const numbers = ['initial','left','waste','portions'].map(name => fields(name));
  const [initial,left,waste,portions] = numbers.map(input => input.valueAsNumber);
  const invalid = numbers.some(input => !input.validity.valid);
  let message = 'Anota los pesos para calcular cuántos gramos se sirvieron.';
  let error = false;
  if (invalid) { message = 'Revisa las cantidades. Usa pesos positivos o cero y porciones enteras.'; error = true; }
  else if ([initial,left,waste].every(Number.isFinite)) {
    const served = Math.round((initial-left-waste)*1000000)/1000000;
    if (served < 0) { message = 'Revisa los pesos. El sobrante más la merma superan el hummus puesto en servicio.'; error = true; }
    else if ((portions === 0 && served > 0) || (portions > 0 && served === 0)) {
      message = 'Revisa las porciones y los pesos. La cantidad servida y las porciones deben corresponder al mismo turno.'; error = true;
    } else {
      message = 'Hummus servido: ' + formatter.format(served) + ' g.';
      if (portions > 0) message += ' Promedio: ' + formatter.format(served/portions) + ' g por porción.';
    }
  }
  output.textContent = message;
  output.classList.toggle('error',error);
  for (const name of keys) fields(name).parentElement.querySelector('.paper-value').textContent = display(name) || ' ';
  return !error;
}
for (const name of keys) { const node = document.createElement('span'); node.className = 'paper-value'; fields(name).after(node); }
function summary() {
  const lines = ['Hummus de zanahoria · prueba hotelera'];
  const titles = ['Lote','Fecha y turno','Receta y fichas','Responsable','Alérgenos y etiquetas','Envase y manejo','Decisión','Puesto en servicio (g)','Sobrante (g)','Merma (g)','Porciones','Siguiente envase'];
  keys.forEach((name,i) => { if (display(name)) lines.push(titles[i] + ': ' + display(name)); });
  if (!output.classList.contains('error') && output.textContent.startsWith('Hummus servido:')) lines.push(output.textContent);
  return lines.join('\n');
}
form.addEventListener('input',()=>{update(); document.querySelector('#manual').hidden=true; feedback.textContent='Guarda la ficha impresa o copia el resumen antes de cerrar esta página.';});
document.querySelector('#copy').onclick=async()=>{
  if (!update()) { feedback.textContent='Corrige las mediciones antes de copiar el resumen.'; output.scrollIntoView({block:'center'}); return; }
  const text=summary();
  try { await navigator.clipboard.writeText(text); feedback.textContent='Resumen copiado. Pégalo en «Notas de cocina» del registro.'; }
  catch { document.querySelector('#manual').hidden=false; const copy=document.querySelector('#manual-text'); copy.value=text; copy.focus(); copy.select(); feedback.textContent='Copia el texto seleccionado y pégalo en «Notas de cocina».'; }
};
document.querySelector('#print').onclick=()=>{update();window.print();};
window.addEventListener('beforeprint',update);
update();
