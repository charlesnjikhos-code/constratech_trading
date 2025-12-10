

  // Mobile Navigation Toggle
  const menuBtn = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  
  function toggleMobileMenu() {
    menuBtn.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-active');
    mobileOverlay.classList.toggle('is-active');
    document.body.style.overflow = mobileMenu.classList.contains('is-active') ? 'hidden' : '';
  }
  
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking nav links
  document.querySelectorAll(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      if (mobileMenu.classList.contains('is-active')) {
        toggleMobileMenu();
      }
    });
  });


const filterContainer = document.querySelector(".gallery-filter");
const galleryItems = document.querySelectorAll(".photo");

if (filterContainer) {
  filterContainer.addEventListener("click", (event) =>{
    if(event.target.classList.contains("filter-item")){
      // deactivate existing active 'filter-item'
      filterContainer.querySelector(".active").classList.remove("active");
      // activate new 'filter-item'
      event.target.classList.add("active");
      const filterValue = event.target.getAttribute("data-filter");
      galleryItems.forEach((item) =>{
        if(item.classList.contains(filterValue) || filterValue === 'all'){
          item.classList.remove("hide");
          item.classList.add("show");
        }
        else{
          item.classList.remove("show");
          item.classList.add("hide");
        }
      });
    }
  });
}
 
 
