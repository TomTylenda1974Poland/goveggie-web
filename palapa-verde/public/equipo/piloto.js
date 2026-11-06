(() => {
  "use strict";
  const products = [
    ["Chutney de cilantro", ["Yuca con cebolla y chutney de cilantro", "Sándwich de pollo a la plancha con chutney de cilantro"]],
    ["Pesto de cilantro con semillas de auyama", ["Tostadas de huevo revuelto con pesto de cilantro", "Pasta con pesto, auyama y berenjena asadas"]],
    ["Hummus de zanahoria", ["Picadera de vegetales y casabe con hummus de zanahoria", "Wrap de vegetales a la plancha con hummus de zanahoria"]],
    ["Hummus de remolacha", ["Casabe con hummus de remolacha y aguacate", "Bowl de arroz, vegetales asados y hummus de remolacha"]],
    ["Salsa de aguacate y jalapeño", ["Tacos de pescado con repollo y salsa de aguacate y jalapeño", "Tostones con salsa de aguacate y jalapeño"]]
  ];
  const fields = {
    venue:"Tipo de cocina", product:"Producto", dish:"Plato", trialDate:"Fecha de la prueba", lot:"Lote",
    pack:"Envase", service:"Servicio", labelNotes:"Envase y etiqueta", unit:"Unidad", planned:"Cantidad prevista",
    used:"Cantidad utilizada", remaining:"Cantidad sobrante", minutes:"Tiempo observado (min)", result:"Resultado",
    nextStep:"Siguiente paso", notes:"Notas de cocina"
  };
  const quantities = ["planned","used","remaining"];
  const $ = selector => document.querySelector(selector);
  const form = $("#trial");
  const history = $("#history");
  const store = "pruebas";
  const dbName = "palapa-verde-piloto-v1";
  const maxPhotoBytes = 64 * 1024 * 1024;
  const sessions = new Map();
  let db, record, version = 0, savedVersion = 0, exportedVersion = -1;
  let queue = Promise.resolve(), blocked = false, saveFailed = false, changing = false, exporting = false;
  let paperReady = false;
  let previewUrls = [], printUrls = [];

  const uid = () => crypto.randomUUID();
  const originalRecord = () => ({id:uid(), revision:0, createdAt:new Date().toISOString(), updatedAt:null, values:{}, photos:[]});
  const present = trial => Object.values(trial.values).some(Boolean) || trial.photos.length > 0;
  const localDate = value => new Intl.DateTimeFormat("es-DO",{dateStyle:"short",timeStyle:"short"}).format(new Date(value));
  function el(tag,text) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function showAlert(message) {
    const alert = $("#storage-alert");
    alert.hidden = !message;
    alert.textContent = message;
  }
  function dbOpen() {
    return new Promise((resolve,reject) => {
      const open = indexedDB.open(dbName,1);
      open.onupgradeneeded = () => open.result.createObjectStore(store,{keyPath:"id"});
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
      open.onblocked = () => reject(new Error("Blocked"));
    });
  }
  function loadAll() {
    return new Promise((resolve,reject) => {
      const tx = db.transaction(store,"readonly"), request = tx.objectStore(store).getAll();
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  }
  function write(snapshot) {
    return new Promise((resolve,reject) => {
      const tx = db.transaction(store,"readwrite"), table = tx.objectStore(store), prior = table.get(snapshot.id);
      let conflict = false;
      prior.onsuccess = () => {
        if ((prior.result?.revision ?? 0) !== snapshot.revision) {
          conflict = true;
          tx.abort();
          return;
        }
        table.put({...snapshot,revision:snapshot.revision+1});
      };
      tx.oncomplete = () => resolve(snapshot.revision+1);
      tx.onerror = tx.onabort = () => reject(conflict ? new Error("conflict") : tx.error);
    });
  }
  function stateLabel() {
    const state = $("#save-state");
    if (!present(record)) state.textContent = "Prueba nueva";
    else if (!db || blocked || saveFailed) state.textContent = "Guarda una copia ZIP de esta prueba.";
    else if (savedVersion < version) state.textContent = "Guardando…";
    else state.textContent = "Guardado en este dispositivo.";
  }
  function changed() {
    version++;
    record.updatedAt = new Date().toISOString();
    sessions.set(record.id,record);
    $("#export-feedback").textContent = "";
    stateLabel();
    persist();
  }
  function persist() {
    queue = queue.then(async () => {
      if (!db || blocked || savedVersion===version || (!record.revision && !present(record))) return;
      const atVersion = version;
      const snap = {...record,values:{...record.values},photos:record.photos.map(photo=>({...photo}))};
      try {
        const rev = await write(snap);
        record.revision = rev;
        savedVersion = atVersion;
        if(saveFailed) showAlert("");
        saveFailed = false;
        updateHistory();
      } catch (error) {
        saveFailed = true;
        if(error?.message === "conflict") {
          blocked = true;
          showAlert("Esta prueba se cambió en otra pestaña. Descarga tu versión antes de abrir otra.");
        } else {
          showAlert("El navegador no pudo guardar la última modificación. Descarga el ZIP antes de salir.");
        }
      }
      stateLabel();
    });
    return queue;
  }
  function chosen(name,trial=record) {
    const value = trial.values[name] ?? "";
    if (name==="product" && value==="Otro") return trial.values.customProduct || "Otro producto";
    if (name==="dish" && value==="Otro") return trial.values.customDish || "Otro plato";
    return value;
  }
  function title(trial) {
    return [chosen("venue",trial),chosen("product",trial)].filter(Boolean).join(" · ") || "Prueba de cocina";
  }
  function updateHistory() {
    const entries = [...sessions.values()].filter(present).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
    history.replaceChildren();
    if (!entries.some(x=>x.id===record.id)) history.add(new Option("Prueba nueva",record.id));
    for(const item of entries) history.add(new Option(title(item)+" · "+localDate(item.updatedAt || item.createdAt),item.id));
    history.value = record.id;
  }
  function dishes() {
    const current = record.values.product;
    const choices = products.find(([name])=>name===current)?.[1] ?? products.flatMap(([,items])=>items);
    $("#dish").replaceChildren(new Option("Selecciona el plato",""),...choices.map(item=>new Option(item,item)),new Option("Otro plato","Otro"));
    $("#custom-product-label").hidden = current!=="Otro";
    $("#custom-dish-label").hidden = record.values.dish!=="Otro";
  }
  function showRecord(next) {
    record = next;
    savedVersion=version=0;
    exportedVersion=-1;
    blocked=false;
    saveFailed=false;
    showAlert(db ? "" : "El almacenamiento local no está disponible. Descarga el ZIP para conservar la prueba.");
    form.reset();
    dishes();
    for (const [key,value] of Object.entries(record.values)) {
      const control = form.elements.namedItem(key);
      if (control) control.value = value;
    }
    form.querySelector(".entry").open = false;
    $("#photo-feedback").textContent="";
    $("#export-feedback").textContent="";
    renderPhotos();
    updateHistory();
    stateLabel();
  }
  async function move(nextId) {
    if(changing || exporting) return;
    changing=true;
    history.disabled = $("#new").disabled = true;
    await persist();
    if (present(record) && savedVersion < version && exportedVersion !== version) {
      showAlert("Descarga esta prueba antes de cambiar de ficha. Todavía hay cambios sin guardar.");
      history.value=record.id;
    } else if(nextId && sessions.has(nextId)) {
      showRecord(sessions.get(nextId));
    } else if(present(record)) {
      showRecord(originalRecord());
      form.elements.venue[0].focus();
    }
    changing=false;
    history.disabled = $("#new").disabled = false;
  }
  function revoke(urls) {urls.splice(0).forEach(url=>URL.revokeObjectURL(url));}
  function photoImage(photo,urls) {
    const url=URL.createObjectURL(photo.original);
    urls.push(url);
    const img=el("img");
    img.alt=photo.caption||photo.name;
    img.src=url;
    img.addEventListener("error",()=>{
      const alternative=el("small","Vista previa no disponible. Se conserva el archivo original.");
      img.replaceWith(alternative);
    },{once:true});
    return img;
  }
  function renderPhotos() {
    revoke(previewUrls);
    const list=$("#photo-list");
    list.replaceChildren();
    for (const [i,photo] of record.photos.entries()) {
      const row=el("li");row.className="shot";
      const meta=el("div"), label=el("label","Qué muestra la foto "+(i+1)), input=el("input");
      input.value=photo.caption;input.maxLength=140;input.placeholder="Ej. etiqueta al abrir";
      input.addEventListener("input",()=>{photo.caption=input.value;changed();});
      label.append(input);
      const remove=el("button","Quitar foto");remove.type="button";
      remove.setAttribute("aria-label","Quitar foto "+(i+1)+": "+photo.name);
      remove.onclick=()=>{
        if(!confirm("¿Quitar esta foto de la ficha?")) return;
        record.photos=record.photos.filter(p=>p.id!==photo.id);
        changed();renderPhotos();
        $("#files").focus();
      };
      meta.append(el("small",photo.name),label,remove);
      row.append(photoImage(photo,previewUrls),meta);
      list.append(row);
    }
  }
  function addPhotos(input) {
    const result=[];
    let size=record.photos.reduce((sum,item)=>sum+item.original.size,0);
    for(const file of input.files || []) {
      if (!(file.type.startsWith("image/") || /\.(jpe?g|png|webp|avif|gif|hei[cf]|tiff?)$/i.test(file.name))) {
        result.push(file.name+": elige un archivo de imagen.");continue;
      }
      if (!file.size || size+file.size>maxPhotoBytes) {
        result.push(file.name+": archivo vacío o supera el límite de 64 MB para esta prueba.");continue;
      }
      size+=file.size;
      record.photos.push({id:uid(),name:file.name,type:file.type,caption:"",original:file});
      changed();
    }
    input.value="";
    $("#photo-feedback").textContent=result.join(" ");
    renderPhotos();
  }
  function safeName(value) {
    const normalized = value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"");
    return normalized.replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/^[._-]+/,"").slice(0,120) || "foto";
  }
  function entries(trial) {
    return Object.entries(fields).flatMap(([key,label]) => {
      const value=chosen(key,trial);
      return value!=="" ? [[label,value]] : [];
    });
  }
  function validateMeasures() {
    const invalid=form.querySelector("input:invalid");
    if(invalid){form.querySelector(".entry").open=true;invalid.reportValidity();return false;}
    if(quantities.some(key=>record.values[key]) && !record.values.unit) {
      form.querySelector(".entry").open=true;
      const select=form.elements.unit;
      select.focus();select.setCustomValidity("Elige la unidad de las cantidades que registraste.");select.reportValidity();
      return false;
    }
    return true;
  }
  async function exportZip() {
    if (exporting || changing) return;
    if (!present(record)) {$("#export-feedback").textContent="Anota una observación o añade una foto antes de descargar.";return;}
    if(!validateMeasures())return;
    exporting=true;$("#export").disabled=true;
    const atVersion=version;
    const snapshot={...record,values:{...record.values},photos:record.photos.map(p=>({...p}))};
    const feedback=$("#export-feedback");
    feedback.textContent="Preparando archivo…";
    try {
      const encoder=new TextEncoder(), files=Object.create(null);
      const photos=[];
      for(const [i,p] of snapshot.photos.entries()) {
        const path="fotos/"+String(i+1).padStart(2,"0")+"-"+safeName(p.name);
        files[path]=new Uint8Array(await p.original.arrayBuffer());
        photos.push({archivo:path,nombreOriginal:p.name,tipo:p.type,descripcion:p.caption,bytes:p.original.size});
      }
      const values=Object.fromEntries(entries(snapshot));
      const manifest={version:1,id:snapshot.id,creada:snapshot.createdAt,actualizada:snapshot.updatedAt,campos:values,fotos:photos};
      const lines=["Prueba de cocina · Palapa Verde","",...Object.entries(values).map(([k,v])=>k+": "+v),""];
      photos.forEach(p=>lines.push(p.archivo+(p.descripcion ? " · "+p.descripcion : "")));
      files["ficha.txt"]=encoder.encode(lines.join("\n"));
      files["registro.json"]=encoder.encode(JSON.stringify(manifest,null,2));
      const zip=new Blob([window.fflate.zipSync(files,{level:0})],{type:"application/zip"});
      const url=URL.createObjectURL(zip), a=el("a");
      a.href=url;a.download="prueba-"+safeName(chosen("product",snapshot) || "cocina")+"-"+snapshot.id.slice(0,8)+".zip";
      document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      exportedVersion=atVersion;
      feedback.textContent="ZIP preparado. Comprueba que esté en tus descargas.";
    } catch {
      feedback.textContent="No se pudo preparar el ZIP. Mantén la ficha abierta y vuelve a intentarlo.";
    } finally {exporting=false;$("#export").disabled=false;}
  }
  function printSheet() {
    const article=$("#paper");article.replaceChildren();
    paperReady=true;
    revoke(printUrls);
    article.append(el("h1","Prueba de cocina"),el("p",title(record)));
    const dl=el("dl");
    for(const [label,value] of entries(record))dl.append(el("dt",label),el("dd",value));
    article.append(dl);
    if(record.photos.length)article.append(el("h2","Fotos"));
    for(const p of record.photos) {
      const figure=el("figure");figure.append(photoImage(p,printUrls),el("figcaption",p.caption||p.name));article.append(figure);
    }
  }

  $("#product").append(...products.map(([name])=>new Option(name,name)),new Option("Otro producto","Otro"));
  form.addEventListener("submit",event=>event.preventDefault());
  form.addEventListener("input",event=>{
    const {name,value}=event.target;
    if (!name) return;
    form.elements.unit.setCustomValidity("");
    record.values[name]=value;
    if(name==="product"){
      delete record.values.customProduct;
      const choices=products.find(([key])=>key===value)?.[1];
      if(choices && record.values.dish!=="Otro" && !choices.includes(record.values.dish)) delete record.values.dish;
      dishes();$("#dish").value=record.values.dish || "";
      form.elements.customProduct.value="";
    }
    if(name==="dish"){
      delete record.values.customDish;form.elements.customDish.value="";
      $("#custom-dish-label").hidden=value!=="Otro";
    }
    changed();
  });
  $("#camera").addEventListener("change",e=>addPhotos(e.target));
  $("#files").addEventListener("change",e=>addPhotos(e.target));
  history.addEventListener("change",()=>move(history.value));
  $("#new").addEventListener("click",()=>move(null));
  $("#export").addEventListener("click",exportZip);
  $("#print").addEventListener("click",()=>{
    if(!present(record)) {$("#export-feedback").textContent="Añade una observación o una foto antes de imprimir.";return;}
    if(!validateMeasures())return;
    printSheet();
    const images=[...$("#paper").querySelectorAll("img")];
    Promise.allSettled(images.map(img=>img.decode())).then(()=>window.print());
  });
  window.addEventListener("beforeprint",()=>{if(record && !paperReady)printSheet();});
  window.addEventListener("afterprint",()=>{paperReady=false;revoke(printUrls);$("#paper").replaceChildren();});
  window.addEventListener("pagehide",()=>{if(record)persist();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden && record)persist();});
  window.addEventListener("beforeunload",event=>{
    if(record && present(record) && savedVersion<version && exportedVersion!==version) {
      persist();event.preventDefault();event.returnValue="";
    }
  });

  async function boot() {
    try {
      db=await dbOpen();
      const rows=await loadAll();
      rows.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
      rows.forEach(row=>sessions.set(row.id,row));
      showRecord(rows[0] ?? originalRecord());
    } catch {
      db=null;showRecord(originalRecord());
    }
    $("#app").hidden=false;
  }
  boot();
})();
