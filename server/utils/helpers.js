// File: server/utils/helpers.js

/**
 * Funzione di formattazione date
 * @param {Date} date - La data da formattare
 * @returns {String} Data formattata
 */
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formatta un valore numerico come valuta Euro
 * @param {Number} value - Il valore da formattare
 * @returns {String} Valore formattato come Euro
 */
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

/**
 * Capitalizza la prima lettera di una stringa
 * @param {String} string - La stringa da capitalizzare
 * @returns {String} Stringa con la prima lettera maiuscola
 */
const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

module.exports = {
  formatDate,
  formatCurrency,
  capitalize
};