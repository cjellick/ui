import Ember from 'ember';
import Cattle from 'ui/utils/cattle';
import Regions from './digitalocean_regions';

var regionChoices = Regions.regions.filter(function(region) {
  return region.available;
}).map(function(region) {
  return {
    id: region.slug,
    name: region.name,
  };
});

export default Ember.ObjectController.extend(Cattle.NewOrEditMixin, {
  needs: ['hosts/new'],
  regionChoices: regionChoices,

  sizeChoices: function() {
    var slug = this.get('digitaloceanConfig.region');
    return Regions.regions.filter(function(choice) {
      return choice.slug === slug;
    })[0].sizes.sort(function(a,b) {
      var aMb = a.indexOf('mb') >= 0;
      var bMb = b.indexOf('mb') >= 0;

      if ( aMb === bMb )
      {
        return parseInt(a,10) - parseInt(b,10);
      }
      else if ( aMb )
      {
        return -1;
      }
      else
      {
        return 1;
      }
    });
  }.property('digitaloceanConfig.region'),

  imageChoices: [
    'coreos-stable',
    'coreos-alpha',
    'coreos-beta',
    'centos-7-0-x64',
    'debian-7-0-x64',
    'fedora-21-x64',
    'ubuntu-14-04-x64',
    'ubuntu-14-10-x64',
  ],

  validate: function() {
    if ( !this._super() )
    {
      return false;
    }

    var accessToken = this.get('digitaloceanConfig.accessToken')||'';
    if ( accessToken.length === 0 )
    {
      this.controllerFor('hosts/new').set('error', "Access Token is required");
      return false;
    }

    if ( accessToken.length !== 64 )
    {
      this.controllerFor('hosts/new').set('error', "That doesn't look like a valid access token");
      return false;
    }

    return true;
  },

  doneSaving: function() {
    var out = this._super();
    this.transitionToRoute('hosts');
    return out;
  },
});
