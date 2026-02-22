export const formatKwanza = (value: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
  })
    .format(value)
    .replace('AOA', 'Kz');
};