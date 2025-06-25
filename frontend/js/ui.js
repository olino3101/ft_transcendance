import { resetBallSettings } from './ball';
import { hideGame } from './utils';
import { resetBalls, Game } from './game';
import { resetGame, setDifficultyAIplayer, nbBall } from './game.js';
import { resetTournament, endTournament } from './tournament.js';
import { yLimit, speed } from './PlayerCtrl.js';
import { getFriend } from '../js/friends.js';
import { changeLanguage } from './language.js';

const menu = document.getElementById('menu');
const canvas = document.getElementById('bg');

export function SaveSettings(difficultyAI, nbBall) {
    document.getElementById('validate-btn-Stgs').addEventListener('click', () => {
        if (document.getElementById('menu').style.display != 'none') {
            setDifficultyAI(difficultyAI);
            setBallSettings(nbBall);
            changeLanguage();
            const textSize = document.getElementById('text-size-selection').value;
            document.documentElement.style.setProperty('--base-font-size', `${textSize}px`);
        } else {
            alert('Cannot change game settings during a game !');
            return;
        }

    });
}

// reset les points lorsque on disconect et affiche le bon menu
export function logout( points, game, walls, players, ball) {
    document.getElementById('logoutModal').addEventListener('click', () => {
        resetGame(walls, players, ball, game, points);
        if( game.isTournament)
        {
            endTournament();
            resetTournament();
            game.isTournament = false;
            game.isPlaying = false;
            game.isactive = false;
            hideGame(walls, players, ball);
            document.getElementById(`menu`).style.display = 'block';
            ensureMenuFlex();
        }
    });
}

// le bouton single player
export function singlePlayer(game) {
    document.getElementById('singlePlayer').addEventListener('click', () => {
        game.isSinglePlayer = true;
        typeGame(game);
    });
}

// bouton multijoueur
export function multiPlayer(game) {
    document.getElementById('multiPlayer').addEventListener('click', () => {
        game.isSinglePlayer = false;
        typeGame(game);
    });
}

// bouton pour commencer la game une fois le jeux initaliser
export function start(game) {
    document.getElementById('start').addEventListener('click', () => {
        game.isPlaying = true;
        document.getElementById('start').style.display = 'none';
        document.getElementById('restart').style.display = 'block';
    });
}

// bouton qui actionne le jeux a 4 joueur
export function isFourPlayer(game) {
    document.getElementById('isFourPlayer').addEventListener('click', () => {
        game.isFourPlayer = true;
        game.isSinglePlayer = false;
        typeGame(game);
    });
}

// restart avec le ui
export function restart(balls, game, points, dirBalls, scene) {
    document.getElementById('restart').addEventListener('click', () => {
        initStart(balls, game, points, dirBalls, scene);
        document.getElementById('start').style.display = 'block';
        document.getElementById('restart').style.display = 'none';
    });
    document.getElementById('start-tournament').addEventListener('click', () => {
        initStart(balls, game, points, dirBalls, scene);
        game.isSinglePlayer = false;
        game.isTournament = true;
        typeGame(game);
    });
}



function setDifficultyAI(difficultyAI) {
    let difficulty = parseInt(document.getElementById('difficulty-input-ai').value, 10);
    if (isNaN(difficulty) || difficulty < 10) {
        difficulty = 10;
        document.getElementById('difficulty-input-ai').value = 10;
    } else if (difficulty > 50) {
        difficulty = 50;
        document.getElementById('difficulty-input-ai').value = 50;
    }
    setDifficultyAIplayer(difficulty);
}

// get the speed and the acceleration of the ball
function getSpeed() {
    let speed = document.getElementById('speed-input-ball').value / 100;
    if (speed > 1) {
        speed = 1;
        document.getElementById('speed-input-ball').value = 100;
    }
    else if (speed <= 0) {
        speed = 0.01;
        document.getElementById('speed-input-ball').value = 1;
    }
    return speed;
}

function getAcc() {
    let acc = document.getElementById('acceleration-input-ball').value / 200;
    if (acc > 0.5) {
        acc = 0.5;
        document.getElementById('acceleration-input-ball').value = 100;
    }
    else if (acc <= 0) {
        acc = 0.01;
        document.getElementById('acceleration-input-ball').value = 1;
    }
    return acc;
}


function setBallSettings(nbBall) {
    let nbrBall = parseInt(document.getElementById('nbr-input-ball').value, 10);
    if (isNaN(nbrBall) || nbrBall < 1) {
        nbBall.nb = 1;
        document.getElementById('nbr-input-ball').value = 1;
    } else if (nbrBall > 5) {
        nbBall.nb = 5;
        document.getElementById('nbr-input-ball').value = 5;
    } else {
        nbBall.nb = nbrBall;
    }
    let speed = getSpeed();
    let acc = getAcc();
    resetBalls(window.scene, window.balls, window.dirBalls, nbBall.nb, speed, acc);
}

function initStart(balls, game, points, dirBalls, scene) {
    game.isactive = true;
    game.needInit = true;        
    game.isPlaying = false;

    
    document.getElementById('alignment-container-points').style.display = 'block';
    document.getElementById('PPlayerOne').textContent = '0';
    document.getElementById('PPlayerTwo').textContent = '0';


    for (let i in points) {
        points[i] = 0;       
    }

    points.lastScorer = 0;
    balls.forEach((ball, index) => { 
        const dirBall = dirBalls[index];

        const randomNumber = Math.floor(Math.random() * 2) + 1;
        randomNumber == 1 ? dirBall.x = 1 : dirBall.x = -1;
        dirBall.y = 1;
        resetBallSettings(dirBall);
        
        ball.position.set(0,0,0);
    });
    // resetBalls(scene, balls, dirBalls, nbBall);
}

export function finishTournament(walls, players, balls, game) {
    document.getElementById('finishTournament').addEventListener('click', () => {
        game.isTournament = false;
        game.isPlaying = false;
        game.isactive = false;
        hideGame(walls, players, balls);
        document.getElementById('alignment-container-points').style.display = 'none';
        document.getElementById('PPlayerOne').textContent = '0';
        document.getElementById('PPlayerTwo').textContent = '0';
        document.getElementById('menu').style.display = 'block';
        ensureMenuFlex();
    });
}

export function closeModal(modalElement) {
    if (modalElement) {
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
    }

    // Remove modal-open class from the body
    document.body.classList.remove('modal-open');

    // Remove lingering modal backdrops
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

//Reset password
// document.addEventListener("DOMContentLoaded", function() {
//     const resetPasswordLink = document.getElementById('reset-password-link');
//     resetPasswordLink.addEventListener('click', function(event) {
//         event.preventDefault();
//         alert('Redirecting to password reset page...');
//         // You can replace the alert with an actual redirect:
//         // window.location.href = '/reset-password';
//     })
// });

//Load new image for avatar
// document.addEventListener("DOMContentLoaded", function() {
//     const uploadAvatarInput = document.getElementById('uploadAvatar');
//     const profilePicture = document.querySelector('.avatar-img');
//     const profileButton = document.getElementById("profileButton");

//     uploadAvatarInput.addEventListener('change', function() {
//         const file = uploadAvatarInput.files[0];

//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 profilePicture.src = e.target.result;
//                 profileButton.innerHTML = `<img src="${e.target.result}" alt="Avatar" style="width: 30px; height: 30px; object-fit: cover; border-radius: 50%;">`;
//                 profileButton.classList.remove("btn-primary");
//                 profileButton.style.background = "transparent";
//                 profileButton.style.border = "none";
//             };
//             reader.readAsDataURL(file);
//         }
//     });
// });

// Old logout handler removed - now using custom logout function

// deleteUserAccount
document.addEventListener("DOMContentLoaded", function () {
    const deleteProfile = document.getElementById('delete-profile');
    const preliminaryStep = document.getElementById('preliminary-step');
    const mainContent = document.getElementById('main-content');
    const profileUser = document.getElementById('profileModal');

    function handleDeleteUser() {
        if (canvas) {
            canvas.style.display = "none";
            canvas.classList.remove('visible');
        }
        mainContent.style.display = 'none';
        profileUser.style.display = 'none';
        preliminaryStep.style.display = 'flex';

        // Reset the game state
        if (window.game) {
            window.game.isactive = false;
            window.game.isPlaying = false;
        }
    }
    deleteProfile.addEventListener('click', handleDeleteUser);
});


// cache le menu une fois cliquer sur un des menus genre single player..... etc
export function typeGame(game) {
    game.isactive = true;
    game.needInit = true;
    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    canvas.classList.add('visible');
    document.getElementById('start').style.display = 'block';
}

const tournamentIcon = document.getElementById("tournament-icon");

tournamentIcon.addEventListener("click", function () {
    const panel = document.getElementById("tournament-info");

    if (!document.body.classList.contains("tournament-active")) {
        return;
    }

    const isCollapsed = panel.classList.contains("tournament-collapsed");
    if (isCollapsed) {
        panel.classList.remove("tournament-collapsed");
        panel.classList.add("tournament-expanded");
        this.style.right = "325px";
    } else {
        panel.classList.remove("tournament-expanded");
        panel.classList.add("tournament-collapsed");
        this.style.right = "0";
    }
});

tournamentIcon.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click(); 
    }
});

//Empecher la navigation tab en dehors des modal
document.querySelectorAll('.modal').forEach(modal=> {
    modal.addEventListener('show.bs.modal', () => {
        document.body.setAttribute('aria-hidden', 'true');
    });
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeAttribute('aria-hidden');
    });
});


// Manage navigation in chrome and pong
document.addEventListener("DOMContentLoaded", () => {
    const focusableSelectors = `a[href], area[href], input:not([disabled]), select:not([disabled]), 
    textarea:not([disabled]), button:not([disabled]), iframe, 
    [tabindex]:not([tabindex="-1"]), [contenteditable]`;

    function trapFocus(container) {
        const focusableElements = container.querySelectorAll(focusableSelectors);
        if (focusableElements.lenght === 0)
            return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    const appContainer = document.body;
    trapFocus(appContainer);
});

export function checkNewTournament(game) {
    const tournamentBtn = document.getElementById(`newTournamentBtn`);
    if (tournamentBtn) {
        tournamentBtn.addEventListener('click', () => {
            if (game.isTournament) {
                resetTournament();
            }
        });
    }
}

export let moveUp = false;
export let moveDown = false;
let moveSpeed = 0.0035;

export function updatePlayerMouvement(players) {
    if (!players || !players[0]) {
        return;
    }
    if (moveUp && players[0].position.y < yLimit) {
        players[0].position.y += moveSpeed;
    } else if (moveDown && players[0].position.y > -yLimit) {
        players[0].position.y -= moveSpeed;
    }

    if (players[0].position.y > yLimit) players[0].position.y = yLimit;
    if (players[0].position.y < -yLimit) players[0].position.y = -yLimit;
 
    requestAnimationFrame(() => updatePlayerMouvement(players));
}

export function initMobileControls(players) {
    const btnUp = document.getElementById('mobile-play-left');
    const btnDown = document.getElementById('mobile-play-right');
    btnUp.addEventListener('touchstart', (event) => {
        event.preventDefault();
        moveUp = true;
        updatePlayerMouvement(players);
    });
    btnUp.addEventListener('touchend', (event) => {
        event.preventDefault();
        moveUp = false;
    });
    
    btnDown.addEventListener('touchstart', (event) => {
        event.preventDefault();
        moveDown = true;
        updatePlayerMouvement(players);
    });
    btnDown.addEventListener('touchend', (event) => {
        event.preventDefault();
        moveDown = false;
    });
    btnUp.addEventListener('mousedown', (event) => {
        event.preventDefault();
        moveUp = true;
        updatePlayerMouvement(players);

    });
    btnUp.addEventListener('mouseup', (event) => {
        event.preventDefault();
        moveUp = false;
    });
    btnDown.addEventListener('mousedown', (event) => {
        event.preventDefault();
        moveDown = true;
        updatePlayerMouvement(players);
    });
    btnDown.addEventListener('mouseup', (event) => {
        event.preventDefault();
        moveDown = false;
    });
    // requestAnimationFrame(() => updatePlayerMouvement(players));

}

// Old profile modal event listeners removed - now using custom profile modal

document.addEventListener("DOMContentLoaded", function() {
    const premilinaryStep = document.getElementById('preliminary-step');
    const mainContent = document.getElementById('main-content');
    const canvas = document.getElementById('bg');

    function showPreliminaryStep() {
        premilinaryStep.style.display = 'flex';
        mainContent.style.display = 'none';
        if (canvas) {
            canvas.style.display = "none";
            canvas.classList.remove('visible');
        }
        // Reset the game state
        if (window.game) {
            window.game.isactive = false;
            window.game.isPlaying = false;
        }
        const Icon = document.getElementById("tournament-icon");
        Icon.style.display = "none";
    }
    function showMainContent() {
        premilinaryStep.style.display = 'none';
        mainContent.style.display = 'block';
        if (canvas) {
            canvas.style.display = "block";
            canvas.classList.add('visible');
        }
        // Reset the game state
        if (window.game) {
            window.game.isactive = true;
            window.game.isPlaying = true;
        }
        const Icon = document.getElementById("tournament-icon");
        Icon.style.display = "none";
    }

    const validateOtpButton = document.getElementById('validate-otp-btn');
    const logoutButton = document.getElementById('newLogoutButton');

    validateOtpButton.addEventListener('click', () => {
        history.pushState({ page: 'main' }, '', '#main-content');
    });

    logoutButton.addEventListener('click', () => {
        history.pushState({ page: 'preliminary' }, '', '#preliminary-step');
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page === 'main') {
            showMainContent();
        } else {
            showPreliminaryStep();
        }
    });

    if (window.location.hash === '#main-content') {
        showMainContent();
    } else {
        showPreliminaryStep();
    }
});

// document.addEventListener("DOMContentLoaded", () => {
//     const modals = document.querySelectorAll('.modal');

//     modals.forEach(modal => {
//         modal.addEventListener('show.bs.modal', () => {
//             const inputs = modal.querySelectorAll('input');
//             inputs.forEach(input => input.value = '');
//             const checkboxes = modal.querySelectorAll('input[type=>"checkbox"]');
//             checkboxes.forEach(checkbox => checkbox.checked = false);
//         });
//     });
// });

// Helper to always restore menu flex layout
function ensureMenuFlex() {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.style.display = 'flex';
        menu.style.flexDirection = 'row';
        menu.style.gap = '32px';
    }
}

// Also after resetGame (if called from elsewhere)
export function resetGameMenuShow() {
    document.getElementById('menu').style.display = 'block';
    ensureMenuFlex();
}

// MutationObserver to always restore flex if menu is shown by any means
if (typeof MutationObserver !== 'undefined') {
    const menu = document.getElementById('menu');
    if (menu) {
        const observer = new MutationObserver(() => {
            if (menu.style.display !== 'none') {
                ensureMenuFlex();
            }
        });
        observer.observe(menu, { attributes: true, attributeFilter: ['style'] });
    }
}

// Clean up any stuck modal backdrops
function cleanupModals() {
  // Remove any stuck modal backdrops
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
  
  // Remove modal-open class from body
  document.body.classList.remove('modal-open');
  
  // Restore body overflow
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  
  // Hide emergency reset button
  const emergencyBtn = document.getElementById('emergency-reset');
  if (emergencyBtn) {
    emergencyBtn.style.display = 'none';
  }
}

// Show emergency reset button if UI gets stuck
function showEmergencyReset() {
  const emergencyBtn = document.getElementById('emergency-reset');
  if (emergencyBtn) {
    emergencyBtn.style.display = 'block';
  }
}

// SIMPLE CUSTOM MODAL FUNCTIONS
function openCustomModal() {
  console.log('openCustomModal() called');
  const modal = document.getElementById('customSettingsModal');
  console.log('Modal element:', modal);
  
  if (modal) {
    console.log('Setting modal display to flex');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    
    console.log('Modal style after setting:', {
      display: modal.style.display,
      visibility: modal.style.visibility,
      opacity: modal.style.opacity,
      zIndex: getComputedStyle(modal).zIndex
    });
    
    // Focus first input for accessibility
    const firstInput = modal.querySelector('input, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  } else {
    console.error('Modal element not found!');
  }
}

function closeCustomModal() {
  console.log('closeCustomModal() called');
  const modal = document.getElementById('customSettingsModal');
  if (modal) {
    console.log('Hiding modal');
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    console.log('Modal hidden');
  } else {
    console.error('Modal element not found for closing!');
  }
}

// Make function globally available
window.closeCustomModal = closeCustomModal;
window.openCustomModal = openCustomModal;

// PROFILE MODAL FUNCTIONS
function openCustomProfileModal() {
  console.log('openCustomProfileModal() called');
  const modal = document.getElementById('customProfileModal');
  console.log('Profile Modal element:', modal);
  
  if (modal) {
    console.log('Setting profile modal display to flex');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    
    // Focus first input for accessibility
    const firstInput = modal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  } else {
    console.error('Profile Modal element not found!');
  }
}

function closeCustomProfileModal() {
  console.log('closeCustomProfileModal() called');
  const modal = document.getElementById('customProfileModal');
  if (modal) {
    console.log('Hiding profile modal');
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    console.log('Profile Modal hidden');
  } else {
    console.error('Profile Modal element not found for closing!');
  }
}

// CONTROLS MODAL FUNCTIONS
function openCustomControlsModal() {
  console.log('openCustomControlsModal() called');
  const modal = document.getElementById('customControlsModal');
  console.log('Controls Modal element:', modal);
  
  if (modal) {
    console.log('Setting controls modal display to flex');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
  } else {
    console.error('Controls Modal element not found!');
  }
}

function closeCustomControlsModal() {
  console.log('closeCustomControlsModal() called');
  const modal = document.getElementById('customControlsModal');
  if (modal) {
    console.log('Hiding controls modal');
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    console.log('Controls Modal hidden');
  } else {
    console.error('Controls Modal element not found for closing!');
  }
}

// LOGOUT FUNCTION
function handleLogout() {
  console.log('handleLogout() called');
  const canvas = document.getElementById('bg');
  const preliminaryStep = document.getElementById('preliminary-step');
  const mainContent = document.getElementById('main-content');

  if (canvas) {
    canvas.style.display = "none";
    canvas.classList.remove('visible');
  }
  preliminaryStep.style.display = 'flex';
  mainContent.style.display = 'none';

  // Reset the game state
  if (window.game) {
    window.game.isactive = false;
    window.game.isPlaying = false;
  }
  
  console.log('Logout completed');
}

// Make functions globally available
window.closeCustomProfileModal = closeCustomProfileModal;
window.openCustomProfileModal = openCustomProfileModal;
window.closeCustomControlsModal = closeCustomControlsModal;
window.openCustomControlsModal = openCustomControlsModal;
window.handleLogout = handleLogout;

// NEW SIMPLE HAMBURGER MENU HANDLER
document.addEventListener('DOMContentLoaded', function () {
  // Clean up any existing modals on load
  cleanupModals();
  
  console.log('Setting up new hamburger menu...');
  
  // Get elements
  const menuButton = document.getElementById('menuButton');
  const dropdown = document.getElementById('simpleDropdown');
  const closeDropdown = document.getElementById('closeDropdown');
  const newSettingsBtn = document.getElementById('newSettingsBtn');
  
  // Function to show dropdown
  function showDropdown() {
    if (dropdown) {
      dropdown.style.display = 'block';
      console.log('Dropdown shown');
    }
  }
  
  // Function to hide dropdown
  function hideDropdown() {
    if (dropdown) {
      dropdown.style.display = 'none';
      console.log('Dropdown hidden');
    }
  }
  
  // Menu button click handler
  if (menuButton) {
    menuButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Menu button clicked');
      
      if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        showDropdown();
      } else {
        hideDropdown();
      }
    });
    console.log('Menu button handler added');
  }
  
  // Close dropdown button
  if (closeDropdown) {
    closeDropdown.addEventListener('click', function(e) {
      e.preventDefault();
      hideDropdown();
    });
    console.log('Close dropdown handler added');
  }
  
  // Settings button - open custom modal
  if (newSettingsBtn) {
    newSettingsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Settings clicked');
      hideDropdown();
      setTimeout(() => {
        openCustomModal();
      }, 200);
    });
    console.log('Settings button handler added');
  }
  
  // Profile button - open custom profile modal
  const newProfileBtn = document.getElementById('newProfileButton');
  if (newProfileBtn) {
    newProfileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Profile clicked');
      openCustomProfileModal();
      // Load friend data when profile opens
      if (typeof getFriend === 'function') {
        getFriend();
      }
    });
    console.log('Profile button handler added');
  }
  
  // Avatar upload button handler
  document.addEventListener('click', function(e) {
    if (e.target && e.target.closest('button[aria-label="Edit avatar picture"]')) {
      e.preventDefault();
      const uploadInput = document.getElementById('uploadAvatar');
      if (uploadInput) {
        uploadInput.click();
      }
    }
  });
  
  // Controls button - open custom controls modal
  const newControlBtn = document.getElementById('newControlButton');
  if (newControlBtn) {
    newControlBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Controls clicked');
      openCustomControlsModal();
    });
    console.log('Controls button handler added');
  }
  
  // Logout button - handle logout
  const newLogoutBtn = document.getElementById('newLogoutButton');
  if (newLogoutBtn) {
    newLogoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Logout clicked');
      handleLogout();
    });
    console.log('Logout button handler added');
  }
  
  // Other modal buttons
  const modalBtns = document.querySelectorAll('.menu-item-btn[data-bs-toggle="modal"]');
  modalBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      hideDropdown();
      // Let Bootstrap handle the modal opening
    });
  });
  
  // Click outside to close dropdown
  document.addEventListener('click', function(e) {
    if (dropdown && 
        !dropdown.contains(e.target) && 
        !menuButton.contains(e.target) &&
        dropdown.style.display === 'block') {
      hideDropdown();
    }
  });

  // ESC key to close custom modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCustomModal();
      closeCustomProfileModal();
      closeCustomControlsModal();
      cleanupModals();
    }
  });

  // Add event listeners for modal close functionality
  document.addEventListener('click', function(e) {
    // Close modals when clicking on backdrop
    if (e.target && e.target.classList.contains('custom-modal-backdrop')) {
      closeCustomModal();
      closeCustomProfileModal();
      closeCustomControlsModal();
    }
    
    // Close modals when clicking the X button
    if (e.target && e.target.classList.contains('custom-close-btn')) {
      closeCustomModal();
      closeCustomProfileModal();
      closeCustomControlsModal();
    }
  });
});