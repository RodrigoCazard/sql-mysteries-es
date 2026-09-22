(function () {
    'use strict';

    // ---- Landing -> Workspace ----
    var landing = document.getElementById('landing');
    var workspace = document.getElementById('workspace');
    var startBtn = document.getElementById('start-btn');

    startBtn.addEventListener('click', function () {
        landing.classList.add('hidden');
        workspace.classList.remove('hidden');
    });

    // ---- Generic modal helpers ----
    function openModal(modal, focusEl) {
        modal.classList.remove('hidden');
        if (focusEl) { focusEl.focus(); }
    }
    function closeModal(modal) {
        modal.classList.add('hidden');
    }

    // ---- Query console modal ----
    var queryOpenBtn = document.getElementById('query-open');
    var queryModal = document.getElementById('query-modal');
    var queryCloseBtn = document.getElementById('query-close');

    queryOpenBtn.addEventListener('click', function () {
        openModal(queryModal);
        // CodeMirror needs a refresh after becoming visible to size correctly.
        var cmWrapper = queryModal.querySelector('.CodeMirror');
        if (cmWrapper && cmWrapper.CodeMirror) {
            setTimeout(function () { cmWrapper.CodeMirror.refresh(); }, 0);
        }
    });
    queryCloseBtn.addEventListener('click', function () { closeModal(queryModal); });
    queryModal.addEventListener('click', function (e) {
        if (e.target === queryModal) { closeModal(queryModal); }
    });

    // ---- Accusation modal ----
    var accuseOpenBtn = document.getElementById('accuse-open');
    var accuseModal = document.getElementById('accuse-modal');
    var accuseCloseBtn = document.getElementById('accuse-close');
    var accuseInput = document.getElementById('accuse-input');
    var accuseSubmitBtn = document.getElementById('accuse-submit');
    var accuseResult = document.getElementById('accuse-result');

    accuseOpenBtn.addEventListener('click', function () { openModal(accuseModal, accuseInput); });
    accuseCloseBtn.addEventListener('click', function () { closeModal(accuseModal); });
    accuseModal.addEventListener('click', function (e) {
        if (e.target === accuseModal) { closeModal(accuseModal); }
    });

    function submitAccusation() {
        var name = accuseInput.value.trim();
        if (!name) {
            accuseResult.innerHTML = '<div class="accuse-warning">Escribí un nombre antes de confirmar.</div>';
            return;
        }
        var escaped = name.replace(/'/g, "''");
        var sql = "INSERT INTO solucion VALUES (1, '" + escaped + "'); SELECT valor FROM solucion;";
        query(sql, function () {
            accuseResult.innerHTML =
                '<div class="case-closed">CASO CERRADO</div>' +
                '<div class="accuse-echo">Persona acusada: <strong>' + name.replace(/</g, '&lt;') + '</strong></div>' +
                '<div class="accuse-note">Revisá que la evidencia de tu investigación respalde esta acusación.</div>';
        }, function (e) {
            accuseResult.innerHTML = '<div class="accuse-warning">Error: ' + e.message + '</div>';
        });
    }

    accuseSubmitBtn.addEventListener('click', submitAccusation);
    accuseInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { submitAccusation(); }
    });

    // ---- Close modals with Escape ----
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') { return; }
        if (!queryModal.classList.contains('hidden')) { closeModal(queryModal); }
        if (!accuseModal.classList.contains('hidden')) { closeModal(accuseModal); }
    });
})();
