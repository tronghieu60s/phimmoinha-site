const menuItems = document.querySelectorAll('.pm-header-menu-item > a');
const menuItemsArray = Array.from(menuItems);

menuItemsArray.forEach((menuItem) => {
  menuItem.addEventListener('click', () => {
    const menuItemsActive = document.querySelector('.pm-header-menu-item.active > a');
    if (menuItemsActive && menuItemsActive !== menuItem) {
      menuItemsActive.parentElement.classList.remove('active');
    }
    menuItem.parentElement.classList.toggle('active');
  });
  menuItem.addEventListener('mouseover', () => {
    const menuItemsActive = document.querySelector('.pm-header-menu-item.active > a');
    if (menuItemsActive && menuItemsActive !== menuItem) {
      menuItemsActive.parentElement.classList.remove('active');
    }
  });
});
