window.onload = function() {
  setTimeout(function() {
    const overlay = document.getElementById("loading-overlay");
    
    // Cambia opacità a 0 con una transizione di 1 secondo
    overlay.style.opacity = "0";
    
    // Dopo 1.5 secondi (compreso il tempo di dissolvenza), rimuovi completamente l'overlay
    setTimeout(function() {
      overlay.style.display = "none"; // Nasconde l'overlay
    }, 500); // 1500ms per garantire che la dissolvenza sia finita
  }, 700); // Dopo 1 secondo, avvia la dissolvenza
};



// Funzione per salvare i dati su dati.txt
function salvaDati() {
    let nome = document.getElementById("name").value;
    let euro = document.getElementById("euro").value;

    fetch("http://localhost:3000/salva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, euro: euro })
    }).then(response => response.text())
      .then(data => alert(data))
      .catch(error => console.error("Errore:", error));
}

function mostraImmagine() {
  const img = document.getElementById("fullscreen-image");
  const overlay = document.getElementById("loading-overlays");
  
  overlay.style.opacity = "1"; // Mostra l'overlay
  overlay.style.pointerEvents = "auto"; // Blocca interazione sotto

  setTimeout(() => {
      overlay.style.opacity = "0"; // Nasconde l'overlay dopo 500ms
      overlay.style.pointerEvents = "none"; // Riattiva interazione

      img.style.display = "block"; // Assicura che l'immagine sia visibile
      img.style.opacity = "1"; 

      setTimeout(() => {
          salvaDati(); // Salva i dati
          window.location.href = 'index.html'; // Redirect immediato senza cambiare opacità
      }, 1100);
  }, 600);
}



// Carica il saldo da balance.txt
fetch('balance.txt')
.then(response => response.text())
.then(balanceText => {
  let balance = parseFloat(balanceText.replace(/[^0-9.-]+/g, ""));

  if (isNaN(balance)) {
    console.error("Errore nel formato del saldo nel file balance.txt.");
    return;
  }

  // Carica i dati delle transazioni da dati.txt
  fetch('dati.txt')
  .then(response => response.text())
  .then(text => {
    const lines = text.split('\n');
    const container = document.getElementById('ps');

    // Inverti l'array di righe
    lines.reverse().forEach(line => {
      const [name, money] = line.split(';');
      if (name && money) {
        let moneyAmount = parseFloat(money.replace(/[^0-9.-]+/g, ""));

        if (isNaN(moneyAmount)) {
          console.error(`Errore nel formato dell'importo per ${name} nel file dati.txt.`);
          return;
        }

        const initials = name.slice(0, 2).toUpperCase();

        let color = localStorage.getItem(name);
        if (!color) {
          color = `hsl(${Math.random() * 360}, 70%, 60%)`;
          localStorage.setItem(name, color);
        }

        balance -= moneyAmount;

        const element = document.createElement('div');
        element.className = 'square';
        element.id = 'pp';
        element.innerHTML = `
          <div class="prof">
              <div class="profile-pic" style="background-color: ${color};">
              ${initials}
              </div>
              <div>
              <h3>${name}</h3>
              <p>${new Date().toLocaleDateString()} . Money sent</p>
              </div>
          </div>
          <div id="price">
              <h3>-${moneyAmount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €</h3>
          </div>
        `;

        container.appendChild(element);
      }
    });

    const balanceElement = document.getElementById('balance');
    balanceElement.innerHTML = balance.toLocaleString('it-IT') + ' €';
  })
  .catch(error => console.error('Errore nel caricamento di dati.txt:', error));
})
.catch(error => console.error('Errore nel caricamento di balance.txt:', error));

// Funzione per simulare il clic del bottone "send"
function pressSendButton(event) {
    if (event.key === "Enter") {
        document.getElementById("sends").click();
    }
}

// Aggiungi l'evento di pressione "Enter" a ciascun bottone
document.getElementById("euro").addEventListener("keypress", pressSendButton);
document.getElementById("comment").addEventListener("keypress", pressSendButton);
document.getElementById("name").addEventListener("keypress", pressSendButton);

