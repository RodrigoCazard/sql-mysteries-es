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
            title: 'Acusación final',
            prompt: 'Escribí el nombre completo de la persona que apretó el gatillo.',
        },
        {
            answer: 'miranda priestly',
            title: '¿Quién dio la orden?',
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
        accuseLives.innerHTML = '';
        for (var i = 0; i < MAX_LIVES; i++) {
            var dot = document.createElement('span');
            dot.className = i < lives ? 'life-on' : 'life-off';
            dot.textContent = '●';
            accuseLives.appendChild(dot);
            if (i < MAX_LIVES - 1) { accuseLives.appendChild(document.createTextNode(' ')); }
        }
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

    // Big, warm-toned burst for finishing the whole case.
    function celebrateWin() {
        if (typeof confetti !== 'function') { return; }
        var colors = ['#c99a4a', '#e0b262', '#ece7dd', '#9fb98a'];
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 }, colors: colors, zIndex: 2000 });
        setTimeout(function () {
            confetti({ particleCount: 100, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors: colors, zIndex: 2000 });
            confetti({ particleCount: 100, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: colors, zIndex: 2000 });
        }, 250);
    }

    // Smaller burst + a quick shake for the false lead (not the real culprit).
    function celebrateTwist() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 40, spread: 55, startVelocity: 25, origin: { y: 0.4 }, colors: ['#c99a4a', '#b5544a'], scalar: 0.8, zIndex: 2000 });
        }
        var box = accuseModal.querySelector('.modal-box');
        box.classList.remove('twist-flash');
        void box.offsetWidth; // restart animation if triggered again
        box.classList.add('twist-flash');
    }

    function submitAccusation() {
        if (finished) { return; }
        var raw = accuseInput.value.trim();
        if (!raw) {
            accuseResult.innerHTML = '<div class="accuse-warning">Escribí un nombre antes de confirmar.</div>';
            return;
        }

        var normalized = normalize(raw);
        var finalAnswer = LEVELS[LEVELS.length - 1].answer;

        // The mastermind's name always wins the whole case, even if the
        // player names her before naming the shooter.
        if (normalized === finalAnswer) {
            finished = true;
            recordSolution(raw + ' (contrató a Jeremy Bowers)');
            celebrateWin();
            accuseResult.innerHTML =
                '<div class="case-closed">CASO CERRADO</div>' +
                '<div class="accuse-echo">Autor material: <strong>Jeremy Bowers</strong><br>Autora intelectual: <strong>' + raw.replace(/</g, '&lt;') + '</strong></div>' +
                '<div class="accuse-note">¡Resolviste el misterio completo!</div>';
            setFormEnabled(false);
            accuseResetBtn.classList.remove('hidden');
            return;
        }

        if (level < LEVELS.length - 1 && normalized === LEVELS[level].answer) {
            level++;
            accuseInput.value = '';
            accuseResult.innerHTML = '<div class="accuse-success">Correcto. ' + raw.replace(/</g, '&lt;') + ' es el autor material del crimen... pero hay algo más.</div>';
            renderLevel();
            celebrateTwist();
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

    // ---- Manual modal (in-page investigator's manual with search) ----
    var manualOpenBtn = document.getElementById('manual-open');
    var manualModal = document.getElementById('manual-modal');
    var manualCloseBtn = document.getElementById('manual-close');
    var manualSearch = document.getElementById('manual-search');
    var manualLessons = manualModal.querySelectorAll('.lesson');
    var manualNoResults = document.getElementById('manual-no-results');

    function manualNormalize(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function filterManual() {
        var q = manualNormalize(manualSearch.value.trim());
        var visible = 0;
        for (var i = 0; i < manualLessons.length; i++) {
            var lesson = manualLessons[i];
            var match = !q || manualNormalize(lesson.textContent).indexOf(q) !== -1;
            lesson.classList.toggle('hidden', !match);
            if (match) { visible++; }
        }
        manualNoResults.classList.toggle('hidden', visible !== 0);
    }

    function closeManualModal() {
        closeModal(manualModal);
        manualSearch.value = '';
        filterManual();
    }

    manualOpenBtn.addEventListener('click', function () {
        openModal(manualModal, manualSearch);
    });
    manualCloseBtn.addEventListener('click', closeManualModal);
    manualModal.addEventListener('click', function (e) {
        if (e.target === manualModal) { closeManualModal(); }
    });
    manualSearch.addEventListener('input', filterManual);

    // ---- Close modal with Escape ----
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') { return; }
        if (!accuseModal.classList.contains('hidden')) { closeModal(accuseModal); }
        if (!manualModal.classList.contains('hidden')) { closeManualModal(); }
    });
})();
