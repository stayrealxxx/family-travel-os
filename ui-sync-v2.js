(()=>{
  if(window.__travelUiSyncV2)return;
  window.__travelUiSyncV2=true;
  window.addEventListener('travel:language',()=>{
    setTimeout(()=>{
      const btn=document.getElementById('refreshLiveData');
      if(btn&&!btn.classList.contains('is-loading'))btn.click();
    },40);
  });
})();
