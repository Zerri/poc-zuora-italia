// client/src/data/migrationMockDataFromQuote.js
// Dati mock per la pagina di migrazione basati su un preventivo reale

const MOCK_DATA = {
  subscriptionId: "6826e8f0f9e8cf54bb685fb3",
  customer: {
    email: "info@cliente3.com",
    name: "Cliente 3 - FILIPPI DOTT.SSA CRISTINA",
    sector: "Studio professionale",
    id: "6826e8d0fbca490f89927220"
  },
  sourceProducts: [
    {
      id: "8ad0869c95911c6e0195a35866271652",
      name: "Spid Professionale 2022 LS-7958 PoC",
      description: "Servizio di identità digitale per professionisti",
      category: "professional",
      price: 250, // Prezzo di listino teorico
      customerPrice: 225, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "9336bebf62895911c4f5a358667200a9",
        name: "Full Subscription SAAS",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "SAAS"
      },
      charges: [
        {
          id: "9336bebf62895911c4f5a35866ab00aa",
          name: "Canone x PDL",
          type: "Recurring",
          model: "Volume",
          value: 1,
          calculatedPrice: 225
        }
      ]
    },
    {
      id: "8ad09124959133640195a3638a8f06af",
      name: "Tasi LS-7879 PoC",
      description: "Gestione tasse sui servizi indivisibili",
      category: "professional",
      price: 460, // Prezzo di listino teorico
      customerPrice: 413.58, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "93360368c2d959133445a3638af50033",
        name: "Licanza + Canone On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "93360368c2d959133445a3638b170034",
          name: "Canone x PDL",
          type: "Recurring",
          model: "Volume",
          value: 6,
          calculatedPrice: 413.58
        }
      ]
    },
    {
      id: "8ad0869c95911c6e0195a36b5ad71b01",
      name: "Bundle Contabilita e Dichiarazioni LS-7731 PoC",
      description: "Soluzione completa per gestione contabile e dichiarativa",
      category: "enterprise",
      price: 6000, // Prezzo di listino teorico
      customerPrice: 5426.65, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "9336bebf63a95911c4f5a36b5b130037",
        name: "Licanza + Canone On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "9336bebf63a95911c4f5a36b5b290038",
          name: "Canone x PDL",
          type: "Recurring",
          model: "Volume",
          value: 6,
          calculatedPrice: 5426.65
        }
      ]
    },
    {
      id: "8ad09124959133640195a3717c170a18",
      name: "Database C-Tree Lynfa Studio LS-7308 PoC",
      description: "Database ottimizzato per Lynfa Studio",
      category: "enterprise",
      price: 6500, // Prezzo di listino teorico
      customerPrice: 6053.6, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "93360368c21959133445a3717c3b0071",
        name: "Full Subscription On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "93360368c21959133445a3717c5c0072",
          name: "Canone Per Unit",
          type: "Recurring",
          model: "PerUnit",
          value: 161,
          calculatedPrice: 6053.6
        }
      ]
    },
    {
      id: "8ad0869c95911c6e0195a375aa6f1fcb",
      name: "Polyedro per Utenti Lynfa Studio LS-7300 PoC",
      description: "Piattaforma Polyedro integrata per Lynfa Studio",
      category: "enterprise",
      price: 550, // Prezzo di listino teorico
      customerPrice: 526.4, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "9336bebf63a95911c4f5a375aab50055",
        name: "Licenza + Canone On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "9336bebf63a95911c4f5a375aacd0056",
          name: "Canone Per Unit",
          type: "Recurring",
          model: "PerUnit",
          value: 7,
          calculatedPrice: 526.4
        }
      ]
    },
    {
      id: "8ad09124959133640195a36e552808c3",
      name: "Gestione Leasing Finanziario LS-7419 PoC",
      description: "Modulo per la gestione dei contratti di leasing",
      category: "professional",
      price: 95, // Prezzo di listino teorico
      customerPrice: 87.73, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "93360368c28959133445a36e55910015",
        name: "Licanza + Canone On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "93360368c28959133445a36e55af0016",
          name: "Canone x PDL",
          type: "Recurring",
          model: "Volume",
          value: 6,
          calculatedPrice: 87.73
        }
      ]
    },
    {
      id: "8ad086fa95911c5d0195a355aa7512e6",
      name: "Soglia Max Ore Teleassistenza TELED-TEAMSYSTEM PoC",
      description: "Pacchetto ore supporto tecnico",
      category: "cross",
      price: 250, // Prezzo di listino teorico
      customerPrice: 225.59, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "9336383e22d95911c3f5a355aaf10020",
        name: "Full Subscription On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "9336383e22d95911c3f5a355aaff0021",
          name: "Canone Flat Fee",
          type: "Recurring",
          model: "FlatFee",
          value: 0,
          calculatedPrice: 225.59
        }
      ]
    },
    {
      id: "8ad093f7959133870195a35cccfb7e97",
      name: "Certificazione Unica Completa LS-7890 PoC",
      description: "Gestione certificazioni uniche per dipendenti e autonomi",
      category: "professional",
      price: 450, // Prezzo di listino teorico
      customerPrice: 430, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "933616628da959133685a35ccda70031",
        name: "LTA On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "933616628da959133685a35ccdc80032",
          name: "Canone x PDL",
          type: "Recurring",
          model: "Volume",
          value: 7,
          calculatedPrice: 430
        }
      ]
    },
    {
      id: "8ad086fa958d2d30019590018879564c",
      name: "Contabilità Entry Online LS-85009 PoC",
      description: "Soluzione cloud per contabilità base",
      category: "professional",
      price: 650, // Prezzo di listino teorico
      customerPrice: 614.1, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "9336383e2cb958d2d0f5900188c90076",
        name: "Licenza + Canone On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "9336383e2cb958d2d0f5900188d90077",
          name: "Canone Flat Fee",
          type: "Recurring",
          model: "FlatFee",
          value: 0,
          calculatedPrice: 614.1
        }
      ]
    },
    {
      id: "8ad0869c95911c6e0195a36853601ab4",
      name: "Comunicazione Spese Sanitarie LS-7447 PoC",
      description: "Modulo per invio telematico spese sanitarie",
      category: "professional",
      price: 200, // Prezzo di listino teorico
      customerPrice: 187.99, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "9336bebf6e695911c4f5a36853780024",
        name: "Licenza + Canone On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "9336bebf6e695911c4f5a368538e0025",
          name: "Canone Flat Fee",
          type: "Recurring",
          model: "FlatFee",
          value: 0,
          calculatedPrice: 187.99
        }
      ]
    },
    {
      id: "8ad0869c95911c6e0195a3609ab71964",
      name: "Concolle Telematici Gest Integrata Comuni LS-7823 PoC",
      description: "Gestione integrata per enti pubblici",
      category: "professional",
      price: 280, // Prezzo di listino teorico
      customerPrice: 250.66, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "9336bebf6eb95911c4f5a3609ae8002d",
        name: "Licenza + Canone On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "9336bebf6eb95911c4f5a3609b02002e",
          name: "Canone Flat Fee",
          type: "Recurring",
          model: "FlatFee",
          value: 0,
          calculatedPrice: 250.66
        }
      ]
    },
    {
      id: "8ad093f7958d56b4019590064ba0572d",
      name: "Gestione Studio Light LS-85029 PoC",
      description: "Soluzione base per la gestione dello studio professionale",
      category: "professional",
      price: 460, // Prezzo di listino teorico
      customerPrice: 438.65, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "93360368c28958d56865900ff0240035",
        name: "Licenza + Canone On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "93360368c28958d56865900ff07d0036",
          name: "Da 3 Pdl in poi",
          type: "Recurring",
          model: "PerUnit",
          value: 1,
          calculatedPrice: 20
        },
        {
          id: "93360368c28958d56865900ff0b9003b",
          name: "Canone Flat Fee",
          type: "Recurring",
          model: "Volume",
          value: 1,
          calculatedPrice: 418.65
        }
      ]
    },
    {
      id: "8ad0869c958d2d3b01958fee165c5075",
      name: "Kit Corrispettivi LS-85535 PoC",
      description: "Soluzione per gestione corrispettivi elettronici",
      category: "professional",
      price: 300, // Prezzo di listino teorico
      customerPrice: 285, // Prezzo effettivo nel preventivo
      quantity: 1,
      ratePlan: {
        id: "9336383e2cb958d2d0f58ff2d3d70052",
        name: "LTA On Premise",
        description: "Rateo da data attivazione a 31 dic",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "9336383e2cb958d2d0f58ff2d3ea0053",
          name: "Canone x PDL",
          type: "Recurring",
          model: "Volume",
          value: 2,
          calculatedPrice: 285
        }
      ]
    }
  ],
  migrationPaths: {
    saas: {
      id: "saas",
      title: "Cloud SaaS",
      description: "Migrazione verso servizi cloud completamente gestiti",
      benefits: [
        "Nessuna gestione dell'infrastruttura",
        "Aggiornamenti automatici",
        "Scalabilità on-demand"
      ],
      totalValue: 16900,
      percentChange: "+11.4%", // Calcolato rispetto al totale corrente
      products: [
        {
          id: "cloud-101",
          name: "TeamSystem Professional Cloud",
          description: "Soluzione completa in cloud per studi professionali",
          category: "enterprise",
          price: 9500,
          customerPrice: 9500, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-cloud-101",
            name: "Professional Cloud Premium",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-cloud-101",
              name: "Canone Base Cloud",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 9500
            }
          ],
          replacesProductId: "8ad0869c95911c6e0195a36b5ad71b01" 
        },
        {
          id: "cloud-102",
          name: "TeamSystem Contabilità Cloud",
          description: "Gestione contabile professionale in cloud",
          category: "professional",
          price: 3800,
          customerPrice: 3800, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-cloud-102",
            name: "Contabilità Cloud Premium",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-cloud-102",
              name: "Canone Contabilità Cloud",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 3800
            }
          ],
          replacesProductId: "8ad086fa958d2d30019590018879564c"
        },
        {
          id: "cloud-103",
          name: "TeamSystem Dichiarazioni Cloud",
          description: "Soluzione dichiarativa completa in cloud",
          category: "professional",
          price: 2600,
          customerPrice: 2600, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-cloud-103",
            name: "Dichiarazioni Cloud",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-cloud-103",
              name: "Canone Dichiarazioni Cloud",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 2600
            }
          ],
          replacesProductId: "8ad093f7959133870195a35cccfb7e97"
        },
        {
          id: "cloud-104",
          name: "TeamSystem Certification Cloud",
          description: "Gestione certificazioni in cloud con invio telematico",
          category: "professional",
          price: 1000,
          customerPrice: 1000, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-cloud-104",
            name: "Certification Cloud",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-cloud-104",
              name: "Canone Certification Cloud",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 1000
            }
          ],
          replacesProductId: "8ad0869c95911c6e0195a36853601ab4"
        }
      ]
    },
    iaas: {
      id: "iaas",
      title: "Cloud IaaS",
      description: "Migrazione verso infrastruttura cloud self-managed",
      benefits: [
        "Maggiore controllo",
        "Personalizzazione avanzata",
        "Utilizzo dell'infrastruttura esistente"
      ],
      totalValue: 14500,
      percentChange: "-4.4%", // Calcolato rispetto al totale corrente
      products: [
        {
          id: "iaas-201",
          name: "TeamSystem Professional IaaS",
          description: "Soluzione completa su infrastruttura cloud",
          category: "enterprise",
          price: 8200,
          customerPrice: 8200, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-iaas-201",
            name: "Professional IaaS Premium",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-iaas-201",
              name: "Canone Base IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 8200
            }
          ],
          replacesProductId: "8ad0869c95911c6e0195a36b5ad71b01"
        },
        {
          id: "iaas-202",
          name: "TeamSystem Contabilità IaaS",
          description: "Gestione contabile professionale su infrastruttura cloud",
          category: "professional",
          price: 3400,
          customerPrice: 3400, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-iaas-202",
            name: "Contabilità IaaS Premium",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-iaas-202",
              name: "Canone Contabilità IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 3400
            }
          ],
          replacesProductId: "8ad086fa958d2d30019590018879564c"
        },
        {
          id: "iaas-203",
          name: "TeamSystem Dichiarazioni IaaS",
          description: "Soluzione dichiarativa completa su infrastruttura cloud",
          category: "professional",
          price: 2100,
          customerPrice: 2100, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-iaas-203",
            name: "Dichiarazioni IaaS",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-iaas-203",
              name: "Canone Dichiarazioni IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 2100
            }
          ],
          replacesProductId: "8ad093f7959133870195a35cccfb7e97"
        },
        {
          id: "iaas-204",
          name: "TeamSystem Migration Tool",
          description: "Strumento di migrazione dati per infrastruttura cloud",
          category: "cross",
          price: 800,
          customerPrice: 800, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-iaas-204",
            name: "Migration Tool",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-iaas-204",
              name: "Licenza Migration Tool",
              type: "OneTime",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 800
            }
          ]
        }
      ]
    }
  },
  nonMigrableProductIds: [
    "8ad09124959133640195a3717c170a18", // Database C-Tree Lynfa Studio (prodotto legacy)
    "8ad086fa95911c5d0195a355aa7512e6"  // Teleassistenza (servizio che sarà sostituito da nuove modalità di supporto)
  ],
  nonMigrableReasons: {
    "8ad09124959133640195a3717c170a18": "Database proprietario non supportato nelle nuove versioni cloud",
    "8ad086fa95911c5d0195a355aa7512e6": "Servizio di supporto obsoleto che sarà sostituito da nuove modalità di assistenza cloud"
  },
  summary: {
    currentValue: 15164.95, // Valore totale del preventivo originale
    currentCustomerValue: 15164.95, // Stesso valore (i prezzi cliente sono già scontati nel preventivo)
    saasValue: 16900,
    iaasValue: 14500
  }
};

export default MOCK_DATA;