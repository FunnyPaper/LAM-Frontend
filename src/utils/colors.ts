export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Queued':
      return 'warning';
    case 'Running':
      return 'info';
    case 'Succeeded':
      return 'success';
    case 'Failed':
      return 'error';
    case 'Cancelled':
      return 'default';
    default:
      return 'default';
  }
};