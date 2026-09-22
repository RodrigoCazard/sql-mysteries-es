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

    // ---- Schema diagram toggle ----
    var showSchemaBtn = document.getElementById('show-schema');
    var schemaImg = document.getElementById('schema-diagram');
    showSchemaBtn.addEventListener('click', function () {
        var isShown = schemaImg.classList.toggle('show');
        showSchemaBtn.textContent = isShown
            ? '◆ Ocultar diagrama del esquema'
            : '◇ Ver diagrama del esquema completo';
    });

    // ---- Table browser (left panel) ----
    var tableListEl = document.getElementById('table-list');
    var tableColumnsEl = document.getElementById('table-columns');
    var activeTableButton = null;

    function renderTableList(names) {
        tableListEl.innerHTML = '';
        names.forEach(function (name) {
            var li = document.createElement('li');
            var btn = document.createElement('button');
            btn.className = 'table-btn';
            btn.textContent = name;
            btn.addEventListener('click', function () {
                if (activeTableButton) { activeTableButton.classList.remove('active'); }
                btn.classList.add('active');
                activeTableButton = btn;
                showTableColumns(name);
            });
            li.appendChild(btn);
            tableListEl.appendChild(li);
        });
    }

    function showTableColumns(tableName) {
        tableColumnsEl.innerHTML = '<div class="loading">Cargando columnas…</div>';
        query('PRAGMA table_info(' + tableName + ');', function (colResults) {
            query('PRAGMA foreign_key_list(' + tableName + ');', function (fkResults) {
                var fkColumns = {};
                if (fkResults.length) {
                    var fkCols = fkResults[0].columns;
                    var fromIdx = fkCols.indexOf('from');
                    var tableIdx = fkCols.indexOf('table');
                    var toIdx = fkCols.indexOf('to');
                    fkResults[0].values.forEach(function (row) {
                        fkColumns[row[fromIdx]] = { table: row[tableIdx], to: row[toIdx] };
                    });
                }

                var cols = colResults.length ? colResults[0].values : [];
                var colNames = colResults.length ? colResults[0].columns : [];
                var nameIdx = colNames.indexOf('name');
                var typeIdx = colNames.indexOf('type');
                var pkIdx = colNames.indexOf('pk');

                var html = '<div class="table-columns-title">' + tableName + '</div><ul class="column-list">';
                cols.forEach(function (row) {
                    var colName = row[nameIdx];
                    var colType = row[typeIdx];
                    var isPk = row[pkIdx] > 0;
                    var fk = fkColumns[colName];
                    var icon = isPk ? '<span class="key-icon" title="Clave primaria">🔑</span>' :
                        fk ? '<span class="fk-icon" title="Referencia a ' + fk.table + '.' + fk.to + '">→</span>' : '<span class="col-spacer"></span>';
                    html += '<li class="' + (isPk ? 'is-pk' : fk ? 'is-fk' : '') + '">' +
                        icon + '<span class="col-name">' + colName + '</span>' +
                        '<span class="col-type">' + colType + '</span></li>';
                });
                html += '</ul>';
                tableColumnsEl.innerHTML = html;
            }, function () {
                tableColumnsEl.innerHTML = '<div class="loading">No se pudo leer la tabla.</div>';
            });
        }, function () {
            tableColumnsEl.innerHTML = '<div class="loading">No se pudo leer la tabla.</div>';
        });
    }

    document.addEventListener('db-ready', function () {
        query('SELECT nombre_tabla FROM tablas;', function (res) {
            var names = res.length ? res[0].values.map(function (row) { return row[0]; }) : [];
            renderTableList(names);
        });
    });

    // ---- Accusation modal ----
    var accuseOpenBtn = document.getElementById('accuse-open');
    var accuseModal = document.getElementById('accuse-modal');
    var accuseCloseBtn = document.getElementById('accuse-close');
    var accuseInput = document.getElementById('accuse-input');
    var accuseSubmitBtn = document.getElementById('accuse-submit');
    var accuseResult = document.getElementById('accuse-result');

    function openModal() {
        accuseModal.classList.remove('hidden');
        accuseInput.focus();
    }
    function closeModal() {
        accuseModal.classList.add('hidden');
    }

    accuseOpenBtn.addEventListener('click', openModal);
    accuseCloseBtn.addEventListener('click', closeModal);
    accuseModal.addEventListener('click', function (e) {
        if (e.target === accuseModal) { closeModal(); }
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
})();
