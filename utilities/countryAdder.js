const db = require('../config/db');

const countries = [
    { name: 'Afghanistan', iso_code: 'AF' },
    { name: 'Albania', iso_code: 'AL' },
    { name: 'Algeria', iso_code: 'DZ' },
    { name: 'Andorra', iso_code: 'AD' },
    { name: 'Angola', iso_code: 'AO' },
    { name: 'Antigua and Barbuda', iso_code: 'AG' },
    { name: 'Argentina', iso_code: 'AR' },
    { name: 'Armenia', iso_code: 'AM' },
    { name: 'Australia', iso_code: 'AU' },
    { name: 'Austria', iso_code: 'AT' },
    { name: 'Azerbaijan', iso_code: 'AZ' },
    { name: 'Bahamas', iso_code: 'BS' },
    { name: 'Bahrain', iso_code: 'BH' },
    { name: 'Bangladesh', iso_code: 'BD' },
    { name: 'Barbados', iso_code: 'BB' },
    { name: 'Belarus', iso_code: 'BY' },
    { name: 'Belgium', iso_code: 'BE' },
    { name: 'Belize', iso_code: 'BZ' },
    { name: 'Benin', iso_code: 'BJ' },
    { name: 'Bhutan', iso_code: 'BT' },
    { name: 'Bolivia', iso_code: 'BO' },
    { name: 'Bosnia and Herzegovina', iso_code: 'BA' },
    { name: 'Botswana', iso_code: 'BW' },
    { name: 'Brazil', iso_code: 'BR' },
    { name: 'Brunei', iso_code: 'BN' },
    { name: 'Bulgaria', iso_code: 'BG' },
    { name: 'Burkina Faso', iso_code: 'BF' },
    { name: 'Burundi', iso_code: 'BI' },
    { name: 'Cabo Verde', iso_code: 'CV' },
    { name: 'Cambodia', iso_code: 'KH' },
    { name: 'Cameroon', iso_code: 'CM' },
    { name: 'Canada', iso_code: 'CA' },
    { name: 'Central African Republic', iso_code: 'CF' },
    { name: 'Chad', iso_code: 'TD' },
    { name: 'Chile', iso_code: 'CL' },
    { name: 'China', iso_code: 'CN' },
    { name: 'Colombia', iso_code: 'CO' },
    { name: 'Comoros', iso_code: 'KM' },
    { name: 'Congo (Congo-Brazzaville)', iso_code: 'CG' },
    { name: 'Costa Rica', iso_code: 'CR' },
    { name: 'Croatia', iso_code: 'HR' },
    { name: 'Cuba', iso_code: 'CU' },
    { name: 'Cyprus', iso_code: 'CY' },
    { name: 'Czechia (Czech Republic)', iso_code: 'CZ' },
    { name: 'Democratic Republic of the Congo', iso_code: 'CD' },
    { name: 'Denmark', iso_code: 'DK' },
];

async function insertCountries() {
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

module.exports = { insertCountries };
