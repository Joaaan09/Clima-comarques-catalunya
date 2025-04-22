$(document).ready(function () {
    const apiUrl = 'https://static-m.meteo.cat/content/opendata/ctermini_comarcal.xml';
    let comarques = new Set(); // Utilitzarem Set per evitar duplicats de les comarques

    // Obtenir totes les dades per omplir el selector
    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'xml', 
        success: function (data) {
            $(data).find('comarca').each(function () {
                // Obtemin el nom i el id de cada comarca
                const nom = $(this).attr('nomCOMARCA');
                const id = $(this).attr('id');
                if (nom) {
                    comarques.add({ id, nom }); // Ho afegim al array de comarques
                }
            });

            const comarcaSelect = $('#comarca-select');
            // Afegim les opcions
            Array.from(comarques)
                .forEach(comarca => {
                    comarcaSelect.append(`<option value="${comarca.id}">${comarca.nom}</option>`);
                });

            // Guardem les dades en una variable global per utilitzar-les després 
            window.weatherXML = data;
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });

    // Canvi d'estació seleccionada
    $('#comarca-select').on('change', function () {
        const idComarca = $(this).val();
        if (idComarca) {
            // Cridem a la funció que mostrará les dades
            mostrarDades(idComarca);
        } else {
            $('#weather-data').empty();
        }
    });

    // Funció per mostrar les dades de la comarca seleccionada
    function mostrarDades(idComarca) {
        // Busquem la comarca seleccionada a les dades XML
        const prediccio = $(window.weatherXML).find(`prediccio[idcomarca="${idComarca}"]`);
        
        // Comprovem si hi ha dades
        if (prediccio.length > 0) {
            const today = $(prediccio).find('variable').first();
            const comarcaNom = $('#comarca-select option:selected').text();
            const tempmax = today.attr('tempmax');
            const tempmin = today.attr('tempmin');

            $('#weather-data').html(`
                <h2>Comarca: ${comarcaNom}</h2>
                <p>Temperatura màxima: ${tempmax || 'No disponible'}°C</p>
                <p>Temperatura mínima: ${tempmin || 'No disponible'}°C</p>
            `);
        } else {
            $('#weather-data').html('<p>No hi ha dades disponibles per aquesta comarca</p>');
        }
    }
});
