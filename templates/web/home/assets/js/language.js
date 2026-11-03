// The root page always opens in Malayalam. Language changes are explicit.
const languageSelect=document.querySelector('#site-language');
if(languageSelect){
 languageSelect.value=document.documentElement.lang==='en'?'en':'ml';
 languageSelect.addEventListener('change',()=>{
  const destination=languageSelect.value==='en'?(languageSelect.dataset.en||'english.html'):(languageSelect.dataset.ml||'index.html');
  window.location.assign(destination+window.location.hash);
 });
 window.addEventListener('pageshow',()=>{languageSelect.value=document.documentElement.lang==='en'?'en':'ml';});
}
