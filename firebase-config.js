/**
 * EPS: Épreuve Combinée — Firebase Sync
 * ======================================
 * CONFIGURATION : remplacez les valeurs ci-dessous par celles de votre
 * projet Firebase (Console Firebase → Paramètres → Config SDK Web).
 *
 * Guide rapide :
 *  1. https://console.firebase.google.com → Créer un projet
 *  2. Ajouter une app Web
 *  3. Copier la config firebaseConfig
 *  4. Activer Realtime Database (mode Test pour démarrer)
 */

const EPS_FIREBASE_CONFIG = {
    apiKey:            "VOTRE_API_KEY",
    authDomain:        "VOTRE_PROJECT.firebaseapp.com",
    databaseURL:       "https://VOTRE_PROJECT-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:         "VOTRE_PROJECT",
    storageBucket:     "VOTRE_PROJECT.appspot.com",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId:             "VOTRE_APP_ID",
};

// ── Singleton Firebase ──────────────────────────────────────────────────────
let _db = null;
let _firebaseReady = false;
let _syncEnabled = false;

function isFirebaseConfigured() {
    return EPS_FIREBASE_CONFIG.apiKey !== "VOTRE_API_KEY";
}

async function initFirebase() {
    if(_firebaseReady) return true;
    if(!isFirebaseConfigured()) {
        console.warn('[Firebase] Configuration non renseignée — sync désactivée');
        return false;
    }
    try {
        const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
        const { getDatabase, ref, set, get, onValue, off, update, push } =
            await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js");

        if(!getApps().length) {
            window._fbApp = initializeApp(EPS_FIREBASE_CONFIG);
        }
        _db = getDatabase(window._fbApp);
        window._fbRef = ref;
        window._fbSet = set;
        window._fbGet = get;
        window._fbOnValue = onValue;
        window._fbOff = off;
        window._fbUpdate = update;
        window._fbPush = push;
        _firebaseReady = true;
        _syncEnabled = true;
        console.log('[Firebase] ✅ Connecté');
        return true;
    } catch(e) {
        console.error('[Firebase] Erreur init:', e);
        return false;
    }
}

// ── Classe courante ─────────────────────────────────────────────────────────
function getCurrentClassId() {
    return localStorage.getItem('eps_current_class') || 'classe_defaut';
}

function setCurrentClassId(id) {
    localStorage.setItem('eps_current_class', id);
}

// ── Sync élèves ─────────────────────────────────────────────────────────────

/**
 * Envoie tous les élèves du localStorage vers Firebase.
 * Appelé après chaque saveAll() dans les leçons.
 */
async function syncStudentsToFirebase(students) {
    if(!_syncEnabled) return;
    const ok = await initFirebase();
    if(!ok) return;
    try {
        const classId = getCurrentClassId();
        const studentsObj = {};
        students.forEach(s => { studentsObj[s.id] = s; });
        await window._fbSet(window._fbRef(_db, `eps/${classId}/students`), studentsObj);
        showSyncStatus('✅ Sync Firebase OK', 'success');
    } catch(e) {
        console.error('[Firebase] Erreur sync students:', e);
        showSyncStatus('⚠️ Sync Firebase échouée', 'warning');
    }
}

/**
 * Télécharge les élèves depuis Firebase et fusionne avec localStorage.
 * Les données Firebase ont la priorité pour les séances (les plus récentes gagnent).
 */
async function pullStudentsFromFirebase() {
    const ok = await initFirebase();
    if(!ok) return null;
    try {
        const classId = getCurrentClassId();
        const snap = await window._fbGet(window._fbRef(_db, `eps/${classId}/students`));
        if(!snap.exists()) return null;
        const fbStudents = Object.values(snap.val());
        showSyncStatus('📥 Données récupérées depuis Firebase', 'success');
        return fbStudents;
    } catch(e) {
        console.error('[Firebase] Erreur pull:', e);
        return null;
    }
}

/**
 * Écoute les changements en temps réel.
 * callback(students) est appelé à chaque mise à jour.
 */
async function watchStudents(callback) {
    const ok = await initFirebase();
    if(!ok) return null;
    const classId = getCurrentClassId();
    const r = window._fbRef(_db, `eps/${classId}/students`);
    window._fbOnValue(r, snap => {
        if(snap.exists()) {
            callback(Object.values(snap.val()));
        }
    });
    return r;
}

function stopWatching(ref) {
    if(ref && window._fbOff) window._fbOff(ref);
}

// ── Indicateur de sync ──────────────────────────────────────────────────────
function showSyncStatus(msg, type = 'info') {
    let el = document.getElementById('firebase-sync-status');
    if(!el) {
        el = document.createElement('div');
        el.id = 'firebase-sync-status';
        el.style.cssText = `
            position: fixed; bottom: 16px; right: 16px; z-index: 9999;
            padding: 8px 14px; border-radius: 10px; font-size: 0.78rem;
            font-weight: 700; font-family: system-ui, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            transition: opacity 0.4s;
        `;
        document.body.appendChild(el);
    }
    const colors = {
        success: 'background:#16a34a;color:white',
        warning: 'background:#d97706;color:white',
        error:   'background:#dc2626;color:white',
        info:    'background:#2563eb;color:white',
    };
    el.style.cssText += ';' + (colors[type] || colors.info);
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => { el.style.opacity = '0'; }, 3000);
}

// ── Intégration automatique avec localStorage ───────────────────────────────
/**
 * Remplace localStorage.setItem('eps_pro_students', ...) par cette fonction
 * pour synchro automatique.
 */
async function saveAndSync(students) {
    localStorage.setItem('eps_pro_students', JSON.stringify(students));
    await syncStudentsToFirebase(students);
}

// ── Code PIN de classe ──────────────────────────────────────────────────────
/**
 * Génère un code PIN de 6 caractères pour identifier une session de classe.
 * Les tablettes élèves utilisent ce code pour rejoindre la même session.
 */
function generateClassPin() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pin = '';
    for(let i = 0; i < 6; i++) pin += chars[Math.floor(Math.random() * chars.length)];
    return pin;
}

async function createClassSession(className) {
    const pin = generateClassPin();
    const classId = `session_${pin}`;
    setCurrentClassId(classId);
    const ok = await initFirebase();
    if(!ok) return { pin, classId, error: 'Firebase non configuré' };
    try {
        await window._fbSet(window._fbRef(_db, `eps/${classId}/meta`), {
            pin, className, createdAt: Date.now(), active: true
        });
        // Sync élèves existants
        const students = JSON.parse(localStorage.getItem('eps_pro_students') || '[]');
        if(students.length) await syncStudentsToFirebase(students);
        return { pin, classId };
    } catch(e) {
        return { pin, classId, error: e.message };
    }
}

async function joinClassSession(pin) {
    const classId = `session_${pin.toUpperCase()}`;
    setCurrentClassId(classId);
    return await pullStudentsFromFirebase();
}
