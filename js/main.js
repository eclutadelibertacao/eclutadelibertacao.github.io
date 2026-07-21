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
