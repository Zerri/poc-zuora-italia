// client/src/data/migrationMockData.js
// Dati mock per la pagina di migrazione

const MOCK_DATA = {
  subscriptionId: "mock-subscription-123",
  customer: {
    name: "Acme Corporation",
    sector: "Manifatturiero",
    email: "info@acme.com",
    id: "customer-123"
  },
  sourceProducts: [
    {
      id: "prod-001",
      name: "TeamSystem Enterprise",
      description: "Soluzione ERP completa per aziende di medie e grandi dimensioni",
      category: "enterprise",
      price: 5000,
      customerPrice: 4500, // Sconto del 10%
      quantity: 1,
      ratePlan: {
        id: "rp-001",
        name: "Enterprise Standard",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "charge-001",
          name: "Licenza Base",
          type: "Recurring",
          model: "FlatFee",
          value: 1,
          calculatedPrice: 5000
        }
      ]
    },
    {
      id: "prod-002",
      name: "TeamSystem CRM",
      description: "Gestione delle relazioni con i clienti integrata",
      category: "professional",
      price: 2500,
      customerPrice: 2250, // Sconto del 10%
      quantity: 1,
      ratePlan: {
        id: "rp-002",
        name: "CRM Professional",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "charge-002",
          name: "Licenza CRM",
          type: "Recurring",
          model: "FlatFee",
          value: 1,
          calculatedPrice: 2500
        }
      ]
    },
    {
      id: "prod-003",
      name: "TeamSystem HR",
      description: "Gestione delle risorse umane",
      category: "hr",
      price: 3000,
      customerPrice: 2400, // Sconto del 20%
      quantity: 1,
      ratePlan: {
        id: "rp-003",
        name: "HR Complete",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "charge-003",
          name: "Licenza HR",
          type: "Recurring",
          model: "FlatFee",
          value: 1,
          calculatedPrice: 3000
        }
      ]
    },
    {
      id: "prod-004",
      name: "TeamSystem Legacy Module",
      description: "Modulo legacy non più supportato",
      price: 1500,
      customerPrice: 1500, // Nessuno sconto
      quantity: 1,
      ratePlan: {
        id: "rp-004",
        name: "Legacy Module",
        Infrastructure__c: "On Premise"
      },
      charges: [
        {
          id: "charge-004",
          name: "Licenza Legacy",
          type: "Recurring",
          model: "FlatFee",
          value: 1,
          calculatedPrice: 1500
        }
      ]
    }
  ],
  migrationPaths: {
    saas: {
      id: "saas",
      title: "TS Studio SaaS",
      description: "Migrazione verso servizi cloud completamente gestiti",
      benefits: [
        "Nessuna gestione dell'infrastruttura",
        "Aggiornamenti automatici",
        "Scalabilità on-demand"
      ],
      totalValue: 11700,
      percentChange: "-2,5%", // Calcolato rispetto al totale corrente (12000)
      products: [
        {
          id: "prod-101",
          name: "TeamSystem Enterprise Cloud",
          description: "Nuova versione cloud della soluzione ERP completa",
          category: "enterprise",
          price: 5500,
          customerPrice: 5500, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-101",
            name: "Enterprise Cloud Premium",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-101",
              name: "Licenza Base Cloud",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 5500
            }
          ],
          replacesProductId: "prod-001" 
        },
        {
          id: "prod-102",
          name: "TeamSystem CRM+",
          description: "Versione migliorata del CRM con nuove funzionalità",
          category: "professional",
          price: 3000,
          customerPrice: 3000, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-102",
            name: "CRM+ Premium",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-102",
              name: "Licenza CRM+",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 3000
            }
          ],
          replacesProductId: "prod-002"
        },
        {
          id: "prod-103",
          name: "TeamSystem HR Cloud",
          description: "Gestione delle risorse umane basata su cloud",
          category: "hr",
          price: 3200,
          customerPrice: 3200, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-103",
            name: "HR Cloud Complete",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "charge-103",
              name: "Licenza HR Cloud",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 3200
            }
          ],
          replacesProductId: "prod-003"
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
      totalValue: 10800,
      percentChange: "-10%", // Calcolato rispetto al totale corrente (12000)
      products: [
        {
          id: "prod-201",
          name: "TeamSystem Enterprise IaaS",
          description: "Versione ERP ottimizzata per infrastruttura cloud",
          category: "enterprise",
          price: 4800,
          customerPrice: 4800, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-201",
            name: "Enterprise IaaS Standard",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-201",
              name: "Licenza Base IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 4800
            }
          ],
          replacesProductId: "prod-001"
        },
        {
          id: "prod-202",
          name: "TeamSystem CRM IaaS",
          description: "CRM con deployment su infrastruttura cloud",
          category: "professional",
          price: 2200,
          customerPrice: 2200, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-202",
            name: "CRM IaaS",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-202",
              name: "Licenza CRM IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 2200
            }
          ],
          replacesProductId: "prod-002"
        },
        {
          id: "prod-203",
          name: "TeamSystem HR IaaS",
          description: "Soluzione HR con deployment IaaS",
          category: "hr",
          price: 2600,
          customerPrice: 2600, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-203",
            name: "HR IaaS",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-203",
              name: "Licenza HR IaaS",
              type: "Recurring",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 2600
            }
          ],
          replacesProductId: "prod-003"
        },
        {
          id: "prod-204",
          name: "TeamSystem Migration Tool",
          description: "Strumento di migrazione dati per infrastruttura cloud",
          category: "cross",
          price: 1200,
          customerPrice: 1200, // Nessuno sconto sul prodotto nuovo
          quantity: 1,
          ratePlan: {
            id: "rp-204",
            name: "Migration Tool",
            Infrastructure__c: "IAAS"
          },
          charges: [
            {
              id: "charge-204",
              name: "Licenza Migration Tool",
              type: "OneTime",
              model: "FlatFee",
              value: 1,
              calculatedPrice: 1200
            }
          ]
        }
      ]
    }
  },
  nonMigrableProductIds: ["prod-004"],
  nonMigrableReasons: {
    "prod-004": "Modulo legacy non supportato nelle nuove versioni"
  },
  summary: {
    currentValue: 12000, // valore di listino: 5000 + 2500 + 3000 + 1500
    currentCustomerValue: 10650, // valore cliente: 4500 + 2250 + 2400 + 1500
    saasValue: 11700,    // 5500 + 3000 + 3200
    iaasValue: 10800     // 4800 + 2200 + 2600 + 1200
  }
};

export default MOCK_DATA;