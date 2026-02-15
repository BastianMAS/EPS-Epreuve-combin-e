// ==========================================================================
// GOLF PERFORMANCE TRACKER - APPLICATION PRINCIPALE
// ==========================================================================

// ==================== VARIABLES GLOBALES ====================
let currentPlayer = null;
let allTests = [];
let radarChart = null;
let historyChart = null;

// ==================== PROTOCOLES DES TESTS ====================
const PROTOCOLS = {
    // FORCE
    squat: {
        title: "Squat - 1RM",
        material: "Barre, cage à squat, disques",
        protocol: `1. Échauffement articulaire et musculaire progressif
2. Commencer avec la barre seule pour vérifier la technique
3. Monter progressivement la charge (par paliers de 5-10kg)
4. Trouver le 1RM (charge maximale pour 1 répétition) ou 3RM
5. Si 3RM, calculer le 1RM estimé avec la formule de Brzycki

Position :
- Pieds largeur épaules, pointes légèrement vers l'extérieur
- Barre sur les trapèzes (position haute)
- Descendre jusqu'à ce que les cuisses soient parallèles au sol (90°)
- Remonter en poussant fort sur les talons

L'application calculera automatiquement le ratio poids de corps.`,
        tips: "Garder le dos droit, regarder devant soi. Ne pas décoller les talons. Contrôler la descente."
    },
    
    deadlift: {
        title: "Deadlift (Soulevé de terre) - 1RM",
        material: "Barre, disques",
        protocol: `1. Échauffement progressif
2. Monter en charge jusqu'au 1RM ou 3RM
3. Si 3RM, calculer le 1RM estimé

Position :
- Pieds largeur hanches, sous la barre
- Saisir la barre en pronation (ou mixte si lourd)
- Dos plat, poitrine sortie
- Tirer la barre en gardant le dos droit
- Extension complète en haut (épaules en arrière)

Attention : Ne jamais arrondir le dos !`,
        tips: "Engager les abdos et les fessiers. La barre doit rester proche du corps tout au long du mouvement."
    },
    
    benchpress: {
        title: "Développé Couché - 1RM",
        material: "Banc, barre, disques",
        protocol: `1. Échauffement progressif
2. Monter en charge jusqu'au 1RM ou 3RM
3. Si 3RM, calculer le 1RM estimé

Position :
- Allongé sur le banc, pieds au sol
- Saisir la barre légèrement plus large que les épaules
- Descendre la barre vers le milieu de la poitrine
- Remonter en contrôle jusqu'à extension complète des bras

Important : Avoir un pareur pour la sécurité !`,
        tips: "Contracter les omoplates, garder les fesses sur le banc. Ne pas rebondir sur la poitrine."
    },
    
    pullup: {
        title: "Tirage Vertical - 1RM",
        material: "Barre de traction ou machine guidée, lest éventuel",
        protocol: `1. Échauffement progressif
2. Si traction au poids de corps facile, ajouter du lest
3. Trouver le 1RM (ou 3RM puis calculer)

Position :
- Saisir la barre en pronation, mains légèrement plus larges que les épaules
- Tirer jusqu'à ce que le menton dépasse la barre
- Descendre en contrôle jusqu'à extension complète

Pour le ratio : poids de corps + lest = charge totale`,
        tips: "Ne pas se balancer. Contrôler la descente. Engager les dorsaux."
    },
    
    legextension: {
        title: "Leg Extension Unilatéral",
        material: "Machine de leg extension",
        protocol: `1. Échauffement léger
2. Tester JAMBE PAR JAMBE séparément
3. Trouver le 1RM ou 3RM de chaque jambe

Position :
- Assis, dos contre le dossier
- Une seule jambe active à la fois
- Extension complète du genou
- Descente contrôlée

L'application calculera :
- Le ratio charge/poids de corps pour chaque jambe
- L'asymétrie gauche/droite (ALERTE si >15%)`,
        tips: "Ne pas donner d'élan. Contracter le quadriceps en haut du mouvement."
    },
    
    legpress: {
        title: "Presse Unilatérale",
        material: "Machine de presse à cuisses",
        protocol: `1. Échauffement progressif
2. Tester JAMBE PAR JAMBE séparément
3. Trouver le 1RM ou 3RM de chaque jambe

Position :
- Une seule jambe sur le plateau
- Pied au centre, l'autre jambe au repos
- Descendre jusqu'à 90° de flexion de genou
- Pousser jusqu'à extension presque complète

L'application détectera les déséquilibres G/D`,
        tips: "Ne pas décoller les lombaires du siège. Garder le dos plaqué."
    },
    
    // VITESSE
    shuttle: {
        title: "Navette 5x10m",
        material: "2 plots, chronomètre ou cellules photoélectriques",
        protocol: `1. Placer 2 lignes à 10 mètres l'une de l'autre
2. Le joueur fait 5 courses de 10m (2,5 allers/retours)
3. TOTAL = 50 mètres parcourus
4. Il DOIT toucher la ligne avec la main à chaque virage
5. Chronomètre du départ jusqu'à la 5ème arrivée

Important : Si le joueur ne touche pas la ligne = test invalide

Consigne : "Sprint maximal, touche la ligne à chaque fois !"`,
        tips: "S'échauffer 10 minutes avant. Faire 2 essais, garder le meilleur temps."
    },
    
    driverspeed: {
        title: "Driver Speed (Vitesse de club)",
        material: "Radar (Trackman, Flightscope, etc.), driver du joueur",
        protocol: `1. Échauffement complet avec le driver
2. Effectuer 5 drives MAXIMUM
3. Le joueur doit swinguer à vitesse maximale (pas de précision)
4. Noter la vitesse de club (clubhead speed) pour chaque essai
5. Garder la vitesse MAXIMALE (pas la moyenne !)

Mesure : Vitesse en mph (miles par heure)

Note : Ce test mesure la capacité de transfert de puissance au golf`,
        tips: "Swinguer à fond sans se soucier de la direction. C'est un test de VITESSE pure."
    },
    
    // ENDURANCE
    vma: {
        title: "VMA (Vitesse Maximale Aérobie)",
        material: "Piste ou terrain plat, chronomètre",
        protocol: `Option 1 - Test Luc Léger :
- Navettes de 20m avec bips sonores
- Vitesse augmente chaque minute
- S'arrêter à épuisement
- Convertir le palier en km/h

Option 2 - Demi-Cooper (6 minutes) :
- Courir la plus grande distance en 6 minutes
- Formule : Distance (m) ÷ 100 = VMA (km/h)
- Exemple : 1200m en 6min = VMA 12 km/h`,
        tips: "Bien s'échauffer. C'est un effort maximal. Le test doit se terminer en épuisement."
    },
    
    maxpushups: {
        title: "Maximum Pompes en 1 minute",
        material: "Chronomètre, tapis",
        protocol: `1. Position de départ : planche haute, mains largeur épaules
2. Au signal, effectuer le MAXIMUM de pompes en 60 secondes
3. Amplitude complète obligatoire :
   - Descente : poitrine à 5cm du sol
   - Montée : bras tendus
4. Compter uniquement les pompes techniquement correctes

Fautes éliminatoires :
- Bassin qui s'affaisse
- Amplitude incomplète
- Arrêt de plus de 3 secondes`,
        tips: "Rester gainé. Mieux vaut ralentir que de tricher sur l'amplitude."
    },
    
    maxsquats: {
        title: "Maximum Squats en 1 minute",
        material: "Chronomètre",
        protocol: `1. Position : pieds largeur épaules, poids de corps uniquement
2. Au signal, effectuer le MAXIMUM de squats en 60 secondes
3. Amplitude : cuisses parallèles au sol (90° au genou)
4. Remonter jusqu'à extension complète

Consigne technique :
- Dos droit
- Talons au sol
- Genoux dans l'axe des pieds

Fautes : amplitude insuffisante, talons décollés`,
        tips: "Trouver son rythme. Respirer régulièrement."
    },
    
    wallsit: {
        title: "Chaise Unilatérale (Asymétrie)",
        material: "Mur, chronomètre",
        protocol: `1. Se placer dos au mur
2. Descendre jusqu'à 90° (cuisses parallèles au sol)
3. LEVER UNE JAMBE
4. Tenir le plus longtemps possible
5. Chronomètre jusqu'à :
   - La jambe d'appui tremble trop
   - Le dos décolle du mur
   - L'autre pied touche le sol

Tester GAUCHE et DROITE séparément.`,
        tips: "Tester la jambe la plus faible en premier. Récupérer 2-3 minutes entre les jambes."
    },
    
    // EXPLOSIVITÉ
    vertjump: {
        title: "Détente Verticale (CMJ)",
        material: "Toise murale ou tapis de mesure, craie",
        protocol: `1. Se placer debout, mains sur les hanches (pour isoler les jambes)
2. Fléchir les genoux et sauter LE PLUS HAUT possible
3. Pas d'élan, départ pieds joints
4. Mesurer la hauteur maximale atteinte

Mesure :
- Marquer avec la craie le point le plus haut atteint
- Ou utiliser un tapis de détente (Vertec, MyJump, etc.)

Faire 3 essais, garder le meilleur.`,
        tips: "Explosivité maximale. Utiliser les bras pour s'équilibrer à la réception."
    },
    
    horizjump: {
        title: "Détente Horizontale",
        material: "Décamètre, ligne de départ",
        protocol: `1. Se placer pieds joints sur la ligne de départ
2. Balancer les bras et sauter LE PLUS LOIN possible
3. Pas d'élan, départ statique
4. Mesurer du talon le plus proche de la ligne de départ

Consigne :
- Réception équilibrée (ne pas tomber en arrière)
- Distance mesurée au talon le plus proche

Faire 3 essais, garder le meilleur.`,
        tips: "Bien fléchir les genoux avant le saut. Projeter les bras vers l'avant."
    },
    
    medballchest: {
        title: "MedBall Chest Pass (assis)",
        material: "Medicine ball 2-3kg, décamètre",
        protocol: `PROTOCOLE CHEST PASS ASSIS :

1. S'asseoir au sol en tailleur, DOS CONTRE MUR
2. Tenir le medicine ball à 2 mains devant la poitrine
3. Lancer le plus loin possible devant soi (chest pass)
4. Le dos doit RESTER contre le mur (pas d'élan du tronc)
5. Mesurer la distance d'impact au sol

Poids du medicine ball :
- 2kg pour les jeunes/femmes
- 3kg pour les hommes adultes

⚠️ Ce test isole le haut du corps (pas de jambes)

Faire 3 essais, garder le meilleur.`,
        tips: "Explosion maximale des bras et pectoraux. Aucun mouvement du tronc autorisé."
    },
    
    medballrotation: {
        title: "MedBall Rotation Throw (debout)",
        material: "Medicine ball 2-3kg, décamètre",
        protocol: `PROTOCOLE ROTATION THROW :

1. DEBOUT, perpendiculaire à la cible
2. Pieds largeur d'épaules, genoux légèrement fléchis  
3. Tenir le medicine ball à 2 mains
4. Rotation explosive du tronc (comme un swing de golf)
5. Lancer LATÉRAL le plus loin possible
6. Mesurer la distance d'impact au sol

Poids du medicine ball :
- 2kg pour les jeunes/femmes
- 3kg pour les hommes adultes

⚠️ Ce test évalue la puissance rotationnelle (golf-spécifique)

Tester les 2 CÔTÉS (gauche et droite).
Faire 3 essais par côté, garder le meilleur.`,
        tips: "Utiliser tout le corps : jambes, hanches, tronc, bras. Mouvement explosif et coordonné."
    },
    
    cmjunilateral: {
        title: "CMJ Unilatéral (Asymétrie)",
        material: "Toise ou tapis de détente",
        protocol: `1. Même protocole que la détente verticale
2. MAIS sur une seule jambe
3. L'autre jambe reste fléchie en l'air
4. Mains sur les hanches

Tester GAUCHE et DROITE séparément.

Important : Ce test révèle les déséquilibres de puissance.
Au golf, la jambe d'appui est cruciale.`,
        tips: "S'équilibrer avant de sauter. Réception sur la même jambe."
    },
    
    // CORE
    rkcplank: {
        title: "RKC Plank (Gainage intensif)",
        material: "Chronomètre, tapis",
        protocol: `1. Position planche (coudes au sol)
2. DIFFÉRENCE avec planche classique :
   - Contraction MAXIMALE volontaire
   - Fessiers serrés à fond
   - Abdos contractés à fond
   - Quadriceps contractés
   - Coudes qui "tirent" vers les pieds (sans bouger)

3. Tenir le plus longtemps possible en maintenant cette tension

Arrêt quand :
- Le bassin s'affaisse
- Impossible de maintenir la contraction maximale`,
        tips: "C'est un gainage de QUALITÉ, pas de durée. 20-30 secondes en RKC = excellent !"
    },
    
    sideplank: {
        title: "Side Plank (Gainage latéral)",
        material: "Chronomètre, tapis",
        protocol: `1. Position latérale, appui sur un coude
2. Corps aligné (tête-tronc-bassin-jambes)
3. Bassin relevé, corps droit
4. Tenir le plus longtemps possible

Tester GAUCHE et DROITE.

Arrêt quand :
- Le bassin descend
- Le corps pivote`,
        tips: "Regarder devant. Contracter les obliques. L'application détectera les asymétries."
    },
    
    birddog: {
        title: "Bird Dog (Qualité 0-3)",
        material: "Tapis, bâton (optionnel)",
        protocol: `1. Position à 4 pattes
2. Lever bras droit ET jambe gauche simultanément
3. Maintenir 10 secondes
4. Répéter de l'autre côté

NOTATION (0 à 3) :
0 = Impossible de lever bras + jambe
1 = Peut lever mais mouvement du dos/bassin
2 = Stable mais léger mouvement
3 = Parfait, aucun mouvement du dos/bassin

Test de référence :
- Placer un bâton sur les lombaires
- Il ne doit PAS tomber pendant l'exercice`,
        tips: "Pas un test de temps mais de QUALITÉ. La stabilité du bassin est primordiale."
    },
    
    mcgillflexor: {
        title: "McGill Flexor Test",
        material: "Banc ou support incliné à 60°, chronomètre",
        protocol: `1. S'asseoir sur un banc incliné à 60°
2. Genoux et hanches à 90°
3. Croiser les bras sur la poitrine
4. Retirer le support dorsal
5. Tenir la position le plus longtemps possible

Position :
- Dos à 60° par rapport à l'horizontal
- Pas de support
- Immobile

Arrêt quand :
- Le dos descend
- Douleur lombaire`,
        tips: "Test crucial pour la santé du dos du golfeur. Contracter les abdos profonds."
    },
    
    mcgillextensor: {
        title: "McGill Extensor Test",
        material: "Banc, chronomètre",
        protocol: `1. S'allonger à plat ventre sur le bord d'un banc
2. Le haut du corps dépasse dans le vide (à partir de la crête iliaque)
3. Un partenaire tient les jambes
4. Maintenir le tronc à l'horizontale
5. Bras croisés sur la poitrine
6. Tenir le plus longtemps possible

Arrêt quand :
- Le buste descend
- Douleur lombaire`,
        tips: "Serrer les fessiers. Ne pas cambrer. Test essentiel pour les extenseurs du dos."
    },
    
    
    // MOBILITÉ
    standreach: {
        title: "Stand & Reach (Souplesse chaîne postérieure)",
        material: "Marche ou step (20-30cm), règle ou mètre",
        protocol: `PROTOCOLE STAND & REACH :

1. DEBOUT sur une marche ou un step
2. Pieds joints, genoux TENDUS
3. Se pencher en avant, bras tendus
4. Descendre les mains le PLUS BAS possible le long des jambes
5. Mesurer la distance SOUS le niveau des orteils

Mesure :
- Point 0 = niveau des orteils
- POSITIF (+) = les mains dépassent SOUS les orteils ✅
- NÉGATIF (-) = les mains n'atteignent PAS les orteils ❌

Exemple : 
- +10 cm = mains 10 cm sous les orteils (BIEN)
- -5 cm = mains 5 cm AU-DESSUS des orteils (raide)

Consignes :
- Garder les genoux TENDUS
- Pas de rebond, mouvement fluide
- Maintenir 2 secondes à la position maximale`,
        tips: "S'échauffer avant. Expirer en descendant. Ce test évalue TOUTE la chaîne postérieure (mollets + ischio + dos)."
    },
    
    thoracic: {
        title: "Rotation Thoracique",
        material: "Bâton, goniomètre ou application smartphone",
        protocol: `1. S'asseoir sur une chaise ou un banc
2. Placer un bâton sur les épaules (derrière la nuque)
3. Bloquer le bassin (ne doit PAS bouger)
4. Tourner le buste au maximum À GAUCHE
5. Mesurer l'angle de rotation (en degrés)
6. Répéter À DROITE

Mesure :
- Utiliser un goniomètre
- Ou application smartphone (inclinomètre)
- Angle entre la ligne des épaules et l'axe initial

Important : TESTER LES DEUX CÔTÉS
L'application détectera les asymétries.`,
        tips: "Le bassin ne doit ABSOLUMENT PAS bouger. Seul le tronc tourne."
    },
    
    hiprotation: {
        title: "Rotation de Hanche Interne/Externe",
        material: "Table/banc, goniomètre",
        protocol: `Position de départ :
1. Allongé sur le dos
2. Jambe testée : hanche et genou fléchis à 90°
3. L'autre jambe tendue au sol

ROTATION EXTERNE :
- Laisser tomber le pied VERS L'EXTÉRIEUR
- La cuisse pivote vers l'extérieur
- Mesurer l'angle

ROTATION INTERNE :
- Laisser tomber le pied VERS L'INTÉRIEUR
- La cuisse pivote vers l'intérieur
- Mesurer l'angle

Tester GAUCHE et DROITE pour chaque rotation.`,
        tips: "Bassin bien plaqué au sol. Ne pas tricher en soulevant la hanche."
    },
    
    ankle: {
        title: "Dorsiflexion Cheville (Test du mur)",
        material: "Mur, mètre ruban",
        protocol: `1. Se placer face à un mur
2. Avancer le genou vers le mur
3. Le TALON ne doit PAS décoller du sol
4. Mesurer la distance maximale entre les ORTEILS et le mur
5. Répéter pour l'autre pied

Position :
- Un pied à la fois
- Genou dans l'axe du pied
- Talon cloué au sol

Tester GAUCHE et DROITE.

Important : Mobilité cruciale pour le swing de golf.`,
        tips: "Plus la distance orteils-mur est grande, meilleure est la mobilité."
    },
    
    shoulder: {
        title: "Test Épaules - Apley Scratch Test",
        material: "Mètre ruban ou règle",
        protocol: `PRINCIPE (selon littérature) :
Évaluer la mobilité de l'épaule en rotation interne et externe.
Une main vient PAR LE HAUT (abduction + rotation externe),
l'autre PAR LE BAS (adduction + rotation interne).

PROTOCOLE :
1. Position debout, dos droit contre un mur
2. Demander au patient de joindre ses mains dans le dos
3. Main dominante en HAUT derrière la nuque
4. Main non-dominante en BAS depuis la taille
5. Mesurer la DISTANCE entre les doigts du milieu (majeurs)

MESURE (en centimètres) :
- DISTANCE POSITIVE (+) = Les mains NE SE TOUCHENT PAS
  • Exemple : +15 cm = 15 cm d'écart entre les doigts
- DISTANCE ZÉRO (0) = Les doigts se touchent exactement
- DISTANCE NÉGATIVE (-) = Les mains SE CHEVAUCHENT
  • Exemple : -5 cm = 5 cm de chevauchement

ÉPAULE TESTÉE :
L'épaule testée est celle du bras qui vient PAR LE HAUT.

Tester LES DEUX CÔTÉS :
- Test 1 : Bras DROIT en haut → épaule droite
- Test 2 : Bras GAUCHE en haut → épaule gauche

VALEURS DE RÉFÉRENCE (littérature) :
• Excellente mobilité : -5 à -10 cm (chevauchement)
• Bonne mobilité : 0 cm (doigts se touchent)
• Mobilité modérée : +5 à +10 cm
• Mobilité limitée : > +15 cm

IMPORTANT :
Comparer gauche vs droite pour détecter les asymétries.
Un écart >5cm entre les deux côtés est significatif.`,
        tips: "Bien se tenir droit contre le mur. Ne pas pencher le tronc ou cambrer le dos. Respirer normalement, ne pas forcer en apnée."
    },
    
    // ÉQUILIBRE
    balanceopen: {
        title: "Équilibre Yeux Ouverts",
        material: "Chronomètre",
        protocol: `1. Se tenir sur une jambe
2. Mains sur les hanches
3. Regard fixe devant soi
4. Tenir 60 secondes maximum

Tester GAUCHE et DROITE.

Arrêt quand :
- Le pied d'appui bouge (même légèrement)
- L'autre pied touche le sol
- Les mains quittent les hanches
- Perte d'équilibre

Objectif : 60 secondes sans bouger`,
        tips: "Fixer un point devant soi. Contracter le core."
    },
    
    balanceclosed: {
        title: "Équilibre Yeux Fermés",
        material: "Chronomètre",
        protocol: `1. Même protocole que yeux ouverts
2. MAIS les yeux sont FERMÉS
3. Tenir le plus longtemps possible

Tester GAUCHE et DROITE.

Arrêt quand :
- Le pied d'appui bouge
- L'autre pied touche le sol
- Les mains quittent les hanches
- Perte d'équilibre

Ce test est BEAUCOUP plus difficile !`,
        tips: "Bien s'équilibrer avant de fermer les yeux. Concentration maximale."
    }
};

const TEST_NAMES = {
    squat: "Squat 1RM",
    deadlift: "Deadlift 1RM",
    benchpress: "Développé Couché 1RM",
    pullup: "Tirage Vertical 1RM",
    legextension: "Leg Extension (G/D)",
    legpress: "Presse (G/D)",
    shuttle: "Navette 5x10m",
    driverspeed: "Driver Speed",
    vma: "VMA",
    maxpushups: "Max Pompes 1min",
    maxsquats: "Max Squats 1min",
    wallsit: "Chaise Unilatérale (G/D)",
    vertjump: "Détente Verticale",
    horizjump: "Détente Horizontale",
    medballchest: "MedBall Chest Pass",
    medballrotation: "MedBall Rotation Throw (G/D)",
    cmjunilateral: "CMJ Unilatéral (G/D)",
    rkcplank: "RKC Plank",
    sideplank: "Side Plank (G/D)",
    birddog: "Bird Dog",
    mcgillflexor: "McGill Flexor",
    mcgillextensor: "McGill Extensor",
    standreach: "Stand & Reach",
    thoracic: "Rotation Thoracique (G/D)",
    hiprotation: "Hip Rotation",
    ankle: "Dorsiflexion (G/D)",
    shoulder: "Test Épaules (G/D)",
    balanceopen: "Équilibre Yeux Ouverts (G/D)",
    balanceclosed: "Équilibre Yeux Fermés (G/D)"
};


// ==================== INITIALISATION ====================
// L'initialisation se fait à la fin du fichier pour gérer le cas où le DOM est déjà chargé

function initializeApp() {
    // Initialiser la date à aujourd'hui
    const testDateInput = document.getElementById('testDate');
    if (testDateInput) {
        testDateInput.valueAsDate = new Date();
    }
    
    // Charger les données sauvegardées
    loadFromLocalStorage();
    
    // Initialiser les accordéons
    setupAccordions();
    
    // Populate history select
    populateHistorySelect();
    
    console.log('✅ Application initialisée');
}

// ==================== EVENT LISTENERS ====================
// ==================== EXPORT / IMPORT DONNÉES ====================
function exportData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        currentPlayer: JSON.parse(localStorage.getItem('currentPlayer') || 'null'),
        testsHistory: JSON.parse(localStorage.getItem('testsHistory') || '[]')
    };
    
    if (!data.currentPlayer && data.testsHistory.length === 0) {
        alert('⚠️ Aucune donnée à exporter. Créez d\'abord un profil et enregistrez des tests.');
        return;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const today = new Date().toISOString().split('T')[0];
    const filename = `golf-tracker-backup-${today}.json`;
    
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = filename;
    downloadLink.click();
    
    alert(`✅ Données exportées avec succès !\n\nFichier: ${filename}\n\nProfil: ${data.currentPlayer ? data.currentPlayer.name : 'Aucun'}\nTests: ${data.testsHistory.length}`);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validation
            if (!data.version || (!data.currentPlayer && (!data.testsHistory || data.testsHistory.length === 0))) {
                throw new Error('Fichier invalide');
            }
            
            // Demander confirmation
            const playerInfo = data.currentPlayer ? `Profil: ${data.currentPlayer.name}` : 'Aucun profil';
            const testsInfo = `Tests: ${data.testsHistory ? data.testsHistory.length : 0}`;
            
            const confirmMsg = `⚠️ ATTENTION !\n\nCette action va REMPLACER toutes vos données actuelles par :\n\n${playerInfo}\n${testsInfo}\n\nÊtes-vous sûr ?`;
            
            if (!confirm(confirmMsg)) {
                event.target.value = ''; // Reset file input
                return;
            }
            
            // Sauvegarder les données
            if (data.currentPlayer) {
                localStorage.setItem('currentPlayer', JSON.stringify(data.currentPlayer));
                window.currentPlayer = data.currentPlayer;
            }
            
            if (data.testsHistory) {
                localStorage.setItem('testsHistory', JSON.stringify(data.testsHistory));
            }
            
            alert(`✅ Données importées avec succès !\n\n${playerInfo}\n${testsInfo}\n\nLa page va se recharger...`);
            
            // Recharger la page
            setTimeout(() => {
                location.reload();
            }, 1000);
            
        } catch (error) {
            alert('❌ Erreur lors de l\'import !\n\nLe fichier semble corrompu ou invalide.\n\nErreur: ' + error.message);
            event.target.value = ''; // Reset file input
        }
    };
    
    reader.onerror = function() {
        alert('❌ Erreur lors de la lecture du fichier !');
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

// Sauvegarde automatique à chaque modification
function autoBackup() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        currentPlayer: JSON.parse(localStorage.getItem('currentPlayer') || 'null'),
        testsHistory: JSON.parse(localStorage.getItem('testsHistory') || '[]')
    };
    
    // Sauvegarder dans un localStorage séparé pour backup automatique
    localStorage.setItem('autoBackup', JSON.stringify(data));
    console.log('💾 Sauvegarde automatique effectuée');
}

// Appeler autoBackup après chaque sauvegarde
const originalSaveProfile = saveProfile;
const originalSaveQualityTests = saveQualityTests;

// ==================== SETUP EVENT LISTENERS ====================
function setupEventListeners() {
    // Navigation entre onglets
    document.querySelectorAll('.tracker-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Bouton "Aujourd'hui"
    document.getElementById('setToday')?.addEventListener('click', function() {
        const testDateInput = document.getElementById('testDate');
        if (testDateInput) {
            testDateInput.valueAsDate = new Date();
        }
    });
    
    // Sauvegarde du profil
    document.getElementById('saveProfile')?.addEventListener('click', saveProfile);
    document.getElementById('clearProfile')?.addEventListener('click', clearProfile);
    
    // Sauvegarde des tests
    document.getElementById('saveTests')?.addEventListener('click', saveTests);
    document.getElementById('clearTests')?.addEventListener('click', clearTestInputs);
    
    // Gestion des données
    document.getElementById('exportBtn')?.addEventListener('click', exportData);
    document.getElementById('importBtn')?.addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile')?.addEventListener('change', importData);
    document.getElementById('generateReport')?.addEventListener('click', generateReport);
    
    // Historique
    document.getElementById('historyTestSelect')?.addEventListener('change', updateHistoryChart);
    document.getElementById('clearHistory')?.addEventListener('click', clearHistory);
    
    // Boutons d'aide
    document.querySelectorAll('.help-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const testType = this.dataset.test;
            if (testType === 'mirwald') {
                showMirwaldInfo();
            } else {
                showProtocol(testType);
            }
        });
    });
    
    // Modal
    const modal = document.getElementById('helpModal');
    const closeBtn = modal?.querySelector('.close');
    closeBtn?.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // Photo de profil
    document.getElementById('profilePhoto')?.addEventListener('change', handlePhotoUpload);
    document.getElementById('removePhoto')?.addEventListener('click', removePhoto);
    
    // Couleur de personnalisation
    document.getElementById('profileColor')?.addEventListener('change', handleColorChange);
    
    // Niveau de jeu
    document.getElementById('playerLevel')?.addEventListener('change', handleLevelChange);
    
    // Calcul Mirwald, IMC et Envergure
    ['playerGender', 'playerAge', 'playerHeight', 'playerSittingHeight', 'playerWeight'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateMirwald);
        document.getElementById(id)?.addEventListener('change', calculateMirwald);
        document.getElementById(id)?.addEventListener('input', calculateIMC);
        document.getElementById(id)?.addEventListener('change', calculateIMC);
    });
    
    ['playerHeight', 'playerWingspan'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateWingspan);
        document.getElementById(id)?.addEventListener('change', calculateWingspan);
    });
}

// ==================== MENU MOBILE ====================
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ==================== ACCORDÉONS ====================
function setupAccordions() {
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Fermer tous les accordéons
            document.querySelectorAll('.category-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
            });
            
            // Ouvrir celui cliqué si il n'était pas actif
            if (!isActive) {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });
}

// ==================== NAVIGATION ====================
// ==================== UPDATE DASHBOARD ====================
function updateDashboard() {
    console.log('📊 Dashboard chargé');
    
    // 1. CITATION ALÉATOIRE
    const quotes = [
        {en: "The talent without work is nothing.", fr: "Le talent sans travail n'est rien.", author: "Cristiano Ronaldo"},
        {en: "Champions are made when no one is watching.", fr: "Les champions se forgent quand personne ne regarde.", author: "Unknown"},
        {en: "Discipline is doing what needs to be done, even when you don't want to do it.", fr: "La discipline, c'est faire ce qui doit être fait, même quand on n'en a pas envie.", author: "Unknown"},
        {en: "Hard work beats talent when talent doesn't work hard.", fr: "Le travail acharné bat le talent quand le talent ne travaille pas dur.", author: "Tim Notke"},
        {en: "You miss 100% of the shots you don't take.", fr: "Vous ratez 100% des coups que vous ne tentez pas.", author: "Wayne Gretzky"},
        {en: "The difference between the impossible and the possible lies in determination.", fr: "La différence entre l'impossible et le possible réside dans la détermination.", author: "Tommy Lasorda"},
        {en: "Pain is temporary. Quitting lasts forever.", fr: "La douleur est temporaire. Abandonner dure toujours.", author: "Lance Armstrong"},
        {en: "It's not whether you get knocked down, it's whether you get up.", fr: "Ce n'est pas de savoir si vous tombez, mais si vous vous relevez.", author: "Vince Lombardi"},
        {en: "The more difficult the victory, the greater the happiness in winning.", fr: "Plus la victoire est difficile, plus grand est le bonheur de gagner.", author: "Pelé"}
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('dashQuote');
    if (quoteEl) {
        quoteEl.innerHTML = `
            <p style="font-size: 20px; font-style: italic; margin: 0 0 10px 0;">"${randomQuote.en}"</p>
            <p style="font-size: 16px; font-style: italic; margin: 0 0 10px 0; opacity: 0.9;">"${randomQuote.fr}"</p>
            <p style="font-size: 14px; text-align: right; margin: 0; opacity: 0.8;">— ${randomQuote.author}</p>
        `;
    }
    
    // 2. RÉCUPÉRER LES DONNÉES
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const scores = calculateQualityScores();
    
    // 3. NOTE GLOBALE
    if (scores) {
        const validScores = Object.values(scores).filter(s => s !== null && !isNaN(s));
        if (validScores.length > 0) {
            const moyenne = validScores.reduce((a, b) => a + b, 0) / validScores.length;
            document.getElementById('dashGlobalScore').textContent = moyenne.toFixed(1);
        } else {
            document.getElementById('dashGlobalScore').textContent = '--';
        }
    }
    
    // 4. DERNIER TEST
    if (history.length > 0) {
        const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastTest = sortedHistory[0];
        const quality = QUALITY_TESTS[lastTest.quality];
        const date = new Date(lastTest.date);
        const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        document.getElementById('dashLastTest').textContent = quality?.name || lastTest.quality;
        document.getElementById('dashLastTestDate').textContent = daysAgo === 0 ? "Aujourd'hui" : `Il y a ${daysAgo} jour${daysAgo > 1 ? 's' : ''}`;
    } else {
        document.getElementById('dashLastTest').textContent = 'Aucun';
        document.getElementById('dashLastTestDate').textContent = '--';
    }
    
    // 5. TOTAL TESTS
    document.getElementById('dashTotalTests').textContent = history.length;
    
    // 6. MEILLEUR SCORE
    if (scores) {
        const qualites = [
            {name: 'Force', score: scores.force},
            {name: 'Vitesse', score: scores.vitesse},
            {name: 'Endurance', score: scores.endurance},
            {name: 'Explosivité', score: scores.explosivite},
            {name: 'Core', score: scores.core},
            {name: 'Mobilité', score: scores.mobilite},
            {name: 'Équilibre', score: scores.equilibre}
        ].filter(q => q.score !== null).sort((a, b) => b.score - a.score);
        
        if (qualites.length > 0) {
            const best = qualites[0];
            document.getElementById('dashBestScore').textContent = best.score.toFixed(1) + '/20';
            document.getElementById('dashBestQuality').textContent = best.name;
        } else {
            document.getElementById('dashBestScore').textContent = '--';
            document.getElementById('dashBestQuality').textContent = 'Aucune qualité testée';
        }
    }
    
    // 7. QUALITÉS NON TESTÉES
    const missingEl = document.getElementById('dashMissing');
    if (scores) {
        const missing = [
            {name: 'Force', score: scores.force},
            {name: 'Vitesse', score: scores.vitesse},
            {name: 'Endurance', score: scores.endurance},
            {name: 'Explosivité', score: scores.explosivite},
            {name: 'Core', score: scores.core},
            {name: 'Mobilité', score: scores.mobilite},
            {name: 'Équilibre', score: scores.equilibre}
        ].filter(q => q.score === null);
        
        if (missing.length === 0) {
            missingEl.innerHTML = '<p style="color: #27ae60; font-weight: 600; margin: 0;">✅ Toutes les qualités ont été testées !</p>';
        } else {
            missingEl.innerHTML = '<div style="display: flex; flex-wrap: wrap; gap: 10px;">' + 
                missing.map(q => `<span style="background: #ffebee; color: #c62828; padding: 8px 15px; border-radius: 20px; font-size: 14px; font-weight: 600;">❌ ${q.name}</span>`).join('') +
                '</div>';
        }
    } else {
        missingEl.innerHTML = '<p style="color: #999; margin: 0;">Complétez des tests pour voir cette section</p>';
    }
    
    // 8. CONSEIL DU JOUR
    const adviceEl = document.getElementById('dashAdvice');
    const advices = [];
    
    if (scores) {
        const missing = [
            {name: 'Force', score: scores.force, icon: '💪'},
            {name: 'Vitesse', score: scores.vitesse, icon: '⚡'},
            {name: 'Endurance', score: scores.endurance, icon: '🏃'},
            {name: 'Explosivité', score: scores.explosivite, icon: '🚀'},
            {name: 'Core', score: scores.core, icon: '🎯'},
            {name: 'Mobilité', score: scores.mobilite, icon: '🤸'},
            {name: 'Équilibre', score: scores.equilibre, icon: '⚖️'}
        ].filter(q => q.score === null);
        
        if (missing.length > 0) {
            const randomMissing = missing[Math.floor(Math.random() * missing.length)];
            advices.push(`${randomMissing.icon} <strong>Testez votre ${randomMissing.name} cette semaine !</strong> Vous n'avez pas encore évalué cette qualité.`);
        }
        
        const weak = [
            {name: 'Force', score: scores.force},
            {name: 'Vitesse', score: scores.vitesse},
            {name: 'Endurance', score: scores.endurance},
            {name: 'Explosivité', score: scores.explosivite},
            {name: 'Core', score: scores.core},
            {name: 'Mobilité', score: scores.mobilite},
            {name: 'Équilibre', score: scores.equilibre}
        ].filter(q => q.score !== null && q.score < 12).sort((a, b) => a.score - b.score);
        
        if (weak.length > 0) {
            advices.push(`⚠️ <strong>Votre ${weak[0].name} nécessite attention</strong> (${weak[0].score.toFixed(1)}/20). Consultez le rapport pour un plan d'action personnalisé.`);
        }
    }
    
    if (advices.length === 0) {
        advices.push('🎯 <strong>Complétez tous les tests</strong> pour obtenir un bilan complet et des recommandations personnalisées !');
    }
    
    const randomAdvice = advices[Math.floor(Math.random() * advices.length)];
    adviceEl.innerHTML = `<p style="margin: 0;">${randomAdvice}</p>`;
    
    // 9. RECORD PERSONNEL
    const recordEl = document.getElementById('dashRecord');
    
    if (history.length === 0) {
        recordEl.innerHTML = '<p style="color: #999; margin: 0;">Complétez des tests pour voir vos records !</p>';
    } else {
        const allTestResults = [];
        history.forEach(record => {
            Object.entries(record.tests).forEach(([testKey, value]) => {
                if (value !== null && value !== undefined) {
                    const numValue = typeof value === 'object' ? 
                        ((value.left || 0) + (value.right || 0)) / 2 : value;
                    
                    const testDef = Object.values(QUALITY_TESTS)
                        .flatMap(q => q.tests)
                        .find(t => t.key === testKey);
                    
                    if (testDef) {
                        const score = calculateScore20(testKey, numValue);
                        if (score !== null) {
                            allTestResults.push({
                                name: testDef.name,
                                value: numValue,
                                unit: testDef.unit,
                                score: score,
                                badge: getBadgeLabel(score)
                            });
                        }
                    }
                }
            });
        });
        
        if (allTestResults.length > 0) {
            allTestResults.sort((a, b) => b.score - a.score);
            const best = allTestResults[0];
            
            recordEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #27ae60;">
                    <div>
                        <div style="font-size: 18px; font-weight: 700; color: #1a4d2e; margin-bottom: 5px;">${best.name}</div>
                        <div style="font-size: 14px; color: #666;">${best.value.toFixed(1)} ${best.unit} — ${best.score.toFixed(1)}/20</div>
                    </div>
                    <span class="badge badge-${best.badge.class}">${best.badge.label}</span>
                </div>
            `;
        } else {
            recordEl.innerHTML = '<p style="color: #999; margin: 0;">Aucun test avec score calculé</p>';
        }
    }
}

function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('.tracker-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
    
    // Charger le contenu spécifique de l'onglet
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'history') {
        // Charger la vue Évolution par défaut
        switchHistoryView('evolution');
    } else if (tabName === 'analyse') {
        // Charger toutes les données Analyse Pro
        updateAnalysePro();
        // Puis charger la vue Synthèse par défaut
        setTimeout(() => switchAnalyseView('synthese'), 100);
    }
}

// ==================== CALCULATEUR 1RM (BRZYCKI) ====================
function calculateBrzycki(weight, reps) {
    if (!weight || !reps || reps < 1 || reps > 12) return null;
    if (reps === 1) return weight;
    
    const oneRM = weight * (36 / (37 - reps));
    return Math.round(oneRM * 10) / 10;
}

function setupRMCalculators() {
    ['squat', 'deadlift', 'benchpress', 'pullup'].forEach(exercise => {
        const rmInput = document.getElementById(`test-${exercise}-1rm`);
        const weightInput = document.getElementById(`test-${exercise}-weight`);
        const repsInput = document.getElementById(`test-${exercise}-reps`);
        const calculatedDisplay = document.getElementById(`${exercise}-calculated`);
        
        if (!rmInput || !weightInput || !repsInput || !calculatedDisplay) return;
        
        // Quand on entre un 1RM direct
        rmInput.addEventListener('input', function() {
            if (this.value) {
                weightInput.value = '';
                repsInput.value = '';
                calculatedDisplay.textContent = this.value + ' kg';
            } else {
                calculatedDisplay.textContent = '-';
            }
        });
        
        // Quand on entre poids + reps
        function updateCalculated() {
            const weight = parseFloat(weightInput.value);
            const reps = parseInt(repsInput.value);
            
            if (weight && reps) {
                rmInput.value = '';
                const calculated = calculateBrzycki(weight, reps);
                if (calculated) {
                    calculatedDisplay.textContent = calculated + ' kg';
                } else {
                    calculatedDisplay.textContent = 'Erreur';
                }
            } else {
                calculatedDisplay.textContent = '-';
            }
        }
        
        weightInput.addEventListener('input', updateCalculated);
        repsInput.addEventListener('input', updateCalculated);
    });
}

// ==================== PROFIL JOUEUR ====================
function saveProfile() {
    const name = document.getElementById('playerName').value;
    const gender = document.getElementById('playerGender').value;
    const age = document.getElementById('playerAge').value;
    const weight = parseFloat(document.getElementById('playerWeight').value);
    const height = parseFloat(document.getElementById('playerHeight').value);
    const sittingHeight = parseFloat(document.getElementById('playerSittingHeight').value) || null;
    const wingspan = parseFloat(document.getElementById('playerWingspan').value) || null;
    const level = document.getElementById('playerLevel').value;
    const handicap = document.getElementById('playerHandicap').value || null;
    const circuit = document.getElementById('playerCircuit').value || null;
    const color = document.getElementById('profileColor').value;
    const photoPreview = document.getElementById('profilePhotoPreview');
    const photo = photoPreview.style.display !== 'none' ? photoPreview.src : null;
    
    // Limitations physiques
    const limitations = {
        blessure: document.getElementById('limitBlessure')?.checked || false,
        douleur: document.getElementById('limitDouleur')?.checked || false,
        mobilite: document.getElementById('limitMobilite')?.checked || false,
        postOp: document.getElementById('limitPostOp')?.checked || false,
        fatigue: document.getElementById('limitFatigue')?.checked || false,
        autre: document.getElementById('limitAutre')?.checked || false,
        details: document.getElementById('limitDetails')?.value || '',
        impact: parseFloat(document.getElementById('limitImpact')?.value || 0)
    };
    
    if (!name || !weight || weight <= 0 || !height || height <= 0) {
        alert('Veuillez remplir tous les champs obligatoires (*) avec des valeurs valides.');
        return;
    }
    
    currentPlayer = { 
        name, gender, age, weight, height, sittingHeight, wingspan,
        level, handicap, circuit, color, photo, limitations
    };
    
    if (sittingHeight) {
        currentPlayer.mirwald = calculateMirwald();
    }
    
    currentPlayer.imc = calculateIMC();
    
    if (wingspan) {
        currentPlayer.wingspanData = calculateWingspan();
    }
    
    localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Sauvegarde automatique
    autoBackup();
    
    alert(`Profil de ${name} enregistré !`);
    updatePlayerDisplay();
    
    // Afficher les barèmes après enregistrement du profil
    setTimeout(() => {
        if (typeof displayBaremes === 'function') {
            displayBaremes();
        }
    }, 200);
}

function clearProfile() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les informations du profil ?')) {
        document.getElementById('playerName').value = '';
        document.getElementById('playerGender').value = 'M';
        document.getElementById('playerAge').value = '<12';
        document.getElementById('playerWeight').value = '';
        document.getElementById('playerHeight').value = '';
        document.getElementById('playerSittingHeight').value = '';
        document.getElementById('playerLevel').value = 'amateur';
        document.getElementById('playerHandicap').value = '';
        document.getElementById('profilePhoto').value = '';
        document.getElementById('profilePhotoPreview').style.display = 'none';
        document.getElementById('removePhoto').style.display = 'none';
        document.getElementById('profileColor').value = '#1a4d2e';
        document.getElementById('mirwaldResult').style.display = 'none';
    }
}

function loadPlayerData() {
    const saved = localStorage.getItem('currentPlayer');
    if (saved) {
        currentPlayer = JSON.parse(saved);
        document.getElementById('playerName').value = currentPlayer.name;
        document.getElementById('playerGender').value = currentPlayer.gender;
        document.getElementById('playerAge').value = currentPlayer.age || '<12';
        document.getElementById('playerWeight').value = currentPlayer.weight;
        document.getElementById('playerHeight').value = currentPlayer.height || '';
        document.getElementById('playerSittingHeight').value = currentPlayer.sittingHeight || '';
        if (document.getElementById('playerWingspan')) {
            document.getElementById('playerWingspan').value = currentPlayer.wingspan || '';
        }
        document.getElementById('playerLevel').value = currentPlayer.level || 'amateur';
        document.getElementById('playerHandicap').value = currentPlayer.handicap || '';
        document.getElementById('playerCircuit').value = currentPlayer.circuit || '';
        document.getElementById('profileColor').value = currentPlayer.color || '#1a4d2e';
        
        if (currentPlayer.color) {
            document.documentElement.style.setProperty('--primary-color', currentPlayer.color);
            document.getElementById('colorPreview').textContent = currentPlayer.color;
        }
        
        if (currentPlayer.photo) {
            const preview = document.getElementById('profilePhotoPreview');
            preview.src = currentPlayer.photo;
            preview.style.display = 'block';
            document.getElementById('removePhoto').style.display = 'inline-block';
        }
        
        if (currentPlayer.level === 'playing-pro') {
            document.getElementById('handicapGroup').style.display = 'none';
            document.getElementById('circuitGroup').style.display = 'block';
        }
        
        // Charger limitations physiques
        if (currentPlayer.limitations) {
            const lim = currentPlayer.limitations;
            if (document.getElementById('limitBlessure')) document.getElementById('limitBlessure').checked = lim.blessure || false;
            if (document.getElementById('limitDouleur')) document.getElementById('limitDouleur').checked = lim.douleur || false;
            if (document.getElementById('limitMobilite')) document.getElementById('limitMobilite').checked = lim.mobilite || false;
            if (document.getElementById('limitPostOp')) document.getElementById('limitPostOp').checked = lim.postOp || false;
            if (document.getElementById('limitFatigue')) document.getElementById('limitFatigue').checked = lim.fatigue || false;
            if (document.getElementById('limitAutre')) document.getElementById('limitAutre').checked = lim.autre || false;
            if (document.getElementById('limitDetails')) document.getElementById('limitDetails').value = lim.details || '';
            if (document.getElementById('limitImpact')) document.getElementById('limitImpact').value = lim.impact || 0;
        }
        
        updatePlayerDisplay();
        calculateMirwald();
        calculateIMC();
        calculateWingspan();
        
        // Afficher les barèmes après chargement du profil
        setTimeout(() => {
            if (typeof displayBaremes === 'function') {
                displayBaremes();
            }
        }, 300);
    }
}

function updatePlayerDisplay() {
    const display = document.getElementById('playerInfoDisplay');
    if (currentPlayer && display) {
        display.innerHTML = `
            <strong>${currentPlayer.name}</strong> - 
            ${currentPlayer.gender === 'M' ? 'Homme' : 'Femme'}, 
            ${currentPlayer.age}, 
            ${currentPlayer.weight}kg
        `;
    }
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('profilePhotoPreview');
            preview.src = event.target.result;
            preview.style.display = 'block';
            document.getElementById('removePhoto').style.display = 'inline-block';
            
            if (currentPlayer) {
                currentPlayer.photo = event.target.result;
                localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
            }
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    document.getElementById('profilePhotoPreview').style.display = 'none';
    document.getElementById('profilePhoto').value = '';
    document.getElementById('removePhoto').style.display = 'none';
    if (currentPlayer) {
        delete currentPlayer.photo;
        localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    }
}

function handleColorChange() {
    const color = document.getElementById('profileColor').value;
    document.documentElement.style.setProperty('--primary-color', color);
    document.getElementById('colorPreview').textContent = color;
    
    if (currentPlayer) {
        currentPlayer.color = color;
        localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    }
}

function handleLevelChange() {
    const level = document.getElementById('playerLevel').value;
    const handicapGroup = document.getElementById('handicapGroup');
    const circuitGroup = document.getElementById('circuitGroup');
    
    if (level === 'playing-pro') {
        handicapGroup.style.display = 'none';
        circuitGroup.style.display = 'block';
    } else {
        handicapGroup.style.display = 'block';
        circuitGroup.style.display = 'none';
    }
}

function calculateMirwald() {
    const gender = document.getElementById('playerGender').value;
    const ageValue = document.getElementById('playerAge').value;
    const height = parseFloat(document.getElementById('playerHeight').value);
    const sittingHeight = parseFloat(document.getElementById('playerSittingHeight').value);
    const weight = parseFloat(document.getElementById('playerWeight').value);
    
    // Mirwald n'est valable que pour les <18 ans
    if (!ageValue || ageValue === '17-25' || ageValue === '25-40' || ageValue === '40-50' || ageValue === '50+') {
        document.getElementById('mirwaldResult').style.display = 'none';
        return null;
    }
    
    if (!height || !sittingHeight || !weight) {
        document.getElementById('mirwaldResult').style.display = 'none';
        return null;
    }
    
    // Convertir la catégorie d'âge en âge numérique (milieu de la fourchette)
    let age;
    if (ageValue === '<12') age = 10;
    else if (ageValue === '12-14') age = 13;
    else if (ageValue === '14-17') age = 15.5;
    else age = parseInt(ageValue) || 14;
    
    const legLength = height - sittingHeight;
    let maturityOffset;
    
    if (gender === 'M') {
        maturityOffset = -9.236 + 
                        (0.0002708 * legLength * sittingHeight) + 
                        (-0.001663 * age * legLength) + 
                        (0.007216 * age * sittingHeight) + 
                        (0.02292 * weight / height * 100);
    } else {
        maturityOffset = -9.376 + 
                        (0.0001882 * legLength * sittingHeight) + 
                        (0.0022 * age * legLength) + 
                        (0.005841 * age * sittingHeight) + 
                        (-0.002658 * age * weight) + 
                        (0.07693 * weight / height * 100);
    }
    
    const resultDiv = document.getElementById('mirwaldResult');
    const displayDiv = resultDiv.querySelector('.mirwald-display');
    
    resultDiv.style.display = 'block';
    
    if (maturityOffset < -1) {
        displayDiv.innerHTML = `⏳ Pré-pubertaire<br><small>${Math.abs(maturityOffset).toFixed(1)} ans avant le pic de croissance</small>`;
        displayDiv.style.background = '#e3f2fd';
        displayDiv.style.color = '#1565c0';
    } else if (maturityOffset >= -1 && maturityOffset <= 1) {
        displayDiv.innerHTML = `📈 En plein pic de croissance<br><small>Phase critique de développement</small>`;
        displayDiv.style.background = '#fff3e0';
        displayDiv.style.color = '#e65100';
    } else {
        displayDiv.innerHTML = `✅ Post-pubertaire<br><small>${maturityOffset.toFixed(1)} ans après le pic de croissance</small>`;
        displayDiv.style.background = '#e8f5e9';
        displayDiv.style.color = '#2e7d32';
    }
    
    return maturityOffset;
}

// ==================== CALCUL IMC ====================
function calculateIMC() {
    const height = parseFloat(document.getElementById('playerHeight').value);
    const weight = parseFloat(document.getElementById('playerWeight').value);
    
    const resultDiv = document.getElementById('imcResult');
    
    if (!height || !weight || height <= 0 || weight <= 0) {
        if (resultDiv) resultDiv.style.display = 'none';
        return null;
    }
    
    const imc = weight / Math.pow(height / 100, 2);
    
    let category = '';
    let color = '';
    
    if (imc < 18.5) {
        category = 'Maigreur';
        color = '#3498db';
    } else if (imc >= 18.5 && imc < 25) {
        category = 'Normal';
        color = '#27ae60';
    } else if (imc >= 25 && imc < 30) {
        category = 'Surpoids';
        color = '#f39c12';
    } else {
        category = 'Obésité';
        color = '#e74c3c';
    }
    
    if (resultDiv) {
        const displayDiv = resultDiv.querySelector('.imc-display');
        if (displayDiv) {
            displayDiv.innerHTML = `<strong>IMC: ${imc.toFixed(1)}</strong> - ${category}`;
            displayDiv.style.background = color + '20';
            displayDiv.style.color = color;
            displayDiv.style.padding = '0.5rem';
            displayDiv.style.borderRadius = '4px';
            displayDiv.style.fontWeight = '600';
        }
        resultDiv.style.display = 'block';
    }
    
    return imc;
}

// ==================== CONSEILS ENVERGURE ====================
function calculateWingspan() {
    const height = parseFloat(document.getElementById('playerHeight').value);
    const wingspan = parseFloat(document.getElementById('playerWingspan')?.value);
    
    const resultDiv = document.getElementById('wingspanResult');
    
    if (!height || !wingspan || height <= 0 || wingspan <= 0) {
        if (resultDiv) resultDiv.style.display = 'none';
        return null;
    }
    
    const diff = wingspan - height;
    const ratio = (wingspan / height).toFixed(3);
    
    let advice = '';
    let clubAdvice = '';
    let exerciseAdvice = '';
    
    if (diff > 5) {
        clubAdvice = '📏 <strong>Matériel:</strong> Envisager des clubs +0.5" à +1" plus longs';
        exerciseAdvice = '💪 <strong>Exos recommandés:</strong> Mobilité thoracique, rotation du tronc, étirements chaîne postérieure';
    } else if (diff < -5) {
        clubAdvice = '📏 <strong>Matériel:</strong> Envisager des clubs -0.5" à -1" plus courts';
        exerciseAdvice = '💪 <strong>Exos recommandés:</strong> Renforcement épaules, travail de la posture, stabilité du tronc';
    } else {
        clubAdvice = '📏 <strong>Matériel:</strong> Taille standard adaptée';
        exerciseAdvice = '💪 <strong>Exos recommandés:</strong> Équilibre musculaire, mobilité générale';
    }
    
    if (resultDiv) {
        const displayDiv = resultDiv.querySelector('.wingspan-display');
        if (displayDiv) {
            displayDiv.innerHTML = `
                <div style="margin-bottom: 0.5rem;">
                    <strong>Envergure:</strong> ${wingspan} cm (${diff >= 0 ? '+' : ''}${diff.toFixed(1)} cm vs taille)
                    <br><small>Ratio: ${ratio}</small>
                </div>
                <div style="font-size: 0.9rem; line-height: 1.6;">
                    ${clubAdvice}<br>
                    ${exerciseAdvice}
                </div>
            `;
            displayDiv.style.background = '#f8f9fa';
            displayDiv.style.padding = '0.75rem';
            displayDiv.style.borderRadius = '6px';
            displayDiv.style.border = '1px solid #dee2e6';
        }
        resultDiv.style.display = 'block';
    }
    
    return {wingspan, diff, ratio};
}

function showMirwaldInfo() {
    const modal = document.getElementById('helpModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.textContent = "Équation de Mirwald - Maturité Biologique";
    body.innerHTML = `
        <h4>Qu'est-ce que l'équation de Mirwald ?</h4>
        <p>L'équation de Mirwald (2002) permet d'estimer l'âge de maturité d'un jeune athlète.</p>
        
        <h4>Pourquoi c'est important ?</h4>
        <ul>
            <li>Individualisation de l'entraînement</li>
            <li>Prévention des blessures</li>
            <li>Détection de talents</li>
        </ul>
        
        <h4>Comment mesurer ?</h4>
        <ol>
            <li><strong>Taille debout :</strong> Se tenir droit contre un mur</li>
            <li><strong>Taille assise :</strong> Assis sur un banc, mesurer du sommet au banc</li>
        </ol>
    `;
    
    modal.style.display = 'block';
}

// ==================== SAUVEGARDE DES TESTS ====================
function saveTests() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer un profil joueur.');
        switchTab('profile');
        return;
    }
    
    const testDate = document.getElementById('testDate')?.value || new Date().toISOString().split('T')[0];
    
    const testData = {
        date: new Date(testDate).toISOString(),
        player: currentPlayer,
        results: {}
    };
    
    // Tests de force avec 1RM calculé
    ['squat', 'deadlift', 'benchpress', 'pullup'].forEach(exerciseName => {
        const rmDirect = parseFloat(document.getElementById(`test-${exerciseName}-1rm`)?.value);
        const weight = parseFloat(document.getElementById(`test-${exerciseName}-weight`)?.value);
        const reps = parseInt(document.getElementById(`test-${exerciseName}-reps`)?.value);
        
        let finalRM = null;
        
        if (rmDirect) {
            finalRM = rmDirect;
        } else if (weight && reps) {
            finalRM = calculateBrzycki(weight, reps);
        }
        
        if (finalRM) {
            testData.results[exerciseName] = finalRM;
        }
    });
    
    // Tous les autres tests
    Object.keys(BAREMES).forEach(testKey => {
        if (['squat', 'deadlift', 'benchpress', 'pullup'].includes(testKey)) return;
        
        const bareme = BAREMES[testKey];
        
        if (bareme.bilateral) {
            const leftValue = parseFloat(document.getElementById(`test-${testKey}-left`)?.value);
            const rightValue = parseFloat(document.getElementById(`test-${testKey}-right`)?.value);
            
            if (!isNaN(leftValue) && !isNaN(rightValue)) {
                testData.results[testKey] = { left: leftValue, right: rightValue };
            }
        } else {
            const value = parseFloat(document.getElementById(`test-${testKey}`)?.value);
            if (!isNaN(value)) {
                testData.results[testKey] = value;
            }
        }
    });
    
    // Poids du medball
    const medballWeight = document.getElementById('test-medball-weight')?.value;
    if (testData.results.medball) {
        testData.medballWeight = medballWeight;
    }
    
    // Tests TPI
    const tpiTests = {};
    document.querySelectorAll('[id^="tpi-"]').forEach(select => {
        if (select.value) {
            tpiTests[select.id.replace('tpi-', '')] = select.value;
        }
    });
    if (Object.keys(tpiTests).length > 0) {
        testData.tpi = tpiTests;
    }
    
    if (Object.keys(testData.results).length === 0 && !testData.tpi) {
        alert('Veuillez saisir au moins un test.');
        return;
    }
    
    allTests.push(testData);
    localStorage.setItem('allTests', JSON.stringify(allTests));
    
    alert(`Tests du ${new Date(testDate).toLocaleDateString('fr-FR')} enregistrés !`);
    switchTab('dashboard');
}

function clearTestInputs() {
    if (confirm('Êtes-vous sûr de vouloir effacer tous les champs de saisie ?')) {
        document.querySelectorAll('#tests-tab input').forEach(input => input.value = '');
        document.querySelectorAll('#tests-tab select').forEach(select => select.selectedIndex = 0);
    }
}

// ==================== DASHBOARD (Version simplifiée) ====================
// ==================== PROTOCOLES ====================
function showProtocol(testKey) {
    const protocol = PROTOCOLS[testKey];
    if (!protocol) return;
    
    const modal = document.getElementById('helpModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.textContent = protocol.title;
    body.innerHTML = `
        <p><strong>Matériel:</strong> ${protocol.material}</p>
        <p><strong>Protocole:</strong></p>
        <pre style="white-space: pre-wrap; background: #f7fafc; padding: 1rem; border-radius: 8px;">${protocol.protocol}</pre>
        <p><strong>💡 Conseil:</strong> ${protocol.tips}</p>
    `;
    
    modal.style.display = 'block';
}

// ==================== HISTORIQUE ====================
function populateHistorySelect() {
    const select = document.getElementById('historyTestSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Sélectionner un test...</option>';
    Object.entries(TEST_NAMES).forEach(([key, name]) => {
        select.innerHTML += `<option value="${key}">${name}</option>`;
    });
}

function updateHistoryChart() {
    alert('Fonction historique en cours de développement');
}

function clearHistory() {
    if (confirm('Effacer tout l\'historique ?')) {
        allTests = [];
        localStorage.removeItem('allTests');
        alert('Historique effacé.');
    }
}

// ==================== IMPORT/EXPORT ====================
// ==================== BACKUP AUTOMATIQUE ====================
function autoBackup() {
    // Sauvegarder automatiquement toutes les 5 sauvegardes de tests
    const backupCount = parseInt(localStorage.getItem('backupCount') || '0');
    
    if (backupCount >= 5) {
        // Créer un backup silencieux
        const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
        const data = {
            player: currentPlayer,
            testsHistory: history,
            exportDate: new Date().toISOString(),
            version: '2.0',
            autoBackup: true
        };
        
        // Sauvegarder dans localStorage comme backup de secours
        localStorage.setItem('lastAutoBackup', JSON.stringify(data));
        localStorage.setItem('lastAutoBackupDate', new Date().toISOString());
        localStorage.setItem('backupCount', '0');
        
        console.log('💾 Backup automatique créé');
    } else {
        localStorage.setItem('backupCount', (backupCount + 1).toString());
    }
}

// ==================== EXPORT / IMPORT ====================
function exportData() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    const data = {
        player: currentPlayer,
        testsHistory: history,
        exportDate: new Date().toISOString(),
        version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileName = `golf-tracker-${currentPlayer?.name || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    link.download = fileName;
    link.click();
    
    alert(`✅ Données exportées !\n\n📁 Fichier: ${fileName}\n👤 Profil: ${currentPlayer?.name || 'N/A'}\n📊 Tests: ${history.length}`);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Importer le profil
            if (data.player) {
                currentPlayer = data.player;
                localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
                loadPlayerData();
            }
            
            // Importer l'historique des tests
            if (data.testsHistory) {
                localStorage.setItem('testsHistory', JSON.stringify(data.testsHistory));
            }
            // Support de l'ancien format (allTests)
            else if (data.tests) {
                // Convertir ancien format vers nouveau
                const convertedHistory = data.tests.map((test, index) => ({
                    id: Date.now() + index,
                    date: test.date || new Date().toISOString(),
                    quality: 'force', // Par défaut, à ajuster
                    player: data.player?.name || 'Unknown',
                    tests: test
                }));
                localStorage.setItem('testsHistory', JSON.stringify(convertedHistory));
            }
            
            const importedTests = data.testsHistory?.length || data.tests?.length || 0;
            
            alert(`✅ Données importées avec succès !\n\n👤 Profil: ${data.player?.name || 'N/A'}\n📊 Tests: ${importedTests}\n📅 Date export: ${data.exportDate ? new Date(data.exportDate).toLocaleDateString('fr-FR') : 'N/A'}\n\n🔄 La page va se recharger automatiquement...`);
            
            // Recharger la page pour tout rafraîchir proprement
            setTimeout(() => {
                location.reload();
            }, 500);
            
        } catch (error) {
            alert('Erreur lors de l\'import');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function generateReport() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    // Générer le bilan complet (toutes les pages dans une seule fenêtre)
    generateCompleteBilan();
}

// ==================== BILAN COMPLET - TOUTES LES PAGES ====================
function generateCompleteBilan() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    const scores = calculateQualityScores();
    if (!scores) {
        alert('Erreur lors du calcul des scores');
        return;
    }
    
    // Calculer la moyenne générale
    const validScores = Object.values(scores).filter(s => s !== null && !isNaN(s));
    const moyenneGenerale = validScores.length > 0 
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
        : 0;
    
    // Identifier points forts et faibles
    const qualites = [
        {name: 'Force', score: scores.force},
        {name: 'Vitesse', score: scores.vitesse},
        {name: 'Endurance', score: scores.endurance},
        {name: 'Explosivité', score: scores.explosivite},
        {name: 'Core & Stabilité', score: scores.core},
        {name: 'Mobilité', score: scores.mobilite},
        {name: 'Équilibre', score: scores.equilibre}
    ].filter(q => q.score !== null);
    
    qualites.sort((a, b) => b.score - a.score);
    
    const pointsForts = qualites.slice(0, 2);
    const pointsFaibles = qualites.slice(-2).reverse();
    
    // Fonctions helper pour les recommandations
    const getExercisesForQuality = (quality) => {
        const exercises = {
            'Force': [
                'Squats (3x8-12 reps, 70-80% 1RM)',
                'Deadlifts roumains (3x8-10 reps)',
                'Développé couché (3x8-12 reps)',
                'Tractions assistées (3x max reps)'
            ],
            'Vitesse': [
                'Sprints 10-20m (6-8 reps)',
                'Navette 5x10m (4-6 séries)',
                'Drills vitesse driver (10-15 swings/séance)',
                'Pliométrie légère (box jumps 3x5)'
            ],
            'Endurance': [
                'Course continue 20-30min (70% FCmax)',
                'Interval training 30-30 (10-15 séries)',
                'Circuit training 3x (pompes/squats/burpees)',
                'VMA courte (8x30s à 90-95% VMA)'
            ],
            'Explosivité': [
                'Box jumps (4x5 reps)',
                'Med ball throws (4x6 reps)',
                'Broad jumps (5x3 reps)',
                'Kettlebell swings (3x15 reps)'
            ],
            'Core & Stabilité': [
                'Plank variations (3x30-60s)',
                'Dead bugs (3x12 reps/côté)',
                'Pallof press (3x10 reps/côté)',
                'Bird dogs (3x10 reps/côté)'
            ],
            'Mobilité': [
                'Yoga golf-spécifique (20-30 min)',
                'Foam rolling routine (10-15 min)',
                'Étirements dynamiques (10 min)',
                'Rotation thoracique (3x10 reps/côté)'
            ],
            'Équilibre': [
                'Single leg stance (3x30s/côté)',
                'BOSU exercises (3x45s)',
                'Proprioception drills (15 min)',
                'Yoga balance poses (10-15 min)'
            ]
        };
        return exercises[quality] || ['Consulter un préparateur physique'];
    };
    
    const getFrequencyForQuality = (quality) => {
        const frequencies = {
            'Force': '3-4x/semaine (jours non consécutifs)',
            'Vitesse': '2-3x/semaine (repos 48h entre séances)',
            'Endurance': '3-5x/semaine (varie intensité)',
            'Explosivité': '2-3x/semaine (haute récupération)',
            'Core & Stabilité': '4-6x/semaine (peut être quotidien)',
            'Mobilité': 'Quotidien (10-15 min minimum)',
            'Équilibre': '3-4x/semaine (intégrer dans routine)'
        };
        return frequencies[quality] || '3x/semaine';
    };
    
    const getCorrectionExercise = (testName, weakerSide) => {
        const exercises = {
            'Wall Sit': 'Wall sit unilatéral côté faible (3x20-30s) + progression bilatéral',
            'CMJ Unilatéral': 'Single leg jumps côté faible (4x5 reps) + Bulgarian squats',
            'Side Plank': 'Side plank progressif côté faible (3x30-45s)',
            'Rotation Thoracique': 'Open book stretch côté limité (3x10 reps) + Foam roller',
            'Hip Rotation Int': 'Pigeon pose + 90/90 stretch côté limité (3x30s)',
            'Hip Rotation Ext': 'Frog stretch + band distraction côté limité',
            'Dorsiflexion': 'Ankle mobilité wall drill côté limité (3x10 reps)',
            'Équilibre Y. Ouverts': 'Single leg stance yeux ouverts côté faible (4x30s)',
            'Équilibre Y. Fermés': 'Progression: ouverts → semi-fermés → fermés côté faible'
        };
        return exercises[testName] || 'Travail unilatéral côté faible (consulter coach)';
    };
    
    // Récupérer les derniers tests de l'historique
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Fonction pour récupérer la dernière valeur d'un test depuis l'historique
    const getTestValueFromHistory = (testKey, qualityKey) => {
        // Trouver les tests de cette qualité, triés du plus récent au plus ancien
        const qualityTests = history
            .filter(h => h.quality === qualityKey)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Chercher dans chaque test jusqu'à trouver une valeur
        for (const test of qualityTests) {
            if (test.tests && test.tests[testKey] !== undefined && test.tests[testKey] !== null) {
                const value = test.tests[testKey];
                // Si c'est un test bilatéral, prendre la moyenne
                if (typeof value === 'object' && (value.left !== null || value.right !== null)) {
                    const left = value.left || 0;
                    const right = value.right || 0;
                    const count = (value.left !== null ? 1 : 0) + (value.right !== null ? 1 : 0);
                    return count > 0 ? (left + right) / count : null;
                }
                return value;
            }
        }
        return null;
    };
    
    const allTestsData = [
        {key: 'squat', name: 'Squat 1RM', value: getTestValueFromHistory('squat', 'force'), unit: 'kg', category: 'Force'},
        {key: 'deadlift', name: 'Deadlift 1RM', value: getTestValueFromHistory('deadlift', 'force'), unit: 'kg', category: 'Force'},
        {key: 'bench', name: 'Développé Couché 1RM', value: getTestValueFromHistory('bench', 'force'), unit: 'kg', category: 'Force'},
        {key: 'pullup', name: 'Tractions 1RM', value: getTestValueFromHistory('pullup', 'force'), unit: 'kg', category: 'Force'},
        {key: 'shuttle', name: 'Navette 5x10m', value: getTestValueFromHistory('shuttle', 'vitesse'), unit: 's', category: 'Vitesse'},
        {key: 'driverspeed', name: 'Vitesse Driver', value: getTestValueFromHistory('driverspeed', 'vitesse'), unit: 'mph', category: 'Vitesse'},
        {key: 'vma', name: 'VMA', value: getTestValueFromHistory('vma', 'endurance'), unit: 'km/h', category: 'Endurance'},
        {key: 'maxpushups', name: 'Max Pompes 1min', value: getTestValueFromHistory('maxpushups', 'endurance'), unit: 'reps', category: 'Endurance'},
        {key: 'maxsquats', name: 'Max Squats 1min', value: getTestValueFromHistory('maxsquats', 'endurance'), unit: 'reps', category: 'Endurance'},
        {key: 'vertjump', name: 'Détente Verticale', value: getTestValueFromHistory('vertjump', 'explosivite'), unit: 'cm', category: 'Explosivité'},
        {key: 'horizjump', name: 'Détente Horizontale', value: getTestValueFromHistory('horizjump', 'explosivite'), unit: 'cm', category: 'Explosivité'},
        {key: 'medballchest', name: 'MedBall Chest', value: getTestValueFromHistory('medballchest', 'explosivite'), unit: 'm', category: 'Explosivité'},
        {key: 'rkcplank', name: 'RKC Plank', value: getTestValueFromHistory('rkcplank', 'core'), unit: 's', category: 'Core'},
        {key: 'mcgillflexor', name: 'McGill Flexor', value: getTestValueFromHistory('mcgillflexor', 'core'), unit: 's', category: 'Core'},
        {key: 'mcgillextensor', name: 'McGill Extensor', value: getTestValueFromHistory('mcgillextensor', 'core'), unit: 's', category: 'Core'},
        {key: 'standreach', name: 'Stand & Reach', value: getTestValueFromHistory('standreach', 'mobilite'), unit: 'cm', category: 'Mobilité'}
    ];
    
    const testsWithScores = allTestsData
        .filter(t => t.value !== null && !isNaN(t.value))
        .map(t => ({
            ...t,
            score: calculateScore20(t.key, t.value),
            badge: getBadgeLabel(calculateScore20(t.key, t.value))
        }))
        .filter(t => t.score !== null);
    
    testsWithScores.sort((a, b) => b.score - a.score);
    
    const top5 = testsWithScores.slice(0, 5);
    const bottom5 = testsWithScores.slice(-5).reverse();
    
    // Fonction pour récupérer valeurs bilatérales de l'historique
    const getBilateralFromHistory = (testKey, qualityKey) => {
        const qualityTests = history
            .filter(h => h.quality === qualityKey)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        for (const test of qualityTests) {
            if (test.tests && test.tests[testKey]) {
                const value = test.tests[testKey];
                if (typeof value === 'object') {
                    return {
                        left: value.left !== null && value.left !== undefined ? value.left : null,
                        right: value.right !== null && value.right !== undefined ? value.right : null
                    };
                }
            }
        }
        return {left: null, right: null};
    };
    
    // Calculer asymétries
    const bilateralTests = [
        {name: 'Wall Sit', ...getBilateralFromHistory('wallsit', 'endurance'), unit: 's'},
        {name: 'CMJ Unilatéral', ...getBilateralFromHistory('cmjunilateral', 'explosivite'), unit: 'cm'},
        {name: 'Side Plank', ...getBilateralFromHistory('sideplank', 'core'), unit: 's'},
        {name: 'Rotation Thoracique', ...getBilateralFromHistory('thoracic', 'mobilite'), unit: '°'},
        {name: 'Hip Rotation Int', ...getBilateralFromHistory('hipint', 'mobilite'), unit: '°'},
        {name: 'Hip Rotation Ext', ...getBilateralFromHistory('hipext', 'mobilite'), unit: '°'},
        {name: 'Dorsiflexion', ...getBilateralFromHistory('ankle', 'mobilite'), unit: 'cm'},
        {name: 'Équilibre Y. Ouverts', ...getBilateralFromHistory('balanceopen', 'equilibre'), unit: 's'},
        {name: 'Équilibre Y. Fermés', ...getBilateralFromHistory('balanceclosed', 'equilibre'), unit: 's'}
    ];
    
    const asymmetries = bilateralTests
        .filter(t => t.left && t.right && !isNaN(t.left) && !isNaN(t.right))
        .map(t => {
            const weaker = Math.min(t.left, t.right);
            const stronger = Math.max(t.left, t.right);
            const lsi = (weaker / stronger) * 100;
            const weakerSide = t.left < t.right ? 'G' : 'D';
            return {...t, lsi, weakerSide};
        })
        .filter(t => t.lsi < 90)
        .sort((a, b) => a.lsi - b.lsi);
    
    // Générer le document HTML complet
    const bilanWindow = window.open('', '_blank');
    bilanWindow.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilan Performance Golf Complet - ${currentPlayer.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
            .page { page-break-after: always; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-size: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.4;
            color: #333;
            background: #f5f5f5;
        }
        
        .page {
            background: white;
            max-width: 210mm;
            min-height: 297mm;
            margin: 10px auto;
            padding: 12mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 6px;
            border-bottom: 2px solid #1a4d2e;
        }
        
        .header-left h1 {
            color: #1a4d2e;
            font-size: 20px;
            margin-bottom: 5px;
        }
        
        .header-left p {
            color: #666;
            font-size: 10px;
        }
        
        .header-right {
            text-align: right;
        }
        
        .profile-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin-bottom: 15px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        
        .info-label {
            font-weight: 600;
            color: #1a4d2e;
        }
        
        .radar-container {
            max-width: 500px;
            margin: 15px auto;
        }
        
        .summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin-top: 30px;
        }
        
        .summary-box {
            padding: 8px;
            border-radius: 8px;
            border-left: 3px solid;
        }
        
        .summary-box.strong {
            background: #e8f5e9;
            border-color: #27ae60;
        }
        
        .summary-box.weak {
            background: #fff3e0;
            border-color: #f39c12;
        }
        
        .summary-box h3 {
            margin-bottom: 10px;
            font-size: 13px;
        }
        
        .summary-box ul {
            list-style: none;
            padding-left: 0;
        }
        
        .summary-box li {
            padding: 5px 0;
            font-size: 10px;
        }
        
        .moyenne-generale {
            text-align: center;
            margin: 15px 0;
            padding: 8px;
            background: linear-gradient(135deg, #1a4d2e 0%, #27ae60 100%);
            color: white;
            border-radius: 10px;
        }
        
        .moyenne-generale h2 {
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .moyenne-generale .score {
            font-size: 36px;
            font-weight: 700;
        }
        
        .section {
            margin-bottom: 15px;
        }
        
        .section h2 {
            color: #1a4d2e;
            font-size: 15px;
            margin-bottom: 15px;
            padding-bottom: 6px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        
        th {
            background: #1a4d2e;
            color: white;
            padding: 8px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            display: inline-block;
        }
        
        .badge-elite { background: #3498db; }
        .badge-bon { background: #27ae60; }
        .badge-moyen { background: #f39c12; }
        .badge-faible { background: #e74c3c; }
        
        .lsi-box {
            padding: 6px;
            margin-bottom: 10px;
            border-left: 3px solid;
            border-radius: 4px;
        }
        
        .lsi-important {
            background: #ffebee;
            border-color: #e74c3c;
        }
        
        .lsi-modere {
            background: #fff3e0;
            border-color: #f39c12;
        }
        
        .actions {
            margin-top: 30px;
            text-align: center;
            position: sticky;
            bottom: 20px;
            background: white;
            padding: 6px;
            border-radius: 8px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }
        
        .btn {
            padding: 12px 24px;
            margin: 0 10px;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #1a4d2e;
            color: white;
        }
        
        .btn-primary:hover {
            background: #27ae60;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
        }
        
        .alert {
            padding: 6px;
            border-radius: 6px;
            margin-bottom: 10px;
        }
        
        .alert-success {
            background: #e8f5e9;
            border-left: 3px solid #27ae60;
            color: #2e7d32;
        }
        
        .alert-warning {
            background: #fff3e0;
            border-left: 3px solid #f39c12;
            color: #e65100;
        }
        
        .page-number {
            text-align: center;
            color: #999;
            font-size: 10px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <!-- PAGE 1: VUE D'ENSEMBLE -->
    <div class="page">
        <div class="header">
            <div class="header-left">
                <h1>BILAN PERFORMANCE GOLF</h1>
                <p>Évaluation Physique Complète - Page 1/2</p>
            </div>
            <div class="header-right">
                <p><strong>${new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})}</strong></p>
            </div>
        </div>
        
        <div class="profile-info">
            <div>
                <div class="info-item">
                    <span class="info-label">Nom</span>
                    <span>${currentPlayer.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Sexe</span>
                    <span>${currentPlayer.gender === 'M' ? 'Homme' : 'Femme'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Âge</span>
                    <span>${currentPlayer.age}</span>
                </div>
            </div>
            <div>
                <div class="info-item">
                    <span class="info-label">Poids</span>
                    <span>${currentPlayer.weight} kg</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Taille</span>
                    <span>${currentPlayer.height} cm</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Niveau</span>
                    <span>Handicap ${currentPlayer.handicap || 'N/A'}</span>
                </div>
            </div>
        </div>
        
        <div class="moyenne-generale">
            <h2>Note Globale</h2>
            <div class="score">${moyenneGenerale.toFixed(1)}<span style="font-size: 24px;">/20</span></div>
        </div>
        
        <div class="radar-container">
            <canvas id="radarChart"></canvas>
        </div>
        
        <div class="summary">
            <div class="summary-box strong">
                <h3>💪 Points Forts</h3>
                <ul>
                    ${pointsForts.map(q => `<li><strong>${q.name}:</strong> ${q.score.toFixed(1)}/20</li>`).join('')}
                </ul>
            </div>
            <div class="summary-box weak">
                <h3>📈 À Améliorer</h3>
                <ul>
                    ${pointsFaibles.map(q => `<li><strong>${q.name}:</strong> ${q.score.toFixed(1)}/20</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="page-number">Page 1/2</div>
    </div>
    
    <!-- PAGE 2: RÉSULTATS DÉTAILLÉS -->
    <div class="page">
        <div class="header">
            <h1>RÉSULTATS DÉTAILLÉS & ASYMÉTRIES</h1>
            <p>${currentPlayer.name} - Page 2/2</p>
        </div>
        
        <div class="section">
            <h2>🏆 Top 5 Performances</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Résultat</th>
                        <th>Note /20</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    ${top5.length > 0 ? top5.map(t => `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.value.toFixed(1)} ${t.unit}</td>
                            <td><strong>${t.score.toFixed(1)}/20</strong></td>
                            <td><span class="badge badge-${t.badge.class}">${t.badge.label}</span></td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" style="text-align: center; color: #999;">Aucun test complété</td></tr>'}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>📈 Top 5 À Améliorer</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Résultat</th>
                        <th>Note /20</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    ${bottom5.length > 0 ? bottom5.map(t => `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.value.toFixed(1)} ${t.unit}</td>
                            <td><strong>${t.score.toFixed(1)}/20</strong></td>
                            <td><span class="badge badge-${t.badge.class}">${t.badge.label}</span></td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" style="text-align: center; color: #999;">Aucun test complété</td></tr>'}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>⚖️ Bilan LSI - Asymétries Détectées</h2>
            ${asymmetries.length === 0 ? `
                <div class="alert alert-success">
                    <strong>✅ Excellent !</strong> Aucune asymétrie significative détectée (tous les LSI ≥ 90%)
                </div>
            ` : `
                <div class="alert alert-warning">
                    <strong>⚠️ ${asymmetries.length} asymétrie(s) détectée(s)</strong>
                </div>
                ${asymmetries.map(a => `
                    <div class="lsi-box ${a.lsi < 85 ? 'lsi-important' : 'lsi-modere'}">
                        <strong>${a.name}</strong>: 
                        G ${a.left.toFixed(1)}${a.unit} | D ${a.right.toFixed(1)}${a.unit} 
                        → LSI: <strong>${a.lsi.toFixed(1)}%</strong>
                        ${a.lsi < 85 ? '🔴 Asymétrie importante' : '⚠️ Asymétrie modérée'}
                        - Renforcer côté ${a.weakerSide}
                    </div>
                `).join('')}
            `}
        </div>
        
        <div class="page-number">Page 2/3</div>
    </div>
    
    <!-- PAGE 3: RECOMMANDATIONS & PLAN D'ACTION -->
    <div class="page">
        <div class="header">
            <h1>RECOMMANDATIONS & PLAN D'ACTION</h1>
            <p>${currentPlayer.name} - Page 3/3</p>
        </div>
        
        <div class="section">
            <h2>🎯 Priorités d'Entraînement</h2>
            ${pointsFaibles.length > 0 ? `
                <p style="margin-bottom: 20px; color: #666;">Basé sur votre évaluation, voici les qualités physiques à prioriser pour optimiser vos performances au golf :</p>
                ${pointsFaibles.map((q, idx) => `
                    <div style="background: ${idx === 0 ? '#ffebee' : '#fff3e0'}; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid ${idx === 0 ? '#e74c3c' : '#f39c12'};">
                        <h3 style="color: #333; margin-bottom: 10px;">
                            ${idx === 0 ? '🔴 PRIORITÉ HAUTE' : '⚠️ PRIORITÉ MOYENNE'} : ${q.name} (${q.score.toFixed(1)}/20)
                        </h3>
                        <p style="margin-bottom: 10px; color: #555;"><strong>Exercices recommandés :</strong></p>
                        <ul style="margin-left: 20px; color: #555;">
                            ${getExercisesForQuality(q.name).map(ex => `<li>${ex}</li>`).join('')}
                        </ul>
                        <p style="margin-top: 10px; color: #555;"><strong>Fréquence :</strong> ${getFrequencyForQuality(q.name)}</p>
                    </div>
                `).join('')}
            ` : '<p style="color: #27ae60;">✅ Excellent ! Toutes vos qualités physiques sont dans la moyenne ou au-dessus.</p>'}
        </div>
        
        ${asymmetries.length > 0 ? `
            <div class="section">
                <h2>⚖️ Correction des Asymétries</h2>
                <p style="margin-bottom: 20px; color: #666;">Les asymétries détectées doivent être corrigées pour réduire les risques de blessure et optimiser la performance :</p>
                ${asymmetries.slice(0, 3).map(a => `
                    <div style="background: #ffebee; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #e74c3c;">
                        <h4 style="color: #333; margin-bottom: 8px;">${a.name} - LSI ${a.lsi.toFixed(1)}%</h4>
                        <p style="margin: 5px 0; color: #555;"><strong>Déséquilibre :</strong> Gauche ${a.left.toFixed(1)}${a.unit} | Droite ${a.right.toFixed(1)}${a.unit}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Action :</strong> Renforcer prioritairement le côté ${a.weakerSide === 'G' ? 'GAUCHE' : 'DROIT'}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Exercice :</strong> ${getCorrectionExercise(a.name, a.weakerSide)}</p>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        <div class="section">
            <h2>📅 Programme Structuré 4-8 Semaines</h2>
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #1a4d2e; margin-bottom: 15px;">Phase 1 : Fondations (Semaines 1-2)</h3>
                <ul style="margin-left: 20px; color: #555;">
                    <li><strong>Focus :</strong> Correction asymétries + Mobilité de base</li>
                    <li><strong>Volume :</strong> 3-4 séances/semaine (30-40 min)</li>
                    <li><strong>Intensité :</strong> Modérée (60-70% capacité max)</li>
                    ${pointsFaibles.length > 0 ? `<li><strong>Priorité :</strong> ${pointsFaibles[0].name} - exercices de base</li>` : ''}
                </ul>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #1565c0; margin-bottom: 15px;">Phase 2 : Progression (Semaines 3-4)</h3>
                <ul style="margin-left: 20px; color: #555;">
                    <li><strong>Focus :</strong> Augmentation intensité + Intégration gestes golf</li>
                    <li><strong>Volume :</strong> 4-5 séances/semaine (40-50 min)</li>
                    <li><strong>Intensité :</strong> Moyenne-Haute (70-80% capacité max)</li>
                    <li><strong>Tests :</strong> Réévaluation partielle fin semaine 4</li>
                </ul>
            </div>
            
            <div style="background: #fff3e0; padding: 20px; border-radius: 8px;">
                <h3 style="color: #e65100; margin-bottom: 15px;">Phase 3 : Performance (Semaines 5-8) - Optionnel</h3>
                <ul style="margin-left: 20px; color: #555;">
                    <li><strong>Focus :</strong> Optimisation + Spécificité golf</li>
                    <li><strong>Volume :</strong> 4 séances/semaine (45-60 min)</li>
                    <li><strong>Intensité :</strong> Haute (80-90% capacité max)</li>
                    <li><strong>Tests :</strong> Réévaluation complète fin semaine 8</li>
                </ul>
            </div>
        </div>
        
        <div class="section">
            <h2>🎯 Objectifs Chiffrés (8 semaines)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Qualité</th>
                        <th>Actuel</th>
                        <th>Objectif</th>
                        <th>Progression</th>
                    </tr>
                </thead>
                <tbody>
                    ${pointsFaibles.map(q => {
                        const current = q.score;
                        const target = Math.min(20, current + (current < 10 ? 3 : 2));
                        const progress = ((target - current) / current * 100).toFixed(0);
                        return `
                            <tr>
                                <td><strong>${q.name}</strong></td>
                                <td>${current.toFixed(1)}/20</td>
                                <td>${target.toFixed(1)}/20</td>
                                <td style="color: #27ae60;"><strong>+${progress}%</strong></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #1a4d2e; margin-bottom: 10px;">💡 Conseils Généraux</h3>
            <ul style="margin-left: 20px; color: #555;">
                <li><strong>Échauffement :</strong> 10 min minimum avant chaque séance (mobilité dynamique)</li>
                <li><strong>Récupération :</strong> Au moins 1 jour de repos complet par semaine</li>
                <li><strong>Hydratation :</strong> 2-3L d'eau par jour, plus pendant l'effort</li>
                <li><strong>Sommeil :</strong> 7-9h par nuit pour optimiser la récupération</li>
                <li><strong>Nutrition :</strong> Protéines 1.6-2g/kg/jour pour la récupération musculaire</li>
                <li><strong>Suivi :</strong> Réévaluer tous les tests après 4 et 8 semaines</li>
            </ul>
        </div>
        
        <div class="page-number">Page 3/3</div>
    </div>
    
    <div class="actions no-print">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer / Sauvegarder PDF</button>
        <button class="btn btn-secondary" onclick="window.close()">✖️ Fermer</button>
    </div>
    
    <script>
        const ctx = document.getElementById('radarChart');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Force', 'Vitesse', 'Endurance', 'Explosivité', 'Core', 'Mobilité', 'Équilibre'],
                datasets: [{
                    label: 'Performance /20',
                    data: [
                        ${scores.force?.toFixed(1) || 0},
                        ${scores.vitesse?.toFixed(1) || 0},
                        ${scores.endurance?.toFixed(1) || 0},
                        ${scores.explosivite?.toFixed(1) || 0},
                        ${scores.core?.toFixed(1) || 0},
                        ${scores.mobilite?.toFixed(1) || 0},
                        ${scores.equilibre?.toFixed(1) || 0}
                    ],
                    backgroundColor: 'rgba(26, 77, 46, 0.2)',
                    borderColor: 'rgba(26, 77, 46, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(26, 77, 46, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(26, 77, 46, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            stepSize: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    </script>
</body>
</html>
    `);
    bilanWindow.document.close();
}

// ==================== LOCAL STORAGE ====================
function loadFromLocalStorage() {
    const savedTests = localStorage.getItem('allTests');
    if (savedTests) {
        try {
            allTests = JSON.parse(savedTests);
        } catch (e) {
            allTests = [];
        }
    }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== AFFICHAGE DES BARÈMES ====================
function displayBaremes() {
    if (!currentPlayer) return;
    
    const sexe = currentPlayer.gender || currentPlayer.sexe; // 'M' ou 'F'
    const ageValue = currentPlayer.age;
    const niveau = currentPlayer.handicap || currentPlayer.niveau;
    
    // Gérer l'âge (peut être un nombre ou une string comme '40-50')
    let age;
    if (typeof ageValue === 'string') {
        // Si c'est une string genre '40-50', prendre le milieu
        if (ageValue.includes('-')) {
            const [min, max] = ageValue.split('-').map(n => parseInt(n));
            age = (min + max) / 2;
        } else if (ageValue === '<12') {
            age = 10;
        } else if (ageValue === '12-14') {
            age = 13;
        } else if (ageValue === '14-17') {
            age = 15.5;
        } else {
            age = parseInt(ageValue) || 25;
        }
    } else {
        age = ageValue;
    }
    
    // Déterminer la catégorie d'âge
    let ageCategory;
    if (age < 12) ageCategory = '<12';
    else if (age >= 12 && age < 14) ageCategory = '12-14';
    else if (age >= 14 && age < 18) ageCategory = '14-17';
    else ageCategory = '18+';
    
    // Déterminer le niveau pour les 18+
    let playerLevel = 'pro'; // Par défaut
    if (ageCategory === '18+' && niveau) {
        const handicap = parseInt(niveau);
        if (!isNaN(handicap)) {
            if (handicap >= 8) playerLevel = 'amateur_8+';
            else if (handicap >= 0 && handicap <= 7) playerLevel = 'amateur_0-7';
            else if (handicap < 0) playerLevel = 'amateur_negatif';
        }
    }
    
    console.log('📊 Affichage barèmes:', {sexe, age, ageCategory, niveau, playerLevel});
    
    // Liste des tests avec leurs IDs
    const testsToDisplay = [
        { testKey: 'squat', inputId: 'test-squat-1rm' },
        { testKey: 'deadlift', inputId: 'test-deadlift-1rm' },
        { testKey: 'bench', inputId: 'test-bench-1rm' },
        { testKey: 'pullup', inputId: 'test-pullup-1rm' },
        { testKey: 'shuttle', inputId: 'test-shuttle' },
        { testKey: 'driverspeed', inputId: 'test-driverspeed' },
        { testKey: 'vma', inputId: 'test-vma' },
        { testKey: 'maxpushups', inputId: 'test-maxpushups' },
        { testKey: 'maxsquats', inputId: 'test-maxsquats' },
        { testKey: 'wallsit', inputId: 'test-wallsit-left' },
        { testKey: 'vertjump', inputId: 'test-vertjump' },
        { testKey: 'horizjump', inputId: 'test-horizjump' },
        { testKey: 'medballchest', inputId: 'test-medballchest' },
        { testKey: 'medballrotation', inputId: 'test-medballrotation-left' },
        { testKey: 'cmjunilateral', inputId: 'test-cmj-left' },
        { testKey: 'rkcplank', inputId: 'test-rkcplank' },
        { testKey: 'sideplank', inputId: 'test-sideplank-left' },
        { testKey: 'birddog', inputId: 'test-birddog' },
        { testKey: 'mcgillflexor', inputId: 'test-mcgillflexor' },
        { testKey: 'mcgillextensor', inputId: 'test-mcgillextensor' },
        { testKey: 'standreach', inputId: 'test-standreach' },
        { testKey: 'thoracic', inputId: 'test-thoracic-left' },
        { testKey: 'hipint', inputId: 'test-hipint-left' },
        { testKey: 'hipext', inputId: 'test-hipext-left' },
        { testKey: 'ankle', inputId: 'test-ankle-left' },
        { testKey: 'shoulder', inputId: 'test-shoulder' },
        { testKey: 'balanceopen', inputId: 'test-balanceopen-left' },
        { testKey: 'balanceclosed', inputId: 'test-balanceclosed-left' }
    ];
    
    testsToDisplay.forEach(test => {
        const inputElement = document.getElementById(test.inputId);
        if (!inputElement) return;
        
        // Supprimer ancien barème s'il existe
        const parent = inputElement.closest('.test-item, .test-item-advanced, .bilateral-test');
        if (!parent) return;
        
        const oldBareme = parent.querySelector('.bareme-display');
        if (oldBareme) oldBareme.remove();
        
        // Récupérer les barèmes
        const baremeData = BAREMES[test.testKey];
        if (!baremeData) return;
        
        let baremeValues;
        try {
            const sexeData = baremeData.levels[sexe];
            if (!sexeData) return;
            
            if (ageCategory === '18+') {
                const levelData = sexeData[ageCategory];
                if (!levelData || !levelData[playerLevel]) return;
                baremeValues = levelData[playerLevel];
            } else {
                baremeValues = sexeData[ageCategory];
            }
            
            if (!baremeValues || baremeValues.length !== 4) return;
        } catch (e) {
            return;
        }
        
        // Créer l'affichage du barème
        const baremeDiv = document.createElement('div');
        baremeDiv.className = 'bareme-display';
        baremeDiv.style.cssText = 'font-size: 0.85rem; color: #666; margin-top: 0.3rem; padding: 0.3rem 0.5rem; background: #f8f9fa; border-radius: 4px;';
        
        const unit = baremeData.unit;
        const labels = ['Faible', 'Moyen', 'Bon', 'Élite'];
        const colors = ['#e74c3c', '#f39c12', '#27ae60', '#3498db'];
        
        let baremeHTML = '📊 <strong>Barèmes:</strong> ';
        baremeValues.forEach((val, idx) => {
            baremeHTML += `<span style="color: ${colors[idx]}; font-weight: 600;">${labels[idx]} ${val}${unit === 'ratio' ? '' : unit}</span>`;
            if (idx < 3) baremeHTML += ' | ';
        });
        
        baremeDiv.innerHTML = baremeHTML;
        parent.appendChild(baremeDiv);
        
        // Ajouter un écouteur pour afficher le badge quand l'utilisateur tape une valeur
        inputElement.addEventListener('input', function() {
            updateBadge(test.testKey, inputElement, baremeData, baremeValues, sexe, ageCategory, playerLevel);
        });
        
        // Si le champ a déjà une valeur, afficher le badge
        if (inputElement.value) {
            updateBadge(test.testKey, inputElement, baremeData, baremeValues, sexe, ageCategory, playerLevel);
        }
    });
}

// ==================== AFFICHAGE DES BADGES ====================
function updateBadge(testKey, inputElement, baremeData, baremeValues, sexe, ageCategory, playerLevel) {
    if (!currentPlayer) return;
    
    const value = parseFloat(inputElement.value);
    if (isNaN(value) || value <= 0) {
        // Supprimer le badge si pas de valeur
        const existingBadge = inputElement.parentElement.querySelector('.performance-badge');
        if (existingBadge) existingBadge.remove();
        return;
    }
    
    // Pour les tests de Force, calculer le ratio
    let finalValue = value;
    if (baremeData.unit === 'ratio' && currentPlayer.weight) {
        finalValue = value / currentPlayer.weight;
    }
    
    // Déterminer le niveau
    const higherIsBetter = baremeData.higherIsBetter;
    let level = 0;
    let levelLabel = 'Faible';
    let levelColor = '#e74c3c';
    
    if (higherIsBetter) {
        if (finalValue >= baremeValues[3]) {
            level = 3;
            levelLabel = 'Élite';
            levelColor = '#3498db';
        } else if (finalValue >= baremeValues[2]) {
            level = 2;
            levelLabel = 'Bon';
            levelColor = '#27ae60';
        } else if (finalValue >= baremeValues[1]) {
            level = 1;
            levelLabel = 'Moyen';
            levelColor = '#f39c12';
        }
    } else {
        // Pour les tests où plus bas = mieux (ex: navette)
        if (finalValue <= baremeValues[3]) {
            level = 3;
            levelLabel = 'Élite';
            levelColor = '#3498db';
        } else if (finalValue <= baremeValues[2]) {
            level = 2;
            levelLabel = 'Bon';
            levelColor = '#27ae60';
        } else if (finalValue <= baremeValues[1]) {
            level = 1;
            levelLabel = 'Moyen';
            levelColor = '#f39c12';
        }
    }
    
    // Créer ou mettre à jour le badge
    let badge = inputElement.parentElement.querySelector('.performance-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'performance-badge';
        badge.style.cssText = 'margin-left: 0.5rem; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: white;';
        inputElement.parentElement.appendChild(badge);
    }
    
    badge.style.backgroundColor = levelColor;
    
    // Afficher le ratio pour les tests de force
    if (baremeData.unit === 'ratio' && currentPlayer.weight) {
        badge.textContent = `${levelLabel} (${finalValue.toFixed(2)})`;
    } else {
        badge.textContent = levelLabel;
    }
}

// ==================== CALCUL LSI (LIMB SYMMETRY INDEX) ====================
function calculateLSI(leftInputId, rightInputId, testName, unit = '') {
    const leftInput = document.getElementById(leftInputId);
    const rightInput = document.getElementById(rightInputId);
    
    if (!leftInput || !rightInput) return;
    
    const leftValue = parseFloat(leftInput.value);
    const rightValue = parseFloat(rightInput.value);
    
    // Supprimer l'ancien LSI s'il existe
    const parent = leftInput.closest('.bilateral-test, .test-item');
    if (!parent) return;
    
    const oldLSI = parent.querySelector('.lsi-display');
    if (oldLSI) oldLSI.remove();
    
    // Si une des deux valeurs manque, ne rien afficher
    if (isNaN(leftValue) || isNaN(rightValue) || leftValue <= 0 || rightValue <= 0) {
        return;
    }
    
    // Calculer le LSI (côté faible / côté fort × 100)
    const weaker = Math.min(leftValue, rightValue);
    const stronger = Math.max(leftValue, rightValue);
    const lsi = (weaker / stronger) * 100;
    const difference = Math.abs(leftValue - rightValue);
    const percentDiff = ((difference / stronger) * 100).toFixed(1);
    
    // Déterminer quel côté est plus faible
    const weakerSide = leftValue < rightValue ? 'gauche' : 'droite';
    
    // Déterminer l'interprétation
    let interpretation = '';
    let color = '';
    let bgColor = '';
    let recommendation = '';
    
    if (lsi >= 90) {
        interpretation = '✅ Symétrique';
        color = '#27ae60';
        bgColor = '#e8f5e9';
        recommendation = 'Bon équilibre musculaire. Maintenir le travail bilatéral.';
    } else if (lsi >= 85) {
        interpretation = '⚠️ Asymétrie modérée';
        color = '#f39c12';
        bgColor = '#fff3e0';
        recommendation = `Renforcer le côté ${weakerSide}. Ajouter des exercices unilatéraux (2-3 séries supplémentaires côté faible).`;
    } else {
        interpretation = '🔴 Asymétrie importante';
        color = '#e74c3c';
        bgColor = '#ffebee';
        recommendation = `PRIORITÉ: Renforcement ${weakerSide}. Risque de blessure accru. Travail unilatéral intensif recommandé.`;
    }
    
    // Créer l'affichage du LSI
    const lsiDiv = document.createElement('div');
    lsiDiv.className = 'lsi-display';
    lsiDiv.style.cssText = `
        margin-top: 0.5rem;
        padding: 0.6rem;
        background: ${bgColor};
        border-left: 3px solid ${color};
        border-radius: 4px;
        font-size: 0.85rem;
        line-height: 1.5;
    `;
    
    lsiDiv.innerHTML = `
        <div style="font-weight: 700; color: ${color}; margin-bottom: 0.3rem;">
            ⚖️ LSI: ${lsi.toFixed(1)}% - ${interpretation} (${percentDiff}% de différence)
        </div>
        <div style="color: #555; font-size: 0.8rem;">
            💪 ${recommendation}
        </div>
    `;
    
    parent.appendChild(lsiDiv);
}

// Ajouter les écouteurs pour tous les tests bilatéraux
function setupLSICalculations() {
    const bilateralTests = [
        { left: 'test-legext-left', right: 'test-legext-right', name: 'Leg Extension Unilatéral', unit: 'kg' },
        { left: 'test-press-left', right: 'test-press-right', name: 'Leg Press Unilatéral', unit: 'kg' },
        { left: 'test-wallsit-left', right: 'test-wallsit-right', name: 'Wall Sit', unit: 's' },
        { left: 'test-cmj-left', right: 'test-cmj-right', name: 'CMJ Unilatéral', unit: 'cm' },
        { left: 'test-sideplank-left', right: 'test-sideplank-right', name: 'Side Plank', unit: 's' },
        { left: 'test-thoracic-left', right: 'test-thoracic-right', name: 'Rotation Thoracique', unit: '°' },
        { left: 'test-hipint-left', right: 'test-hipint-right', name: 'Hip Rotation Interne', unit: '°' },
        { left: 'test-hipext-left', right: 'test-hipext-right', name: 'Hip Rotation Externe', unit: '°' },
        { left: 'test-ankle-left', right: 'test-ankle-right', name: 'Dorsiflexion', unit: 'cm' },
        { left: 'test-shoulder-left', right: 'test-shoulder-right', name: 'Apley Scratch', unit: 'cm' },
        { left: 'test-balanceopen-left', right: 'test-balanceopen-right', name: 'Équilibre Yeux Ouverts', unit: 's' },
        { left: 'test-balanceclosed-left', right: 'test-balanceclosed-right', name: 'Équilibre Yeux Fermés', unit: 's' },
        { left: 'test-medballrotation-left', right: 'test-medballrotation-right', name: 'MedBall Rotation', unit: 'm' }
    ];
    
    bilateralTests.forEach(test => {
        const leftInput = document.getElementById(test.left);
        const rightInput = document.getElementById(test.right);
        
        if (leftInput && rightInput) {
            leftInput.addEventListener('input', () => calculateLSI(test.left, test.right, test.name, test.unit));
            rightInput.addEventListener('input', () => calculateLSI(test.left, test.right, test.name, test.unit));
            
            // Calculer immédiatement si les valeurs existent déjà
            if (leftInput.value && rightInput.value) {
                calculateLSI(test.left, test.right, test.name, test.unit);
            }
        }
    });
}

// Appeler displayBaremes au chargement si profil existe
if (currentPlayer) {
    setTimeout(displayBaremes, 500);
}

// Initialiser les calculs LSI
setTimeout(setupLSICalculations, 600);

// ==================== SYSTÈME DE BILAN - PAGE 1 ====================

// Calcul de la note /20 pour un test selon sa position dans les barèmes
function calculateScore20(testKey, value) {
    if (!currentPlayer || !value || value <= 0) return null;
    
    const baremeData = BAREMES[testKey];
    if (!baremeData) return null;
    
    const sexe = currentPlayer.gender || 'M';
    const ageValue = currentPlayer.age;
    
    // Convertir l'âge
    let age;
    if (typeof ageValue === 'string') {
        if (ageValue === '<12') age = 10;
        else if (ageValue === '12-14') age = 13;
        else if (ageValue === '14-17') age = 15.5;
        else if (ageValue.includes('-')) {
            const [min, max] = ageValue.split('-').map(n => parseInt(n));
            age = (min + max) / 2;
        } else {
            age = parseInt(ageValue) || 25;
        }
    } else {
        age = ageValue;
    }
    
    // Déterminer catégorie d'âge
    let ageCategory;
    if (age < 12) ageCategory = '<12';
    else if (age >= 12 && age < 14) ageCategory = '12-14';
    else if (age >= 14 && age < 18) ageCategory = '14-17';
    else ageCategory = '18+';
    
    // Déterminer niveau pour 18+
    let playerLevel = 'pro';
    if (ageCategory === '18+' && currentPlayer.handicap) {
        const handicap = parseInt(currentPlayer.handicap);
        if (!isNaN(handicap)) {
            if (handicap >= 8) playerLevel = 'amateur_8+';
            else if (handicap >= 0 && handicap <= 7) playerLevel = 'amateur_0-7';
            else if (handicap < 0) playerLevel = 'amateur_negatif';
        }
    }
    
    // Récupérer les barèmes
    let baremeValues;
    try {
        const sexeData = baremeData.levels[sexe];
        if (!sexeData) return null;
        
        if (ageCategory === '18+') {
            const levelData = sexeData[ageCategory];
            if (!levelData || !levelData[playerLevel]) return null;
            baremeValues = levelData[playerLevel];
        } else {
            baremeValues = sexeData[ageCategory];
        }
        
        if (!baremeValues || baremeValues.length !== 4) return null;
    } catch (e) {
        return null;
    }
    
    // Calculer la valeur finale (ratio si nécessaire)
    let finalValue = value;
    if (baremeData.unit === 'ratio' && currentPlayer.weight) {
        finalValue = value / currentPlayer.weight;
    }
    
    const [faible, moyen, bon, elite] = baremeValues;
    const higherIsBetter = baremeData.higherIsBetter;
    
    let score;
    
    if (higherIsBetter) {
        if (finalValue >= elite) {
            score = 20;
        } else if (finalValue >= bon) {
            score = 15 + 5 * ((finalValue - bon) / (elite - bon));
        } else if (finalValue >= moyen) {
            score = 10 + 5 * ((finalValue - moyen) / (bon - moyen));
        } else if (finalValue >= faible) {
            score = 5 + 5 * ((finalValue - faible) / (moyen - faible));
        } else {
            score = 5 * (finalValue / faible);
        }
    } else {
        // Pour les tests où plus bas = mieux (navette, etc.)
        if (finalValue <= elite) {
            score = 20;
        } else if (finalValue <= bon) {
            score = 15 + 5 * ((bon - finalValue) / (bon - elite));
        } else if (finalValue <= moyen) {
            score = 10 + 5 * ((moyen - finalValue) / (moyen - bon));
        } else if (finalValue <= faible) {
            score = 5 + 5 * ((faible - finalValue) / (faible - moyen));
        } else {
            score = Math.max(0, 5 * (1 - (finalValue - faible) / faible));
        }
    }
    
    return Math.max(0, Math.min(20, score));
}

// Calculer les moyennes par qualité physique
function calculateQualityScores() {
    if (!currentPlayer) return null;
    
    // Récupérer l'historique
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Fonction pour récupérer la dernière valeur d'un test depuis l'historique
    const getTestValue = (testKey, qualityKey) => {
        const qualityTests = history
            .filter(h => h.quality === qualityKey)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        for (const test of qualityTests) {
            if (test.tests && test.tests[testKey] !== undefined && test.tests[testKey] !== null) {
                const value = test.tests[testKey];
                // Si c'est un test bilatéral, prendre la moyenne
                if (typeof value === 'object' && (value.left !== null || value.right !== null)) {
                    const left = value.left || 0;
                    const right = value.right || 0;
                    const count = (value.left !== null ? 1 : 0) + (value.right !== null ? 1 : 0);
                    return count > 0 ? (left + right) / count : null;
                }
                return value;
            }
        }
        return null;
    };
    
    // Moyenne d'un tableau de scores (ignore les nulls)
    // NOUVEAU : Retourne null si moins de 50% des tests sont faits
    const average = (scores, minRequired) => {
        const validScores = scores.filter(s => s !== null && !isNaN(s));
        // Si on a moins de 50% des tests, on ne peut pas calculer un score fiable
        if (validScores.length < minRequired) return null;
        return validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : null;
    };
    
    // FORCE (4 tests) - minimum 2 requis
    const forceScores = [
        calculateScore20('squat', getTestValue('squat', 'force')),
        calculateScore20('deadlift', getTestValue('deadlift', 'force')),
        calculateScore20('bench', getTestValue('bench', 'force')),
        calculateScore20('pullup', getTestValue('pullup', 'force'))
    ];
    
    // VITESSE (2 tests) - minimum 1 requis
    const vitesseScores = [
        calculateScore20('shuttle', getTestValue('shuttle', 'vitesse')),
        calculateScore20('driverspeed', getTestValue('driverspeed', 'vitesse'))
    ];
    
    // ENDURANCE (4 tests) - minimum 2 requis
    const enduranceScores = [
        calculateScore20('vma', getTestValue('vma', 'endurance')),
        calculateScore20('maxpushups', getTestValue('maxpushups', 'endurance')),
        calculateScore20('maxsquats', getTestValue('maxsquats', 'endurance')),
        calculateScore20('wallsit', getTestValue('wallsit', 'endurance'))
    ];
    
    // EXPLOSIVITÉ (5 tests - ajout CMJ Unilateral) - minimum 3 requis
    const explosiviteScores = [
        calculateScore20('vertjump', getTestValue('vertjump', 'explosivite')),
        calculateScore20('horizjump', getTestValue('horizjump', 'explosivite')),
        calculateScore20('medballchest', getTestValue('medballchest', 'explosivite')),
        calculateScore20('medballrotation', getTestValue('medballrotation', 'explosivite')),
        calculateScore20('cmjunilateral', getTestValue('cmjunilateral', 'explosivite'))
    ];
    
    // CORE & STABILITÉ (5 tests - ajout Bird Dog) - minimum 3 requis
    const coreScores = [
        calculateScore20('rkcplank', getTestValue('rkcplank', 'core')),
        calculateScore20('sideplank', getTestValue('sideplank', 'core')),
        calculateScore20('mcgillflexor', getTestValue('mcgillflexor', 'core')),
        calculateScore20('mcgillextensor', getTestValue('mcgillextensor', 'core')),
        calculateScore20('birddog', getTestValue('birddog', 'core'))
    ];
    
    // MOBILITÉ (6 tests - ajout Shoulder/Apley Scratch) - minimum 3 requis
    const mobiliteScores = [
        calculateScore20('standreach', getTestValue('standreach', 'mobilite')),
        calculateScore20('thoracic', getTestValue('thoracic', 'mobilite')),
        calculateScore20('hipint', getTestValue('hipint', 'mobilite')),
        calculateScore20('hipext', getTestValue('hipext', 'mobilite')),
        calculateScore20('ankle', getTestValue('ankle', 'mobilite')),
        calculateScore20('shoulder', getTestValue('shoulder', 'mobilite'))
    ];
    
    // ÉQUILIBRE (2 tests) - minimum 1 requis
    const equilibreScores = [
        calculateScore20('balanceopen', getTestValue('balanceopen', 'equilibre')),
        calculateScore20('balanceclosed', getTestValue('balanceclosed', 'equilibre'))
    ];
    
    return {
        force: average(forceScores, 2),
        vitesse: average(vitesseScores, 1),
        endurance: average(enduranceScores, 2),
        explosivite: average(explosiviteScores, 3),
        core: average(coreScores, 3),
        mobilite: average(mobiliteScores, 3),
        equilibre: average(equilibreScores, 1)
    };
}

// Générer le bilan Page 1
function generateBilanPage1() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    const scores = calculateQualityScores();
    if (!scores) {
        alert('Erreur lors du calcul des scores');
        return;
    }
    
    // Calculer la moyenne générale
    const validScores = Object.values(scores).filter(s => s !== null && !isNaN(s));
    const moyenneGenerale = validScores.length > 0 
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
        : 0;
    
    // Identifier points forts et faibles
    const qualites = [
        {name: 'Force', score: scores.force},
        {name: 'Vitesse', score: scores.vitesse},
        {name: 'Endurance', score: scores.endurance},
        {name: 'Explosivité', score: scores.explosivite},
        {name: 'Core & Stabilité', score: scores.core},
        {name: 'Mobilité', score: scores.mobilite},
        {name: 'Équilibre', score: scores.equilibre}
    ].filter(q => q.score !== null);
    
    qualites.sort((a, b) => b.score - a.score);
    
    const pointsForts = qualites.slice(0, 2);
    const pointsFaibles = qualites.slice(-2).reverse();
    
    // Créer la page HTML
    const bilanWindow = window.open('', '_blank');
    bilanWindow.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilan Performance Golf - ${currentPlayer.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-size: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .page {
            background: white;
            max-width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1a4d2e;
        }
        
        .header-left h1 {
            color: #1a4d2e;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header-left p {
            color: #666;
            font-size: 14px;
        }
        
        .header-right {
            text-align: right;
        }
        
        .profile-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        
        .info-label {
            font-weight: 600;
            color: #1a4d2e;
        }
        
        .radar-container {
            max-width: 500px;
            margin: 30px auto;
        }
        
        .summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
        }
        
        .summary-box {
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .summary-box.strong {
            background: #e8f5e9;
            border-color: #27ae60;
        }
        
        .summary-box.weak {
            background: #fff3e0;
            border-color: #f39c12;
        }
        
        .summary-box h3 {
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .summary-box ul {
            list-style: none;
            padding-left: 0;
        }
        
        .summary-box li {
            padding: 5px 0;
            font-size: 14px;
        }
        
        .moyenne-generale {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #1a4d2e 0%, #27ae60 100%);
            color: white;
            border-radius: 10px;
        }
        
        .moyenne-generale h2 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .moyenne-generale .score {
            font-size: 48px;
            font-weight: 700;
        }
        
        .actions {
            margin-top: 30px;
            text-align: center;
        }
        
        .btn {
            padding: 12px 24px;
            margin: 0 10px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #1a4d2e;
            color: white;
        }
        
        .btn-primary:hover {
            background: #27ae60;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="header-left">
                <h1>BILAN PERFORMANCE GOLF</h1>
                <p>Évaluation Physique Complète</p>
            </div>
            <div class="header-right">
                <p><strong>${new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})}</strong></p>
            </div>
        </div>
        
        <div class="profile-info">
            <div>
                <div class="info-item">
                    <span class="info-label">Nom</span>
                    <span>${currentPlayer.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Sexe</span>
                    <span>${currentPlayer.gender === 'M' ? 'Homme' : 'Femme'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Âge</span>
                    <span>${currentPlayer.age}</span>
                </div>
            </div>
            <div>
                <div class="info-item">
                    <span class="info-label">Poids</span>
                    <span>${currentPlayer.weight} kg</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Taille</span>
                    <span>${currentPlayer.height} cm</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Niveau</span>
                    <span>Handicap ${currentPlayer.handicap || 'N/A'}</span>
                </div>
            </div>
        </div>
        
        <div class="moyenne-generale">
            <h2>Note Globale</h2>
            <div class="score">${moyenneGenerale.toFixed(1)}<span style="font-size: 24px;">/20</span></div>
        </div>
        
        <div class="radar-container">
            <canvas id="radarChart"></canvas>
        </div>
        
        <div class="summary">
            <div class="summary-box strong">
                <h3>💪 Points Forts</h3>
                <ul>
                    ${pointsForts.map(q => `<li><strong>${q.name}:</strong> ${q.score.toFixed(1)}/20</li>`).join('')}
                </ul>
            </div>
            <div class="summary-box weak">
                <h3>📈 À Améliorer</h3>
                <ul>
                    ${pointsFaibles.map(q => `<li><strong>${q.name}:</strong> ${q.score.toFixed(1)}/20</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="actions no-print">
            <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer / PDF</button>
            <button class="btn btn-secondary" onclick="window.close()">✖️ Fermer</button>
        </div>
    </div>
    
    <script>
        const ctx = document.getElementById('radarChart');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Force', 'Vitesse', 'Endurance', 'Explosivité', 'Core', 'Mobilité', 'Équilibre'],
                datasets: [{
                    label: 'Performance /20',
                    data: [
                        ${scores.force?.toFixed(1) || 0},
                        ${scores.vitesse?.toFixed(1) || 0},
                        ${scores.endurance?.toFixed(1) || 0},
                        ${scores.explosivite?.toFixed(1) || 0},
                        ${scores.core?.toFixed(1) || 0},
                        ${scores.mobilite?.toFixed(1) || 0},
                        ${scores.equilibre?.toFixed(1) || 0}
                    ],
                    backgroundColor: 'rgba(26, 77, 46, 0.2)',
                    borderColor: 'rgba(26, 77, 46, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(26, 77, 46, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(26, 77, 46, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            stepSize: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    </script>
</body>
</html>
    `);
    bilanWindow.document.close();
}

// ==================== BILAN PAGE 2 - RÉSULTATS & ASYMÉTRIES ====================
function generateBilanPage2() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    // Récupérer tous les tests avec leurs scores
    const getTestValue = (id) => {
        const input = document.getElementById(id);
        return input ? parseFloat(input.value) : null;
    };
    
    const allTestsData = [
        // FORCE
        {key: 'squat', name: 'Squat 1RM', value: getTestValue('test-squat-1rm'), unit: 'kg', category: 'Force'},
        {key: 'deadlift', name: 'Deadlift 1RM', value: getTestValue('test-deadlift-1rm'), unit: 'kg', category: 'Force'},
        {key: 'bench', name: 'Développé Couché 1RM', value: getTestValue('test-bench-1rm'), unit: 'kg', category: 'Force'},
        {key: 'pullup', name: 'Tractions 1RM', value: getTestValue('test-pullup-1rm'), unit: 'kg', category: 'Force'},
        
        // VITESSE
        {key: 'shuttle', name: 'Navette 5x10m', value: getTestValue('test-shuttle'), unit: 's', category: 'Vitesse'},
        {key: 'driverspeed', name: 'Vitesse Driver', value: getTestValue('test-driverspeed'), unit: 'mph', category: 'Vitesse'},
        
        // ENDURANCE
        {key: 'vma', name: 'VMA', value: getTestValue('test-vma'), unit: 'km/h', category: 'Endurance'},
        {key: 'maxpushups', name: 'Max Pompes 1min', value: getTestValue('test-maxpushups'), unit: 'reps', category: 'Endurance'},
        {key: 'maxsquats', name: 'Max Squats 1min', value: getTestValue('test-maxsquats'), unit: 'reps', category: 'Endurance'},
        
        // EXPLOSIVITÉ
        {key: 'vertjump', name: 'Détente Verticale', value: getTestValue('test-vertjump'), unit: 'cm', category: 'Explosivité'},
        {key: 'horizjump', name: 'Détente Horizontale', value: getTestValue('test-horizjump'), unit: 'cm', category: 'Explosivité'},
        {key: 'medballchest', name: 'MedBall Chest', value: getTestValue('test-medballchest'), unit: 'm', category: 'Explosivité'},
        
        // CORE
        {key: 'rkcplank', name: 'RKC Plank', value: getTestValue('test-rkcplank'), unit: 's', category: 'Core'},
        {key: 'mcgillflexor', name: 'McGill Flexor', value: getTestValue('test-mcgillflexor'), unit: 's', category: 'Core'},
        {key: 'mcgillextensor', name: 'McGill Extensor', value: getTestValue('test-mcgillextensor'), unit: 's', category: 'Core'},
        
        // MOBILITÉ
        {key: 'standreach', name: 'Stand & Reach', value: getTestValue('test-standreach'), unit: 'cm', category: 'Mobilité'},
        {key: 'ankle', name: 'Dorsiflexion', value: getTestValue('test-ankle-left'), unit: 'cm', category: 'Mobilité'}
    ];
    
    // Calculer les scores et filtrer les tests complétés
    const testsWithScores = allTestsData
        .filter(t => t.value !== null && !isNaN(t.value))
        .map(t => ({
            ...t,
            score: calculateScore20(t.key, t.value),
            badge: getBadgeLabel(calculateScore20(t.key, t.value))
        }))
        .filter(t => t.score !== null);
    
    // Trier par score
    testsWithScores.sort((a, b) => b.score - a.score);
    
    const top5 = testsWithScores.slice(0, 5);
    const bottom5 = testsWithScores.slice(-5).reverse();
    
    // Calculer les asymétries LSI
    const bilateralTests = [
        {name: 'Wall Sit', left: getTestValue('test-wallsit-left'), right: getTestValue('test-wallsit-right'), unit: 's'},
        {name: 'CMJ Unilatéral', left: getTestValue('test-cmj-left'), right: getTestValue('test-cmj-right'), unit: 'cm'},
        {name: 'Side Plank', left: getTestValue('test-sideplank-left'), right: getTestValue('test-sideplank-right'), unit: 's'},
        {name: 'Rotation Thoracique', left: getTestValue('test-thoracic-left'), right: getTestValue('test-thoracic-right'), unit: '°'},
        {name: 'Hip Rotation Int', left: getTestValue('test-hipint-left'), right: getTestValue('test-hipint-right'), unit: '°'},
        {name: 'Hip Rotation Ext', left: getTestValue('test-hipext-left'), right: getTestValue('test-hipext-right'), unit: '°'},
        {name: 'Dorsiflexion', left: getTestValue('test-ankle-left'), right: getTestValue('test-ankle-right'), unit: 'cm'},
        {name: 'Équilibre Y. Ouverts', left: getTestValue('test-balanceopen-left'), right: getTestValue('test-balanceopen-right'), unit: 's'},
        {name: 'Équilibre Y. Fermés', left: getTestValue('test-balanceclosed-left'), right: getTestValue('test-balanceclosed-right'), unit: 's'}
    ];
    
    const asymmetries = bilateralTests
        .filter(t => t.left && t.right && !isNaN(t.left) && !isNaN(t.right))
        .map(t => {
            const weaker = Math.min(t.left, t.right);
            const stronger = Math.max(t.left, t.right);
            const lsi = (weaker / stronger) * 100;
            const weakerSide = t.left < t.right ? 'G' : 'D';
            return {...t, lsi, weakerSide};
        })
        .filter(t => t.lsi < 90)
        .sort((a, b) => a.lsi - b.lsi);
    
    // Générer la page HTML
    const bilanWindow = window.open('', '_blank');
    bilanWindow.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilan Performance - Page 2 - ${currentPlayer.name}</title>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-size: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .page {
            background: white;
            max-width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1a4d2e;
        }
        
        .header h1 {
            color: #1a4d2e;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            color: #1a4d2e;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        th {
            background: #1a4d2e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            display: inline-block;
        }
        
        .badge-elite { background: #3498db; }
        .badge-bon { background: #27ae60; }
        .badge-moyen { background: #f39c12; }
        .badge-faible { background: #e74c3c; }
        
        .lsi-box {
            padding: 10px;
            margin-bottom: 10px;
            border-left: 4px solid;
            border-radius: 4px;
        }
        
        .lsi-important {
            background: #ffebee;
            border-color: #e74c3c;
        }
        
        .lsi-modere {
            background: #fff3e0;
            border-color: #f39c12;
        }
        
        .actions {
            margin-top: 30px;
            text-align: center;
        }
        
        .btn {
            padding: 12px 24px;
            margin: 0 10px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 600;
        }
        
        .btn-primary {
            background: #1a4d2e;
            color: white;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        
        .alert-success {
            background: #e8f5e9;
            border-left: 4px solid #27ae60;
            color: #2e7d32;
        }
        
        .alert-warning {
            background: #fff3e0;
            border-left: 4px solid #f39c12;
            color: #e65100;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>RÉSULTATS DÉTAILLÉS & ASYMÉTRIES</h1>
            <p>${currentPlayer.name} - ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div class="section">
            <h2>🏆 Top 5 Performances</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Résultat</th>
                        <th>Note /20</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    ${top5.map(t => `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.value.toFixed(1)} ${t.unit}</td>
                            <td><strong>${t.score.toFixed(1)}/20</strong></td>
                            <td><span class="badge badge-${t.badge.class}">${t.badge.label}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>📈 Top 5 À Améliorer</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Résultat</th>
                        <th>Note /20</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    ${bottom5.map(t => `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.value.toFixed(1)} ${t.unit}</td>
                            <td><strong>${t.score.toFixed(1)}/20</strong></td>
                            <td><span class="badge badge-${t.badge.class}">${t.badge.label}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>⚖️ Bilan LSI - Asymétries Détectées</h2>
            ${asymmetries.length === 0 ? `
                <div class="alert alert-success">
                    <strong>✅ Excellent !</strong> Aucune asymétrie significative détectée (tous les LSI ≥ 90%)
                </div>
            ` : `
                <div class="alert alert-warning">
                    <strong>⚠️ ${asymmetries.length} asymétrie(s) détectée(s)</strong>
                </div>
                ${asymmetries.map(a => `
                    <div class="lsi-box ${a.lsi < 85 ? 'lsi-important' : 'lsi-modere'}">
                        <strong>${a.name}</strong>: 
                        G ${a.left.toFixed(1)}${a.unit} | D ${a.right.toFixed(1)}${a.unit} 
                        → LSI: <strong>${a.lsi.toFixed(1)}%</strong>
                        ${a.lsi < 85 ? '🔴 Asymétrie importante' : '⚠️ Asymétrie modérée'}
                        - Renforcer côté ${a.weakerSide}
                    </div>
                `).join('')}
            `}
        </div>
        
        <div class="actions no-print">
            <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer / PDF</button>
            <button class="btn btn-secondary" onclick="window.close()">✖️ Fermer</button>
        </div>
    </div>
</body>
</html>
    `);
    bilanWindow.document.close();
}

// Helper function pour les badges
function getBadgeLabel(score) {
    if (score === null) return {label: 'N/A', class: 'faible'};
    if (score >= 17.5) return {label: 'Élite', class: 'elite'};
    if (score >= 12.5) return {label: 'Bon', class: 'bon'};
    if (score >= 7.5) return {label: 'Moyen', class: 'moyen'};
    return {label: 'Faible', class: 'faible'};
}

// ==================== SYSTÈME D'HISTORIQUE PAR QUALITÉ ====================

// Structure des tests par qualité
const QUALITY_TESTS = {
    force: {
        name: 'Force',
        icon: '💪',
        color: '#e74c3c',
        tests: [
            {key: 'squat', name: 'Squat 1RM', input: 'test-squat-1rm', unit: 'kg'},
            {key: 'deadlift', name: 'Deadlift 1RM', input: 'test-deadlift-1rm', unit: 'kg'},
            {key: 'bench', name: 'Développé Couché 1RM', input: 'test-bench-1rm', unit: 'kg'},
            {key: 'pullup', name: 'Tractions 1RM', input: 'test-pullup-1rm', unit: 'kg'},
            {key: 'legext', name: 'Leg Extension', inputs: ['test-legext-left', 'test-legext-right'], unit: 'kg', bilateral: true},
            {key: 'press', name: 'Leg Press', inputs: ['test-press-left', 'test-press-right'], unit: 'kg', bilateral: true}
        ]
    },
    vitesse: {
        name: 'Vitesse',
        icon: '⚡',
        color: '#f39c12',
        tests: [
            {key: 'shuttle', name: 'Navette 5x10m', input: 'test-shuttle', unit: 's'},
            {key: 'driverspeed', name: 'Vitesse Driver', input: 'test-driverspeed', unit: 'mph'}
        ]
    },
    endurance: {
        name: 'Endurance',
        icon: '🏃',
        color: '#3498db',
        tests: [
            {key: 'vma', name: 'VMA', input: 'test-vma', unit: 'km/h'},
            {key: 'maxpushups', name: 'Max Pompes 1min', input: 'test-maxpushups', unit: 'reps'},
            {key: 'maxsquats', name: 'Max Squats 1min', input: 'test-maxsquats', unit: 'reps'},
            {key: 'wallsit', name: 'Wall Sit', inputs: ['test-wallsit-left', 'test-wallsit-right'], unit: 's', bilateral: true}
        ]
    },
    explosivite: {
        name: 'Explosivité',
        icon: '🚀',
        color: '#9b59b6',
        tests: [
            {key: 'vertjump', name: 'Détente Verticale', input: 'test-vertjump', unit: 'cm'},
            {key: 'horizjump', name: 'Détente Horizontale', input: 'test-horizjump', unit: 'cm'},
            {key: 'medballchest', name: 'MedBall Chest', input: 'test-medballchest', unit: 'm'},
            {key: 'medballrotation', name: 'MedBall Rotation', inputs: ['test-medballrotation-left', 'test-medballrotation-right'], unit: 'm', bilateral: true},
            {key: 'cmjunilateral', name: 'CMJ Unilatéral', inputs: ['test-cmj-left', 'test-cmj-right'], unit: 'cm', bilateral: true}
        ]
    },
    core: {
        name: 'Core & Stabilité',
        icon: '🎯',
        color: '#1abc9c',
        tests: [
            {key: 'rkcplank', name: 'RKC Plank', input: 'test-rkcplank', unit: 's'},
            {key: 'sideplank', name: 'Side Plank', inputs: ['test-sideplank-left', 'test-sideplank-right'], unit: 's', bilateral: true},
            {key: 'mcgillflexor', name: 'McGill Flexor', input: 'test-mcgillflexor', unit: 's'},
            {key: 'mcgillextensor', name: 'McGill Extensor', input: 'test-mcgillextensor', unit: 's'},
            {key: 'birddog', name: 'Bird Dog', input: 'test-birddog', unit: 'score'}
        ]
    },
    mobilite: {
        name: 'Mobilité',
        icon: '🤸',
        color: '#27ae60',
        tests: [
            {key: 'standreach', name: 'Stand & Reach', input: 'test-standreach', unit: 'cm'},
            {key: 'thoracic', name: 'Rotation Thoracique', inputs: ['test-thoracic-left', 'test-thoracic-right'], unit: '°', bilateral: true},
            {key: 'hipint', name: 'Hip Rotation Interne', inputs: ['test-hipint-left', 'test-hipint-right'], unit: '°', bilateral: true},
            {key: 'hipext', name: 'Hip Rotation Externe', inputs: ['test-hipext-left', 'test-hipext-right'], unit: '°', bilateral: true},
            {key: 'ankle', name: 'Dorsiflexion', inputs: ['test-ankle-left', 'test-ankle-right'], unit: 'cm', bilateral: true},
            {key: 'shoulder', name: 'Apley Scratch', inputs: ['test-shoulder-left', 'test-shoulder-right'], unit: 'cm', bilateral: true}
        ]
    },
    equilibre: {
        name: 'Équilibre',
        icon: '⚖️',
        color: '#34495e',
        tests: [
            {key: 'balanceopen', name: 'Équilibre Y. Ouverts', inputs: ['test-balanceopen-left', 'test-balanceopen-right'], unit: 's', bilateral: true},
            {key: 'balanceclosed', name: 'Équilibre Y. Fermés', inputs: ['test-balanceclosed-left', 'test-balanceclosed-right'], unit: 's', bilateral: true}
        ]
    },
    tpi: {
        name: 'TPI Screening',
        icon: '🏌️',
        color: '#e67e22',
        tests: [
            {key: 'pelvic-tilt', name: 'Pelvic Tilt', input: 'tpi-pelvic-tilt', unit: ''},
            {key: 'pelvic-rotation', name: 'Pelvic Rotation', input: 'tpi-pelvic-rotation', unit: ''},
            {key: 'torso-rotation', name: 'Torso Rotation', input: 'tpi-torso-rotation', unit: ''},
            {key: 'lower-lat', name: 'Lower Quarter Lat', inputs: ['tpi-lower-lat-left', 'tpi-lower-lat-right'], unit: '', bilateral: true},
            {key: 'overhead-squat', name: 'Overhead Deep Squat', input: 'tpi-overhead-squat', unit: ''},
            {key: 'toe-touch', name: 'Toe Touch', input: 'tpi-toe-touch', unit: ''},
            {key: 'single-balance', name: 'Single Leg Balance', inputs: ['tpi-single-balance-left', 'tpi-single-balance-right'], unit: '', bilateral: true},
            {key: 'cervical-rotation', name: 'Cervical Rotation', inputs: ['tpi-cervical-left', 'tpi-cervical-right'], unit: '', bilateral: true},
            {key: 'forearm-rotation', name: 'Forearm Rotation', inputs: ['tpi-forearm-left', 'tpi-forearm-right'], unit: '', bilateral: true},
            {key: 'wrist-hinge', name: 'Wrist Hinge', inputs: ['tpi-wrist-hinge-left', 'tpi-wrist-hinge-right'], unit: '', bilateral: true},
            {key: 'wrist-flex', name: 'Wrist Flex/Ext', inputs: ['tpi-wrist-flex-left', 'tpi-wrist-flex-right'], unit: '', bilateral: true},
            {key: 'shoulder', name: '90-90 Shoulder', input: 'tpi-shoulder', unit: ''},
            {key: 'lat', name: 'Lat Test', input: 'tpi-lat', unit: ''}
        ]
    }
};

// Sauvegarder les tests d'une qualité spécifique
function saveQualityTests(qualityKey) {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    const quality = QUALITY_TESTS[qualityKey];
    if (!quality) return;
    
    const testData = {
        id: Date.now(),
        date: new Date().toISOString(),
        quality: qualityKey,
        player: currentPlayer.name,
        tests: {}
    };
    
    let hasData = false;
    
    quality.tests.forEach(test => {
        if (test.bilateral) {
            const leftEl = document.getElementById(test.inputs[0]);
            const rightEl = document.getElementById(test.inputs[1]);
            
            // Pour TPI (selects) ou tests numériques
            const leftValue = leftEl?.tagName === 'SELECT' ? leftEl.value : parseFloat(leftEl?.value);
            const rightValue = rightEl?.tagName === 'SELECT' ? rightEl.value : parseFloat(rightEl?.value);
            
            const leftValid = leftEl?.tagName === 'SELECT' ? leftValue && leftValue !== '' : !isNaN(leftValue);
            const rightValid = rightEl?.tagName === 'SELECT' ? rightValue && rightValue !== '' : !isNaN(rightValue);
            
            if (leftValid || rightValid) {
                testData.tests[test.key] = {
                    left: leftValid ? leftValue : null,
                    right: rightValid ? rightValue : null
                };
                hasData = true;
            }
        } else {
            const el = document.getElementById(test.input);
            
            // Pour TPI (selects) ou tests numériques
            const value = el?.tagName === 'SELECT' ? el.value : parseFloat(el?.value);
            const isValid = el?.tagName === 'SELECT' ? value && value !== '' : !isNaN(value);
            
            if (isValid) {
                testData.tests[test.key] = value;
                hasData = true;
            }
        }
    });
    
    if (!hasData) {
        alert(`Aucun test de ${quality.name} n'a été saisi.`);
        return;
    }
    
    // Récupérer l'historique existant
    let history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Si on est en mode édition, remplacer le test existant
    if (window.editingTestId) {
        const index = history.findIndex(t => t.id === window.editingTestId);
        if (index !== -1) {
            // Garder l'ID et la date d'origine
            testData.id = window.editingTestId;
            testData.date = history[index].date;
            testData.modifiedDate = new Date().toISOString();
            
            history[index] = testData;
            alert(`✅ Test de ${quality.name} modifié !`);
        } else {
            history.push(testData);
            alert(`✅ Tests de ${quality.name} enregistrés !`);
        }
        
        // Réinitialiser le mode édition
        window.editingTestId = null;
    } else {
        // Mode création normal
        history.push(testData);
        alert(`✅ Tests de ${quality.name} enregistrés !`);
    }
    
    localStorage.setItem('testsHistory', JSON.stringify(history));
    
    // BACKUP AUTOMATIQUE (sauvegarde silencieuse en arrière-plan)
    autoBackup();
    
    // Vider les champs après sauvegarde
    quality.tests.forEach(test => {
        if (test.bilateral) {
            const leftEl = document.getElementById(test.inputs[0]);
            const rightEl = document.getElementById(test.inputs[1]);
            if (leftEl) leftEl.value = '';
            if (rightEl) rightEl.value = '';
        } else {
            const el = document.getElementById(test.input);
            if (el) {
                if (el.tagName === 'SELECT') {
                    el.value = '';
                } else {
                    el.value = '';
                }
            }
        }
    });
}

// ==================== PHASE 3 : ÉVOLUTION TEMPORELLE ====================

// Fonction pour basculer entre les vues Historique
function switchHistoryView(view) {
    // Mettre à jour les boutons
    document.querySelectorAll('.history-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Si appelé via événement, utiliser event.target, sinon trouver le bon bouton
    if (typeof event !== 'undefined' && event.target) {
        event.target.classList.add('active');
    } else {
        // Appel programmatique - trouver le bon bouton
        const targetBtn = view === 'evolution' 
            ? document.querySelector('.history-nav-btn:first-child')
            : document.querySelector('.history-nav-btn:last-child');
        if (targetBtn) targetBtn.classList.add('active');
    }
    
    // Afficher/masquer les vues
    if (view === 'evolution') {
        document.getElementById('historyEvolution').style.display = 'block';
        document.getElementById('historyListe').style.display = 'none';
        
        // Charger les données d'évolution
        drawEvolutionChart();
        populateCompareDateSelectors();
        calculateProgressionStats();
    } else {
        document.getElementById('historyEvolution').style.display = 'none';
        document.getElementById('historyListe').style.display = 'block';
        
        // Charger la liste
        displayHistory();
    }
}

// Fonction helper : calculer le score d'une qualité à partir d'un objet tests
function calculateQualityScore(quality, tests) {
    if (typeof QUALITY_TESTS === 'undefined') {
        console.error('QUALITY_TESTS est undefined !');
        return null;
    }
    
    const qualityDef = QUALITY_TESTS[quality];
    if (!qualityDef || !qualityDef.tests) return null;
    
    const testsList = qualityDef.tests;
    let totalScore = 0;
    let completedTests = 0;
    
    testsList.forEach(testDef => {
        const testValue = tests[testDef.key];
        
        if (testValue !== undefined && testValue !== null && testValue !== '') {
            // Gérer les tests bilatéraux
            if (testDef.bilateral && typeof testValue === 'object' && testValue.left !== undefined && testValue.right !== undefined) {
                const left = parseFloat(testValue.left);
                const right = parseFloat(testValue.right);
                
                if (!isNaN(left) && !isNaN(right) && left > 0 && right > 0) {
                    const avgValue = (left + right) / 2;
                    const score = calculateScore20(testDef.key, avgValue);
                    if (score !== null) {
                        totalScore += score;
                        completedTests++;
                    }
                }
            } else {
                // Test unilatéral
                const numValue = parseFloat(testValue);
                if (!isNaN(numValue) && numValue > 0) {
                    const score = calculateScore20(testDef.key, numValue);
                    if (score !== null) {
                        totalScore += score;
                        completedTests++;
                    }
                }
            }
        }
    });
    
    // Retourner la moyenne si au moins 50% des tests sont complétés
    const minTestsRequired = Math.ceil(testsList.length * 0.5);
    if (completedTests >= minTestsRequired) {
        return totalScore / completedTests;
    }
    
    return null;
}

// 1. GRAPHIQUE D'ÉVOLUTION
function drawEvolutionChart() {
    const canvas = document.getElementById('evolutionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Récupérer l'historique
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    if (history.length === 0) {
        ctx.clearRect(0, 0, width, height);
        ctx.font = '20px Arial';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.fillText('Aucun test enregistré', width / 2, height / 2);
        return;
    }
    
    // Trier par date
    const sortedHistory = history.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Préparer les données par qualité
    const qualities = ['force', 'explosivite', 'mobilite', 'core', 'endurance', 'vitesse', 'equilibre'];
    const qualityLabels = ['Force', 'Explosivité', 'Mobilité', 'Core', 'Endurance', 'Vitesse', 'Équilibre'];
    const qualityColors = [
        '#ef4444', // Force - Rouge
        '#f59e0b', // Explosivité - Orange
        '#22c55e', // Mobilité - Vert
        '#3b82f6', // Core - Bleu
        '#8b5cf6', // Endurance - Violet
        '#ec4899', // Vitesse - Rose
        '#14b8a6'  // Équilibre - Turquoise
    ];
    
    // Pour chaque test, calculer les scores
    const dataPoints = sortedHistory.map(test => {
        const scores = {};
        qualities.forEach(quality => {
            if (test.quality === quality) {
                scores[quality] = calculateQualityScore(quality, test.tests);
            }
        });
        return {
            date: new Date(test.date),
            scores: scores
        };
    });
    
    // Grouper par qualité
    const qualityData = {};
    qualities.forEach((quality, idx) => {
        qualityData[quality] = dataPoints
            .filter(dp => dp.scores[quality] !== undefined && dp.scores[quality] !== null)
            .map(dp => ({ date: dp.date, score: dp.scores[quality] }));
    });
    
    // Dessiner
    ctx.clearRect(0, 0, width, height);
    
    const padding = 80;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Graduations Y (scores 0-20)
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 20; i += 5) {
        const y = height - padding - (i / 20) * chartHeight;
        ctx.fillText(i, padding - 10, y + 5);
        
        // Lignes horizontales
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Dessiner les courbes
    qualities.forEach((quality, idx) => {
        const data = qualityData[quality];
        if (data.length === 0) return;
        
        ctx.strokeStyle = qualityColors[idx];
        ctx.fillStyle = qualityColors[idx];
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        data.forEach((point, i) => {
            const x = padding + (i / Math.max(data.length - 1, 1)) * chartWidth;
            const y = height - padding - (point.score / 20) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Points
        data.forEach((point, i) => {
            const x = padding + (i / Math.max(data.length - 1, 1)) * chartWidth;
            const y = height - padding - (point.score / 20) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    });
    
    // Légende
    const legendX = padding;
    const legendY = 30;
    ctx.font = '14px Arial';
    qualities.forEach((quality, idx) => {
        const x = legendX + (idx * 130);
        ctx.fillStyle = qualityColors[idx];
        ctx.fillRect(x, legendY, 15, 15);
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText(qualityLabels[idx], x + 20, legendY + 12);
    });
}

// 2. COMPARAISON DE TESTS
function populateCompareDateSelectors() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    if (history.length === 0) return;
    
    const sortedHistory = history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const select1 = document.getElementById('compareDate1');
    const select2 = document.getElementById('compareDate2');
    
    if (!select1 || !select2) return;
    
    select1.innerHTML = '<option value="">Sélectionner...</option>';
    select2.innerHTML = '<option value="">Sélectionner...</option>';
    
    sortedHistory.forEach((test, idx) => {
        const date = new Date(test.date).toLocaleDateString('fr-FR');
        const qualityLabel = test.quality.charAt(0).toUpperCase() + test.quality.slice(1);
        const option1 = `<option value="${idx}">${date} - ${qualityLabel}</option>`;
        const option2 = `<option value="${idx}">${date} - ${qualityLabel}</option>`;
        
        select1.innerHTML += option1;
        select2.innerHTML += option2;
    });
}

function compareTests() {
    const select1 = document.getElementById('compareDate1');
    const select2 = document.getElementById('compareDate2');
    const resultsDiv = document.getElementById('comparisonResults');
    
    if (!select1 || !select2 || !resultsDiv) return;
    
    const idx1 = parseInt(select1.value);
    const idx2 = parseInt(select2.value);
    
    if (isNaN(idx1) || isNaN(idx2)) {
        resultsDiv.innerHTML = '<p style="color: #999;">Sélectionnez 2 tests pour comparer.</p>';
        return;
    }
    
    if (idx1 === idx2) {
        resultsDiv.innerHTML = '<p style="color: #ef4444;">Veuillez sélectionner 2 tests différents.</p>';
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const sortedHistory = history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const test1 = sortedHistory[idx1];
    const test2 = sortedHistory[idx2];
    
    // Calculer les scores pour chaque qualité
    const qualities = ['force', 'explosivite', 'mobilite', 'core', 'endurance', 'vitesse', 'equilibre'];
    const qualityLabels = ['Force', 'Explosivité', 'Mobilité', 'Core', 'Endurance', 'Vitesse', 'Équilibre'];
    
    let html = '';
    
    qualities.forEach((quality, idx) => {
        // Trouver le test le plus proche de cette qualité pour chaque date
        const test1Quality = sortedHistory.find((t, i) => i >= idx1 && t.quality === quality);
        const test2Quality = sortedHistory.find((t, i) => i >= idx2 && t.quality === quality);
        
        if (!test1Quality || !test2Quality) return;
        
        const score1 = calculateQualityScore(quality, test1Quality.tests);
        const score2 = calculateQualityScore(quality, test2Quality.tests);
        
        if (score1 === null || score2 === null) return;
        
        const diff = score2 - score1;
        const diffPercent = ((diff / score1) * 100).toFixed(1);
        const arrow = diff > 0 ? '↗️' : diff < 0 ? '↘️' : '→';
        const cssClass = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'stable';
        
        html += `
            <div class="comparison-item ${cssClass}">
                <div class="comparison-item-label">${qualityLabels[idx]}</div>
                <div class="comparison-item-values">${score1.toFixed(1)} → ${score2.toFixed(1)}</div>
                <div class="comparison-item-change">${arrow} ${diffPercent > 0 ? '+' : ''}${diffPercent}%</div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html || '<p style="color: #999;">Pas de données comparables pour ces tests.</p>';
}

// 3. STATS DE PROGRESSION
function calculateProgressionStats() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const statsDiv = document.getElementById('progressionStats');
    
    if (!statsDiv) return;
    
    if (history.length === 0) {
        statsDiv.innerHTML = '<p style="color: #999;">Aucune donnée disponible.</p>';
        return;
    }
    
    // Total tests
    const totalTests = history.length;
    
    // Période de suivi
    const dates = history.map(t => new Date(t.date)).sort((a, b) => a - b);
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const daysDiff = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    const monthsDiff = (daysDiff / 30).toFixed(1);
    
    // Moyenne tests/mois
    const testsPerMonth = monthsDiff > 0 ? (totalTests / monthsDiff).toFixed(1) : totalTests;
    
    // Calculer meilleure progression et pire régression
    const qualities = ['force', 'explosivite', 'mobilite', 'core', 'endurance', 'vitesse', 'equilibre'];
    const qualityLabels = ['Force', 'Explosivité', 'Mobilité', 'Core', 'Endurance', 'Vitesse', 'Équilibre'];
    
    let progressions = [];
    
    qualities.forEach((quality, idx) => {
        const qualityTests = history.filter(t => t.quality === quality).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (qualityTests.length >= 2) {
            const firstScore = calculateQualityScore(quality, qualityTests[0].tests);
            const lastScore = calculateQualityScore(quality, qualityTests[qualityTests.length - 1].tests);
            
            if (firstScore !== null && lastScore !== null) {
                const diff = lastScore - firstScore;
                const diffPercent = ((diff / firstScore) * 100);
                
                progressions.push({
                    quality: qualityLabels[idx],
                    percent: diffPercent
                });
            }
        }
    });
    
    let bestProgression = null;
    let worstRegression = null;
    
    if (progressions.length > 0) {
        progressions.sort((a, b) => b.percent - a.percent);
        bestProgression = progressions[0];
        worstRegression = progressions[progressions.length - 1];
    }
    
    // Tendance globale
    const avgProgression = progressions.length > 0 
        ? progressions.reduce((sum, p) => sum + p.percent, 0) / progressions.length 
        : 0;
    
    let trend = '➡️ Stable';
    let trendColor = '#f59e0b';
    if (avgProgression > 5) {
        trend = '🚀 Excellent';
        trendColor = '#22c55e';
    } else if (avgProgression > 0) {
        trend = '📈 Positif';
        trendColor = '#22c55e';
    } else if (avgProgression < -5) {
        trend = '📉 Négatif';
        trendColor = '#ef4444';
    }
    
    // Afficher
    let html = `
        <div class="stat-box">
            <div class="stat-box-value">${totalTests}</div>
            <div class="stat-box-label">Tests enregistrés</div>
        </div>
        
        <div class="stat-box">
            <div class="stat-box-value">${monthsDiff}</div>
            <div class="stat-box-label">Mois de suivi</div>
            <div class="stat-box-detail">${daysDiff} jours</div>
        </div>
        
        <div class="stat-box">
            <div class="stat-box-value">${testsPerMonth}</div>
            <div class="stat-box-label">Tests/mois (moyenne)</div>
        </div>
    `;
    
    if (bestProgression) {
        html += `
            <div class="stat-box">
                <div class="stat-box-value" style="color: #22c55e;">+${bestProgression.percent.toFixed(1)}%</div>
                <div class="stat-box-label">Meilleure progression</div>
                <div class="stat-box-detail">${bestProgression.quality}</div>
            </div>
        `;
    }
    
    if (worstRegression && worstRegression.percent < 0) {
        html += `
            <div class="stat-box">
                <div class="stat-box-value" style="color: #ef4444;">${worstRegression.percent.toFixed(1)}%</div>
                <div class="stat-box-label">À surveiller</div>
                <div class="stat-box-detail">${worstRegression.quality}</div>
            </div>
        `;
    }
    
    html += `
        <div class="stat-box">
            <div class="stat-box-value" style="color: ${trendColor};">${trend}</div>
            <div class="stat-box-label">Tendance globale</div>
            <div class="stat-box-detail">${avgProgression.toFixed(1)}% en moyenne</div>
        </div>
    `;
    
    statsDiv.innerHTML = html;
}

// Exposer les fonctions globalement
window.switchHistoryView = switchHistoryView;
window.compareTests = compareTests;

// Afficher l'historique
function displayHistory() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const container = document.getElementById('historyListe');
    
    if (!container) {
        console.error('Container #historyListe not found');
        return;
    }
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="alert warning">
                <div class="alert-title">📋 Aucun test enregistré</div>
                <p>Commencez par enregistrer vos premiers tests !</p>
            </div>
        `;
        return;
    }
    
    // Organiser par qualité
    const byQuality = {};
    Object.keys(QUALITY_TESTS).forEach(key => {
        byQuality[key] = history.filter(h => h.quality === key).reverse(); // Plus récent en premier
    });
    
    let html = '<div class="history-by-quality">';
    
    Object.keys(QUALITY_TESTS).forEach(qualityKey => {
        const quality = QUALITY_TESTS[qualityKey];
        const tests = byQuality[qualityKey];
        
        if (tests.length === 0) return;
        
        html += `
            <div class="quality-history-section" style="margin-bottom: 30px;">
                <h3 style="color: ${quality.color}; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">${quality.icon}</span>
                    ${quality.name}
                    <span style="font-size: 14px; color: #666;">(${tests.length} enregistrement${tests.length > 1 ? 's' : ''})</span>
                </h3>
                <div class="tests-list">
        `;
        
        tests.forEach((test, index) => {
            const date = new Date(test.date);
            const previousTest = tests[index + 1]; // Test précédent (plus ancien)
            
            html += `
                <div class="test-card" style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid ${quality.color};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 16px;">📅 ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</strong>
                            <div style="color: #666; font-size: 14px;">${Object.keys(test.tests).length} test${Object.keys(test.tests).length > 1 ? 's' : ''} complété${Object.keys(test.tests).length > 1 ? 's' : ''}</div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="editTest(${test.id})" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                                ✏️ Modifier
                            </button>
                            <button onclick="deleteTest(${test.id})" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                    <div class="test-results">
            `;
            
            // Afficher les résultats
            quality.tests.forEach(testDef => {
                const testResult = test.tests[testDef.key];
                if (!testResult) return;
                
                if (testDef.bilateral) {
                    const left = testResult.left;
                    const right = testResult.right;
                    
                    if (left !== null || right !== null) {
                        html += `<div style="padding: 8px 0; border-bottom: 1px solid #eee;">`;
                        html += `<strong>${testDef.name}:</strong> `;
                        
                        if (left !== null) html += `G: ${left}${testDef.unit} `;
                        if (right !== null) html += `D: ${right}${testDef.unit}`;
                        
                        // LSI si les deux côtés
                        if (left !== null && right !== null) {
                            const lsi = ((Math.min(left, right) / Math.max(left, right)) * 100).toFixed(1);
                            const lsiColor = lsi >= 90 ? '#27ae60' : lsi >= 85 ? '#f39c12' : '#e74c3c';
                            html += ` | <span style="color: ${lsiColor}; font-weight: 600;">LSI: ${lsi}%</span>`;
                        }
                        
                        // Progression
                        if (previousTest && previousTest.tests[testDef.key]) {
                            const prevLeft = previousTest.tests[testDef.key].left;
                            const prevRight = previousTest.tests[testDef.key].right;
                            
                            if (left !== null && prevLeft !== null) {
                                const diff = left - prevLeft;
                                if (diff !== 0) {
                                    html += ` <span style="color: ${diff > 0 ? '#27ae60' : '#e74c3c'};">${diff > 0 ? '⬆️' : '⬇️'} ${Math.abs(diff).toFixed(1)}${testDef.unit} (G)</span>`;
                                }
                            }
                        }
                        
                        html += `</div>`;
                    }
                } else {
                    html += `<div style="padding: 8px 0; border-bottom: 1px solid #eee;">`;
                    html += `<strong>${testDef.name}:</strong> ${testResult}${testDef.unit}`;
                    
                    // Badge
                    const score = calculateScore20(testDef.key, testResult);
                    if (score !== null) {
                        const badge = getBadgeLabel(score);
                        html += ` <span style="background: ${quality.color}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600;">${badge.label}</span>`;
                    }
                    
                    // Progression
                    if (previousTest && previousTest.tests[testDef.key] !== undefined) {
                        const prev = previousTest.tests[testDef.key];
                        const diff = testResult - prev;
                        if (diff !== 0) {
                            html += ` <span style="color: ${diff > 0 ? '#27ae60' : '#e74c3c'};">${diff > 0 ? '⬆️' : '⬇️'} ${Math.abs(diff).toFixed(1)}${testDef.unit}</span>`;
                        }
                    }
                    
                    html += `</div>`;
                }
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    container.innerHTML = html;
}

// Supprimer un test
// Modifier un test
function editTest(testId) {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const test = history.find(t => t.id === testId);
    
    if (!test) {
        alert('Test introuvable !');
        return;
    }
    
    const quality = QUALITY_TESTS[test.quality];
    if (!quality) return;
    
    // Charger les valeurs dans les champs
    quality.tests.forEach(testDef => {
        const testResult = test.tests[testDef.key];
        if (!testResult) return;
        
        if (testDef.bilateral) {
            const leftEl = document.getElementById(testDef.inputs[0]);
            const rightEl = document.getElementById(testDef.inputs[1]);
            
            if (leftEl) {
                if (leftEl.tagName === 'SELECT') {
                    leftEl.value = testResult.left || '';
                } else {
                    leftEl.value = testResult.left || '';
                }
            }
            
            if (rightEl) {
                if (rightEl.tagName === 'SELECT') {
                    rightEl.value = testResult.right || '';
                } else {
                    rightEl.value = testResult.right || '';
                }
            }
        } else {
            const el = document.getElementById(testDef.input);
            if (el) {
                if (el.tagName === 'SELECT') {
                    el.value = testResult || '';
                } else {
                    el.value = testResult || '';
                }
            }
        }
    });
    
    // Stocker l'ID du test en cours d'édition
    window.editingTestId = testId;
    
    // Aller à l'onglet Tests
    switchTab('tests');
    
    // Ouvrir l'accordéon correspondant
    const accordionMap = {
        'force': '🟢 FORCE',
        'vitesse': '🟡 VITESSE',
        'endurance': '🔴 ENDURANCE',
        'explosivite': '🟣 EXPLOSIVITÉ',
        'core': '🔵 CORE',
        'mobilite': '🟠 MOBILITÉ',
        'equilibre': '⚪ ÉQUILIBRE',
        'tpi': '🏌️ TESTS TPI'
    };
    
    const sectionTitle = accordionMap[test.quality];
    if (sectionTitle) {
        // Trouver et ouvrir l'accordéon
        const headers = document.querySelectorAll('.category-header');
        headers.forEach(header => {
            const span = header.querySelector('span');
            if (span && span.textContent.includes(sectionTitle)) {
                const content = header.nextElementSibling;
                if (content && !content.classList.contains('active')) {
                    header.click();
                }
                // Scroller jusqu'à la section
                setTimeout(() => {
                    header.scrollIntoView({behavior: 'smooth', block: 'center'});
                }, 300);
            }
        });
    }
    
    alert(`✏️ Les valeurs ont été chargées. Modifiez-les puis cliquez sur "${quality.icon} Enregistrer ${quality.name}" pour sauvegarder.`);
}

// Supprimer un test
function deleteTest(testId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) return;
    
    let history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    history = history.filter(t => t.id !== testId);
    localStorage.setItem('testsHistory', JSON.stringify(history));
    
    alert('✅ Test supprimé !');
    displayHistory();
}

console.log('✅ Application chargée et prête');

// Appel immédiat au cas où DOMContentLoaded est déjà passé
if (document.readyState === 'loading') {
    // Le DOM n'est pas encore chargé, on attend
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 DOMContentLoaded - Initialisation...');
        initializeApp();
        setupEventListeners();
        loadPlayerData();
        setupMobileMenu();
        setupRMCalculators();
    });
} else {
    // Le DOM est déjà chargé (script defer), on exécute directement
    console.log('🚀 DOM déjà prêt - Initialisation immédiate...');
    initializeApp();
    setupEventListeners();
    loadPlayerData();
    setupMobileMenu();
    setupRMCalculators();
}

// ==================== ONGLET ANALYSE PRO ====================

// Pondérations pour le Golf Fitness Index
const GFI_WEIGHTS = {
    force: 0.25,
    explosivite: 0.20,
    mobilite: 0.20,
    core: 0.15,
    endurance: 0.10,
    vitesse: 0.05,
    equilibre: 0.05
};

// Matrice TPI : Lien entre tests échoués et défauts de swing
const TPI_SWING_FAULTS = {
    'pelvic-tilt': {
        name: 'Pelvic Tilt',
        category: 'Mobilité Bassin',
        swingFaults: ['Sway', 'Slide', 'Early Extension', 'Loss of Posture'],
        description: 'Incapacité à basculer le bassin limite la rotation et force des compensations'
    },
    'pelvic-rotation': {
        name: 'Pelvic Rotation',
        category: 'Mobilité Bassin',
        swingFaults: ['Loss of Posture', 'Reverse Spine Angle', 'Hanging Back'],
        description: 'Rotation pelvienne limitée crée des compensations au niveau du tronc'
    },
    'torso-rotation': {
        name: 'Torso Rotation',
        category: 'Mobilité Tronc',
        swingFaults: ['Over-the-top', 'Chicken Wing', 'Casting', 'Limited Turn'],
        description: 'Rotation thoracique insuffisante limite l\'amplitude et force les bras'
    },
    'lower-lat': {
        name: 'Lower Quarter Lat Test',
        category: 'Mobilité Latérale',
        swingFaults: ['Sway', 'Slide', 'Reverse Spine Angle'],
        description: 'Mobilité latérale limitée empêche un transfert de poids optimal'
    },
    'trunk-rotation': {
        name: 'Seated Trunk Rotation',
        category: 'Mobilité Tronc',
        swingFaults: ['Over-the-top', 'Limited Turn', 'Loss of Posture'],
        description: 'Rotation tronc isolée limitée indique des compensations'
    },
    'bridge': {
        name: 'Bridge w/ Leg Extension',
        category: 'Stabilité Core',
        swingFaults: ['Early Extension', 'Loss of Posture', 'Sway'],
        description: 'Faiblesse chaîne postérieure et stabilité lombaire'
    },
    'overhead-squat': {
        name: 'Overhead Deep Squat',
        category: 'Mobilité Globale',
        swingFaults: ['Sway', 'Slide', 'Early Extension', 'Loss of Posture'],
        description: 'Test global de mobilité cheville/hanche/thoracique et stabilité'
    },
    'toe-touch': {
        name: 'Toe Touch',
        category: 'Mobilité Postérieure',
        swingFaults: ['Early Extension', 'Loss of Posture', 'Chicken Wing'],
        description: 'Chaîne postérieure rigide force redressement prématuré'
    },
    '9090': {
        name: '90/90',
        category: 'Mobilité Hanche',
        swingFaults: ['Limited Turn', 'Flat Shoulder Plane', 'Sway'],
        description: 'Rotation interne hanche limitée réduit l\'amplitude du backswing'
    },
    'single-leg': {
        name: 'Single Leg Balance',
        category: 'Équilibre',
        swingFaults: ['Sway', 'Slide', 'Loss of Balance', 'Hanging Back'],
        description: 'Instabilité mono-podale impacte le transfert de poids'
    },
    'cervical': {
        name: 'Cervical Rotation',
        category: 'Mobilité Cervicale',
        swingFaults: ['Limited Turn', 'Chicken Wing', 'Loss of Posture'],
        description: 'Rotation cervicale limitée perturbe la séquence et le regard'
    },
    'forearm': {
        name: 'Forearm Rotation',
        category: 'Mobilité Avant-bras',
        swingFaults: ['Chicken Wing', 'Cupped Wrist', 'Casting'],
        description: 'Rotation avant-bras limitée impacte la release et la face du club'
    },
    'wrist-hinge': {
        name: 'Wrist Hinge',
        category: 'Mobilité Poignet',
        swingFaults: ['Casting', 'Early Release', 'Loss of Lag'],
        description: 'Hinge poignet limité réduit l\'angle d\'attaque et la puissance'
    },
    'wrist-flex': {
        name: 'Wrist Flexion/Extension',
        category: 'Mobilité Poignet',
        swingFaults: ['Cupped Wrist', 'Bowed Wrist', 'Casting'],
        description: 'Flexion/extension limitée perturbe le contrôle de la face'
    },
    'shoulder': {
        name: 'Shoulder Mobility',
        category: 'Mobilité Épaule',
        swingFaults: ['Chicken Wing', 'Flying Elbow', 'Limited Turn'],
        description: 'Mobilité épaule insuffisante limite l\'amplitude et crée compensations'
    },
    'lat': {
        name: 'Lat Test',
        category: 'Mobilité Latissimus',
        swingFaults: ['Chicken Wing', 'Arms Disconnect', 'Over-the-top'],
        description: 'Lats rigides déconnectent les bras du corps'
    }
};

// Normes PRO dynamiques selon le sexe
function getProNorms(gender) {
    if (gender === 'F') {
        // LPGA Tour - TrackMan 2023: Driver moyen = 96 mph
        return {
            force: 16,         // LPGA niveau pro
            explosivite: 17,   
            mobilite: 18,      
            core: 17,          
            endurance: 16,     
            vitesse: 17,       
            equilibre: 17
        };
    } else {
        // PGA Tour - TrackMan 2023: Driver moyen = 115 mph
        return {
            force: 18,
            explosivite: 19,
            mobilite: 19,
            core: 18,
            endurance: 17,
            vitesse: 19,
            equilibre: 18
        };
    }
}

console.log('📊 Normes PRO calculées dynamiquement selon sexe');

// Corrélations physique ↔ golf
const PHYSICAL_GOLF_CORRELATIONS = {
    force: { impact: 'Distance au drive', description: 'La force des jambes et du tronc est directement corrélée à la vitesse de swing' },
    explosivite: { impact: 'Vitesse de tête de club', description: 'La puissance explosive permet un transfert d\'énergie optimal' },
    mobilite: { impact: 'Amplitude de swing', description: 'Une bonne mobilité thoracique et des hanches permet un backswing complet' },
    core: { impact: 'Stabilité et consistance', description: 'Un core solide assure la transmission de force et réduit les compensations' },
    vitesse: { impact: 'Explosivité du mouvement', description: 'La vitesse de déplacement se transfère dans la vitesse de swing' },
    endurance: { impact: 'Performance sur 18 trous', description: 'L\'endurance musculaire maintient la performance tout au long du parcours' },
    equilibre: { impact: 'Contrôle et précision', description: 'L\'équilibre améliore la précision et réduit les erreurs' }
};

// Fonction principale appelée quand on clique sur l'onglet Analyse Pro
function updateAnalysePro() {
    console.log('🎯 Mise à jour onglet Analyse Pro');
    
    if (!currentPlayer) {
        document.querySelector('.analyse-container').innerHTML = '<p class="help-text" style="text-align: center; padding: 3rem;">Veuillez d\'abord créer un profil joueur.</p>';
        return;
    }
    
    // Calculer et afficher le GFI
    calculateAndDisplayGFI();
    
    // Calculer et afficher le Score TPI
    calculateAndDisplayTPIScore();
    
    // Afficher le radar comparatif
    displayProComparison();
    
    // Afficher le top 3 des faiblesses
    displayTop3Weaknesses();
    
    // Charger les données golf
    loadGolfPerformanceData();
    
    // Générer les alertes
    generateSmartAlerts();
    
    // Analyser l'impact physique sur le swing
    analyseImpactPhysiqueSwing();
    
    // Setup event listeners
    setupAnalyseProEventListeners();
}

function calculateAndDisplayGFI() {
    const scores = calculateQualityScores();
    if (!scores) {
        document.getElementById('gfiScore').textContent = '--';
        document.getElementById('gfiLevel').textContent = 'Aucune donnée';
        return;
    }
    
    // Calculer le GFI pondéré
    let gfi = 0;
    gfi += (scores.force || 0) * GFI_WEIGHTS.force;
    gfi += (scores.explosivite || 0) * GFI_WEIGHTS.explosivite;
    gfi += (scores.mobilite || 0) * GFI_WEIGHTS.mobilite;
    gfi += (scores.core || 0) * GFI_WEIGHTS.core;
    gfi += (scores.endurance || 0) * GFI_WEIGHTS.endurance;
    gfi += (scores.vitesse || 0) * GFI_WEIGHTS.vitesse;
    gfi += (scores.equilibre || 0) * GFI_WEIGHTS.equilibre;
    
    // Convertir en score sur 100
    const gfiScore = Math.round((gfi / 20) * 100);
    
    // Déterminer le niveau
    let level = '', color = '';
    if (gfiScore >= 85) { level = 'Élite / Pro Tour'; color = '#1a4d2e'; }
    else if (gfiScore >= 70) { level = 'Très Bon Niveau'; color = '#27ae60'; }
    else if (gfiScore >= 55) { level = 'Bon Niveau Amateur'; color = '#f39c12'; }
    else { level = 'En Développement'; color = '#e74c3c'; }
    
    document.getElementById('gfiScore').textContent = gfiScore;
    document.getElementById('gfiScore').style.color = color;
    document.getElementById('gfiLevel').textContent = level;
    document.getElementById('gfiLevel').style.color = color;
    
    drawGFIGauge(gfiScore, color);
}

function calculateAndDisplayTPIScore() {
    // Récupérer les données TPI depuis testsHistory
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Filtrer pour récupérer le dernier test TPI
    const tpiTests = history
        .filter(h => h.quality === 'tpi')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (tpiTests.length === 0) {
        // Aucun test TPI enregistré
        document.getElementById('tpiPercentage').textContent = '--';
        document.getElementById('tpiFraction').textContent = '0 / 16 tests';
        document.getElementById('tpiLevel').textContent = 'Aucun test TPI';
        document.getElementById('tpiLevel').style.color = '#95a5a6';
        document.getElementById('tpiProgressBar').style.width = '0%';
        document.getElementById('tpiProgressText').textContent = '0%';
        document.getElementById('tpiPassCount').textContent = '0';
        document.getElementById('tpiFailCount').textContent = '0';
        document.getElementById('tpiAsymCount').textContent = '0';
        console.log('🏌️ Aucun test TPI enregistré');
        return;
    }
    
    // Prendre le test TPI le plus récent
    const latestTPITest = tpiTests[0];
    const tpiData = latestTPITest.tests;
    
    console.log('🏌️ Données TPI les plus récentes:', tpiData);
    console.log('🏌️ Clés disponibles:', Object.keys(tpiData));
    
    // Liste de tous les tests TPI avec leurs clés EXACTES du testsHistory
    const allTests = [
        'pelvic-tilt',
        'pelvic-rotation',
        'torso-rotation',
        'lower-lat',
        'trunk-rotation',
        'bridge',
        'overhead-squat',
        'toe-touch',
        '9090',
        'single-leg',
        'cervical-rotation',
        'forearm-rotation',
        'wrist-hinge',
        'wrist-flex',
        'shoulder',
        'lat'
    ];
    
    let passCount = 0;
    let failCount = 0;
    let asymmetryCount = 0;
    let totalTests = 0;
    
    // Tests bilatéraux (doivent passer des 2 côtés)
    const bilateralTests = ['lower-lat', 'trunk-rotation', 'single-leg', 'cervical-rotation', 'forearm-rotation', 'wrist-hinge', 'wrist-flex'];
    
    allTests.forEach(testKey => {
        if (bilateralTests.includes(testKey)) {
            // Test bilatéral
            const testData = tpiData[testKey];
            
            if (testData && typeof testData === 'object') {
                const leftVal = testData.left;
                const rightVal = testData.right;
                
                console.log(`  Test ${testKey}: gauche=${leftVal}, droite=${rightVal}`);
                
                if (leftVal || rightVal) {
                    totalTests++;
                    
                    // Pass seulement si les 2 côtés passent
                    if (leftVal === 'pass' && rightVal === 'pass') {
                        passCount++;
                    } else if (leftVal === 'fail' || rightVal === 'fail') {
                        failCount++;
                        
                        // Détecter asymétrie (un seul côté fail)
                        if ((leftVal === 'pass' && rightVal === 'fail') || (leftVal === 'fail' && rightVal === 'pass')) {
                            asymmetryCount++;
                        }
                    }
                }
            }
        } else {
            // Test unilatéral
            const val = tpiData[testKey];
            
            if (val && val !== '') {
                totalTests++;
                console.log(`  Test ${testKey}: ${val}`);
                if (val === 'pass') passCount++;
                else if (val === 'fail') failCount++;
            }
        }
    });
    
    // Calculer le pourcentage (sur 16 tests max)
    const percentage = totalTests > 0 ? Math.round((passCount / 16) * 100) : 0;
    
    // Déterminer le niveau
    let level = '', color = '';
    if (percentage >= 90) { level = '✅ Excellent'; color = '#27ae60'; }
    else if (percentage >= 75) { level = '👍 Bon'; color = '#2ecc71'; }
    else if (percentage >= 60) { level = '⚠️ Moyen'; color = '#f39c12'; }
    else if (percentage > 0) { level = '🚨 Critique'; color = '#e74c3c'; }
    else { level = 'Aucune donnée'; color = '#95a5a6'; }
    
    // Afficher les résultats
    document.getElementById('tpiPercentage').textContent = totalTests > 0 ? percentage + '%' : '--';
    document.getElementById('tpiPercentage').style.color = color;
    document.getElementById('tpiFraction').textContent = `${passCount} / 16 tests`;
    document.getElementById('tpiLevel').textContent = level;
    document.getElementById('tpiLevel').style.color = color;
    
    document.getElementById('tpiProgressBar').style.width = percentage + '%';
    document.getElementById('tpiProgressText').textContent = percentage + '%';
    document.getElementById('tpiProgressText').style.color = color;
    
    document.getElementById('tpiPassCount').textContent = passCount;
    document.getElementById('tpiFailCount').textContent = failCount;
    document.getElementById('tpiAsymCount').textContent = asymmetryCount;
    
    // Dessiner le graphique circulaire
    drawTPIDonutChart(passCount, failCount, 16 - totalTests, color);
    
    console.log(`📊 Score TPI FINAL: ${passCount}/16 (${percentage}%) - ${totalTests} tests faits, ${failCount} fails, ${asymmetryCount} asymétries`);
    
    // Afficher le résumé par catégorie
    displayTPICategorySummary(tpiData);
}

function drawTPIDonutChart(passCount, failCount, notDone, color) {
    const canvas = document.getElementById('tpiDonutChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 85;
    const innerRadius = 60;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const total = 16;
    const angles = [
        { value: passCount, color: '#27ae60', label: 'Pass' },
        { value: failCount, color: '#e74c3c', label: 'Fail' },
        { value: notDone, color: '#e0e0e0', label: 'Non fait' }
    ];
    
    let currentAngle = -Math.PI / 2; // Commence en haut
    
    angles.forEach(segment => {
        if (segment.value > 0) {
            const sliceAngle = (segment.value / total) * 2 * Math.PI;
            
            // Arc extérieur
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            
            // Bordure
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            currentAngle += sliceAngle;
        }
    });
    
    // Cercle central blanc
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function displayTPICategorySummary(tpiData) {
    const container = document.getElementById('tpiCategorySummary');
    if (!container) return;
    
    // Définir les catégories TPI avec leurs tests
    const categories = [
        {
            name: 'Mobilité Bassin',
            icon: '🦴',
            tests: ['pelvic-tilt', 'pelvic-rotation']
        },
        {
            name: 'Mobilité Tronc',
            icon: '🔄',
            tests: ['torso-rotation', 'trunk-rotation']
        },
        {
            name: 'Core & Stabilité',
            icon: '💪',
            tests: ['bridge']
        },
        {
            name: 'Mobilité Globale',
            icon: '🧘',
            tests: ['overhead-squat', 'toe-touch', '9090']
        },
        {
            name: 'Équilibre',
            icon: '⚖️',
            tests: ['single-leg']
        },
        {
            name: 'Mobilité Cervicale',
            icon: '👤',
            tests: ['cervical-rotation']
        },
        {
            name: 'Mobilité Bras/Mains',
            icon: '🤲',
            tests: ['forearm-rotation', 'wrist-hinge', 'wrist-flex']
        },
        {
            name: 'Mobilité Épaule',
            icon: '💪',
            tests: ['shoulder', 'lat', 'lower-lat']
        }
    ];
    
    const bilateralTests = ['trunk-rotation', 'single-leg', 'cervical-rotation', 'forearm-rotation', 'wrist-hinge', 'wrist-flex', 'lower-lat'];
    
    let html = '';
    
    categories.forEach(category => {
        let passCount = 0;
        let totalCount = category.tests.length;
        
        category.tests.forEach(testKey => {
            if (bilateralTests.includes(testKey)) {
                const testData = tpiData[testKey];
                if (testData && typeof testData === 'object') {
                    if (testData.left === 'pass' && testData.right === 'pass') {
                        passCount++;
                    }
                }
            } else {
                if (tpiData[testKey] === 'pass') {
                    passCount++;
                }
            }
        });
        
        const percentage = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;
        
        // Déterminer la classe CSS selon le pourcentage
        let className = '';
        if (percentage >= 90) className = 'excellent';
        else if (percentage >= 70) className = 'good';
        else if (percentage >= 50) className = 'average';
        else className = 'poor';
        
        // Icône de statut
        let statusIcon = '';
        if (percentage >= 90) statusIcon = '✅';
        else if (percentage >= 70) statusIcon = '👍';
        else if (percentage >= 50) statusIcon = '⚠️';
        else statusIcon = '🚨';
        
        html += `
            <div class="category-item ${className}">
                <div class="category-header">
                    <span class="category-name">${category.icon} ${category.name}</span>
                    <span class="category-icon">${statusIcon}</span>
                </div>
                <div class="category-score">${passCount} / ${totalCount}</div>
                <div class="category-tests">${percentage}% réussi</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function drawGFIGauge(score, color) {
    const canvas = document.getElementById('gfiGauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height - 10;
    const radius = 90;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Arc de fond
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();
    
    // Arc de progression
    const endAngle = Math.PI + (Math.PI * (score / 100));
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, endAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Graduations
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('0', 20, centerY + 5);
    ctx.fillText('50', centerX, centerY - radius - 10);
    ctx.fillText('100', canvas.width - 20, centerY + 5);
}

function displayProComparison() {
    const canvas = document.getElementById('proRadarChart');
    if (!canvas) return;
    
    const scores = calculateQualityScores();
    if (!scores) return;
    
    // DEBUG: Afficher les scores dans la console
    console.log('📊 Scores calculés pour le radar:', scores);
    
    // Récupérer les normes selon le sexe du joueur
    const gender = currentPlayer ? currentPlayer.gender : 'M';
    const proNorms = getProNorms(gender);
    
    const categories = ['Force', 'Explosivité', 'Mobilité', 'Core', 'Endurance', 'Vitesse', 'Équilibre'];
    
    // IMPORTANT: Garder les null pour que les "?" s'affichent !
    const playerData = [
        scores.force !== null ? scores.force : null,
        scores.explosivite !== null ? scores.explosivite : null,
        scores.mobilite !== null ? scores.mobilite : null,
        scores.core !== null ? scores.core : null,
        scores.endurance !== null ? scores.endurance : null,
        scores.vitesse !== null ? scores.vitesse : null,
        scores.equilibre !== null ? scores.equilibre : null
    ];
    
    // DEBUG: Afficher playerData
    console.log('📊 playerData pour le radar:', playerData);
    console.log('   - Core:', scores.core, '← devrait être null si < 3 tests');
    console.log('   - Endurance:', scores.endurance, '← devrait être null si < 2 tests');
    
    const proData = [
        proNorms.force,
        proNorms.explosivite,
        proNorms.mobilite,
        proNorms.core,
        proNorms.endurance,
        proNorms.vitesse,
        proNorms.equilibre
    ];
    
    drawRadarChart(canvas, categories, playerData, proData);
}

function drawRadarChart(canvas, labels, playerData, proData) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;
    const numSides = labels.length;
    
    ctx.clearRect(0, 0, width, height);
    
    // Cercles concentriques
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        const r = (radius / 4) * i;
        for (let j = 0; j <= numSides; j++) {
            const angle = (Math.PI / 2) + (2 * Math.PI * j) / numSides;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#ccc';
    for (let i = 0; i < numSides; i++) {
        const angle = (Math.PI / 2) + (2 * Math.PI * i) / numSides;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
        ctx.stroke();
    }
    
    // Labels
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < numSides; i++) {
        const angle = (Math.PI / 2) + (2 * Math.PI * i) / numSides;
        const labelRadius = radius + 30;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        ctx.fillText(labels[i], x, y);
    }
    
    // Données PRO (rouge vif)
    ctx.beginPath();
    for (let i = 0; i <= numSides; i++) {
        const idx = i % numSides;
        const value = proData[idx];
        const angle = (Math.PI / 2) + (2 * Math.PI * i) / numSides;
        const r = (radius / 20) * value;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 87, 51, 0.15)';  // Rouge/orange transparent
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 87, 51, 0.9)';  // Rouge/orange vif
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Données joueur (bleu vif)
    ctx.beginPath();
    let hasData = false;
    for (let i = 0; i <= numSides; i++) {
        const idx = i % numSides;
        const value = playerData[idx] !== null && playerData[idx] !== undefined ? playerData[idx] : 0;
        if (value > 0) hasData = true;
        const angle = (Math.PI / 2) + (2 * Math.PI * i) / numSides;
        const r = (radius / 20) * value;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(33, 150, 243, 0.2)';  // Bleu transparent
    ctx.fill();
    ctx.strokeStyle = 'rgba(33, 150, 243, 1)';  // Bleu vif
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // AFFICHER LES "?" PAR-DESSUS TOUT (en dernier)
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < numSides; i++) {
        if (playerData[i] === null || playerData[i] === undefined) {
            const angle = (Math.PI / 2) + (2 * Math.PI * i) / numSides;
            const markRadius = radius * 0.4; // 40% du rayon
            const x = centerX + markRadius * Math.cos(angle);
            const y = centerY + markRadius * Math.sin(angle);
            
            // Cercle blanc avec bordure pour le faire ressortir
            ctx.strokeStyle = '#ff6b00';
            ctx.lineWidth = 3;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x, y, 18, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            
            // Le "?" orange vif et gros
            ctx.fillStyle = '#ff6b00';
            ctx.fillText('?', x, y);
        }
    }
}

function displayTop3Weaknesses() {
    const container = document.getElementById('top3Weaknesses');
    if (!container) return;
    
    const scores = calculateQualityScores();
    if (!scores) {
        container.innerHTML = '<p class="help-text">Aucune donnée disponible</p>';
        return;
    }
    
    const qualities = [
        { name: 'Force', key: 'force', score: scores.force || 0 },
        { name: 'Explosivité', key: 'explosivite', score: scores.explosivite || 0 },
        { name: 'Mobilité', key: 'mobilite', score: scores.mobilite || 0 },
        { name: 'Core', key: 'core', score: scores.core || 0 },
        { name: 'Endurance', key: 'endurance', score: scores.endurance || 0 },
        { name: 'Vitesse', key: 'vitesse', score: scores.vitesse || 0 },
        { name: 'Équilibre', key: 'equilibre', score: scores.equilibre || 0 }
    ];
    
    qualities.sort((a, b) => a.score - b.score);
    const top3 = qualities.slice(0, 3);
    
    let html = '';
    top3.forEach((quality, index) => {
        const correlation = PHYSICAL_GOLF_CORRELATIONS[quality.key];
        const isCritical = quality.score < 10;
        
        html += `
            <div class="weakness-item ${isCritical ? 'critical' : ''}">
                <h5>${index + 1}. ${quality.name}</h5>
                <div class="score">${quality.score.toFixed(1)} / 20</div>
                <div class="impact">
                    <strong>Impact sur le golf:</strong> ${correlation.impact}
                    <br>
                    <small>${correlation.description}</small>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadGolfPerformanceData() {
    const golfData = JSON.parse(localStorage.getItem('golfPerformanceData') || '{}');
    
    ['driverSpeed', 'driverDistance', 'fairwayAccuracy', 'greenAccuracy'].forEach(key => {
        const el = document.getElementById(key);
        if (el && golfData[key]) el.value = golfData[key];
    });
    
    if (Object.keys(golfData).length > 0) {
        displayGolfCorrelations(golfData);
    }
}

function saveGolfPerformanceData() {
    const golfData = {
        driverSpeed: parseFloat(document.getElementById('driverSpeed').value) || null,
        driverDistance: parseFloat(document.getElementById('driverDistance').value) || null,
        fairwayAccuracy: parseFloat(document.getElementById('fairwayAccuracy').value) || null,
        greenAccuracy: parseFloat(document.getElementById('greenAccuracy').value) || null,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('golfPerformanceData', JSON.stringify(golfData));
    displayGolfCorrelations(golfData);
    alert('✅ Données golf enregistrées !');
}

function displayGolfCorrelations(golfData) {
    const container = document.getElementById('golfCorrelations');
    if (!container) return;
    
    const scores = calculateQualityScores();
    if (!scores) {
        container.innerHTML = '<p class="help-text">Enregistrez des tests physiques pour voir les corrélations.</p>';
        return;
    }
    
    // Charger automatiquement les dernières données golf si non fournies
    if (!golfData || !golfData.driverSpeed) {
        const currentGolfTest = JSON.parse(localStorage.getItem('currentGolfTest') || 'null');
        if (currentGolfTest && currentGolfTest.vmaxDriver) {
            golfData = {
                driverSpeed: currentGolfTest.vmaxDriver,
                ballSpeed: currentGolfTest.ballSpeed,
                smashFactor: currentGolfTest.smashFactor,
                distance: currentGolfTest.distance
            };
        } else {
            container.innerHTML = `
                <div style="background: #fff3e0; padding: 1.5rem; border-radius: 6px; border-left: 4px solid #f39c12;">
                    <strong>⛳ Aucune donnée golf enregistrée</strong>
                    <p style="margin: 0.5rem 0 0 0;">
                        Allez dans l'onglet <strong>"⛳ Tests Golf"</strong> pour enregistrer votre VMax driver.
                    </p>
                </div>
            `;
            return;
        }
    }
    
    let html = '<h5 style="margin: 1.5rem 0 1rem 0;">📊 Corrélations Physique ↔ Golf (Basées sur la Science)</h5>';
    
    // Afficher date dernière mesure
    const currentGolfTest = JSON.parse(localStorage.getItem('currentGolfTest') || 'null');
    if (currentGolfTest && currentGolfTest.date) {
        const testDate = new Date(currentGolfTest.date);
        html += `<p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
            <em>Dernière mesure : ${testDate.toLocaleDateString('fr-FR')}</em>
        </p>`;
    }
    
    // ========== VITESSE DRIVER ==========
    if (golfData.driverSpeed) {
        const gender = currentPlayer ? currentPlayer.gender : 'M';
        const ageRange = currentPlayer ? currentPlayer.age : '25-40';
        const handicap = currentPlayer ? (currentPlayer.handicap || 10) : 10;
        
        // Convertir tranche d'âge en âge numérique (milieu de la tranche)
        let age = 25;
        if (ageRange === '<12') age = 10;
        else if (ageRange === '12-14') age = 13;
        else if (ageRange === '14-16') age = 15;
        else if (ageRange === '17-25') age = 21;
        else if (ageRange === '25-40') age = 32;
        else if (ageRange === '40-50') age = 45;
        else if (ageRange === '50+') age = 55;
        
        // ========== ÉTAPE 1 : DÉTERMINER BASE RÉALISTE SELON NIVEAU ==========
        let baseSpeed;
        let levelDescription;
        
        if (gender === 'F') {
            // FEMMES - Basé sur données LPGA et amateures (VMax range, 30 ans, physique moyen)
            // Sources: Trackman 2024, LPGA Tour data
            if (handicap <= 0) {
                baseSpeed = 105; // Scratch F - VMax
                levelDescription = "Amateur Elite Femme";
            } else if (handicap <= 5) {
                baseSpeed = 95; // HCP 0-5 - VMax
                levelDescription = "Très Bonne Amateure";
            } else if (handicap <= 10) {
                baseSpeed = 88; // HCP 5-10 - VMax
                levelDescription = "Bonne Amateure";
            } else if (handicap <= 15) {
                baseSpeed = 82; // HCP 10-15 - VMax
                levelDescription = "Amateure Solide";
            } else {
                baseSpeed = 76; // HCP 15+ - VMax
                levelDescription = "Amateure en Progression";
            }
        } else {
            // HOMMES - Basé sur données PGA Tour et amateurs (VMax range, 30 ans, physique moyen)
            // Sources: Trackman 2024, Par4Success, TPI
            // Note: VMax = vitesse maximale range (driver+balle), pas vitesse compétition
            if (handicap <= 0) {
                baseSpeed = 113; // Scratch M - VMax amateur elite
                levelDescription = "Amateur Elite";
            } else if (handicap <= 5) {
                baseSpeed = 108; // HCP 0-5 - VMax
                levelDescription = "Très Bon Amateur";
            } else if (handicap <= 10) {
                baseSpeed = 103; // HCP 5-10 - VMax
                levelDescription = "Bon Amateur";
            } else if (handicap <= 15) {
                baseSpeed = 98; // HCP 10-15 - VMax
                levelDescription = "Amateur Solide";
            } else {
                baseSpeed = 93; // HCP 15+ - VMax
                levelDescription = "Amateur en Progression";
            }
        }
        
        // ========== AJUSTEMENT ÂGE (Facteur adaptatif selon niveau physique) ==========
        // Source: Données réelles pros 40-60 ans (Harrington 53@126mph, Mickelson 54@115mph, Vijay 61@112mph)
        // DÉCLIN VARIE ÉNORMÉMENT SELON ENTRAÎNEMENT :
        // - Population générale : -0.8 à -1% par an après 30 ans
        // - Athlète entraîné : -0.3% par an
        // - Athlète élite : -0.2% par an (comme les pros qui s'entretiennent)
        
        const explosiviteScore = scores.explosivite || 10;
        const forceScore = scores.force || 10;
        
        // Détection niveau athlétique
        const isEliteAthlete = (explosiviteScore >= 16 && forceScore >= 16); // Quasi-pro
        const isTrainedAthlete = (explosiviteScore >= 14 && forceScore >= 14); // Très entraîné
        // Sinon = population générale
        
        let ageFactor = 1.0;
        if (age < 25) {
            // Jeunes pas encore au pic
            ageFactor = 0.95 + (age - 18) * 0.007; // Progression 18→25 ans
        } else if (age <= 30) {
            ageFactor = 1.0; // PEAK
        } else if (age <= 40) {
            // 30-40 ans : Déclin minimal si entraîné
            let declineRate;
            if (isEliteAthlete) {
                declineRate = 0.002; // -0.2% par an
            } else if (isTrainedAthlete) {
                declineRate = 0.003; // -0.3% par an
            } else {
                declineRate = 0.008; // -0.8% par an
            }
            ageFactor = 1.0 - ((age - 30) * declineRate);
        } else if (age <= 50) {
            // 40-50 ans
            let declineRate, factor40;
            if (isEliteAthlete) {
                factor40 = 0.98; // À 40 ans : -2% seulement
                declineRate = 0.002; // Continue -0.2% par an
            } else if (isTrainedAthlete) {
                factor40 = 0.97; // À 40 ans : -3%
                declineRate = 0.003; // Continue -0.3% par an
            } else {
                factor40 = 0.92; // À 40 ans : -8%
                declineRate = 0.01; // -1% par an
            }
            ageFactor = factor40 - ((age - 40) * declineRate);
        } else if (age <= 60) {
            // 50-60 ans : Déclin accélère légèrement
            let declineRate, factor50;
            if (isEliteAthlete) {
                factor50 = 0.96; // À 50 ans : -4%
                declineRate = 0.003; // -0.3% par an
            } else if (isTrainedAthlete) {
                factor50 = 0.94; // À 50 ans : -6%
                declineRate = 0.004; // -0.4% par an
            } else {
                factor50 = 0.82; // À 50 ans : -18%
                declineRate = 0.012; // -1.2% par an
            }
            ageFactor = factor50 - ((age - 50) * declineRate);
        } else {
            // 60+ ans
            let declineRate, factor60;
            if (isEliteAthlete) {
                factor60 = 0.93; // À 60 ans : -7% (voir Vijay Singh 61@112mph)
                declineRate = 0.004; // -0.4% par an
            } else if (isTrainedAthlete) {
                factor60 = 0.90; // À 60 ans : -10%
                declineRate = 0.005; // -0.5% par an
            } else {
                factor60 = 0.70; // À 60 ans : -30%
                declineRate = 0.008; // -0.8% par an
            }
            ageFactor = factor60 - ((age - 60) * declineRate);
        }
        
        // Appliquer facteur d'âge à la base
        baseSpeed = baseSpeed * ageFactor;
        
        // ========== ÉTAPE 2 : COEFFICIENTS SCIENTIFIQUES (Méta-analyses) ==========
        // Source: Sports Medicine 2024, JSCR 2024
        // Explosivité (CMJ, Med Ball): r = 0.78-0.82 (corrélation la plus forte)
        // Force jambes: r = 0.42-0.51
        
        // Contributions physiques calibrées sur données réelles
        // Explosivité : (score - 10) × 1.4 mph par point
        // Force : (score - 10) × 0.8 mph par point
        const explosiviteContribution = (explosiviteScore - 10) * 1.4;
        const forceContribution = (forceScore - 10) * 0.8;
        
        // VMax théorique (sans limitations)
        const vmaxTheorique = baseSpeed + explosiviteContribution + forceContribution;
        
        // ========== ÉTAPE 3 : LIMITATIONS PHYSIQUES ==========
        const limitationImpact = currentPlayer?.limitations?.impact || 0;
        
        // VMax actuelle (avec limitations)
        const vmaxActuelle = vmaxTheorique - limitationImpact;
        
        // ========== ÉTAPE 4 : VITESSE COMPÉTITION ==========
        // Écart VMax → Compétition selon niveau (Source: FitForGolf, Trackman)
        let ecartCompetition;
        if (handicap <= 0) {
            ecartCompetition = 7; // Scratch: -7 mph
        } else if (handicap <= 5) {
            ecartCompetition = 8; // HCP 0-5: -8 mph
        } else if (handicap <= 10) {
            ecartCompetition = 10; // HCP 5-10: -10 mph
        } else if (handicap <= 15) {
            ecartCompetition = 12; // HCP 10-15: -12 mph
        } else {
            ecartCompetition = 14; // HCP 15+: -14 mph
        }
        
        const vitesseCompetition = vmaxActuelle - ecartCompetition;
        
        const predictedSpeed = vmaxActuelle; // Pour compatibilité avec code existant
        const diff = golfData.driverSpeed - predictedSpeed;
        const percentDiff = (diff / golfData.driverSpeed) * 100;
        
        // ========== ÉTAPE 5 : POTENTIEL RÉALISTE (Littérature) ==========
        // Source: Fit For Golf, Journal of Strength & Conditioning Research
        // Gains réalistes: 3-10 mph sur 6-12 mois selon niveau initial
        
        const proNorms = getProNorms(gender);
        const explosiviteGap = Math.max(0, proNorms.explosivite - explosiviteScore);
        const forceGap = Math.max(0, proNorms.force - forceScore);
        
        // Potentiel court terme (3-6 mois) - Speed training seul
        const shortTermGain = Math.min(5, explosiviteGap * 0.4 + forceGap * 0.2);
        
        // Potentiel moyen terme (12-18 mois) - Force + Speed + Technique
        const mediumTermGain = Math.min(10, explosiviteGap * 0.8 + forceGap * 0.4);
        
        // Potentiel long terme (2-3 ans) - Programme complet
        const longTermGain = Math.min(15, explosiviteGap * 1.2 + forceGap * 0.7);
        
        // Maximum théorique selon niveau ET ÂGE (VMax)
        let maxTheoreticalSpeed;
        if (gender === 'F') {
            maxTheoreticalSpeed = handicap <= 0 ? 108 : handicap <= 5 ? 98 : handicap <= 10 ? 92 : 86;
        } else {
            maxTheoreticalSpeed = handicap <= 0 ? 125 : handicap <= 5 ? 118 : handicap <= 10 ? 112 : 106;
        }
        
        // Appliquer facteur d'âge au maximum théorique
        maxTheoreticalSpeed = maxTheoreticalSpeed * ageFactor;
        
        // ========== CONTEXTE PERFORMANCE ==========
        let performanceContext = '';
        if (gender === 'F') {
            if (golfData.driverSpeed >= 105) {
                performanceContext = '🏆 <strong>Niveau Elite Mondial LPGA</strong> (Top 3-5 LPGA)';
            } else if (golfData.driverSpeed >= 100) {
                performanceContext = '🌟 <strong>Niveau Elite Tour LPGA</strong> (Top 10-20 LPGA)';
            } else if (golfData.driverSpeed >= 96) {
                performanceContext = '✅ <strong>Niveau Moyenne LPGA Tour</strong> (Moyenne LPGA = 96 mph)';
            } else if (golfData.driverSpeed >= 90) {
                performanceContext = '📈 <strong>Bon niveau Pro Femmes</strong> (90-96 mph)';
            } else if (golfData.driverSpeed >= 85) {
                performanceContext = '💪 <strong>Très bonne amateure</strong> (HCP 0-5)';
            } else if (golfData.driverSpeed >= 80) {
                performanceContext = '👍 <strong>Bonne amateure</strong> (HCP 5-10)';
            } else if (golfData.driverSpeed >= 75) {
                performanceContext = '🎯 <strong>Amateure solide</strong> (HCP 10-15)';
            } else {
                performanceContext = '📚 <strong>Amateure en progression</strong> (HCP 15+)';
            }
        } else {
            if (golfData.driverSpeed >= 125) {
                performanceContext = '🏆 <strong>Niveau Elite Mondial</strong> (Top PGA - Bryson 125-128 mph)';
            } else if (golfData.driverSpeed >= 120) {
                performanceContext = '🌟 <strong>Niveau Elite Tour</strong> (Top 10-20 PGA - Rory 122-124 mph)';
            } else if (golfData.driverSpeed >= 115) {
                performanceContext = '✅ <strong>Niveau Moyenne PGA Tour</strong> (Moyenne PGA = 115 mph)';
            } else if (golfData.driverSpeed >= 110) {
                performanceContext = '📈 <strong>Bon niveau Tour Européen</strong> (110-115 mph)';
            } else if (golfData.driverSpeed >= 105) {
                performanceContext = '💪 <strong>Très bon amateur</strong> (HCP 0-5)';
            } else if (golfData.driverSpeed >= 100) {
                performanceContext = '👍 <strong>Bon amateur</strong> (HCP 5-10)';
            } else if (golfData.driverSpeed >= 95) {
                performanceContext = '🎯 <strong>Amateur solide</strong> (HCP 10-15)';
            } else {
                performanceContext = '📚 <strong>Amateur en progression</strong> (HCP 15+)';
            }
        }
        
        // ========== AFFICHAGE ==========
        html += `
            <div class="correlation-item">
                <h5>🏌️ Vitesse Driver: ${golfData.driverSpeed} mph</h5>
                
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    ${performanceContext}
                    <div style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">
                        📊 Votre niveau: ${levelDescription} (HCP ${handicap})
                    </div>
                </div>
                
                <!-- EXPLICATION VMAX vs JEU -->
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid #2196f3;">
                    <strong>📊 Vitesse Maximale (VMax) vs Vitesse en Jeu</strong>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #333;">
                        Les prédictions ci-dessous concernent votre <strong>VMax</strong> (vitesse maximale all-out au practice), 
                        pas votre vitesse moyenne en compétition.
                        <br><br>
                        <strong>Écart typique VMax ↔ Vitesse Jeu :</strong>
                        <ul style="margin: 0.5rem 0 0 1.2rem; line-height: 1.6;">
                            <li><strong>Pros PGA/LPGA :</strong> -5 à -7 mph (contrôle + précision)</li>
                            <li><strong>Amateurs :</strong> -8 à -12 mph (peur mishits + contrôle)</li>
                        </ul>
                        <small style="color: #666; font-style: italic;">
                            Source : FitForGolf (coach PGA Tour), Trackman University 2024
                        </small>
                    </div>
                </div>
                
                <!-- ANALYSE VMAX SIMPLE ET CLAIRE -->
                <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 2px solid #1a4d2e; margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <strong style="color: #666; font-size: 0.9rem;">VOTRE VMAX (range)</strong>
                            <div style="font-size: 2.5rem; color: #1a4d2e; font-weight: 700; margin: 0.3rem 0;">
                                ${golfData.driverSpeed} mph
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: #666; font-size: 0.9rem;">Vitesse jeu estimée</strong>
                            <div style="font-size: 1.5rem; color: #666; font-weight: 700; margin: 0.3rem 0;">
                                ${(golfData.driverSpeed - ecartCompetition).toFixed(0)} mph
                            </div>
                            <small style="color: #999;">(-${ecartCompetition} mph)</small>
                        </div>
                    </div>
                </div>
                
                <!-- NORMES ET POSITIONNEMENT -->
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
                    <strong style="font-size: 1.1rem;">📊 Positionnement vs Normes</strong>
                    <div style="margin-top: 1rem;">
                        ${performanceContext}
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
                            <strong>Normes ${gender === 'M' ? 'Homme' : 'Femme'} ${age} ans, HCP ${handicap} :</strong>
                            <div style="margin-top: 0.5rem; color: #666;">
                                VMax range : <strong>${(baseSpeed * 0.92).toFixed(0)} - ${(baseSpeed * 1.08).toFixed(0)} mph</strong> (±8% autour moyenne)
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- MARGE DE PROGRESSION RÉALISTE -->
                <div style="background: #fff3e0; padding: 1.5rem; border-radius: 6px; margin: 1rem 0; border-left: 4px solid #f39c12;">
                    <strong style="font-size: 1.1rem;">🎯 Marge de Progression Réaliste</strong>
                    <div style="margin-top: 1rem; color: #333;">
                        <div style="margin-bottom: 0.8rem;">
                            <strong>Court terme (3-6 mois)</strong> - Speed training
                            <div style="margin-left: 1rem; color: #666; font-size: 0.95rem;">
                                +3 à +5 mph → ${(golfData.driverSpeed + 4).toFixed(0)} mph VMax
                                <br><small>SuperSpeed/Stack 2-3x/semaine</small>
                            </div>
                        </div>
                        <div style="margin-bottom: 0.8rem;">
                            <strong>Moyen terme (12-18 mois)</strong> - Force + Speed
                            <div style="margin-left: 1rem; color: #666; font-size: 0.95rem;">
                                +6 à +10 mph → ${(golfData.driverSpeed + 8).toFixed(0)} mph VMax
                                <br><small>Programme complet : Gym 3x/sem + Speed 2x/sem</small>
                            </div>
                        </div>
                        ${(baseSpeed * ageFactor * 1.15) - golfData.driverSpeed > 10 ? `
                        <div>
                            <strong>Long terme (2-3 ans)</strong> - Programme élite
                            <div style="margin-left: 1rem; color: #666; font-size: 0.95rem;">
                                +12 à +15 mph → ${(golfData.driverSpeed + 13).toFixed(0)} mph VMax
                                <br><small>Entraînement type Tour : Force, Explosivité, Speed, Technique</small>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 4px; font-size: 0.9rem;">
                        <strong>📌 Maximum réaliste à ${age} ans :</strong> ${(baseSpeed * ageFactor * 1.15).toFixed(0)} mph
                        <br><small style="color: #666;">Basé sur profil physique optimal pour votre âge</small>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 6px;">
                    <strong>💡 Contributions physiques (Corrélations Scientifiques):</strong>
                    <div style="margin-top: 1rem;">
                        ${createScientificContributionBar('Explosivité', explosiviteScore, explosiviteContribution, 10, 0.82)}
                        ${createScientificContributionBar('Force Jambes', forceScore, forceContribution, 5.5, 0.46)}
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #666;">
                        <em>Coefficients basés sur méta-analyses (Sports Medicine 2024)</em>
                    </div>
                </div>
                
                ${(shortTermGain > 1 || mediumTermGain > 1 || longTermGain > 1) ? `
                    <div style="background: #fff3e0; padding: 1.5rem; border-radius: 6px; margin-top: 1rem; border-left: 4px solid #f39c12;">
                        <strong>🎯 Potentiel d'Amélioration RÉALISTE</strong>
                        <div style="margin-top: 1rem; font-size: 0.95rem;">
                            ${shortTermGain > 1 ? `
                                <div style="margin-bottom: 0.8rem;">
                                    <strong style="color: #f39c12;">Court terme (3-6 mois)</strong> - Speed training
                                    <div style="margin-left: 1rem; color: #666;">
                                        +${shortTermGain.toFixed(1)} mph → ${(golfData.driverSpeed + shortTermGain).toFixed(0)} mph
                                        <br><small>Speed training 2-3x/semaine (SuperSpeed, Stack, driver swings max)</small>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${mediumTermGain > shortTermGain + 1 ? `
                                <div style="margin-bottom: 0.8rem;">
                                    <strong style="color: #f39c12;">Moyen terme (12-18 mois)</strong> - Force + Speed + Technique
                                    <div style="margin-left: 1rem; color: #666;">
                                        +${mediumTermGain.toFixed(1)} mph → ${(golfData.driverSpeed + mediumTermGain).toFixed(0)} mph
                                        <br><small>Programme complet : Gym 3x/sem + Speed 2x/sem + Coaching technique</small>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${longTermGain > mediumTermGain + 1 ? `
                                <div>
                                    <strong style="color: #f39c12;">Long terme (2-3 ans)</strong> - Programme Pro
                                    <div style="margin-left: 1rem; color: #666;">
                                        +${longTermGain.toFixed(1)} mph → ${(golfData.driverSpeed + longTermGain).toFixed(0)} mph
                                        <br><small>Entraînement type Tour : Force, Explosivité, Speed, Mobilité, Technique</small>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div style="margin-top: 1rem; padding: 0.8rem; background: white; border-radius: 4px; font-size: 0.9rem;">
                            <strong>📌 Maximum théorique:</strong> ${maxTheoreticalSpeed} mph (niveau ${handicap <= 0 ? 'scratch-pro' : 'amateur optimisé'})
                            <br><small style="color: #666;">Chaque mph = ~2,5 yards de distance (Source: TrackMan)</small>
                        </div>
                    </div>
                ` : `
                    <div style="background: #e8f5e9; padding: 1rem; border-radius: 6px; margin-top: 1rem; border-left: 4px solid #27ae60;">
                        <strong>✅ Physique proche de l'optimal</strong><br>
                        <small>Votre développement physique est excellent pour votre niveau. Focus sur la technique et la consistance pour progresser.</small>
                    </div>
                `}
            </div>
        `;
    }
    
    // ========== DISTANCE DRIVER ==========
    if (golfData.driverDistance) {
        let smashAnalysis = '';
        if (golfData.driverSpeed) {
            const smashFactor = golfData.driverDistance / (golfData.driverSpeed * 2.4);
            smashAnalysis = `
                <div style="background: ${smashFactor > 0.95 ? '#e8f5e9' : '#fff3e0'}; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                    <strong>Efficacité de frappe: ${(smashFactor * 100).toFixed(0)}%</strong><br>
                    ${smashFactor > 0.95 ? 
                        '✅ Excellente efficacité ! Vous convertissez bien votre vitesse en distance.' :
                        '⚠️ Marge de progression: améliorer le contact et l\'angle d\'attaque pourrait ajouter ' + ((1 - smashFactor) * golfData.driverDistance).toFixed(0) + 'm.'
                    }
                </div>
            `;
        }
        
        const forceGap = Math.max(0, 18 - (scores.force || 0));
        const potentialGainDistance = forceGap * 10;
        
        html += `
            <div class="correlation-item">
                <h5>📏 Distance Driver: ${golfData.driverDistance} m</h5>
                
                <div style="margin: 1rem 0;">
                    <strong>Lien Force ↔ Distance</strong>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                        <div style="flex: 1;">
                            <div style="background: #e0e0e0; height: 30px; border-radius: 15px; overflow: hidden;">
                                <div style="background: linear-gradient(90deg, #1a4d2e, #27ae60); height: 100%; width: ${((scores.force || 0) / 20) * 100}%; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; color: white; font-weight: 700;">
                                    ${(scores.force || 0).toFixed(1)}/20
                                </div>
                            </div>
                        </div>
                        <div style="min-width: 100px; text-align: center; font-weight: 700; color: #1a4d2e;">
                            Force Jambes
                        </div>
                    </div>
                </div>
                
                ${smashAnalysis}
                
                ${potentialGainDistance > 10 ? `
                    <div style="background: #e3f2fd; padding: 1rem; border-radius: 6px; margin-top: 1rem; border-left: 4px solid #2196f3;">
                        <strong>🎯 Potentiel physique: +${potentialGainDistance.toFixed(0)}m</strong><br>
                        <small>En augmentant votre force de ${forceGap.toFixed(1)} points (objectif: 18/20), vous pourriez gagner environ ${potentialGainDistance.toFixed(0)}m.</small>
                        <div style="margin-top: 0.5rem; font-size: 0.9rem;">
                            💡 Exercices prioritaires: Squat, Deadlift, développement puissance hanches
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // ========== PRÉCISION ==========
    if (golfData.fairwayAccuracy || golfData.greenAccuracy) {
        const stabilityScore = ((scores.core || 0) + (scores.equilibre || 0)) / 2;
        const stabilityPercent = (stabilityScore / 20) * 100;
        
        const avgAccuracy = ((golfData.fairwayAccuracy || 0) + (golfData.greenAccuracy || 0)) / 
                           ((golfData.fairwayAccuracy ? 1 : 0) + (golfData.greenAccuracy ? 1 : 0));
        
        let precisionAnalysis = '';
        if (avgAccuracy < 50) {
            precisionAnalysis = '⚠️ Précision en développement - Le renforcement du core et de l\'équilibre devrait améliorer la consistance.';
        } else if (avgAccuracy < 65) {
            precisionAnalysis = '📈 Bonne précision - Continuez à travailler la stabilité pour gagner en régularité.';
        } else {
            precisionAnalysis = '✅ Excellente précision - Votre stabilité physique supporte bien votre technique.';
        }
        
        const stabilityGap = Math.max(0, 18 - stabilityScore);
        
        html += `
            <div class="correlation-item">
                <h5>🎯 Précision & Stabilité</h5>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    ${golfData.fairwayAccuracy ? `
                        <div style="background: white; padding: 1rem; border-radius: 6px; text-align: center; border: 1px solid #e0e0e0;">
                            <div style="font-size: 0.9rem; color: #666;">Fairways</div>
                            <div style="font-size: 2rem; color: #1a4d2e; font-weight: 700;">${golfData.fairwayAccuracy}%</div>
                        </div>
                    ` : ''}
                    ${golfData.greenAccuracy ? `
                        <div style="background: white; padding: 1rem; border-radius: 6px; text-align: center; border: 1px solid #e0e0e0;">
                            <div style="font-size: 0.9rem; color: #666;">Greens</div>
                            <div style="font-size: 2rem; color: #1a4d2e; font-weight: 700;">${golfData.greenAccuracy}%</div>
                        </div>
                    ` : ''}
                </div>
                
                <div style="margin: 1rem 0;">
                    <strong>Score de Stabilité (Core + Équilibre)</strong>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                        <div style="flex: 1;">
                            <div style="background: #e0e0e0; height: 30px; border-radius: 15px; overflow: hidden;">
                                <div style="background: linear-gradient(90deg, #1a4d2e, #27ae60); height: 100%; width: ${stabilityPercent}%; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; color: white; font-weight: 700;">
                                    ${stabilityScore.toFixed(1)}/20
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="background: ${stabilityScore > 15 ? '#e8f5e9' : '#fff3e0'}; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
                    ${precisionAnalysis}
                </div>
                
                ${stabilityGap > 2 ? `
                    <div style="background: #e3f2fd; padding: 1rem; border-radius: 6px; margin-top: 1rem; border-left: 4px solid #2196f3;">
                        <strong>💡 Amélioration recommandée</strong><br>
                        <small>Core: ${(scores.core || 0).toFixed(1)}/20 | Équilibre: ${(scores.equilibre || 0).toFixed(1)}/20</small><br>
                        <div style="margin-top: 0.5rem; font-size: 0.9rem;">
                            Un gain de ${stabilityGap.toFixed(1)} points en stabilité devrait améliorer votre consistance de 5-10%.
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Message si aucune donnée
    if (!golfData.driverSpeed && !golfData.driverDistance && !golfData.fairwayAccuracy && !golfData.greenAccuracy) {
        html += `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <p>💡 Saisissez vos données golf ci-dessus pour voir les corrélations avec votre physique</p>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Fonction helper pour les barres de contribution
function createContributionBar(label, score, contribution, maxContribution) {
    const percent = (contribution / maxContribution) * 100;
    
    return `
        <div style="margin-bottom: 0.8rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem; font-size: 0.9rem;">
                <span><strong>${label}</strong> (${score.toFixed(1)}/20)</span>
                <span style="color: #1a4d2e; font-weight: 600;">+${contribution.toFixed(1)} mph</span>
            </div>
            <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #1a4d2e, #27ae60); height: 100%; width: ${percent}%; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
}

// Fonction avec corrélation scientifique affichée
function createScientificContributionBar(label, score, contribution, maxContribution, correlation) {
    const percent = (contribution / maxContribution) * 100;
    
    return `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem; font-size: 0.9rem;">
                <span><strong>${label}</strong> (${score.toFixed(1)}/20)</span>
                <span style="color: #1a4d2e; font-weight: 600;">+${contribution.toFixed(1)} mph <small style="color: #999;">(r=${correlation})</small></span>
            </div>
            <div style="background: #e0e0e0; height: 24px; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #1a4d2e, #27ae60); height: 100%; width: ${percent}%; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
}

// ==================== PHASE 2 : SIMPLIFICATION ANALYSE PRO ====================

// Basculer entre vues Synthèse/Détails
function switchAnalyseView(view) {
    // Mettre à jour les boutons
    document.querySelectorAll('.analyse-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Si appelé via événement, utiliser event.target, sinon trouver le bon bouton
    if (typeof event !== 'undefined' && event.target) {
        event.target.classList.add('active');
    } else {
        // Appel programmatique - trouver le bon bouton
        const targetBtn = view === 'synthese' 
            ? document.querySelector('.analyse-nav-btn:first-child')
            : document.querySelector('.analyse-nav-btn:last-child');
        if (targetBtn) targetBtn.classList.add('active');
    }
    
    // Afficher/masquer les vues
    if (view === 'synthese') {
        document.getElementById('analyseSynthese').style.display = 'block';
        document.getElementById('analyseDetails').style.display = 'none';
        
        // Générer le top 3-5 alertes urgentes
        generateTop3UrgentAlerts();
    } else {
        document.getElementById('analyseSynthese').style.display = 'none';
        document.getElementById('analyseDetails').style.display = 'block';
    }
}

// Générer Top 3-5 Alertes Urgentes (priorité 1 uniquement)
function generateTop3UrgentAlerts() {
    const container = document.getElementById('top3UrgentAlerts');
    if (!container) return;
    
    // Récupérer toutes les alertes de generateSmartAlerts
    const allAlerts = getAllSmartAlerts();
    
    // Filtrer priorité 1 uniquement et prendre top 5
    const urgentAlerts = allAlerts.filter(a => a.priority === 1).slice(0, 5);
    
    if (urgentAlerts.length === 0) {
        container.innerHTML = `
            <div class="alert-item alert-info">
                <div class="alert-icon">✅</div>
                <div class="alert-content">
                    <h5>Aucune alerte urgente</h5>
                    <p>Votre profil ne présente pas de limitation critique détectée.</p>
                </div>
            </div>
        `;
        return;
    }
    
    const iconMap = { critical: '🚨', warning: '⚠️', info: 'ℹ️' };
    
    let html = '';
    urgentAlerts.forEach(alert => {
        html += `
            <div class="alert-item alert-${alert.type}">
                <div class="alert-icon">${iconMap[alert.type]}</div>
                <div class="alert-content">
                    <h5>${alert.title}</h5>
                    <p>${alert.message}</p>
                    ${alert.action ? `
                        <div class="alert-action">
                            <strong>💪 Action recommandée:</strong> ${alert.action}
                        </div>
                    ` : ''}
                    ${alert.faults && alert.faults.length > 0 ? `
                        <div class="swing-fault">
                            <strong>Impacts potentiels:</strong>
                            <ul>
                                ${alert.faults.map(f => `<li>${f}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fonction helper : récupérer toutes les alertes (copie logique de generateSmartAlerts)
function getAllSmartAlerts() {
    const alerts = [];
    const scores = calculateQualityScores();
    
    // ========== ALERTES PHYSIQUES (Scores faibles) ==========
    if (scores && scores.mobilite !== null && scores.mobilite < 10) {
        alerts.push({
            priority: 1,
            type: 'critical',
            title: 'Mobilité Insuffisante',
            message: `Score mobilité: ${scores.mobilite.toFixed(1)}/20 (objectif: >14)`,
            action: 'Renforcer mobilité (étirements dynamiques, yoga golf)',
            faults: ['Perte d\'amplitude en backswing', 'Early extension', 'Sway']
        });
    }
    
    if (scores && scores.core !== null && scores.core < 10) {
        alerts.push({
            priority: 1,
            type: 'critical',
            title: 'Core À Améliorer',
            message: `Score Core: ${scores.core.toFixed(1)}/20 (objectif: >14)`,
            action: 'Renforcer core (planches, rotations, dead bugs)',
            faults: ['Early extension', 'Loss of posture', 'Slide']
        });
    }
    
    if (scores && scores.force !== null && scores.force < 10) {
        alerts.push({
            priority: 1,
            type: 'critical',
            title: 'Force Insuffisante',
            message: `Score Force: ${scores.force.toFixed(1)}/20 (objectif: >14)`,
            action: 'Programme force (squats, deadlifts, presses)',
            faults: ['Loss of distance', 'Faible vitesse de club']
        });
    }
    
    // ========== ASYMÉTRIES CRITIQUES >15% ==========
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const allTests = history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const bilateralTests = ['legext', 'press', 'hipflexor', 'singleleg'];
    
    bilateralTests.forEach(testKey => {
        const recentTest = allTests.find(t => t.tests && t.tests[testKey]);
        
        if (recentTest && recentTest.tests[testKey]) {
            const data = recentTest.tests[testKey];
            if (data && typeof data === 'object' && data.left !== undefined && data.right !== undefined) {
                const left = parseFloat(data.left);
                const right = parseFloat(data.right);
                
                if (!isNaN(left) && !isNaN(right) && left > 0 && right > 0) {
                    const asymmetry = Math.abs(((left - right) / Math.max(left, right)) * 100);
                    const weakerSide = left < right ? 'Gauche' : 'Droite';
                    
                    if (asymmetry > 15) {
                        alerts.push({
                            priority: 1,
                            type: 'critical',
                            title: `${testKey.toUpperCase()}: Asymétrie ${asymmetry.toFixed(1)}% (${weakerSide})`,
                            message: `Risque blessure élevé`,
                            action: `Renforcer côté ${weakerSide}`,
                            faults: ['Déséquilibre G/D', 'Compensation swing']
                        });
                    }
                }
            }
        }
    });
    
    // ========== DÉSÉQUILIBRES PUSH/PULL & ISCHIO/QUAD ==========
    const forceTests = allTests.filter(t => t.quality === 'force').sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (forceTests.length > 0) {
        const latestForceTest = forceTests[0];
        const forceData = latestForceTest.tests;
        
        // Push/Pull
        let benchValue = null;
        if (forceData.bench) {
            benchValue = typeof forceData.bench === 'object' 
                ? (parseFloat(forceData.bench.left || 0) + parseFloat(forceData.bench.right || 0)) / 2 
                : parseFloat(forceData.bench);
        }
        
        let pullupValue = null;
        if (forceData.pullup) {
            pullupValue = typeof forceData.pullup === 'object' 
                ? (parseFloat(forceData.pullup.left || 0) + parseFloat(forceData.pullup.right || 0)) / 2 
                : parseFloat(forceData.pullup);
        }
        
        if (benchValue && pullupValue && benchValue > 0 && pullupValue > 0) {
            const ratio = pullupValue / benchValue;
            if (ratio < 0.6) {
                alerts.push({
                    priority: 1,
                    type: 'critical',
                    title: `Déséquilibre Chaîne Antérieure/Postérieure Critique`,
                    message: `Ratio Pull/Push = ${(ratio * 100).toFixed(0)}% (Normal: 80-100%)`,
                    action: 'Renforcer chaîne postérieure (dorsaux, trapèzes)',
                    faults: ['Épaules enroulées', 'Posture voutée', 'Risque tendinite']
                });
            }
        }
        
        // Ischio/Quad
        let squatValue = null;
        if (forceData.squat) {
            squatValue = typeof forceData.squat === 'object' 
                ? (parseFloat(forceData.squat.left || 0) + parseFloat(forceData.squat.right || 0)) / 2 
                : parseFloat(forceData.squat);
        }
        
        let deadliftValue = null;
        if (forceData.deadlift) {
            deadliftValue = typeof forceData.deadlift === 'object' 
                ? (parseFloat(forceData.deadlift.left || 0) + parseFloat(forceData.deadlift.right || 0)) / 2 
                : parseFloat(forceData.deadlift);
        }
        
        if (squatValue && deadliftValue && squatValue > 0 && deadliftValue > 0) {
            const ratio = deadliftValue / squatValue;
            if (ratio < 0.6) {
                alerts.push({
                    priority: 1,
                    type: 'critical',
                    title: `Déséquilibre Ischio-jambiers/Quadriceps Critique`,
                    message: `Ratio H/Q = ${(ratio * 100).toFixed(0)}% (Normal: 75-100%)`,
                    action: 'Renforcer ischio-jambiers (deadlifts, nordics, leg curls)',
                    faults: ['Risque blessure genou', 'Instabilité ACL', 'Risque élongation']
                });
            }
        }
    }
    
    return alerts;
}

// Exposer globalement
window.switchAnalyseView = switchAnalyseView;

// ==================== IMPACT PHYSIQUE SUR LE SWING ====================

function analyseImpactPhysiqueSwing() {
    const container = document.getElementById('impactPhysiqueSwing');
    if (!container) return;
    
    const scores = calculateQualityScores();
    const currentTests = JSON.parse(localStorage.getItem('currentTests') || '{}');
    
    let impacts = [];
    
    // ========== 1. ASYMÉTRIES & COMPENSATION ==========
    const asymmetries = detectAsymmetries();
    
    asymmetries.forEach(asym => {
        if (asym.lsi < 90) {
            let impact = {
                priority: 1,
                category: 'Asymétrie',
                title: `Déséquilibre ${asym.name}`,
                description: `${asym.weakerSide === 'G' ? 'Gauche' : 'Droite'} plus faible (${asym.lsi.toFixed(0)}% du côté fort)`,
                consequences: [],
                action: `Renforcement unilatéral côté ${asym.weakerSide === 'G' ? 'gauche' : 'droit'}`
            };
            
            // Conséquences selon le type d'asymétrie
            if (asym.name.includes('CMJ') || asym.name.includes('Wall Sit')) {
                impact.consequences.push('⚠️ Tendance à surcompenser côté fort → Risque slice/hook');
                impact.consequences.push('📉 Transfert poids incomplet → Perte 5-8% vitesse');
            }
            
            if (asym.name.includes('Hip Rotation')) {
                impact.consequences.push('⚠️ Compensation par rotation thoracique excessive');
                impact.consequences.push('🔴 Risque douleurs lombaires à l\'impact');
                impact.consequences.push('📉 Perte puissance estimée : 8-12%');
            }
            
            if (asym.name.includes('Thoracique')) {
                impact.consequences.push('⚠️ Backswing limité d\'un côté');
                impact.consequences.push('⚠️ Plan de swing altéré');
            }
            
            if (asym.name.includes('Dorsiflexion') || asym.name.includes('ankle')) {
                impact.consequences.push('⚠️ Transfert poids incomplet');
                impact.consequences.push('📉 Perte distance estimée : -5 à -8 mètres');
            }
            
            if (asym.name.includes('Side Plank')) {
                impact.consequences.push('⚠️ Instabilité latérale durant le swing');
                impact.consequences.push('🎯 Impact sur précision (side bend excessif)');
            }
            
            impacts.push(impact);
        }
    });
    
    // ========== 2. RATIOS MUSCULAIRES ==========
    
    // Push/Pull Ratio
    const pushTests = ['bench'];
    const pullTests = ['pullup'];
    
    let pushScore = 0, pullScore = 0, pushCount = 0, pullCount = 0;
    
    pushTests.forEach(test => {
        if (currentTests.force && currentTests.force[test] != null) {
            pushScore += calculateScore20(test, currentTests.force[test]);
            pushCount++;
        }
    });
    
    pullTests.forEach(test => {
        if (currentTests.force && currentTests.force[test] != null) {
            pullScore += calculateScore20(test, currentTests.force[test]);
            pullCount++;
        }
    });
    
    if (pushCount > 0 && pullCount > 0) {
        const avgPush = pushScore / pushCount;
        const avgPull = pullScore / pullCount;
        const pushPullRatio = avgPull / avgPush;
        
        if (pushPullRatio < 0.7) {
            impacts.push({
                priority: 1,
                category: 'Déséquilibre Musculaire',
                title: 'Ratio Push/Pull Déséquilibré',
                description: `Ratio actuel: ${(pushPullRatio * 100).toFixed(0)}% (optimal: 80-100%)`,
                consequences: [
                    '⚠️ Déséquilibre antéro-postérieur',
                    '📉 Perte vitesse swing estimée : -3 à -5 mph',
                    '🔴 Risque blessure épaule/coiffe rotateurs',
                    '⚠️ Posture altérée (épaules enroulées)'
                ],
                action: 'Renforcer chaîne postérieure : tractions, rowing, face pulls'
            });
        }
    }
    
    // H/Q Ratio (Ischio/Quadriceps)
    // Approximation via tests dispo
    if (scores.force && scores.force < 14) {
        impacts.push({
            priority: 1,
            category: 'Ratio Musculaire',
            title: 'Risque Ratio H/Q Faible',
            description: 'Score force jambes <14/20 suggère potentiel déséquilibre',
            consequences: [
                '🔴 URGENT : Risque blessure LCA/ménisque',
                '🔴 Risque douleurs lombaires',
                '⚠️ Stabilité genou compromise',
                '📉 Freinage inefficace durant downswing'
            ],
            action: 'Évaluation H/Q isocinétique recommandée + renforcement ischio (Nordic curls, RDL)'
        });
    }
    
    // ========== 3. TRANSMISSION FORCE (Core faible + Force élevée) ==========
    if (scores.force && scores.core && scores.force > 15 && scores.core < 12) {
        impacts.push({
            priority: 2,
            category: 'Transmission',
            title: 'Transmission Inefficace Force → Vitesse',
            description: `Force jambes élevée (${scores.force.toFixed(1)}/20) mais Core faible (${scores.core.toFixed(1)}/20)`,
            consequences: [
                '⚠️ Puissance jambes non transmise au haut du corps',
                '📉 Perte estimée : 15-20% de la puissance disponible',
                '⚠️ Compensation par bras → Risque blessure',
                '🎯 Consistance de frappe diminuée'
            ],
            action: 'Priorité absolue : renforcement Core (Pallof press, anti-rotation, planks dynamiques)'
        });
    }
    
    // ========== 4. LIMITATIONS TPI → SWING FAULTS ==========
    // Charger les tests TPI depuis l'historique
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const tpiTestHistory = history
        .filter(h => h.quality === 'tpi')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const tpiData = tpiTestHistory.length > 0 ? tpiTestHistory[0].tests : {};
    
    // Pelvic Tilt
    if (tpiData.pelvictilt === 0) {
        impacts.push({
            priority: 2,
            category: 'TPI → Swing Fault',
            title: 'Pelvic Tilt Fail',
            description: 'Limitation mobilité bassin (TPI)',
            consequences: [
                '⚠️ Loss of Posture probable (66% corrélation TPI)',
                '⚠️ Early Extension compensatoire',
                '🎯 Contact inconsistant',
                '🔴 Risque lombalgie chronique'
            ],
            action: 'Mobilité hanche (90/90, pigeon pose) + renforcement fessiers'
        });
    }
    
    // Pelvic Rotation
    if (tpiData.pelvicrotation === 0) {
        impacts.push({
            priority: 2,
            category: 'TPI → Swing Fault',
            title: 'Pelvic Rotation Fail',
            description: 'Rotation bassin limitée (TPI)',
            consequences: [
                '⚠️ Early Extension probable (71% corrélation TPI)',
                '⚠️ Loss of Posture',
                '📉 Perte distance significative (10-15%)',
                '🔴 Compression lombaire excessive'
            ],
            action: 'Travail rotation hanche (Cossack squats, 90/90 switches, hip CARs)'
        });
    }
    
    // Torso Rotation
    if (tpiData.torsorotation === 0) {
        impacts.push({
            priority: 2,
            category: 'TPI → Swing Fault',
            title: 'Torso Rotation Fail',
            description: 'Rotation thoracique limitée (TPI)',
            consequences: [
                '⚠️ Flat Shoulder Plane probable (58% corrélation TPI)',
                '⚠️ Sway compensatoire',
                '📉 Backswing raccourci → Perte 8-12% distance',
                '🔴 Risque cervicales/trapèzes'
            ],
            action: 'Mobilité thoracique (Open book, thread the needle, foam roller T-spine)'
        });
    }
    
    // ========== 5. MATRICE RISQUE BLESSURE ==========
    
    // Core faible + Mobilité limitée
    if (scores.core && scores.mobilite && scores.core < 12 && scores.mobilite < 12) {
        impacts.push({
            priority: 1,
            category: 'Risque Blessure',
            title: 'Risque Lombalgie ÉLEVÉ',
            description: `Core: ${scores.core.toFixed(1)}/20 + Mobilité: ${scores.mobilite.toFixed(1)}/20`,
            consequences: [
                '🔴 URGENT : Combinaison à haut risque',
                '🔴 Compensation lombaire durant le swing',
                '🔴 Risque hernie discale à moyen terme',
                '⚠️ Fatigue lombaire après 9 trous'
            ],
            action: 'Programme préventif : Core + Mobilité hanche/thoracique (3-4x/sem)'
        });
    }
    
    // Force asymétrique + H/Q faible
    const hasLegAsymmetry = asymmetries.some(a => 
        (a.name.includes('CMJ') || a.name.includes('Wall Sit')) && a.lsi < 85
    );
    
    if (hasLegAsymmetry && scores.force < 14) {
        impacts.push({
            priority: 1,
            category: 'Risque Blessure',
            title: 'Risque Genou MOYEN-ÉLEVÉ',
            description: 'Asymétrie jambes + Force globale faible',
            consequences: [
                '🔴 Risque entorse/ménisque',
                '⚠️ Instabilité durant rotation',
                '⚠️ Surcharge côté fort',
                '🔴 Potentiel tendinite rotulienne'
            ],
            action: 'Renforcement bilatéral + unilatéral progressif + proprioception'
        });
    }
    
    // Rotation thoracique limitée
    if (scores.mobilite && scores.mobilite < 11) {
        const hasRotationLimit = Object.keys(currentTests.mobilite || {}).some(key => 
            key.includes('thoracic') && currentTests.mobilite[key] !== null
        );
        
        if (hasRotationLimit) {
            impacts.push({
                priority: 2,
                category: 'Risque Blessure',
                title: 'Risque Cervicales/Trapèzes MOYEN',
                description: 'Mobilité thoracique limitée',
                consequences: [
                    '⚠️ Compensation par cervicales',
                    '⚠️ Tensions trapèzes chroniques',
                    '⚠️ Maux de tête post-golf possibles',
                    '📉 Backswing limité'
                ],
                action: 'Routine quotidienne mobilité thoracique (10 min/jour)'
            });
        }
    }
    
    // ========== AFFICHAGE ==========
    if (impacts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: #e8f5e9; border-radius: 8px;">
                <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                <h3 style="color: #27ae60; margin-bottom: 10px;">Excellent Profil Physique</h3>
                <p style="color: #666;">Aucun impact physique majeur détecté sur votre swing. Continuez votre programme actuel !</p>
            </div>
        `;
        return;
    }
    
    // Trier par priorité
    impacts.sort((a, b) => a.priority - b.priority);
    
    let html = '<h4 style="margin-bottom: 20px;">🎯 Impact de Votre Physique sur le Swing</h4>';
    
    impacts.forEach(impact => {
        const priorityColor = impact.priority === 1 ? '#e74c3c' : '#f39c12';
        const priorityLabel = impact.priority === 1 ? '🔴 URGENT' : '🟠 IMPORTANT';
        
        html += `
            <div style="
                border-left: 4px solid ${priorityColor};
                background: white;
                padding: 20px;
                margin-bottom: 20px;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <h5 style="color: #1a4d2e; margin: 0; font-size: 16px;">${impact.title}</h5>
                    <span style="
                        background: ${priorityColor}15;
                        color: ${priorityColor};
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 600;
                    ">${priorityLabel}</span>
                </div>
                
                <div style="
                    background: #f8f9fa;
                    padding: 10px 15px;
                    border-radius: 4px;
                    margin-bottom: 12px;
                    font-size: 13px;
                    color: #666;
                ">
                    <strong>${impact.category}:</strong> ${impact.description}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong style="color: #333; font-size: 14px;">Conséquences :</strong>
                    <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
                        ${impact.consequences.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="
                    background: #e3f2fd;
                    padding: 12px 15px;
                    border-radius: 4px;
                    border-left: 3px solid #2196f3;
                ">
                    <strong style="color: #1976d2; font-size: 13px;">💡 Action recommandée:</strong>
                    <p style="margin: 5px 0 0 0; color: #333; font-size: 13px;">${impact.action}</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fonction helper pour détecter asymétries
function detectAsymmetries() {
    const currentTests = JSON.parse(localStorage.getItem('currentTests') || '{}');
    const asymmetries = [];
    
    const bilateralTests = [
        {key: 'wallsit', quality: 'endurance', name: 'Wall Sit'},
        {key: 'cmjunilateral', quality: 'explosivite', name: 'CMJ Unilatéral'},
        {key: 'sideplank', quality: 'core', name: 'Side Plank'},
        {key: 'thoracic', quality: 'mobilite', name: 'Rotation Thoracique'},
        {key: 'hipint', quality: 'mobilite', name: 'Hip Rotation Int'},
        {key: 'hipext', quality: 'mobilite', name: 'Hip Rotation Ext'},
        {key: 'ankle', quality: 'mobilite', name: 'Dorsiflexion'},
        {key: 'balanceopen', quality: 'equilibre', name: 'Équilibre Y. Ouverts'},
        {key: 'balanceclosed', quality: 'equilibre', name: 'Équilibre Y. Fermés'}
    ];
    
    bilateralTests.forEach(test => {
        const qualityData = currentTests[test.quality];
        if (qualityData && qualityData[test.key]) {
            const value = qualityData[test.key];
            if (typeof value === 'object' && value.left != null && value.right != null) {
                const weaker = Math.min(value.left, value.right);
                const stronger = Math.max(value.left, value.right);
                if (stronger > 0) {
                    const lsi = (weaker / stronger) * 100;
                    const weakerSide = value.left < value.right ? 'G' : 'D';
                    asymmetries.push({
                        name: test.name,
                        lsi: lsi,
                        weakerSide: weakerSide,
                        left: value.left,
                        right: value.right
                    });
                }
            }
        }
    });
    
    return asymmetries;
}


function generateSmartAlerts() {
    const container = document.getElementById('smartAlerts');
    if (!container) return;
    
    const scores = calculateQualityScores();
    
    const alerts = [];
    
    // ========== ALERTES PHYSIQUES (Scores faibles) ==========
    if (scores && scores.mobilite !== null && scores.mobilite < 12) {
        alerts.push({
            type: 'critical',
            category: 'LIMITATION PHYSIQUE',
            priority: scores.mobilite < 10 ? 1 : 2, // URGENT si <10, IMPORTANT si 10-12
            title: 'Mobilité Insuffisante',
            message: `Score mobilité: ${scores.mobilite.toFixed(1)}/20 (objectif: >14)`,
            faults: ['Perte d\'amplitude en backswing', 'Early extension', 'Slide latéral excessif']
        });
    }
    
    if (scores && scores.core !== null && scores.core < 12) {
        alerts.push({
            type: 'warning',
            category: 'LIMITATION PHYSIQUE',
            priority: scores.core < 10 ? 1 : 2,
            title: 'Core À Améliorer',
            message: `Score Core: ${scores.core.toFixed(1)}/20 (objectif: >14)`,
            faults: ['Early extension', 'Loss of posture', 'Inconsistency']
        });
    }
    
    if (scores && scores.force !== null && scores.force < 10) {
        alerts.push({
            type: 'warning',
            category: 'LIMITATION PHYSIQUE',
            priority: 2, // IMPORTANT
            title: 'Force Limitée',
            message: `Score Force: ${scores.force.toFixed(1)}/20 (objectif: >14)`,
            faults: ['Perte de vitesse', 'Distance limitée']
        });
    }
    
    // ========== ALERTES TPI (Tests échoués) ==========
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const tpiTests = history
        .filter(h => h.quality === 'tpi')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (tpiTests.length > 0) {
        const latestTPITest = tpiTests[0];
        const tpiData = latestTPITest.tests;
        
        // Tests unilatéraux
        const unilateralTests = [
            'pelvic-tilt',
            'pelvic-rotation',
            'torso-rotation',
            'bridge',
            'overhead-squat',
            'toe-touch',
            '9090',
            'shoulder',
            'lat'
        ];
        
        unilateralTests.forEach(testKey => {
            const val = tpiData[testKey];
            if (val === 'fail') {
                const testInfo = TPI_SWING_FAULTS[testKey];
                if (testInfo) {
                    // Tests critiques pour le golf (bassin, tronc, overhead squat, toe touch)
                    const criticalTests = ['pelvic-tilt', 'pelvic-rotation', 'torso-rotation', 'overhead-squat', 'toe-touch'];
                    const isCritical = criticalTests.includes(testKey);
                    
                    alerts.push({
                        type: 'critical',
                        category: 'LIMITATION TPI',
                        priority: isCritical ? 1 : 2, // URGENT si critique, IMPORTANT sinon
                        title: `${testInfo.name}: FAIL`,
                        message: testInfo.description,
                        faults: testInfo.swingFaults
                    });
                }
            }
        });
        
        // Tests bilatéraux
        const bilateralTests = [
            'lower-lat',
            'trunk-rotation',
            'single-leg',
            'cervical-rotation',
            'forearm-rotation',
            'wrist-hinge',
            'wrist-flex'
        ];
        
        bilateralTests.forEach(testKey => {
            const testData = tpiData[testKey];
            if (testData && typeof testData === 'object') {
                const leftVal = testData.left;
                const rightVal = testData.right;
                
                // Les deux côtés fail
                if (leftVal === 'fail' && rightVal === 'fail') {
                    const testInfo = TPI_SWING_FAULTS[testKey];
                    if (testInfo) {
                        alerts.push({
                            type: 'critical',
                            category: 'LIMITATION TPI',
                            priority: 1, // URGENT si bilatéral
                            title: `${testInfo.name}: FAIL (Bilatéral)`,
                            message: testInfo.description,
                            faults: testInfo.swingFaults
                        });
                    }
                }
                // Asymétrie (un seul côté fail)
                else if ((leftVal === 'pass' && rightVal === 'fail') || (leftVal === 'fail' && rightVal === 'pass')) {
                    const testInfo = TPI_SWING_FAULTS[testKey];
                    const failedSide = leftVal === 'fail' ? 'Gauche' : 'Droite';
                    if (testInfo) {
                        alerts.push({
                            type: 'warning',
                            category: 'ASYMÉTRIE TPI',
                            priority: 3, // À SURVEILLER
                            title: `${testInfo.name}: Asymétrie`,
                            message: `Côté ${failedSide} limité - ${testInfo.description}`,
                            faults: testInfo.swingFaults
                        });
                    }
                }
            }
        });
    }
    
    // ========== ALERTES ASYMÉTRIES CRITIQUES (Tests bilatéraux numériques) ==========
    // Récupérer tous les tests avec asymétries
    const allTests = history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Définir les tests bilatéraux critiques avec seuils
    const criticalAsymmetryTests = {
        'squat': { name: 'Squat', category: 'Jambes', risk: 'genou/hanche', action: 'Renforcer jambe faible (quadriceps, fessiers)' },
        'deadlift': { name: 'Deadlift', category: 'Jambes', risk: 'dos/bassin', action: 'Renforcer chaîne postérieure côté faible' },
        'singleleg': { name: 'Single Leg Balance', category: 'Équilibre', risk: 'cheville/genou', action: 'Renforcer stabilité mono-podale côté faible' },
        'cmjunilateral': { name: 'CMJ Unilateral', category: 'Explosivité', risk: 'déséquilibre puissance', action: 'Entraînement pliométrique unilatéral côté faible' },
        'benchpress': { name: 'Bench Press', category: 'Bras', risk: 'épaule/coude', action: 'Renforcer côté faible (pectoraux, triceps)' },
        'pullup': { name: 'Pull-up', category: 'Bras', risk: 'épaule/dos', action: 'Renforcer dorsaux côté faible' }
    };
    
    Object.keys(criticalAsymmetryTests).forEach(testKey => {
        const testConfig = criticalAsymmetryTests[testKey];
        const recentTests = allTests.filter(t => t.quality === testKey.replace('singleleg', 'equilibre').replace('cmjunilateral', 'explosivite'));
        
        if (recentTests.length > 0) {
            const latestTest = recentTests[0];
            const testData = latestTest.tests;
            
            // Chercher les tests bilatéraux
            Object.keys(testData).forEach(key => {
                const data = testData[key];
                if (data && typeof data === 'object' && data.left !== undefined && data.right !== undefined) {
                    const left = parseFloat(data.left);
                    const right = parseFloat(data.right);
                    
                    if (!isNaN(left) && !isNaN(right) && left > 0 && right > 0) {
                        const asymmetry = Math.abs(((left - right) / Math.max(left, right)) * 100);
                        const weakerSide = left < right ? 'Gauche' : 'Droite';
                        
                        // CRITIQUE : >15%
                        if (asymmetry > 15) {
                            alerts.push({
                                type: 'critical',
                                category: 'ASYMÉTRIE CRITIQUE',
                                priority: 1, // URGENT
                                title: `${testConfig.name}: Asymétrie ${asymmetry.toFixed(1)}% (${weakerSide})`,
                                message: `Risque blessure ${testConfig.risk}. Asymétrie excessive détectée.`,
                                action: testConfig.action,
                                faults: [`Déséquilibre ${testConfig.category} G/D`, `Compensation motrice`, `Surcharge côté fort`]
                            });
                        }
                        // SURVEILLANCE : 10-15%
                        else if (asymmetry >= 10) {
                            alerts.push({
                                type: 'warning',
                                category: 'ASYMÉTRIE SURVEILLANCE',
                                priority: 2, // IMPORTANT
                                title: `${testConfig.name}: Asymétrie ${asymmetry.toFixed(1)}% (${weakerSide})`,
                                message: `À surveiller. Renforcement côté faible recommandé.`,
                                action: testConfig.action,
                                faults: [`Déséquilibre ${testConfig.category} G/D en développement`]
                            });
                        }
                    }
                }
            });
        }
    });
    
    // ========== ALERTES DÉSÉQUILIBRES ANTÉRIEUR/POSTÉRIEUR (Push vs Pull) ==========
    // Récupérer les derniers tests de force
    const forceTests = allTests.filter(t => t.quality === 'force').sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (forceTests.length > 0) {
        const latestForceTest = forceTests[0];
        const forceData = latestForceTest.tests;
        
        // Développé couché (Push)
        let benchValue = null;
        if (forceData.bench) {
            if (typeof forceData.bench === 'object') {
                const left = parseFloat(forceData.bench.left) || 0;
                const right = parseFloat(forceData.bench.right) || 0;
                benchValue = (left + right) / 2;
            } else {
                benchValue = parseFloat(forceData.bench);
            }
        }
        
        // Tirage dos (Pull)
        let pullupValue = null;
        if (forceData.pullup) {
            if (typeof forceData.pullup === 'object') {
                const left = parseFloat(forceData.pullup.left) || 0;
                const right = parseFloat(forceData.pullup.right) || 0;
                pullupValue = (left + right) / 2;
            } else {
                pullupValue = parseFloat(forceData.pullup);
            }
        }
        
        // Calculer le ratio Pull/Push (idéal = 0.8 à 1.0)
        if (benchValue && pullupValue && benchValue > 0 && pullupValue > 0) {
            const ratio = pullupValue / benchValue;
            
            // CRITIQUE : Ratio < 0.6 (Pull beaucoup trop faible)
            if (ratio < 0.6) {
                const ratioPct = (ratio * 100).toFixed(0);
                alerts.push({
                    type: 'critical',
                    category: 'DÉSÉQUILIBRE PUSH/PULL',
                    priority: 1, // URGENT
                    title: `Déséquilibre Chaîne Antérieure/Postérieure Critique`,
                    message: `Ratio Pull/Push = ${ratioPct}% (Normal: 80-100%). Développé couché: ${benchValue.toFixed(1)}kg, Tirage: ${pullupValue.toFixed(1)}kg.`,
                    action: 'Renforcer urgence chaîne postérieure (dorsaux, trapèzes, arrière épaules)',
                    faults: ['Épaules enroulées', 'Posture voutée', 'Risque tendinite épaule', 'Déséquilibre musculaire']
                });
            }
            // SURVEILLANCE : Ratio 0.6-0.75 (Pull un peu faible)
            else if (ratio < 0.75) {
                const ratioPct = (ratio * 100).toFixed(0);
                alerts.push({
                    type: 'warning',
                    category: 'DÉSÉQUILIBRE PUSH/PULL',
                    priority: 2, // IMPORTANT
                    title: `Déséquilibre Chaîne Antérieure/Postérieure`,
                    message: `Ratio Pull/Push = ${ratioPct}% (Normal: 80-100%). Développé couché: ${benchValue.toFixed(1)}kg, Tirage: ${pullupValue.toFixed(1)}kg.`,
                    action: 'Renforcer chaîne postérieure (dorsaux, trapèzes)',
                    faults: ['Tendance épaules enroulées', 'Posture à surveiller']
                });
            }
            // ALERTE INVERSE : Ratio > 1.2 (Push trop faible par rapport au Pull)
            else if (ratio > 1.2) {
                const ratioPct = (ratio * 100).toFixed(0);
                alerts.push({
                    type: 'warning',
                    category: 'DÉSÉQUILIBRE PUSH/PULL',
                    priority: 2, // IMPORTANT
                    title: `Déséquilibre Chaîne Antérieure/Postérieure (Push faible)`,
                    message: `Ratio Pull/Push = ${ratioPct}% (Normal: 80-100%). Développé couché: ${benchValue.toFixed(1)}kg, Tirage: ${pullupValue.toFixed(1)}kg.`,
                    action: 'Renforcer chaîne antérieure (pectoraux, épaules antérieures)',
                    faults: ['Déséquilibre inverse', 'Perte de stabilité antérieure']
                });
            }
        }
    }
    
    // ========== DÉSÉQUILIBRES ISCHIO-JAMBIERS/QUADRICEPS (H/Q Ratio) ==========
    // Récupérer les derniers tests de force
    if (forceTests.length > 0) {
        const latestForceTest = forceTests[0];
        const forceData = latestForceTest.tests;
        
        // Squat (dominance Quadriceps)
        let squatValue = null;
        if (forceData.squat) {
            if (typeof forceData.squat === 'object') {
                const left = parseFloat(forceData.squat.left) || 0;
                const right = parseFloat(forceData.squat.right) || 0;
                squatValue = (left + right) / 2;
            } else {
                squatValue = parseFloat(forceData.squat);
            }
        }
        
        // Deadlift (dominance Ischio-jambiers)
        let deadliftValue = null;
        if (forceData.deadlift) {
            if (typeof forceData.deadlift === 'object') {
                const left = parseFloat(forceData.deadlift.left) || 0;
                const right = parseFloat(forceData.deadlift.right) || 0;
                deadliftValue = (left + right) / 2;
            } else {
                deadliftValue = parseFloat(forceData.deadlift);
            }
        }
        
        // Calculer le ratio H/Q (idéal = 0.75 à 1.0 pour sportifs)
        if (squatValue && deadliftValue && squatValue > 0 && deadliftValue > 0) {
            const ratio = deadliftValue / squatValue;
            
            // CRITIQUE : Ratio < 0.6 (Ischio trop faibles)
            if (ratio < 0.6) {
                const ratioPct = (ratio * 100).toFixed(0);
                alerts.push({
                    type: 'critical',
                    category: 'DÉSÉQUILIBRE H/Q',
                    priority: 1, // URGENT
                    title: `Déséquilibre Ischio-jambiers/Quadriceps Critique`,
                    message: `Ratio H/Q = ${ratioPct}% (Normal sportifs: 75-100%). Squat: ${squatValue.toFixed(1)}kg, Deadlift: ${deadliftValue.toFixed(1)}kg.`,
                    action: 'Renforcer urgence ischio-jambiers (deadlifts, nordics, leg curls)',
                    faults: ['Risque blessure genou élevé', 'Instabilité ACL', 'Déséquilibre musculaire majeur', 'Risque élongation ischio']
                });
            }
            // SURVEILLANCE : Ratio 0.6-0.75 (Ischio un peu faibles)
            else if (ratio < 0.75) {
                const ratioPct = (ratio * 100).toFixed(0);
                alerts.push({
                    type: 'warning',
                    category: 'DÉSÉQUILIBRE H/Q',
                    priority: 2, // IMPORTANT
                    title: `Déséquilibre Ischio-jambiers/Quadriceps`,
                    message: `Ratio H/Q = ${ratioPct}% (Idéal sportifs: 75-100%). Squat: ${squatValue.toFixed(1)}kg, Deadlift: ${deadliftValue.toFixed(1)}kg.`,
                    action: 'Renforcer ischio-jambiers (deadlifts, nordics)',
                    faults: ['Stabilité genou à surveiller', 'Risque blessure modéré']
                });
            }
        }
    }
    
    // ========== ALERTES COMBINAISONS DE FAIBLESSES ==========
    if (scores) {
        // Combinaison 1: Mobilité thoracique faible + Core faible
        if ((scores.mobilite !== null && scores.mobilite < 12) && (scores.core !== null && scores.core < 12)) {
            alerts.push({
                type: 'critical',
                category: 'COMBINAISON FAIBLESSE',
                priority: 1, // URGENT - Critique pour le golf
                title: 'Mobilité Thoracique + Core Faibles',
                message: 'Combinaison critique pour le golf. Limitation majeure du swing.',
                action: 'Mobilité thoracique ET renforcement Core',
                faults: ['Early Extension', 'Loss of Posture', 'Limited Turn', 'Compensation lombaire']
            });
        }
        
        // Combinaison 2: Core faible + Mobilité hanche limitée
        if ((scores.core !== null && scores.core < 12) && (scores.mobilite !== null && scores.mobilite < 12)) {
            alerts.push({
                type: 'warning',
                category: 'COMBINAISON FAIBLESSE',
                priority: 2, // IMPORTANT
                title: 'Core Faible + Mobilité Hanche Limitée',
                message: 'Risque de compensation et perte de posture.',
                action: 'Renforcer Core ET mobilité hanches',
                faults: ['Sway', 'Slide', 'Early Extension']
            });
        }
        
        // Combinaison 3: Explosivité basse + Force OK = Problème transfert
        if ((scores.explosivite !== null && scores.explosivite < 12) && (scores.force !== null && scores.force >= 14)) {
            alerts.push({
                type: 'warning',
                category: 'COMBINAISON FAIBLESSE',
                priority: 2, // IMPORTANT
                title: 'Explosivité Basse malgré Force Correcte',
                message: 'Problème de transfert de force. La force ne se traduit pas en puissance.',
                action: 'Entraînement pliométrique et vitesse de mouvement',
                faults: ['Perte de vitesse de swing', 'Manque de lag', 'Séquence inefficace']
            });
        }
        
        // Combinaison 4: Force faible + Mobilité OK = Priorité force
        if ((scores.force !== null && scores.force < 10) && (scores.mobilite !== null && scores.mobilite >= 14)) {
            alerts.push({
                type: 'warning',
                category: 'COMBINAISON FAIBLESSE',
                priority: 2, // IMPORTANT
                title: 'Force Insuffisante (Mobilité OK)',
                message: 'Bonne mobilité mais manque de force pour la stabiliser.',
                action: 'Renforcer en amplitude complète',
                faults: ['Instabilité', 'Manque de distance', 'Fatigue rapide']
            });
        }
    }
    
    // ========== AFFICHAGE ==========
    let html = '';
    
    if (alerts.length === 0) {
        html = '<div class="alert-item alert-info"><div class="alert-icon">✅</div><div class="alert-content"><h5>Aucune alerte critique</h5><p>Votre profil physique et TPI ne présentent pas de limitation majeure identifiée.</p></div></div>';
    } else {
        // Trier les alertes par priorité (1 = urgent, 2 = important, 3 = surveillance)
        alerts.sort((a, b) => (a.priority || 3) - (b.priority || 3));
        
        // Séparer par priorité
        const urgentAlerts = alerts.filter(a => a.priority === 1);
        const importantAlerts = alerts.filter(a => a.priority === 2);
        const watchAlerts = alerts.filter(a => a.priority === 3);
        
        // Fonction helper pour générer le HTML d'une alerte
        const renderAlert = (alert) => {
            const iconMap = { critical: '🚨', warning: '⚠️', info: 'ℹ️' };
            return `
                <div class="alert-item alert-${alert.type}">
                    <div class="alert-icon">${iconMap[alert.type]}</div>
                    <div class="alert-content">
                        <h5>${alert.title}</h5>
                        <p>${alert.message}</p>
                        ${alert.action ? `
                            <div class="alert-action">
                                <strong>💪 Action recommandée:</strong> ${alert.action}
                            </div>
                        ` : ''}
                        ${alert.faults ? `
                            <div class="swing-fault">
                                <strong>Impacts potentiels:</strong>
                                <ul>
                                    ${alert.faults.map(f => `<li>${f}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        };
        
        // URGENT (toujours affichées)
        if (urgentAlerts.length > 0) {
            html += `<div style="margin-bottom: 2rem;">
                <h5 style="color: #dc2626; font-size: 1.2rem; margin-bottom: 1rem; border-bottom: 3px solid #dc2626; padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    🔴 URGENT (${urgentAlerts.length})
                </h5>
                ${urgentAlerts.map(renderAlert).join('')}
            </div>`;
        }
        
        // IMPORTANT (toujours affichées)
        if (importantAlerts.length > 0) {
            html += `<div style="margin-bottom: 2rem;">
                <h5 style="color: #f59e0b; font-size: 1.1rem; margin-bottom: 1rem; border-bottom: 2px solid #f59e0b; padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    🟠 IMPORTANT (${importantAlerts.length})
                </h5>
                ${importantAlerts.map(renderAlert).join('')}
            </div>`;
        }
        
        // À SURVEILLER (repliées par défaut)
        if (watchAlerts.length > 0) {
            html += `<div style="margin-bottom: 2rem;">
                <h5 style="color: #84cc16; font-size: 1rem; margin-bottom: 1rem; border-bottom: 2px solid #84cc16; padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;" onclick="document.getElementById('watchAlerts').style.display = document.getElementById('watchAlerts').style.display === 'none' ? 'block' : 'none'">
                    🟡 À SURVEILLER (${watchAlerts.length})
                    <span style="font-size: 0.9rem; color: #666;">(cliquer pour afficher/masquer)</span>
                </h5>
                <div id="watchAlerts" style="display: none;">
                    ${watchAlerts.map(renderAlert).join('')}
                </div>
            </div>`;
        }
    }
    
    container.innerHTML = html;
}

function exportToCSV() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord créer un profil joueur');
        return;
    }
    
    const scores = calculateQualityScores();
    if (!scores) {
        alert('Aucune donnée de test disponible');
        return;
    }
    
    const gfiScores = calculateQualityScores();
    let gfi = 0;
    gfi += (gfiScores.force || 0) * GFI_WEIGHTS.force;
    gfi += (gfiScores.explosivite || 0) * GFI_WEIGHTS.explosivite;
    gfi += (gfiScores.mobilite || 0) * GFI_WEIGHTS.mobilite;
    gfi += (gfiScores.core || 0) * GFI_WEIGHTS.core;
    gfi += (gfiScores.endurance || 0) * GFI_WEIGHTS.endurance;
    gfi += (gfiScores.vitesse || 0) * GFI_WEIGHTS.vitesse;
    gfi += (gfiScores.equilibre || 0) * GFI_WEIGHTS.equilibre;
    const gfiScore = Math.round((gfi / 20) * 100);
    
    const csv = `Nom,Sexe,Age,Handicap,Force,Explosivite,Mobilite,Core,Endurance,Vitesse,Equilibre,GFI
${currentPlayer.name},${currentPlayer.gender},${currentPlayer.age},${currentPlayer.handicap || 'N/A'},${(scores.force || 0).toFixed(1)},${(scores.explosivite || 0).toFixed(1)},${(scores.mobilite || 0).toFixed(1)},${(scores.core || 0).toFixed(1)},${(scores.endurance || 0).toFixed(1)},${(scores.vitesse || 0).toFixed(1)},${(scores.equilibre || 0).toFixed(1)},${gfiScore}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `golf_tracker_${currentPlayer.name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function setupAnalyseProEventListeners() {
    // Charger automatiquement les corrélations golf
    displayGolfCorrelations();
    
    const exportBtn = document.getElementById('exportCSV');
    if (exportBtn) {
        exportBtn.onclick = exportToCSV;
    }
}

// ==================== PWA - SERVICE WORKER ====================

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré avec succès:', registration.scope);
            })
            .catch((error) => {
                console.log('❌ Échec enregistrement Service Worker:', error);
            });
    });
}

// ========================================
// TESTS GOLF - Gestion et calculs
// ========================================

function calculateSmashFactor() {
    const vmaxDriver = parseFloat(document.getElementById('golf-vmax-driver')?.value);
    const ballSpeed = parseFloat(document.getElementById('golf-ballspeed')?.value);
    const display = document.getElementById('golf-smash-display');
    
    if (display && vmaxDriver && ballSpeed && vmaxDriver > 0) {
        const smash = ballSpeed / vmaxDriver;
        display.textContent = smash.toFixed(2);
        display.style.color = smash >= 1.48 ? '#27ae60' : smash >= 1.45 ? '#f39c12' : '#e74c3c';
    } else if (display) {
        display.textContent = '--';
        display.style.color = 'var(--primary-color)';
    }
}

function saveGolfTests() {
    const vmaxDriver = parseFloat(document.getElementById('golf-vmax-driver')?.value);
    const ballSpeed = parseFloat(document.getElementById('golf-ballspeed')?.value) || null;
    const distance = parseFloat(document.getElementById('golf-distance')?.value) || null;
    
    if (!vmaxDriver || vmaxDriver <= 0) {
        alert('⚠️ Veuillez entrer au moins la VMax Driver');
        return;
    }
    
    const smashFactor = ballSpeed && vmaxDriver ? (ballSpeed / vmaxDriver) : null;
    
    const golfTest = {
        date: new Date().toISOString(),
        vmaxDriver: vmaxDriver,
        ballSpeed: ballSpeed,
        smashFactor: smashFactor ? parseFloat(smashFactor.toFixed(2)) : null,
        distance: distance
    };
    
    // Récupérer historique
    let golfHistory = JSON.parse(localStorage.getItem('golfTestsHistory') || '[]');
    golfHistory.push(golfTest);
    
    // Sauvegarder
    localStorage.setItem('golfTestsHistory', JSON.stringify(golfHistory));
    localStorage.setItem('currentGolfTest', JSON.stringify(golfTest));
    
    // Sauvegarde automatique
    autoBackup();
    
    alert('✅ Tests Golf enregistrés !');
    
    // Vider formulaire
    document.getElementById('golf-vmax-driver').value = '';
    document.getElementById('golf-ballspeed').value = '';
    document.getElementById('golf-distance').value = '';
    document.getElementById('golf-smash-display').textContent = '--';
}

// Event listeners Tests Golf
document.addEventListener('DOMContentLoaded', function() {
    // Calcul smash factor en temps réel
    const vmaxInput = document.getElementById('golf-vmax-driver');
    const ballSpeedInput = document.getElementById('golf-ballspeed');
    
    if (vmaxInput) vmaxInput.addEventListener('input', calculateSmashFactor);
    if (ballSpeedInput) ballSpeedInput.addEventListener('input', calculateSmashFactor);
    
    // Bouton sauvegarde
    const saveBtn = document.getElementById('saveGolfTests');
    if (saveBtn) saveBtn.addEventListener('click', saveGolfTests);
});
