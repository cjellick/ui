import Ember from 'ember';
import Cattle from 'ui/utils/cattle';

var ContainerController = Cattle.TransitioningResourceController.extend({
  actions: {
    restart: function() {
      return this.doAction('restart');
    },

    start: function() {
      return this.doAction('start');
    },

    stop: function() {
      return this.doAction('stop');
    },

    delete: function() {
      return this.delete();
    },

    restore: function() {
      return this.doAction('restore');
    },

    purge: function() {
      return this.doAction('purge');
    },

    redirectTo: function(name) {
      // @TODO Fix this hackery for nested components...
      // http://emberjs.jsbin.com/mecesakase
      if ( Ember.Component.detectInstance(this.get('target')) )
      {
        this.set('target', window.l('router:main'));
      }

      this.transitionToRoute(name, this.get('id'));
    },

    shell: function() {
      this.send('redirectTo','container.shell');
    },

    logs: function() {
      this.send('redirectTo','container.logs');
    },

    edit: function() {
      this.send('redirectTo','container.edit');
    },

    promptDelete: function() {
      this.send('redirectTo','container.delete');
    },

    detail: function() {
      Ember.run.next(this, function() {
        this.send('redirectTo','container');
      });
    },
  },

  availableActions: function() {
    var a = this.get('actions');

    var choices = [
      { label: 'Edit',          icon: 'ss-write',             action: 'edit',         enabled: !!a.update },
      { label: 'View in API',   icon: 'fa fa-external-link',  action: 'goToApi',      enabled: true,            detail: true },
      { label: 'Execute Shell', icon: 'fa fa-terminal',       action: 'shell',        enabled: !!a.execute },
      { label: 'View Logs',     icon: 'ss-file',              action: 'logs',         enabled: !!a.logs },
      { label: 'Restart',       icon: 'ss-refresh',           action: 'restart',      enabled: !!a.restart },
      { label: 'Start',         icon: 'ss-play',              action: 'start',        enabled: !!a.start },
      { label: 'Stop',          icon: 'ss-stop',              action: 'stop',         enabled: !!a.stop },
      { label: 'Restore',       icon: 'ss-medicalcross',      action: 'restore',      enabled: !!a.restore },
      { label: 'Delete',        icon: 'ss-trash',             action: 'promptDelete', enabled: this.get('canDelete'), altAction: 'delete' },
      { label: 'Purge',         icon: 'ss-tornado',           action: 'purge',        enabled: !!a.purge },
    ];

    return choices;
  }.property('actions.{update,execute,restart,start,stop,restore,purge}','canDelete'),

  isOn: function() {
    return ['running','updating-running','migrating','restarting'].indexOf(this.get('state')) >= 0;
  }.property('state'),

  displayIp: function() {
    return this.get('primaryAssociatedIpAddress') || this.get('primaryIpAddress') || '(No IP Address)';
  }.property('primaryIpAddress','primaryAssociatedIpAddress'),

  canDelete: function() {
    return ['removed','removing','purging','purged'].indexOf(this.get('state')) === -1;
  }.property('state')
});

ContainerController.reopenClass({
  stateMap: {
   'running': {icon: 'ss-record',   color: 'text-success'},
   'stopped': {icon: 'fa fa-circle',color: 'text-danger'},
   'removed': {icon: 'ss-trash',    color: 'text-danger'},
   'purged':  {icon: 'ss-tornado',  color: 'text-danger'}
  },
});

export default ContainerController;
