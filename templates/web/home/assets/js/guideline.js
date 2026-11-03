
const guideZoom=document.querySelector('#guide-zoom');
document.querySelectorAll('.guide-image').forEach(link=>link.addEventListener('click',e=>{
 if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();
 const image=document.querySelector('#zoom-image');image.src=link.href;image.alt=link.querySelector('img').alt;
 document.querySelector('#zoom-title').textContent=link.dataset.title;guideZoom.showModal();
 const viewport=guideZoom.querySelector('.zoom-scroll');viewport.scrollTop=0;viewport.scrollLeft=0;
}));
guideZoom.querySelector('.media-close').addEventListener('click',()=>guideZoom.close());
guideZoom.addEventListener('click',e=>{if(e.target!==guideZoom)return;const b=guideZoom.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)guideZoom.close();});
