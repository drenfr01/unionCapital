/* global migrateCategories:true */
/* global EventCategories */
/* global getInitialCategoryData */

migrateCategories = function() {
  EventCategories.remove({});
  const newCategories = getInitialCategoryData()
  newCategories.forEach(function(cat) {
    EventCategories.insert(cat);
  });
}
