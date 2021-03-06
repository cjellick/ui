import AuthenticatedRouteMixin from 'ui/mixins/authenticated-route';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  actions: {
    newProject: function() {
      this.transitionTo('projects.new');
    }
  },

  model: function() {
    return this.get('store').findAll('project');
  },

  activate: function() {
    this.send('setPageLayout', {label: 'Manage Projects'});
  },
});
