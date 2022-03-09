import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const formatDate = (dateString: string) => {
  const dateToFormat = new Date(dateString);
  return format(dateToFormat, 'dd MMM yyyy', { locale: ptBR });
};
