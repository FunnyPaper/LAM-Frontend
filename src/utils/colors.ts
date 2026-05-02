export const getRunStatusColor = (status: string) => {
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
        case 'Cancelling':
            return 'default';
        default:
            return 'default';
    }
};

export const getScriptVersionStateColor = (status: string) => {
    switch (status) {
        case 'Published':
            return 'success';
        case 'Archived':
            return 'error';
        case 'Draft':
            return 'info';
        default:
            return 'default';
    }
}