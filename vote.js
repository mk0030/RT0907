// Fonction pour récupérer et afficher les candidats
async function getCandidats() {
    try {
        console.log("Fetching candidates...");
        
        
        const response = await fetch('https://ztibvzfdvb.execute-api.eu-north-1.amazonaws.com/test/candidats');
        
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des candidats : ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Réponse API candidats avant parsing :", data);

        
        const candidats = JSON.parse(data.body); 
        console.log("Candidats après parsing :", candidats);

        const ul = document.getElementById('candidats-list');

        if (candidats.length === 0) {
            ul.innerHTML = '<li>Aucun candidat trouvé</li>';
        } else {
            candidats.forEach(c => {
                const li = document.createElement('li');
                li.textContent = `${c.nom} ${c.prenom}`;
                
                const button = document.createElement('button');
                button.textContent = "Vote";
                button.onclick = () => vote(c.candidats_id);

                li.appendChild(button);
                ul.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Erreur:', error);
        const ul = document.getElementById('candidats-list');
        ul.innerHTML = '<li>Impossible de charger les candidats</li>';
    }
}

// Fonction pour voter pour un candidat
async function vote(candidats_id) {
    try {
        console.log(`Voter pour le candidat ${candidats_id}`);
        
        const response = await fetch('https://ztibvzfdvb.execute-api.eu-north-1.amazonaws.com/test/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ candidats_id: candidats_id }) 
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'enregistrement du vote');
        }

        alert('Vote enregistré avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'enregistrement du vote');
    }
}


getCandidats();