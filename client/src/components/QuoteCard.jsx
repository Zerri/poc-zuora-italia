// client/src/components/QuoteCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  Tag,
  Divider,
  Box,
  Button,
  IconButton,
  VaporIcon
} from "@vapor/v3-components";
import { faPen } from "@fortawesome/pro-regular-svg-icons/faPen";
import { faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons/faEllipsisVertical";

/**
 * @component QuoteCard
 * @description Card che mostra i dettagli di un preventivo con azioni disponibili
 * 
 * @param {Object} quote - I dati del preventivo da visualizzare
 * @param {Function} onOpenDrawer - Funzione chiamata quando si clicca sui dettagli
 * @param {Function} calculateQuoteValue - Funzione per calcolare il valore del preventivo
 * @param {Function} formatDate - Funzione per formattare le date
 * @param {Function} formatCurrency - Funzione per formattare la valuta
 * @param {Function} getStatusTagType - Funzione per determinare il tipo di tag dello stato
 * @param {Function} getStatusTagVariant - Funzione per determinare la variante del tag dello stato
 * @param {Function} getTypeTagVariant - Funzione per determinare la variante del tag del tipo
 * @param {Object} statusTranslations - Oggetto con le traduzioni degli stati
 * @param {Object} typeTranslations - Oggetto con le traduzioni dei tipi
 */
function QuoteCard({ 
  quote,
  onOpenDrawer,
  calculateQuoteValue,
  formatDate,
  formatCurrency,
  getStatusTagType,
  getStatusTagVariant,
  getTypeTagVariant,
  statusTranslations,
  typeTranslations
}) {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: 1,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Header con nome cliente */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1" component="h2" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
            {quote.customer.name}
          </Typography>
          {/* Tags sotto il titolo */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
            <Tag 
              label={typeTranslations[quote.type]} 
              type="warning"
              size="small"
              variant={getTypeTagVariant(quote.type)}
            />
            <Tag 
              label={statusTranslations[quote.status]} 
              type={getStatusTagType(quote.status)}
              size="small"
              variant={getStatusTagVariant(quote.status)}
            />
          </Box>
        </Box>
        
        {/* Settore e numero preventivo */}
        <Box sx={{ mb: 1.5, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {quote.customer.sector}
          </Typography>
          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
            Preventivo #{quote.number}
          </Typography>
        </Box>
        
        {/* Informazioni compatte */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 1,
          px: 1.5,
          bgcolor: 'grey.50',
          borderRadius: 1,
          mb: 1.5
        }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Creato il
            </Typography>
            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
              {formatDate(quote.createdAt)}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Valore
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
              {formatCurrency(quote.products && quote.products.length > 0 ? calculateQuoteValue(quote.products) : quote.value)}/anno
            </Typography>
          </Box>
        </Box>
        
        {/* Azioni */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            fullWidth
            component={Link}
            to={`/quote/${quote._id}`}
            startIcon={<VaporIcon icon={faPen} />}
            sx={{ fontSize: '0.9rem', py: 0.75 }}
          >
            Modifica
          </Button>
          <IconButton 
            variant="outlined" 
            color="primary"
            size="small"
            onClick={() => onOpenDrawer(quote)}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            <VaporIcon icon={faEllipsisVertical} size="lg" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default QuoteCard;