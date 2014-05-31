UI.registerHelper('formatDate', function(unformattedDate) {
    return moment(unformattedDate).format('MMMM DD YYYY');
});
