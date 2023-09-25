const db = require('../config/db');

async function insertCountries() {
    const countries = [
        { name: 'Venezuela', iso_code: 'VE' },
        { name: 'Vietnam', iso_code: 'VN' },
        { name: 'Yemen', iso_code: 'YE' },
        { name: 'Zambia', iso_code: 'ZM' },
        { name: 'Zimbabwe', iso_code: 'ZW' },
    ];
    try {
        for (const country of countries) {
            await db.query(
                'INSERT INTO countries (name, iso_code) VALUES ($1, $2)',
                [country.name, country.iso_code],
            );
        }
        console.log('Países agregados a la tabla countries');
    } catch (error) {
        console.error('Error al agregar países:', error);
    }
}

async function insertRegions() {
    try {
        const response = await db.query(
            'SELECT country_id FROM "public".countries WHERE iso_code = $1',
            ['CL'],
        );

        const { country_id } = response.rows[0];

        console.log(country_id);

        const regions = [
            { name: 'Arica y Parinacota', fk_country_id: country_id },
            { name: 'Tarapacá', fk_country_id: country_id },
            { name: 'Antofagasta', fk_country_id: country_id },
            { name: 'Atacama', fk_country_id: country_id },
            { name: 'Coquimbo', fk_country_id: country_id },
            { name: 'Valparaíso', fk_country_id: country_id },
            { name: 'Metropolitana de Santiago', fk_country_id: country_id },
            {
                name: "Libertador General Bernardo O'Higgins",
                fk_country_id: country_id,
            },
            { name: 'Maule', fk_country_id: country_id },
            { name: 'Ñuble', fk_country_id: country_id },
            { name: 'Biobío', fk_country_id: country_id },
            { name: 'Araucanía', fk_country_id: country_id },
            { name: 'Los Ríos', fk_country_id: country_id },
            { name: 'Los Lagos', fk_country_id: country_id },
            {
                name: 'Aysén del General Carlos Ibáñez del Campo',
                fk_country_id: country_id,
            },
            {
                name: 'Magallanes y de la Antártica Chilena',
                fk_country_id: country_id,
            },
        ];

        for (const region of regions) {
            await db.query(
                'INSERT INTO regions (name, fk_country_id) VALUES ($1, $2)',
                [region.name, region.fk_country_id],
            );
        }
        console.log('Regiones agregadas a la tabla regions');
    } catch (error) {
        console.error('Error al agregar regiones:', error);
    }
}

async function insertMunicipalities() {
    const regionId = 19;

    const municipalityNames = [
        'Antártica',
        'Cabo de Hornos',
        'Laguna Blanca',
        'Punta Arenas',
        'Río Verde',
        'San Gregorio',
        'Porvenir',
        'Primavera',
        'Timaukel',
        'Natales',
        'Torres del Paine',
    ];

    try {
        for (const name of municipalityNames) {
            await db.query(
                'INSERT INTO "public".municipalities (name, fk_region_id) VALUES ($1, $2)',
                [name, regionId],
            );
        }
        console.log(
            `Comunas agregadas a la tabla municipalities para la región con ID ${regionId}`,
        );
    } catch (error) {
        console.error(
            `Error al agregar comunas para la región con ID ${regionId}:`,
            error,
        );
    }
}

module.exports = { insertCountries, insertRegions, insertMunicipalities };
