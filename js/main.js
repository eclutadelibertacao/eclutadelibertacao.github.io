const botao=document.querySelector('.menu-botao');const menu=document.querySelector('.menu');botao.addEventListener('click',()=>{const aberto=menu.classList.toggle('aberto');botao.setAttribute('aria-expanded',String(aberto));});document.querySelectorAll('.menu a').forEach(link=>link.addEventListener('click',()=>menu.classList.remove('aberto')));
const observados=document.querySelectorAll('.secao article,.titulo,.estado-vazio');
const observador=new IntersectionObserver((entradas)=>{
  entradas.forEach((entrada)=>{
    if(entrada.isIntersecting){
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    }
  });
},{threshold:.12});
observados.forEach((item)=>{
  item.classList.add('revelar');
  observador.observe(item);
});

const slides=[...document.querySelectorAll('.evento-slide')];
const pontos=[...document.querySelectorAll('.carrossel-indicadores button')];
const anterior=document.querySelector('.carrossel-seta.anterior');
const proxima=document.querySelector('.carrossel-seta.proxima');
let indiceEvento=0;
let temporizadorEvento;

function mostrarEvento(indice){
  if(!slides.length) return;
  indiceEvento=(indice+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('ativo',i===indiceEvento));
  pontos.forEach((ponto,i)=>ponto.classList.toggle('ativo',i===indiceEvento));
}
function iniciarCarrossel(){
  clearInterval(temporizadorEvento);
  temporizadorEvento=setInterval(()=>mostrarEvento(indiceEvento+1),6000);
}
if(slides.length){
  anterior?.addEventListener('click',()=>{mostrarEvento(indiceEvento-1);iniciarCarrossel();});
  proxima?.addEventListener('click',()=>{mostrarEvento(indiceEvento+1);iniciarCarrossel();});
  pontos.forEach((ponto,i)=>ponto.addEventListener('click',()=>{mostrarEvento(i);iniciarCarrossel();}));
  mostrarEvento(0);
  iniciarCarrossel();
}

function formatarContagem(dataEvento){
  const agora=new Date();
  const diferenca=dataEvento-agora;
  if(diferenca<=0) return "";
  const dias=Math.floor(diferenca/86400000);
  const horas=Math.floor((diferenca%86400000)/3600000);
  const minutos=Math.floor((diferenca%3600000)/60000);
  if(dias>0) return `Faltam ${dias} dia${dias===1?"":"s"} e ${horas}h`;
  if(horas>0) return `Faltam ${horas}h e ${minutos}min`;
  return `Faltam ${Math.max(1,minutos)} minutos`;
}

function classificarEventosHome(){
  const slidesHome=[...document.querySelectorAll('.evento-slide[data-event-date]')];
  if(!slidesHome.length) return;
  const agora=new Date();
  const futuros=slidesHome
    .map((slide,index)=>({slide,index,data:new Date(slide.dataset.eventDate)}))
    .filter(item=>item.data>=agora)
    .sort((a,b)=>a.data-b.data);
  const proximo=futuros[0];

  slidesHome.forEach((slide)=>{
    const data=new Date(slide.dataset.eventDate);
    const status=slide.querySelector('.status-evento');
    const contagem=slide.querySelector('.contagem-regressiva');
    slide.classList.toggle('realizado',data<agora);

    if(data<agora){
      status.textContent='Evento realizado';
      status.className='status-evento realizado';
      if(contagem) contagem.textContent='';
    }else if(proximo && slide===proximo.slide){
      status.textContent='Próximo evento';
      status.className='status-evento proximo';
      if(contagem) contagem.textContent=formatarContagem(data);
    }else{
      status.textContent='Evento futuro';
      status.className='status-evento futuro';
      if(contagem) contagem.textContent='';
    }
  });

  if(proximo && typeof mostrarEvento==='function'){
    mostrarEvento(proximo.index);
    iniciarCarrossel();
  }
}

function organizarAgenda(){
  const eventos=[...document.querySelectorAll('.agenda-evento[data-event-date]')];
  if(!eventos.length) return;

  const agora=new Date();
  const futuros=eventos
    .filter(evento=>new Date(evento.dataset.eventDate)>=agora)
    .sort((a,b)=>new Date(a.dataset.eventDate)-new Date(b.dataset.eventDate));
  const realizados=eventos
    .filter(evento=>new Date(evento.dataset.eventDate)<agora)
    .sort((a,b)=>new Date(b.dataset.eventDate)-new Date(a.dataset.eventDate));

  const listaFuturos=document.querySelector('.agenda-lista-futuros');
  const listaRealizados=document.querySelector('.agenda-lista-realizados');
  const destaque=document.getElementById('proximo-evento-destaque');

  const proximo=futuros[0];

  eventos.forEach((evento)=>{
    const status=evento.querySelector('.status-evento');
    const data=new Date(evento.dataset.eventDate);
    if(data<agora){
      status.textContent='Evento realizado';
      status.className='status-evento realizado';
    }else if(evento===proximo){
      status.textContent='Próximo evento';
      status.className='status-evento proximo';
    }else{
      status.textContent='Evento futuro';
      status.className='status-evento futuro';
    }
  });

  futuros.forEach((evento)=>listaFuturos?.appendChild(evento));
  realizados.forEach((evento)=>listaRealizados?.appendChild(evento));

  if(proximo && destaque){
    const clone=proximo.cloneNode(true);
    clone.className='proximo-destaque';
    clone.removeAttribute('id');
    const data=new Date(proximo.dataset.eventDate);
    const conteudo=clone.querySelector('div:last-child');
    if(conteudo){
      const contagem=document.createElement('div');
      contagem.className='contagem-regressiva';
      contagem.textContent=formatarContagem(data);
      conteudo.appendChild(contagem);
    }
    destaque.innerHTML='';
    destaque.appendChild(clone);
  }else if(destaque){
    destaque.innerHTML='<div class="estado-vazio"><strong>Nenhum evento futuro cadastrado</strong><p>Novos eventos serão publicados assim que forem confirmados.</p></div>';
  }
}

classificarEventosHome();
organizarAgenda();
setInterval(()=>{
  document.querySelectorAll('.evento-slide[data-event-date] .contagem-regressiva').forEach((el)=>{
    const slide=el.closest('.evento-slide');
    const status=slide?.querySelector('.status-evento');
    if(status?.classList.contains('proximo')){
      el.textContent=formatarContagem(new Date(slide.dataset.eventDate));
    }
  });
  const destaque=document.querySelector('.proximo-destaque');
  if(destaque){
    const dataStr=destaque.dataset.eventDate;
    const contagem=destaque.querySelector('.contagem-regressiva');
    if(dataStr && contagem) contagem.textContent=formatarContagem(new Date(dataStr));
  }
},60000);

const fotosGaleria=[...document.querySelectorAll('.foto-galeria')];
const lightbox=document.querySelector('.lightbox');
const imagemLightbox=lightbox?.querySelector('img');
const legendaLightbox=lightbox?.querySelector('figcaption');
let indiceFoto=0;

function abrirFoto(indice){
  if(!lightbox || !fotosGaleria.length) return;
  indiceFoto=(indice+fotosGaleria.length)%fotosGaleria.length;
  const botao=fotosGaleria[indiceFoto];
  const imagem=botao.querySelector('img');
  imagemLightbox.src=botao.dataset.full;
  imagemLightbox.alt=imagem.alt;
  legendaLightbox.textContent=`${indiceFoto+1} de ${fotosGaleria.length}`;
  lightbox.classList.add('aberto');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-ativo');
}
function fecharFoto(){
  if(!lightbox) return;
  lightbox.classList.remove('aberto');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('lightbox-ativo');
}
fotosGaleria.forEach((foto,i)=>foto.addEventListener('click',()=>abrirFoto(i)));
lightbox?.querySelector('.lightbox-fechar')?.addEventListener('click',fecharFoto);
lightbox?.querySelector('.lightbox-anterior')?.addEventListener('click',()=>abrirFoto(indiceFoto-1));
lightbox?.querySelector('.lightbox-proxima')?.addEventListener('click',()=>abrirFoto(indiceFoto+1));
lightbox?.addEventListener('click',(evento)=>{if(evento.target===lightbox) fecharFoto();});
document.addEventListener('keydown',(evento)=>{
  if(!lightbox?.classList.contains('aberto')) return;
  if(evento.key==='Escape') fecharFoto();
  if(evento.key==='ArrowLeft') abrirFoto(indiceFoto-1);
  if(evento.key==='ArrowRight') abrirFoto(indiceFoto+1);
});


/* Banner automático de eventos — versão 0.8 */
const eventosECLL = [
  {
    id: "i-circuito",
    titulo: "I Circuito Sankofa",
    convidado: "Mestre Francisco Lagarto",
    dataISO: "2026-07-11T16:00:00-04:00",
    dataTexto: "11 de julho de 2026",
    horario: "16h",
    local: "Centro Cultural Canto do Canário",
    cartaz: "images/eventos/i-circuito-sankofa.jpg",
    resumo: "Encontro dedicado à preservação da memória da capoeira no Amazonas.",
    detalhes: "agenda.html#i-circuito",
    inscricao: ""
  },
  {
    id: "ii-circuito",
    titulo: "II Circuito Sankofa",
    convidado: "Mestre Gato",
    dataISO: "2026-08-01T14:00:00-04:00",
    dataTexto: "1º de agosto de 2026",
    horario: "14h",
    local: "Centro Cultural Povos da Amazônia — CCPA",
    cartaz: "images/eventos/ii-circuito-sankofa.jpg",
    resumo: "Encontro com Mestre Gato, oficina de toques de berimbau, batizado e troca de cordas da ECLL.",
    detalhes: "agenda.html#ii-circuito",
    inscricao: "https://forms.gle/57vF1AE1NyvCi7cn9"
  },
  {
    id: "iii-circuito",
    titulo: "III Circuito Sankofa",
    convidado: "Vivência com Mestre Chaguinha",
    dataISO: "2026-10-10T16:00:00-04:00",
    dataTexto: "10 de outubro de 2026",
    horario: "16h",
    local: "Centro Cultural Canto do Canário",
    cartaz: "images/eventos/iii-circuito-sankofa.jpg",
    resumo: "Vivência dedicada à memória e à resistência da capoeira, com Mestre Chaguinha.",
    detalhes: "agenda.html#iii-circuito",
    inscricao: ""
  },
  {
    id: "iv-circuito",
    titulo: "IV Circuito Sankofa",
    convidado: "Mestre Eliberto Barroncas",
    dataISO: "2026-12-05T14:00:00-04:00",
    dataTexto: "5 de dezembro de 2026",
    horario: "14h",
    local: "Centro Cultural Povos da Amazônia — CCPA",
    cartaz: "images/eventos/iv-circuito-sankofa.jpg",
    resumo: "Programação sobre musicalidade na capoeira, batizado e troca de cordas da ECLL.",
    detalhes: "agenda.html#iv-circuito",
    inscricao: ""
  }
];

function obterEventosFuturos(){
  const agora = new Date();
  return eventosECLL
    .filter(evento => new Date(evento.dataISO) >= agora)
    .sort((a,b) => new Date(a.dataISO) - new Date(b.dataISO));
}

function preencherBannerAutomatico(){
  const area = document.getElementById("proximo-evento-automatico");
  if(!area) return;

  const futuros = obterEventosFuturos();
  const proximo = futuros[0];

  if(!proximo){
    area.innerHTML = `
      <div class="evento-sem-programacao">
        <span class="evento-etiqueta">Agenda</span>
        <h2>Novos eventos em breve</h2>
        <p>A programação será publicada assim que as próximas datas forem confirmadas.</p>
        <a class="botao ouro" href="agenda.html">Ver agenda</a>
      </div>`;
    document.getElementById("outros-eventos-confirmados")?.remove();
    return;
  }

  const cartaz = document.getElementById("evento-home-cartaz");
  cartaz.src = proximo.cartaz;
  cartaz.alt = `Cartaz do ${proximo.titulo}`;

  document.getElementById("evento-home-titulo").textContent = proximo.titulo;
  document.getElementById("evento-home-convidado").textContent = proximo.convidado;
  document.getElementById("evento-home-data").textContent = proximo.dataTexto;
  document.getElementById("evento-home-horario").textContent = proximo.horario;
  document.getElementById("evento-home-local").textContent = proximo.local;
  document.getElementById("evento-home-resumo").textContent = proximo.resumo;
  document.getElementById("evento-home-contagem").textContent =
    formatarContagem(new Date(proximo.dataISO));

  const detalhes = document.getElementById("evento-home-detalhes");
  detalhes.href = proximo.detalhes;

  const verCartaz = document.getElementById("evento-home-ver-cartaz");
  verCartaz.href = proximo.cartaz;

  const inscricao = document.getElementById("evento-home-inscricao");
  if(proximo.inscricao){
    inscricao.href = proximo.inscricao;
    inscricao.hidden = false;
  }else{
    inscricao.hidden = true;
  }

  const miniArea = document.getElementById("mini-eventos-automaticos");
  const outros = futuros.slice(1);
  if(!outros.length){
    document.getElementById("outros-eventos-confirmados")?.remove();
    return;
  }

  miniArea.innerHTML = outros.map(evento => `
    <a class="mini-evento" href="${evento.detalhes}">
      <img src="${evento.cartaz}" alt="Cartaz do ${evento.titulo}">
      <div>
        <span>${evento.dataTexto} · ${evento.horario}</span>
        <strong>${evento.titulo}</strong>
        <p>${evento.convidado}</p>
      </div>
    </a>
  `).join("");
}

function controlarBotoesDeInscricaoNaAgenda(){
  document.querySelectorAll(".agenda-evento[data-event-date]").forEach(evento => {
    const botao = evento.querySelector(".botao-inscricao");
    if(!botao) return;
    const aindaVaiAcontecer = new Date(evento.dataset.eventDate) >= new Date();
    botao.hidden = !aindaVaiAcontecer;
  });
}

preencherBannerAutomatico();
controlarBotoesDeInscricaoNaAgenda();

setInterval(() => {
  const futuros = obterEventosFuturos();
  const proximo = futuros[0];
  const contagem = document.getElementById("evento-home-contagem");
  if(proximo && contagem){
    contagem.textContent = formatarContagem(new Date(proximo.dataISO));
  }
}, 60000);
