/* global FS */
/* global Images */

FS.debug = false;

if (Meteor.settings.env !== 'dev') {
  Images = new Mongo.Collection('images'); 
} else { //is dev
  Images = new Mongo.Collection('testimages'); 
}

console.log("image");
