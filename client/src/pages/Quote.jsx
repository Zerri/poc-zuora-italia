import React, { useState } from 'react';
import { 
VaporPage,
Typography,
Button,
Box,
DatePicker,
TextField,
Switch,
FormControl,
FormControlLabel,
Grid,
IconButton,
ExtendedTabs,
ExtendedTab,
Tab,
Select,
MenuItem,
LocalizationProvider,
AdapterDayjs,
VaporToolbar,
Card,
CardContent,
Divider,
Tag,
Drawer,
Title,
VaporIcon
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowLeft";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faFloppyDisk } from "@fortawesome/pro-regular-svg-icons/faFloppyDisk";
import { faPaperPlane } from "@fortawesome/pro-regular-svg-icons/faPaperPlane";
import { Link } from 'react-router-dom';

/**
* @component Quote
* @description Componente per la creazione di un nuovo preventivo
*/
function Quote() {
const [activeTab, setActiveTab] = useState(0);

// Gestione cambio tab
const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};

// Stati per i campi del form
const [stato, setStato] = useState('');
const [dataCreazione, setDataCreazione] = useState(null);
const [dataModifica, setDataModifica] = useState(null);
const [note, setNote] = useState('');
const [dataValidita, setDataValidita] = useState(null);
const [dataInizioGaranzia, setDataInizioGaranzia] = useState(null);
const [mesiCancellazione, setMesiCancellazione] = useState('');
const [periodicita, setPeriodicita] = useState('');
const [rinnovabile, setRinnovabile] = useState(false);
const [istat, setIstat] = useState(false);
const [priceBlocked, setPriceBlocked] = useState(false);

// State per gestione drawer
const [drawerOpen, setDrawerOpen] = useState(false);
const [selectedArticle, setSelectedArticle] = useState(null);

// Dati di esempio per gli articoli selezionati
const selectedArticles = [
  {
    id: 1,
    nome: "TS Digital Invoice B2BFAT PoC",
    descrizione: "Sistema di fatturazione elettronica per aziende",
    categoria: "Software",
    caratteristiche: [
      "Conforme alla normativa vigente",
      "Integrazione con gestionali",
      "Dashboard di monitoraggio"
    ],
    prezzo: 1299.99
  },
  {
    id: 2,
    nome: "Cloud Storage Premium",
    descrizione: "Soluzione di archiviazione sicura su cloud",
    categoria: "Servizio",
    caratteristiche: [
      "200GB di spazio",
      "Crittografia avanzata",
      "Backup automatici"
    ],
    prezzo: 499.50
  },
  {
    id: 3,
    nome: "Licenza Antivirus Enterprise",
    descrizione: "Protezione completa per la rete aziendale",
    categoria: "Licenza",
    caratteristiche: [
      "Protezione in tempo reale",
      "Gestione centralizzata",
      "Scansione programmata"
    ],
    prezzo: 899.00
  },
  {
    id: 4,
    nome: "Supporto Tecnico Premium",
    descrizione: "Assistenza tecnica prioritaria 24/7",
    categoria: "Supporto",
    caratteristiche: [
      "Risposta entro 1 ora",
      "Supporto telefonico dedicato",
      "Intervento on-site"
    ],
    prezzo: 1499.00
  },
  {
    id: 5,
    nome: "Server Virtuale Dedicato",
    descrizione: "Infrastruttura server virtualizzata su cloud",
    categoria: "Hardware",
    caratteristiche: [
      "8 core CPU",
      "16GB RAM",
      "500GB SSD",
      "Backup giornaliero"
    ],
    prezzo: 1899.00
  }
];

// Funzione per formattare i prezzi
const formatPrice = (price) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
};

// Funzione per tradurre le categorie
const translateCategory = (category) => {
  return category; // In un'app reale potrebbe mappare a traduzioni
};

// Funzione per determinare il tipo di etichetta in base alla categoria
const getCategoryTagType = (category) => {
  const categoryMap = {
    'Software': 'tone1',
    'Servizio': 'tone3',
    'Licenza': 'tone5',
    'Supporto': 'tone7',
    'Hardware': 'tone9'
  };
  return categoryMap[category] || 'tone1';
};

// Funzione per aprire il drawer con l'articolo selezionato
const handleOpenDrawer = (article) => {
  setSelectedArticle(article);
  setDrawerOpen(true);
};

// Funzione per chiudere il drawer
const handleCloseDrawer = () => {
  setDrawerOpen(false);
};

return (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <VaporPage>
      <Title
        leftItems={[
          <IconButton color="primary" size="small">
            <VaporIcon icon={faArrowLeft} size="xl" />
          </IconButton>
        ]}
        rightItems={[
          <Button key="1" size="small" variant="contained" startIcon={<VaporIcon icon={faPlus} />}>Aggiungi articolo</Button>,
          <Button key="1" size="small" variant="outlined" startIcon={<VaporIcon icon={faFloppyDisk} />}>Salva preventivo</Button>,
          <Button key="1" size="small" variant="outlined" startIcon={<VaporIcon icon={faPaperPlane} />}>Invia al cliente</Button>,
          <IconButton key="2" size="small">
            <VaporIcon icon={faEllipsisVertical} size="xl" />
          </IconButton>
        ]}
        size="small"
        title="Preventivo"
      />
      <VaporPage.Section>
        <ExtendedTabs value={activeTab} onChange={handleTabChange} size="small" variant="standard">
          <ExtendedTab label="Preventivo" />
          <ExtendedTab label="Cliente" />
          <ExtendedTab label="Documenti" />
        </ExtendedTabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
              Informazioni generali
            </Typography>
            
            <Grid container spacing={3}>
              {/* Prima riga (5 colonne) */}
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom>Stato</Typography>
                  <Select
                    value={stato}
                    onChange={(e) => setStato(e.target.value)}
                    displayEmpty
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">Seleziona stato</MenuItem>
                    <MenuItem value="bozza">Bozza</MenuItem>
                    <MenuItem value="inviato">Inviato</MenuItem>
                    <MenuItem value="accettato">Accettato</MenuItem>
                    <MenuItem value="rifiutato">Rifiutato</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom>Data di creazione</Typography>
                  <DatePicker 
                    value={dataCreazione} 
                    onChange={newValue => setDataCreazione(newValue)} 
                    format="DD/MM/YYYY"
                    views={["day", "year", "month"]}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom>Data ultima modifica</Typography>
                  <DatePicker 
                    value={dataModifica} 
                    onChange={newValue => setDataModifica(newValue)} 
                    format="DD/MM/YYYY"
                    views={["day", "year", "month"]}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom>Data validità preventivo</Typography>
                  <DatePicker 
                    value={dataValidita} 
                    onChange={newValue => setDataValidita(newValue)} 
                    format="DD/MM/YYYY"
                    views={["day", "year", "month"]}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom>Data inizio garanzia</Typography>
                  <DatePicker 
                    value={dataInizioGaranzia} 
                    onChange={newValue => setDataInizioGaranzia(newValue)} 
                    format="DD/MM/YYYY"
                    views={["day", "year", "month"]}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </FormControl>
              </Grid>

              {/* Seconda riga (5 colonne) */}
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom>Mesi prima della cancellazione</Typography>
                  <Select
                    value={mesiCancellazione}
                    onChange={(e) => setMesiCancellazione(e.target.value)}
                    displayEmpty
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">Seleziona</MenuItem>
                    <MenuItem value="1">1 mese</MenuItem>
                    <MenuItem value="3">3 mesi</MenuItem>
                    <MenuItem value="6">6 mesi</MenuItem>
                    <MenuItem value="12">12 mesi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom>Periodicità fatturazione</Typography>
                  <Select
                    value={periodicita}
                    onChange={(e) => setPeriodicita(e.target.value)}
                    displayEmpty
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">Seleziona</MenuItem>
                    <MenuItem value="mensile">Mensile</MenuItem>
                    <MenuItem value="trimestrale">Trimestrale</MenuItem>
                    <MenuItem value="semestrale">Semestrale</MenuItem>
                    <MenuItem value="annuale">Annuale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={rinnovabile}
                        onChange={(e) => setRinnovabile(e.target.checked)}
                      />
                    }
                    label="Rinnovabile"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={istat}
                        onChange={(e) => setIstat(e.target.checked)}
                      />
                    }
                    label="Istat"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={priceBlocked}
                        onChange={(e) => setPriceBlocked(e.target.checked)}
                      />
                    }
                    label="Price blocked"
                  />
                </Box>
              </Grid>
              
              {/* Note aggiuntive (occupa 2 colonne su 5) */}
              <Grid item xs={12} sm={12} md={4.8}>
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom>Note aggiuntive</Typography>
                  <TextField
                    multiline
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth
                    placeholder="Inserisci eventuali note aggiuntive..."
                  />
                </FormControl>
              </Grid>
            </Grid>
            
            {/* Sezione per gli articoli selezionati */}
            <Box sx={{ mt: 6, mb: 3 }}>
              <Typography variant="h6" component="h2" fontWeight="bold">
                Articoli selezionati
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {selectedArticles.map((article) => (
                  <Grid item xs={12} md={6} lg={3} key={article.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      boxShadow: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="subtitle1" component="h3" fontWeight="bold" sx={{ flex: 1 }}>
                            {article.nome}
                          </Typography>
                          <Tag 
                            label={translateCategory(article.categoria)} 
                            type={getCategoryTagType(article.categoria)}
                            size="small"
                            variant='duotone'
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ minHeight: '40px' }}>
                          {article.descrizione}
                        </Typography>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Caratteristiche principali:
                          </Typography>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {article.caratteristiche && article.caratteristiche.slice(0, 2).map((feature, index) => (
                              <Typography component="li" variant="body2" key={index}>
                                {feature}
                              </Typography>
                            ))}
                            {article.caratteristiche && article.caratteristiche.length > 2 && (
                              <Typography component="li" variant="body2" fontStyle="italic">
                                e altro...
                              </Typography>
                            )}
                          </ul>
                        </Box>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Prezzo base
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {formatPrice(article.prezzo)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'flex-end' }}>
                          <Button 
                            variant="outlined" 
                            color="primary"
                            size="small"
                            onClick={() => handleOpenDrawer(article)}
                          >
                            Dettagli
                          </Button>
                          
                          <Button 
                            variant="contained" 
                            color="error"
                            size="small"
                          >
                            Rimuovi
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
        
        {/* Altri tab - da implementare */}
        {activeTab === 1 && (
          <Typography sx={{ mt: 2 }}>Contenuto del tab Cliente - da implementare</Typography>
        )}
        
        {activeTab === 2 && (
          <Typography sx={{ mt: 2 }}>Contenuto del tab Documenti - da implementare</Typography>
        )}
      </VaporPage.Section>
    </VaporPage>
    
    {/* Drawer con dettagli articolo */}
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={handleCloseDrawer}
      width="30vw"
      hideBackdrop={false}
      sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
    >
      {selectedArticle && (
        <>
          <Title
            title={selectedArticle.nome}
            description={selectedArticle.categoria}
            divider
            rightItems={[
              <IconButton size="small" variant='outlined' onClick={handleCloseDrawer}>
                <VaporIcon icon={faClose} size="xl" />
              </IconButton>
            ]}
          />
          
          <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
            <Typography variant="body1" paragraph>
              {selectedArticle.descrizione}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Caratteristiche dell'articolo
            </Typography>
            
            <ul style={{ paddingLeft: '20px' }}>
              {selectedArticle.caratteristiche && selectedArticle.caratteristiche.map((feature, index) => (
                <Typography component="li" variant="body1" key={index} gutterBottom>
                  {feature}
                </Typography>
              ))}
            </ul>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Prezzo base
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatPrice(selectedArticle.prezzo)}
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              Questo articolo fa parte della categoria {selectedArticle.categoria}.
              Eventuali personalizzazioni o configurazioni aggiuntive possono essere applicate in fase di definizione dell'offerta.
            </Typography>
          </Box>
          
          <VaporToolbar
            contentRight={[
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={handleCloseDrawer}
              >
                Chiudi
              </Button>,
              <Button 
                variant="contained" 
                color="error"
              >
                Rimuovi dall'offerta
              </Button>
            ]}
            size="medium"
            variant="regular"
            withoutAppBar
          />
        </>
      )}
    </Drawer>
  </LocalizationProvider>
);
}

export default Quote;