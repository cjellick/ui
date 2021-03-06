import Cattle from 'ui/utils/cattle';
import Ember from 'ember';

var VolumeController = Cattle.TransitioningResourceController.extend({
  icon: 'ss-hdd',

  actions: {
    delete: function() {
      return this.delete();
    },

    purge: function() {
      return this.doAction('purge');
    },

    restore: function() {
      return this.doAction('restore');
    },

    promptDelete: function() {
      this.transitionToRoute('volume.delete', this.get('model'));
    },
  },

  availableActions: function() {
    var a = this.get('actions');

    return [
      { label: 'Restore',       icon: 'ss-medicalcross',  action: 'restore',      enabled: !!a.restore },
      { label: 'Delete',        icon: 'ss-trash',         action: 'promptDelete', enabled: this.get('canDelete'), altAction: 'delete' },
      { label: 'Purge',         icon: 'ss-tornado',       action: 'purge',        enabled: !!a.purge },
    ];
  }.property('actions.{restore,purge}','canDelete'),

  displayUri: function() {
    return (this.get('uri')||'').replace(/^file:\/\//,'');
  }.property('uri'),

  isRoot: Ember.computed.notEmpty('instanceId'),

  canDelete: function() {
    // Can't delete things that are already removed, or root volumes (with an instanceId)
    if ( this.get('isDeleted') || this.get('isPurged') || this.get('isRoot') )
    {
      return false;
    }

    return this.get('activeMounts.length') === 0;
  }.property('isDeleted','isPurged','isRoot','activeMounts.length'),

  activeMounts: function() {
    var mounts = this.get('mounts')||[];
    return mounts.filter(function(mount) {
      return ['removed','purged'].indexOf(mount.get('state')) === -1;
    });
  }.property('mounts.[]','mounts.@each.state')
});

VolumeController.reopenClass({
  stateMap: {
   'active':    {icon: 'ss-record',   color: 'text-success'},
   'inactive':  {icon: 'fa fa-circle',color: 'text-danger'},
   'removed':   {icon: 'ss-trash',    color: 'text-danger'},
   'purged':    {icon: 'ss-tornado',  color: 'text-danger'}
  },
});

export default VolumeController;
