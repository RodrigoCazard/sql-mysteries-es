(function () {
    'use strict';

    // ---- Landing <-> Workspace ----
    var landing = document.getElementById('landing');
    var workspace = document.getElementById('workspace');
    var startBtn = document.getElementById('start-btn');
    var backBtn = document.getElementById('back-btn');

    startBtn.addEventListener('click', function () {
        landing.classList.add('hidden');
        workspace.classList.remove('hidden');
    });

    backBtn.addEventListener('click', function () {
        workspace.classList.add('hidden');
        landing.classList.remove('hidden');
    });

    // ---- Generic modal helpers ----
    function openModal(modal, focusEl) {
        modal.classList.remove('hidden');
        if (focusEl) { focusEl.focus(); }
    }
    function closeModal(modal) {
        modal.classList.add('hidden');
    }

    // ---- Accusation modal (two levels, 3 lives) ----
    var accuseOpenBtn = document.getElementById('accuse-open');
    var accuseModal = document.getElementById('accuse-modal');
    var accuseCloseBtn = document.getElementById('accuse-close');
    var accuseTitle = document.getElementById('accuse-title');
    var accuseLives = document.getElementById('accuse-lives');
    var accusePrompt = document.getElementById('accuse-prompt');
    var accuseInput = document.getElementById('accuse-input');
    var accuseSubmitBtn = document.getElementById('accuse-submit');
    var accuseResult = document.getElementById('accuse-result');
    var accuseResetBtn = document.getElementById('accuse-reset');

    var MAX_LIVES = 3;
    var LEVELS = [
        {
            answer: 'jeremy bowers',
            title: '🚨 Acusación final',
            prompt: 'Escribí el nombre completo de la persona que apretó el gatillo.',
        },
        {
            answer: 'miranda priestly',
            title: '🕵️ ¿Quién dio la orden?',
            prompt: 'Bien hecho. Pero a ese hombre lo contrataron para matar. ¿Quién es la verdadera responsable del asesinato?',
        },
    ];

    var level = 0;
    var lives = MAX_LIVES;
    var finished = false;

    function normalize(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ');
    }

    function renderLives() {
        var hearts = '';
        for (var i = 0; i < MAX_LIVES; i++) { hearts += i < lives ? '❤️ ' : '🖤 '; }
        accuseLives.textContent = hearts.trim();
    }

    function renderLevel() {
        accuseTitle.textContent = LEVELS[level].title;
        accusePrompt.textContent = LEVELS[level].prompt;
    }

    function setFormEnabled(enabled) {
        accuseInput.disabled = !enabled;
        accuseSubmitBtn.disabled = !enabled;
        accuseSubmitBtn.classList.toggle('hidden', !enabled);
    }

    function resetAccusation() {
        level = 0;
        lives = MAX_LIVES;
        finished = false;
        accuseInput.value = '';
        accuseResult.innerHTML = '';
        accuseResetBtn.classList.add('hidden');
        setFormEnabled(true);
        renderLives();
        renderLevel();
    }

    function recordSolution(text) {
        var escaped = text.replace(/'/g, "''");
        query("INSERT INTO solucion VALUES (1, '" + escaped + "'); SELECT valor FROM solucion;", function () {}, function () {});
    }

    function submitAccusation() {
        if (finished) { return; }
        var raw = accuseInput.value.trim();
        if (!raw) {
            accuseResult.innerHTML = '<div class="accuse-warning">Escribí un nombre antes de confirmar.</div>';
            return;
        }

        if (normalize(raw) === LEVELS[level].answer) {
            if (level < LEVELS.length - 1) {
                level++;
                accuseInput.value = '';
                accuseResult.innerHTML = '<div class="accuse-success">Correcto. ' + raw.replace(/</g, '&lt;') + ' es el autor material del crimen.</div>';
                renderLevel();
            } else {
                finished = true;
                recordSolution(raw + ' (contrató a Jeremy Bowers)');
                accuseResult.innerHTML =
                    '<div class="case-closed">CASO CERRADO</div>' +
                    '<div class="accuse-echo">Autor material: <strong>Jeremy Bowers</strong><br>Autora intelectual: <strong>' + raw.replace(/</g, '&lt;') + '</strong></div>' +
                    '<div class="accuse-note">¡Resolviste el misterio completo!</div>';
                setFormEnabled(false);
                accuseResetBtn.classList.remove('hidden');
            }
            return;
        }

        lives--;
        renderLives();
        if (lives <= 0) {
            finished = true;
            accuseResult.innerHTML =
                '<div class="case-closed">CASO SIN RESOLVER</div>' +
                '<div class="accuse-note">Te quedaste sin intentos. Volvé a revisar la evidencia y empezá de nuevo.</div>';
            setFormEnabled(false);
            accuseResetBtn.classList.remove('hidden');
        } else {
            accuseResult.innerHTML = '<div class="accuse-warning">Incorrecto. Te quedan ' + lives + (lives === 1 ? ' vida' : ' vidas') + '.</div>';
        }
    }

    accuseOpenBtn.addEventListener('click', function () {
        openModal(accuseModal, accuseInput);
        renderLives();
        renderLevel();
    });
    accuseCloseBtn.addEventListener('click', function () { closeModal(accuseModal); });
    accuseModal.addEventListener('click', function (e) {
        if (e.target === accuseModal) { closeModal(accuseModal); }
    });

    accuseSubmitBtn.addEventListener('click', submitAccusation);
    accuseInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { submitAccusation(); }
    });
    accuseResetBtn.addEventListener('click', resetAccusation);

    resetAccusation();

    // ---- Close modal with Escape ----
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') { return; }
        if (!accuseModal.classList.contains('hidden')) { closeModal(accuseModal); }
    });
})();
