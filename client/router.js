export function navigate(screen){
  const el = document.getElementById('app');
  if(el) el.textContent = `Screen: ${screen}`;
}
