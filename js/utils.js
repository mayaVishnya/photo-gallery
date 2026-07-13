//   This script literally just checks if your browser is capable of hovering over items without clicking, basically if you have a mouse or not. 
window.isMobile = function(){
  if(window.matchMedia("(any-hover:none)").matches) {
    return true;
  } else {
    return false;
  }
};